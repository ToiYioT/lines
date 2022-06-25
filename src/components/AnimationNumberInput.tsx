
import { ActionIcon, Button, NumberInput } from '@mantine/core'
import React from 'react'
import { CircleMinus, CirclePlus } from 'tabler-icons-react'

type Props = {
    label: string
    value: number
    setValue: (value: number) => void
}

export default function AnimationNumberInput({ label, value, setValue }: Props) {
    return (

        <div className="animation-number-input-container">


            <ActionIcon
                onClick={() => setValue(value / 2)}
            >
                <CircleMinus size={24} />
            </ActionIcon>

            <NumberInput
                label={label}
                size='xs'
                value={value}
                onChange={(val: number) => setValue(val)}
                // disabled={!active}
                hideControls

                step={.00001}
                precision={5}
            />
            <ActionIcon
                onClick={() => setValue(value * 2)}
            >
                <CirclePlus size={24} />
            </ActionIcon>
        </div>
    )
}