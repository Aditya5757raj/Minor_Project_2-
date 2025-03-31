import React from 'react';
import { Button } from '../styles/globalStyles';
import { GiCrystalBars, GiCutDiamond, GiRock } from 'react-icons/gi';
import { IconContext } from 'react-icons/lib';
import {
  PricingSection,
  PricingWrapper,
  PricingHeading,
  PricingContainer,
  PricingCard,
  PricingCardInfo,
  PricingCardIcon,
  PricingCardPlan,
  PricingCardCost,
  PricingCardLength,
  PricingCardFeatures,
  PricingCardFeature
} from '../styles/Pricing.elements';

const Pricing = () => {
  return (
    <IconContext.Provider value={{ color: '#a9b3c1', size: 64 }}>
      <PricingSection>
        <PricingWrapper>
          <PricingHeading>DevConnect Plans</PricingHeading>
          <PricingContainer>
            {/* Starter Plan */}
            <PricingCard to='/Signup'>
              <PricingCardInfo>
                <PricingCardIcon>
                  <GiRock />
                </PricingCardIcon>
                <PricingCardPlan>Starter</PricingCardPlan>
                <PricingCardCost>$19.99</PricingCardCost>
                <PricingCardLength>per month</PricingCardLength>
                <PricingCardFeatures>
                  <PricingCardFeature>Access to Developer Forums</PricingCardFeature>
                  <PricingCardFeature>Free Code Snippets</PricingCardFeature>
                  <PricingCardFeature>Basic Collaboration Tools</PricingCardFeature>
                </PricingCardFeatures>
                <Button primary>Choose Plan</Button>
              </PricingCardInfo>
            </PricingCard>

            {/* Developer Plan */}
            <PricingCard to='/Signup'>
              <PricingCardInfo>
                <PricingCardIcon>
                  <GiCrystalBars />
                </PricingCardIcon>
                <PricingCardPlan>Developer</PricingCardPlan>
                <PricingCardCost>$49.99</PricingCardCost>
                <PricingCardLength>per month</PricingCardLength>
                <PricingCardFeatures>
                  <PricingCardFeature>Access to Advanced Tools</PricingCardFeature>
                  <PricingCardFeature>Unlimited Collaboration</PricingCardFeature>
                  <PricingCardFeature>Code Review & Mentoring</PricingCardFeature>
                </PricingCardFeatures>
                <Button primary>Choose Plan</Button>
              </PricingCardInfo>
            </PricingCard>

            {/* Professional Plan */}
            <PricingCard to='/signup'>
              <PricingCardInfo>
                <PricingCardIcon>
                  <GiCutDiamond />
                </PricingCardIcon>
                <PricingCardPlan>Professional</PricingCardPlan>
                <PricingCardCost>$99.99</PricingCardCost>
                <PricingCardLength>per month</PricingCardLength>
                <PricingCardFeatures>
                  <PricingCardFeature>Exclusive Developer Webinars</PricingCardFeature>
                  <PricingCardFeature>One-on-One Mentorship</PricingCardFeature>
                  <PricingCardFeature>Priority Support</PricingCardFeature>
                </PricingCardFeatures>
                <Button primary>Choose Plan</Button>
              </PricingCardInfo>
            </PricingCard>
          </PricingContainer>
        </PricingWrapper>
      </PricingSection>
    </IconContext.Provider>
  );
};

export default Pricing;
