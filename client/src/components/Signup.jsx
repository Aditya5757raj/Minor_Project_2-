import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    AuthContainer, 
    AuthForm, 
    Input, 
    Button, 
    Text, 
    Span, 
    Title, 
    SubTitle,
    ErrorMessage, 
    SuccessMessage,
    InputGroup,
    InputIcon,
    FeaturesContainer,
    FeatureItem,
} from '../styles/Auth';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    
    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        try {
            const response = await axios.post('http://localhost:8000/signup', { email, password });
            
            if (response.data.success) {
                setSuccess('Account created successfully! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error('Signup Error:', err);
            setError('Error signing up. Please try again.');
        }
    };
    
    return (
        <AuthContainer>
            {/* Enhanced code background layers */}
            <div className="code-grid"></div>
            <div className="code-sparkles"></div>
            
            {/* Enhanced floating code snippets with syntax highlighting */}
            <div className="floating-code one">
                {`// Welcome to DevConnect\n`}
                <span className="keyword">const</span> devConnect = {`{\n  `}
                <span className="function">features</span>: [<span className="string">'realtime'</span>, <span className="string">'collaboration'</span>, <span className="string">'whiteboard'</span>]
                {`\n}`}
            </div>
            
            <div className="floating-code two">
                <span className="comment">{`/* Connect with developers */`}</span>{`\n`}
                <span className="keyword">function</span> <span className="function">joinRoom</span>() {`{\n  `}
                socket.<span className="function">emit</span>(<span className="string">'join'</span>, roomId);
                {`\n}`}
            </div>
            
            <div className="floating-code three">
                {`<`}<span className="keyword">VideoChat</span>{`>\n  <`}
                <span className="keyword">PeerConnection</span> config={`{config}`} {`/>\n</`}
                <span className="keyword">VideoChat</span>{`>`}
            </div>
            
            <div className="floating-code four">
                <span className="comment">{`// Real-time collaboration`}</span>{`\n`}
                socket.<span className="function">on</span>(<span className="string">'code-update'</span>, 
                (<span className="keyword">code</span>) = {`{\n  `}
                editor.<span className="function">setValue</span>(code);
                {`\n}`});
            </div>
            
            <div className="floating-code five">
                <span className="comment">{`/* Secure authentication */`}</span>{`\n`}
                <span className="keyword">function</span> <span className="function">verifyUser</span>() {`{\n  `}
                <span className="keyword">return</span> jwt.<span className="function">verify</span>(token, secret);
                {`\n}`}
            </div>
         
            
            <AuthForm onSubmit={handleSignup}>
                <Title>Join DevConnect</Title>
                <SubTitle>Create your free account and start collaborating today</SubTitle>
                
                {error && <ErrorMessage>{error}</ErrorMessage>}
                {success && <SuccessMessage>{success}</SuccessMessage>}
                
                <InputGroup>
                    <InputIcon>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                    </InputIcon>
                    <Input
                        type="email"
                        placeholder="developer@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </InputGroup>
                
                <InputGroup>
                    <InputIcon>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </InputIcon>
                    <Input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </InputGroup>
                
                <Button type="submit">Create Account</Button>
                <Text>Already have an account? <Span onClick={() => navigate('/login')}>Sign In</Span></Text>
            </AuthForm>
            
            <FeaturesContainer>
                <FeatureItem>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 18 22 12 16 6"></polyline>
                        <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                    Real-time Coding
                </FeatureItem>
                <FeatureItem>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                    </svg>
                    Video Collaboration
                </FeatureItem>
                <FeatureItem>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="3" y1="9" x2="21" y2="9"></line>
                        <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                    Interactive Whiteboard
                </FeatureItem>
            </FeaturesContainer>
        </AuthContainer>
    );
};

export default Signup;