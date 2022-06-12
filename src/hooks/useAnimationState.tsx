import React, { useRef, useState } from 'react'

export type AnimationState = {
    active: boolean
    setActive: (active: boolean) => void
    activeRef: React.MutableRefObject<number>

    reach: number
    speed: number
    phase: number

    setReach: (reach: number) => void
    setSpeed: (speed: number) => void
    setPhase: (phase: number) => void
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
}

export default function useAnimationState() {

    const [reach, setReach] = useState(0);
    const [speed, setSpeed] = useState(0);
    const [phase, setPhase] = useState(0);
    const [active, setActive] = useState<boolean>(false);
    const activeRef = useRef<number>(0);

    return {
        reach, setReach,
        speed, setSpeed,
        phase, setPhase,
        active, setActive,
        activeRef
    }
}