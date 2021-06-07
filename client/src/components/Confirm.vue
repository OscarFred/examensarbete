<template>
  <v-row justify="center">
    

    <v-dialog
      v-model="dialog"
      max-width="290"
      @keydown.esc="closeDialog()"
      @click:outside="closeDialog()"
    >
      <v-card>
        <v-card-title class="text-h5">
          Are you sure you want to delete "{{itemName}}"?
        </v-card-title>

        <v-card-text>
          This will permanentely delete the list "{{itemName}}".
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="closeDialog()"
          >
            CANCEL
          </v-btn>

          <v-btn
            color="red darken-1"
            text
            @click="deleteItem()"
          >
            DELETE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    props: {
      dialog: Boolean,
      itemName: String,
      itemId: String
    },
    methods: {
      closeDialog: function() {
        this.$emit('closeDialog')
      },
      deleteItem: function() {
        this.$emit('deleteItem', this.itemId)
      }
    }
}
</script>

<style>

</style>