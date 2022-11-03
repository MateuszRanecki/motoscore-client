import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import TournamentPage from "@/components/TournamentPage.vue";
import TournamentSight from "@/components/TournamentSight.vue";
import ContendersTab from "@/components/ContendersTab.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/tournament/:id",
    name: "Tournament",
    component: TournamentPage,
  },
  {
    path: "/",
    name: "Tournaments",
    component: TournamentSight,
  },
  {
    path: "/contenders/:id",
    name: "Contenders",
    component: ContendersTab,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
