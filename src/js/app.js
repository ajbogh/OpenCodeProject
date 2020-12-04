'use strict';
import PageTitle from './web-components/page-title.js';
import Navbar from './web-components/navbar.js';
import CategoriesList from './web-components/categories-list.js';
import router from './routes.js';
import RouteResolver from './route-resolver.js';

const routeResolver = new RouteResolver(router);
