<template>
  <v-theme-provider root>
    <v-app id="inspire">
      <v-app-bar app flat>
        <v-avatar v-if="typeof user === undefined" size="32"></v-avatar>
        <v-tabs centered class="ml-n9">
          <v-tab to="/">
            Home
          </v-tab>
          <v-tab to="/lists" v-if="user">
            Lists
          </v-tab>
          <v-tab to="/teams" v-if="user">
            Teams
          </v-tab>
        </v-tabs>

        <v-btn v-if="user" icon @click="logOut()">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
        <v-btn v-else title="Log in" icon @click="logIn()">
          <v-icon>mdi-login</v-icon>
        </v-btn>
        <v-avatar
          v-if="user"
          src="user.picture"
          class="hidden-sm-and-down"
          size="32"
        >
          <img :src="user.picture" />
        </v-avatar>
      </v-app-bar>
      <router-view
        :user="user"
        v-if="$route.name === 'landing' || user"
      ></router-view>
    </v-app>
  </v-theme-provider>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    user: undefined,
    links: ["Home", "Lists", "Teams"],
    reload: null
  }),
  async created() {
    this.checkIfLoggedIn();
  },
  mounted() {
    // this.checkIfLoggedIn();
    console.log(process.env.VUE_APP_API_URL);
  },
  methods: {
    updateReload: function() {
      this.reload += 1;
    },
    logIn: function() {
      window.location.href = `${process.env.VUE_APP_API_URL}/auth/google`;
    },
    logOut: function() {
      window.location.href = `${process.env.VUE_APP_API_URL}/auth/logout`;
    },
    checkIfLoggedIn() {
      axios
        .get(`${process.env.VUE_APP_API_URL}/auth/check`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        })
        .then(response => {
          this.$store.commit("saveUser", response.data.user);
          this.user = response.data.user;
        });
    }
  }
};
</script>

<style scoped>
.tab {
  text-decoration: inherit;
  color: inherit;
}
</style>
