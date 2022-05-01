
import { ActionIcon, Slider } from '@mantine/core';
import { Exchange } from 'tabler-icons-react';
import React from 'react'

type Props = {
    name: string
    min: number
    max: number
    step: number

    value: number
    onChange: (value: number) => void

    resetValue?: number
}

export default function SliderControl({ name, min, max, step, value, onChange, resetValue }: Props) {

    const resetButton = resetValue != null;

    return (
        <div className="slider-section-container">

            <div className="slider-name">{name}</div>

            <div className="slider-and-buttons-container">

                <div className="slider-container">
                    <Slider
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={onChange}
                    />

                </div>
                <div className="buttons-container">
                    {resetButton &&
                        <ActionIcon size="sm" onClick={() => onChange(resetValue)} >
                            <Exchange strokeWidth={1} size={16} />
                        </ActionIcon>
                    }

                </div>


            </div>

        </div>
    )
}