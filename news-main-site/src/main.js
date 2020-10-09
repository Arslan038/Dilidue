import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import * as VueGoogleMaps from 'vue2-google-maps';
import VueMeta from 'vue-meta';
import store from './store';
import VueFriendlyIframe from 'vue-friendly-iframe';

Vue.use(VueFriendlyIframe);
Vue.config.productionTip = false;
Vue.use(require('vue-resource'));
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDddvwvXImK-Wwg1zja3nyrLwhZ0iwQiQQ',
    libraries: 'places',
  },
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((x) => x.meta.requiresAuth);

  if (requiresAuth && !localStorage.getItem('dilidueUser')) {
    next('/login');
  } else {
    next();
  }
});

Vue.use(VueMeta);
new Vue({
  router,
  vuetify,
  store,
  render: (h) => h(App),
}).$mount('#app');
