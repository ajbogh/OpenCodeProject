'use strict';

export default (function() {
  class AdminView extends HTMLElement {
    constructor() {
      // establish prototype chain
      super();

      // shadowroot has css style isolation, so we won't use it here because
      // we want to inherit styles from the stylesheet.

      console.log('----admin view');
      
      let text = `
        <h2>Administration</h2>
        Add Post
        User Management
      `;
      
      this.innerHTML = text;
    }
  }

  // let the browser know about the custom element
  customElements.define('admin-view', AdminView);
})();
