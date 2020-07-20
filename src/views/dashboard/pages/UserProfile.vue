<template>
  <v-container
    id="user-profile"
    fluid
    tag="section"
  >
    <base-material-card icon="mdi-account-outline" color="secondary">
      <template v-slot:after-heading>
        <div class="font-weight-light card-title mt-2">
          Update Profile
         
        </div>
      </template>

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
                  label="Date"
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
              hide-details="auto"
              label="Please enter your email address."
              prepend-icon="mdi-email-outline"
              @keyup.enter="submit"
              required
            />
          </v-row>
          <v-row>
            <v-text-field
              type="number"
              v-model="form.phone"
              :rules="[rules.required]"
              :loading="loading"
              class="mb-5"
              hide-details="auto"
              label="Please enter your phone number."
              prepend-icon="mdi-phone-outline"
              @keyup.enter="submit"
              required
            />

            <v-text-field
              v-model="form.oldpassword"
              :rules="[rules.required]"
              :loading="loading"
              :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="() => (value = !value)"
              :type="value ? 'password' : 'text'"
              hide-details="auto"
              class="mb-5"
              label="Old password"
              prepend-icon="mdi-lock-outline"
              required
            />

            <v-text-field
              type="password"
              v-model="form.password"
              :rules="[rules.required]"
              :loading="loading"
              :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="() => (value = !value)"
              :type="value ? 'password' : 'text'"
              hide-details="auto"
              class="mb-5"
              label="New password"
              prepend-icon="mdi-lock-outline"
              required
            />

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
    </base-material-card>
    
    <v-card class="pa-3">
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
                  v-model="notifyEmail"
                  label="Notify via email"
                ></v-checkbox>
                <v-checkbox
                  v-model="notifyPush"
                  label="Notify via text message"
                ></v-checkbox>

                <v-btn class="success">Update</v-btn>
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
  import { Post, getSMSConfigs, getMyProfile } from '../../../api'

  export default {
    name: "UserProfile",

    data () {
      return {
        loading: false,
        dateMenu: false,
        value: true,
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
        notifyEmail: false,
        notifyPush: false,
        rules: {
          required: value => {
            return !!value || 'This field is required.'
          },
          confirm: value => {
            return this.form.oldpassword == value || 'Password does not match'
          },
          counter: value => value.length >= 6 || 'Min 6 characters',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          },
        },
      }
    },

    mounted () {
      this.fillUser()

      this.configs = getSMSConfigs()
    },

    methods: {
      fillUser () {
        // try {
        //   this.form = JSON.parse(localStorage.getItem('user'))
        // } catch (e) {
        //   console.log(e)
        // }
        const email = jwtDecode(localStorage.getItem('token')).email
        this.form = getMyProfile(email)
      },

      async submit () {
        this.loading = true
        const res = await Post('auth/update', this.form)
        this.snackbar_message = res.data.message
        this.snackbar_color = res.data.status
        this.snackbar = true
        this.loading = false
      }
    }
  }
</script>
