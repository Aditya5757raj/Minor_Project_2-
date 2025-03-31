import styled from 'styled-components';

export const AuthContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f4f4f4;
`;

export const AuthForm = styled.form`
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 300px;
    text-align: center;
`;

export const Input = styled.input`
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

export const Button = styled.button`
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
    transition: 0.3s;

    &:hover {
        background-color: #0056b3;
    }
`;

export const Text = styled.p`
    margin-top: 10px;
`;

export const Span = styled.span`
    color: #007bff;
    cursor: pointer;
    font-weight: bold;

    &:hover {
        text-decoration: underline;
    }
`;
