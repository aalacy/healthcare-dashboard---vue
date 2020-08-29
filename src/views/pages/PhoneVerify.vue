<template>
  <v-container
    id="phone-verify"
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
          <v-card-title class="my-3">
            Phone Number Verification
          </v-card-title>
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
                @keyup.13="submit"
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
            </v-form>
          </v-card-text>
        </v-card>
      </v-slide-y-transition>
    </v-row>
  </v-container>
</template>

<script>
  import { resendPhoneVerifyCode } from '../../api'

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
          email: ''
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

      async submit () {
        this.$refs.form.validate()
        if (this.valid) {
          this.loading = true
          const res = await resendPhoneVerifyCode(this.form.email)
          this.showSnack(res)
          this.loading = false
          if (res.status == 'success') {
            const self = this
            setTimeout(function() {self.$router.push({ name: 'Phone Verify2' })}, 2500)
            localStorage.setItem('email', this.form.email)
          }
        }
      }
    }
  }
</script>
