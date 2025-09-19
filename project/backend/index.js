const express = require("express")
const app = express()
const QRCode = require('qrcode');
app.use(express.json());
const Student = require('./models/student'); // Make sure this path is correct
const Tutor = require('./models/tutor');
var cors = require('cors')
app.use(cors());
const multer = require('multer');
const bcrypt = require('bcryptjs');
const connectDB = require('./connection')
connectDB

const storage = multer.memoryStorage(); // Or use diskStorage if saving to disk
const upload = multer({ storage });

app.post('/register', upload.single('image'), async (req, res) => {
  try {
    const { admNo, name, dept, sem, tutorName, phone, email, password } = req.body;
    if (!req.body.admNo || !req.body.name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const student = new Student({
      admNo,
      name,
      dept,
      sem,
      tutorName,
      phone,
      email,
      password,
      image: req.file ? req.file.buffer : undefined, // Save as Buffer
    });

    await student.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const admNo = Number(req.body.admNo);
  const { password } = req.body;
  console.log("Login attempt with:", admNo, password);

  const student = await Student.findOne({ admNo, password });
  if (student) {
    res.send({ message: 'Login successful', student });
  } else {
    res.status(401).send({ message: 'Invalid credentials' });
  }
});

// Form fill route (purpose + date)
app.post('/form-fill/:id', async (req, res) => {
  const { id } = req.params;
  const { purpose, date, returnTime } = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { purpose, date, returnTime },
      { new: true } // Return the updated document
    );

    if (!updatedStudent) {
      return res.status(404).send({ message: 'Student not found' });
    }

    res.send({
      message: 'Form updated successfully',
      student: updatedStudent
    });
  } catch (error) {
    console.error('Form update error:', error);
    res.status(500).send({
      message: 'Form update failed',
      error: error.message
    });
  }
});

// QR Code generation route - UPDATED
app.post('/generate-qr/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).send({ message: 'Student not found' });
    }
    
    // Convert image buffer to base64 if exists
    let imageBase64 = null;
    if (student.image) {
      imageBase64 = student.image.toString('base64');
    }
    
    // Create student data object for QR code
    const studentData = {
      name: student.name,
      admNo: student.admNo,
      dept: student.dept,
      sem: student.sem,
      purpose: student.purpose,
      date: student.date,
      returnTime: student.returnTime,
      image: imageBase64
    };
    
    // Stringify the data for QR code
    const qrData = JSON.stringify(studentData);
    
    // Generate QR code
    const qrImage = await QRCode.toDataURL(qrData);
    
    res.send({ 
      qrImage,
      studentData // Optional: send the data directly too
    });
  } catch (error) {
    console.error('QR generation error:', error);
    res.status(500).send({ message: 'QR generation failed', error: error.message });
  }
});

// Get student by ID
app.get('/student/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).send({ message: 'Student not found' });
    }
    res.send(student);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching student', error });
  }
});

// Create new gate pass
app.post('/gatepasses', async (req, res) => {
  try {
    const { studentId, purpose, date, groupMembers, returnTime } = req.body;
    
    // Create pass
    const gatePass = new GatePass({
      studentId,
      purpose,
      date,
      groupMembers,
      returnTime,
      status: 'approved'
    });
    
    await gatePass.save();
    
    res.send({ 
      message: 'Gate pass created successfully',
      pass: gatePass
    });
  } catch (error) {
    console.error('Gate pass creation error:', error);
    res.status(500).send({ message: 'Failed to create gate pass', error });
  }
});

// Tutor registration route
app.post('/tutor/register', upload.single('image'), async (req, res) => {
  try {
    const { empId, name, dept, email, password } = req.body;

    const tutor = new Tutor({
      empId,
      name,
      dept,
      email,
      password,
      image: req.file ? req.file.buffer : undefined,
    });

    await tutor.save();
    res.send({ message: 'Tutor registered successfully' });
  } catch (error) {
    console.error('Tutor registration error:', error);
    res.status(500).send({ message: 'Tutor registration failed', error });
  }
});

// Tutor login route
app.post('/tutor/login', async (req, res) => {
  const { empId, password } = req.body;
  console.log("Tutor login attempt with:", empId, password);

  const tutor = await Tutor.findOne({ empId, password });
  if (tutor) {
    res.send({ message: 'Login successful', tutor });
  } else {
    res.status(401).send({ message: 'Invalid credentials' });
  }
});

// Get tutor by ID
app.get('/tutor/:id', async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) {
      return res.status(404).send({ message: 'Tutor not found' });
    }
    res.send(tutor);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching tutor', error });
  }
});

// Get students under a tutor
app.get('/tutor/:id/students', async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) {
      return res.status(404).send({ message: 'Tutor not found' });
    }
    
    const students = await Student.find({ tutorName: tutor.name });
    res.send(students);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching students', error });
  }
});

// Approve/reject gate pass
app.post('/tutor/gatepass/:id/approve', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedPass = await GatePass.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    res.send({ 
      message: 'Gate pass updated successfully',
      gatePass: updatedPass
    });
  } catch (error) {
    res.status(500).send({ message: 'Error updating gate pass', error });
  }
});

// Get pending gate passes for a tutor's students
app.get('/tutor/:id/pending-passes', async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) {
      return res.status(404).send({ message: 'Tutor not found' });
    }
    
    // Find all students with this tutor
    const students = await Student.find({ tutorName: tutor.name });
    const studentIds = students.map(s => s._id);
    
    // Find pending passes for these students
    const passes = await GatePass.find({ 
      studentId: { $in: studentIds },
      status: 'pending'
    }).populate('studentId', 'name admNo');
    
    // Format the response
    res.json(passes.map(pass => ({
      ...pass._doc,
      studentName: pass.studentId.name,
      studentAdmNo: pass.studentId.admNo
    })));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message
    });
  }
});

// Admin login route
app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Hardcoded admin credentials (in production, store in database with hashed password)
  if (username === 'admin' && password === '12345') {
    res.send({ message: 'Admin login successful' });
  } else {
    res.status(401).send({ message: 'Invalid admin credentials' });
  }
});

// Get all students route
app.get('/admin/students', async (req, res) => {
  try {
    const students = await Student.find({});
    res.send(students);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching students', error });
  }
});

// Get all gate pass requests
app.get('/admin/gate-passes', async (req, res) => {
  try {
    const passes = await Student.find({ 
      purpose: { $exists: true, $ne: null },
      date: { $exists: true, $ne: null }
    });
    res.send(passes);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching gate passes', error });
  }
});

app.listen(5000, () => {
  console.log("Port is running ")
});