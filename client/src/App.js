import './App.css';
import Signup from './Auth/Signup';
import Login from './Auth/Login';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Notes from './services/Notes';
import React from 'react';
import NotFound from './Auth/NotFound';

const authService = {
  isAuthenticated: () => {
    if(localStorage.getItem('userId') == null){
      return true
    }
    return false
  }
};

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound/>} /> 
          <Route path="/notes"element={<Notes/>}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
