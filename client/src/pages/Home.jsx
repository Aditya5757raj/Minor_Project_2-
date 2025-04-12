import React from 'react';
import { useNavigate } from 'react-router-dom';
import InfoSection from '../components/InfoSection';
import Pricing from '../components/Pricing';
import { devConnectObjOne, devConnectObjThree, devConnectObjTwo, devConnectObjFour } from './Data';

const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <InfoSection {...devConnectObjOne} />
            <InfoSection {...devConnectObjThree} />
            <InfoSection {...devConnectObjTwo} />
            <Pricing />
            <InfoSection {...devConnectObjFour} />
        </>
    );
};

export default Home;
