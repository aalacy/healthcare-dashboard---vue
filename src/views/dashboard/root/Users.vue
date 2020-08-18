<template>
    <v-container
      id="root-main"
      fluid
      tag="section"
    >
      <v-card
        icon="mdi-account-multiple"
        class="px-5 py-3"
      >
          <v-card-title>
            Users 
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              class="mb-3"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :loading="loading"
            :headers="headers"
            :items="sites"
            item-key="site_id"
            :items-per-page="5"
            :search="search"
            class="custom-alert"
            color="secondary"
          > 
            <template v-slot:item.owner="{ item }">
              <span v-html="beautifyEmail(item.owner)"></span>
            </template>
            <template v-slot:item.controllers="{ item }">
              <span>{{ item.controllers.length }}</span>
            </template>
            <template v-slot:item.members="{ item }">
              <span>{{ item.members.length }}</span>
            </template>
            <template v-slot:item.action="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn 
                    text 
                    icon 
                    v-on="on"
                    @click.stop="navigateSite(item)"
                  >
                    <v-icon>mdi-account-search</v-icon>
                  </v-btn>
                </template>
                <span>Navigate</span>
              </v-tooltip>
            </template>
        </v-data-table>
      </v-card>

      <v-snackbar
        v-model="snackbar"
        :color="snackColor  "
        multi-line
        top
      >
        {{snackText}}
        <v-icon
          dark
          @click="snackbar = false"
        >
          mdi-close
        </v-icon>
      </v-snackbar>

      <v-dialog v-model="modal" max-width="290">
          <v-card>
            <v-card-title class="text-center"><b>WARNING</b></v-card-title>
            <v-card-text>Are you sure?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="modal = false">Disagree</v-btn>
              <v-btn color="green darken-1" text @click="_delete()">Agree</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  </v-container>
</template>

<script>
    import { beautifyEmail } from '../../../util'
    import { fetchAllSites } from '../../../api'

    export default {
      name: 'Main',

      data: () => ({
        loading: false,
        search: '',
        snackbar: false,
        snackColor: '',
        snackText: '',
        dialog: false,
        dateMenu: false,
        modal: false,
        sites: [],
        headers: [
          {
            text: 'Site ID',
            value: 'site_id'
          },
          {
            text: 'Owner Email',
            value: 'owner'
          },
          // {
          //   text: 'Owner Phone',
          //   value: 'phone'
          // },
          {
            text: '# of Controllers',
            value: 'controllers'
          },
          {
            text: '# of Staff Members',
            value: 'members'
          },
          {
            text: 'Owner Location',
            value: 'location'
          },
          { text: 'Actions', value: 'action', sortable: false, align: 'center' },
        ]
      }),

      async mounted () {
        this.sites = await fetchAllSites()
      },

      methods: {
        beautifyEmail,

        navigateSite (item) {
          localStorage.setItem('site_id', item.site_id)
          localStorage.setItem('custom', 'root')
          this.$router.push({ name: "Sites" });
        }
    }
  }
</script>
