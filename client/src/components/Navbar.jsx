import React, { useState, useEffect } from 'react';
import { 
    Nav, 
    NavbarContainer, 
    NavLogo, 
    NavIcon, 
    HamburgerIcon,
    NavMenu,
    NavItem,
    NavLinks,
    NavItemBtn,
    NavBtnLink
} from '../styles/Navbar.elements';
import { FaTimes, FaBars } from 'react-icons/fa';
import { IconContext } from 'react-icons/lib';
import { Button } from '../styles/globalStyles';

function Navbar() {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);
    const [activeTab, setActiveTab] = useState('home');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setClick(false); // Close menu on mobile after clicking a link
    };

    const handleClick = () => setClick(!click);

    const showButton = () => {
        setButton(window.innerWidth > 960);
    };

    useEffect(() => {
        showButton();
        window.addEventListener('resize', showButton);
        return () => window.removeEventListener('resize', showButton);
    }, []);

    return (
        <IconContext.Provider value={{ color: '#fff' }}>
            <Nav>
                <NavbarContainer>
                    <NavLogo to='/'>
                        <NavIcon />
                        DevConnect
                    </NavLogo>
                    <HamburgerIcon onClick={handleClick}>
                        {click ? <FaTimes /> : <FaBars />}
                    </HamburgerIcon>
                    <NavMenu click={click}>
                        <NavItem active={activeTab === 'home'}>
                            <NavLinks to='/' onClick={() => handleTabClick('home')}>
                                Home
                            </NavLinks>
                        </NavItem>
                        <NavItem active={activeTab === 'services'}>
                            <NavLinks to='/services' onClick={() => handleTabClick('services')}>
                                Services
                            </NavLinks>
                        </NavItem>
                        <NavItem active={activeTab === 'products'}>
                            <NavLinks to='/products' onClick={() => handleTabClick('products')}>
                                Products
                            </NavLinks>
                        </NavItem>
                        <NavItemBtn>
                            <NavBtnLink to='/Signup'>
                                <Button primary fontBig={!button} onClick={() => setClick(false)}>
                                    SIGN UP
                                </Button>
                            </NavBtnLink>
                        </NavItemBtn>
                    </NavMenu>
                </NavbarContainer>
            </Nav>
        </IconContext.Provider>
    );
}

export default Navbar;
