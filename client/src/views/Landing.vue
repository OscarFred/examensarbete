<template>
  <div class="Landing">
    <v-main>

        <v-row justify="center" dense>
          <v-col  cols="12">
            <v-sheet min-height="80vh" class="d-flex">
              <v-row class="mt-auto mb-auto" justify="center">
                <v-col cols="6" height="100">
                  

                  <v-card >

                      <v-card-title v-if="!user">
                        Welcome to checkbox!
                      </v-card-title>
                      <v-card-subtitle v-if="!user">
                        Log in with google to start creating lists.
                      </v-card-subtitle>
                      <v-card-title v-if="user">
                        Welcome to checkbox {{user.displayName}}!
                      </v-card-title>
                      <v-card-subtitle v-if="user">
                        Go to lists to start creating lists!
                      </v-card-subtitle>


                      <v-card-actions class="d-flex" justify="center" >
                        <v-spacer></v-spacer>
                        <v-btn color="primary" elevation="2" @click="logIn()" v-if="!user">
                          Log In
                        </v-btn>
                        <v-btn color="primary" elevation="2" to="/lists" v-if="user">
                          Lists
                        </v-btn>
                      </v-card-actions>

                  </v-card>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
        </v-row>

    </v-main>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Lists",
  components: {
    
  },
  props: {
    user: {}
  },
  created() {
    console.log('hej')
  },
  methods: {
    logIn: function() {
      window.location.href = "http://localhost:9000/auth/google";
    },
  }
};
</script>

<style scoped>

</style>