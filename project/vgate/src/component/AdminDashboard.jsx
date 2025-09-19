import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [gatePasses, setGatePasses] = useState([]);
  const [activeTab, setActiveTab] = useState('students');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsRes = await axios.get('http://localhost:5000/admin/students');
        setStudents(studentsRes.data);
        
        const passesRes = await axios.get('http://localhost:5000/admin/gate-passes');
        setGatePasses(passesRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    
    fetchData();
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'students' ? 'active' : ''}
          onClick={() => setActiveTab('students')}
        >
          Registered Students
        </button>
        <button 
          className={activeTab === 'gatepasses' ? 'active' : ''}
          onClick={() => setActiveTab('gatepasses')}
        >
          Gate Pass Requests
        </button>
      </div>
      
      <div className="admin-content">
        {activeTab === 'students' ? (
          <div className="students-table">
            <h2>Registered Students</h2>
            <table>
              <thead>
                <tr>
                  <th>Adm No</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Semester</th>
                  <th>Tutor</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student._id}>
                    <td>{student.admNo}</td>
                    <td>{student.name}</td>
                    <td>{student.dept}</td>
                    <td>{student.sem}</td>
                    <td>{student.tutorName}</td>
                    <td>{student.email}</td>
                    <td>{student.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="gatepasses-table">
            <h2>Gate Pass Requests</h2>
            <table>
              <thead>
                <tr>
                  <th>Adm No</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Purpose</th>
                  <th>Date/Time</th>
                  <th>Return Time</th>
                </tr>
              </thead>
              <tbody>
                {gatePasses.map(pass => (
                  <tr key={pass._id}>
                    <td>{pass.admNo}</td>
                    <td>{pass.name}</td>
                    <td>{pass.dept}</td>
                    <td>{pass.purpose}</td>
                    <td>{new Date(pass.date).toLocaleString()}</td>
                    <td>{pass.returnTime || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;