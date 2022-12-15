import React from "react";
import { Range } from 'react-range';
import { useApiContext } from "./apiContext";

export const VariantSlider = (props: any) => {
    const { apiOptions, updateApiOptions } = useApiContext();
    return (
      <>
        <h3>Variant {apiOptions.variant}</h3>
        <Range
          step={1}
          min={1}
          max={4}
          values={[apiOptions.variant]}
          onChange={(values) => updateApiOptions({ variant: values[0] })}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                backgroundColor: '#ccc',
                height: '6px',
                width: '90%'
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

export default VariantSlider;