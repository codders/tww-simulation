import React, { useCallback, useMemo } from 'react';
import { numericFormatter } from 'react-number-format';
import useSWR from 'swr';
import { ColdCost, WarmCost } from '../model/graph';

export type MieteProps = {
  dataSource: string;
};

// fetch implementation
const fetcher = (input: RequestInfo, init?: RequestInit) => fetch(input, init).then(res => res.json())

function useSanierungsData(dataSource: string) {
  const { data, error } = useSWR(dataSource, fetcher)

  return {
    coldData: (data?.series?.coldCosts ?? []) as ColdCost[],
    isError: error,
    isLoading: !error && !data,
    warmData: (data?.series?.warmCosts ?? []) as WarmCost[],
  }
}

const formatNumber = (num: string | number) => {
  return numericFormatter(num.toString(), {
    decimalScale: 2,
    decimalSeparator: ",",
    prefix: "€",
    thousandSeparator: ".",
  })
}

const MieteDisplay = (props: MieteProps) => {

  const { coldData, warmData, isError } = useSanierungsData(props.dataSource);

  if (!coldData || !warmData || warmData.length === 0 || coldData.length === 0 || isError) return <>
    <p>Loading...</p>
  </>;

  return (
    <div style={{ position: 'relative' }}>
      <h2>Kaltmiete - Variant 1: <span>{formatNumber(coldData[0].Kaltmiete)}/qm</span>, Variant 2: <span>{formatNumber(coldData[1].Kaltmiete)}/qm</span></h2>
      <h2>Warmmiete - Variant 1: <span>{formatNumber(coldData[0].Kaltmiete + warmData[0].Nebenkosten)}/qm</span>, Variant 2: <span>{formatNumber(coldData[1].Kaltmiete + warmData[1].Nebenkosten)}/qm</span></h2>
    </div>
  );
}

export default MieteDisplay;