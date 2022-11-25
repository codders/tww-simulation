import React, { useCallback, useMemo } from 'react';
import { numericFormatter } from 'react-number-format';
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
  
  const formatNumber = (num: string|number) => {
    return numericFormatter(num.toString(), {
       decimalScale: 2,
       decimalSeparator: ",",
       prefix: "€",
       thousandSeparator: ".",
     })
   }

const MieteDisplay = (props: MieteProps) => {

  const { data, isError } = useSanierungsData(props.dataSource);

  if (!data || data.length === 0 || isError) return <>
      <p>Loading...</p>
    </>;

  return (
    <div style={{ position: 'relative' }}>
      <h2>Kaltmiete - Variant 1: <span>{formatNumber(data[0].Kaltmiete)}/qm</span>, Variant 2: <span>{formatNumber(data[1].Kaltmiete)}/qm</span></h2>
      <h2>Warmmiete - Variant 1: <span>{formatNumber(data[0].Warmmiete)}/qm</span>, Variant 2: <span>{formatNumber(data[1].Warmmiete)}/qm</span></h2>
    </div>
  );
}

export default MieteDisplay;