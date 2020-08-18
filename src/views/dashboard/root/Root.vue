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
        Site Listing
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="720px">
          <template v-slot:activator="{ on }">
            <v-btn color="secondary" dark class="mb-2" v-on="on"><v-icon size="16" left dark>mdi-plus</v-icon>Add Site</v-btn>
          </template>
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
                      <v-text-field
                        v-model="editItem.site_id"
                        :loading="loading"
                        :rules="[rules.required]"
                        hide-details="auto"
                        class="mb-5"
                        label="Site Id"
                        required
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-text-field
                        v-model="editItem.owner"
                        :loading="loading"
                        :rules="[rules.required, rules.email]"
                        hide-details="auto"
                        class="mb-5"
                        placeholder="owner@email.com"
                        label="Owner"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-text-field
                        type="number"
                        v-model="editItem.phone"
                        :loading="loading"
                        :rules="[rules.required]"
                        hide-details="auto"
                        class="mb-5"
                        label="Phone"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-text-field
                        v-model="editItem.location"
                        :loading="loading"
                        :rules="[rules.required]"
                        hide-details="auto"
                        class="mb-5"
                        label="Location"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-select
                        v-model="editItem.account_status"
                        :loading="loading"
                        :items="statusItems"
                        hide-details="auto"
                        class="mb-5"
                        label="Status"
                      />
                    </v-col>
                  </v-row>
              </v-form>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="secondary" text @click="close">Cancel</v-btn>
                  <v-btn color="primary" text @click="addSite">Save</v-btn>
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
        class="custom-alert my-4"
        hide-default-footer
      > 
        <template v-slot:item.action="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                icon 
                v-on="on"
                @click.stop="sendEmail(item)"
              >
                <v-icon>mdi-send</v-icon>
              </v-btn>
            </template>
            <span>Send an Email</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                icon 
                v-on="on"
                @click.stop="editSite(item)"
              >
                <v-icon>mdi-pen</v-icon>
              </v-btn>
            </template>
            <span>Edit Site</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                icon 
                v-on="on"
                @click.stop="deleteSite(item)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Delete Site</span>
          </v-tooltip>
        </template>

        <template v-slot:item.controllers="{ item }">
          <span>{{ item.controllers.length }}</span>
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
    import { beautifyEmail } from '../../../util'
    import { fetchAllSites, createSite, updateSite, removeSite } from '../../../api'

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
        statusItems: [
          {text: 'Approved', value: true},
          {text: 'Waiting', value: false },
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
          {
            text: 'Site Id',
            value: 'site_id'
          },
          {
            text: 'Owner',
            value: 'owner'
          },
          {
            text: '# of Controllers',
            value: 'controllers'
          },
          {
            text: 'Location',
            value: 'location'
          },
          // {
          //   text: 'Status',
          //   value: 'account_status'
          // },
          {
            text: 'Action',
            value: 'action',
            width: 100
          },
        ],
          defaultIndex: -1,
          editItem: {
            email: localStorage.getItem('email'),
            account_status: true
          },
          defaultItem: {
            email: localStorage.getItem('email')
          },
          rules: {
            required: value => {
              return !!value || 'This field is required.'
            },
            email: value => {
              const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              return pattern.test(value) || 'Invalid e-mail.'
            },
          }
      }),

      async mounted () {
        this.items = await fetchAllSites()
      },

      computed: {
        formTitle () {
          return this.defaultIndex === -1 ? 'Add Site' : 'Edit Site'
        },
      },

      methods: {
          beautifyEmail,

          showSnack (res) {
            if (res.status == 'success') {
              this.snackText = res.message
              this.snackColor = 'success'
            } else {
              this.snackText = res.message
              this.snackColor = 'warning'
            }
            this.snackbar = true
          },

          close () {
            this.dialog = false
          },

          closeDialog () {
            this.dialog = false
            setTimeout(() => {
              this.defaultItem = Object.assign({}, this.defaultItem)
              this.defaultIndex = -1
            }, 300)
          },

          editSite (item) {
            this.defaultIndex = this.items.indexOf(item)
            this.editItem = Object.assign({}, item)
            this.dialog = true
          },

          deleteSite(item) {
            const self = this
            this.$dialog.confirm({
              text: 'Do you really want to delete this site?',
              title: 'Warning',
              actions: {
                false: 'No',
                true: {
                  color: 'red',
                  text: 'Yes',
                  handle: () => {
                    self._deleteSite(item)
                  }
                }
              }
            })
          },

          async _deleteSite(item) {
            this.loading = true
            const res = await removeSite(item.site_id)
            this.showSnack(res)
            if (res.status == 'success') {
              this.items = this.items.filter(_item => _item.site_id != item.site_id)
            }
            this.loading = false
          },

          async addSite () {
            this.$refs.form.validate()
            if (!this.valid) {
              return
            }
            const item = Object.assign({}, this.editItem)
            let res = {
              data: {
                status: 'Ok' 
              }
            }
            if (this.defaultIndex > -1) {
                res = await updateSite(item)
                Object.assign(this.items[this.defaultIndex], item)
            } else {
                res = await createSite(item)
                this.items.push(item)
            }
            this.closeDialog()

            this.showSnack(res)
          },

          sendEmail () {
            
          }
      }
  }
</script>