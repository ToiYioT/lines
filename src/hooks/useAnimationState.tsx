import React, { useRef, useState } from 'react'

export type AnimationState = {
    active: boolean
    setActive: (active: boolean) => void

    reach: number
    speed: number
    phase: number

    setReach: (reach: number) => void
    setSpeed: (speed: number) => void
    setPhase: (phase: number) => void
}


function getNewAnimationState() {
    return (
        {
            active: false,
            setActive: () => null,

            reach: 0.0001,
            speed: 0.1,
            phase: 0,

            setReach: (reach: number) => null,
            setSpeed: (speed: number) => null,
            setPhase: (phase: number) => null,
        }
    )
}

export function getNewAnimationStates() {
    return (
        {
            size: getNewAnimationState(),
            numOfLines: getNewAnimationState(),

            angle: getNewAnimationState(),
            subLines: getNewAnimationState(),
            sineFactor: getNewAnimationState(),
            cosineFactor: getNewAnimationState(),
            sineFreq: getNewAnimationState(),
            cosineFreq: getNewAnimationState(),

            skewAngle: getNewAnimationState(),
        }
    )

}

export type AnimationStates = {
    size: AnimationState
    numOfLines: AnimationState

    angle: AnimationState
    subLines: AnimationState
    sineFactor: AnimationState
    cosineFactor: AnimationState
    sineFreq: AnimationState
    cosineFreq: AnimationState

    skewAngle: AnimationState
}

export default function useAnimationState() {

    const [reach, setReach] = useState(0);
    const [speed, setSpeed] = useState(0);
    const [phase, setPhase] = useState(0);
    const [active, setActive] = useState<boolean>(false);

    return {
        reach, setReach,
        speed, setSpeed,
        phase, setPhase,
        active, setActive,
    }
}