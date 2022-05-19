import React from 'react'
import { Button } from '@mantine/core'
import { Linework } from '../contexts/LineworksContext'

type Props = {
    removeLinework: (event: React.MouseEvent) => void
    setSelected: () => void
    linework: Linework
}

export default function GalleryTile({
    removeLinework, setSelected, linework }: Props) {

    return (
        <div className="gallery-item"
            onClick={setSelected}
            style={{ backgroundColor: linework.bgColor }}
        >
            <Button
                onClick={(e: React.MouseEvent) => removeLinework(e)}
                color="red"
            >X</Button>

            <div
                className="gallery-item-name"
                style={{ color: linework.lineColor }}
            >
                {linework.name}
            </div>
        </div>
    )
}