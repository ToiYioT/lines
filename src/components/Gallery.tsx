
import { ActionIcon, Button, Modal } from '@mantine/core'
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
        setSelectedLinework,
        getSelectedLineworkId } = useLineworksData();

    function handleAddNewLineWork() {
        setSelectedLinework(addNewLinework());
        setOpened(false);
    }

    return (
        <>
            <Button color="gray" variant='light'
                onClick={() => setOpened(true)}
                style={{
                    position: "fixed",
                    // top: "calc(800px + 1rem)",
                    bottom: "1rem",
                    left: ".5rem",
                    opacity: ".9"
                }}
            >GALLERY</Button>

            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Gallery"
                size="55%"
                styles={{ modal: { backgroundColor: "rgba(240,240,240,0.90)" } }}
            >

                <div className="add-gallery-item-button">
                    <Button
                        onClick={handleAddNewLineWork}
                        variant="light"
                        radius="lg"
                        color="gray"
                    >
                        ADD NEW
                    </Button>

                </div>

                <div className="gallery-view">
                    <div className="gallery-grid"> {
                        lineworkItems.slice(0).reverse().map(item => {
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
                                    selected={item.id === getSelectedLineworkId()}
                                />
                            )
                        })
                    }
                    </div>

                </div>
            </Modal>
        </>
    )
}