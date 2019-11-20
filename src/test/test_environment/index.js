const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const publicIndexHtml = fs.readFileSync(path.resolve(__dirname, '../../../public/index.html'), 'utf8');

//From : 
//https://github.com/facebook/jest/blob/master/packages/jest-environment-jsdom/src/index.ts
//https://jestjs.io/docs/en/configuration#testenvironment-string

// way to use our public index.html as jsdom environment for tests so webix works
// does not execute scripts or load resources on index.html, just the markup
// could use docblock pragmas to further customize or separate environment changes per test 
// @TODO if we could get pragma conditional environment to load webix will save time on test duration.

const JSDOMEnvironment = require('jest-environment-jsdom');

class CustomEnvironment extends JSDOMEnvironment {
  constructor(config, context) {

    super(config, context);
    this.testPath = context.testPath;
    this.docblockPragmas = context.docblockPragmas;

  }

  async setup() {
    await super.setup();

    const realDom = new JSDOM(publicIndexHtml);
    this.global.window.document.head.innerHTML = realDom.window.document.head.innerHTML;
    this.global.window.document.body.innerHTML = realDom.window.document.body.innerHTML;

    //this works too..
    //this.global.window.document.head.innerHTML = '<script></script>';
    //this.global.window.document.body.innerHTML = '<div id="App"></div>';

    // Will trigger if docblock contains @my-custom-pragma my-pragma-value
    if (this.docblockPragmas['my-custom-pragma'] === 'my-pragma-value') {
      // ...
    }

  }

  async teardown() {
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }

  handleTestEvent(event, state) {
    if (event.name === 'test_start') {
      // ...
    }
  }
}

module.exports = CustomEnvironment;