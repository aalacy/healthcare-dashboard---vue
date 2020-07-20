<template>
  <v-container
    id="register"
    class="fill-height justify-center"
    tag="section"
  >
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
    <v-row justify="center">
      <v-slide-y-transition appear>
        <base-material-card
          color="secondary"
          light
          max-width="100%"
          width="400"
          class="px-5 py-3"
        >
          <template v-slot:heading>
            <div class="text-center">
              <div class="display-2 font-weight-bold">
                Register
              </div>
            </div>
          </template>

          <v-form
            ref="form"
            v-model="valid"
            class="text-center"
          >
            <v-text-field
              v-model="form.first"
              :loading="loading"
              :rules="[rules.required]"
              hide-details="auto"
              class="my-5"
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
                  <v-icon slot="prepend" color="primary">mdi-calendar</v-icon>
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
              v-model="form.password"
              :rules="[rules.required]"
              :loading="loading"
              :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="() => (value = !value)"
              :type="value ? 'password' : 'text'"
              hide-details="auto"
              class="mb-5"
              label="Password"
              prepend-icon="mdi-lock-outline"
              required
            />

            <v-text-field
              type="password"
              v-model="form.confirmpassword"
              :rules="[rules.required, rules.confirm]"
              :loading="loading"
              hide-details="auto"
              class="mb-5"
              label="Confirm Password"
              prepend-icon="mdi-lock-outline"
              required
            />

            <v-text-field
              v-model="form.site_id"
              :loading="loading"
              class="mb-5"
              hide-details="auto"
              :rules="[rules.required]"
              label="Site ID"
              prepend-icon="mdi-web"
              @keyup.enter="submit"
              required
            />

            <!-- <v-text-field
              v-model="form.code"
              :loading="loading"
              class="mb-5"
              hide-details="auto"
              label="Code"
              prepend-icon="mdi-key"
              @keyup.enter="submit"
              required
            /> -->

            <v-btn
              :loading="loading"
              color="primary"
              class="display-1"
              :diabled="!valid"
              @click="submit"
            >
              Submit
            </v-btn>
            <div class="text-center grey--text mt-2 body-1 font-weight-light">
              If you already have an account, please <a href="javascript:;" @click="gotoLogin">login</a>
            </div>
          </v-form>
        </base-material-card>
      </v-slide-y-transition>
    </v-row>
  </v-container>
</template>

<script>
  import { BASE_API } from '../../api'
  import axios from 'axios'

  export default {
    name: 'PagesRegister',

    components: {
      PagesHeading: () => import('./components/Heading'),
    },

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
          site_id: '',
        },
        valid: true,
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
      }
    },

    methods: {
      gotoLogin () {
        this.$router.push({ name: "Login" });
      },
      async submit () {
        this.$refs.form.validate()
        
        if (this.valid) {
          this.loading = true
          let res = {}
          try {
            res = await axios({
              url: `${BASE_API}/auth/create`,
              method: 'POST',
              data: this.form,
            })
          } catch (e) {
            res = e.response
          } finally {
            this.loading = false
          }
          
          if (res.data) {
            if (res.data.status === 'success') {
              this.snackbar_color = 'success'
            } else {
              this.snackbar_color = 'red darken-3'
            }
            this.snackbar_message = res.data.message
            this.snackbar = true
          }
        }
      },
    },
  }
</script>

<style lang="sass">
  #register
    .v-list-item__subtitle
      -webkic-line-clamp: initial
      -webkit-box-orient: initial
</style>
