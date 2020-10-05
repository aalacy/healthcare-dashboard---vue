<template>
  <v-content
    class="mt-48 pt-6" 
  >
    <router-view />

    <!-- <dashboard-core-footer /> -->
    <v-fab-transition>
      <v-btn
        v-if="showReturnToRoot"
        absolute
        dark
        fab
        right
        color="pink"
        @click="returnToRoot"
      >
        <v-icon>mdi-keyboard-backspace</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-content>
</template>

<script>
  import jwtDecode from 'jwt-decode'
  import { mapActions, mapState } from 'vuex'

  export default {
    name: 'DashboardCoreView',

    data () {
      return {
        cron: null
      }
    },

    components: {
      DashboardCoreFooter: () => import('./Footer'),
    },

    mounted () {
      this.registerCron()
    },

    computed: {
      showReturnToRoot () {
        let adminRole = ''
        try {
          adminRole = jwtDecode(localStorage.getItem('token')).role
        } catch (e) {}
        let rootRole = ''
        try {
          rootRole = jwtDecode(localStorage.getItem('roottoken')).role
        } catch (e) {}
        const customCode = localStorage.getItem('custom')
        if (adminRole == 'admin' && customCode == 'root' && rootRole == 'root') {
          return true
        } else {
          return false
        }
      }
    },

    beforeDestroy () {
      clearInterval(this.cron)
    },

    methods: {
      ...mapActions('site', ['getControllers']),

      registerCron () {
        const self = this
        this.cron = setInterval(function() { self.getControllers() }, 300000) // 5 mins
      },

      returnToRoot () {
        localStorage.setItem('custom', '')
        localStorage.setItem('token', '')
        this.$router.push({ name: 'Users' })
        // window.location.reload()
      }
    }
  }
</script>


