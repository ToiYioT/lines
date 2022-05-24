
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from '../hooks/useLocalStorage';


export type LineworksContext = {
    lineworkItems: LineworkItem[]

    setSelectedLinework: (id: string) => void
    getSelectedLinework: () => Linework
    getSelectedLineworkId: () => string
    addNewLinework: () => string
    addLinework: (linework: Linework) => string
    removeLinework: (id: string) => void
    saveLinework: (linework: Linework) => void

    setInitLinework: (initFunc: (linework: Linework) => void) => void
}


const LineworksContext = createContext<LineworksContext | null>(null);

export default function useLineworksData() {
    return useContext(LineworksContext) as LineworksContext;
}

interface Props {
    children: ReactNode,
}

export function LineworksProvider({ children }: Props) {

    const [lineworkItems, setLineworkItems] = useLocalStorage(
        "linework-items", [getNewLinework()]);
    const [selectedLineworkId, setSelectedLineworkId] = useState<string>(lineworkItems[0].id);

    const initLineworkFunc = useRef<(linework: Linework) => void>();

    useEffect(() => {
        initLineworkFunc.current!(getSelectedLinework());

    }, [selectedLineworkId]);

    function setSelectedLinework(id: string) {

        setSelectedLineworkId(id);
    }

    function getSelectedLinework() {
        return lineworkItems.find(
            (item: LineworkItem) => item.id === selectedLineworkId).linework;
    }

    function getSelectedLineworkId() {
        return selectedLineworkId;
    }

    function addNewLinework() {
        const newLinework = getNewLinework();
        setLineworkItems((prevItems: LineworkItem[]) => {
            return [...prevItems, newLinework];
        })
        return newLinework.id;
    }

    function addLinework(linework: Linework) {

        const newLineworkItem: LineworkItem = { id: uuidv4(), linework };

        setLineworkItems((prevItems: LineworkItem[]) => {
            return [...prevItems, newLineworkItem];
        })
        return newLineworkItem.id;
    }

    function removeLinework(id: string) {
        setLineworkItems((prevItems: LineworkItem[]) => {
            return prevItems.filter(item => item.id !== id);
        })

        if (id == selectedLineworkId) {
            setSelectedLinework(lineworkItems[0].id);
        }
    }

    function saveLinework(linework: Linework) {
        setLineworkItems((prevItems: LineworkItem[]) => {
            return prevItems.map(item => {
                if (item.id === selectedLineworkId) return {
                    id: item.id, linework: linework
                };
                else return item;
            });
        });
    }

    function setInitLinework(initFunc: (linework: Linework) => void) {
        initLineworkFunc.current = initFunc;
    }


    return (
        <LineworksContext.Provider
            value={{
                lineworkItems,

                getSelectedLinework,
                getSelectedLineworkId,
                setSelectedLinework,
                addNewLinework,
                addLinework,
                removeLinework,
                saveLinework,

                setInitLinework,
            }}
        >
            {children}
        </LineworksContext.Provider>
    )
}


//////////////////
///// DATA ///////
//////////////////

export type Linework = {
    name: string
    bgColor: string
    lineColor: string

    size: number
    numOfLines: number
    angle: number
    subLines: number
    sineFactor: number
    sineFreq: number
    cosineFactor: number
    cosineFreq: number
}

type LineworkItem = {
    id: string
    linework: Linework
}

function getNewLinework() {

    const newLinework: Linework = {
        name: "New Linework",
        bgColor: "#ffffffff",
        lineColor: "#0000007f",

        size: 200,
        numOfLines: 100,
        angle: 0,
        subLines: 1,
        sineFactor: 0,
        sineFreq: 0,
        cosineFactor: 1,
        cosineFreq: 0
    }

    const newLineworkItem: LineworkItem = {
        id: uuidv4(),
        linework: newLinework
    };

    return newLineworkItem;
}
