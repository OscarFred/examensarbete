<template>
  <v-theme-provider root>
    <v-app id="inspire">
      <v-app-bar
        app
        flat
      >
        <v-avatar v-if="typeof user === undefined"
          size="32"
        ></v-avatar>
        <v-tabs
          centered
          class="ml-n9"
        >
          <v-tab 
            v-for="link in links"
            :key="link" :to="link"
          >
          {{link}}
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
          <img :src="user.picture">
        </v-avatar>
      </v-app-bar>

      <v-main>
        <v-container>
          <v-row>
            <v-col
              cols="12"
              sm="2"
            >
              <v-sheet
                rounded="lg"
                min-height="268"
              >
                <!--  -->
              </v-sheet>
            </v-col>

            <v-col
              cols="12"
              sm="8"
            >
              <v-sheet
                min-height="70vh"
                rounded="lg"
              >
              <router-view :user="user" />
                <!--  -->
              </v-sheet>
            </v-col>

            <v-col
              cols="12"
              sm="2"
            >
              <v-sheet
                rounded="lg"
                min-height="268"
              >
                <!--  -->
              </v-sheet>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </v-theme-provider>

</template>

<script>
  import axios from "axios";
  export default {
    data: () => ({
      user: undefined,
      links: [
        'Home',
        'About',
        'Profile',
        'Updates',
      ],
    }),
    mounted() {
      this.checkIfLoggedIn()
    },
    methods: {
      logIn: function() {
        window.location.href = "http://localhost:9000/auth/google";
      },
      logOut: function() {
        window.location.href = "http://localhost:9000/auth/logout";
      },
      checkIfLoggedIn() {
        axios
        .get('http://localhost:9000/auth/check', {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        })
        .then(response => {
          this.user = response.data.user
          console.log(response.data.user);
        });
      }
    }
  }
</script>

<style scoped>
.tab {
  text-decoration: inherit;
  color: inherit;
}

</style>