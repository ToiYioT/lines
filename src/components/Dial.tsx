
import { Button } from '@mantine/core'
import { useScrollLock } from '@mantine/hooks';
import React, { useEffect, useRef, useState } from 'react'
import DialDigit from './DialDigit';

type Props = {
    num: number
    setNum: React.Dispatch<React.SetStateAction<number>>

    minValue?: number
    maxValue?: number
    precision?: number

    omitSign?: boolean
}

const baseSensitivity = .3;
const minusSign = <div className="dial-sign">-</div>
const plusSign = <div className="dial-sign">+</div>
const decimalSeparator = <div className="decimal-separator">.</div>

export default function Dial(props: Props) {

    const {
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

    return (
        <div className="dial-container">
            {!omitSign && (num < 0 ? minusSign : plusSign)}

            <DialDigit
                num={num}
                setNum={handleSetNum}
                handleRound={handleRound}
                digit={2}
                sensitivity={1 * baseSensitivity} />
            <DialDigit
                num={num}
                setNum={handleSetNum}
                handleRound={handleRound}
                digit={1}
                sensitivity={10 * baseSensitivity} />
            <DialDigit
                num={num}
                setNum={handleSetNum}
                handleRound={handleRound}
                digit={0}
                sensitivity={100 * baseSensitivity} />
            {decimalSeparator}
            <DialDigit
                num={num}
                setNum={handleSetNum}
                handleRound={handleRound}
                digit={-1}
                sensitivity={1000 * baseSensitivity} />
            <DialDigit
                num={num}
                setNum={handleSetNum}
                handleRound={handleRound}
                digit={-2}
                sensitivity={10000 * baseSensitivity} />
            <DialDigit
                num={num}
                setNum={handleSetNum}
                handleRound={handleRound}
                digit={-3}
                sensitivity={100000 * baseSensitivity} />
            <DialDigit
                num={num}
                setNum={handleSetNum}
                digit={-4}
                handleRound={handleRound}
                sensitivity={1000000 * baseSensitivity} />
        </div>
    )
}