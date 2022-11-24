import { Range } from 'react-range';
import { useApiContext } from './apiContext';

export const DirektKreditSlider = (componentProps: any) => {
    const { apiOptions, updateApiOptions } = useApiContext();
    return (
        <>
        <h3>DirektKredite - {apiOptions.direktKredite}</h3>
        <Range
          step={10000}
          min={0}
          max={1000000}
          values={[apiOptions.direktKredite]}
          onChange={(values) => updateApiOptions({ direktKredite: values[0] })}
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

export const DirektKreditZinsenSlider = (componentProps: any) => {
  const { apiOptions, updateApiOptions } = useApiContext();
  return (
      <>
      <h3>DirektKredite Zinsen - {apiOptions.direktKreditZinsen}%</h3>
      <Range
        step={0.1}
        min={0}
        max={5}
        values={[apiOptions.direktKreditZinsen]}
        onChange={(values) => updateApiOptions({ direktKreditZinsen: values[0] })}
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

export const DirektKreditTilgungSlider = (componentProps: any) => {
  const { apiOptions, updateApiOptions } = useApiContext();
  return (
      <>
      <h3>DirektKredite Tilgung - {apiOptions.direktKreditTilgung}%</h3>
      <Range
        step={0.1}
        min={0}
        max={5}
        values={[apiOptions.direktKreditTilgung]}
        onChange={(values) => updateApiOptions({ direktKreditTilgung: values[0] })}
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