import Vue from "vue";
import Router from "vue-router";
import Lists from "./views/Lists.vue";
import Landing from "./views/Landing.vue";
import Team from "./views/Team.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "landing",
      component: Landing
    },
    {
      path: "/lists",
      name: "lists",
      component: Lists
    },
    {
      path: "/about",
      name: "about",
      component: () => import("./views/About.vue")
    },
    {
      path: "/List/:id",
      name: "list",
      component: () => import("./views/Lists.vue")
    },
    {
      path: "/teams",
      name: "teamsView",
      component: () => import("./views/TeamsView.vue")
    },
    {
      path: "/team/:ownerId",
      name: "team",
      component: Team
    }
  ]
});
