import Canvas from './Canvas';
import React, { useEffect, useState } from 'react'
import { Button, ColorInput, Slider, TextInput, Tabs } from '@mantine/core';
import SliderControlWithHistory from './SliderControlWithHistory';
import useStateWithHistory, { UseStateWithHistoryReturnType } from '../hooks/useStateWithHistory';
import useLineworksData, { Linework } from '../contexts/LineworksContext';
import useAnimationState, { AnimationState, AnimationStates, getNewAnimationStates, UseAnimationStateReturnType } from '../hooks/useAnimationState';

import { Adjustments, Movie } from 'tabler-icons-react';
import AnimationTab from './AnimationTab';
import FullScreenButton from './FullScreenButton';
import { useFullscreen } from '@mantine/hooks';
import Dial from './Dial';
import { getRandomLinework } from '../utilities/RandomLinework';

const sliderColor = "gray";
const animatedSliderColor = "lime";
const animatedColorHSL = "hsl(85deg,74%,45%)";

const [angleMin, angleMax] = [0, 360];
const [subLinesMin, subLinesMax] = [.1, 10];
const [sineFactorMin, sineFactorMax] = [-1, 1];
const [cosineFactorMin, cosineFactorMax] = [-1, 1];
const [frequencyMin, frequencyMax] = [-999, 999];
const [numOfLinesMin, numOfLinesMax] = [1, 10000];
const [sizeMin, sizeMax] = [0, 4000];

