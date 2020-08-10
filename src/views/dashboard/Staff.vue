<template>
  <v-container
    id="company-users"
    fluid
    tag="section"
  >
    <v-card
      icon="mdi-account-multiple"
      class="px-5 py-3"
    >
      <v-card-title>
        Staff
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          class="mb-3 mr-3"
          single-line
          hide-details
        ></v-text-field>
        <v-dialog v-model="dialog" max-width="720px">
        <!--   <template v-slot:activator="{ on }">
            <v-btn color="secondary" dark class="mb-2" v-on="on"><v-icon size="16" left dark>mdi-plus</v-icon>Add Staff</v-btn>
          </template> -->
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
                      cols="12"
                      md="6"
                    >
                      <v-text-field
                        v-model="editItem.first"
                        :loading="loading"
                        :rules="[rules.required]"
                        hide-details="auto"
                        class="my-5"
                        label="First Name"
                        prepend-icon="mdi-account-outline"
                        required
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-text-field
                        v-model="editItem.last"
                        :loading="loading"
                        :rules="[rules.required]"
                        hide-details="auto"
                        class="mb-5"
                        label="Last Name"
                        prepend-icon="mdi-account-outline"
                        required
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-menu
                        v-model="dateMenu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            ref="dob"
                            v-model="editItem.dob"
                            label="Date"
                            readonly
                            :rules="[rules.required]"
                            v-on="on"
                          >
                            <v-icon slot="prepend" color="primary">mdi-calendar</v-icon>
                          </v-text-field>
                        </template>
                        <v-date-picker v-model="editItem.dob"  @input="dateMenu = false"></v-date-picker>
                      </v-menu>
                    </v-col>

                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-text-field
                        v-model="editItem.email"
                        :rules="[rules.required, rules.email]"
                        :loading="loading"
                        class="mb-5"
                        hide-details="auto"
                        label="Please enter your email address."
                        prepend-icon="mdi-email-outline"
                        @keyup.enter="submit"
                        required
                      />
                    </v-col>

                    <v-col
                      cols="12"
                    >
                      <v-text-field
                        type="number"
                        v-model="editItem.phone"
                        :rules="[rules.required]"
                        :loading="loading"
                        class="mb-5"
                        hide-details="auto"
                        label="Please enter your phone number."
                        prepend-icon="mdi-phone-outline"
                        @keyup.enter="submit"
                        required
                      />
                    </v-col>
                    
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-text-field
                        v-model="editItem.password"
                        :rules="[rules.required]"
                        :loading="loading"
                        :append-icon="editItem.password ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="() => (value = !value)"
                        :type="editItem.password ? 'password' : 'text'"
                        hide-details="auto"
                        class="mb-5"
                        label="Password"
                        prepend-icon="mdi-lock-outline"
                        required
                      />
                    </v-col>
                    
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-text-field
                        type="password"
                        v-model="editItem.confirmpassword"
                        :rules="[rules.required, rules.confirm]"
                        :loading="loading"
                        hide-details="auto"
                        class="mb-5"
                        label="Confirm Password"
                        prepend-icon="mdi-lock-outline"
                        required
                      />
                    </v-col>
                  </v-row>
                </v-form>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="secondary" text @click="close">Cancel</v-btn>
                  <v-btn color="primary" text @click="addStaff">Save</v-btn>
                </v-card-actions>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-card-title>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="users"
        item-key="user_id"
        :items-per-page="5"
        :search="search"
        class="custom-alert"
        color="secondary"
      > 
        <template v-slot:item.email="{ item }">
          <span v-html="beautifyEmail(item.email)"></span>
        </template>
        <template v-slot:item.active="{ item }">
          <v-chip label outlined :color="statusColor(item.active)">
            <div class="subtitle-2">{{ item.active ? 'Approved' : 'Waiting' }}</div>
          </v-chip>
        </template>
        <template v-slot:item.action="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                icon 
                v-on="on"
                @click.stop="toggleUser(item)"
              >
                <v-icon>{{approveIcon(item.active)}}</v-icon>
              </v-btn>
            </template>
            <span>{{approveTooltip(item)}}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                icon 
                v-on="on"
                :disabled="item.role == 'admin'"
                @click.stop="deleteStaff(item)"
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
      <v-btn
      v-if="root"
      absolute
      dark
      fab
      bottom
      right
      color="pink"
      @click="returnToRoot"
    >
      <v-icon>mdi-send</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
  import { beautifyEmail } from '../../util'
  import { getSiteUsers, updateMemberStatus, removeStaff } from '../../api'

  export default {
    name: 'Owners',

    data: () => ({
      loading: false,
      search: '',
      snackbar: false,
      snackColor: '',
      snackText: '',
      dialog: false,
      dateMenu: false,
      modal: false,
      valid: true,
      headers: [
        {
          text: 'First Name',
          value: 'first',
          align: 'center'
        },
        {
          text: 'Last Name',
          value: 'last',
          align: 'center'
        },
        {
          text: 'Email',
          value: 'email',
          align: 'center'
        },
        {
          text: 'Phone',
          value: 'phone',
          align: 'center'
        },
        {
          text: 'Site',
          value: 'site_id',
          align: 'center'
        },
        {
          text: 'Status',
          value: 'active',
          align: 'center'
        },
        {
          text: 'Role',
          value: 'role',
          align: 'center'
        },
        { text: 'Actions', align: 'center', value: 'action', sortable: false },
      ],
      users: [
      ],
      defaultIndex: -1,
      editItem: {},
      rules: {
          required: value => {
            return !!value || 'This field is required.'
          },
          confirm: value => {
            return this.form.password == value || 'Password does not match'
          },
          counter: value => value.length >= 6 || 'Min 6 characters',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          },
        },
    }),

    mounted () {
      this.fetchUsers()
    },

    computed: {
      formTitle () {
        return this.defaultIndex === -1 ? 'Add Staff' : 'Edit Staff'
      },
    },

    methods: {
      beautifyEmail,

       returnToRoot() {
          localStorage.removeItem('custom')
          localStorage.removeItem('site_id')
          this.$router.push({name: 'Users'})
        }

      approveIcon(status) {
        if (status) {
          return 'mdi-account-off-outline'
        } else {
          return 'mdi-account-check-outline'
        }
      },

      statusColor (active) {
        return active ? 'red' : 'black'
      },

      approveTooltip (item) {
        return item.active ? 'Disapprove' : 'Approve'
      },

      async fetchUsers () {
        this.loading = "secondary"
        const res = await getSiteUsers()
        if (res.status != 'success') {
          this.snackText = res.data.message
          this.snackColor = res.data.status
          this.snackbar = true
        } else {
          this.users = res.users
        }
        this.loading = false
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.defaultIndex = -1
        }, 300)
      },

      deleteStaff (item) {
        const self = this
        this.$dialog.confirm({
          text: 'Do you really want to remove this staff?',
          title: 'Warning',
          actions: {
            false: 'No',
            true: {
              color: 'red',
              text: 'Yes',
              handle: () => {
                self._deleteStaff(item)
              }
            }
          }
        })
      },

      async _deleteStaff(item) {
        this.loading = true
        const res = await removeStaff(item.site_id)
        this.snackText = res.message
        this.snackColor = res.status
        this.snackbar = true
        if (res.status == 'success') {
          this.users = this.users.filter(user => user.site_id != item.site_id)
        }
        this.loading = false
      },

      async toggleUser (item) {
        console.log(item)
        this.loading = true
        try {
          const res = await updateMemberStatus(item.email, !item.active)
          this.snackText = res.message
          this.snackColor = res.status
          this.snackbar = true
          if (res.status == 'success') {
            this.users = this.users.map(user => {
              if (user.email == item.email) {
                user.active = !user.active
              }
              return user
            })
          }
        } catch(e) {
          console.log(e)
        }
        this.loading = false
      },

      async addStaff() {
        this.$refs.form.validate()
        if (this.valid) {

        }
      },

      async _delete () {
        this.modal = false
        this.loading = true
        try {
          const data = await axios({
              url: `${BASE_API}/api/admin/rss/delete`,
              data: this.editItem,
              method: 'POST'
            })
            this.snackText = data.data.message
            this.snackColor = data.data.status
            if (data.data.status == 'success') {
              this.users.splice(this.defaultIndex, 1)
              this.dialog = false
            }
        } catch(e) {
          this.snackText = 'Something wrong happened on the server.'
        } finally {
            this.loading = false
            this.snackbar = true
        }
      },
    }
  }
</script>

