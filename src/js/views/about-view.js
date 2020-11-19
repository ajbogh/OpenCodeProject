'use strict';

export default (function() {
  class AboutView extends HTMLElement {
    constructor() {
      // establish prototype chain
      super();

      // shadowroot has css style isolation, so we won't use it here because
      // we want to inherit styles from the stylesheet.

      console.log('----about view');
      
      let text = `About the Open Code Project`;
      
      this.innerHTML = text;
    }
  }

  // let the browser know about the custom element
  customElements.define('about-view', AboutView);
})();
