import Canvas from './Canvas';
import React, { useState } from 'react'
import { Slider } from '@mantine/core';

type Props = {}

const [centerX, centerY] = [400, 400];
const spread = 250;

export default function Controls({ }: Props) {

    const [angle, setAngle] = useState(Math.PI);
    const [angleFine, setAngleFine] = useState(0);
    const [angleMicro, setAngleMicro] = useState(0);
    const [numOfLines, setNumOfLines] = useState(100);

    const [lengthChange, setLengthChange] = useState(200);
    const [lengthChangeFrequency, setLengthChangeFrequency] = useState(1);
    const [lengthChangeFrequencyMicro, setLengthChangeFrequencyMicro] = useState(0);

    const [sineFactor, setSineFactor] = useState(1);
    const [cosineFactor, setCosineFactor] = useState(1);

    const [sineFreq, setSineFreq] = useState(1);
    const [cosineFreq, setCosineFreq] = useState(1);

    const [sineFreqFine, setSineFreqFine] = useState(0);
    const [cosineFreqFine, setCosineFreqFine] = useState(0);

    const totalAngleInterval = angle + angleFine + angleMicro;
    const lengthChangeFrequencyTotal = lengthChangeFrequency + lengthChangeFrequencyMicro;

    const sineFreqTotal = sineFreq + sineFreqFine;
    const cosineFreqTotal = cosineFreq + cosineFreqFine;

    const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.strokeStyle = '#80000080'
        ctx.beginPath();

        for (let i = 0; i < numOfLines; i++) {

            // const size = spread + lengthChange * Math.sin(i / lengthChangeFrequencyTotal);
            const size = lengthChange *
                (sineFactor * Math.sin(sineFreqTotal * i) +
                    cosineFactor * Math.cos(cosineFreqTotal * i));

            const angle = i * totalAngleInterval;

            ctx.lineTo(
                centerX + size * Math.cos(angle),
                centerY + size * Math.sin(angle)
            );
        }

        ctx.stroke();
    }


    return (
        <>

            <Canvas
                draw={draw}
            ></Canvas>

            <div className="controls-container">

                <div className="control-group">
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

                </div>

                Number of lines
                <Slider
                    min={1}
                    max={14000}
                    defaultValue={numOfLines}
                    onChange={setNumOfLines}
                />

                Size
                <Slider
                    min={0}
                    max={500}
                    defaultValue={lengthChange}
                    onChange={setLengthChange}
                />

                {/* Line Length Change Frequency
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
                /> */}

                <div className="control-group">

                    Sine Factor
                    <Slider
                        min={-1}
                        max={1}
                        defaultValue={sineFactor}
                        step={.01}
                        onChange={setSineFactor}
                    />

                    Sine Freq
                    <Slider
                        min={-1}
                        max={1}
                        defaultValue={sineFreq}
                        step={.01}
                        onChange={setSineFreq}
                    />

                    Sine Freq fine
                    <Slider
                        min={-.001}
                        max={.001}
                        defaultValue={sineFreqFine}
                        step={.00001}
                        onChange={setSineFreqFine}
                    />
                </div>

                <div className="control-group">


                    Cosine Factor
                    <Slider
                        min={-1}
                        max={1}
                        defaultValue={cosineFactor}
                        step={.01}
                        onChange={setCosineFactor}
                    />


                    Cosine Freq
                    <Slider
                        min={-1}
                        max={1}
                        defaultValue={cosineFreq}
                        step={.01}
                        onChange={setCosineFreq}
                    />


                    Cosine Freq fine
                    <Slider
                        min={-.001}
                        max={.001}
                        defaultValue={cosineFreqFine}
                        step={.00001}
                        onChange={setCosineFreqFine}
                    />
                </div>
            </div>
        </>
    )
}