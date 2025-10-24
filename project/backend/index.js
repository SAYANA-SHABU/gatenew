const express = require("express")
const app = express()
const QRCode = require('qrcode');
app.use(express.json());
const Student = require('./models/student'); // Make sure this path is correct
const Tutor = require('./models/Tutor');
const GatePass = require("./models/Gatepass");
var cors = require('cors')
app.use(cors());
const multer = require('multer');
const bcrypt = require('bcryptjs');
const connectDB = require('./connection');
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
  const { id } = req.params; // main student id
  const { purpose, date, returnTime, groupMembers } = req.body;

  try {
    const mainStudent = await Student.findById(id);
    if (!mainStudent) return res.status(404).json({ message: 'Main student not found' });

    // create gate pass record (store purpose/date/returnTime/groupMembers here)
    const gp = new GatePass({
      studentId: mainStudent._id,
      purpose,
      date,
      returnTime,
      groupMembers: groupMembers || [],
      status: 'approved'
    });
    await gp.save();

    // set groupId for main student
    mainStudent.groupId = gp._id;
    mainStudent.purpose = purpose;
    mainStudent.date = date;
    mainStudent.returnTime = returnTime;
    await mainStudent.save();

    // for each member in groupMembers (submitted from frontend),
    // if a Student with that admNo exists, set its groupId; else optionally create placeholder
    if (groupMembers && groupMembers.length) {
      for (const member of groupMembers) {
        const existing = await Student.findOne({ admNo: member.admissionNo || member.admNo || member.admNo });
        if (existing) {
          existing.groupId = gp._id;
          await existing.save();
        } else {
          // optional: create placeholder student record so verification page can show name/admNo/dept consistently
          await Student.create({
            name: member.name || 'Unknown',
            admNo: Number(member.admissionNo || member.admNo || 0),
            dept: member.dept || '',
            groupId: gp._id
          });
        }
      }
    }

    return res.status(200).json({ message: 'GatePass created', gatePass: gp, student: mainStudent });
  } catch (err) {
    console.error('form-fill error', err);
    return res.status(500).json({ message: 'Form fill failed', error: err.message });
  }
});




app.post("/generate-qr/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);

    if (!student) return res.status(404).json({ message: "Student not found" });

    const verifyUrl = `http://localhost:5000/gatepass/${studentId}`;
    const qrImage = await QRCode.toDataURL(verifyUrl);

    res.json({ qrImage, studentData: student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "QR generation failed" });
  }
});





app.get('/gatepass/:studentId', async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).send('<h2>Student not found</h2>');

    // Find gatepass: prefer student's groupId, else a gatepass created by this student
    let gatePass = null;
    if (student.groupId) {
      gatePass = await GatePass.findById(student.groupId);
    }
    if (!gatePass) {
      gatePass = await GatePass.findOne({ studentId: student._id });
    }
    if (!gatePass) {
      gatePass = {
        _id: null,
        purpose: student.purpose || 'N/A',
        date: student.date || null,
        returnTime: student.returnTime || null,
        groupMembers: []
      };
    }

    // Build members list
    const members = [];
    members.push({
      _id: student._id,
      name: student.name,
      admNo: student.admNo,
      dept: student.dept,
      sem: student.sem,
      image: student.image ? `data:image/jpeg;base64,${student.image.toString('base64')}` : null,
      verified: false
    });

    for (const gm of gatePass.groupMembers || []) {
      const admNo = gm.admissionNo || gm.admNo || gm.adm;
      let memberDoc = null;
      if (admNo) memberDoc = await Student.findOne({ admNo: Number(admNo) });

      members.push({
        _id: memberDoc ? memberDoc._id : ('new-' + (admNo || gm.name)),
        name: gm.name || (memberDoc && memberDoc.name) || 'Unknown',
        admNo: admNo || (memberDoc && memberDoc.admNo) || '',
        dept: gm.dept || (memberDoc && memberDoc.dept) || '',
        sem: (memberDoc && memberDoc.sem) || gm.sem || '-',
        image: memberDoc && memberDoc.image ? `data:image/jpeg;base64,${memberDoc.image.toString('base64')}` : null,
        verified: false // Always false on page load
      });
    }

    // Build table rows with checkboxes
    const tableRows = members.map(m => `
      <tr>
        <td><img src="${m.image || 'https://via.placeholder.com/50'}" style="width:50px;height:50px;border-radius:4px;object-fit:cover;"></td>
        <td>${m.name}</td>
        <td>${m.admNo}</td>
        <td>${m.dept}</td>
        <td>${m.sem}</td>
        <td>${gatePass.purpose || 'N/A'}</td>
        <td>${gatePass.date ? new Date(gatePass.date).toLocaleString() : 'N/A'}</td>
        <td>${gatePass.returnTime || 'N/A'}</td>
        <td>
          <input type="checkbox" 
                 id="verify-${m._id}" 
                 name="verify-${m._id}" 
                 data-student-id="${m._id}" 
                 autocomplete="off">
        </td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Gate Pass Verification</title>
        <style>
          body{font-family:Arial;background:#f0f4f8;padding:30px;display:flex;justify-content:center}
          .container{background:#fff;padding:25px;border-radius:12px;box-shadow:0 5px 20px rgba(0,0,0,0.15);max-width:1200px;width:100%}
          table{width:100%;border-collapse:collapse}
          th,td{padding:10px;text-align:left;border-bottom:1px solid #ddd}
          th{background:#f8f9fa}
          img{display:block}
          button{padding:10px 20px;border:none;background:#3498db;color:#fff;border-radius:6px;cursor:pointer;margin-top:15px}
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Gate Pass Verification</h2>
          <p><strong>Purpose:</strong> ${gatePass.purpose || 'N/A'}</p>
          <p><strong>Date:</strong> ${gatePass.date ? new Date(gatePass.date).toLocaleString() : 'N/A'}</p>
          <p><strong>Return Time:</strong> ${gatePass.returnTime || 'N/A'}</p>

          <table>
            <thead>
              <tr>
                <th>Photo</th><th>Name</th><th>Admission No</th><th>Department</th><th>Semester</th><th>Purpose</th><th>Date</th><th>Return Time</th><th>Verified</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>

          <button id="submitBtn">Submit Verifications</button>
        </div>

        <script>
          document.getElementById('submitBtn').addEventListener('click', async () => {
            const verifiedIds = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.dataset.studentId);
            if (!verifiedIds.length) return alert('Select at least one student to verify');
            try {
              const res = await fetch('http://localhost:5000/verify-students', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({ studentIds: verifiedIds })
              });
              if (res.ok) { 
                alert('Students verified successfully'); 
                location.reload(); 
              } else { 
                alert('Verification failed'); 
              }
            } catch (err) { 
              alert('Server error'); 
            }
          });
        </script>
      </body>
      </html>
    `;
    res.send(html);

  } catch (err) {
    console.error(err);
    res.status(500).send('<h2>Server Error</h2>');
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





app.post('/verify-students', async (req, res) => {
  const { studentIds } = req.body;
  try {
    await Student.updateMany(
      { _id: { $in: studentIds } },
      { verified: true }
    );
    res.status(200).json({ message: 'Students verified successfully' });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Verification failed', error: error.message });
  }
});




app.listen(5000, () => {
  console.log("Port is running ")
});
