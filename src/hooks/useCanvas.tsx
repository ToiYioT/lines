
import React, { useEffect, useLayoutEffect, useRef } from 'react'

type Props = {
    draw: (context: CanvasRenderingContext2D, frameCount: number) => void
}

export default function useCanvas({ draw }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useLayoutEffect(() => {

        const canvas = canvasRef.current as HTMLCanvasElement;
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        let frameCount = 0;
        let animationFrameId: number;

        const render = () => {
            frameCount++;
            draw(context, frameCount);
            animationFrameId = window.requestAnimationFrame(render);
        };
        render();

        return () => {
            window.cancelAnimationFrame(animationFrameId);
        }
    }, [draw]);

    return canvasRef
}