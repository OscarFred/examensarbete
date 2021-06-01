<template>
  <div class="singularList">
    <v-main>
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="3" order="1" order-md="1">
            <v-sheet rounded="lg" min-height="268">
              <router-view name="sidebar1"></router-view>
              <!--  -->
            </v-sheet>
          </v-col>
          {{ reload }}
          <v-col cols="12" md="6" order="3" order-md="2">
            <v-sheet min-height="70vh" rounded="lg">
              <TodoList :user="user" />

              <!--  -->
            </v-sheet>
          </v-col>

          <v-col cols="12" md="3" order="2" order-md="3">
            <v-sheet rounded="lg" min-height="268">
              <router-view name="sidebar2"></router-view>
              <!--  -->
              <SidebarFavorites />
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

export default {
  name: "Lists",
  components: {
    TodoList
  },
  props: {
    user: {}
  },
  data: () => {
    return {
      reload: undefined
    };
  }
};
</script>
