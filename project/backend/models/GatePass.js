const mongoose = require('mongoose');

const gatePassSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  purpose: { type: String, required: true },
  date: { type: Date, required: true },
  groupMembers: [{
    name: String,
    admissionNo: String,
    dept: String
  }],
  returnTime: String,
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'approved' 
  },
  createdAt: { type: Date, default: Date.now }
});

const GatePass = mongoose.model('GatePass', gatePassSchema);
module.exports = GatePass;