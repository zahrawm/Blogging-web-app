import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import BlogPage from './components/untiles';



const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<BlogPage />} />
         
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
