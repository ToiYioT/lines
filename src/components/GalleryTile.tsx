import React from 'react'
import { Button } from '@mantine/core'

type Props = {
    removeLinework: () => void
}

export default function GalleryTile({ removeLinework }: Props) {
    return (
        <div className="gallery-item"
        >
            <Button
                onClick={() => removeLinework()}
            >X</Button>

        </div>
    )
}