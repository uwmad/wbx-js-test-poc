// const { JSDOM } = require('jsdom');
// const fs = require('fs');
// const path = require('path');
// const publicIndexHtml = fs.readFileSync(path.resolve(__dirname, '../../../public/index.html'), 'utf8');

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

    const window = this.global.window;
    Object.defineProperties(window.HTMLElement.prototype, {
      offsetLeft: {
        get: function() { return parseFloat(window.getComputedStyle(this).marginLeft) || 0; },
        configurable : true,
      },
      offsetTop: {
        get: function() { return parseFloat(window.getComputedStyle(this).marginTop) || 25; },
        configurable : true,
      },
      offsetHeight: {
        get: function() { return parseFloat(window.getComputedStyle(this).height) || 612; },
        configurable : true,
      },
      offsetWidth: {
        get: function() { return parseFloat(window.getComputedStyle(this).width) || 1680 },
        configurable : true,
      },
      clientWidth: {
        get: function() { return parseFloat(window.getComputedStyle(this).height) || 1680; },
        configurable : true,
      },
      clientHeight: {
        get: function() { return parseFloat(window.getComputedStyle(this).width) || 612 },
        configurable : true,
      }
    });
    // const realDom = new JSDOM(publicIndexHtml);
    // this.global.window.document.head.innerHTML = realDom.window.document.head.innerHTML;
    // this.global.window.document.body.innerHTML = realDom.window.document.body.innerHTML;

    //this works too..
    this.global.window.document.head.innerHTML = '<script></script>';
    this.global.window.document.body.innerHTML = '<div id="App"></div>';

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