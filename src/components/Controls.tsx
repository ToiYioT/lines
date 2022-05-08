import Canvas from './Canvas';
import React, { useEffect, useState } from 'react'
import { Button, Slider } from '@mantine/core';
import SliderControl from './SliderControl';
import useStateWithHistory, { UseStateWithHistoryReturnType } from '../hooks/useStateWithHistory';
import useLineworksData, { Linework } from '../contexts/LineworksContext';

type Props = {}

const [centerX, centerY] = [400, 400];

export default function Controls({ }: Props) {

    const { getSelectedLinework, saveLinework } = useLineworksData();
    const linework = getSelectedLinework();

    useEffect(() => {
        angle.setValue(linework.angle);
        subLines.setValue(linework.subLines);
        sineFactor.setValue(linework.sineFactor);
        cosineFactor.setValue(linework.cosineFactor);
        sineFreq.setValue(linework.sineFreq);
        cosineFreq.setValue(linework.cosineFreq);

        setNumOfLines(linework.numOfLines);
        setLengthChange(linework.size);
    }, [linework])

    const angle = useStateWithHistory(0);
    const [angleFine, setAngleFine] = useState(0);
    const [angleMicro, setAngleMicro] = useState(0);

    const [numOfLines, setNumOfLines] = useState(100);

    const subLines = useStateWithHistory(1);
    const [subLinesFine, setSubLinesFine] = useState(0);
    const [subLinesMicro, setSubLinesMicro] = useState(0);

    const [lengthChange, setLengthChange] = useState(200);

    const sineFactor = useStateWithHistory(1);
    const cosineFactor = useStateWithHistory(1);

    const sineFreq = useStateWithHistory(0);
    const cosineFreq = useStateWithHistory(0);

    const [sineFreqFine, setSineFreqFine] = useState(0);
    const [cosineFreqFine, setCosineFreqFine] = useState(0);



    const totalAngleInterval = angle.value + angleFine + angleMicro;
    const sineFreqTotal = sineFreq.value + sineFreqFine;
    const cosineFreqTotal = cosineFreq.value + cosineFreqFine;
    const lineIncrement = 1 / (subLines.value + subLinesFine + subLinesMicro);

    function handleSave() {
        const newLinework: Linework = {
            size: lengthChange,
            numOfLines,
            angle: angle.value,
            subLines: subLines.value,
            sineFactor: sineFactor.value,
            sineFreq: sineFreq.value,
            cosineFactor: cosineFactor.value,
            cosineFreq: cosineFreq.value
        }
        saveLinework(newLinework);
    }

    const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.strokeStyle = '#80000080'
        ctx.beginPath();

        for (let i = 0; i < numOfLines; i += lineIncrement) {

            const size = lengthChange *
                (sineFactor.value * Math.sin(sineFreqTotal * i) +
                    cosineFactor.value * Math.cos(cosineFreqTotal * i));

            const angle = i * totalAngleInterval;

            ctx.lineTo(
                centerX + size * Math.cos(angle),
                centerY + size * Math.sin(angle)
            );
        }
        ctx.stroke();
    }

    function handleAdditiveControlEnd(
        endValue: number,
        state: UseStateWithHistoryReturnType,
        resetParameterFunction: (resetValue: number) => void
    ) {

        state.setValue((prevValue: number) => {
            state.setHistoryValue(prevValue);
            return prevValue + endValue;
        });
        resetParameterFunction(0);

    }

    return (
        <div className="canvas-and-controls-container">
            <div className="canvas-container">
                <Canvas
                    draw={draw}
                ></Canvas>
            </div>

            <div className="controls-container">
                Size
                <Slider
                    min={0}
                    max={500}
                    value={lengthChange}
                    onChange={setLengthChange}
                />

                Number of lines
                <Slider
                    min={1}
                    max={14000}
                    value={numOfLines}
                    onChange={setNumOfLines}
                />

                <div className="control-group">

                    <SliderControl name={'Angle'}
                        min={-0.2} max={6.7} step={0.01}
                        state={angle}
                        resetValue={0}
                    />

                    Angle Fine
                    <Slider
                        min={-.05}
                        max={.05}
                        value={angleFine}
                        step={.0001}
                        onChange={setAngleFine}
                        onChangeEnd={(endValue: number) => {
                            handleAdditiveControlEnd(endValue, angle, setAngleFine);
                        }}
                    />

                    Angle Micro
                    <Slider
                        min={-.001}
                        max={.001}
                        step={.000001}
                        value={angleMicro}
                        onChange={setAngleMicro}
                        onChangeEnd={(endValue: number) => {
                            handleAdditiveControlEnd(endValue, angle, setAngleMicro);
                        }}
                    />

                </div>

                <div className="control-group">
                    <SliderControl name={'Sub Lines'}
                        min={0.1} max={10} step={0.01}
                        state={subLines}
                        resetValue={1}
                    />

                    Sub Lines Fine
                    <Slider
                        min={-0.01}
                        max={0.01}
                        value={subLinesFine}
                        step={.0001}
                        onChange={setSubLinesFine}
                        onChangeEnd={(endValue: number) => {
                            handleAdditiveControlEnd(endValue, subLines, setSubLinesFine);
                        }}
                    />

                    Sub Lines Micro
                    <Slider
                        min={-0.0001}
                        max={0.0001}
                        value={subLinesMicro}
                        step={.000001}
                        onChange={setSubLinesMicro}
                        onChangeEnd={(endValue: number) => {
                            handleAdditiveControlEnd(endValue, subLines, setSubLinesMicro);
                        }}
                    /></div>



                <SliderControl name={'Sine Factor'}
                    min={-1} max={1} step={0.01}
                    state={sineFactor}
                    resetValue={0}
                />

                <div className="control-group">


                    <SliderControl name={'Sine Frequency'}
                        min={-1} max={1} step={0.01}
                        state={sineFreq}
                        resetValue={0}
                    />

                    Sine Freq fine
                    <Slider
                        min={-.001}
                        max={.001}
                        value={sineFreqFine}
                        step={.00001}
                        onChange={setSineFreqFine}
                        onChangeEnd={(endValue: number) => {
                            handleAdditiveControlEnd(endValue, sineFreq, setSineFreqFine);
                        }}
                    />
                </div>

                <SliderControl name={'Cosine Factor'}
                    min={-1} max={1} step={0.01}
                    state={cosineFactor}
                    resetValue={0}
                />

                <div className="control-group">

                    <SliderControl name={'Cosine Frequency'}
                        min={-1} max={1} step={0.01}
                        state={cosineFreq}
                        resetValue={0}
                    />


                    Cosine Freq fine
                    <Slider
                        min={-.001}
                        max={.001}
                        value={cosineFreqFine}
                        step={.00001}
                        onChange={setCosineFreqFine}
                        onChangeEnd={(endValue: number) => {
                            handleAdditiveControlEnd(endValue, cosineFreq, setCosineFreqFine);
                        }}
                    />
                </div>
                <Button
                    onClick={handleSave}
                >Save</Button>
            </div>
        </div>
    )
}