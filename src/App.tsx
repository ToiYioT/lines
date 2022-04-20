import React from 'react';
import './css/app.css'
import Canvas from './components/Canvas';

const [centerX, centerY] = [100, 100];
const magnitude = 50;
const angle = Math.PI / 1.5;

function App() {


  const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {

    const skew = 1 + Math.sin(frameCount * 0.01) * 0.03;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.strokeStyle = '#800000'
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);

    for (let i = 0; i < 100; i++) {

      const size = magnitude + 10 * Math.sin(i / 10);

      ctx.lineTo(
        centerX + size * Math.cos(i * angle * skew),
        centerY + size * Math.sin(i * angle * skew)
      );
    }

    // ctx.fill();
    ctx.stroke();
  }

  return (
    <Canvas
      draw={draw}
    ></Canvas>
  );
}

export default App;
