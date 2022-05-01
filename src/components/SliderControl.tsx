
import { ActionIcon, Slider } from '@mantine/core';
import { ArrowBackUp, Exchange } from 'tabler-icons-react';
import React, { useRef } from 'react'

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

    const historyValues = useRef<number[]>([]);
    const startValue = useRef<number>(value);
    const defaultValue = useRef<number>(value);

    const resetButton = resetValue != null;

    function undo() {

        const lastValue = historyValues.current.pop();
        if (lastValue) {
            onChange(lastValue);
            startValue.current = lastValue;
        } else {
            onChange(defaultValue.current);
            startValue.current = defaultValue.current;
        }
    }

    function onChangeEnd(endValue: number) {
        historyValues.current.push(startValue.current);
        startValue.current = endValue;

    }

    function reset() {
        onChange(resetValue!);

        historyValues.current.push(startValue.current);
        startValue.current = resetValue!;
    }

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

                        onChangeEnd={onChangeEnd}
                    />

                </div>
                <div className="buttons-container">

                    <ActionIcon size="sm" onClick={undo} >
                        <ArrowBackUp strokeWidth={1} size={16} />
                    </ActionIcon>

                    {resetButton &&
                        <ActionIcon size="sm" onClick={reset} >
                            <Exchange strokeWidth={1} size={16} />
                        </ActionIcon>
                    }

                </div>


            </div>

        </div>
    )
}