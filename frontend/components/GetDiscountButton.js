import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const StyledButton = styled(Button)`
    background-color: #5b8c00;
    width: 100%;

    &:hover {
        background-color: #7cb305;
    }
`;

const GetDiscountButton = ({ onClick }) => (
    <StyledButton onClick={onClick}>
        Get discount
    </StyledButton>
);

export default GetDiscountButton;
