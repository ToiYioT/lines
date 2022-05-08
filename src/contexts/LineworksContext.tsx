
import React, { createContext, ReactNode, useContext, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from '../hooks/useLocalStorage';


export type LineworksContext = {
    lineworkItems: LineworkItem[]

    setSelectedLinework: (id: string) => void
    getSelectedLinework: () => Linework
    addNewLinework: () => void
    removeLinework: (id: string) => void
    saveLinework: (linework: Linework) => void
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

    function setSelectedLinework(id: string) {
        setSelectedLineworkId(id);
    }

    function getSelectedLinework() {
        return lineworkItems.find(
            (item: LineworkItem) => item.id === selectedLineworkId).linework;
    }

    function addNewLinework() {
        setLineworkItems((prevItems: LineworkItem[]) => {
            return [...prevItems, getNewLinework()];
        })
    }

    function removeLinework(id: string) {
        setLineworkItems((prevItems: LineworkItem[]) => {
            return prevItems.filter(item => item.id !== id);
        })
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


    return (
        <LineworksContext.Provider
            value={{
                lineworkItems,

                getSelectedLinework,
                setSelectedLinework,
                addNewLinework,
                removeLinework,
                saveLinework
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
