import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContainer, AuthForm, Input, Button, Text, Span } from '../styles/Auth';

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
            <AuthForm onSubmit={handleSignup}>
                <h2>Sign Up</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <Input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                />
                <Input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                />
                <Button type="submit">Sign Up</Button>
                <Text>Already have an account? <Span onClick={() => navigate('/login')}>Login</Span></Text>
            </AuthForm>
        </AuthContainer>
    );
};

export default Signup;
