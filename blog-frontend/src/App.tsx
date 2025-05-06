import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';

import UntitledUI from './components/untiles'; // Adjust the path if it's different

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
      
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<UntitledUI />} />
            {/* Add other routes here if needed */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
