const { generateAccessToken } = require('../config/twilioConfig');
const Appointment = require('../models/Appointment');

exports.getVideoToken = async (req, res) => {
  const { appointmentId } = req.params;
  const user = req.user;

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

  const isPatient = appointment.patientId.toString() === user.id;
  const isDoctor = appointment.doctorId.toString() === user.id;

  if (!(isPatient || isDoctor || user.role === 'admin')) {
    return res.status(403).json({ message: 'Access denied' });
  }

  const roomName = `room_${appointment._id}`;
  const token = generateAccessToken(user.name, roomName);

  return res.json({ roomName, token });
};
