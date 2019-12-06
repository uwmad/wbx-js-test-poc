import React from 'react';
import PropTypes from 'prop-types';
import WebixHelper from "./webix/WebixHelper";

const{ webix } = window;

/* eslint-disable react/sort-comp */ //constructor should be first


const VehiclesList = (props) => {
    const {paginate, perPage, vehiclesData, onCheck, onEditUpdate} = props;


    const checkboxTemplate = (obj, common, value) => {
        if (value) {
            return "<span class='webix_table_checkbox webix_icon wxi-checkbox-marked'></span>";
        }
        return "<span class='webix_table_checkbox webix_icon wxi-checkbox-blank'></span>";
    };


    const dropdownTemplate = (obj) => {

        const baseHTML = `<span class='webix_icon wxi-angle-down effective-date-chevron'/>`;

        if (obj.selectedEffectiveDates) {

            const effectiveDates = obj.selectedEffectiveDates.split(",");

            if (effectiveDates.length > 1) {
                return `${effectiveDates.length} Selected ${baseHTML}`;
            } 

                const index = obj.effectiveDates[parseInt(effectiveDates[0], 10) - 1];
                if (index) {
                    return `${index.value.split(" ")[0]} ${baseHTML}`;
                }

        }

        return `<span>${obj.effectiveDates[0].value.split(" ")[0]} - current</span> ${baseHTML}`;

    };


    const setEffectiveDates = (obj, inst) => {
        if (obj.column === "selectedEffectiveDates") {
            const list = inst.getColumnConfig(obj.column).collection;
            list.clearAll();
            list.parse(inst.getItem(obj.row).effectiveDates);
        }
    };

    const editMultiSelectState = (id, inst) => {
        const editor = inst.getEditor(id);
        editor.getPopup().$setSize(140, editor.$height);
    };

    const eventHandlers = {
        onAfterEditStop(state, editor) {
            onEditUpdate(state, editor);
        },
        onBeforeEditStart(id) {
            setEffectiveDates(id, this);
        },
        onAfterEditStart(id) {
            if (id.column === 'selectedEffectiveDates') {
                editMultiSelectState(id, this);
            }
        },
        onCheck(row, col, state) {
            onCheck(row, col, state);
        },
    };

    webix.ui.datafilter.customCheck = webix.extend({
        refresh(master, node, config) {
            node.onclick = () => {
                const checkbox = node.getElementsByTagName("span")[0];
                const wasChecked = checkbox.className.includes("marked");
                config.checked = !wasChecked;

                if (!config.checked) {
                    checkbox.className = checkbox.className.replace("checkbox-marked", "checkbox-blank");
                } else {
                    checkbox.className = checkbox.className.replace("checkbox-blank", "checkbox-marked");
                }
                const column = master.getColumnConfig(config.columnId);
                const checked = config.checked ? column.checkValue : column.uncheckValue;

                const range = master.data.getIndexRange(master.data.$min, master.data.$max);

                range.forEach((r, i) => {
                    const obj = range[i];
                    obj[config.columnId] = checked;
                    master.callEvent("onCheck", [obj.id, config.columnId, checked]);
                });

                master.refresh();
            };
        },
        render() {
            return `<span class="webix_icon wxi-checkbox-blank"/>`;
        },
    }, webix.ui.datafilter.masterCheckbox);

    const stringToCurrency = (str) => parseFloat(str).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

    const config = {
        resizeColumn: true,
        view: "datatable",
        css: "noselect webix_header_border webix_data_border",
        autoheight: true,
        scroll: 'y',
        sorting: true,
        checkboxRefresh: true,
        editable: true,
        on: eventHandlers,
        data : vehiclesData,
        columns: [
            {
                id: "checkbox",
                header:
                    {
                        content: "customCheck",
                    },
                template: checkboxTemplate,
                width: 50,
            },
            {
                id: "quantity",
                header:
                    {
                        text: "Quantity",
                    },
                editor: "text",
                template : (data) => (data.quantity ? data.quantity : 1),
                width: 70,
            },
            {
                id: "trim",
                header: {
                    text: "Trim",
                    css: "sortable-column-header",
                },
                template : (data) => data.trimName,
                width: 120,
                fillspace : true,
                sort: "string",
            },
            {
                id: "drive",
                header: {
                    text: "Drive",
                    css: "sortable-column-header",
                },
                width: 65,
                template : (data) => data.fieldMap.drive,
                sort: "string",
            },
            {
                id: "body",
                header: {
                    text: "Body/Cab Style",
                    css: "sortable-column-header",
                },
                template : (data) => data.fieldMap.body,
                fillspace : true,
                width: 65,
                sort: "string",
            },
            {
                id: "boxLength",
                header: {
                    text: "Box Length/WB",
                    css: "sortable-column-header",
                },
                width: 120,
                template : (data) => data.fieldMap.box,
                sort: "string",
            },
            {
                id: "msrp",
                header: {
                    text: "MSRP",
                    css: "sortable-column-header",
                },
                template : (data) => `$ ${stringToCurrency(data.pricing.msrp)}`,
                width: 90,
                fillspace : false,
                sort: "string",
            },
            {
                id: "dnet",
                header: {
                    text: "DNet",
                    css: "sortable-column-header",
                },
                template : (data) => `$ ${stringToCurrency(data.pricing.dealerNet)}`,
                width: 90,
                fillspace : false,
                sort: "string",
            },
            {
                id: "mfgrCode",
                header: {
                    text: "Mfgr. Code",
                    css: "sortable-column-header",
                },
                template : (data) => data.mfgrCode,
                width: 90,
                fillspace: false,
                sort: "string",
            },
            {
                id: "selectedEffectiveDates",
                header: {
                    text: "Effective Date",
                },

                editor: "multiselect",
                width: 120,
                options: [],
                optionlist : true,
                suggest : {
                    view : "multisuggest",
                    buttonText : "Add",
                },
                template: dropdownTemplate,
                fillspace : true,
            },
        ],
    };

    /* Pagination and Page Limits*/
    if (paginate === true) {
        config.pager = {
            template: "{common.first()}{common.prev()} {common.pages()} {common.next()} {common.last()} ",
            size: perPage,
        };
    }

    const init = (helper) => webix.ui({
            ...config,
            container: helper.ref.current,
        });

    return(<WebixHelper eventHandles={eventHandlers} data={vehiclesData} webixInitFn={init} />);
};

VehiclesList.propTypes = {
    //search : PropTypes.bool,
    paginate : PropTypes.bool,
    perPage : PropTypes.number, //Or bool
    vehiclesData : PropTypes.array, //Shape
    onCheck: PropTypes.func.isRequired,
    onEditUpdate: PropTypes.func.isRequired,
};

VehiclesList.defaultProps = {
    //search : false,
    paginate : false,
    perPage : 10,
    vehiclesData : [],
};

export default VehiclesList;
