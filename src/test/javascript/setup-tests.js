
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';


// Required for async/await
import '@babel/polyfill';


//Allow Date to be Mocked
global.MockDate = require('mockdate');

//on init , webix uses date to make a seed for ids
MockDate.set('1/1/2019'); 


//webix
(async function() {
    global.webix = require('../../../public/webix/webix.min.js');
    MockDate.reset(); //release date mock
})()


// Function to flush Promise microtask queue when tests involve promises
// see https://github.com/facebook/jest/issues/2157#issuecomment-279171856
global.flushPromises = () => new Promise((resolve) => setImmediate(resolve));
global.CONTEXT_PATH = '/test-path';


Enzyme.configure({ adapter: new Adapter() });