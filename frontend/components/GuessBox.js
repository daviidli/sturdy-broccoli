import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Button from './Button';
import Hint from './Hint';

const Input = styled.input`
    height: 2.5rem;
    width: 50%;
    margin-right: 0.5rem;
    padding: 0.5rem;
`;

const StyledButton = styled(Button)`
    width: 45%;
`;

const GuessBox = ({ onSuccess, productId, numGuesses, min, max }) => {
    const [inputValue, setInput] = useState('');
    // guessResult
    //      -1          - guess is lower than value
    //      0           - guess is correct
    //      1           - guess is higher than value
    //      undefined   - no guess
    const [guessResult, setGuessResult] = useState(undefined);
    const [remainingGuesses, setRemainingGuesses] = useState(numGuesses);
    const [disabledGuessing, setDisabledGuessing] = useState(false);

    const guess = () => {
        if (inputValue === '') return;

        const guessValue = parseInt(inputValue);

        axios.defaults.withCredentials = true;
        axios.post('https://secretpassword.herokuapp.com/guess/', {
            productId,
            guess: guessValue
        }).then((res) => {
            setGuessResult(res.data.hint);
            setRemainingGuesses(res.data.guessesRemaining);

            if (res.data.guessesRemaining === 0) {
                setDisabledGuessing(true);
            }

            if (res.data.hint === 0) {
                onSuccess(res.data.draftOrder);
            }
        });
    };

    const onInputChange = (e) => {
        const regex = /^[0-9\b]+$/;

        if (e.target.value === '' || regex.test(e.target.value)) {
            setInput(e.target.value);
            return;
        }
    };

    return (
        <>
            <Input type="number" value={inputValue} onChange={onInputChange} placeholder={`Integer: [${min}, ${max}]`} />
            <StyledButton onClick={guess} disabled={disabledGuessing}>guess { remainingGuesses === undefined ? null : `(${remainingGuesses})` }</StyledButton>
            <Hint shown={guessResult !== undefined} higher={guessResult === -1} min={min} max={max} />
        </>
    )
}

export default GuessBox;
