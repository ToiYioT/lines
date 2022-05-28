
import React, { useState } from 'react'
import { NumberInput, Switch } from '@mantine/core';
import { AnimationState } from '../hooks/useAnimationState';


type Props = {
    animationState: AnimationState
}

export default function AnimationControl({ animationState }: Props) {

    const { active, setActive, activeRef,
        reach, setReach,
        speed, setSpeed,
        phase, setPhase } = animationState;

    return (
        <div className="animation-control-container">

            <Switch
                color={"gray"}
                checked={active}
                onChange={(event) => {
                    const checked = event.currentTarget.checked;
                    setActive(checked);
                    activeRef.current = checked ? 1 : 0;
                }}
            />

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

                stepHoldDelay={300}
                stepHoldInterval={100}
            />
        </div>
    )
}