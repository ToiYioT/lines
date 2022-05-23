import React from 'react'
import { Menu, Divider, Text } from '@mantine/core';
import { Settings, Search, Photo, MessageCircle, Trash, ArrowsLeftRight } from 'tabler-icons-react';
import { useDisclosure } from '@mantine/hooks';


type Props = {
    removeLinework: (event: React.MouseEvent) => void
}

export default function GalleryTileMenu({ removeLinework }: Props) {

    const [opened, handlers] = useDisclosure(false);

    return (
        <Menu opened={opened} onOpen={handlers.open} onClose={handlers.close}
            className="gallery-tile-menu-button"
        >
            <Menu.Item color="red" icon={<Trash size={14} />}
                onClick={(e: React.MouseEvent) => removeLinework(e)}
            >Delete</Menu.Item>
        </Menu>
    );
}