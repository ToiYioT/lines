
import { Button } from '@mantine/core';
import { useScrollLock } from '@mantine/hooks';
import React, { useRef, useState } from 'react'

type Props = {
    num: number
    setNum: React.Dispatch<React.SetStateAction<number>>
    digit: number
    sensitivity: number
}

export default function DialDigit({ num, setNum, digit, sensitivity }: Props) {

    const previousY = useRef<number>(-1);
    const [scrollLocked, setScrollLocked] = useScrollLock();

    function documentListener(e: MouseEvent) {

        e.stopPropagation();
        e.preventDefault();
        const y = e.screenY;

        if (previousY.current < 0) {
            previousY.current = y;

        } else {

            const diff = (y - previousY.current) / sensitivity;
            setNum((prevNum: number) => {
                return prevNum - diff;
            })
            previousY.current = y;
        }
    }


    function removeMouseMoveListener() {
        document.removeEventListener("pointermove", documentListener)
        document.removeEventListener("pointerup", removeMouseMoveListener)
        previousY.current = -1;
        setScrollLocked(false);
    }

    return (
        <div className="dial-digit-container">
            < div className='dial-digit'
                onPointerDown={(e: React.MouseEvent) => {
                    setScrollLocked(true);
                    document.addEventListener("pointermove", documentListener)
                    document.addEventListener("pointerup", removeMouseMoveListener)
                }}

                onPointerUp={(e: React.MouseEvent) => {
                    setScrollLocked(false);
                    document.removeEventListener("pointermove", documentListener)
                    document.removeEventListener("pointerup", removeMouseMoveListener)
                }}

                onDoubleClick={() => setNum((prevNum: number) => {
                    return Math.floor(Math.abs(prevNum) / Math.pow(10, digit))
                        * Math.pow(10, digit) * Math.sign(prevNum);
                })}
            >
                {Math.floor(Math.abs(num) / Math.pow(10, digit)) % 10}
            </div >

        </div>

    )
}