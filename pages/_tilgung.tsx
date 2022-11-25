import { ResizeObserver } from '@juggle/resize-observer';
import { Axis, Orientation } from '@visx/axis';
import { localPoint } from '@visx/event';
import { GradientPinkBlue, LinearGradient } from '@visx/gradient';
import { GridColumns, GridRows } from '@visx/grid';
import { scaleLinear, scaleTime } from '@visx/scale';
import { AreaStack, Bar, Line } from '@visx/shape';
import { defaultStyles, useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { bisector, extent, max } from 'd3-array';
import { timeFormat } from 'd3-time-format';
import React, { useCallback, useMemo } from 'react';
import { numericFormatter } from 'react-number-format';
import useSWR from 'swr';
import { TilgungDataPoint, TilgungDataPointWithVariant } from '../model/graph';

export const background = '#eaedff';
export const background2 = '#eaffff';
const dkColor = 'rgba(93,30,91,1)';
const kfwColor = 'rgba(93,30,91,0.8)';
const sparkasseColor = 'rgba(93,30,91,0.6)'
export const accentColor = '#edffea';
export const accentColorDark = '#75daad';
export const accentColorRetire = '#55aa55';
export const accentColorDeath = '#aa5555';
export const fixedAssetColor = '#ffff99';
const tooltipStyles = {
  ...defaultStyles,
  background: '#000',
  border: '1px solid white',
  color: 'white',
};

// fetch implementation
const fetcher = (input: RequestInfo, init?: RequestInit) => fetch(input, init).then(res => res.json())

type LoanType = keyof(TilgungDataPoint);
const loanTypes: LoanType[] = [ "Sparkasse", "KfW", "DirektKredite" ];


const formatNumber = (num: string|number) => {
    return numericFormatter(num.toString(), {
       decimalScale: 0,
       prefix: "€",
       thousandSeparator: ".",
     })
   }

type LoanProperties = {
    RefinanceKfw: Date,
    RefinanceSparkasse: Date
}

const loanProperties: LoanProperties = {
    RefinanceKfw: new Date(Date.parse('2033-01-01')),
    RefinanceSparkasse: new Date(Date.parse('2031-01-01')),
}

// accessors
const getDate = (d: TilgungDataPoint) => new Date(d.date);
const getTotalValue = (d: TilgungDataPoint) => Object.entries(d).reduce((acc, entry) => acc + (entry[0] === 'date' ? 0 : entry[1] as number), 0);
const bisectDate = bisector<TilgungDataPoint, Date>((d) => new Date(d.date)).left;

function useTilgungData(dataSource: string) {
  const { data, error } = useSWR(dataSource, fetcher)

  return {
    isError: error,
    isLoading: !error && !data,
    stock: ((data?.series?.tilgung ?? []) as TilgungDataPointWithVariant[]).filter(d => d.Variant === 2).map(d => { const { Variant, ...others} = d; return others })
  }
}

const dateTickLabelProps = () =>
  ({
    fill: accentColor,
    fontFamily: 'sans-serif',
    fontSize: 12,
    textAnchor: 'middle',
  } as const);

const eurTickLabelProps = () =>
  ({
    fill: accentColor,
    fontFamily: 'sans-serif',
    fontSize: 12,
    textAnchor: 'start',
  } as const);

const TilgungChart = (props: any) => {
  const margin = { top: 0, left: 0, right: 0, bottom: 0};

  // bounds
  const innerWidth = props.width - margin.left - margin.right;
  const innerHeight = props.height - margin.top - margin.bottom;
  const { stock, isError } = useTilgungData(props.dataSource);
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    showTooltip,
    hideTooltip,
  } = useTooltip()
  const {
    containerRef,
    TooltipInPortal
  } = useTooltipInPortal({
    detectBounds: false,
    polyfill: ResizeObserver,
    scroll: true
  });

  // scales
  const dateScale = useMemo(
    () =>
      scaleTime({
        domain: extent(stock, getDate) as [Date, Date],
        range: [margin.left, innerWidth + margin.left],
      }),
    [innerWidth, margin.left, stock],
  );

  const stockValueScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, (max(stock, getTotalValue) || 0) + innerHeight / 3],
        nice: true,
        range: [innerHeight + margin.top, margin.top],
      }),
    [margin.top, innerHeight, stock],
  );

  const dateFormat = "%Y";

  const dateFormatter = (date: Date) => {
    return timeFormat(dateFormat)(date);
  }

  // tooltip handler
  const handleTooltip = useCallback(
    (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = dateScale.invert(x);
      const index = bisectDate(stock, x0, 1);
      const d0 = stock[index - 1];
      const d1 = stock[index];
      let d = d0;
      if (d1 && getDate(d1)) {
        d = x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0;
      }
      showTooltip({
        tooltipData: d,
        tooltipLeft: x,
        tooltipTop: stockValueScale(getTotalValue(d)),
      });
    },
    [showTooltip, stockValueScale, dateScale, stock],
  );

  if (props.width < 10) return null;

  if (!stock || stock.length === 0 || isError) return <>
      <svg width={props.width} height={props.height}>
      <rect
          x={0}
          y={0}
          width={props.width}
          height={props.height}
          fill="url(#area-background-gradient)"
          rx={14}
      />
      <LinearGradient id="area-background-gradient" from={background} to={background2} />
      <text x="250" y="150"
        fontFamily='sans-serif'
        fontSize="55"
        color="white">
          Loading...
        </text>
      </svg>
    </>;

  return (
    <>
      <svg width={props.width} height={props.height} ref={containerRef}>
        <rect
          x={0}
          y={0}
          width={props.width}
          height={props.height}
          fill="url(#area-background-gradient)"
          rx={14}
        />
        <GradientPinkBlue id="area-background-gradient" />
        <LinearGradient id="area-gradient-KfW" from={kfwColor} to={kfwColor} />
        <LinearGradient id="area-gradient-Sparkasse" from={sparkasseColor} to={sparkasseColor} />
        <LinearGradient id="area-gradient-DirektKredite" from={dkColor} to={dkColor} />
        <GridRows
          left={margin.left}
          scale={stockValueScale}
          width={innerWidth}
          strokeDasharray="1,3"
          stroke={accentColor}
          strokeOpacity={0}
          pointerEvents="none"
        />
        <GridColumns
          top={margin.top}
          scale={dateScale}
          height={innerHeight}
          strokeDasharray="1,3"
          stroke={accentColor}
          strokeOpacity={0.2}
          pointerEvents="none"
        />
        <AreaStack
          top={margin.top}
          left={margin.left}
          keys={loanTypes}
          data={stock}
          x={(d) => dateScale(getDate(d.data)) ?? 0}
          y0={(d) => (stockValueScale(d[0]) || 0) }
          y1={(d) => (stockValueScale(d[1]) || 0) }
        >
          {({ stacks, path }) =>
            stacks.map((stack) => (
              <path
                key={`stack-${stack.key}`}
                d={path(stack) || ''}
                stroke="transparent"
                fill={`url(#area-gradient-${stack.key})`}
              />
            ))
          }
        </AreaStack>
        {innerWidth > 400 && (
          <Axis
            key="axis-x"
            orientation={Orientation.bottom}
            top={innerHeight - 25}
            scale={dateScale}
            tickFormat={(v: any, i: number) => v instanceof Date ? dateFormatter(v) : ""}
            stroke={accentColor}
            tickStroke={accentColor}
            tickLabelProps={dateTickLabelProps}
            tickValues={undefined}
            numTicks={6}
            label={"Date"}
            labelProps={{
              fill: accentColor,
              fontFamily: 'sans-serif',
              fontSize: 12,
              paintOrder: 'stroke',
              stroke: '#000',
              strokeWidth: 0,
              textAnchor: 'start',
              x: 30,
              y: 18,
            }}
          />)
        }
        {innerHeight > 300 && (
          <Axis
            key="axis-y"
            orientation={Orientation.left}
            left={20}
            scale={stockValueScale}
            tickFormat={(v: any, i: number) => v}
            stroke={accentColor}
            tickStroke={accentColor}
            tickLabelProps={eurTickLabelProps}
            tickValues={undefined}
            numTicks={6}
            label={"EUR"}
            labelProps={{
              fill: accentColor,
              fontFamily: 'sans-serif',
              fontSize: 12,
              paintOrder: 'stroke',
              stroke: '#000',
              strokeWidth: 0,
              textAnchor: 'start',
              x: -30,
              y: -5,
            }}
          />)
        }
        <Bar
          x={margin.left}
          y={margin.top}
          width={innerWidth}
          height={innerHeight}
          fill="transparent"
          rx={14}
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}
        />
        <Line
          from={{ x: margin.left + dateScale(loanProperties.RefinanceSparkasse), y: margin.top }}
          to={{ x: margin.left + dateScale(loanProperties.RefinanceSparkasse), y: innerHeight + margin.top }}
          stroke={accentColorRetire}
          strokeWidth={2}
          pointerEvents="none"
          strokeDasharray="5,2"
        />
        <Line
          from={{ x: margin.left + dateScale(loanProperties.RefinanceKfw), y: margin.top }}
          to={{ x: margin.left + dateScale(loanProperties.RefinanceKfw), y: innerHeight + margin.top }}
          stroke={accentColorDeath}
          strokeWidth={2}
          pointerEvents="none"
          strokeDasharray="5,2"
        />
        {tooltipData && (
          <g>
            <Line
              from={{ x: tooltipLeft, y: margin.top }}
              to={{ x: tooltipLeft, y: innerHeight + margin.top }}
              stroke={accentColorDark}
              strokeWidth={2}
              pointerEvents="none"
              strokeDasharray="5,2"
            />
            <circle
              cx={tooltipLeft}
              cy={(tooltipTop || 0) + 1}
              r={4}
              fill="black"
              fillOpacity={0.1}
              stroke="black"
              strokeOpacity={0.1}
              strokeWidth={2}
              pointerEvents="none"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={4}
              fill={accentColorDark}
              stroke="white"
              strokeWidth={2}
              pointerEvents="none"
            />
          </g>
        )}
      </svg>
      {tooltipData && (
        <div>
          <TooltipInPortal
            key={Math.random()}
            top={(tooltipTop || 0) - 12}
            left={(tooltipLeft || 0) + 12}
            style={tooltipStyles}
          >
            <>
            <b>Total: {formatNumber(getTotalValue(tooltipData as TilgungDataPoint))}</b><br/>
            Sparkasse: {formatNumber((tooltipData as TilgungDataPoint).Sparkasse)}<br/>
            KfW: {formatNumber((tooltipData as TilgungDataPoint).KfW)}<br/>
            DirektKredite: {formatNumber((tooltipData as TilgungDataPoint).DirektKredite)}<br/>
            </>
          </TooltipInPortal>

          <TooltipInPortal
            key={Math.random()}
            top={innerHeight + margin.top - 14}
            left={(tooltipLeft || 0) - 50}
            style={{
              ...defaultStyles,
              textAlign: 'center'
            }}
          >
            {dateFormatter(getDate(tooltipData as TilgungDataPoint))}
          </TooltipInPortal>
        </div>
      )}
    </>
  );
};

export default TilgungChart;