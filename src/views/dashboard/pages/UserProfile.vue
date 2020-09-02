<template>
  <v-container
    id="user-profile"
    fluid
    tag="section"
  >
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="py-4">
          <v-card-title>
            Update Profile
          </v-card-title>

          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
              class="text-center pa-5"
            >
              <v-row>
                  <v-text-field
                    v-model="form.first"
                    :loading="loading"
                    :rules="[rules.required]"
                    hide-details="auto"
                    label="First Name"
                    prepend-icon="mdi-account-outline"
                    required
                  />
                  <v-text-field
                    v-model="form.last"
                    :loading="loading"
                    :rules="[rules.required]"
                    hide-details="auto"
                    class="mb-5"
                    label="Last Name"
                    prepend-icon="mdi-account-outline"
                    required
                  />
                  <v-menu
                    v-if="false"
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
                        v-model="form.dob"
                        label="Date of Birthday"
                        readonly
                        :rules="[rules.required]"
                        v-on="on"
                      >
                        <v-icon slot="prepend" >mdi-calendar</v-icon>
                      </v-text-field>
                    </template>
                    <v-date-picker v-model="form.dob"  @input="dateMenu = false"></v-date-picker>
                  </v-menu>

                  <v-text-field
                    v-model="form.email"
                    :rules="[rules.required, rules.email]"
                    :loading="loading"
                    class="mb-5"
                    readonly
                    hide-details="auto"
                    label="Email address."
                    prepend-icon="mdi-email-outline"
                    @keyup.enter="submit"
                    required
                  />
                </v-row>
                <v-row>
                  <v-col cols="auto">
                    <v-text-field
                      type="number"
                      v-model="form.phone"
                      :rules="[rules.required, rules.counter]"
                      :loading="loading"
                      prefix="+1"
                      class="mb-5"
                      hide-details="auto"
                      label="Phone number."
                      prepend-icon="mdi-phone-outline"
                      @keyup.enter="submit"
                      required
                    />
                  </v-col>
               <!--    <v-text-field
                    v-model="form.site"
                    :loading="loading"
                    class="mb-5"
                    hide-details="auto"
                    label="Site"
                    prepend-icon="mdi-web"
                    @keyup.enter="submit"
                    required
                  /> -->
              </v-row>
              <v-btn
                :loading="loading"
                color="primary"
                class="display-1"
                :diabled="!valid"
                @click="submit"
              >
                Update
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="py-4">
          <v-card-title>
            Update Password
          </v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              v-model="pwdValid"
              class="text-center pa-5"
            >
              <v-text-field
                v-model="form.old_password"
                :rules="[rules.required]"
                :loading="loading"
                :append-icon="value1 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="() => (value1 = !value1)"
                :type="value1 ? 'password' : 'text'"
                hide-details="auto"
                class="mb-5"
                label="Old password"
                prepend-icon="mdi-lock-outline"
                required
              />

              <v-text-field
                type="password"
                v-model="form.new_password"
                :rules="[rules.required]"
                :loading="loading"
                :append-icon="value2 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="() => (value2 = !value2)"
                :type="value2 ? 'password' : 'text'"
                hide-details="auto"
                class="mb-5"
                label="New password"
                prepend-icon="mdi-lock-outline"
                required
              />
              <v-btn class="primary" :loading="loading" @click="submitPassword">Update</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <v-card v-if="shouldShow" class="pa-3">
      <v-card-title class="mb-7">
        SMS Alert Configuration
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="8">
            <v-data-table
              dense
              :loading="loading"
              :headers="configHeaders"
              :items="configs"
              item-key="event"
              hide-default-footer
              class="custom-alert"
              color="secondary"
            > 
                <template v-slot:item.none="{ item }">
                  <v-checkbox
                  v-model="item.none"
                ></v-checkbox>
                </template>
                <template v-slot:item.notify_only="{ item }">
                  <v-checkbox
                  v-model="item.notify_only"
                ></v-checkbox>
                </template>
                <template v-slot:item.notify_and_open_valve="{ item }">
                  <v-checkbox
                  v-model="item.notify_and_open_valve"
                ></v-checkbox>
                </template>
                <template v-slot:item.notify_and_partial_open_valve="{ item }">
                  <v-checkbox
                  v-model="item.notify_and_partial_open_valve"
                ></v-checkbox>
                </template>
                <template v-slot:item.notify_valve_closes="{ item }">
                  <v-checkbox
                  v-model="item.notify_valve_closes"
                ></v-checkbox>
                </template>
                <template v-slot:item.water_elevation="{ item }">
                  <v-checkbox
                  v-model="item.water_elevation"
                ></v-checkbox>
                </template>
                <template v-slot:item.minimum_elevation="{ item }">
                  <v-checkbox
                  v-model="item.minimum_elevation"
                ></v-checkbox>
                </template>
              </v-data-table>
            </v-col>

            <v-col cols="12" md="4">
              <v-sheet elevation="1"  class="pa-3">
                <v-checkbox
                  v-model="notify_via_email"
                  label="Notify via email"
                ></v-checkbox>
                <v-checkbox
                  v-model="notify_via_text_message"
                  label="Notify via text message"
                ></v-checkbox>

                <v-btn class="success" :loading="loading" @click="updateNotiy">Update</v-btn>
              </v-sheet>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      :color="snackbar_color"
      top
      multi-line
    >
      <span>{{ snackbar_message }}</span>
      <v-icon
        dark
        @click="snackbar = false"
      >
        mdi-close
      </v-icon>
    </v-snackbar>
  </v-container>
