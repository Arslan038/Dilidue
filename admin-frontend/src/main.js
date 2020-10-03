import Vue from "vue";
import App from "./App.vue";
import routes from "./config/AppRoutes";

// plugins
import VueRouter from "vue-router";
import VueBootstrap from "bootstrap-vue";
import VueInsProgressBar from "vue-ins-progress-bar";
import VueCustomScrollbar from "vue-custom-scrollbar";
import * as VueGoogleMaps from "vue2-google-maps";
import Antd from "ant-design-vue";
// VueStudio SCSS
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import "./scss/styles.scss";
import "ant-design-vue/dist/antd.css";
import store from "./store";

Vue.config.productionTip = false;

Vue.use(Antd);
Vue.use(VueRouter);
Vue.use(VueBootstrap);
Vue.use(VueInsProgressBar, {
    position: "fixed",
    show: true,
    height: "3px"
});
Vue.use(VueGoogleMaps, {
    load: {
        key: "",
        libraries: "places"
    }
});

Vue.component("vue-custom-scrollbar", VueCustomScrollbar);

const router = new VueRouter({
    mode: "history",
    routes
});

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(x => x.meta.requiresAuth);

    if (requiresAuth && !localStorage.getItem("dilidueAdmin")) {
        next("/login");
    } else {
        next();
    }
});

new Vue({
    render: h => h(App),
    store,
    router
}).$mount("#app");
