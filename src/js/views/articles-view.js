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

      this.converter = new showdown.Converter(),

      console.log('----articles view', this.articles);
      setPageTitle({ prepend: 'Articles' });

      this.setupEventListeners();
      this.fetchData();
      this.render(this);
    }

    setupEventListeners() {
      this.addEventListener("articles-loaded", (event) => {
        console.log('---articles-loaded', event);
        this.articles =  event.detail.articles;
        this.total =  event.detail.total;
        this.render(this);

        this.querySelectorAll('.article-link').forEach(articleLink => {
          console.log('enabling hyperlink');
          enableSPAHyperlink(articleLink);
        });
      });
    }

    async fetchData() {
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
      ul.classList.add('articles-list');

      (el.articles || []).forEach(article => {
        const li = document.createElement('li');
        li.classList.add('article-list-item');
        li.innerHTML =  `
          <h2 class="article-title"><a class="article-link" href="/articles/${article.id}">${he.encode(article.title)}</a></h2>
          <div class="article-author">Author: ${article.author}</div>
          <div class="article-date">Updated on: ${(new Date(article.date)).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div>${this.converter.makeHtml(article.markdown)}</div>
        `;

        ul.appendChild(li);
      });

      const totalsElem = document.createElement('div');
      totalsElem.classList.add('articles-totals');
      totalsElem.innerText = `Total articles: ${this.total}`;

      el.innerHTML = `
        <style>
          h2.article-title {
            margin-top: 12px;
            margin-bottom: 2px;
          }

          a.article-link {
            text-decoration: none;
            color: #000;
          }

          a.article-link:hover {
            color: #007f72;
          }

          .article-date {
            margin-bottom: 10px;
          }

          ul.articles-list {
            list-style-type: none;
            padding-left: 20px;
            padding-right: 20px;
          }

          li.article-list-item {
            box-shadow: 0px 0px 12px rgba(0, 0, 0, .08);
            border-radius: 3px;
            margin-bottom: 25px;
            background: #fff;
            padding: 10px;
          }

          .articles-totals {
            margin-top: 25px;
          }
        </style>
      `;
      el.appendChild(titleElem);
      el.appendChild(ul);
      el.appendChild(totalsElem);
    }
  }

  // let the browser know about the custom element
  customElements.define('articles-view', ArticlesView);
})();
