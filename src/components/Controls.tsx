import Canvas from './Canvas';
import React, { useEffect, useState } from 'react'
import { Button, ColorInput, Slider, TextInput } from '@mantine/core';
import SliderControl from './SliderControl';
import useStateWithHistory, { UseStateWithHistoryReturnType } from '../hooks/useStateWithHistory';
import useLineworksData, { Linework } from '../contexts/LineworksContext';

type Props = {}

const canvasDimenstions = 800;
const [centerX, centerY] = [canvasDimenstions / 2, canvasDimenstions / 2];

const [angleMin, angleMax] = [-.1, 6];
const [subLinesMin, subLinesMax] = [.1, 10];
const [sineFactorMin, sineFactorMax] = [-1, 1];
const [cosineFactorMin, cosineFactorMax] = [-1, 1];
const [sineFreqMin, sineFreqMax] = [-1, 1];
const [cosineFreqMin, cosineFreqMax] = [-1, 1];
const [numOfLinesMin, numOfLinesMax] = [1, 10000];
const [sizeMin, sizeMax] = [0, 4000];

export default function Controls({ }: Props) {

    const sliderColor = "gray";

    const { getSelectedLinework,
        saveLinework,
        addLinework,
        setSelectedLinework,
        setInitLinework } = useLineworksData();

    useEffect(() => {

        const initLineworkFunc = (linework: Linework) => {

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

        };

        setInitLinework(initLineworkFunc);
        initLineworkFunc(getSelectedLinework());
    }, [])

    function hasLineworkChanged() {
        const saved = getSelectedLinework();
        return !(
            saved.bgColor === bgColor &&
            saved.lineColor === lineColor &&

            saved.size === lengthChange &&
            saved.numOfLines === numOfLines &&
            saved.angle === angle.value &&
            saved.subLines === subLines.value &&
            saved.sineFactor === sineFactor.value &&
            saved.sineFreq === sineFreq.value &&
            saved.cosineFactor === cosineFactor.value &&
            saved.cosineFreq === cosineFreq.value
        )
    }

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

    function randomizeControls() {

        angle.setValue(getRandomBetween(angleMin, angleMax));
        subLines.setValue(getRandomBetween(subLinesMin, subLinesMax));
        sineFactor.setValue(getRandomBetween(sineFactorMin, sineFactorMax));
        cosineFactor.setValue(getRandomBetween(cosineFactorMin, cosineFactorMax));
        sineFreq.setValue(getRandomBetween(sineFreqMin, sineFreqMax));
        cosineFreq.setValue(getRandomBetween(cosineFreqMin, cosineFreqMax));

        setNumOfLines(getRandomBetween(100, 1000));
        setLengthChange(400);

        setBgColor(getRandomColor());
        setLineColor(getRandomColor());
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
                    dimensions={{ width: canvasDimenstions, height: canvasDimenstions }}
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
                            defaultValue={bgColor}
                            onChange={setBgColor}
                            format="rgba"
                        />
                    </div>

                    <div className="color-control container">
                        Line Color
                        <ColorInput
                            value={lineColor}
                            defaultValue={lineColor}
                            onChange={setLineColor}
                            format="rgba"
                        />
                    </div>
                </div>
                Size
                <Slider
                    min={sizeMin}
                    max={sizeMax}
                    value={lengthChange}
                    onChange={setLengthChange}
                    color={sliderColor}
                />

                Number of lines
                <Slider
                    min={numOfLinesMin}
                    max={numOfLinesMax}
                    value={numOfLines}
                    onChange={setNumOfLines}
                    color={sliderColor}
                />

                <div className="control-group">

                    <SliderControl name={'Angle'}
                        min={angleMin} max={angleMax} step={0.01}
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
                        min={subLinesMin} max={subLinesMax} step={0.01}
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
                    min={sineFactorMin} max={sineFactorMax} step={0.01}
                    state={sineFactor}
                    resetValue={0}
                    color={sliderColor}
                />

                <div className="control-group">


                    <SliderControl name={'Sine Frequency'}
                        min={sineFreqMin} max={sineFreqMax} step={0.01}
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
                    min={cosineFactorMin} max={cosineFactorMax} step={0.01}
                    state={cosineFactor}
                    resetValue={0}
                    color={sliderColor}
                />

                <div className="control-group">

                    <SliderControl name={'Cosine Frequency'}
                        min={cosineFreqMin} max={cosineFreqMax} step={0.01}
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

                <div className="controls-buttons-container">

                    {hasLineworkChanged() &&
                        <div className="saving-buttons-container">
                            <Button
                                onClick={handleSave}
                            >Save</Button>

                            <Button
                                color='teal'
                                onClick={handleSaveAsNew}
                            >Save As New</Button>

                        </div>
                    }

                    <Button className='randomize-button-container'
                        color='grey'
                        onClick={randomizeControls}
                    >Randomize</Button>

                </div>
            </div>
        </div>
    )
}

function getRandomBetween(value1: number, value2: number) {
    const rand = Math.random();
    return value1 + (value2 - value1) * rand;
}

function getRandomColor() {
    const randomColor = "rgba("
        + Math.floor(Math.random() * 255) + ", " +
        + Math.floor(Math.random() * 255) + ", " +
        + Math.floor(Math.random() * 255) + ", " +
        + (Math.floor(Math.random() * 255) / 255 + .1) + ")";

    return randomColor;

}