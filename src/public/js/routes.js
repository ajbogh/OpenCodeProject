const routes = [
  {
    path: '', // optional
    action: () => `<h1>Home</h1>`
  },
  {
    path: '/category/:category',
    action: () => console.log('checking child routes for /category'),
    children: [
      {
        path: '', // optional, matches both "/articles" and "/articles/"
        action: (context) => {
          import('./views/category-view.js');
          return `<category-view category="${context.params.category}" />`;
        }
      },
      {
        path: '/:id',
        action: (context) => {
          import('./views/post-view.js');
          return `<post-view category="${context.params.category}" id="${context.params.id}" />`;
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
  {
    path: '/admin',
    action: () => console.log('checking child routes for /admin'),
    children: [
      {
        path: '',
        action: () => {
          import('./views/admin-view.js');
          return `<admin-view />`;
        }
      }
    ]
  },
];

const router = new UniversalRouter(routes);
export default router;
