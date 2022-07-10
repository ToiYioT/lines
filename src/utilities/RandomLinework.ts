import { getNewLinework } from "../contexts/LineworksContext"

const steps = [1, 2, 3, 5, 7, 1 / 2, 1 / 3, 1 / 5, 1 / 7,
    1 / 2.5, 2.5, 1.5, 1.2, 1 / 1.6, 1 / 0.8, 1 / 10, 1 / 20
];
const sublinesSteps = [1 / 20, 1 / 3, 1 / 5]

export function getRandomLinework() {
    const linework = getNewLinework().linework;

    let angle = getRandomBetween(-180, 180, getRandomStep(steps));
    linework.angle = angle;

    const cosineFreqDivider = 1 / getRandomBetween(1, 5, 1);

    let cosineFreq = angle / getRandomBetween(cosineFreqDivider, 1 / cosineFreqDivider, cosineFreqDivider);
    if (cosineFreq === angle) cosineFreq += 5 * Math.random();
    linework.cosineFreq = cosineFreq;

    const sineFreqDivider = 1 / getRandomBetween(1, 3, 1);
    linework.sineFreq = cosineFreq / getRandomBetween(sineFreqDivider, 1 / sineFreqDivider, sineFreqDivider);
    if (Math.random() > .5) linework.sineFreq = 0;
    linework.sineFactor = getRandomBetween(0, .5);


    const colors = getRandomColors(
        // propery , delta
        // Hue
        { min: 0, max: 360 }, 30,
        // Saturation
        { min: 10, max: 40 }, 60,
        // Lightness
        { min: 15, max: 35 }, 70,
        // Alpha
        { min: .5, max: .9 }, -0.3
    );

    linework.bgColor = colors.bgColor;
    linework.lineColor = colors.lineColor;

    linework.numOfLines = getRandomBetween(100, 1000);
    const sublines = getRandomBetween(0.1, 2, getRandomStep(sublinesSteps));

    linework.subLines = sublines;

    return linework;
}


function getRandomStep(arrayOfSteps: number[]) {
    return arrayOfSteps[Math.floor(Math.random() * arrayOfSteps.length)];
}

function getRandomBetween(value1: number, value2: number, step?: number) {
    const rand = Math.random();
    let randomValue = value1 + (value2 - value1) * rand;

    if (step) {
        randomValue = Math.round(randomValue / step) * step;
    }

    return randomValue;
}


function getRandomColors(
    hueRange: { min: number, max: number }, hueDelta: number,
    saturationRange: { min: number, max: number }, saturationDelta: number,
    lightnessRange: { min: number, max: number }, lightnessDelta: number,
    alphaRange: { min: number, max: number }, alphaDelta: number
) {
    const hue = getRandomBetween(hueRange.min, hueRange.max, 1);
    const saturation = getRandomBetween(saturationRange.min, saturationRange.max, 1);
    const lightness = getRandomBetween(lightnessRange.min, lightnessRange.max, 1);
    const alpha = getRandomBetween(alphaRange.min, alphaRange.max);

    return {
        bgColor: getHSLAColor(hue, saturation, lightness, alpha),
        lineColor: getHSLAColor(
            hue + hueDelta,
            saturation + saturationDelta,
            lightness + lightnessDelta,
            alpha + alphaDelta),
    }
}

function getHSLAColor(hue: number, saturation: number, lightness: number, alpha: number) {
    return "hsla("
        + hue + ", " +
        + saturation + "%, " +
        + lightness + "%, " +
        + alpha + ")";
}