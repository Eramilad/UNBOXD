
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import TrackRecord from '../components/TrackRecord';
import ProvenProcess from '../components/ProvenProcess';
import WhyUnboxd from '../components/WhyUnboxd';
import AdditionalFeatures from '../components/AdditionalFeatures';
import Services from '../components/Services';
import HowItWorks from '../components/HowItWorks';
import Marketplace from '../components/Marketplace';
import Waitlist from '../components/Waitlist';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Hero />
      <TrackRecord />
      <ProvenProcess />
      <WhyUnboxd />
      <AdditionalFeatures />
      <Services />
      <HowItWorks />
      <Marketplace />
      <Waitlist />
      <Footer />
    </div>
  );
};

export default Index;
