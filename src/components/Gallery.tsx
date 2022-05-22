
import { Button, Modal } from '@mantine/core'
import React, { useState } from 'react'
import useLineworksData from '../contexts/LineworksContext';
import GalleryTile from './GalleryTile';

type Props = {}

export default function Gallery({ }: Props) {

    const [opened, setOpened] = useState(false);
    const {
        lineworkItems,
        addNewLinework,
        removeLinework,
        setSelectedLinework } = useLineworksData();

    function handleAddNewLineWork() {
        setSelectedLinework(addNewLinework());
        setOpened(false);
    }

    return (
        <>
            <Button
                onClick={() => setOpened(true)}
                style={{
                    position: "fixed",
                    top: "calc(800px + 1rem)",
                    left: ".5rem"
                }}
            >Open Gallery</Button>

            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Gallery"
                size="55%"
            >
                <div className="gallery-view">
                    <div className="gallery-grid"> {
                        lineworkItems.map(item => {
                            return (
                                <GalleryTile
                                    removeLinework={(e: React.MouseEvent) => {
                                        removeLinework(item.id)
                                        e.stopPropagation();
                                    }}
                                    setSelected={() => {
                                        setSelectedLinework(item.id)
                                        setOpened(false);
                                    }}
                                    linework={item.linework}
                                />
                            )
                        })
                    }
                    </div>

                    <Button onClick={handleAddNewLineWork}
                    >+</Button>

                </div>
            </Modal>
        </>
    )
}