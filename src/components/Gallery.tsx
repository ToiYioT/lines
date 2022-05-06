
import { Button, Modal } from '@mantine/core'
import React, { useState } from 'react'

type Props = {}

export default function Gallery({ }: Props) {

    const [opened, setOpened] = useState(false);

    return (
        <>
            <Button onClick={() => setOpened(true)}
            >Open Gallery</Button>

            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Gallery"
                size="55%"
            >
                <div className="gallery-grid">
                    <div className="gallery-item"></div>
                    <div className="gallery-item"></div>
                    <div className="gallery-item"></div>

                </div>
            </Modal>
        </>
    )
}