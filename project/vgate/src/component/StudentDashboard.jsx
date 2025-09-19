// src/components/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './StudentDashboard.css';
import { useLocation } from 'react-router-dom';
function StudentDashboard({ student, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { id } = useParams();
  const [gatePasses, setGatePasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
 useEffect(() => {
    if (location.state?.newPass) {
      setGatePasses(prevPasses => [location.state.newPass, ...prevPasses]);
      // Clear navigation state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  useEffect(() => {
    if (student) {
      const fetchPasses = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/gatepasses/${student._id}`);
          setGatePasses(res.data);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching gate passes:', error);
          setIsLoading(false);
        }
      };
      
      fetchPasses();
    }
  }, [student]);

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/');
  };

  const handleGetPass = () => {
    navigate(`/pass/${student._id}`);
  };

  const addPassToHistory = (newPass) => {
    setGatePasses([newPass, ...gatePasses]);
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

  if (!student) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading student data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="user-info">
            <div className="avatar">
              {student.image && (
                  <img 
                       src={`data:image/jpeg;base64,${Buffer.from(student.image).toString('base64')}`}
                       alt="Student"
                   />
              )}
            </div>
            <div>
              <h2 className="welcome-message">{student.name}</h2>
              <p className="student-id">{student.admissionNo} | {student.dept}</p>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <i className="icon-logout"></i> Logout
          </button>
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="dashboard-actions">
          <button className="primary-button" onClick={handleGetPass}>
            <i className="icon-pass"></i> Get New Gate Pass
          </button>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h3>Gate Pass History</h3>
            <div className="stats-badge">
              {gatePasses.length} pass{gatePasses.length !== 1 ? 'es' : ''}
            </div>
          </div>
          
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading gate passes...</p>
            </div>
          ) : gatePasses.length === 0 ? (
            <div className="empty-state">
              <i className="icon-history"></i>
              <p>No gate passes found</p>
              
            </div>
          ) : (
            <div className="passes-grid">
              {gatePasses.map(pass => (
                <div key={pass._id} className={`pass-card ${pass.status}`}>
                  <div className="pass-header">
                    <div className="pass-id">#{pass._id.slice(-6)}</div>
                    <span className={`status-badge ${pass.status}`}>
                      {pass.status}
                    </span>
                  </div>
                  
                  <div className="pass-details">
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
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;