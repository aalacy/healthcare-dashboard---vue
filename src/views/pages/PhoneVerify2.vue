<template>
  <v-container
    id="phone-verify2"
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
        <v-card
          min-width=300
        >
          <div class="mt-5 display-2 font-weight-medium text-center">
            Please Input Your Code
          </div>
          <v-card-text
            class="text-center"
          >
            <v-form
              ref="form"
              v-model="valid"
            >
              <v-text-field
                ref="code"
                type="number"
                v-model="form.code"
                :rules="[rules.required]"
                :loading="loading"
                hide-details="auto"
                class="mb-5"
                label="Please enter your code."
                prepend-icon="mdi-text"
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
                Verify
              </v-btn>
              <div
                class="mt-3"
              >
                If you didn't receive verification code yet, click <a href="#" @click="resend">here</a> to resend it
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-slide-y-transition>
    </v-row>
  </v-container>
</template>

<script>
  import { resendPhoneVerifyCode, verifyPhone } from '../../api'
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
          code: ''
        },
        rules: {
          required: value => {
            return !!value || 'This field is required.'
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
        this.$refs.form.validate()
        if (this.valid) {
          this.loading = true
          const res = await verifyPhone(this.form.code) 
          this.showSnack(res)
          this.loading = false
          if (res.status == 'success') {
            this.gotoDashboard(res)
          }
        }
      },
      async resend () {
        this.loading = true
        const res = await resendPhoneVerifyCode()
        this.showSnack(res)
        this.loading = false
        if (res.status == success) {
          const self = this
          setTimeout(function() {self.$router.push({ name: 'Login' })}, 2500)
        }
      }
    }
  }
</script>
