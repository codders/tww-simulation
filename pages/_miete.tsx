import React, { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { AnnualCost } from '../model/graph';

export type MieteProps = {
  dataSource: string;
};

// fetch implementation
const fetcher = (input: RequestInfo, init?: RequestInit) => fetch(input, init).then(res => res.json())

function useSanierungsData(dataSource: string) {
    const { data, error } = useSWR(dataSource, fetcher)
  
    return {
      data: (data?.series?.annualCosts ?? []) as AnnualCost[],
      isError: error,
      isLoading: !error && !data,
    }
  }
  
const MieteDisplay = (props: MieteProps) => {

  const { data, isError } = useSanierungsData(props.dataSource);

  if (!data || data.length === 0 || isError) return <>
      <p>Loading...</p>
    </>;

  return (
    <div style={{ position: 'relative' }}>
      <h2>Miete - Variant 1: <span>{data[0].Miete}€/qm</span>, Variant 2: <span>{data[1].Miete}€/qm</span></h2>
    </div>
  );
}

export default MieteDisplay;