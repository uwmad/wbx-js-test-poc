import React from 'react';
import { mount } from 'enzyme';
import PadsList from '../../PadsList';
import mockPadsData from '../../mockPadsData.json';

import waitForExpect from 'wait-for-expect';
import webixFromSelector from '../test_utils/webixFromSelector';


describe('PadsList', ()=>{

    const App = document.getElementById('App');

    const editPad = jest.fn();
    const onEditPad = jest.fn();
    const previewPad = jest.fn();
    const deletePad = jest.fn();
    const changePagination = jest.fn();
    const webixUISpy = jest.spyOn(webix, 'ui');


    describe('Rendering', () => {

        const wrapper = mount(<PadsList 
            editPad={editPad}
            onEditPad={onEditPad}
            previewPad={previewPad}
            deletePad={deletePad}
            padsData={mockPadsData}
            pagination={10}
            changePagination={changePagination}
            shouldPaginate={true}
            height = {700}
        />, { 
            attachTo: App
        });

        it('React OK', ()=>{
            expect(wrapper.exists()).toBe(true);
        });

        it('Webix OK', async ()=>{
            //Datatable and Dropdown
            expect(webix.ui).toHaveBeenCalledTimes(2); 
            
            const dataTable = webixFromSelector('.webix_dtable');

            expect(dataTable).toBeTruthy();
            expect(dataTable.$view.innerHTML).toMatchSnapshot();
  
            //expect({'COLUMNS':dataTable._columns}).toMatchSnapshot();
            //expect({'DATA':dataTable.data}).toMatchSnapshot();

           /* await waitForExpect(() => {

                const element = document.querySelector('.webix_column');
                expect(element).toBeTruthy();

            });*/


        });

        it('renders Webix pageDropdown', async ()=>{

            const pageDropdown = webixFromSelector('.webix_control.webix_el_combo');
            expect(pageDropdown).toBeTruthy();
            expect(pageDropdown.$view.innerHTML).toMatchSnapshot(); 

        });

        it('renders Webix pager', async ()=>{

            const pager = webixFromSelector('.webix_pager');
            expect(pager).toBeTruthy();

            //dom written by custom js
            const pagesListInfo = document.querySelector('.pagerBar .pagesListInfo');
            expect(pagesListInfo).toBeTruthy();
            expect(pagesListInfo.innerHTML).toMatchSnapshot();

        });

    });//Rendering












});//PadsList


        //webixUISpy.mockRestore();
       // wrapper.unmount();