const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');
const Doctor = require('../models/User');

/**
 * GET /api/availability
 * Returns every doctor plus their upcoming 30-minute availability slots grouped by date.
 */
router.get('/', async (req, res) => {
    try {
      // 1. Load all doctors
      const doctors = await Doctor
        .find({ role: 'doctor' })
        .select('name specialty rating experience location image fee')
        .lean();
  
      // 2. Load all future availability entries
      const today = new Date();
      const availEntries = await Availability
        .find()
        .sort({ date: 1 })
        .lean();
  
      // 3. Build a map: doctorId → { dateString: [ '09:00', '09:30', … ] }
      const availabilityMap = {};
      availEntries.forEach(({ doctorId, date, startTime, endTime }) => {
        const docKey = doctorId.toString();
        const dateKey = date.toISOString().split('T')[0];
        if (!availabilityMap[docKey]) availabilityMap[docKey] = {};
        if (!availabilityMap[docKey][dateKey]) availabilityMap[docKey][dateKey] = [];
  
        // generate 30-minute slots
        let [h, m] = startTime.split(':').map(Number);
        const [endH, endM] = endTime.split(':').map(Number);
        while (h < endH || (h === endH && m < endM)) {
          const slot = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
          availabilityMap[docKey][dateKey].push(slot);
          m += 30;
          if (m >= 60) { m -= 60; h += 1; }
        }
      });
  
      // 4. Merge into final payload
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
 * GET /api/availability/:doctorId
 * Returns all availability slots for a specific doctor, grouped by date
 */
router.get(
    '/:doctorId',
    async (req, res) => {
      try {
        const { doctorId } = req.params;
  
        // Fetch all availability entries for this doctor
        const slots = await Availability.find({ doctorId })
          .sort({ date: 1 })
          .lean();
  
        // Group slots by date into 30-minute increments
        const grouped = {};
        slots.forEach(({ date, startTime, endTime }) => {
          const dateKey = date.toISOString().split('T')[0];
          grouped[dateKey] = grouped[dateKey] || [];
  
          let [h, m] = startTime.split(':').map(Number);
          const [endH, endM] = endTime.split(':').map(Number);
          while (h < endH || (h === endH && m < endM)) {
            grouped[dateKey].push(
              `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
            );
            m += 30;
            if (m >= 60) { m -= 60; h += 1; }
          }
        });
  
        res.json({ doctorId, availability: grouped });
      } catch (error) {
        console.error('Error fetching doctor availability', error);
        res.status(500).json({ message: 'Error fetching doctor availability' });
      }
    }
  );
  
router.post('/', async (req, res) => {
    try {
        const { doctorId, startTime, endTime, isRecurring, date } = req.body;
        const doctor = await Doctor.findById(doctorId);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(403).json({ message: 'Unauthorized or invalid doctor' });
        }
        const availability = new Availability({ doctorId, date, startTime, endTime, isRecurring });
        await availability.save();
        res.status(201).json(availability);
    } catch (error) {
        res.status(500).json({ message: 'Error creating availability', error });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { startTime, endTime, isRecurring, date } = req.body;
        const availability = await Availability.findById(id);
        if (!availability) return res.status(404).json({ message: 'Availability slot not found' });
        if (availability.doctorId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to update this slot' });
        }
        availability.startTime = startTime || availability.startTime;
        availability.endTime = endTime || availability.endTime;
        availability.isRecurring = isRecurring !== undefined ? isRecurring : availability.isRecurring;
        availability.date = date || availability.date;
        await availability.save();
        res.json(availability);
    } catch (error) {
        res.status(500).json({ message: 'Error updating availability', error });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const availability = await Availability.findById(id);
        if (!availability) return res.status(404).json({ message: 'Availability slot not found' });
        if (availability.doctorId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to delete this slot' });
        }
        await availability.remove();
        res.json({ message: 'Availability slot deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting availability', error });
    }
});

module.exports = router;