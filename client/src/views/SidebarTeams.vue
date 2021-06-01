<template>
  <div class="sidebar-teams"></div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import axios from "axios";
export default {
  name: "Lists",
  props: {
    user: {}
  },
  methods: {
    getLists: function() {
      axios
        .get("http://localhost:9000/api/readTodoLists", {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        })
        .then(result => {
          this.todoLists = result.data;
        });
    }
  }
};
</script>
