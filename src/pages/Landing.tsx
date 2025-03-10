import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Benefits from '../components/landing/Benefits';
import Features from '../components/landing/Features';
import About from '../components/landing/About';
import Pricing from '../components/landing/Pricing';
import Footer from '../components/landing/Footer';

export default function Landing() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Benefits />
        <Features />
        <Pricing />
        <About />
      </main>
      <Footer />
    </div>
  );
}