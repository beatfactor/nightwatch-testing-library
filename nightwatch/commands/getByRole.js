const path = require('path');
const fs = require('fs');

module.exports = class GetByRole {
  async injectLib() {
    if (this.client.__testingLibraryDomInjected) {
      return;
    }
    
    const DOM_TESTING_LIBRARY_UMD_PATH = path.join(require.resolve('@testing-library/dom'), '../../', 'dist/@testing-library/dom.umd.min.js');
    const DOM_TESTING_LIBRARY_UMD = fs.readFileSync(DOM_TESTING_LIBRARY_UMD_PATH).toString();
    const SIMMERJS = fs.readFileSync(require.resolve('simmerjs/dist/simmer.js')).toString();
    
    const scriptFn = `function(domTestingLibraryUmd, simmerJs) {
      var scriptTag = document.createElement('script');
      scriptTag.innerHTML = domTestingLibraryUmd;
      document.body.appendChild(scriptTag);
      
      var scriptTag2 = document.createElement('script');
      scriptTag2.innerHTML = simmerJs;
      document.body.appendChild(scriptTag2);
    }`;
    
      
    await this.driver.executeScript(`var passedArgs = Array.prototype.slice.call(arguments,0); return (${scriptFn.toString()}).apply(window, passedArgs);`, DOM_TESTING_LIBRARY_UMD, SIMMERJS);

    if (this.api.options && this.api.options.testing_library) {
      // eslint-disable-next-line
      await this.api.execute(function (_config) {window.TestingLibraryDom.configure(_config);}, [this.api.options.testing_library]);
    }

    this.client.__testingLibraryDomInjected = true;
  }
  
  executeCommand(queryName, args, container) {
    const scriptFn = `function (queryName, args, container) {
      if (typeof window.TestingLibraryDom == 'undefined') {
        return {error: '__library__missing__'};  
      }
      
      try {
        args = args.map(function(arg) {
          if (arg.RegExp) {
            return eval(arg.RegExp);
          }
          return arg;
        });

        var root = container ? document.querySelector(container) : document.body;
        args.unshift(root);

        var elms = window.TestingLibraryDom[queryName].apply(window.TestingLibraryDom, args);
        var selector;
        if (/AllBy/.test(queryName)) {
          selector = elms.map(function(elm) {
            return window.Simmer(elm);
          });
        } else {
          selector = window.Simmer(elms);
        }
        return selector;
      } catch (e) {
        return { error: { message: e.message, stack: e.stack } };
      }
    }`;

    return this.driver.executeScript(`var passedArgs = Array.prototype.slice.call(arguments,0); return (${scriptFn.toString()}).apply(window, passedArgs);`, queryName, args, container);
  }
  
  async command(...args) {
    const queryName = 'getByRole';
    
    await this.injectLib();
    args = args.map(function(arg) {
      if (arg instanceof RegExp) {
        return {RegExp: arg.toString()};
      }
      return arg;
    });
    
    let container;
    if (args[0] && args[0].container) {
      container = args[0].container.selector;
      args[0] = args[0].selector;
    }
    
    let element = await this.executeCommand(queryName, args, container);
    if (element && element.error && element.error === '__library__missing__') {
      this.client.__testingLibraryDomInjected = false;
      await this.injectLib();
      element = await this.executeCommand(queryName, args, container);
    }
    
    if (this.client.argv.debug) {
      await this.api.debug();
    }
      
    if (element && element.error) {
       let {message} = element.error;
       message = message || element.error;
       message = message.split('\n')[0];
       const error = new Error(`Error while running ${queryName}: ${message}`);
       error.name = 'TestingLibraryError';
       error.link = 'https://testing-library.com/docs/dom-testing-library/api';
       error.rejectPromise = true;
       throw error;
    }
      
    if (Array.isArray(element)) {
      return element.map(item => {
        return this.api.createElement(item);
      });
    }

    return this.api.createElement(element);
  } 
}