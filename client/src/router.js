import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Landing from "./views/Landing.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Landing",
      component: Landing
    },
    {
      path: "/home",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      component: () => import("./views/About.vue")
    },
    {
      path: "/Lista/:id",
      name: "lista",
      component: () => import("./views/SingularList.vue")
    }
  ]
});
