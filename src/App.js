import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AddVocabForm from './AddVocabForm';
import AddVocabExampleForm from './AddVocabExampleForm';
import AddAdditionalVocabForm from './AddAdditionalVocabForm';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // On app load, prompt user for login
    const username = prompt('Enter your username:');
    const password = prompt('Enter your password:');
    
    // Simple validation
    if (username === 'kaiwa' && password === 'bloom1234') {
      setIsLoggedIn(true); // Successful login
    } else {
      alert('Invalid credentials');
    }
  }, []); // Run this on mount

  if (!isLoggedIn) {
    return <div>Please log in to continue.</div>;
  }

  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li><Link to="/add-vocab">Add Vocab</Link></li>
          <li><Link to="/add-example">Add Example</Link></li>
          <li><Link to="/add-additional-vocab">Add Additional Vocab</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/add-vocab" element={<AddVocabForm />} />
        <Route path="/add-example" element={<AddVocabExampleForm />} />
        <Route path="/add-additional-vocab" element={<AddAdditionalVocabForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

