<template>
  <v-container
      id="dashboard"
      fluid
      tag="section"
      class="min-vh"
    >
    <v-card
      class="px-5 py-3"
    >
      <v-card-title>
            Valves
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              class="mb-3 mr-3"
              single-line
              hide-details
            ></v-text-field>
              <v-btn @click="addValve" color="secondary" dark class="mb-2" ><v-icon size="16" left dark>mdi-plus</v-icon>Add Valve</v-btn>
            <v-dialog v-model="dialog" max-width="720px">
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-form
                    ref="form"
                    v-model="valid"
                  >
                      <v-row>
                        <v-col
                          v-if="false"
                          cols="12"
                          md="6"
                        >
                          <v-select
                            :loading="loading"
                        v-model="editItem.username"
                        :items="members"
                        :rules="[rules.required]"
                        attach
                        chips
                        label="Select a member"
                        prepend-icon="mdi-account-outline"
                        required
                      ></v-select>
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                        >
                          <v-text-field
                            v-model="editItem.fls_id"
                            :loading="loading"
                            :rules="[rules.required]"
                            hide-details="auto"
                            class="mb-5"
                            label="Enter Device Id"
                            prepend-icon="mdi-identifier"
                            required
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                        >
                          <v-text-field
                            v-model="editItem.controller_location"
                            :rules="[rules.required]"
                            :loading="loading"
                            class="mb-5"
                            hide-details="auto"
                            label="Enter Location"
                            prepend-icon="mdi-google-maps"
                            @keyup.enter="submit"
                            required
                          />
                        </v-col>

                        <v-col
                          cols="12"
                          md="6"
                        >
                          <v-text-field
                            v-model="editItem.controller_description"
                            :rules="[rules.required]"
                            :loading="loading"
                            class="mb-5"
                            hide-details="auto"
                            label="Enter Description"
                            prepend-icon="mdi-details"
                            @keyup.enter="submit"
                            required
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                        >
                          <v-text-field
                            v-model="editItem.controller_type"
                            :rules="[rules.required]"
                            :loading="loading"
                            class="mb-5"
                            hide-details="auto"
                            label="Enter Type"
                            prepend-icon="mdi-call-merge"
                            @keyup.enter="submit"
                            required
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                        >
                          <v-text-field
                            v-model="editItem.connection_interval"
                            :rules="[rules.required]"
                            :loading="loading"
                            class="mb-5"
                            hide-details="auto"
                            label="Enter Interval"
                            prepend-icon="mdi-call-merge"
                            @keyup.enter="submit"
                            required
                          />
                        </v-col>
                      </v-row>
                  </v-form>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="secondary" text @click="close">Cancel</v-btn>
                      <v-btn color="primary" text @click="addFls">Save</v-btn>
                    </v-card-actions>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-dialog>
        </v-card-title>
          <v-data-table
          :loading="loading"
          :headers="headers"
          :items="items"
          item-key="id"
          :items-per-page="5"
          :search="search"
          class="custom-alert"
          > 
            <template v-slot:item.email="{ item }">
              <span v-html="beautifyEmail(item.email)"></span>
            </template>
            <template v-slot:item.action="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn 
                    text 
                    icon 
                    v-on="on"
                    @click.stop="configureFLS(item)"
                  >
                    <v-icon>mdi-cog</v-icon>
                  </v-btn>
                </template>
                <span>Configure</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn 
                    text 
                    icon 
                    v-on="on"
                    @click.stop="editFLS(item)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <span>Edit</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn 
                    text 
                    icon 
                    v-on="on"
                    @click.stop="deleteFLS(item)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span>Delete</span>
              </v-tooltip>
            </template>
        </v-data-table>
      </v-card>

      <v-snackbar
        v-model="snackbar"
        :color="snackColor  "
        multi-line
        top
      >
        {{snackText}}
        <v-icon
          dark
          @click="snackbar = false"
        >
          mdi-close
        </v-icon>
      </v-snackbar>

      <v-dialog v-model="modal" max-width="290">
          <v-card>
            <v-card-title class="text-center"><b>WARNING</b></v-card-title>
            <v-card-text>Are you sure?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="modal = false">Disagree</v-btn>
              <v-btn color="green darken-1" text @click="_delete()">Agree</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  </v-container>
</template>

<script>
    import { beautifyEmail } from '../../util'
    import { Get, fetchFLSListing, creatFlsListing, updateFLSListing } from '../../api'

    export default {
      name: 'Root',

      data: () => ({
        loading: false,
        valid: true,
        search: '',
        snackbar: false,
        snackColor: '',
        snackText: '',
        dialog: false,
        dateMenu: false,
        modal: false,
        items: [],
        members: [
          'admin',
          'bradcole'
        ],
        eventNames: [
          'BZW - Blizzard Warning',
          'CFA - Coastal Flood Watch',
          'CFW - Coastal Flood Warning',
          'DSW - Dust Storm Warning',
          'EWW - Extreme Wind Warning',
          'FFA - Flash Flood Watch'
        ],
        curItem: null,
        headers: [
          // {
          //  text: 'User Name',
          //  value: 'username'
          // },
          {
            text: 'Device Id',
            value: 'fls_id'
          },
          {
            text: 'Controller Location',
            value: 'controller_location'
          },
          {
            text: 'Controller Description',
            value: 'controller_description'
          },
          {
            text: 'Controller Type',
            value: 'controller_type'
          },
          {
            text: 'Controller Interval',
            value: 'connection_interval'
          },
          { text: 'Actions', value: 'action', sortable: false },
        ],
          defaultIndex: -1,
          editItem: {
            connection_interval: 1
          },
          defaultItem: {

          },
          rules: {
            required: value => {
              return !!value || 'This field is required.'
            },
          }
      }),

      mounted () {
        this.items = fetchFLSListing()
      },

      computed: {
        formTitle () {
          return this.defaultIndex === -1 ? 'Add Valve' : 'Edit Valve'
        },
      },

      methods: {
          beautifyEmail,

          showSnack (res) {
            if (res.data.status == 'success') {
              this.snackText = 'Success'
              this.snackColor = 'success'
            } else {
              this.snackText = 'Failed'
              this.snackColor = 'warning'
            }
            this.snackbar = true
          },

          close () {
            this.dialog = false
          },

          configureFLS (item) {
            this.$router.push({ path: `/root/configure/${item.fls_id}`})
          },

          closeDialog () {
            this.dialog = false
            setTimeout(() => {
              this.defaultItem = Object.assign({}, this.defaultItem)
              this.defaultIndex = -1
            }, 300)
          },

          editFLS (item) {
              this.defaultIndex = this.items.indexOf(item)
            this.editItem = Object.assign({}, item)
            this.dialog = true
          },

          addValve () {
            this.defaultIndex = -1
            this.editItem = Object.assign({}, this.defaultItem)
            this.dialog = true
          },

          addFls () {
            this.$refs.form.validate()
            if (!this.valid) {
              return
            }
            const item = Object.assign({}, this.editItem)
            let res = {
              data: {
                status: 'success' 
              }
            }
            if (this.defaultIndex > -1) {
                updateFLSListing(item)
                Object.assign(this.items[this.defaultIndex], item)
            } else {
                creatFlsListing(item)
                // this.items.push(item)
            }
            this.closeDialog()

            this.showSnack(res)
          },

          deleteFLS (item) {
            this.curItem = item
            this.modal = true
          },

          _delete() {
            this.items = this.items.filter(item => item.id != this.curItem.id)
            this.modal = false
          }
      }
  }
</script>