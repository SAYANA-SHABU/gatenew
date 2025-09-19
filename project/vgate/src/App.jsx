import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import RegisterForm from './component/RegisterForm';
import TutorRegisterForm from './component/TutorRegisterForm';
import About from './component/About';
import Header from './component/Header';
import Layout from './component/Layout';
import Footer from './component/Footer';
import Login from './component/Login';
import AdminLogin from './component/AdminLogin';
import AdminDashboard from './component/AdminDashboard';
import GatePassForm from './component/GatepassForm';
import StudentDashboard from './component/StudentDashboard';
import TutorDashboard from './component/TutorDashboard';

function App() {
  const [currentStudent, setCurrentStudent] = useState(null);
  const [currentTutor, setCurrentTutor] = useState(null);

  const handleStudentLogin = (student) => {
    setCurrentStudent(student);
  };

  const handleTutorLogin = (tutor) => {
    setCurrentTutor(tutor);
  };

  const handleLogout = () => {
    setCurrentStudent(null);
    setCurrentTutor(null);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <>
              <Header />
              <Layout />
              <About />
              <Footer />
            </>
          } 
        />
        <Route 
          path="/l" 
          element={
            <Login 
              onStudentLogin={handleStudentLogin} 
              onTutorLogin={handleTutorLogin} 
            />
          } 
        />
        <Route 
          path="/student/:id" 
          element={<StudentDashboard student={currentStudent} onLogout={handleLogout} />} 
        />
        <Route 
          path="/tutor/:id" 
          element={<TutorDashboard tutor={currentTutor} onLogout={handleLogout} />} 
        />
        <Route path="/pass/:id" element={<GatePassForm />} />
        <Route path="/r" element={<RegisterForm />} />
        <Route path="/tutor/register" element={<TutorRegisterForm />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
      
    </Router>
  );
}

export default App;