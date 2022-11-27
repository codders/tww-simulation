import { Range } from 'react-range';
import { useApiContext } from './apiContext';

export const StromPreisSlider = (componentProps: any) => {
  const { apiOptions, updateApiOptions } = useApiContext();
  return (
    <>
      <h3>StromPreis - {apiOptions.stromPreisCentskWh.toFixed(1)} cents/kWh</h3>
      <Range
        step={0.1}
        min={0}
        max={100}
        values={[apiOptions.stromPreisCentskWh]}
        onChange={(values) => updateApiOptions({ stromPreisCentskWh: values[0] })}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              backgroundColor: '#ccc',
              height: '6px',
              width: '100%'
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            style={{
              ...props.style,
              backgroundColor: '#999',
              height: '42px',
              width: '42px'
            }}
          />
        )}
      />
    </>)
}

export const GasPreisSlider = (componentProps: any) => {
  const { apiOptions, updateApiOptions } = useApiContext();
  return (
    <>
      <h3>Gas Preis - {apiOptions.gasPreisCentskWh.toFixed(1)} cents/kWh</h3>
      <Range
        step={0.1}
        min={0}
        max={100}
        values={[apiOptions.gasPreisCentskWh]}
        onChange={(values) => updateApiOptions({ gasPreisCentskWh: values[0] })}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              backgroundColor: '#ccc',
              height: '6px',
              width: '100%'
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            style={{
              ...props.style,
              backgroundColor: '#999',
              height: '42px',
              width: '42px'
            }}
          />
        )}
      />
    </>)
}
