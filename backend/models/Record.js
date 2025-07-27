const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
    patientId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type:          { type: String, required: true },
    title:         { type: String, required: true },
    fileUrl:       { type: String, required: true },
    notes:         String,
    data:          mongoose.Schema.Types.Mixed,
  
    uploadedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted:     { type: Boolean, default: false },
    deletedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedAt:     { type: Date }
  }, { timestamps: true });

  // --- Add index for fast queries by patient ---
RecordSchema.index({ patientId: 1, createdAt: -1 }); 

  
  module.exports = mongoose.model('Record', RecordSchema);
  