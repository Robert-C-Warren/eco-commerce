import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './pages/ProductList';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<ProductList />} />
    </Routes>
  </Router>
);

export default App;