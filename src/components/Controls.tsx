import Canvas from './Canvas';
import React, { useEffect, useRef, useState } from 'react'
import { Button, ColorInput, Slider, TextInput, Tabs } from '@mantine/core';
import SliderControl from './SliderControl';
import useStateWithHistory, { UseStateWithHistoryReturnType } from '../hooks/useStateWithHistory';
import useLineworksData, { Linework } from '../contexts/LineworksContext';
import AnimationControl from './AnimationControl';
import useAnimationState, { AnimationStates } from '../hooks/useAnimationState';

import { Photo, MessageCircle, Settings } from 'tabler-icons-react';

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
        setInitLinework, revertLinework } = useLineworksData();

    useEffect(() => {

        const initLineworkFunc = (linework: Linework) => {

            angle.initValue(linework.angle);
            subLines.initValue(linework.subLines);
            sineFactor.initValue(linework.sineFactor);
            cosineFactor.initValue(linework.cosineFactor);
            sineFreq.initValue(linework.sineFreq);
            cosineFreq.initValue(linework.cosineFreq);

            setNumOfLines(linework.numOfLines);
            setSize(linework.size);

            setBgColor(linework.bgColor);
            setLineColor(linework.lineColor);
            setName(linework.name);

        };

        setInitLinework(initLineworkFunc);
        initLineworkFunc(getSelectedLinework());
    }, [])

    function hasLineworkChanged() {
        const saved = getSelectedLinework();
        const current = paramsToLinework();

        for (let k in saved) {

            const key = k as keyof Linework;
            if (saved[key] !== current[key]) return true;
        }
        return false;
    }

    const [name, setName] = useState('New Linework');

    const angle = useStateWithHistory(0);
    const [angleFine, setAngleFine] = useState(0);
    const [angleMicro, setAngleMicro] = useState(0);
    const angleAnimation = useAnimationState();


    const [numOfLines, setNumOfLines] = useState(100);
    const numOfLinesAnimation = useAnimationState();

    const subLines = useStateWithHistory(1);
    const [subLinesFine, setSubLinesFine] = useState(0);
    const [subLinesMicro, setSubLinesMicro] = useState(0);
    const subLinesAnimation = useAnimationState();

    const [size, setSize] = useState(200);
    const sizeAnimation = useAnimationState();

    const sineFactor = useStateWithHistory(1);
    const sineFactorAnimation = useAnimationState();
    const cosineFactor = useStateWithHistory(1);
    const cosineFactorAnimation = useAnimationState();

    const sineFreq = useStateWithHistory(0);
    const sineFreqAnimation = useAnimationState();

    const cosineFreq = useStateWithHistory(0);
    const cosineFreqAnimation = useAnimationState();

    const [sineFreqFine, setSineFreqFine] = useState(0);
    const [cosineFreqFine, setCosineFreqFine] = useState(0);

    const [bgColor, setBgColor] = useState('#ffffffff');
    const [lineColor, setLineColor] = useState('#0000007f');

    const allAnimationTargets: AnimationStates = {
        size: sizeAnimation, numOfLines: numOfLinesAnimation, angle: angleAnimation,
        subLines: subLinesAnimation, sineFactor: sineFactorAnimation, cosineFactor: cosineFactorAnimation,
        sineFreq: sineFreqAnimation, cosineFreq: cosineFreqAnimation
    }

    const totalAngleInterval = angle.value + angleFine + angleMicro;
    const cosineFreqTotal = cosineFreq.value + cosineFreqFine;


    function paramsToLinework(): Linework {

        const linework: Linework = {
            name,
            bgColor,
            lineColor,

            size,
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
        setSize(400);

        setBgColor(getRandomColor());
        setLineColor(getRandomColor());
    }

    const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.strokeStyle = lineColor;
        ctx.beginPath();

        const angleTotal = totalAngleInterval +
            angleAnimation.activeRef.current * angleAnimation.reach *
            Math.sin(angleAnimation.speed * frameCount);

        const sineFactorTotal = sineFactor.value +
            sineFactorAnimation.activeRef.current * sineFactorAnimation.reach *
            Math.sin(sineFactorAnimation.speed * frameCount);

        const cosineFactorTotal = cosineFactor.value +
            cosineFactorAnimation.activeRef.current * cosineFactorAnimation.reach *
            Math.sin(cosineFactorAnimation.speed * frameCount);

        const numOfLinesTotal = numOfLines +
            numOfLinesAnimation.activeRef.current * numOfLinesAnimation.reach *
            Math.sin(numOfLinesAnimation.speed * frameCount + numOfLinesAnimation.phase);

        const sizeTotal = size +
            sizeAnimation.activeRef.current * sizeAnimation.reach *
            Math.sin(sizeAnimation.speed * frameCount + sizeAnimation.phase);

        let lineIncrement = 1 / (subLines.value + subLinesFine + subLinesMicro +
            subLinesAnimation.activeRef.current * subLinesAnimation.reach *
            Math.sin(subLinesAnimation.speed * frameCount + subLinesAnimation.phase));
        if (lineIncrement < .02) lineIncrement = .02;


        const sineFreqTotal = sineFreq.value + sineFreqFine +
            sineFreqAnimation.activeRef.current * sineFreqAnimation.reach *
            Math.sin(sineFreqAnimation.speed * frameCount + sineFreqAnimation.phase);

        const cosineFreqTotal = cosineFreq.value + cosineFreqFine +
            cosineFreqAnimation.activeRef.current * cosineFreqAnimation.reach *
            Math.sin(cosineFreqAnimation.speed * frameCount + cosineFreqAnimation.phase);

        for (let i = 0; i < numOfLinesTotal; i += lineIncrement) {

            const lengthChange = sizeTotal *
                (sineFactorTotal * Math.sin(sineFreqTotal * i) +
                    cosineFactorTotal * Math.cos(cosineFreqTotal * i));

            const angle = i * angleTotal;

            ctx.lineTo(
                centerX + lengthChange * Math.cos(angle),
                centerY + lengthChange * Math.sin(angle)
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
                    animate={true}
                    dimensions={{ width: canvasDimenstions, height: canvasDimenstions }}
                ></Canvas>
            </div>

            <div className="controls-container">

                <Tabs>
                    <Tabs.Tab label="Controls" icon={<Photo size={14} />}>

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
                            value={size}
                            onChange={setSize}
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
                                        color='gray'
                                        onClick={revertLinework}
                                    >Revert</Button>

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
                                color='gray'
                                onClick={randomizeControls}
                            >Randomize</Button>

                        </div>

                    </Tabs.Tab>
                    <Tabs.Tab label="Animation" icon={<MessageCircle size={14} />}>

                        <AnimationControl animationStates={allAnimationTargets} />
                        <AnimationControl animationStates={allAnimationTargets} />

                    </Tabs.Tab>
                </Tabs>

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