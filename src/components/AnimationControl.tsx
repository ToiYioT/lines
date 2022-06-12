
import React, { useState } from 'react'
import { NumberInput, Switch, Select } from '@mantine/core';
import { AnimationStates } from '../hooks/useAnimationState';


type Props = {
    animationStates: AnimationStates
}


const animationTargets = [
    "size", "numOfLines", "angle", "subLines",
    "sineFactor", "cosineFactor", "sineFreq", "cosineFreq"
]

export default function AnimationControl({ animationStates }: Props) {

    const [value, setValue] = useState<string | null>(null);

    const animationTargetKey = value != null
        ? value as keyof typeof animationStates
        : "angle";


    const { active, setActive, activeRef,
        reach, setReach,
        speed, setSpeed,
        phase, setPhase } = animationStates[animationTargetKey];


    return (
        <div className="animation-control-container">

            <div className="animation-routing-container">
                <Select
                    value={value}
                    onChange={setValue}
                    data={Object.keys(animationStates)}

                    label="Route to"
                    placeholder="What to animate"
                // defaultValue={['']}
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

                    step={.0001}
                    precision={4}

                    stepHoldDelay={300}
                    stepHoldInterval={100}
                />
            </div>



        </div>

    )
}