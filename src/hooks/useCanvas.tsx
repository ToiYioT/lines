
import React, { useEffect, useLayoutEffect, useRef } from 'react'

type Props = {
    draw: (context: CanvasRenderingContext2D, frameCount: number) => void
    animate: boolean
    dimensions: { width: number, height: number }
}

export default function useCanvas({ draw, animate, dimensions }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        const canvas = canvasRef.current as HTMLCanvasElement;
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;

        const ratio = window.devicePixelRatio;

        canvas.width = dimensions.width * ratio;
        canvas.height = dimensions.height * ratio;
        canvas.style.width = dimensions.width + "px";
        canvas.style.height = dimensions.height + "px";
        context.scale(ratio, ratio);
    }, [dimensions]);

    useEffect(() => {

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