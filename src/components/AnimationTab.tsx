
import { ActionIcon, Switch } from '@mantine/core'
import React from 'react'
import { ChevronsLeft, ChevronsRight } from 'tabler-icons-react'
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

            <div className="animation-speed-container">
                Animation Speed
                <ActionIcon
                    disabled={!animationOn}
                    onClick={() => speedUpAnimations(animationStates, 0.5)}
                >
                    <ChevronsLeft />
                </ActionIcon>

                <ActionIcon
                    disabled={!animationOn}
                    onClick={() => speedUpAnimations(animationStates, 2)}
                >
                    <ChevronsRight />
                </ActionIcon>

            </div>


            <AnimationControl animationStates={animationStates} />
            <AnimationControl animationStates={animationStates} />
        </div>

    )
}

function speedUpAnimations(animationStates: AnimationStates, speedUpBy: number) {

    (Object.keys(animationStates) as (keyof typeof animationStates)[])
        .forEach((animationKey) => {

            const animation = animationStates[animationKey];
            if (animation.active) {
                animation.setSpeed(animation.speed * speedUpBy)
            }
        });
}