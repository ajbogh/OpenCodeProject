'use strict';
import { enableSPAHyperlink } from '../util/link-util.js';

export default (function() {
  class ArticleView extends HTMLElement {
    static get observedAttributes() {
      return ['loading'];
    }

    constructor() {
      // establish prototype chain
      super();

      this.attachShadow({ mode: "open" });

      this.converter = new showdown.Converter(),

      console.log('----article view', this.articles);

      this.setupEventListeners();
      this.fetchArticle(this.id);
      this.render();
    }

    setupEventListeners() {
      this.addEventListener("article-loaded", (event) => {
        console.log('---articles-loaded', event);
        this.article =  event.detail;
        this.render();

        this.shadowRoot.querySelectorAll('.article-link').forEach(articleLink => {
          console.log('enabling hyperlink');
          enableSPAHyperlink(articleLink);
        });
      });
  }

    async fetchArticle(id) {
      this.setAttribute('loading', true);
      const response = await fetch(`/api/articles/${id}`);
      const json = await response.json();
      this.dispatchEvent(new CustomEvent('article-loaded', { detail: json }));
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
      const { article } = this;

      if(!article) {
        return;
      }

      this.shadowRoot.innerHTML = `
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
            <h2>${he.encode(article.title)}</h2>
            <div class="date">${(new Date(article.date)).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </header>
          <main>${this.converter.makeHtml(article.markdown)}</main>
        </article>
      `;
    }
  }

  // let the browser know about the custom element
  customElements.define('article-view', ArticleView);
})();
