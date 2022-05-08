import { useEffect, useState } from "react";

export default function useLocalStorage(key, defaultValue) {

    const [data, setData] = useState(() => {

        const fromLocalStorage = localStorage.getItem(key);
        if (fromLocalStorage != null) return JSON.parse(fromLocalStorage);

        if (defaultValue instanceof Function) return defaultValue();
        return defaultValue;
    });


    // saving the data to local storage when it's modified
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(data));
    }, [data])

    return [data, setData];
}