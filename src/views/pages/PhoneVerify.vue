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
          <div class="mt-5 display-2 font-weight-medium text-center">
            Please Verify Phone Number
          </div>
          <v-card-text
            class="text-center"
          >
            <v-card
              class="mt-1"
              outlined
              rounded
            >
              <v-list>
                <v-list-item>
                  <div class="d-flex">
                    <v-icon>mdi-email-outline</v-icon>
                    <div class="ml-3">{{form.email}}</div>
                  </div>
                </v-list-item>
                <v-list-item>
                  <div class="d-flex">
                    <v-icon>mdi-phone-outline</v-icon>
                    <div class="ml-3">{{form.phone}}</div>
                  </div>
                </v-list-item>
              </v-list>
            </v-card>
            <v-btn
                class="ma-1 mt-1"
                color="primary"
                :loading="loading"
                :diabled="!valid"
                @click="submit"
              >
                Verification Code
              </v-btn>

            <v-form
              v-if="false"
              ref="form"
              v-model="valid"
            >
              <v-text-field
                v-model="form.email"
                :loading="loading"
                hide-details="auto"
                class="mb-5"
                readonly
                label="Your email address."
                prepend-icon="mdi-email-outline"
                @keyup.13="submit"
                required
              />
              <v-text-field
                v-model="form.phone"
                :rules="[rules.required]"
                :loading="loading"
                hide-details="auto"
                class="mb-5"
                readonly
                label="Your phone number."
                prepend-icon="mdi-phone-outline"
                @keyup.13="submit"
                required
              />
              
            </v-form>
            <div class="mt-3">Do you want update your phone number? click <a href="#" @click="phoneSection=!phoneSection">{{title}}</a></div>
            
            <v-form
              ref="updateForm"
              v-if="phoneSection"
            >
              <v-text-field
                ref="email"
                v-model="updateForm.phone"
                :rules="[rules.required]"
                :loading="loading"
                hide-details="auto"
                class="mb-5"
                label="Your phone number."
                prepend-icon="mdi-phone-outline"
                @keyup.13="submit"
                required
              />
              <v-btn
                class="ma-1 mt-1"
                color="success"
                :loading="loading"
                :diabled="loading || !updateValid"
                @click="update"
              >
                Update
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-slide-y-transition>
    </v-row>
  </v-container>
</template>

<script>
  import { resendPhoneVerifyCode, Post } from '../../api'

  export default {
    name: 'EmailVerify',

    data () {
      return {
        loading: false,
        valid: true,
        updateValid: true,
        snackbar: false,
        color: 'success',
        message: '',
        phoneSection: false,
        form: {
          email: localStorage.getItem('email'),
          phone: localStorage.getItem('phone')
        },
        updateForm: {
          phone: ''
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
    computed : {
      title () {
        return this.phoneSection ? "hide" : "here"
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
        // this.$refs.form.validate()
        // if (this.valid) {
          this.loading = true
          const res = await resendPhoneVerifyCode(this.form.email)
          this.showSnack(res)
          this.loading = false
          if (res.status == 'success') {
            const self = this
            setTimeout(function() {self.$router.push({ name: 'Phone Verify2' })}, 2500)
          }
        // }
      },

      async update () {
        this.$refs.updateForm.validate()
        if (this.updateValid) {
          this.loading = true
          const data = {
            ...this.updateForm,
            email: localStorage.getItem('email')
          }
          const res = await Post('auth/update/profile', data)
          this.showSnack(res)
          if (res.status == 'success') {
            this.form.phone = this.updateForm.phone
          }
          this.loading = false
        }
      },
    }
  }
</script>
