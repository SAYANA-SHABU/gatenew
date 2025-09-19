import React, { useState } from 'react';
import axios from 'axios';
import "./Login.css"; 
import { useNavigate } from 'react-router-dom';

function Login({ onStudentLogin, onTutorLogin }) {
  const [credentials, setCredentials] = useState({
    id: '',
    password: '',
    userType: 'student' // Default to student login
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      let response;
      
      if (credentials.userType === 'student') {
        // Student login
        response = await axios.post('http://localhost:5000/login', {
          admNo: credentials.id,
          password: credentials.password
        });
        
        if (onStudentLogin) onStudentLogin(response.data.student);
        navigate(`/student/${response.data.student._id}`);
      } else {
        // Tutor login
        response = await axios.post('http://localhost:5000/tutor/login', {
          empId: credentials.id,
          password: credentials.password
        });
        
        if (onTutorLogin) onTutorLogin(response.data.tutor);
        navigate(`/tutor/${response.data.tutor._id}`);
      }
      
      alert('Login successful');
    } catch (e) {
      alert('Login failed: ' + (e.response?.data?.message || e.message));
    }
  };

  return (
    <div id="login-container">
      <h3 id="login-title">Login</h3>
      
      <div className="user-type-toggle">
        <button
          type="button"
          className={`toggle-btn ${credentials.userType === 'student' ? 'active' : ''}`}
          onClick={() => setCredentials({...credentials, userType: 'student'})}
        >
          Student
        </button>
        <button
          type="button"
          className={`toggle-btn ${credentials.userType === 'tutor' ? 'active' : ''}`}
          onClick={() => setCredentials({...credentials, userType: 'tutor'})}
        >
          Tutor
        </button>
      </div>
      
      <input
        id="login-id"
        type="text"
        name="id"
        value={credentials.id}
        onChange={handleChange}
        placeholder={credentials.userType === 'student' ? 'Admission Number' : 'Employee ID'}
      />
      <input
        id="login-password"
        type="password"
        name="password"
        value={credentials.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button id="login-submit" onClick={handleLogin}>Login</button>
      
      <div className="login-footer">
        {credentials.userType === 'student' ? (
          <p>
            Don't have an account? <a href="/r">Register Here</a>
          </p>
        ) : (
          <p>
            Tutor registration? <a href="/tutor/register">Register Here</a>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;