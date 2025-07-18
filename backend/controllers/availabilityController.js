const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');
const Doctor = require('../models/User');

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