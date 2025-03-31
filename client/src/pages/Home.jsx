import React from 'react';
import { useNavigate } from 'react-router-dom';
import InfoSection from '../components/InfoSection';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { devConnectObjOne, devConnectObjThree, devConnectObjTwo, devConnectObjFour } from './Data';

const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <InfoSection {...devConnectObjOne} />
            <InfoSection {...devConnectObjThree} />
            <InfoSection {...devConnectObjTwo} />
            <Pricing />
            <InfoSection {...devConnectObjFour} />
            <Footer />
        </>
    );
};

export default Home;
