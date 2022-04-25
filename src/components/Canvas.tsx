import React from 'react'
import useCanvas from '../hooks/useCanvas';

type Props = {
    draw: (context: CanvasRenderingContext2D, frameCount: number) => void
}

export default function Canvas(props: Props) {

    const { draw, ...rest } = props;
    const canvasRef = useCanvas({ draw });

    return <canvas
        width={800}
        height={800}
        className='canvas'
        ref={canvasRef} {...rest} />
}