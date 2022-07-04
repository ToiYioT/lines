
import { Button } from '@mantine/core'
import { useScrollLock } from '@mantine/hooks';
import React, { useEffect, useRef, useState } from 'react'
import DialDigit from './DialDigit';

type Props = {
    name?: string
    num: number
    setNum: React.Dispatch<React.SetStateAction<number>>

    minValue?: number
    maxValue?: number
    precision?: number

    omitSign?: boolean
}

const baseSensitivity = 30;
const minusSign = <div className="dial-digit dial-sign">-</div>
const plusSign = <div className="dial-digit dial-sign">+</div>
const decimalSeparator = <div className="dial-digit decimal-separator">.</div>

export default function Dial(props: Props) {

    const {
        name,
        num,
        setNum,
        minValue, maxValue, precision,
        omitSign } = props;

    function handleSetNum(diff: number) {
        setNum((prevNum: number) => {

            const result = prevNum - diff;

            if (minValue != undefined && maxValue != undefined) {
                if (result > maxValue) return maxValue;
                if (result < minValue) return minValue;
            }
            return result;
        })
    }

    function handleRound(digit: number) {
        setNum((prevNum: number) => {
            return Math.floor(Math.abs(prevNum) / Math.pow(10, digit))
                * Math.pow(10, digit) * Math.sign(prevNum);
        });
    }

    const numOfDigits = (maxValue != undefined && minValue != undefined)
        ? getNumOfDigits(minValue, maxValue)
        : 3;

    const precisionFinal = (precision != undefined && precision >= 0)
        ? precision
        : 4;

    const numsBeforeDecimalPoint = [];
    for (let i = 0; i < numOfDigits; i++) {

        const digit = numOfDigits - i - 1;
        numsBeforeDecimalPoint[i] = (
            <DialDigit
                num={num}
                setNum={handleSetNum}
                handleRound={handleRound}
                digit={digit}
                sensitivity={Math.pow(10, -digit) * baseSensitivity}
            />
        )
    }

    const numsAfterDecimalPoint = [];
    for (let i = 0; i < precisionFinal; i++) {

        const digit = -(i + 1);
        numsAfterDecimalPoint[i] = (
            <DialDigit
                num={num}
                setNum={handleSetNum}
                handleRound={handleRound}
                digit={digit}
                sensitivity={Math.pow(10, -digit) * baseSensitivity}
            />
        )
    }

    return (
        <>
            <div className="dial-name">
                {name}
            </div>
            <div className="dial-container">
                {!omitSign && (num < 0 ? minusSign : plusSign)}

                {numsBeforeDecimalPoint}
                {precisionFinal > 0 ? decimalSeparator : ""}
                {numsAfterDecimalPoint}
            </div>
        </>
    )
}


function getNumOfDigits(minValue: number, maxValue: number) {

    const epsilon = 0.00000000000001;

    const biggestNum = Math.max(Math.abs(maxValue), Math.abs(minValue));
    const biggestNumLog10 = Math.log10(biggestNum);
    const numOfDigits = Math.ceil(biggestNumLog10 + epsilon);

    return numOfDigits;
}