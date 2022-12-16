import React, { useCallback, useMemo } from 'react';
import { numericFormatter } from 'react-number-format';
import useSWR from 'swr';
import { Miete } from '../model/graph';

export type MieteProps = {
  dataSource: string;
};

// fetch implementation
const fetcher = (input: RequestInfo, init?: RequestInit) => fetch(input, init).then(res => res.json())

function useSanierungsData(dataSource: string) {
  const { data, error } = useSWR(dataSource, fetcher)

  return {
    description: (data?.series?.description ?? ""),
    isError: error,
    isLoading: !error && !data,
    miete: (data?.series?.miete ?? {}) as Miete,
    variant: (data?.series?.debts?.Variant)
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

  const { description, miete, isError, variant } = useSanierungsData(props.dataSource);

  if (!description || !miete || !miete.KaltMiete || isError) return <>
    <p>Loading...</p>
  </>;

  return (
    <div style={{ position: 'relative' }}>
      <h2 style={{ textAlign: 'center', width: "100%"}}>Variant {variant} - Kaltmiete <span>{formatNumber(miete.KaltMiete)}/qm</span>, Warmmiete <span>{formatNumber(miete.WarmMiete)}/qm</span></h2>
      <h3 style={{ textAlign: 'center', width: "100%"}}>{description}</h3>
    </div>
  );
}

export default MieteDisplay;