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
		        :items="users"
		        item-key="_id"
		        :items-per-page="5"
		        :search="search"
		        class="custom-alert"
	      	> 
		        <template v-slot:item.email="{ item }">
		          <span v-html="beautifyEmail(item.email)"></span>
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
  	import { Get, fetchAllUsers } from '../../../api'

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
	      users: [],
	      headers: [
	      	{
	      		text: 'Account ID',
	      		value: 'account_id'
	      	},
	      	{
	      		text: 'Owner Email',
	      		value: 'email'
	      	},
	      	{
	      		text: 'Owner Phone',
	      		value: 'phone'
	      	},
	      	{
	      		text: '# of Controllers',
	      		value: 'controllers_cnt'
	      	},
	      	{
	      		text: '# of Staff Members',
	      		value: 'staff_cnt'
	      	},
	      	{
	      		text: 'Owner Location',
	      		value: 'location'
	      	},
      	 	{ text: 'Actions', value: 'action', sortable: false },
	      ]
	    }),

	    mounted () {
	      this.users = fetchAllUsers()
	    },

	    methods: {
	      beautifyEmail,

	      navigateSite (item) {
	      	localStorage.setItem('token', item.token)
	      	localStorage.setItem('custom', 'root')
      	 	this.$router.push({ name: "Sites" });
      	 	// window.location.reload()
	      }
		}
	}
</script>
