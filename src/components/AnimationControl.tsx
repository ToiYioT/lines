
import React, { useState } from 'react'
import { NumberInput, Switch, MultiSelect } from '@mantine/core';
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

            <div className="animation-routing-container">
                <MultiSelect
                    data={['React', 'Angular', 'Svelte', 'Vue', 'Riot', 'Next.js', 'Blitz.js']}
                    label="Route to"
                    placeholder="Pick all that you like"
                    defaultValue={['']}
                    clearButtonLabel="Clear selection"
                    clearable
                />
                <Switch
                    color={"lime"}
                    checked={active}
                    onChange={(event) => {
                        const checked = event.currentTarget.checked;
                        setActive(checked);
                        activeRef.current = checked ? 1 : 0;
                    }}
                />
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

                    stepHoldDelay={300}
                    stepHoldInterval={100}
                />
            </div>



        </div>

    )
}