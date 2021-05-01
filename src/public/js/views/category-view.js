'use strict';
import { enableSPAHyperlink } from '../util/link-util.js';
import { setPageTitle } from '../util/title.js';

export default (function() {
  class CategoryView extends HTMLElement {
    static get observedAttributes() {
      return ['loading'];
    }

    constructor() {
      // establish prototype chain
      super();

      this.converter = new showdown.Converter(),

      console.log('----category view');
      setPageTitle({ prepend: '' });

      this.setupEventListeners();
      this.fetchData();
      this.render(this);
    }

    setupEventListeners() {
      this.addEventListener("category-loaded", (event) => {
        console.log('---category-loaded', event);
        this.posts =  event.detail.posts;
        this.total =  event.detail.count;
        this.render(this);

        this.querySelectorAll('.post-link').forEach(postLink => {
          console.log('enabling hyperlink');
          enableSPAHyperlink(postLink);
        });
      });
    }

    async fetchData() {
      this.setAttribute('loading', true);
      const response = await fetch(`/api/posts?order=DESC&category=${this.category}`);
      const json = await response.json();
      this.dispatchEvent(new CustomEvent('category-loaded', { detail: json }));
      this.setAttribute('loading', false);
      return json;
    }

    async connectedCallback() {
      this.render(this);
    }

    get category() {
      return this.getAttribute('category') || undefined;
    }

    render(el) {
      const titleElem = document.createElement('h1');
      titleElem.innerText = this.category;

      const ul = document.createElement('ul');
      ul.classList.add('posts-list');

      (el.posts || []).forEach(post => {
        const li = document.createElement('li');
        li.classList.add('post-list-item');
        li.innerHTML =  `
          <h2 class="post-title"><a class="post-link" href="/category/${encodeURIComponent(this.category)}/${post.id}">${he.encode(post.title)}</a></h2>
          <div class="post-author">Author: <a class="post-link" href="/authors/${post.author}">${post.display_name}</a></div>
          <div class="post-date">Created on: ${(new Date(post.created_datetime)).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          ${post.updated_datetime && `<div class="post-date">Updated on: ${(new Date(post.updated_datetime)).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>` || ''}
          <div>${this.converter.makeHtml(post.markdown)}</div>
        `;

        ul.appendChild(li);
      });

      const totalsElem = document.createElement('div');
      totalsElem.classList.add('posts-totals');
      totalsElem.innerText = `Total ${this.category.toLowerCase()}: ${this.total}`;

      el.innerHTML = `
        <style>
          h2.post-title {
            margin-top: 12px;
            margin-bottom: 2px;
          }

          a.post-link {
            text-decoration: none;
            color: #000;
          }

          a.post-link:hover {
            color: #007f72;
          }

          .post-date {
            margin-bottom: 10px;
          }

          ul.posts-list {
            list-style-type: none;
            padding-left: 20px;
            padding-right: 20px;
          }

          li.post-list-item {
            box-shadow: 0px 0px 12px rgba(0, 0, 0, .08);
            border-radius: 3px;
            margin-bottom: 25px;
            background: #fff;
            padding: 10px;
          }

          .posts-totals {
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
  customElements.define('category-view', CategoryView);
})();
