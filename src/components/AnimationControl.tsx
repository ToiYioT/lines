
import React, { } from 'react'
import { NumberInput, Menu } from '@mantine/core';
import { UseAnimationStateReturnType } from '../hooks/useAnimationState';
import { Trash } from 'tabler-icons-react';
import AnimationNumberInput from './AnimationNumberInput';


type Props = {
    name: string
    animationState: UseAnimationStateReturnType
}


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

                <AnimationNumberInput
                    label='Reach'
                    value={reach}
                    setValue={setReach}
                />

                <AnimationNumberInput
                    label='Speed'
                    value={speed}
                    setValue={setSpeed}

                    minValue={0}
                    maxValue={1}
                    omitSign={true}
                />

                <NumberInput
                    defaultValue={0}
                    label="Phase"
                    size='xs'
                    value={phase} onChange={(val: number) => setPhase(val)}
                    disabled={!active}

                    step={.5}
                    precision={1}
                />
            </div>

        </div>
    )
}