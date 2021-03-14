import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
    background-color: #3a3a3a;
    border: none;
    padding: 0.75rem 1.5rem;
    color: ${p => p.disabled ? '#aaa' : '#fff'};
    border-radius: 4px;
    cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};
    transition: background-color 0.2s ease-in-out;
    font-weight: bold;
    text-transform: uppercase;

    &:hover {
        background-color: #5a5a5a;
    }
`;

const Button = ({ className, onClick, children, disabled }) => {
    const onButtonClick = () => {
        if (!disabled) {
            onClick();
        }
    }

    return (
        <StyledButton className={className} onClick={onButtonClick} disabled={disabled}>
            { children}
        </StyledButton>
    );
};

export default Button;
