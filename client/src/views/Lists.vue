<template>
  <div class="home">
    <v-main>
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="3" order="1" order-md="1">
            <v-sheet rounded="lg" min-height="268">
              <SidebarTeams :reload="reload" />
            </v-sheet>
          </v-col>
          <v-col cols="12" md="6" order="3" order-md="2">
            <v-sheet min-height="70vh" rounded="lg">
              <TodoList :user="user" @reloadChild="updateReload" />
            </v-sheet>
          </v-col>
          <v-col cols="12" md="3" order="2" order-md="3">
            <v-sheet rounded="lg" min-height="268">
              <SidebarFavorites :reload="reload" />
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import TodoList from "@/components/TodoList.vue";
import SidebarFavorites from "@/components/SidebarFavorites.vue";
import SidebarTeams from "../components/SidebarTeams.vue";

export default {
  name: "Lists",
  components: {
    TodoList,
    SidebarFavorites,
    SidebarTeams
  },
  props: {
    user: {}
  },
  data: () => {
    return {
      reload: null
    };
  },
  methods: {
    updateReload: function() {
      this.$emit("reloadChild", this.reload);
      this.reload += 1;
    }
  }
};
</script>
