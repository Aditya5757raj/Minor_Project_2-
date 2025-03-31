import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import Services from './pages/Services';
import Lobby from './components/Lobby';
import Room from './components/Room';
import Login from './components/Login';  // ✅ Import Login Component
import Signup from './components/Signup'; // ✅ Import Signup Component

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/products" element={<Products />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/room/:roomId/:email" element={<Room />} />
        <Route path="/login" element={<Login />} />  {/* ✅ Add Login Route */}
        <Route path="/signup" element={<Signup />} /> {/* ✅ Add Signup Route */}
      </Routes>
    </>
  );
}

export default App;
