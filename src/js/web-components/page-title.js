'use strict';

export default (function() {
  class PageTitle extends HTMLElement {
    constructor() {
      // establish prototype chain
      super();

      // get attribute values from getters
      let title = this.title;
      const append = this.append;


      if(append) {
        title += ` ${this.separator} ${append}`;
      }

      document.title = title;
    }

    // gathering data from element attributes
    get title() {
      return this.getAttribute('title') || '';
    }

    get append() {
      return this.getAttribute('append') || '';
    }

    get separator() {
      return this.getAttribute('separator') || '-';
    }

    //TODO: observe changes to the inputs
    // static get observedAttributes() {
    //   return ["filter"];
    // }  
    
    // attributeChangedCallback(name, oldValue, newValue) {
    //   if (oldValue === newValue) {
        //   return;
        // }
    // }
  }

  // let the browser know about the custom element
  customElements.define('page-title', PageTitle);
})();
