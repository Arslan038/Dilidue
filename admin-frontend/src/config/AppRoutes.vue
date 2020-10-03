<script>
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import News from "../pages/News.vue";
import AddNews from "../pages/AddNews.vue";
import EditNews from "../pages/EditNews.vue";
import Brandings from "../pages/Brandings.vue";
import Branding from "../pages/Branding.vue";
import AddBranding from "../pages/AddBranding.vue";
import EditBranding from "../pages/EditBranding.vue";
import Users from "../pages/Users.vue";

const routes = [
  { path: "*", redirect: "/home" },
  { path: "/login", component: Login },
  { path: "/home", component: Home, meta: { requiresAuth: true } },
  { path: "/news", component: News, meta: { requiresAuth: true } },
  { path: "/add-news", component: AddNews, meta: { requiresAuth: true } },
  { path: "/edit-news/:id", component: EditNews, meta: { requiresAuth: true } },
  { path: "/brandings", component: Brandings, meta: { requiresAuth: true } },
  { path: "/branding/:id", component: Branding, meta: { requiresAuth: true } },
  {
    path: "/add-branding",
    component: AddBranding,
    meta: { requiresAuth: true },
  },
  {
    path: "/edit-branding/:id",
    component: EditBranding,
    meta: { requiresAuth: true },
  },
  { path: "/users", component: Users, meta: { requiresAuth: true } },
];

export default routes;
</script>
