import { AxisBottom, AxisLeft } from '@visx/axis';
import { localPoint } from '@visx/event';
import { Grid } from '@visx/grid';
import { Group } from '@visx/group';
import { LegendOrdinal } from '@visx/legend';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { BarStack } from '@visx/shape';
import { SeriesPoint } from '@visx/shape/lib/types';
import {  defaultStyles, useTooltip, useTooltipInPortal } from '@visx/tooltip';
import React, { useCallback, useMemo } from 'react';
import { numericFormatter } from 'react-number-format';
import useSWR from 'swr';
import { AnnualCost } from '../model/graph';

type TooltipData = {
  bar: SeriesPoint<AnnualCost>;
  key: CostCategory;
  index: number;
  height: number;
  width: number;
  x: number;
  y: number;
  color: string;
};

export type BarStackProps = {
  width: string;
  height: string;
  dataSource: string;
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
};

/* Where does the money come from
 What conditions do we get on the loans we take out?
 Warm-miete?
 DK policy?
  */

const purple1 = '#6c5efb';
const purple2 = '#7568ff';
export const purple3 = '#a44afe';
const purple4 = '#b554fe';
const purple5 = '#ee77fc';
const purple6 = '#ff77fb';
export const background = '#eaedff';
const defaultMargin = { top: 40, right: 0, bottom: 0, left: 0 };
const tooltipStyles = {
  ...defaultStyles,
  backgroundColor: 'rgba(0,0,0,0.9)',
  color: 'white',
  minWidth: 60,
};

// fetch implementation
const fetcher = (input: RequestInfo, init?: RequestInit) => fetch(input, init).then(res => res.json())

type CostCategory = 'Sparkasse Tilgung' | 'Sparkasse Zinsen' | 'DK Tilgung' | 'DK Zinsen' | 'KFW Tilgung' | 'KFW Zinsen';

const formatVariant = (variant: number) => `Variant ${variant}`
const formatMoney = (money: number) => `${money}€`

// accessors
const getVariant = (d: AnnualCost) => d.Variant;

let tooltipTimeout: number;

function useSanierungsData(dataSource: string) {
    const { data, error } = useSWR(dataSource, fetcher)
  
    return {
      data: (data?.series?.annualCosts ?? []) as AnnualCost[],
      isError: error,
      isLoading: !error && !data,
    }
  }

const StackedBarChart = (props: BarStackProps) => {
    const margin = props.margin ?? defaultMargin;
    const width = parseInt(props.width, 10);
    const height = parseInt(props.height, 10);
    const events = props.events ?? false;
    const { 
        tooltipOpen,
        tooltipLeft,
        tooltipTop,
        tooltipData,
        hideTooltip,
        showTooltip
    } = useTooltip<TooltipData>();

  const { data, isError } = useSanierungsData(props.dataSource);

    const keys = ['Sparkasse Tilgung', 'Sparkasse Zinsen', 'DK Tilgung', 'DK Zinsen', 'KFW Tilgung', 'KFW Zinsen'] as CostCategory[];

    const costTotals = data.reduce((allTotals, currentDate) => {
    const totalCost = keys.reduce((dailyTotal, k) => {
        dailyTotal += Number(currentDate[k]);
        return dailyTotal;
    }, 0);
    allTotals.push(totalCost);
    return allTotals;
    }, [] as number[]);

    // scales
const dateScale = scaleBand<number>({
    domain: data.map(getVariant),
    padding: 0.2,
  });
  const costScale = scaleLinear<number>({
    domain: [0, Math.ceil(Math.max(...costTotals)/50000) * 50000],
    nice: true,
  });
  const colorScale = scaleOrdinal<CostCategory, string>({
    domain: keys,
    range: [purple1, purple2, purple3, purple4, purple5, purple6],
  });
  
  const formatNumber = (num: string|number) => {
    return numericFormatter(num.toString(), {
       decimalScale: 0,
       prefix: "€",
       thousandSeparator: ".",
     })
   }
 
  const { containerRef, TooltipInPortal } = useTooltipInPortal();

  if (width < 10) return null;
  const xMax = width;
  const yMax = height - margin.top - 100;

  dateScale.rangeRound([0, xMax]);
  costScale.range([yMax, 0]);

  if (!data || isError) return <>
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
    </>;

  return width < 10 ? null : (
    <div style={{ position: 'relative' }}>
      <svg ref={containerRef} width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill={background} rx={14} />
        <Grid
          top={margin.top}
          left={margin.left}
          xScale={dateScale}
          yScale={costScale}
          width={xMax}
          height={yMax}
          stroke="black"
          strokeOpacity={0.1}
          xOffset={dateScale.bandwidth() / 2}
        />
        <Group top={margin.top}>
          <BarStack<AnnualCost, CostCategory>
            data={data}
            keys={keys}
            x={getVariant}
            xScale={dateScale}
            yScale={costScale}
            color={colorScale}
          >
            {(barStacks) =>
              barStacks.map((barStack) =>
                barStack.bars.map((bar) => (
                  <rect
                    key={`bar-stack-${barStack.index}-${bar.index}`}
                    x={bar.x}
                    y={bar.y}
                    height={bar.height}
                    width={bar.width}
                    fill={bar.color}
                    onClick={() => {
                      if (events) alert(`clicked: ${JSON.stringify(bar)}`);
                    }}
                    onMouseLeave={() => {
                      tooltipTimeout = window.setTimeout(() => {
                        hideTooltip();
                      }, 300);
                    }}
                    onMouseMove={(event) => {
                      if (tooltipTimeout) clearTimeout(tooltipTimeout);
                      // TooltipInPortal expects coordinates to be relative to containerRef
                      // localPoint returns coordinates relative to the nearest SVG, which
                      // is what containerRef is set to in this example.
                      const eventSvgCoords = localPoint(event);
                      const left = bar.x + bar.width / 2;
                      showTooltip({
                        tooltipData: bar,
                        tooltipLeft: left,
                        tooltipTop: eventSvgCoords?.y,
                      });
                    }}
                  />
                )),
              )
            }
          </BarStack>
        </Group>
        <AxisLeft
          left={margin.left + 30}
          top={margin.top}
          scale={costScale}
          tickFormat={(x => formatNumber(x.valueOf()))}
          stroke={purple3}
          tickStroke={purple3}
          tickLabelProps={() => ({
            fill: purple3,
            fontSize: 11,
            textAnchor: 'middle',
          })}
        />
        <AxisBottom
          top={yMax + margin.top}
          scale={dateScale}
          tickFormat={formatVariant}
          stroke={purple3}
          tickStroke={purple3}
          tickLabelProps={() => ({
            fill: purple3,
            fontSize: 11,
            textAnchor: 'middle',
          })}
        />
      </svg>
      <div
        style={{
          display: 'flex',
          fontSize: '14px',
          justifyContent: 'center',
          position: 'absolute',
          top: margin.top / 2 - 10,
          width: '100%',
        }}
      >
        <LegendOrdinal scale={colorScale} direction="row" labelMargin="0 15px 0 0" />
      </div>

      {tooltipOpen && tooltipData && (
        <TooltipInPortal top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
          <div style={{ color: colorScale(tooltipData.key) }}>
            <strong>{tooltipData.key}</strong>
          </div>
          <div>{formatNumber(tooltipData.bar.data[tooltipData.key])}</div>
          <div>
            <small>{formatVariant(getVariant(tooltipData.bar.data))}</small>
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
}

export default StackedBarChart;