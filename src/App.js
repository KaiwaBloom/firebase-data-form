import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AddVocabForm from './AddVocabForm';
import AddVocabExampleForm from './AddVocabExampleForm';
import AddAdditionalVocabForm from './AddAdditionalVocabForm';

function App() {
  return (
    <BrowserRouter>
    <nav>
        <ul>
          <li>
            <Link to="/add-vocab">Add Vocab</Link>
          </li>
          <li>
            <Link to="/add-example">Add Example</Link>
          </li>
          <li>
            <Link to="/add-additional-vocab">Add Additional Vocab</Link>
          </li>
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
