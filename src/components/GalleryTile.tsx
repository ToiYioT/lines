import React from 'react'
import { Button } from '@mantine/core'

type Props = {
    removeLinework: () => void
    setSelected: () => void
}

export default function GalleryTile({ removeLinework, setSelected }: Props) {
    return (
        <div className="gallery-item"
            onClick={setSelected}
        >
            <Button
                onClick={() => removeLinework()}
            >X</Button>

        </div>
    )
}