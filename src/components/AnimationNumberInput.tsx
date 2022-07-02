
import { ActionIcon, Button, NumberInput } from '@mantine/core'
import React from 'react'
import { CircleMinus, CirclePlus, Minus, Plus } from 'tabler-icons-react'
import Dial from './Dial'

type Props = {
    label: string
    value: number
    setValue: React.Dispatch<React.SetStateAction<number>>

    minValue?: number
    maxValue?: number
    omitSign?: boolean
}

export default function AnimationNumberInput({ label, value, setValue,
    minValue, maxValue, omitSign }: Props) {
    return (

        <div className="animation-detail-container">

            <div className="animation-detail-name-and-buttons">
                <div className="animation-detail-name">
                    {label}
                </div>
                <div className="animation-detail-buttons">
                    <ActionIcon
                        onClick={() => setValue(value / 2)}
                    >
                        <Minus size={24} />
                    </ActionIcon>
                    <ActionIcon
                        onClick={() => setValue(value * 2)}
                    >
                        <Plus size={24} />
                    </ActionIcon>
                </div>
            </div>

            < div className="animation-number-input-container" >
                <Dial
                    num={value}
                    setNum={setValue}
                    minValue={minValue}
                    maxValue={maxValue}
                    omitSign={omitSign}
                />
            </div >
        </div>

    )
}