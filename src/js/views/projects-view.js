'use strict';

export default (function() {
  class ProjectsView extends HTMLElement {
    constructor() {
      // establish prototype chain
      super();

      // shadowroot has css style isolation, so we won't use it here because
      // we want to inherit styles from the stylesheet.

      console.log('----projects view');
      
      let text = `Projects View`;

      if(this.id){
        text += `: ${this.id}`;
      }
      
      this.innerHTML = text;
    }

    get id() {
      return this.getAttribute('id') || undefined;
    }
  }

  // let the browser know about the custom element
  customElements.define('projects-view', ProjectsView);
})();
