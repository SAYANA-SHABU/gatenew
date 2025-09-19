import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './TutorDashboard.css';

function TutorDashboard({ tutor, onLogout }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [pendingPasses, setPendingPasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (tutor) {
      const fetchData = async () => {
        try {
          // Fetch students under this tutor
          const studentsRes = await axios.get(`http://localhost:5000/tutor/${tutor._id}/students`);
          setStudents(studentsRes.data);
          
          // Fetch pending gate passes (you'll need to implement this endpoint)
          const passesRes = await axios.get(`http://localhost:5000/tutor/${tutor._id}/pending-passes`);
          setPendingPasses(passesRes.data);
          
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
  }, [tutor]);

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/');
  };

  const handleApprovePass = async (passId) => {
    try {
      await axios.post(`http://localhost:5000/tutor/gatepass/${passId}/approve`, {
        status: 'approved'
      });
      
      // Update local state
      setPendingPasses(pendingPasses.filter(pass => pass._id !== passId));
    } catch (error) {
      console.error('Error approving pass:', error);
    }
  };

  const handleRejectPass = async (passId) => {
    try {
      await axios.post(`http://localhost:5000/tutor/gatepass/${passId}/approve`, {
        status: 'rejected'
      });
      
      // Update local state
      setPendingPasses(pendingPasses.filter(pass => pass._id !== passId));
    } catch (error) {
      console.error('Error rejecting pass:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!tutor) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading tutor data...</p>
      </div>
    );
  }

  return (
    <div className="tutor-dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="user-info">
            <div className="avatar">
              {tutor.image && (
                <img 
                  src={`data:image/jpeg;base64,${tutor.image.toString('base64')}`} 
                  alt="Tutor" 
                />
              )}
            </div>
            <div>
              <h2 className="welcome-message">Welcome, {tutor.name}</h2>
              <p className="tutor-id">{tutor.empId} | {tutor.dept}</p>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <i className="icon-logout"></i> Logout
          </button>
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Pending Approvals</h3>
            <div className="stats-badge">
              {pendingPasses.length} pending
            </div>
          </div>
          
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading pending passes...</p>
            </div>
          ) : pendingPasses.length === 0 ? (
            <div className="empty-state">
              <i className="icon-check"></i>
              <p>No pending gate passes</p>
            </div>
          ) : (
            <div className="passes-grid">
              {pendingPasses.map(pass => (
                <div key={pass._id} className="pass-card pending">
                  <div className="pass-header">
                    <div className="pass-id">#{pass._id.slice(-6)}</div>
                    <span className="status-badge pending">
                      pending
                    </span>
                  </div>
                  
                  <div className="pass-details">
                    <div className="detail-row">
                      <i className="icon-student"></i>
                      <p>{pass.studentName} ({pass.studentAdmNo})</p>
                    </div>
                    
                    <div className="detail-row">
                      <i className="icon-purpose"></i>
                      <p>{pass.purpose}</p>
                    </div>
                    
                    <div className="detail-row">
                      <i className="icon-date"></i>
                      <p>{formatDate(pass.date)}</p>
                    </div>
                    
                    {pass.returnTime && (
                      <div className="detail-row">
                        <i className="icon-time"></i>
                        <p>Return by: {pass.returnTime}</p>
                      </div>
                    )}
                    
                    {pass.groupMembers && pass.groupMembers.length > 0 && (
                      <div className="group-members">
                        <div className="detail-row">
                          <i className="icon-group"></i>
                          <p>Group Members:</p>
                        </div>
                        <ul>
                          {pass.groupMembers.map((member, index) => (
                            <li key={index}>
                              {member.name} ({member.admissionNo})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="pass-actions">
                    <button 
                      className="approve-btn"
                      onClick={() => handleApprovePass(pass._id)}
                    >
                      Approve
                    </button>
                    <button 
                      className="reject-btn"
                      onClick={() => handleRejectPass(pass._id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h3>Your Students</h3>
            <div className="stats-badge">
              {students.length} student{students.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="empty-state">
              <i className="icon-students"></i>
              <p>No students assigned</p>
            </div>
          ) : (
            <div className="students-grid">
              {students.map(student => (
                <div key={student._id} className="student-card">
                  <div className="student-header">
                    <div className="student-avatar">
                      {student.image && (
                        <img 
                          src={`data:image/jpeg;base64,${Buffer.from(student.image).toString('base64')}`} 
                          alt={student.name} 
                        />
                      )}
                    </div>
                    <div className="student-info">
                      <h4>{student.name}</h4>
                      <p>{student.admNo} | Sem {student.sem}</p>
                    </div>
                  </div>
                  <div className="student-details">
                    <p><i className="icon-phone"></i> {student.phone}</p>
                    <p><i className="icon-email"></i> {student.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default TutorDashboard;