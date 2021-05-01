'use strict';

import { enableSPAHyperlink } from '../util/link-util.js';

export default (function() {
  class CategoriesList extends HTMLElement {
    static get observedAttributes() {
      return ['loading'];
    }

    constructor() {
      // establish prototype chain
      super();

      this.setupEventListeners();
      this.fetchData();
      this.render(this);
    }

    setupEventListeners() {
      this.addEventListener("categories-loaded", (event) => {
        console.log('---categories-loaded', event);
        this.categoryArr =  event.detail;
        this.render(this);

        this.querySelectorAll('.category-link').forEach(categoryLink => {
          console.log('enabling hyperlink');
          enableSPAHyperlink(categoryLink);
        });
      });
    }

    async fetchData() {
      this.setAttribute('loading', true);
      const response = await fetch('/api/categories');
      const json = await response.json();
      this.dispatchEvent(new CustomEvent('categories-loaded', { detail: json }));
      this.setAttribute('loading', false);
      return json;
    }

    async connectedCallback() {
      this.render(this);
    }

    render(el) {
      const { categoryArr } = el;
      const titleElem = document.createElement('h6');
      titleElem.innerText = "Categories";

      const ul = document.createElement('ul');

      categoryArr.forEach(categoryObj => {
        const { category, count } = categoryObj;
        const li = document.createElement('li');

        li.innerHTML =  `
          <a class="category-link" href="/category/${encodeURIComponent(category)}">${he.encode(category)}</a>${' '}
          <span>(${count})</span>
        `;

        ul.appendChild(li);
      });

      el.innerHTML = `
        <style>
          ul {
            list-style-type: none;
            padding-left: 0;
          }
          ul:last-child {
            border-bottom: 1px solid rgba(0,0,0, 0.08);
            padding-bottom: 6px;
          }
          li {
            border-top: 1px solid rgba(0,0,0, 0.08);
            margin: 6px 0px 0px 0px;
            padding: 6px 0px 0px 0px;
          }
        </style>
      `;
      el.appendChild(titleElem);
      el.appendChild(ul);
    }
  }

  // let the browser know about the custom element
  customElements.define('categories-list', CategoriesList);
})();
