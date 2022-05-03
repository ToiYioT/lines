import React, { useRef, useState } from 'react'

export type UseStateWithHistoryReturnType = {
    value: number,
    setValue: (prevValue: ((prev: number) => number) | number) => void,
    setHistoryValue: (value: number) => void,
    undoHistory: () => number,
};


export default function useStateWithHistory(defaultValue: number): UseStateWithHistoryReturnType {

    const [value, setValue] = useState(defaultValue);

    const historyValues = useRef<number[]>([]);
    const originalValue = useRef<number>(defaultValue);

    function setHistoryValue(newValue: number) {
        const lastValue = historyValues.current.slice(-1).pop();
        if (lastValue != newValue) {

            historyValues.current.push(newValue);
        }
    }

    function undoHistory() {

        const lastValue = historyValues.current.pop();
        const valueToSet = lastValue ? lastValue : originalValue.current;
        setValue(valueToSet);
        return valueToSet;
    }

    return { value, setValue, setHistoryValue, undoHistory };
}