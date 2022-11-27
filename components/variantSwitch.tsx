import React from "react";
import Switch from "react-switch";
import { useApiContext } from "./apiContext";

export const VariantSwitch = (props: any) => {
    const { apiOptions, updateApiOptions } = useApiContext();
    const setChecked = (checked: boolean) => {
        updateApiOptions({ variant: (checked ? 2 : 1) });
    };

    return (
        <>
            <h3>Variant {apiOptions.variant}</h3>
            <Switch onChange={setChecked} checked={apiOptions.variant === 2} uncheckedIcon={false} checkedIcon={false} onColor={"#888"} />
        </>
    );
}

export default VariantSwitch;