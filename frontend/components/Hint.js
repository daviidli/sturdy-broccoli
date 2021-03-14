import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    width: 100%;
    visibility: ${p => p.shown ? 'visible' : 'hidden'};
    height: ${p => p.shown ? '8rem' : '0rem'};
    background-color: #fff;
    border: #3a3a3a solid 1px;
    transition: height 0.3s ease-in-out;
    margin-top: 0.75rem;
    border-radius: 4px;
`;

const Message = styled.span`
    position: relative;
    color: #3a3a3a;
    top: 1.5rem;
    left: 1.5rem;
    opacity: ${p => p.shown ? '1' : '0'};
    transition: opacity 0.1s linear 0.2s;
`;

const Bold = styled.span`
    font-weight: bold;
`;

const Range = styled.div`
    position: relative;
    top: 3rem;
    left: 1.5rem;
    opacity: ${p => p.shown ? '1' : '0'};
    transition: opacity 0.1s linear 0.2s;
`

const Hint = ({ shown, higher, min, max }) => (
    <Container shown={shown}>
        <Message shown={shown}>Your guess is too <Bold>{ higher ? ' low' : ' high' }</Bold>!</Message>
        <Range shown={shown}>{ `Password range: [${min}, ${max}]` }</Range>
    </Container>
);

export default Hint;
