import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import Services from './pages/Services';
import Footer from './components/Footer';
import Lobby from './components/Lobby';
import Room from './components/Room';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar';

function App() {
  const location = useLocation();

  // Paths where Navbar and Footer should not be displayed
  const hideLayoutRoutes = ['/lobby', /^\/room\/[^/]+\/[^/]+$/];

  const shouldHideLayout = hideLayoutRoutes.some(route =>
    typeof route === 'string'
      ? location.pathname === route
      : route.test(location.pathname)
  );

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/products" element={<Products />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/room/:roomId/:email" element={<Room />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      
      {!shouldHideLayout && <Footer />}
    </>
  );
}

export default App;
