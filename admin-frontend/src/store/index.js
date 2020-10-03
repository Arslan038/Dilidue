import Vue from "vue";
import Vuex from "vuex";
import User from "./modules/User";
import News from "./modules/News";
import Brandings from "./modules/Brandings";
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isTokenExpired: null,
        notification: {
            message: null,
            title: null,
            type: null
        }
    },
    getters: {
        getNotification: state => state.notification,
        getLogoutUser: state => state.isTokenExpired
    },
    mutations: {
        setNotification: (state, payload) => (state.notification = payload),
        logoutUser: (state, payload) => {
            state.isTokenExpired = payload;
        }
    },
    modules: {
        User,
        News,
        Brandings
    }
});
