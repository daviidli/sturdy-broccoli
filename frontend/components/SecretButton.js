import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const StyledButton = styled(Button)`
    width: 100%;
`;

const SecretButton = ({ onClick, disabled }) => (
    <StyledButton onClick={onClick} disabled={disabled}>
        Use a Secret Password
    </StyledButton>
);

export default SecretButton;
