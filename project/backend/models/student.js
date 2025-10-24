// student.js
var mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
   name: String,
   admNo: Number,
   dept: String,
   sem: Number,
   tutorName: String,
   email: String,
   image: Buffer,
   parent_No: Number,
   password: String,
   phone: Number,
   purpose: String,
   date: Date,
   returnTime: String,
   verified: { type: Boolean, default: false },
   groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'GatePass', default: null } // <-- new
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
