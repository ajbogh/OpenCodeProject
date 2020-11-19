'use strict';
import { enableSPAHyperlink } from '../util/link-util.js';

export default (function() {
  class ArticlesView extends HTMLElement {
    static get observedAttributes() {
      return ['loading'];
    }

    constructor() {
      // establish prototype chain
      super();

      this.attachShadow({ mode: "open" });

      this.converter = new showdown.Converter(),

      console.log('----articles view', this.articles);

      this.setupEventListeners();
      this.fetchArticles();
      this.render(this);
    }

    setupEventListeners() {
      this.addEventListener("articles-loaded", (event) => {
        console.log('---articles-loaded', event);
        this.articles =  event.detail;
        this.render(this);

        this.shadowRoot.querySelectorAll('.article-link').forEach(articleLink => {
          console.log('enabling hyperlink');
          enableSPAHyperlink(articleLink);
        });
      });
  }

    async fetchArticles() {
      this.setAttribute('loading', true);
      const response = await fetch('/api/articles');
      const json = await response.json();
      this.dispatchEvent(new CustomEvent('articles-loaded', { detail: json }));
      this.setAttribute('loading', false);
      return json;
    }

    async connectedCallback() {
      this.render(this);
    }

    get id() {
      return this.getAttribute('id') || undefined;
    }

    render(el) {
      const titleElem = document.createElement('h1');
      titleElem.innerText = "Articles";

      const ul = document.createElement('ul');

      (el.articles || []).forEach(article => {
        // TODO: what about sorting?
        const li = document.createElement('li');
        li.innerHTML =  `
          <style>
            h2 {
              margin-bottom: 2px;
            }
            .date {
              margin-bottom: 10px;
            }
            ul {
              list-style-type: none; 
            }
          </style>
          <h2><a class="article-link" href="/articles/${article.id}">${he.encode(article.title)}</a></h2>
          <div class="date">${(new Date(article.date)).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div>${this.converter.makeHtml(article.markdown)}</div>
        `;

        ul.appendChild(li);
      });

      el.shadowRoot.innerHTML = '';
      el.shadowRoot.appendChild(titleElem);
      el.shadowRoot.appendChild(ul);
      // el.shadowRoot.innerHTML = `
      //   <div>Articles${el.id ? `: ${el.id}` : ''}</div>
      //   <pre>${JSON.stringify(el.articles, null, 2)}</pre>
      // `;
    }
  }

  // let the browser know about the custom element
  customElements.define('articles-view', ArticlesView);
})();
