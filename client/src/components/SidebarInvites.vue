<template>
  <div class="sidebar-invites">
    <div class="text-center text-h4 pt-5">Invites</div>
    <v-list v-for="invite in invites" :key="invite.id">
      <template>
        <v-list-item :key="invite.id">
          <v-tooltip left max-width="30vw">
            {{ invite.teamDescription }}
            <template v-slot:activator="{ on, attrs }">
              <v-list-item-content v-bind="attrs" v-on="on">
                <v-list-item-title v-html="invite.teamName"></v-list-item-title>
                <v-list-item-subtitle>
                  {{ invite.teamDescription }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-tooltip>
          <v-list-item-icon>
            <v-btn color="error" icon @click="rejectInvite(invite._id)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-btn color="primary" icon @click="acceptInvite(invite._id)">
              <v-icon>mdi-check</v-icon>
            </v-btn>
          </v-list-item-icon>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: () => {
    return {
      invites: []
    };
  },
  methods: {
    getInvites: function() {
      axios
        .get(`http://localhost:9000/api/readInvites/`, {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        })
        .then(result => {
          this.invites = result.data;
        });
    },
    acceptInvite: async function(teamId) {
      await fetch(`http://localhost:9000/api/acceptInvite/${teamId}`, {
        credentials: "include"
      });
      this.getInvites();
    },
    rejectInvite: async function(teamId) {
      await fetch(`http://localhost:9000/api/rejectInvite/${teamId}`, {
        credentials: "include"
      });
      this.getInvites();
    }
  },
  created() {
    this.getInvites();
  }
};
</script>

<style></style>
