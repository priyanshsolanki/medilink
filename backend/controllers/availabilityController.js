const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');
const Doctor = require('../models/User');
const auth = require('../middlewares/auth');

// Helper function to generate 30-minute slots
function getTimeSlots(startTime, endTime) {
    const slots = [];
    let [h, m] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    while (h < endH || (h === endH && m < endM)) {
        slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
        m += 30;
        if (m >= 60) { m -= 60; h += 1; }
    }
    return slots;
}

// Check for overlapping time slots
function hasConflict(newDate, newStartTime, newEndTime, existingSlots) {
    const newSlots = getTimeSlots(newStartTime, newEndTime);
    return existingSlots.some(({ date, startTime, endTime }) =>
        date.toISOString().split('T')[0] === newDate &&
        getTimeSlots(startTime, endTime).some(slot => newSlots.includes(slot))
    );
}

/**
 * GET /api/availability
 * Returns every doctor plus their upcoming 30-minute availability slots grouped by date for the next 7 days.
 */
router.get('/', auth, async (req, res) => {
    try {
        const doctors = await Doctor
            .find({ role: 'doctor' })
            .select('name specialty rating experience location image fee')
            .lean();

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        const sevenDaysLater = new Date(today);
        sevenDaysLater.setDate(today.getDate() + 7);

        const availEntries = await Availability
            .find({
                date: { $gte: today, $lt: sevenDaysLater }
            })
            .sort({ date: 1 })
            .lean();

        const availabilityMap = {};
        availEntries.forEach(({ doctorId, date, startTime, endTime }) => {
            const docKey = doctorId.toString();
            const dateKey = date.toISOString().split('T')[0];
            if (!availabilityMap[docKey]) availabilityMap[docKey] = {};
            if (!availabilityMap[docKey][dateKey]) availabilityMap[docKey][dateKey] = [];

            const slots = getTimeSlots(startTime, endTime);
            availabilityMap[docKey][dateKey] = slots;
        });

        const result = doctors.map(doc => ({
            id: doc._id,
            name: doc.name,
            specialty: doc.specialty,
            rating: doc.rating,
            experience: doc.experience,
            location: doc.location,
            image: doc.image,
            fee: doc.fee,
            availability: availabilityMap[doc._id.toString()] || {}
        }));

        res.json(result);
    } catch (error) {
        console.error('Error fetching doctors with availability', error);
        res.status(500).json({ message: 'Error fetching availability' });
    }
});

/**
 * GET /api/doctors/:doctorId/availability
 * Returns availability grouped by date with each slot's id and times
 */
router.get('/:doctorId', auth, async (req, res) => {
    try {
      const { doctorId } = req.params;
  
      // Calculate date window
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sevenDaysLater = new Date(today);
      sevenDaysLater.setDate(today.getDate() + 7);
  
      // Fetch raw availability entries
      const slots = await Availability.find({
        doctorId,
        date: { $gte: today, $lt: sevenDaysLater }
      })
        .sort({ date: 1 })
        .lean();
  
      // Group by date
      const grouped = {};
      slots.forEach(({ _id, date, startTime, endTime }) => {
        const dateKey = date.toISOString().split('T')[0];
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push({
          availabilityId: _id,
          startTime,
          endTime
        });
      });
  
      res.json({ doctorId, availability: grouped });
    } catch (error) {
      console.error('Error fetching doctor availability', error);
      res.status(500).json({ message: 'Error fetching doctor availability' });
    }
  });  

router.post('/', auth, async (req, res) => {
    try {
        const { doctorId, startTime, endTime, isRecurring, date } = req.body;
        const doctor = await Doctor.findById(doctorId);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(403).json({ message: 'Unauthorized or invalid doctor' });
        }
        if (req.user.id !== doctorId) {
            return res.status(403).json({ message: 'Only the doctor can set their availability' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        const inputDate = new Date(date);
        inputDate.setHours(0, 0, 0, 0); // Normalize date
        if (inputDate < today) {
            return res.status(400).json({ message: 'Cannot set availability for past dates' });
        }

        // Check for existing availability on the same date
        const existingSlots = await Availability.find({ doctorId, date: inputDate });
        if (hasConflict(date, startTime, endTime, existingSlots)) {
            return res.status(409).json({ message: 'Conflicting availability detected' });
        }

        const availability = new Availability({ doctorId, date, startTime, endTime, isRecurring });
        await availability.save();
        res.status(201).json(availability);
    } catch (error) {
        console.error('Error creating availability', error);
        res.status(500).json({ message: 'Error creating availability' });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { startTime, endTime, isRecurring, date } = req.body;
        const availability = await Availability.findById(id);
        if (!availability) return res.status(404).json({ message: 'Availability slot not found' });
        if (availability.doctorId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to update this slot' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        const inputDate = new Date(date || availability.date);
        inputDate.setHours(0, 0, 0, 0); // Normalize date
        if (inputDate < today) {
            return res.status(400).json({ message: 'Cannot update availability for past dates' });
        }

        // Check for existing availability on the same date (excluding the current slot)
        const existingSlots = await Availability.find({
            doctorId: availability.doctorId,
            _id: { $ne: id },
            date: inputDate
        });
        if (hasConflict(date || availability.date, startTime || availability.startTime, endTime || availability.endTime, existingSlots)) {
            return res.status(409).json({ message: 'Conflicting availability detected' });
        }

        availability.startTime = startTime || availability.startTime;
        availability.endTime = endTime || availability.endTime;
        availability.isRecurring = isRecurring !== undefined ? isRecurring : availability.isRecurring;
        availability.date = date || availability.date;
        await availability.save();
        res.json(availability);
    } catch (error) {
        console.error('Error updating availability', error);
        res.status(500).json({ message: 'Error updating availability' });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
      const { id } = req.params;
      const availability = await Availability.findById(id);
      if (!availability) return res.status(404).json({ message: 'Availability slot not found' });
      if (availability.doctorId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized to delete this slot' });
      }
  
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today
      const availabilityDate = new Date(availability.date);
      availabilityDate.setHours(0, 0, 0, 0);
      if (availabilityDate < today) {
        return res.status(400).json({ message: 'Cannot delete availability for past dates' });
      }
  
      // Use deleteOne() instead of remove()
      await availability.deleteOne();
      // Or: await Availability.findByIdAndDelete(id);
  
      res.json({ message: 'Availability slot deleted successfully' });
    } catch (error) {
      console.error('Error deleting availability', error);
      res.status(500).json({ message: 'Error deleting availability' });
    }
  });
  
module.exports = router;