import React from 'react';
import PropTypes from 'prop-types';
import WebixHelper from "./webix/WebixHelper";

const{ webix } = window;

const Dropdown = (props) => {

    const { options, onSelect, placeholder, disabled, width, id, value } = props;

    const handleChange = (newVal) => {
        let selected = '';
        options.forEach((option) => {
            if (option.id === newVal) {
                selected = option.value;
            }
        });

        onSelect(selected, id);
    };

    const config = {
        view:"combo",
        id,
        scroll:false,
        disabled,
        placeholder,
        width,
        height: 40,
        options,
        value,
        icon:"wxi-angle-down",
        on: {
            onChange(newVal) {
                handleChange(newVal);
            },
        },
    };

    const init = (helper) => webix.ui({
            ...config,
            container: helper.ref.current,
        });

    return(<WebixHelper webixInitFn={init} config={config} />);
};

Dropdown.propTypes = {
    options:        PropTypes.array,
    width:          PropTypes.number.isRequired,
    onSelect:       PropTypes.func.isRequired,
    id:             PropTypes.string.isRequired,
    placeholder:    PropTypes.string,
    disabled:       PropTypes.bool,
    value:          PropTypes.any,
};

Dropdown.defaultProps = {
    disabled:       false,
    placeholder:    "Select",
    value:          undefined,
    options:        [],
};

export default Dropdown;
