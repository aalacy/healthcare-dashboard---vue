<template>
  <v-app-bar
    absolute
    color="transparent"
    flat
    height="85"
  >
    <v-row justify="start">
      <col cols="2">
        <img
          contain
          aspect-ratio="1"
          :src="require(`@/assets/logo.png`)"
          class="logo"
        />
        </img>
      </col>
    </v-row>
  </v-app-bar>
</template>

<script>
  export default {
    name: 'PagesCoreAppBar',

    data: () => ({
      titles: {
        '/pages/lock': 'Lock Page',
        '/pages/login': 'Login Page',
        '/pages/register': 'Register Page',
      },
    }),

    computed: {
      title () {
        return "halloe"
      },
    },

    methods: {
      goTo (name) {
        const token = localStorage.getItem('jwt')
        if (this.$router.history && this.$router.history.current && this.$router.history.current.name == name) {
          return;
        }
        if (name === 'Dashboard') {
          if (token === 'success') {
            this.$router.push({ name });
          }
        } else {
          this.$router.push({ name });
        }
      },
    },
  }
</script>

<style>
  .logo {
    border-radius: 3px;
    object-fit: contain;
    height: auto;
    width: 160px
  }
</style>