<template>
  <v-container>
    <v-row
      justify="center"
      v-if="$route.name === 'lists' || $route.name === 'team'"
    >
      <v-col cols="11">
        <v-text-field
          label="New list"
          v-model="listTitle"
          @keyup.enter="createTodoList()"
          required
          :rules="newRules"
        >
          <v-btn
            slot="append"
            @click="createTodoList()"
            color="primary"
            plain
            icon
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row
      justify="center"
      v-if="$route.name === 'lists' || $route.name === 'team'"
    >
      <v-col cols="6">
        <h3 class="text-h3 mb-2 text-center">Lists</h3>
      </v-col>
    </v-row>
    <Confirm
      :dialog="dialog"
      :itemName="itemName"
      :itemId="itemId"
      @closeDialog="closeDialog"
      @deleteItem="deleteItem"
    />
    <v-row dense :class="$route.name === 'list' ? 'mt-5' : ''">
      <v-col cols="12" v-for="list in todoLists" :key="list._id">
        <v-card width="100%" elevation="4" justify="center" color="lighten-4">
          <v-progress-linear
            :value="percentageCalculator(list)"
            buffer-value="100"
            absolute
            top
            color="primary"
          ></v-progress-linear>
          <v-card-title>
            <v-text-field
              :ref="`edit-${list._id}`"
              v-if="listEditComputed[list._id]"
              v-model="list.title"
            >
              <v-btn
                @click="updateTodoList(list._id, list.title, list.favorited)"
                slot="append"
                class="dots"
                icon
                plain
                color="primary"
              >
                <v-icon>mdi-check</v-icon>
              </v-btn>
            </v-text-field>
            <h4 v-else-if="$route.name !== 'lists'" class="text-h4 mb-2">
              {{ list.title }}
            </h4>
            <router-link
              class="primary--text text-decoration-none"
              v-else
              :to="`/List/${list._id}`"
            >
              <h4 class="text-h4 mb-2">{{ list.title }}</h4>
            </router-link>
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

            <v-btn
              color="danger"
              icon
              @click.stop="openDialog(list._id, list.title, (dialog = true))"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <!-- <v-btn icon @click="deleteTodoList(list._id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn> -->
          </v-card-title>

          <v-card-subtitle>
            <v-text-field
              label="New item"
              v-model="text[list._id]"
              :ref="list._id"
              @keyup.enter="addToList(list._id)"
            >
              <v-icon color="primary" slot="append" @click="addToList(list._id)"
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
                          @click="deleteTodoItem(list._id, todoItem._id)"
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
                  :key="updateEditItem"
                  :ref="todoItem._id"
                  v-show="editComputed[todoItem._id]"
                  v-model="todoItem.text"
                  @keyup.enter="
                    updateItem(
                      list._id,
                      todoItem.text,
                      todoItem._id,
                      todoItem.checked
                    )
                  "
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
                    color="primary"
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
import Confirm from "@/components/Confirm.vue";
import axios from "axios";
import canvasConfetti from "canvas-confetti";
export default {
  name: "TodoList",
  components: {
    Confirm
  },
  data: () => ({
    todoLists: [],
    text: {},
    listTitle: "",
    popover: [
      {
        title: "Edit",
        color: "inherit"
      },
      {
        title: "Remove",
        color: "red"
      }
    ],
    edit: {},
    updateEditItem: 0,
    updateEditListId: "",
    listEdit: {},
    percentage: {},
    enableConfetti: true,
    newlyCreatedId: "",
    dialog: false,
    itemName: "",
    itemId: "",
    newRules: [],
    ownerId: "0",
    listId: "0"
  }),
  created() {
    // this.getLists();
    this.confettiEnabled = false;
  },
  mounted() {
    this.getLists();
  },
  updated() {
    if (this.newlyCreatedId !== "") {
      if (this.$refs[this.newlyCreatedId]) {
        this.$refs[this.newlyCreatedId][0].focus();
        this.newlyCreatedId = "";
      }
    }
    if (this.updateEditListId !== "") {
      if (this.$refs[this.updateEditListId]) {
        this.$refs[`edit-${this.updateEditListId}`][0].focus();
        this.updateEditListId = "";
      }
    }
  },
  computed: {
    editComputed: function() {
      return this.edit;
    },
    listEditComputed: function() {
      return this.listEdit;
    },
    userComputed: function() {
      return this.user;
    }
  },
  props: {
    user: {}
  },
  watch: {
    $route(to, from) {
      if (to !== from) {
        this.getLists();
      }
    },
    updateEditItem: function(val) {
      this.$nextTick(() => {
        this.$refs[val][0].focus();
      });
    }
  },
  methods: {
    openDialog: function(itemId, itemName) {
      this.itemName = itemName;
      this.itemId = itemId;
      this.dialog = true;
    },
    closeDialog: function() {
      this.dialog = false;
    },
    forceRerender: function() {
      this.$emit("reloadChild", this.reload);
    },
    getLists: function() {
      this.listId = "0";
      if (this.$route.params.id) {
        this.listId = this.$route.params.id;
      }
      if (this.$route.name === "team") {
        this.ownerId = this.$route.params.ownerId;
      } else {
        this.ownerId = this.user._id;
      }
      axios
        .get(
          `http://localhost:9000/api/readTodoLists/${this.listId}/${this.ownerId}`,
          {
            headers: {
              "Content-Type": "application/json"
            },
            withCredentials: true
          }
        )
        .then(result => {
          this.todoLists = result.data;
        });
    },
    createTodoList: async function() {
      if (this.$route.name === "team") {
        this.ownerId = this.$route.params.ownerId;
      } else {
        this.ownerId = this.$store.state.user._id;
      }
      if (this.listTitle !== "") {
        const response = await fetch(
          "https://api.tjeckbox.com/api/createTodoList/",
          {
            credentials: "include",
            body: JSON.stringify({
              title: this.listTitle,
              ownerId: this.ownerId
            }),
            headers: {
              "Content-Type": "application/json"
            },
            method: "POST"
          }
        );
        const data = await response.json();
        await this.getLists();
        this.newRules = [];
        this.newlyCreatedId = data._id;
      } else {
        this.newRules = [v => !!v || "Title is required"];
      }
    },
    updateTodoList: function(listId, title, favorited) {
      fetch("https://api.tjeckbox.com/api/updateTodoList/" + listId, {
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
      fetch("https://api.tjeckbox.com/api/createTodoItem/" + listId, {
        credentials: "include",
        body: JSON.stringify({
          text: this.text[listId],
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
      fetch("https://api.tjeckbox.com/api/updateTodoItem/" + listId, {
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
    deleteItem: function(listId) {
      fetch("https://api.tjeckbox.com/api/deleteTodoList/" + listId, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      }).then(() => {
        this.dialog = false;
        if (this.$route.params) this.forceRerender();
        this.getLists();
      });
    },
    deleteTodoItem: function(listId, todoItemId) {
      fetch("https://api.tjeckbox.com/api/deleteTodoItem/" + todoItemId, {
        credentials: "include",
        body: JSON.stringify({
          listId: listId
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      }).then(() => {
        this.getLists();
      });
    },
    editITem: function(id) {
      this.updateEditItem = id;
      this.edit[id] = true;
    },
    editList: function(id) {
      this.updateEditListId = id;
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
