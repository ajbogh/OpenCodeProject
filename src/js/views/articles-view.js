'use strict';
import { enableSPAHyperlink } from '../util/link-util.js';
import { setPageTitle } from '../util/title.js';

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
      setPageTitle({ prepend: 'Articles' });

      this.setupEventListeners();
      this.fetchArticles();
      this.render(this);
    }

    setupEventListeners() {
      this.addEventListener("articles-loaded", (event) => {
        console.log('---articles-loaded', event);
        this.articles =  event.detail.articles;
        this.total =  event.detail.total;
        this.render(this);

        this.shadowRoot.querySelectorAll('.article-link').forEach(articleLink => {
          console.log('enabling hyperlink');
          enableSPAHyperlink(articleLink);
        });
      });
  }

    async fetchArticles() {
      this.setAttribute('loading', true);
      const response = await fetch('/api/articles?sortBy=date&order=DESC');
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
        const li = document.createElement('li');
        li.innerHTML =  `
          <h2><a class="article-link" href="/articles/${article.id}">${he.encode(article.title)}</a></h2>
          <div class="author">Author: ${article.author}</div>
          <div class="date">Updated on: ${(new Date(article.date)).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div>${this.converter.makeHtml(article.markdown)}</div>
        `;

        ul.appendChild(li);
      });

      const totalsElem = document.createElement('div');
      totalsElem.classList.add('totals');
      totalsElem.innerText = `Total articles: ${this.total}`;

      el.shadowRoot.innerHTML = `
        <style>
          h2 {
            margin-top: 12px;
            margin-bottom: 2px;
          }

          a, a:link, a:visited {
            color: #05ad9c;
            text-decoration: none;
          }

          a:focus, a:hover, a:active {
            color: #007f72;
            text-decoration: underline;
          }

          a.article-link {
            text-decoration: none;
            color: #000;
          }

          a.article-link:hover {
            color: #007f72;
          }

          .date {
            margin-bottom: 10px;
          }

          ul {
            list-style-type: none;
            padding-left: 20px;
            padding-right: 20px;
          }

          li {
            box-shadow: 0px 0px 12px rgba(0, 0, 0, .08);
            border-radius: 3px;
            margin-bottom: 25px;
            background: #fff;
            padding: 10px;
          }

          .totals {
            margin-top: 25px;
          }
        </style>
      `;
      el.shadowRoot.appendChild(titleElem);
      el.shadowRoot.appendChild(ul);
      el.shadowRoot.appendChild(totalsElem);
      // el.shadowRoot.innerHTML = `
      //   <div>Articles${el.id ? `: ${el.id}` : ''}</div>
      //   <pre>${JSON.stringify(el.articles, null, 2)}</pre>
      // `;
    }
  }

  // let the browser know about the custom element
  customElements.define('articles-view', ArticlesView);
})();
