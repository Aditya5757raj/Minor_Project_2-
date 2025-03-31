import React from 'react';
import InfoSection from '../components/InfoSection';
import { homeObjOne, homeObjTwo } from './ProductsData';

const Products = () => {
  return (
    <>
      <InfoSection {...homeObjOne} />
      <InfoSection {...homeObjTwo} />
    </>
  );
};

export default Products;
