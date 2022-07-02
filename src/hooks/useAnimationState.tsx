import { NumberInputHandlers } from '@mantine/core'
import React, { useRef, useState } from 'react'

export type AnimationState = {
    active: boolean

    reach: number
    speed: number
    phase: number
}

export type UseAnimationStateReturnType = {
    active: boolean
    setActive: React.Dispatch<React.SetStateAction<boolean>>

    reach: number
    speed: number
    phase: number

    setReach: React.Dispatch<React.SetStateAction<number>>
    setSpeed: React.Dispatch<React.SetStateAction<number>>
    setPhase: React.Dispatch<React.SetStateAction<number>>
}

export type AllAnimationsType = {
    size: UseAnimationStateReturnType
    numOfLines: UseAnimationStateReturnType
    angle: UseAnimationStateReturnType
    subLines: UseAnimationStateReturnType
    sineFactor: UseAnimationStateReturnType
    cosineFactor: UseAnimationStateReturnType
    sineFreq: UseAnimationStateReturnType
    cosineFreq: UseAnimationStateReturnType
    skewAngle: UseAnimationStateReturnType
}

function getNewAnimationState(defaultReach = 0.0001, defaultSpeed = 0.05, defaultPhase = 0) {
    return ({
        active: false,
        reach: defaultReach,
        speed: defaultSpeed,
        phase: defaultPhase,
    });
}

export function getNewAnimationStates() {
    return (
        {
            size: getNewAnimationState(100),
            numOfLines: getNewAnimationState(100),

            angle: getNewAnimationState(),
            subLines: getNewAnimationState(),
            sineFactor: getNewAnimationState(0.2),
            cosineFactor: getNewAnimationState(0.2),
            sineFreq: getNewAnimationState(),
            cosineFreq: getNewAnimationState(),

            skewAngle: getNewAnimationState(10),
        })
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
    } as UseAnimationStateReturnType;
}