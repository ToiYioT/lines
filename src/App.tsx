import React, { useState } from 'react';
import './css/app.css'
import Canvas from './components/Canvas';
import { Slider } from '@mantine/core';

const [centerX, centerY] = [400, 400];
const spread = 250;
// const angle = Math.PI / 1.5;

function App() {

  const [angle, setAngle] = useState(Math.PI);
  const [angleFine, setAngleFine] = useState(0);
  const [angleMicro, setAngleMicro] = useState(0);
  const [numOfLines, setNumOfLines] = useState(100);

  const [lengthChange, setLengthChange] = useState(0);
  const [lengthChangeFrequency, setLengthChangeFrequency] = useState(1);
  const [lengthChangeFrequencyMicro, setLengthChangeFrequencyMicro] = useState(0);

  const totalAngle = angle + angleFine + angleMicro;
  const lengthChangeFrequencyTotal = lengthChangeFrequency + lengthChangeFrequencyMicro;

  const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.strokeStyle = '#80000080'
    ctx.beginPath();

    for (let i = 0; i < numOfLines; i++) {

      const size = spread + lengthChange * Math.sin(i / lengthChangeFrequencyTotal);

      ctx.lineTo(
        centerX + size * Math.cos(i * totalAngle),
        centerY + size * Math.sin(i * totalAngle)
      );
    }

    ctx.stroke();
  }

  return (
    <div className="app-container">
      <Canvas
        draw={draw}
      ></Canvas>
      <div className="sliders-container">
        Angle
        <Slider
          min={-0.2}
          max={6}
          step={.01}
          onChange={setAngle}
        />

        Angle Fine
        <Slider
          min={-.05}
          max={.05}
          defaultValue={0}
          step={.0001}
          onChange={setAngleFine}
        />

        Angle Micro
        <Slider
          min={-.001}
          max={.001}
          defaultValue={0}
          step={.000001}
          onChange={setAngleMicro}
        />

        Number of lines
        <Slider
          min={1}
          max={4000}
          onChange={setNumOfLines}
        />

        Line Length Change
        <Slider
          min={0}
          max={150}
          onChange={setLengthChange}
        />

        Line Length Change Frequency
        <Slider
          min={.9}
          max={1.1}
          step={.0001}
          onChange={setLengthChangeFrequency}
        />

        Line Length Change Frequency Micro
        <Slider
          min={-0.001}
          max={0.001}
          step={.000001}
          onChange={setLengthChangeFrequencyMicro}
        />
      </div>
    </div>
  );
}

export default App;