</template>

<script>
  import jwtDecode from 'jwt-decode'
  import { getAlerts, getMyProfile, updateProfile, updateAlert, updatePassword, isAdmin } from '../../../api'

  export default {
    name: "UserProfile",

    data () {
      return {
        loading: false,
        dateMenu: false,
        value1: true,
        value2: true,
        snackbar: false,
        timeout: 10000,
        snackbar_message: '',
        snackbar_color: 'success',
        form: {
          first: '',
          last: '',
          email: '',
          phone: '',
          password: '',
          site: ''
        },
        configs: [],
        configHeaders: [
          {
            text: 'Weather Related Events',
            value: 'event',
          },
          {
            text: 'None',
            value: 'none',
          },
          {
            text: 'Notify Only',
            value: 'notify_only',
          },
          {
            text: 'Notify And Open Valve',
            value: 'notify_and_open_valve',
          },
          {
            text: 'Notify And Partial Open Valve',
            value: 'notify_and_partial_open_valve',
          },
          {
            text: 'Notify When Valve Closes',
            value: 'notify_valve_closes',
          },
          {
            text: 'Water Elevation',
            value: 'water_elevation',
          },
          {
            text: 'Minimum Elevation',
            value: 'minimum_elevation',
          },
        ],
        valid: true,
        pwdValid: true,
        notify_via_email: false,
        notify_via_text_message: false,
        rules: {
          required: value => {
            return !!value || 'This field is required.'
          },
          confirm: value => {
            return this.form.oldpassword == value || 'Password does not match'
          },
          counter: value => value.length == 10 || '10 digits',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          },
        },
      }
    },

    computed: {
      shouldShow() {
        return isAdmin()
      }
    },

    mounted () {
      this.loading = "secondary"
      this.getAlertData()
      this.getUserData()
      this.loading = false
    },

    methods: {
      async getUserData () {
        const email = jwtDecode(localStorage.getItem('token')).email
        const res = await getMyProfile(email)
        this.snackbar_message = res.message
        this.snackbar_color = res.status
        if (res.status == 'success') {
          this.form = res.user
        } else {
          this.snackbar = true
        }
      },

      async getAlertData () {
        const email = jwtDecode(localStorage.getItem('token')).email
        const res = await getAlerts(email)
        this.snackbar_message = res.message
        this.snackbar_color = res.status
        if (res.status == 'success') {
          this.configs = res.data.options
          this.notify_via_email = res.data.notify_via_email
          this.notify_via_text_message = res.data.notify_via_text_message
        } else {
          this.snackbar = true
        }
      },

      async updateNotiy() {
        this.loading = true
        const data = {
          notify_via_email: this.notify_via_email,
          notify_via_text_message: this.notify_via_text_message,
          options: this.configs
        }
        const res = await updateAlert(data)
        this.snackbar_message = res.message
        this.snackbar_color = res.status
        this.snackbar = true
        this.loading = false
      },

      submit () {
        const self = this
        this.$dialog.confirm({
          text: 'Do you really want to update the profile?',
          title: 'Warning',
          actions: {
            false: 'No',
            true: {
              color: 'red',
              text: 'Yes',
              handle: () => {
                self._udpateProfile()
              }
            }
          }
        })  
      },
      async _udpateProfile() {
        this.loading = true
        const data = Object.assign({}, this.form)
        data.phone = `1${data.phone}`
        const res = await updateProfile(data)
        this.snackbar_message = res.message
        this.snackbar_color = res.status
        this.snackbar = true
        if (res.status == 'success') {
          localStorage.setItem('token', res.auth_token)
        }
        this.loading = false
      },

      async submitPassword() {
        const self = this
        this.$dialog.confirm({
          text: 'Do you really want to update the password?',
          title: 'Warning',
          actions: {
            false: 'No',
            true: {
              color: 'red',
              text: 'Yes',
              handle: () => {
                self._udpatePassword()
              }
            }
          }
        })  
      },

      async _udpatePassword() {
        this.loading = true
        const res = await updatePassword(this.form)
        this.snackbar_message = res.message
        this.snackbar_color = res.status
        this.snackbar = true
        this.loading = false
      },
    }
  }
</script>
