# wbx-js-test-poc

This repo is meant to be an example for a roadblock I am having implementing unit tests for React components that create Webix widgets.

`npm install`  ,
`npm start` will start up devserver. it should render two components, Dropdown and PadsList, that use webix.

`npm test` will run the tests, located in src/test/javascript

Tests are run with jest and enzyme, and they are configured in 

*jest-config.js* 

*src/test/javascript/setup-tests.js*

and have a custom environment that sets up the script tag that webix requires in 

*src/test/test_environment/index.js*

The problem I am having is that the webix part of the components might not be behaving as I expect in the JSDOM environment. 
The tests for the initial webix render seem to work ok, however:

1. Some parts of the markup that I expect webix to create do not appear. For example, in the snapshots generated by *src/test/javascript/PadsList.test.js* , the column headers of the datatable are visible in the snapshot, but the rows with the data never appear, even if async or timeouts are used to wait.

2. Events don't seem to behave properly for the webix components in JSDOM. In *src/test/javascript/Dropdown.test.js* 
On line 95 and 96 the click events do not trigger any update to the dropdown, although the same lines run in the browser behave as expected.

And interestingly On line 83, the setValue(); method does update the dropdown. The onselect callback is called, and the dropdown value changes as expected. However, the snapshot taken afterwards does not show that value change. The snapshot's value property is still "item3", the value on initial render.

My feeling is that something with the webix EventSystem might not be working as expected in the JSDOM environment, causing the events that webix uses to fail, and giving me my two symptoms - of events not working, and webix markup remaining stuck in its initial state and not rendering.