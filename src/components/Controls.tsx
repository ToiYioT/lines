import Canvas from './Canvas';
import React, { useEffect, useState } from 'react'
import { Button, ColorInput, Slider, TextInput, Tabs } from '@mantine/core';
import SliderControlWithHistory from './SliderControlWithHistory';
import useStateWithHistory, { UseStateWithHistoryReturnType } from '../hooks/useStateWithHistory';
import useLineworksData, { Linework } from '../contexts/LineworksContext';
import useAnimationState, { AnimationState, AnimationStates, getNewAnimationStates } from '../hooks/useAnimationState';

import { Adjustments, Movie } from 'tabler-icons-react';
import AnimationTab from './AnimationTab';
import FullScreenButton from './FullScreenButton';
import { useFullscreen } from '@mantine/hooks';

const sliderColor = "gray";
const animatedSliderColor = "lime";

const [angleMin, angleMax] = [-.1, 6];
const [subLinesMin, subLinesMax] = [.1, 10];
const [sineFactorMin, sineFactorMax] = [-1, 1];
const [cosineFactorMin, cosineFactorMax] = [-1, 1];
const [sineFreqMin, sineFreqMax] = [-1, 1];
const [cosineFreqMin, cosineFreqMax] = [-1, 1];
const [numOfLinesMin, numOfLinesMax] = [1, 10000];
const [sizeMin, sizeMax] = [0, 4000];

