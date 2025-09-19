var mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  name: String,
  empId: String,
  dept: String,
  email: String,
  image: Buffer,
  password: String
});

const Tutor = mongoose.model('Tutor', tutorSchema);
module.exports = Tutor;