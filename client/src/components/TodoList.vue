<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="11">
        <v-text-field label="Ny lista" v-model="listTitle">
          <v-btn slot="append" @click="createTodoList()" color="" plain icon>
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="6">
        <h3 class="text-h3 mb-2 text-center">Listor</h3>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" v-for="list in todoLists" :key="list._id">
        
        <v-card width="100%" elevation="4" justify="center" color="lighten-4" >
          <v-progress-linear
          value="20"
        buffer-value="100"
        absolute
        top
        color="success"
      ></v-progress-linear>
          <v-card-title>
            <h4 class="text-h4 mb-2">{{list.title}}</h4>
          </v-card-title>
          <v-card-subtitle>
            <v-text-field label="Ny todo" v-model="text">
              <v-icon slot="append" @click="addToList(list._id)">mdi-plus</v-icon>
            </v-text-field>
          </v-card-subtitle>

          <v-card-text v-for="todoItem in list.todoItems" :key="todoItem._id">
            <v-col cols="12">
              <v-row>
                <v-checkbox :ripple="true" v-model="todoItem.checked"
                  :class="editComputed[todoItem._id] ? 'word-break ' : 'word-break checkbox'"
                  :label="editComputed[todoItem._id] ? '' : todoItem.text" :input-value="todoItem.checked"
                  @change="updateItem(list._id, todoItem.text, todoItem._id, todoItem.checked)">
                  <v-menu v-if="!editComputed[todoItem._id]" slot="append" bottom left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn class="dots" icon plain v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-horizontal</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-sheet v-for="(item, i) in popover" :key="i">
                        <v-btn v-if="item.title === 'Remove'" width="100%" plain :color="item.color"
                          @click="removeItem(todoItem._id)">{{ item.title }}</v-btn>
                        <v-btn v-else width="100%" plain :color="item.color" @click="editITem(todoItem._id)">
                          {{ item.title }}</v-btn>
                      </v-sheet>
                    </v-list>
                  </v-menu>
                </v-checkbox>
                <v-text-field v-if="editComputed[todoItem._id]" v-model="todoItem.text">
                  <v-btn @click="updateItem(list._id, todoItem.text, todoItem._id, todoItem.checked)" slot="append"
                    v-if="editComputed[todoItem._id]" class="dots" icon plain>
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                </v-text-field>
              </v-row>
            </v-col>
          </v-card-text>

        </v-card>
      </v-col>
    </v-row>
    </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "TodoList",
  data: () => ({
      todoLists: [],
      text: undefined,
      listTitle: undefined,
      popover: [
        { title: 'Remove', color: 'red' },
        { title: 'Edit', color: 'inherit' },
      ],
      edit: {}
    }),
    created() {
        this.getLists()
    },
  computed: {
    editComputed: function() {
      return this.edit
    }
  },
  props: {
    user: {}
  },
  methods: {
    getLists: function () {
      axios
      .get('http://localhost:9000/api/readTodoLists', {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        })
      .then(result => {

        this.todoLists = result.data;
      })
    },
    createTodoList: function() {
      if (typeof this.listTitle !== "undefined") {
          fetch('http://localhost:9000/api/createTodoList/', {
            credentials: 'include',
            body: JSON.stringify({
              title: this.listTitle,
              ownerId: this.user._id
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
          credentials: 'include',
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
    updateItem: function(listId, text, id, checked) {
        fetch('http://localhost:9000/api/updateTodoItem/' + listId, {
          credentials: 'include',
          body: JSON.stringify({
          id: id,
          text: text,
          checked: checked
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      })
      .then(() => {this.getLists()})
    },
    removeItem: function(id) {
      console.log(`Remove ${id}`)
    },
    editITem: function(id) {
      this.edit[id] = true
      this.getLists()
    }
  },
};
</script>

<style>
label {
  word-break: break-word;
}
.dots {
  margin-top: -8px;
}
.checkbox {
  flex-grow: inherit !important;
}
</style>
