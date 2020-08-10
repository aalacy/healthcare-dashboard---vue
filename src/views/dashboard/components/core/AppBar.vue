<template>
  <div>
    <v-app-bar
      color="#0c2c52"
      dark
      fixed
      dense
    >
      <v-toolbar-title
        class="hidden-lg-and-up"
      >
        <a :href="root() ? '/#/users' : '/#/'">
          <v-img
            contain
            width="120"
            :src="require(`@/assets/logo.png`)"
          ></v-img>
        </a>
      </v-toolbar-title>
      <v-toolbar-title class="hidden-md-and-down">Alert Stormwater Control Panel</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title
        class="navbar-logo hidden-md-and-down"
      >
        <a :href="root() ? '/#/users' : '/#/'">
          <v-img
            contain
            width="200"
            :src="require(`@/assets/logo.png`)"
          ></v-img>
        </a>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
         <v-btn
          v-for="(item, index) in computedItems"
          :key="item.name"
           @click="goto(item.name, index)"
          :class="{active: index == selected}"
          text
          small
        ><v-icon>{{ item.icon }}</v-icon>{{ item.title }}</v-btn>
      </v-toolbar-items>
      <v-menu 
        class="hidden-md-and-up"
        transition="slide-y-transition"
        bottom
      >
        <template v-slot:activator="{ on }">
          <v-btn
            class="hidden-md-and-up"
            icon
            large
            v-on="on"
          >
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>
        <v-list class="toolbar-menu">
          <v-subheader class="display-1">Alert Stormwater Control Panel</v-subheader>
          <v-list-item-group v-model="selected" color="primary">
            <v-list-item @click="goto(item.name)" v-for="item in computedItems" :key="item.name">
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-action-text  class="heading" v-text="item.title"></v-list-item-action-text>
               </v-list-item-content>
            </v-list-item>   
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-app-bar>
  <v-snackbar
    v-model="snackbar"
    color="error"
    multi-line
    top
  >
    {{message}}
    <v-icon
      dark
      @click="snackbar = false"
    >
      mdi-close
    </v-icon>
  </v-snackbar>

  </div>
</template>

<script>
  // Components
  import { VHover, VListItem } from 'vuetify/lib'

  // Utilities
  import { mapState, mapMutations } from 'vuex'
  import axios from 'axios'
  import { Post } from '../../../../api'
  import jwtDecode from 'jwt-decode'

  export default {
    name: 'DashboardCoreAppBar',

    components: {
      AppBarItem: {
        render (h) {
          return h(VHover, {
            scopedSlots: {
              default: ({ hover }) => {
                return h(VListItem, {
                  attrs: this.$attrs,
                  class: {
                    'black--text': !hover,
                    'white--text secondary elevation-12': hover,
                  },
                  props: {
                    activeClass: '',
                    dark: hover,
                    link: true,
                    ...this.$attrs,
                  },
                }, this.$slots.default)
              },
            },
          })
        },
      },
    },

    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({
      message: '',
      snackbar: false,
      rootRole: 'admin',
      notifications: [
        'Mike John Responded to your email',
        'You have 5 new tasks',
        'You\'re now friends with Andrew',
        'Another Notification',
        'Another one',
      ],
      profile: [
        { title: 'Profile', name: 'My Profile' },
        { title: 'Log out', name: 'Login' },
      ],
      menu: [
        { icon: 'mdi-account-group', title: 'Users', name: 'Users', is_root: true },
        { icon: 'mdi-account-group', title: 'Root', name: 'Root', is_root: true },
        { icon: 'mdi-file-cog', title: 'Location', name: 'Sites' },
        { icon: 'mdi-account-group-outline', title: 'Staff', name: 'Staff' },
        { icon: 'mdi-cog', title: 'Configure', name: 'Configure'},
        { icon: 'mdi-account-outline', title: 'Customer', name: 'My Profile', is_only_admin:true },
        { icon: 'mdi-logout', title: 'Logout', name: 'Login', both: true }
      ],
      selected: 0,
      currentRoute: ''
    }),

    computed: {
      ...mapState(['drawer']),

      computedItems () {
        let new_items = this.menu.map(this.mapItem)
        new_items = new_items.filter(item => {
          if (this.rootRole == 'root') {
            if (item && !item.is_only_admin) {
              return item
            }
          } else {
            return item
          }
        })
        new_items.map((item, i) => {
          if (this.currentRoute.includes(item.name)) {
            this.selected = i
          }
        })
        return new_items
      },
    },

    mounted () {
     this.currentRoute = this.$router.history.current.name

     console.log(this.root())
    },

    methods: {
      ...mapMutations({
        setDrawer: 'SET_DRAWER',
      }),

      root () {
        try {
          this.rootRole = jwtDecode(localStorage.getItem('roottoken')).role
        } catch (e) {}
        const customCode = localStorage.getItem('custom')
        return this.rootRole == 'root' && customCode != 'root'
      },

      mapItem (item) {
        if (this.root()) {
          if (item.is_root || item.both) {
            return {
              ...item,
              title: this.$t(item.title),
            }
          }
        } else {
          if (!item.is_root) {
            return {
              ...item,
              title: this.$t(item.title),
            }
          }
        }
      },

      clearStorage() {
        // localStorage.removeItem('custom')
      },

      async goto (name, index=-1) {
        if (name = 'Login') {
          this.clearStorage()
        }
        if (name != this.currentRoute) {
          this.$router.push({ name })
        }
        if (index != -1) {
          this.selected = index
        }
      }
    },
  }
</script>
