import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import GuessBox from '../components/GuessBox';
import SecretButton from '../components/SecretButton';
import GetDiscountButton from '../components/GetDiscountButton';

const getMinMaxFromTags = (tagsStr) => {
    const tags = tagsStr.split(' ');
    let min;
    let max;

    tags.forEach(tag => {
        if (tag.startsWith('sp-min-')) {
            min = tag.slice(7, tag.length);
        } else if (tag.startsWith('sp-max-')) {
            max = tag.slice(7, tag.length);
        }
    });

    const minInt = parseInt(min);
    const maxInt = parseInt(max);

    if (isNaN(minInt) || isNaN(maxInt)) {
        return {};
    }
    return {
        min: minInt,
        max: maxInt
    };
};

const Container = styled.div`
    max-width: 400px;
`;

// viewState:
//      0   - button for guessing
//      1   - text box with guess button
//      2   - proceed to checkout with discount

const MainView = () => {
    const [viewState, setViewState] = useState(0);
    const [secretDisabled, setSecretDisabled] = useState(true);
    const [productId, setProductId] = useState('')
    const [orderUrl, setOrderUrl] = useState('');
    const [guesses, setGuesses] = useState(0);
    const [minState, setMin] = useState(undefined);
    const [maxState, setMax] = useState(undefined);

    useEffect(() => {
        const attributes = document.getElementById('react-password').attributes;
        const productId = attributes['variant-id'].value;

        setProductId(productId);

        const productTags = attributes['product-tags'].value;
        const { min, max } = getMinMaxFromTags(productTags);

        setMin(min || 1);
        setMax(max || 1000);

        axios.defaults.withCredentials = true;
        axios.post('https://secretpassword.herokuapp.com/session/', {
            productId,
            minValue: min,
            maxValue: max
        }).then((res) => {
            const { guessesRemaining } = res.data;
            setSecretDisabled(false);
            setGuesses(guessesRemaining);
        }).catch((e) => {
            setSecretDisabled(true);
        });
    }, [setSecretDisabled, setProductId, setGuesses, setMin, setMax]);

    const onSuccess = (url) => {
        setViewState(2);
        setOrderUrl(url);
    };

    let content;

    if (viewState === 0) {
        content = <SecretButton onClick={() => setViewState(1)} disabled={secretDisabled} />;
    } else if (viewState === 1) {
        content = (
            <GuessBox
                onSuccess={onSuccess}
                productId={productId}
                numGuesses={guesses}
                min={minState}
                max={maxState}
            />);
    } else {
        content = <GetDiscountButton onClick={() => window.open(orderUrl)} />
    }

    return (
        <Container>
            { content }
        </Container>
    )
};

export default MainView;