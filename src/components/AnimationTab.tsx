
import { ActionIcon, Button, Menu, Switch } from '@mantine/core'
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

    const emptyAnimations = getEmptyAnimationNames(animationStates);
    const ongoingAnimations = getOngoingAnimationNames(animationStates);

    return (
        <div className="animation-tab-container">
            <Switch
                onLabel='ON'
                offLabel='OFF'
                size='lg'
                checked={animationOn}
                onChange={(event) => setAnimationOn(event.currentTarget.checked)}
            />

            <div className="animation-speed-container">
                Animations Speed
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

            <Menu control={<Button>Add Animation</Button>} >
                {emptyAnimations.map((animationName) => {
                    const animationState = animationStates[animationName as keyof AnimationStates];
                    return (
                        <Menu.Item
                            onClick={() => animationState.setActive(true)}
                        >{animationName}</Menu.Item>
                    )
                })}

            </Menu>

            {ongoingAnimations.map((animationName: string) => {
                const animationState = animationStates[animationName as keyof AnimationStates];
                return (
                    <AnimationControl
                        animationState={animationState}
                        name={animationName}
                    />
                )
            })}

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

function getEmptyAnimationNames(animationStates: AnimationStates) {

    const emptyAnimationNames: string[] = [];

    (Object.keys(animationStates) as (keyof typeof animationStates)[])
        .forEach((animationKey) => {

            const animation = animationStates[animationKey];
            if (!animation.active) {
                emptyAnimationNames.push(animationKey);
            }
        });
    return emptyAnimationNames;
}

function getOngoingAnimationNames(animationStates: AnimationStates) {

    const ongoingAnimationNames: string[] = [];

    (Object.keys(animationStates) as (keyof typeof animationStates)[])
        .forEach((animationKey) => {

            const animation = animationStates[animationKey];
            if (animation.active) {
                ongoingAnimationNames.push(animationKey);
            }
        });
    return ongoingAnimationNames;
}