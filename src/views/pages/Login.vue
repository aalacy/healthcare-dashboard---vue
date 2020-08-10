<template>
  <v-container
    id="login"
    class="fill-height justify-center"
    tag="section"
  >
    <v-snackbar
      v-model="snackbar"
      :color="snackbar_color"
      multi-line
      top
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
              <h1 class="display-2 font-weight-bold">
                Login
              </h1>
             
            </div>
          </template>

          <v-card-text
            class="text-center"
          >
            <v-form
              ref="form"
              v-model="valid"
            >
              <v-text-field
                ref="email"
                v-model="form.email"
                :rules="[rules.required, rules.email]"
                :loading="loading"
                hide-details="auto"
                class="mb-5"
                label="Please enter your email address."
                prepend-icon="mdi-email-outline"
                @keyup.enter="request"
                required
              />

              <v-text-field
                ref="password"
                type="password"
                v-model="form.password"
                :rules="[rules.required]"
                :loading="loading"
                :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="() => (value = !value)"
                :type="value ? 'password' : 'text'"
                hide-details="auto"
                class="mb-10"
                label="Password"
                prepend-icon="mdi-lock-outline"
                @keyup.enter="submit"
                required
              />

              <v-btn
                class="ma-1 mt-1"
                color="primary"
                :loading="loading"
                :diabled="!valid"
                @click="submit"
              >
                Submit
              </v-btn>
              <div class="text-center mt-2 grey--text body-1 font-weight-light">
                If you don't have any account, please <a href="javascript:;" @click="gotoSignup" class="">sign up</a>
              </div>
            </v-form>
          </v-card-text>
        </base-material-card>
      </v-slide-y-transition>
    </v-row>
  </v-container>
</template>

<script>
  import { BASE_API } from '../../api'
  import axios from 'axios'
  import jwtDecode from 'jwt-decode'

  export default {
    name: 'PagesLogin',

    components: {
    },

    data () {
      const defaultForm = Object.freeze({
        email: '',
        password: ''
      })

      return {
        loading: false,
        valid: true,
        value: true,
        snackbar: false,
        snackbar_message: '',
        snackbar_color: 'success',
        defaultForm,
        form: Object.assign({}, defaultForm),
        password: '',
        rules: {
          required: value => {
            return !!value || 'This field is required.'
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
      localStorage.setItem('jwt', null)
      localStorage.setItem('token', null)
      localStorage.setItem('site_id', null)
      localStorage.setItem('roottoken', null)
      localStorage.setItem('custom', null)
    },

    methods: {
      gotoSignup () {
        this.$router.push({ name: "Register" });
      },

      gotoDashboard (data) {
        localStorage.setItem('jwt', 'success')
        localStorage.setItem('token', data.token)
        const token = jwtDecode(data.token)
        localStorage.setItem('site_id', token.site_id)
        localStorage.setItem('email', token.email)
        if (token.role == 'root') {
          localStorage.setItem('roottoken', data.token)
          this.$router.push({ name: "Users" });
        } else {
          this.$router.push({ name: "Sites" });
        }
      },

      async submit () {
        this.$refs.form.validate()

        if (this.valid) {
          this.loading = true
          const self = this
          let res = {}
          try {
           res = await axios({
            url:`${BASE_API}/auth/login`,
            method: 'POST',
            data: this.form,
            withCredentials: false,
            crossdomain: true,
            }) 
          } catch (e) {
            res = e.response
          } finally {
            this.loading = false
          }

          if (res.data) {
            if (res.data.status === 'success') {
              this.gotoDashboard(res.data)
            } else {
              this.snackbar_message = res.data.message
              this.snackbar_color = 'failure'
              this.snackbar = true
            }
          }
        }
      },
    },
  }
</script>
