import Canvas from './Canvas';
import React, { useEffect, useState } from 'react'
import { Button, ColorInput, Slider, TextInput } from '@mantine/core';
import SliderControl from './SliderControl';
import useStateWithHistory, { UseStateWithHistoryReturnType } from '../hooks/useStateWithHistory';
import useLineworksData, { Linework } from '../contexts/LineworksContext';

type Props = {}

const [centerX, centerY] = [400, 400];

export default function Controls({ }: Props) {

    const sliderColor = "gray";

    const { getSelectedLinework,
        saveLinework,
        addLinework,
        setSelectedLinework } = useLineworksData();
    const linework = getSelectedLinework();

    useEffect(() => {

        angle.initValue(linework.angle);
        subLines.initValue(linework.subLines);
        sineFactor.initValue(linework.sineFactor);
        cosineFactor.initValue(linework.cosineFactor);
        sineFreq.initValue(linework.sineFreq);
        cosineFreq.initValue(linework.cosineFreq);

        setNumOfLines(linework.numOfLines);
        setLengthChange(linework.size);

        setBgColor(linework.bgColor);
        setLineColor(linework.lineColor);
        setName(linework.name);
    }, [linework])

    const [name, setName] = useState('New Linework');

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

    const [bgColor, setBgColor] = useState('#ffffffff');
    const [lineColor, setLineColor] = useState('#0000007f');


    const totalAngleInterval = angle.value + angleFine + angleMicro;
    const sineFreqTotal = sineFreq.value + sineFreqFine;
    const cosineFreqTotal = cosineFreq.value + cosineFreqFine;
    const lineIncrement = 1 / (subLines.value + subLinesFine + subLinesMicro);


    function paramsToLinework(): Linework {

        const linework: Linework = {
            name,
            bgColor,
            lineColor,

            size: lengthChange,
            numOfLines,
            angle: angle.value,
            subLines: subLines.value,
            sineFactor: sineFactor.value,
            sineFreq: sineFreq.value,
            cosineFactor: cosineFactor.value,
            cosineFreq: cosineFreq.value
        }
        return linework;
    }

    function handleSave() {
        const newLinework = paramsToLinework();
        saveLinework(newLinework);
    }

    function handleSaveAsNew() {
        setSelectedLinework(addLinework(paramsToLinework()));
    }

    const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.strokeStyle = lineColor;
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
        <div className="canvas-and-controls-container" >
            <div className="canvas-container">
                <Canvas
                    draw={draw}
                ></Canvas>
            </div>

            <div className="controls-container">

                <TextInput
                    value={name}
                    onChange={(event) => setName(event.currentTarget.value)}
                    placeholder="Linework Name"
                />

                <div className="color-controls-container">
                    <div className="color-control-container">
                        Background Color
                        <ColorInput
                            value={bgColor}
                            onChange={setBgColor}
                            format="rgba"
                        />
                    </div>

                    <div className="color-control container">
                        Line Color
                        <ColorInput
                            value={lineColor}
                            onChange={setLineColor}
                            format="rgba"
                        />
                    </div>
                </div>
                Size
                <Slider
                    min={0}
                    max={500}
                    value={lengthChange}
                    onChange={setLengthChange}
                    color={sliderColor}
                />

                Number of lines
                <Slider
                    min={1}
                    max={14000}
                    value={numOfLines}
                    onChange={setNumOfLines}
                    color={sliderColor}
                />

                <div className="control-group">

                    <SliderControl name={'Angle'}
                        min={-0.2} max={6.7} step={0.01}
                        state={angle}
                        resetValue={0}
                        color={sliderColor}
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
                        color={sliderColor}
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
                        color={sliderColor}
                    />

                </div>

                <div className="control-group">
                    <SliderControl name={'Sub Lines'}
                        min={0.1} max={10} step={0.01}
                        state={subLines}
                        resetValue={1}
                        color={sliderColor}
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
                        color={sliderColor}
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
                        color={sliderColor}
                    /></div>



                <SliderControl name={'Sine Factor'}
                    min={-1} max={1} step={0.01}
                    state={sineFactor}
                    resetValue={0}
                    color={sliderColor}
                />

                <div className="control-group">


                    <SliderControl name={'Sine Frequency'}
                        min={-1} max={1} step={0.01}
                        state={sineFreq}
                        resetValue={0}
                        color={sliderColor}
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
                        color={sliderColor}
                    />
                </div>

                <SliderControl name={'Cosine Factor'}
                    min={-1} max={1} step={0.01}
                    state={cosineFactor}
                    resetValue={0}
                    color={sliderColor}
                />

                <div className="control-group">

                    <SliderControl name={'Cosine Frequency'}
                        min={-1} max={1} step={0.01}
                        state={cosineFreq}
                        resetValue={0}
                        color={sliderColor}
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
                        color={sliderColor}
                    />
                </div>

                <Button className='controls-button'
                    onClick={handleSave}
                >Save</Button>

                <Button className='controls-button'
                    color='teal'
                    onClick={handleSaveAsNew}
                >Save As New</Button>
            </div>
        </div>
    )
}