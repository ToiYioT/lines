import React from 'react'
import { Button } from '@mantine/core'
import { Linework } from '../contexts/LineworksContext'
import Canvas from './Canvas'
import GalleryTileMenu from './GalleryTileMenu'

type Props = {
    removeLinework: (event: React.MouseEvent) => void
    setSelected: () => void
    linework: Linework
    selected: boolean
}

const [centerX, centerY] = [100, 100]

export default function GalleryTile({
    removeLinework, setSelected, linework, selected }: Props) {


    const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        ctx.lineWidth = .2;
        ctx.fillStyle = linework.bgColor;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.strokeStyle = linework.lineColor;
        ctx.beginPath();


        let lineIncrement = 1 / linework.subLines;
        if (lineIncrement < .02) lineIncrement = .02;

        const skewAngle = linework.skewAngle ? Math.PI * linework.skewAngle / 180 : 0;
        const skip = linework.skip ? linework.skip : 1;
        const skew = linework.skew ? linework.skew : 1;

        const angle = linework.angle / 180 * Math.PI;
        const sineFreq = linework.sineFreq / 180 * Math.PI;
        const cosineFreq = linework.cosineFreq / 180 * Math.PI;

        let counter = 0;

        for (let i = 0; i < linework.numOfLines; i += lineIncrement * skip) {
            counter++;
            const iNext = i + lineIncrement;

            const size = .2 * linework.size *
                (linework.sineFactor * Math.sin(sineFreq * i) +
                    linework.cosineFactor * Math.cos(cosineFreq * i));

            const sizeNext = .2 * linework.size *
                (linework.sineFactor * Math.sin(sineFreq * iNext) +
                    linework.cosineFactor * Math.cos(cosineFreq * iNext));

            const angleNow = i * angle;

            const nextAngleBonus = 1 - ((counter % skew) / skew);
            const angleNext = iNext * angle + nextAngleBonus * skewAngle;

            ctx.moveTo(
                centerX + size * Math.cos(angleNow),
                centerY + size * Math.sin(angleNow)
            );

            ctx.lineTo(
                centerX + sizeNext * Math.cos(angleNext),
                centerY + sizeNext * Math.sin(angleNext)
            );
        }
        ctx.stroke();
    }

    return (
        <div className={"gallery-item" + (selected ? " gallery-item-selected" : "")} >

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
                    animate={false}
                />
            </div>

            {selected &&
                <div className="gallery-item-selected-mark">
                    Currently Selected
                </div>}
        </div>
    )
}