import { GradientPinkBlue } from '@visx/gradient';
import { Group } from '@visx/group';
import { ScaleSVG } from '@visx/responsive';
import { scaleOrdinal } from '@visx/scale';
import Pie  from '@visx/shape/lib/shapes/Pie';
import React, { useState } from 'react';
import { numericFormatter } from 'react-number-format';
import useSWR from 'swr';
import { DebtCollection } from '../model/graph';

export type PieChartProps = {
    width: string;
    height: string;
    dataSource: string;
    margin?: { top: number; right: number; bottom: number; left: number };
    events?: boolean;
}

type Debt = {
    amount: number,
    creditor: string
}

const debtAmount = (d: Debt) => d.amount;

const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 };

const fetcher = (input: RequestInfo, init?: RequestInit) => fetch(input, init).then(res => res.json())

function useDebtData(dataSource: string) {
    const { data, error } = useSWR(dataSource, fetcher)
  
    return {
      data: (data?.series?.debts ?? []) as DebtCollection[],
      isError: error,
      isLoading: !error && !data,
    }
}

const formatNumber = (num: string|number) => {
 return numericFormatter(num.toString(), {
    decimalScale: 0,
    prefix: "€",
    thousandSeparator: ".",
  })
}

export const PieChart = (props: PieChartProps) => {
    const width = parseInt(props.width, 10);
    const height = parseInt(props.height, 10);
    const margin = props.margin ?? defaultMargin;
   
    const { data, isError } = useDebtData(props.dataSource);
    if (width < 10) return null;

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const radius = Math.min(innerWidth, innerHeight - 40) / 2;
    const centerY = innerHeight / 2;
    const centerX = innerWidth / 2;
    const top = centerY + margin.top;
    const left = centerX + margin.left;
    const pieSortValues = (a: number, b: number) => b - a;

    if (!data || isError) return <>
      <ScaleSVG width={props.width} height={props.height}>
      <svg width={props.width} height={props.height}>
      <rect
          x={0}
          y={0}
          width={props.width}
          height={props.height}
          fill="url(#area-background-gradient)"
          rx={14}
      />
      <text x="250" y="150"
        fontFamily='sans-serif'
        fontSize="55"
        color="white">
          Loading...
        </text>
      </svg>
      </ScaleSVG>
    </>;

    const variantData = data.find(d => d.Variant === 2)
    if (variantData === undefined) {
      return <>
      <p>Loading...</p>
      </>
    }
    const debts: Debt[] = Object.entries(variantData).filter(k => k[0] !== "Variant" ).map(k => ({ "creditor": k[0], "amount": k[1] }))
    const totalDebt = debts.reduce((a, n) => a + n.amount, 0);
  
    const getLetterFrequencyColor = scaleOrdinal({
        domain: debts.map((l) => l.creditor),
        range: [
          "rgba(93,30,91,1)",
          "rgba(93,30,91,0.8)",
          "rgba(93,30,91,0.6)",
          "rgba(93,30,91,0.4)"
        ]
    });
    
    return (
      <ScaleSVG width={width} height={height}>
      <svg width={width} height={height}>
        <GradientPinkBlue id="visx-pie-gradient" />
        <rect rx={14} width={width} height={height} fill="url('#visx-pie-gradient')" />
        <Group top={top} left={left}>
        <Pie
          data={debts}
          pieValue={debtAmount}
          pieSortValues={pieSortValues}
          outerRadius={radius}
        >
          {(pie) => {
            return pie.arcs.map((arc, index) => {
              const { creditor } = arc.data;
              const [centroidX, centroidY] = pie.path.centroid(arc);
              const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;
              const arcPath = pie.path(arc) ?? undefined;
              const arcFill = getLetterFrequencyColor(creditor);
              return (
                <g key={`arc-${creditor}-${index}`}>
                  <path d={arcPath} fill={arcFill} />
                  {hasSpaceForLabel && (
                    <text
                      x={centroidX}
                      y={centroidY}
                      dy=".33em"
                      fill="#ffffff"
                      fontSize={22}
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      {arc.data.creditor}: { formatNumber(arc.data.amount) }
                    </text>
                  )}
                </g>
              );
            });
          }}
        </Pie>
        <text
            x={0}
            y={height/2 - 20}
            dy=".33em"
            fill="#ffffff"
            fontSize={22}
            textAnchor="middle"
        >
            Total Debt: {formatNumber(totalDebt)}
        </text>
      </Group>
    </svg>
    </ScaleSVG>
  )
}

export default PieChart;