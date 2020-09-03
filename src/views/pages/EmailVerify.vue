<template>
  <v-container
    id="email-verify"
    class="fill-height justify-center"
    tag="section"
  >
    <v-snackbar
      v-model="snackbar"
      :color="color"
      multi-line
      top
    >
      <span>{{ message }}</span>
      <v-icon
        dark
        @click="snackbar = false"
      >
        mdi-close
      </v-icon>
    </v-snackbar>
    <v-row justify="center">
      <v-slide-y-transition appear>
        <v-card>
          <div class="mt-5 display-2 font-weight-medium text-center">
            Please Verify Email
          </div>
          <v-card-text
            class="text-center"
          >
            <v-list>
              <v-list-item>
                <div class="d-flex">
                  <v-icon>mdi-email-outline</v-icon>
                  <div class="ml-3">{{form.email}}</div>
                </div>
              </v-list-item>
            </v-list>
            <v-btn
              class="ma-1 mt-1"
              color="primary"
              :loading="loading"
              :diabled="!valid"
              @click="submit"
            >
              Verify
            </v-btn>
            <div class="text-center mt-2 grey--text body-1 font-weight-light">
              If you didn't receive any verification email, click <a href="javascript:;" @click="resend">here</a> to resend.
            </div>
            <v-form
              v-if="false"
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
                readonly
                label="Your email address."
                prepend-icon="mdi-email-outline"
                @keyup.enter="submit"
                required
              />
              
            </v-form>
          </v-card-text>
        </v-card>
      </v-slide-y-transition>
    </v-row>
  </v-container>
</template>

<script>
  import { resendEmailVerify, verifyEmail } from '../../api'
  import jwtDecode from 'jwt-decode'
  
  export default {
    name: 'EmailVerify',

    data () {
      return {
        loading: false,
        valid: true,
        snackbar: false,
        color: 'success',
        message: '',
        form: {
          email: localStorage.getItem('email')
        },
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
    },
    methods: {
      showSnack (res) {
        this.color = res.status
        this.message = res.message
        this.snackbar = true
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
        // this.$refs.form.validate()
        // if (this.valid) {
          this.loading = true
          const res = await verifyEmail(this.form.email) 
          this.showSnack(res)
          this.loading = false
          if (res.status == 'success') {
            this.gotoDashboard(res)
          } else {
            if (res.detail == 'verify_phone') {
              localStorage.setItem('phone', res.phone)
              this.$router.push({name: 'Phone Verify'})
            }
          }
        // }
      },
      async resend () {
        // this.$refs.form.validate()
        // if (this.valid) {
          this.loading = true
          const res = await resendEmailVerify(this.form.email)
          this.showSnack(res)
          this.loading = false
        // }
      }
    }
  }
</script>
