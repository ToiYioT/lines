
import { ActionIcon } from '@mantine/core'
import React from 'react'
import { ArrowsMaximize, ArrowsMinimize } from 'tabler-icons-react'

type Props = {
    fullScreen: boolean
    setFullScreen: (fullScreenOn: boolean) => void
}

export default function FullScreenButton({ fullScreen, setFullScreen }: Props) {
    return (
        <ActionIcon
            onClick={() => setFullScreen(!fullScreen)}
            className="full-screen-button"
        >
            {fullScreen
                ? <ArrowsMinimize />
                : <ArrowsMaximize />
            }
        </ActionIcon>
    )
}