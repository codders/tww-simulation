import { createContext, useContext } from 'react';
import { sanierung } from '../model/sanierung';

const ApiContext = createContext({
    apiOptions: { 
        direktKreditTilgung: 0.5,
        direktKreditZinsen: 0.8,
        direktKredite: 160000,
        gasPreisCentskWh: sanierung.getGasPreisEuroProkWh() * 100,
        stromPreisCentskWh: sanierung.getStromPreisEuroProkWh() * 100,
        url: "",
        variant: 1,
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