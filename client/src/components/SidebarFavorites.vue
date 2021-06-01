<template>
  <div class="sidebar-favorites">
    <div class="text-center text-h4 pt-5">Favoriter</div>
    <v-list v-for="favorite in favorites" :key="favorite.id">
      <template>
        <v-list-item :to="`/Lista/${favorite._id}`" :key="favorite.id">
          <v-list-item-icon><v-icon>mdi-star</v-icon></v-list-item-icon>
          <v-list-item-content>
            <router-link to="/Lista/"></router-link>
            <v-list-item-title v-html="favorite.title"></v-list-item-title>
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
    favorites: []
  }),
  watch: {
    reload: function() {
      this.getFavorites();
    }
  },
  created() {
    this.getFavorites();
  },
  methods: {
    getFavorites: function() {
      axios
        .get("http://localhost:9000/api/readFavorites", {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        })
        .then(result => {
          console.log(result);
          this.favorites = result.data;
        });
    }
  }
};
</script>
