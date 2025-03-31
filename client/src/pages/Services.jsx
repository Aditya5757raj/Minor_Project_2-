import React from 'react';
import InfoSection from '../components/InfoSection';
import Pricing from '../components/Pricing';
import { homeObjOne, homeObjThree } from './ServicesData';

const Services = () => {
  return (
    <>
      <Pricing />
      <InfoSection {...homeObjOne} />
      <InfoSection {...homeObjThree} />
    </>
  );
};

export default Services;
