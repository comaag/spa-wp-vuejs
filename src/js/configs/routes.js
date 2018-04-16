import Vue from 'vue'
import VueRouter from 'vue-router'

// import all possible post types
import Page from '../partials/Page.vue'
import Home from '../partials/Home.vue'

// components
const components = {
    Page,
    Home
};


class Routes {
    constructor(response) {
        this.frontpage = response.data.frontpage.id;
        this.routes = [];
        this.router = new VueRouter({
            mode: 'history',
            routes: this.setRoutes(),
        });

        return this.router;
    }

    getRoute(path, lang) {
        _.each(wp.routes, (route) => {
            if(route.path == path) {
                return route['url'] ? route['url'] : '';
            }
        })
    }

    setRoutes () {
        let routes = [];
        let capitalize = (string) => {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };

        // index route
        routes.push({
            path: '/',
            component: Home,
            url: '/',
            props: {
                id: this.frontpage,
                type: 'pages'
            }
        });

        // wp.routes was generated by function.php
        for (let key in wp.routes) {
            let route = wp.routes[key];

            let temp = {
                path: route.slug,
                component: components[capitalize(route.type)] ? components[capitalize(route.type)] : Page,
                url: route.url,
                props: {
                    id: route.id,
                    type: route.type,
                }
            };

            if(route.category) {
                temp['props']['category'] = route.category;
                temp['props']['category_name'] = route.category_name;
            }
            routes.push(temp);
        }

        // for 404 handler
        routes.push({
            path: '*',
            component: Page,
            url: '/',
        });

        this.routes = routes;

        return routes;
    }
}

export default Routes;