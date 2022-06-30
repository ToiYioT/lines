
import { Button } from '@mantine/core'
import { useScrollLock } from '@mantine/hooks';
import React, { useEffect, useRef, useState } from 'react'
import DialDigit from './DialDigit';

type Props = {
    num: number
    setNum: React.Dispatch<React.SetStateAction<number>>
}

const baseSensitivity = .3;
const minusSign = <div className="dial-sign">-</div>
const plusSign = <div className="dial-sign">+</div>
const decimalSeparator = <div className="decimal-separator">.</div>

export default function Dial({ num, setNum }: Props) {

    return (
        <div className="dial-container">
            {num < 0 ? minusSign : plusSign}
            <DialDigit
                num={num}
                setNum={setNum}
                digit={2}
                sensitivity={1 * baseSensitivity} />
            <DialDigit
                num={num}
                setNum={setNum}
                digit={1}
                sensitivity={10 * baseSensitivity} />
            <DialDigit
                num={num}
                setNum={setNum}
                digit={0}
                sensitivity={100 * baseSensitivity} />
            {decimalSeparator}
            <DialDigit
                num={num}
                setNum={setNum}
                digit={-1}
                sensitivity={1000 * baseSensitivity} />
            <DialDigit
                num={num}
                setNum={setNum}
                digit={-2}
                sensitivity={10000 * baseSensitivity} />
            <DialDigit
                num={num}
                setNum={setNum}
                digit={-3}
                sensitivity={100000 * baseSensitivity} />
            <DialDigit
                num={num}
                setNum={setNum}
                digit={-4}
                sensitivity={1000000 * baseSensitivity} />
        </div>
    )
}