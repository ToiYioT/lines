import React from 'react'
import { Button } from '@mantine/core'
import { Linework } from '../contexts/LineworksContext'
import Canvas from './Canvas'
import GalleryTileMenu from './GalleryTileMenu'

type Props = {
    removeLinework: (event: React.MouseEvent) => void
    setSelected: () => void
    linework: Linework
}

const [centerX, centerY] = [100, 100]

export default function GalleryTile({
    removeLinework, setSelected, linework }: Props) {


    const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        ctx.lineWidth = .2;
        ctx.fillStyle = linework.bgColor;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.strokeStyle = linework.lineColor;
        ctx.beginPath();

        for (let i = 0; i < linework.numOfLines; i += 1 / linework.subLines) {

            const size = .2 * linework.size *
                (linework.sineFactor * Math.sin(linework.sineFreq * i) +
                    linework.cosineFactor * Math.cos(linework.cosineFreq * i));


            ctx.lineTo(
                centerX + size * Math.cos(i * linework.angle),
                centerY + size * Math.sin(i * linework.angle)
            );
        }
        ctx.stroke();
    }

    return (
        <div className="gallery-item" >

            <GalleryTileMenu
                removeLinework={removeLinework}
            />

            <div className="gallery-item-name">
                {linework.name}
            </div>

            <div className="canvas-thumbnail"
                onClick={setSelected} >
                <Canvas
                    draw={draw}
                    dimensions={{ width: 200, height: 200 }}
                />
            </div>
        </div>
    )
}