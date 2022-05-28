
import React, { useEffect, useLayoutEffect, useRef } from 'react'

type Props = {
    draw: (context: CanvasRenderingContext2D, frameCount: number) => void
    animate: boolean
}

export default function useCanvas({ draw, animate }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useLayoutEffect(() => {

        const canvas = canvasRef.current as HTMLCanvasElement;
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        let frameCount = 0;
        let animationFrameId: number;

        const render = () => {
            frameCount++;
            draw(context, frameCount);

            // comment to cancel animation:
            if (animate) {
                animationFrameId = window.requestAnimationFrame(render);
            }
        };
        render();

        return () => {
            window.cancelAnimationFrame(animationFrameId);
        }
    }, [draw]);

    return canvasRef
}