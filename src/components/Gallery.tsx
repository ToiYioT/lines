
import { Button, Modal } from '@mantine/core'
import React, { useState } from 'react'
import useLineworksData from '../contexts/LineworksContext';
import GalleryTile from './GalleryTile';

type Props = {}

export default function Gallery({ }: Props) {

    const [opened, setOpened] = useState(false);
    const { lineworkItems,
        addNewLinework, removeLinework } = useLineworksData();

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
                <div className="gallery-view">
                    <div className="gallery-grid">
                        {
                            lineworkItems.map(item => {
                                return (
                                    <GalleryTile
                                        removeLinework={() => removeLinework(item.id)}
                                    />
                                )
                            })
                        }
                    </div>

                    <Button onClick={addNewLinework}
                    >+</Button>

                </div>
            </Modal>
        </>
    )
}