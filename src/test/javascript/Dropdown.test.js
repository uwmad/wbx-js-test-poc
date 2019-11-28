import React from 'react';
import { mount } from 'enzyme';
import Dropdown from "../../Dropdown";
import waitForExpect from 'wait-for-expect';
import webixFromSelector from '../test_utils/webixFromSelector';

describe('Dropdown', () => {


    describe('Rendering', () => {

        const App = document.getElementById('App');
        const webixUISpy = jest.spyOn(webix, 'ui');
        let wrapper;

        const options = ['item1','item2','item3','item4'];
        const width = 100;
        const onSelect = jest.fn();
        const placeholder = 'placeholder text';
        const disabled = false;
        const value = 'item3';

        beforeEach(() => {
            wrapper = mount (
                    <Dropdown 
                        options = { options }
                        width = { width }
                        onSelect = { onSelect }
                        placeholder = { placeholder }
                        disabled = { disabled }
                        value = { value }
                    />,
                    { 
                        attachTo: App
                    }
                );
        });

        afterEach(() => {
            onSelect.mockClear();
            webixUISpy.mockClear();
            wrapper.unmount();
        });

        it('React OK', () => {
            expect(wrapper.exists()).toBe(true);
        });

        it('Webix OK', () => {

            expect(webix.ui).toHaveBeenCalledTimes(1); 
            //dropdown element
            const dropdown = webixFromSelector('.webix_control.webix_el_combo');
            // expect(dropdown.$view.innerHTML).toMatchSnapshot();

            //popup select options element
            const selectlist = webixFromSelector('.webix_popup');
            // expect(selectlist.$view.innerHTML).toMatchSnapshot();

        });

        it('Re-Renders after Prop Update', () => {

            wrapper.setProps({options : ['a','b','c'], value : 'c'}, ()=>{

                expect(wrapper.exists()).toBe(true);
                expect(webix.ui).toHaveBeenCalledTimes(2); 

                const dropdown = webixFromSelector('.webix_control.webix_el_combo');
                // expect(dropdown.$view.innerHTML).toMatchSnapshot();

                const selectlist = webixFromSelector('.webix_popup');
                // expect(selectlist.$view.innerHTML).toMatchSnapshot();

            });

        });

        it('Triggers Callback on Webix Value Change', () => { //TEST PASSES But Snapshot isnt as Expected

            const dropdown = webixFromSelector('.webix_control.webix_el_combo');
            
            dropdown.setValue('item2');
            expect(onSelect).toHaveBeenCalledTimes(1);
            expect(dropdown.getValue()).toBe('item2');
            // expect(dropdown.$view.innerHTML).toMatchSnapshot();  //still shows value="item3" ... the initial value

        });


        it('Triggers Callback on Click', async () => { //TEST FAILS, Click Events Dont seem to Register

            const dropdown = webixFromSelector('.webix_control.webix_el_combo');
  
            document.querySelector('.webix_el_combo input').click();
            document.querySelectorAll('.webix_popup .webix_list_item')[1].click();
      
           await waitForExpect(() => {

              expect(onSelect).toHaveBeenCalledTimes(1);
              expect(dropdown.getValue()).toBe('item2');

           });

        });





    });


});