export default function Controls() {

    const [fullScreen, setFullScreen] = useState(false);
    const { toggle: toggleFullScreen } = useFullscreen();

    const [canvasWidth, canvasHeight] = [fullScreen ? window.innerWidth : 800, window.innerHeight];
    const [centerX, centerY] = [canvasWidth / 2, canvasHeight / 2];

    const { getSelectedLinework,
        saveLinework,
        addLinework,
        setSelectedLinework,
        setInitLinework, revertLinework } = useLineworksData();

    const [name, setName] = useState('New Linework');
    const [numOfLines, setNumOfLines] = useState(100);

    const [skip, setSkip] = useState(1);
    const [skew, setSkew] = useState(1);
    const [skewAngle, setSkewAngle] = useState(1);

    const angle = useStateWithHistory(0);
    const [angleFine, setAngleFine] = useState(0);
    const [angleMicro, setAngleMicro] = useState(0);

    const subLines = useStateWithHistory(1);
    const [subLinesFine, setSubLinesFine] = useState(0);
    const [subLinesMicro, setSubLinesMicro] = useState(0);
    const [size, setSize] = useState(400);

    const sineFactor = useStateWithHistory(1);
    const cosineFactor = useStateWithHistory(1);

    const sineFreq = useStateWithHistory(0);
    const cosineFreq = useStateWithHistory(0);

    const [sineFreqFine, setSineFreqFine] = useState(0);
    const [cosineFreqFine, setCosineFreqFine] = useState(0);

    const [bgColor, setBgColor] = useState('#ffffffff');
    const [lineColor, setLineColor] = useState('#0000007f');

    const [animationOn, setAnimationOn] = useState<boolean>(false);
    const angleAnimation = useAnimationState();
    const numOfLinesAnimation = useAnimationState();
    const subLinesAnimation = useAnimationState();
    const sizeAnimation = useAnimationState();
    const sineFactorAnimation = useAnimationState();
    const cosineFactorAnimation = useAnimationState();
    const sineFreqAnimation = useAnimationState();
    const cosineFreqAnimation = useAnimationState();
    const skewAngleAnimation = useAnimationState();

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

            linework.skip ? setSkip(linework.skip) : setSkip(1);
            linework.skew ? setSkew(linework.skew) : setSkew(1);
            linework.skewAngle ? setSkewAngle(linework.skewAngle) : setSkewAngle(0);

            setBgColor(linework.bgColor);
            setLineColor(linework.lineColor);
            setName(linework.name);

            if (linework.animation) {
                setAllAnimationStates(linework.animation);
            } else {
                setAllAnimationStates(getNewAnimationStates());
            }
            setAnimationOn(linework.animationOn);
        };

        setInitLinework(initLineworkFunc);
        initLineworkFunc(getSelectedLinework());
    }, [])

    function setAnimationState(animationState: AnimationState, setTo: AnimationState) {
        if (!animationState) return;
        setTo.setActive(animationState.active);

        setTo.setReach(animationState.reach);
        setTo.setSpeed(animationState.speed);
        setTo.setPhase(animationState.phase);
    }

    function setAllAnimationStates(animationStates: AnimationStates) {
        setAnimationState(animationStates.angle, angleAnimation);
        setAnimationState(animationStates.numOfLines, numOfLinesAnimation);
        setAnimationState(animationStates.subLines, subLinesAnimation);
        setAnimationState(animationStates.size, sizeAnimation);
        setAnimationState(animationStates.sineFactor, sineFactorAnimation);
        setAnimationState(animationStates.cosineFactor, cosineFactorAnimation);
        setAnimationState(animationStates.sineFreq, sineFreqAnimation);
        setAnimationState(animationStates.cosineFreq, cosineFreqAnimation);

        setAnimationState(animationStates.skewAngle, skewAngleAnimation);
    }

    const allAnimationTargets: AnimationStates = {
        size: sizeAnimation, numOfLines: numOfLinesAnimation, angle: angleAnimation,
        subLines: subLinesAnimation, sineFactor: sineFactorAnimation, cosineFactor: cosineFactorAnimation,
        sineFreq: sineFreqAnimation, cosineFreq: cosineFreqAnimation,
        skewAngle: skewAngleAnimation
    }

    function hasLineworkChanged() {
        const savedJSON = JSON.stringify(getSelectedLinework());
        const currentJSON = JSON.stringify(paramsToLinework());
        return savedJSON !== currentJSON;
    }

    function paramsToLinework(): Linework {

        const linework: Linework = {
            name, bgColor, lineColor,

            size, numOfLines, skip, skew, skewAngle,
            angle: angle.value,
            subLines: subLines.value,
            sineFactor: sineFactor.value,
            sineFreq: sineFreq.value,
            cosineFactor: cosineFactor.value,
            cosineFreq: cosineFreq.value,

            animation: allAnimationTargets,
            animationOn
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


        const angleTotal = angle.value + angleFine + angleMicro +
            calculateAnimation(animationOn, angleAnimation, frameCount);

        const sineFactorTotal = sineFactor.value +
            calculateAnimation(animationOn, sineFactorAnimation, frameCount);

        const cosineFactorTotal = cosineFactor.value +
            calculateAnimation(animationOn, cosineFactorAnimation, frameCount);

        const numOfLinesTotal = numOfLines +
            calculateAnimation(animationOn, numOfLinesAnimation, frameCount);

        const sizeTotal = size +
            calculateAnimation(animationOn, sizeAnimation, frameCount);

        let lineIncrement = 1 / (subLines.value + subLinesFine + subLinesMicro +
            calculateAnimation(animationOn, subLinesAnimation, frameCount));
        if (lineIncrement < .02) lineIncrement = .02;

        const sineFreqTotal = sineFreq.value + sineFreqFine +
            calculateAnimation(animationOn, sineFreqAnimation, frameCount);

        const cosineFreqTotal = cosineFreq.value + cosineFreqFine +
            calculateAnimation(animationOn, cosineFreqAnimation, frameCount);

        const skewAngleTotal = Math.PI / 180 * (skewAngle + calculateAnimation(
            animationOn, skewAngleAnimation, frameCount));

        let counter = 0;

        for (let i = 0; i < numOfLinesTotal; i += lineIncrement * skip) {
            counter++;

            const lengthChange = sizeTotal *
                (sineFactorTotal * Math.sin(sineFreqTotal * i) +
                    cosineFactorTotal * Math.cos(cosineFreqTotal * i));

            const lengthChangeNext = sizeTotal *
                (sineFactorTotal * Math.sin(sineFreqTotal * (i + lineIncrement)) +
                    cosineFactorTotal * Math.cos(cosineFreqTotal * (i + lineIncrement)));

            const angle = i * angleTotal;

            const nextAngleBonus = 1 - ((counter % skew) / skew);
            const angleNext = (i + lineIncrement) * angleTotal +
                nextAngleBonus * skewAngleTotal;


            ctx.moveTo(
                centerX + lengthChange * Math.cos(angle),
                centerY + lengthChange * Math.sin(angle)
            );

            ctx.lineTo(
                centerX + lengthChangeNext * Math.cos(angleNext),
                centerY + lengthChangeNext * Math.sin(angleNext)
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
            <div className="canvas-container" >
                <Canvas
                    draw={draw}
                    animate={true}
                    dimensions={{ width: canvasWidth, height: canvasHeight }}
                ></Canvas>
                <FullScreenButton
                    fullScreen={fullScreen}
                    setFullScreen={(fullScreenOn: boolean) => {
                        setFullScreen(fullScreenOn);
                        toggleFullScreen();
                    }}
                />
            </div>

            <div className={fullScreen ? "controls-container opacity-zero"
                : "controls-container"} >

                <Tabs>
                    <Tabs.Tab label="Controls" icon={<Adjustments size={22} />}>

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

                        <div className="control-group">

                            Size
                            <Slider
                                min={sizeMin}
                                max={sizeMax}
                                value={size}
                                onChange={setSize}
                                color={sizeAnimation.active ? animatedSliderColor : sliderColor}
                            />

                            Number of lines
                            <Slider
                                min={numOfLinesMin}
                                max={numOfLinesMax}
                                value={numOfLines}
                                onChange={setNumOfLines}
                                color={numOfLinesAnimation.active ? animatedSliderColor : sliderColor}
                            />
                        </div>

                        <div className="control-group">
                            Skip
                            <Slider
                                min={0.2}
                                max={5}
                                step={.1}
                                value={skip}
                                onChange={setSkip}
                                // color={sizeAnimation.active ? animatedSliderColor : sliderColor}
                                color={sliderColor}
                            />
                            Skew
                            <Slider
                                min={1}
                                max={10}
                                step={.1}
                                value={skew}
                                onChange={setSkew}
                                // color={sizeAnimation.active ? animatedSliderColor : sliderColor}
                                color={sliderColor}
                            />
                            Skew Angle
                            <Slider
                                min={0}
                                max={1360}
                                value={skewAngle}
                                onChange={setSkewAngle}
                                color={skewAngleAnimation.active ? animatedSliderColor : sliderColor}
                            />
                        </div>
                        <div className="control-group">

                            <SliderControlWithHistory name={'Angle'}
                                min={angleMin} max={angleMax} step={0.01}
                                state={angle}
                                resetValue={0}
                                color={angleAnimation.active ? animatedSliderColor : sliderColor}
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
                            <SliderControlWithHistory name={'Sub Lines'}
                                min={subLinesMin} max={subLinesMax} step={0.01}
                                state={subLines}
                                resetValue={1}
                                color={subLinesAnimation.active ? animatedSliderColor : sliderColor}
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



                        <div className="control-group">
                            <SliderControlWithHistory name={'Sine Factor'}
                                min={sineFactorMin} max={sineFactorMax} step={0.01}
                                state={sineFactor}
                                resetValue={0}
                                color={sineFactorAnimation.active ? animatedSliderColor : sliderColor}
                            />

                            <div className="control-group">


                                <SliderControlWithHistory name={'Sine Frequency'}
                                    min={sineFreqMin} max={sineFreqMax} step={0.01}
                                    state={sineFreq}
                                    resetValue={0}
                                    color={sineFreqAnimation.active ? animatedSliderColor : sliderColor}
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
                        </div>

                        <div className="control-group">
                            <SliderControlWithHistory name={'Cosine Factor'}
                                min={cosineFactorMin} max={cosineFactorMax} step={0.01}
                                state={cosineFactor}
                                resetValue={0}
                                color={cosineFactorAnimation.active ? animatedSliderColor : sliderColor}
                            />

                            <div className="control-group" >

                                <SliderControlWithHistory name={'Cosine Frequency'}
                                    min={cosineFreqMin} max={cosineFreqMax} step={0.01}
                                    state={cosineFreq}
                                    resetValue={0}
                                    color={cosineFreqAnimation.active ? animatedSliderColor : sliderColor}
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
                    <Tabs.Tab label="Animation" icon={<Movie size={22} />}>
                        <AnimationTab
                            animationStates={allAnimationTargets}
                            animationOn={animationOn}
                            setAnimationOn={setAnimationOn}
                        />
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

function calculateAnimation(animationsOn: boolean,
    animation: AnimationState, frameCount: number) {

    const active = animation.active ? 1 : 0;

    return animationsOn ? active * animation.reach
        * Math.sin(animation.speed * frameCount + animation.phase * Math.PI / 2)
        : 0;
}