import { Range } from 'react-range';
import { useApiContext } from './apiContext';

export const KfwKreditZinsenSlider = (componentProps: any) => {
  const { apiOptions, updateApiOptions } = useApiContext();
  return (
    <>
      <h3>KfwKredit Zinsen - {apiOptions.kfwKreditZinsen}%</h3>
      <Range
        step={0.1}
        min={0}
        max={5}
        values={[apiOptions.kfwKreditZinsen]}
        onChange={(values) => updateApiOptions({ kfwKreditZinsen: values[0] })}
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

export const KfwKreditTilgungSlider = (componentProps: any) => {
  const { apiOptions, updateApiOptions } = useApiContext();
  return (
    <>
      <h3>KfwKredit Tilgung - {apiOptions.kfwKreditTilgung}%</h3>
      <Range
        step={0.1}
        min={0.1}
        max={5}
        values={[apiOptions.kfwKreditTilgung]}
        onChange={(values) => updateApiOptions({ kfwKreditTilgung: values[0] })}
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