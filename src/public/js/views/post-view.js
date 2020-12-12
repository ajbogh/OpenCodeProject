'use strict';
import { enableSPAHyperlink } from '../util/link-util.js';

export default (function() {
  class PostView extends HTMLElement {
    static get observedAttributes() {
      return ['loading'];
    }

    constructor() {
      // establish prototype chain
      super();

      this.converter = new showdown.Converter(),

      console.log('----Post view');

      this.setupEventListeners();
      this.fetchCategoryItem(this.id);
      this.render();
    }

    setupEventListeners() {
      this.addEventListener("post-loaded", (event) => {
        console.log('---item-loaded', event);
        this.post = event.detail;
        this.render();

        this.shadowRoot.querySelectorAll('.post-link').forEach(postLink => {
          console.log('enabling hyperlink');
          enableSPAHyperlink(postLink);
        });
      });
    }

    async fetchCategoryItem(id) {
      this.setAttribute('loading', true);
      const response = await fetch(`/api/posts/${id}`);
      const json = await response.json();
      this.dispatchEvent(new CustomEvent('post-loaded', { detail: json }));
      this.setAttribute('loading', false);
      return json;
    }

    async connectedCallback() {
      this.render();
    }

    get id() {
      return this.getAttribute('id') || undefined;
    }

    render() {
      const { post } = this;

      if(!post) {
        return;
      }

      this.innerHTML = `
        <style>
          h2 {
            margin-bottom: 2px;
          }
          .date {
            margin-bottom: 10px;
          }
        </style>
        <article>
          <header>
            <h2>${he.encode(post.title)}</h2>
            <div class="date">${(new Date(post.date)).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </header>
          <main>${this.converter.makeHtml(post.markdown)}</main>
        </article>
      `;
    }
  }

  // let the browser know about the custom element
  customElements.define('post-view', PostView);
})();
