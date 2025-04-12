import styled from 'styled-components';
import { keyframes } from 'styled-components';

// Enhanced Animations
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-22px) rotate(3deg); }
  66% { transform: translateY(-10px) rotate(-2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

const codeSlide = keyframes`
  0% { transform: translateX(-5%); opacity: 0; }
  10% { opacity: 0.4; }
  90% { opacity: 0.4; }
  100% { transform: translateX(5%); opacity: 0; }
`;

const codeMatrix = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 0% 100%; }
`;

const codeBlink = keyframes`
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.8; }
`;

export const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  position: relative;
  overflow: hidden;
  padding: 20px;

  /* Enhanced code background pattern */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(circle at 25% 25%, rgba(74, 144, 226, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(74, 144, 226, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 60%);
    background-size: 300px 300px, 300px 300px, 500px 500px;
    opacity: 0.8;
    z-index: 1;
    animation: ${codeMatrix} 30s linear infinite;
  }

  /* Improved animated sliding code lines - horizontal */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      linear-gradient(
        to right,
        transparent,
        rgba(255, 255, 255, 0.05) 1px,
        transparent 1px
      ),
      linear-gradient(
        to bottom,
        transparent,
        rgba(255, 255, 255, 0.03) 1px,
        transparent 1px
      );
    background-size: 20px 100%, 100% 20px;
    animation: ${codeSlide} 25s linear infinite;
    pointer-events: none;
    z-index: 2;
  }

  /* Additional code pattern element - vertical lines */
  .code-grid {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      linear-gradient(
        to bottom,
        transparent,
        rgba(59, 130, 246, 0.05) 1px,
        transparent 1px
      );
    background-size: 100% 30px;
    animation: ${codeSlide} 20s linear infinite reverse;
    pointer-events: none;
    z-index: 2;
  }

  /* New digital sparkles */
  .code-sparkles {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: radial-gradient(circle at center, rgba(99, 102, 241, 0.4) 0%, transparent 1px);
    background-size: 50px 50px;
    animation: ${codeBlink} 5s ease infinite alternate;
    pointer-events: none;
    z-index: 1;
  }

  /* Floating code snippets with improved styling */
  .floating-code {
    position: absolute;
    font-family: 'Fira Code', 'Courier New', monospace;
    color: rgba(255, 255, 255, 0.3);
    font-size: 14px;
    z-index: 3;
    pointer-events: none;
    background: rgba(30, 41, 59, 0.4);
    padding: 12px;
    border-radius: 8px;
    border-left: 3px solid rgba(59, 130, 246, 0.6);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    border-right: 1px solid rgba(255, 255, 255, 0.05);
    white-space: pre;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(4px);
    
    &.one {
      top: 15%;
      left: 5%;
      animation: ${float} 18s ease-in-out infinite;
      transform-origin: center;
    }
    
    &.two {
      bottom: 20%;
      right: 10%;
      animation: ${float} 20s ease-in-out infinite 2s;
      transform-origin: bottom right;
    }
    
    &.three {
      top: 30%;
      right: 15%;
      animation: ${float} 22s ease-in-out infinite 3s;
      transform-origin: top right;
    }
    
    &.four {
      top: 60%;
      left: 20%;
      animation: ${float} 19s ease-in-out infinite 1s;
      transform-origin: bottom left;
    }
    
    &.five {
      bottom: 30%;
      right: 25%;
      animation: ${float} 17s ease-in-out infinite 4s;
      transform-origin: center;
    }
    
    /* Highlight different syntax elements */
    .keyword { color: rgba(147, 197, 253, 0.8); }
    .string { color: rgba(110, 231, 183, 0.8); }
    .function { color: rgba(249, 168, 212, 0.8); }
    .comment { color: rgba(148, 163, 184, 0.6); }
  }

  @media (max-width: 768px) {
    padding: 15px;
    
    .floating-code {
      font-size: 12px;
      padding: 8px;
      display: none; /* Hide on small screens for better readability */
    }
    
    &::after, .code-grid, .code-sparkles {
      animation: none; /* Disable animations on mobile for performance */
    }
  }
`;

export const BrandLogo = styled.div`
  position: absolute;
  top: 30px;
  left: 40px;
  color: white;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  z-index: 10;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  
  svg {
    margin-right: 10px;
    filter: drop-shadow(0 2px 3px rgba(0,0,0,0.2));
  }
  
  @media (max-width: 768px) {
    top: 20px;
    left: 20px;
    font-size: 20px;
  }
`;

export const AuthForm = styled.form`
  background: rgba(255, 255, 255, 0.98);
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 5;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 30px 20px;
    max-width: 100%;
    margin-top: 20px;
  }
`;

export const Title = styled.h2`
  color: #1e293b;
  margin-bottom: 16px;
  font-weight: 700;
  font-size: 28px;
  background: linear-gradient(90deg, #3b82f6 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const SubTitle = styled.p`
  color: #64748b;
  margin-bottom: 30px;
  font-size: 16px;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const InputGroup = styled.div`
  position: relative;
  margin-bottom: 25px;
`;

export const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #3b82f6;
`;

export const Input = styled.input`
  width: 100%;
  padding: 15px 15px 15px 50px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    background-color: white;
  }
  
  &::placeholder {
    color: #94a3b8;
  }
  
  @media (max-width: 768px) {
    padding: 12px 12px 12px 45px;
    font-size: 15px;
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(90deg, #3b82f6 0%, #6366f1 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  margin-top: 15px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: 0.5s;
  }
  
  &:hover {
    background: linear-gradient(90deg, #2563eb 0%, #4f46e5 100%);
    box-shadow: 0 6px 12px rgba(59, 130, 246, 0.3);
    
    &:before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(2px);
  }
  
  @media (max-width: 768px) {
    padding: 14px;
    font-size: 15px;
  }
`;

export const Text = styled.p`
  margin-top: 25px;
  color: #64748b;
  font-size: 15px;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const Span = styled.span`
  color: #3b82f6;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    color: #2563eb;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

export const ErrorMessage = styled.p`
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 20px;
  border-left: 3px solid #ef4444;
`;

export const SuccessMessage = styled.p`
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 20px;
  border-left: 3px solid #10b981;
`;

export const FeaturesContainer = styled.div`
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  padding: 0 20px;
  z-index: 5;
  
  @media (max-width: 768px) {
    position: relative;
    bottom: auto;
    margin-top: 40px;
    gap: 10px;
  }
`;

export const FeatureItem = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: white;
  padding: 12px 20px;
  border-radius: 50px;
  font-size: 14px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  svg {
    margin-right: 8px;
    color: #93c5fd;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 13px;
  }
`;

export const DevConnectBadge = styled.div`
  position: absolute;
  top: 30px;
  right: 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 50px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  z-index: 10;
  
  svg {
    margin-right: 8px;
    animation: ${pulse} 2s ease-in-out infinite;
  }
  
  @media (max-width: 768px) {
    top: 20px;
    right: 20px;
    font-size: 12px;
  }
`;