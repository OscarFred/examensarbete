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
    <v-row justify="center" v-if="$route.name === 'home'">
      <v-col cols="6">
        <h3 class="text-h3 mb-2 text-center">Listor</h3>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" v-for="list in todoLists" :key="list._id">
        <v-card width="100%" elevation="4" justify="center" color="lighten-4">
          <v-progress-linear
            :value="percentageCalculator(list)"
            buffer-value="100"
            absolute
            top
            color="success"
          ></v-progress-linear>
          <v-card-title>
            <v-text-field
              v-if="listEditComputed[list._id]"
              v-model="list.title"
            >
              <v-btn
                @click="updateTodoList(list._id, list.title, list.favorited)"
                slot="append"
                class="dots"
                icon
                plain
              >
                <v-icon>mdi-check</v-icon>
              </v-btn>
            </v-text-field>
            <h4 v-else class="text-h4 mb-2">{{ list.title }}</h4>
            <v-spacer></v-spacer>

            <v-btn
              v-if="list.favorited"
              icon
              @click="updateTodoList(list._id, list.title, false)"
              ><v-icon>mdi-star</v-icon></v-btn
            >
            <v-btn
              v-else
              icon
              @click="updateTodoList(list._id, list.title, true)"
              ><v-icon>mdi-star-outline</v-icon></v-btn
            >
            <v-btn icon @click="editList(list._id)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn icon>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-subtitle>
            <v-text-field label="Ny todo" v-model="text">
              <v-icon slot="append" @click="addToList(list._id)"
                >mdi-plus</v-icon
              >
            </v-text-field>
          </v-card-subtitle>

          <v-card-text v-for="todoItem in list.todoItems" :key="todoItem._id">
            <v-col cols="12">
              <v-row>
                <v-checkbox
                  :ripple="true"
                  v-model="todoItem.checked"
                  :class="
                    editComputed[todoItem._id]
                      ? 'word-break '
                      : 'word-break checkbox'
                  "
                  :label="editComputed[todoItem._id] ? '' : todoItem.text"
                  :input-value="todoItem.checked"
                  @change="
                    updateItem(
                      list._id,
                      todoItem.text,
                      todoItem._id,
                      todoItem.checked
                    );
                    enableConfetti = true;
                  "
                >
                  <v-menu
                    v-if="!editComputed[todoItem._id]"
                    slot="append"
                    bottom
                    left
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn class="dots" icon plain v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-horizontal</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-sheet v-for="(item, i) in popover" :key="i">
                        <v-btn
                          v-if="item.title === 'Remove'"
                          width="100%"
                          plain
                          :color="item.color"
                          @click="removeItem(todoItem._id)"
                          >{{ item.title }}</v-btn
                        >
                        <v-btn
                          v-else
                          width="100%"
                          plain
                          :color="item.color"
                          @click="editITem(todoItem._id)"
                        >
                          {{ item.title }}</v-btn
                        >
                      </v-sheet>
                    </v-list>
                  </v-menu>
                </v-checkbox>
                <v-text-field
                  v-if="editComputed[todoItem._id]"
                  v-model="todoItem.text"
                >
                  <v-btn
                    @click="
                      updateItem(
                        list._id,
                        todoItem.text,
                        todoItem._id,
                        todoItem.checked
                      );
                      enableConfetti = false;
                    "
                    slot="append"
                    v-if="editComputed[todoItem._id]"
                    class="dots"
                    icon
                    plain
                  >
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
import canvasConfetti from "canvas-confetti";
export default {
  name: "TodoList",
  data: () => ({
    todoLists: [],
    text: undefined,
    listTitle: undefined,
    popover: [
      { title: "Remove", color: "red" },
      { title: "Edit", color: "inherit" }
    ],
    edit: {},
    listEdit: {},
    percentage: {},
    enableConfetti: true
  }),
  created() {
    this.getLists();
    this.confettiEnabled = false;
  },
  computed: {
    editComputed: function() {
      return this.edit;
    },
    listEditComputed: function() {
      return this.listEdit;
    }
  },
  props: {
    user: {}
  },
  methods: {
    forceRerender() {
      this.$emit("reloadChild", this.reload);
    },
    getLists: function() {
      let id = "0";
      if (this.$route.params.id) {
        id = this.$route.params.id;
      }
      axios
        .get(`http://localhost:9000/api/readTodoLists/${id}`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        })
        .then(result => {
          this.todoLists = result.data;
        });
    },
    createTodoList: function() {
      if (typeof this.listTitle !== "undefined") {
        fetch("http://localhost:9000/api/createTodoList/", {
          credentials: "include",
          body: JSON.stringify({
            title: this.listTitle,
            ownerId: this.user._id
          }),
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST"
        }).then(() => {
          this.getLists();
        });
      }
    },
    updateTodoList: function(listId, title, favorited) {
      fetch("http://localhost:9000/api/updateTodoList/" + listId, {
        credentials: "include",
        body: JSON.stringify({
          title,
          favorited
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "PUT"
      }).then(() => {
        this.listEdit[listId] = false;
        this.getLists();
        this.forceRerender();
      });
    },
    addToList: function(listId) {
      fetch("http://localhost:9000/api/createTodoItem/" + listId, {
        credentials: "include",
        body: JSON.stringify({
          text: this.text,
          checked: false
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      }).then(() => {
        this.getLists();
      });
    },
    updateItem: function(listId, text, id, checked) {
      this.confettiEnabled = true;
      fetch("http://localhost:9000/api/updateTodoItem/" + listId, {
        credentials: "include",
        body: JSON.stringify({
          id: id,
          text: text,
          checked: checked
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      }).then(() => {
        this.getLists();
        this.checkConfetti(listId);
      });
    },
    removeItem: function(id) {
      console.log(`Remove ${id}`);
    },
    editITem: function(id) {
      this.edit[id] = true;
      this.getLists();
    },
    editList: function(id) {
      this.listEdit[id] = true;
      this.getLists();
    },
    percentageCalculator: function(list) {
      let completed = [];
      list.todoItems.forEach(element => {
        if (element.checked) {
          completed.push(element.checked);
        }
      });
      this.percentage[list._id] =
        (completed.length / list.todoItems.length) * 100;
      return (completed.length / list.todoItems.length) * 100;
    },
    checkConfetti: function(id) {
      if (this.percentage[id] === 100 && this.enableConfetti) {
        this.confetti();
      }
    },
    confetti: function() {
      var duration = 800;
      var animationEnd = Date.now() + duration;
      var defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 0
      };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        canvasConfetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: {
              x: randomInRange(0.1, 0.3),
              y: Math.random() - 0.2
            }
          })
        );
        canvasConfetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: {
              x: randomInRange(0.7, 0.9),
              y: Math.random() - 0.2
            }
          })
        );
      }, 250);
    }
  }
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
