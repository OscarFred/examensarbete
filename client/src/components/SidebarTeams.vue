<template>
  <div class="sidebar-favorites">
    <div class="text-center text-h4 pt-5">Teams</div>
    <v-list v-for="team in teams" :key="team.id">
      <template>
        <v-list-item :to="`/team/${team._id}`" :key="team.id">
          <v-list-item-icon
            ><v-icon>mdi-account-group</v-icon></v-list-item-icon
          >
          <v-list-item-content>
            <router-link to="/Lista/"></router-link>
            <v-list-item-title v-html="team.teamName"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import axios from "axios";
export default {
  name: "Lists",
  props: {
    user: {},
    reload: undefined
  },
  data: () => ({
    teams: []
  }),
  watch: {
    reload: function() {
      this.getTeams();
    }
  },
  created() {
    this.getTeams();
  },
  methods: {
    getTeams: function() {
      axios
        .get("http://localhost:8080/api/readTeams", {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        })
        .then(result => {
          this.teams = result.data;
        });
    }
  }
};
</script>
