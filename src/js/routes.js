const routes = [
  {
    path: '', // optional
    action: () => `<h1>Home</h1>`
  },
  {
    path: '/articles',
    action: () => console.log('checking child routes for /posts'),
    children: [
      {
        path: '', // optional, matches both "/articles" and "/articles/"
        action: () => {
          import('./views/articles-view.js');
          return `<articles-view />`;
        }
      },
      {
        path: '/:id',
        action: (context) => {
          import('./views/article-view.js');
          return `<article-view id="${context.params.id}" />`;
        }
      }
    ]
  },
  {
    path: '/projects',
    action: () => console.log('checking child routes for /projects'),
    children: [
      {
        path: '', 
        action: () => {
          import('./views/projects-view.js');
          return `<projects-view />`;
        }
      },
      {
        path: '/:id',
        action: (context) => {
          import('./views/projects-view.js');
          return `<projects-view id="${context.params.id}" />`;
        }
      }
    ]
  },
  {
    path: '/about',
    action: () => console.log('checking child routes for /about'),
    children: [
      {
        path: '',
        action: () => {
          import('./views/about-view.js');
          return `<about-view />`;
        }
      }
    ]
  },
];

const router = new UniversalRouter(routes);
export default router;
