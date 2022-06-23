
import React, { useState } from 'react'
import { NumberInput, Switch, Select, Menu } from '@mantine/core';
import { AnimationState } from '../hooks/useAnimationState';
import { Trash } from 'tabler-icons-react';


type Props = {
    name: string
    animationState: AnimationState
}


const animationTargets = [
    "size", "numOfLines", "angle", "subLines",
    "sineFactor", "cosineFactor", "sineFreq", "cosineFreq"
]

export default function AnimationControl({ animationState, name }: Props) {

    const { active, setActive,
        reach, setReach,
        speed, setSpeed,
        phase, setPhase } = animationState;

    return (
        <div className="animation-control-container">

            <div className="animation-name-container">
                {name}
            </div>

            <div className="animation-item-menu-container">
                <Menu>
                    <Menu.Item
                        icon={<Trash size={14} />}
                        onClick={() => setActive(false)}
                    >Remove</Menu.Item>
                </Menu>
            </div>

            <div className="animation-reach-speed-phase-container">

                <NumberInput
                    defaultValue={0}
                    label="Reach"
                    size='xs'
                    value={reach} onChange={(val: number) => setReach(val)}
                    disabled={!active}

                    stepHoldDelay={300}
                    stepHoldInterval={100}
                    step={.0001}
                    precision={4}

                />
                <NumberInput
                    defaultValue={0}
                    label="Speed"
                    size='xs'
                    value={speed} onChange={(val: number) => setSpeed(val)}
                    disabled={!active}

                    stepHoldDelay={300}
                    stepHoldInterval={100}
                    step={.0001}
                    precision={4}
                />

                <NumberInput
                    defaultValue={0}
                    label="Phase"
                    size='xs'
                    value={phase} onChange={(val: number) => setPhase(val)}
                    disabled={!active}

                    step={.0001}
                    precision={4}

                    stepHoldDelay={300}
                    stepHoldInterval={100}
                />
            </div>

        </div>
    )
}