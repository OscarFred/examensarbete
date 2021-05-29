<template>
  <div class="home">
    <TodoList :user="user" />
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
  }
};
</script>
