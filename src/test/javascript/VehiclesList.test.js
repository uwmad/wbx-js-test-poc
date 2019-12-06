import React from 'react';
import { mount } from 'enzyme';
import VehiclesList from '../../VehiclesList.js';
import mockPadVehiclesData from './mockPadVehiclesData.json';

import waitForExpect from 'wait-for-expect';
import webixFromSelector from '../test_utils/webixFromSelector';

describe('VehiclesList', ()=>{

    const App = document.getElementById('App');

    const onEditUpdate = jest.fn();
    const onCheck = jest.fn();
    jest.spyOn(webix, 'ui');

    let wrapper;

    describe('Rendering', () => {

        wrapper = mount(<VehiclesList
            onEditUpdate={onEditUpdate}
            onCheck={onCheck}
            vehiclesData={mockPadVehiclesData}
        />, {
            attachTo: App
        });

        it('React OK', ()=>{
            expect(wrapper.exists()).toBe(true);
        });

        it('Webix OK', async ()=>{
            //Datatable and Dropdown
            expect(webix.ui).toHaveBeenCalledTimes(1);

            const dataTable = webixFromSelector('.webix_dtable');

            expect(dataTable).toBeTruthy();


            await waitForExpect(() => {
                const element = document.querySelector('.webix_column');
                expect(element).toBeTruthy();

            });
        });

        it('contains data passed to it', async () => {
            const datatable = webixFromSelector(".webix_dtable");
            expect(datatable.data.order.length).toEqual(10);
        });
    });//Rendering
});//CompareList
//webixUISpy.mockRestore();
// wrapper.unmount();