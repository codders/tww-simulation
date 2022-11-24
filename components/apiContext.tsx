import { createContext, useContext } from 'react';

const ApiContext = createContext({
    apiOptions: { 
        direktKreditTilgung: 0.5,
        direktKreditZinsen: 0.8,
        direktKredite: 0,
        url: ""
    },
    updateApiOptions: (options: any) => { return 0 }
});

export function ApiConsumer(props: any) {
    const { value, children } = props;

    return (
        <ApiContext.Provider value={value}>
            {children}
        </ApiContext.Provider>
    );
}

export function useApiContext() {
    return useContext(ApiContext);
}