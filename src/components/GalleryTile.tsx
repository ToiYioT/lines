import React from 'react'
import { Button } from '@mantine/core'
import { Linework } from '../contexts/LineworksContext'

type Props = {
    removeLinework: () => void
    setSelected: () => void
    lineWork: Linework
}

export default function GalleryTile({
    removeLinework, setSelected, lineWork }: Props) {

    return (
        <div className="gallery-item"
            onClick={setSelected}
        >
            <Button
                onClick={() => removeLinework()}
                color="red"
            >X</Button>

            <div className="gallery-item-name">
                {lineWork.name}
            </div>
        </div>
    )
}