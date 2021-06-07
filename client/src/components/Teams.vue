<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="11">
        <v-scroll-y-reverse-transition>
          <v-textarea
            v-model="description"
            :elevation="2"
            rows="3"
            transition="slide-x-transition"
            label="Description"
            v-show="teamName"
          ></v-textarea>
        </v-scroll-y-reverse-transition>
        <v-text-field
          label="New team"
          v-model="teamName"
          @keyup.enter="createTeam()"
        >
          <v-btn slot="append" @click="createTeam()" color="primary" plain icon>
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-text-field>
      </v-col>
    </v-row>
    <Confirm
      :dialog="dialog"
      :itemName="itemName"
      :itemId="itemId"
      @closeDialog="closeDialog"
      @deleteItem="deleteTeam"
    />
    <v-row dense>
      <v-col cols="12" v-for="(team, index) in teams" :key="team._id">
        <v-card width="100%" elevation="4" justify="center" color="lighten-4">
          <v-card-title
            class="text-h5"
            @keydown.esc="closeInviteUserMenu(team, inviteUsers)"
          >
            <router-link
              v-if="!team.edit"
              class="primary--text text-decoration-none"
              :to="`/team/${team._id}`"
              >{{ team.teamName }}</router-link
            >
            <v-text-field
              v-model="team.teamName"
              v-if="team.edit"
              label="Edit team name"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-menu
              v-if="team.ownerId === user._id"
              v-model="team.inviteUserMenu"
              :close-on-content-click="false"
              :nudge-width="200"
              offset-x
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-account-multiple-plus</v-icon>
                </v-btn>
              </template>

              <v-card>
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-text-field label="Search for user">
                        <v-icon slot="append">mdi-magnify</v-icon>
                      </v-text-field>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-divider></v-divider>

                <v-list>
                  <v-list-item
                    @click="addToSelected(inviteUser._id, index)"
                    v-for="(inviteUser, index) in inviteUsers"
                    :key="inviteUser._id"
                  >
                    <v-list-item-avatar>
                      <v-img :src="inviteUser.picture">
                        <v-overlay
                          absolute="absolute"
                          :value="inviteUser.selected"
                        >
                          <v-icon>mdi-check</v-icon>
                        </v-overlay>
                      </v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="inviteUser.displayName"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn text @click="closeInviteUserMenu(team, inviteUsers)">
                    Cancel
                  </v-btn>
                  <v-btn color="primary" text @click="inviteToTeam(team._id)">
                    Send
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
            <!-- <v-btn icon>
							<v-icon>mdi-star-outline</v-icon>
						</v-btn> -->
            <v-btn
              color="error"
              v-if="team.ownerId !== user._id"
              icon
              @click="leaveTeam(team._id)"
            >
              <v-icon>mdi-account-arrow-right</v-icon>
            </v-btn>
            <v-btn
              v-if="team.ownerId === user._id && !team.edit"
              icon
              @click="editTeam(team._id, index)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon v-if="team.edit" @click="updateTeam(team, index)">
              <v-icon>mdi-check</v-icon>
            </v-btn>
            <v-btn
              v-if="team.ownerId === user._id"
              color="error"
              icon
              @click.stop="openDialog(team._id, team.teamName, (dialog = true))"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <span :key="index" v-for="(member, index) in team.members">
              <v-chip
                v-if="team.ownerId === member._id"
                color="primary"
                outlined
              >
                {{ member.displayName
                }}<v-icon color="warning">mdi-crown</v-icon>
              </v-chip>
              <v-chip
                v-else-if="team.edit && team.ownerId !== member._id"
                color="error"
                close
                close-icon="mdi-account-minus"
                outlined
                >{{ member.displayName }}</v-chip
              >
              <v-chip
                v-else-if="!team.edit && team.ownerId !== member._id"
                color="primary"
                outlined
                icon="mdi-account"
                >{{ member.displayName }}</v-chip
              >
            </span>
            <!-- <span
              :key="index"
              v-for="(member, index) in team.members"
              v-text="member.displayName + ', '"
            >
            </span> -->
          </v-card-text>
          <v-card-text v-if="team.teamDescription && team.edit === false">
            {{ team.teamDescription }}
          </v-card-text>
          <v-card-text>
            <v-textarea
              v-if="team.edit"
              v-model="team.description"
              :elevation="2"
              rows="3"
              transition="slide-x-transition"
              label="Description"
            ></v-textarea>
          </v-card-text>
          <!-- <v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary" slot="right" dark v-bind="attrs" v-on="on">
							Invite users
						</v-btn>
					</v-card-actions> -->
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import Confirm from "@/components/Confirm.vue";

export default {
  components: {
    Confirm
  },
  data: () => {
    return {
      teams: [],
      teamName: "",
      description: "",
      inviteUsers: [],
      inviteUserMenu: false,
      dialog: false,
      itemName: "",
      itemId: ""
    };
  },
  props: {
    user: {}
  },
  created() {
    this.getTeams();
    this.getUsers();
  },
  methods: {
    openDialog: function(teamId, teamName) {
      this.itemName = teamName;
      this.itemId = teamId;
      this.dialog = true;
    },
    closeDialog: function() {
      this.dialog = false;
    },
    getTeams: function() {
      axios
        .get(`http://localhost:9000/api/readTeams/`, {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        })
        .then(result => {
          this.teams = result.data;
        });
    },
    getUsers: function() {
      axios
        .get(`http://localhost:9000/api/readUsers/`, {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        })
        .then(result => {
          this.inviteUsers = result.data;
        });
    },
    createTeam: async function() {
      const response = await fetch("http://localhost:9000/api/createTeam/", {
        credentials: "include",
        body: JSON.stringify({
          teamName: this.teamName,
          teamDescription: this.description,
          ownerId: this.user._id,
          members: [
            {
              _id: this.user._id,
              displayName: this.user.displayName,
              picture: this.user.picture
            }
          ],
          color: ""
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });
      await response.json();
      this.getTeams();
    },
    inviteToTeam: function(teamId) {
      let inviteUsers = this.inviteUsers.filter(x => x.selected === true);
      inviteUsers.map(x => delete x.selected);
      console.log(inviteUsers);
      fetch(`http://localhost:9000/api/inviteToTeam/${teamId}`, {
        credentials: "include",
        body: JSON.stringify({
          ownerId: this.user._id,
          inviteUsers: inviteUsers
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });
    },
    leaveTeam: function(teamId) {
      axios
        .get(`http://localhost:9000/api/leaveTeam/${teamId}`, {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        })
        .then(() => {
          this.getTeams();
        });
    },
    deleteTeam: function(teamId) {
      axios
        .get(`http://localhost:9000/api/deleteTeam/${teamId}`, {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        })
        .then(() => {
          this.getTeams();
          this.dialog = false;
        });
    },
    addToSelected: function(userId, index) {
      this.inviteUsers[index].selected = !this.inviteUsers[index].selected;
    },
    closeInviteUserMenu: (team, inviteUsers) => {
      team.inviteUserMenu = false;
      inviteUsers.map(x => (x.selected = false));
    },
    editTeam: function(teamId, index) {
      if (this.teams[index].edit) {
        this.$set(this.teams[index], "edit", false);
      } else {
        this.$set(this.teams[index], "edit", true);
      }
    },
		updateTeam: function(team) {
			console.log(team)
			delete team.edit
			fetch(`http://localhost:9000/api/updateTeam/${team._id}`, {
        credentials: "include",
        body: JSON.stringify({
          teamName: team.teamName,
          teamDescription: team.teamDescription
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });
		}
  }
};
</script>

<style></style>
