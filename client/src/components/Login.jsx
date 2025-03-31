import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContainer, AuthForm, Input, Button, Text, Span } from '../styles/Auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:8000/signin', { email, password });

            if (response.data.success) {
                console.log('Login Successful:', response.data);
                navigate('/Lobby');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error('Login Error:', err);
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <AuthContainer>
            <AuthForm onSubmit={handleLogin}>
                <h2>Login</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
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
                <Button type="submit">Login</Button>
                <Text>Don't have an account? <Span onClick={() => navigate('/signup')}>Sign Up</Span></Text>
            </AuthForm>
        </AuthContainer>
    );
};

export default Login;