export default function Controls() {

    const [fullScreen, setFullScreen] = useState(false);
    const { toggle: toggleFullScreen } = useFullscreen();

    const [canvasWidth, setCanvasWidth] = useState<number>(getCanvasWidth(fullScreen));
    const [canvasHeight, setCanvasHeight] = useState<number>(window.innerHeight);

    const [centerX, centerY] = [canvasWidth / 2, canvasHeight / 2];



    useEffect(() => {
        const resizeHandler = () => {
            setCanvasWidth(getCanvasWidth(fullScreen));
            setCanvasHeight(window.innerHeight);
        }

        window.addEventListener('resize', resizeHandler);
        return () => window.removeEventListener('resize', resizeHandler);
    }, [fullScreen]);


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
    const subLines = useStateWithHistory(1);
    const [size, setSize] = useState(400);

    const sineFactor = useStateWithHistory(1);
    const cosineFactor = useStateWithHistory(1);
    const sineFreq = useStateWithHistory(0);
    const cosineFreq = useStateWithHistory(0);

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

            setAnimationOn(linework.animationOn);
            setAllAnimationStates(linework.animation);
        };

        setInitLinework(initLineworkFunc);
        initLineworkFunc(getSelectedLinework());
    }, [])

    function setAnimationState(animationState: AnimationState, setTo: UseAnimationStateReturnType) {
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

    const allAnimationTargets = {
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
        const random = getRandomLinework();

        angle.setValue(random.angle);
        subLines.setValue(random.subLines);
        sineFactor.setValue(random.sineFactor);
        cosineFactor.setValue(random.cosineFactor);
        sineFreq.setValue(random.sineFreq);
        cosineFreq.setValue(random.cosineFreq);

        setNumOfLines(random.numOfLines);
        setSize(random.size);

        setBgColor(random.bgColor);
        setLineColor(random.lineColor);
    }

    const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1 / window.devicePixelRatio;
        ctx.beginPath();


        const angleTotal = Math.PI / 180 * angle.value +
            calculateAnimation(animationOn, angleAnimation, frameCount);

        const sineFactorTotal = sineFactor.value +
            calculateAnimation(animationOn, sineFactorAnimation, frameCount);

        const cosineFactorTotal = cosineFactor.value +
            calculateAnimation(animationOn, cosineFactorAnimation, frameCount);

        const numOfLinesTotal = numOfLines +
            calculateAnimation(animationOn, numOfLinesAnimation, frameCount);

        const sizeTotal = size +
            calculateAnimation(animationOn, sizeAnimation, frameCount);

        let lineIncrement = 1 / (subLines.value +
            calculateAnimation(animationOn, subLinesAnimation, frameCount));
        if (lineIncrement < .02) lineIncrement = .02;

        const sineFreqTotal = Math.PI / 180 * sineFreq.value +
            calculateAnimation(animationOn, sineFreqAnimation, frameCount);

        const cosineFreqTotal = Math.PI / 180 * cosineFreq.value +
            calculateAnimation(animationOn, cosineFreqAnimation, frameCount);

        const skewAngleTotal = Math.PI / 180 * (skewAngle + calculateAnimation(
            animationOn, skewAngleAnimation, frameCount));

        let counter = 0;

        // let [px, py] = [centerX, centerY]
        // for (let i = 0; i < numOfLinesTotal; i++) {
        //     const angle = angleTotal * i + 10 * Math.cos(i * sineFreqTotal) * sineFactorTotal;
        //     const lineLength = size * .1 * Math.cos(i * cosineFreqTotal) * cosineFactorTotal;

        //     px += lineLength * Math.cos(angle);
        //     py += lineLength * Math.sin(angle);

        //     ctx.lineTo(px, py);
        // }
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

    return (
        <div className="canvas-and-controls-container" >
            <div className="canvas-container"
                style={{ width: canvasWidth, height: canvasHeight }}
            >
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
                                    format="hsla"
                                    disallowInput
                                />
                            </div>

                            <div className="color-control container">
                                Line Color
                                <ColorInput
                                    value={lineColor}
                                    defaultValue={lineColor}
                                    onChange={setLineColor}
                                    format="hsla"
                                    disallowInput
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

                            <Dial
                                name='Number Of Lines'
                                num={numOfLines}
                                setNum={setNumOfLines}
                                minValue={numOfLinesMin}
                                maxValue={numOfLinesMax}
                                omitSign={true}
                                precision={0}
                                color={numOfLinesAnimation.active ? animatedColorHSL : undefined}
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
                            <Dial
                                name='Sub Lines'
                                num={subLines.value}
                                setNum={subLines.setValue}
                                minValue={0}
                                maxValue={10}
                                omitSign={true}
                                precision={5}
                                color={subLinesAnimation.active ? animatedColorHSL : undefined}
                            />
                        </div>
                        <div className="control-group">
                            <Dial
                                name='Angle'
                                num={angle.value}
                                setNum={angle.setValue}
                                minValue={-180}
                                maxValue={180}
                                color={angleAnimation.active ? animatedColorHSL : undefined}
                            />
                        </div>



                        <div className="control-group">
                            <SliderControlWithHistory name={'Sine Factor'}
                                min={sineFactorMin} max={sineFactorMax} step={0.01}
                                state={sineFactor}
                                resetValue={0}
                                color={sineFactorAnimation.active ? animatedSliderColor : sliderColor}
                            />

                            <Dial
                                name='Sine Frequency'
                                num={sineFreq.value}
                                setNum={sineFreq.setValue}
                                minValue={frequencyMin}
                                maxValue={frequencyMax}
                                color={sineFreqAnimation.active ? animatedColorHSL : undefined}
                            />
                        </div>

                        <div className="control-group">
                            <SliderControlWithHistory name={'Cosine Factor'}
                                min={cosineFactorMin} max={cosineFactorMax} step={0.01}
                                state={cosineFactor}
                                resetValue={0}
                                color={cosineFactorAnimation.active ? animatedSliderColor : sliderColor}
                            />

                            <Dial
                                name='Cosine Frequency'
                                num={cosineFreq.value}
                                setNum={cosineFreq.setValue}
                                minValue={frequencyMin}
                                maxValue={frequencyMax}
                                color={cosineFreqAnimation.active ? animatedColorHSL : undefined}
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

function calculateAnimation(animationsOn: boolean,
    animation: AnimationState, frameCount: number) {

    const active = animation.active ? 1 : 0;

    return animationsOn ? active * animation.reach
        * Math.sin(animation.speed * frameCount + animation.phase * Math.PI / 2)
        : 0;
}

function getCanvasWidth(fullScreen: boolean) {

    return fullScreen ? window.innerWidth : window.innerWidth - 500;
}