import React from 'react'
import useLineworksData from '../contexts/LineworksContext';
import useCanvas from '../hooks/useCanvas';

type Props = {
    draw: (context: CanvasRenderingContext2D, frameCount: number) => void
    dimensions: { width: number, height: number }
    animate: boolean
}

export default function Canvas(props: Props) {

    const { draw, dimensions, animate, ...rest } = props;
    const canvasRef = useCanvas({ draw, animate });

    return <canvas
        width={dimensions.width}
        height={dimensions.height}
        className='canvas'
        ref={canvasRef} {...rest} />
}