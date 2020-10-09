import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import AskExpert from '../views/AskAnExpert.vue';
import Calculator from '../views/Calculator.vue';

Vue.use(VueRouter);

const routes = [
  { path: '*', redirect: '/' },
  { path: '/', component: Home, name: 'Home', meta: { requiresAuth: true } },
  {
    path: '/ask-an-expert',
    name: 'Ask An Expert',
    component: AskExpert,
    meta: { requiresAuth: true },
  },
  {
    path: '/calculator',
    name: 'Calculator',
    component: Calculator,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
