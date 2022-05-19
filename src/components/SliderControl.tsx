
import { ActionIcon, Slider } from '@mantine/core';
import { ArrowBackUp, Exchange } from 'tabler-icons-react';
import React, { useRef } from 'react'
import { UseStateWithHistoryReturnType } from '../hooks/useStateWithHistory';

type Props = {
    name: string
    min: number
    max: number
    step: number

    state: UseStateWithHistoryReturnType

    resetValue?: number
    color: string
}

export default function SliderControl({ name, min, max, step, state, resetValue, color }: Props) {

    const { value, setValue, setHistoryValue, undoHistory } = state;

    const startValue = useRef<number>(value);
    const defaultValue = useRef<number>(value);

    const resetButton = resetValue != null;

    function undo() {
        const lastValue = undoHistory();
        startValue.current = lastValue;
    }

    function onChange(value: number) {
        setValue(value);
    }

    function onChangeEnd(endValue: number) {

        setValue(endValue);
        setHistoryValue(startValue.current);
        startValue.current = endValue;
    }

    function reset() {
        setHistoryValue(startValue.current);
        setValue(resetValue!);
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

                        color={color}
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