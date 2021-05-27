<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="8">
          <v-text-field label="Ny lista" v-model="listTitle"></v-text-field>
      </v-col>
      <v-col cols="2">

        <v-btn @click="createTodoList()" color="" elevation="2" fab
          ><svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
            <path
               fill="currentColor"
              d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
            /></svg
        ></v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
        <v-col cols="6">
            <h3 class="text-h3 mb-2 text-center">Listor</h3>
        </v-col>
    </v-row>

    <v-row v-for="list in todoLists" :key="list._id">
        <v-col cols="10">
            <h4 class="text-h4 mb-2">{{list.title}}</h4>
            <v-row v-for="todoItem in list.todoItems" :key="todoItem.id">
                <v-col>
                    <v-checkbox :ripple="true" :label="todoItem.text" :input-value="todoItem.checked" @change="updateItem(list._id, todoItem.text, todoItem._id, $event)"></v-checkbox>
                </v-col>
            </v-row>
            <v-row>
                <v-text-field label="Ny todo" v-model="text"></v-text-field>
                <v-btn color="" elevation="2" fab @click="addToList(list._id)">
                  <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                  </svg>
                </v-btn>
            </v-row>
            
        </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "TodoList",
  data: () => ({
      todoLists: [],
      text: undefined,
      listTitle: undefined
    }),
    created() {
        this.getLists()
    },
  methods: {
    getLists: function () {
      fetch('http://localhost:9000/api/readTodoLists')
      .then(response => response.json())
      .then(result => {
          console.log(result)

        this.todoLists = result;
      })
    },
    createTodoList: function() {
      if (typeof this.listTitle !== "undefined") {
          fetch('http://localhost:9000/api/createTodoList/', {
            body: JSON.stringify({
              title: this.listTitle,
          }),
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST'
        })
        .then(() => {this.getLists()})
      }
    },
    addToList: function(listId) {
        fetch('http://localhost:9000/api/createTodoItem/' + listId, {
          body: JSON.stringify({
          text: this.text,
          checked: false
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      })
      .then(() => {this.getLists()})
    },
    updateItem: function(listId, text, id, event) {
        fetch('http://localhost:9000/api/updateTodoItem/' + listId, {
          body: JSON.stringify({
          id: id,
          text: text,
          checked: event
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      })
      .then(() => {this.getLists()})
    },
  },
};
</script>

<style scoped></style>
