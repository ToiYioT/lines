
import { Switch } from '@mantine/core'
import React from 'react'
import { AnimationStates } from '../hooks/useAnimationState'
import AnimationControl from './AnimationControl'

type Props = {
    animationStates: AnimationStates
    animationOn: boolean
    setAnimationOn: (on: boolean) => void
}

export default function AnimationTab({
    animationStates, animationOn, setAnimationOn }: Props) {

    return (
        <div className="animation-tab-container">

            <Switch label="Animation On"
                checked={animationOn}
                onChange={(event) => setAnimationOn(event.currentTarget.checked)}
            />

            <AnimationControl animationStates={animationStates} />
            <AnimationControl animationStates={animationStates} />
        </div>

    )
}