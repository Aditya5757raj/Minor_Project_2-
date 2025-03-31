import React from 'react';
import { Link } from 'react-router-dom';
import { 
    InfoSec, 
    InfoRow, 
    InfoColumn, 
    TextWrapper, 
    TopLine, 
    Heading, 
    Subtitle, 
    ImgWrapper, 
    Img 
} from '../styles/InfoSection.elements';
import { Container, Button } from '../styles/globalStyles';

const InfoSection = ({ 
    primary,
    lightBg,
    topLine,
    lightTopLine,
    lightText,
    lightTextDesc,
    headline,
    description,
    buttonLabel,
    img,
    alt,
    imgStart,
    start
}) => {
    return (
        <InfoSec lightBg={lightBg}>
            <Container>
                <InfoRow imgStart={imgStart}>
                    {/* Left Column - Text Content */}
                    <InfoColumn>
                        <TextWrapper>
                            <TopLine lightTopLine={lightTopLine}>{topLine}</TopLine>
                            <Heading lightText={lightText}>{headline}</Heading>
                            <Subtitle lightTextDesc={lightTextDesc}>{description}</Subtitle>
                            <Link to='/Signup'>
                                <Button big fontBig primary={primary}>
                                    {buttonLabel}
                                </Button>
                            </Link>
                        </TextWrapper>
                    </InfoColumn>

                    {/* Right Column - Image */}
                    <InfoColumn>
                        <ImgWrapper start={start}>
                            <Img src={img} alt={alt} />
                        </ImgWrapper>
                    </InfoColumn>
                </InfoRow>
            </Container>
        </InfoSec>
    );
};

export default InfoSection;
