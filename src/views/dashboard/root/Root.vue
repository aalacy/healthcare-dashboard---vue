<template>
	<v-container
	    id="dashboard"
	    fluid
	    tag="section"
	    class="min-vh"
	  >
		<v-card
			class="px-5 py-3"
		>
			<v-card-title>
		        Site Listing
		        <v-spacer></v-spacer>
		        <v-dialog v-model="dialog" max-width="720px">
		          <template v-slot:activator="{ on }">
		            <v-btn color="secondary" dark class="mb-2" v-on="on"><v-icon size="16" left dark>mdi-plus</v-icon>Add Site</v-btn>
		          </template>
		          <v-card>
		            <v-card-title>
		              <span class="headline">{{ formTitle }}</span>
		            </v-card-title>
		            <v-card-text>
		              <v-container>
		              	<v-form
			              ref="form"
			              v-model="valid"
			            >
			                <v-row>
			                  <v-col
			                    cols="12"
			                    md="6"
			                  >
			                    <v-text-field
			                      v-model="editItem.site_id"
			                      :loading="loading"
			                      :rules="[rules.required]"
			                      hide-details="auto"
			                      class="mb-5"
			                      label="Site Id"
			                      required
			                    />
			                  </v-col>
			                  <v-col
			                    cols="12"
			                    md="6"
			                  >
			                    <v-text-field
			                      v-model="editItem.owner"
			                      :loading="loading"
			                      :rules="[rules.required, rules.email]"
			                      hide-details="auto"
			                      class="mb-5"
			                      placeholder="owner@email.com"
			                      label="Owner"
			                      required
			                    />
			                  </v-col>
			                  <v-col
			                    cols="12"
			                    md="6"
			                  >
			                    <v-text-field
			                      v-model="editItem.phone"
			                      :loading="loading"
			                      :rules="[rules.required]"
			                      hide-details="auto"
			                      class="mb-5"
			                      label="Phone"
			                      required
			                    />
			                  </v-col>
			                  <v-col
			                    cols="12"
			                    md="6"
			                  >
			                    <v-text-field
			                      v-model="editItem.location"
			                      :loading="loading"
			                      :rules="[rules.required]"
			                      hide-details="auto"
			                      class="mb-5"
			                      label="Location"
			                      required
			                    />
			                  </v-col>
			                  <v-col
			                    cols="12"
			                    md="6"
			                  >
			                    <v-text-field
			                      v-model="editItem.account_active"
			                      :loading="loading"
			                      :rules="[rules.required]"
			                      hide-details="auto"
			                      class="mb-5"
			                      label="Status"
			                      required
			                    />
			                  </v-col>
			                </v-row>
			            </v-form>
		                <v-card-actions>
		                  <v-spacer></v-spacer>
		                  <v-btn color="secondary" text @click="close">Cancel</v-btn>
		                  <v-btn color="primary" text @click="addFls">Save</v-btn>
		                </v-card-actions>
		              </v-container>
		            </v-card-text>
		          </v-card>
		        </v-dialog>
		    </v-card-title>
		  	<v-data-table
		        :loading="loading"
		        :headers="headers"
		        :items="items"
		        item-key="id"
		        class="custom-alert my-4"
		        hide-default-footer
		  	> 
		  		<template v-slot:item.action="{ item }">
		          <v-tooltip bottom>
		            <template v-slot:activator="{ on }">
		              <v-btn 
		                text 
		                icon 
		                v-on="on"
		                @click.stop="sendEmail(item)"
		              >
		                <v-icon>mdi-send</v-icon>
		              </v-btn>
		            </template>
		            <span>Send an Email</span>
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
  	import { Get, fetchAllUsers, creatFlsListing, updateFLSListing } from '../../../api'

  	export default {
	    name: 'Root',

	    data: () => ({
	      loading: false,
	      valid: true,
	      search: '',
	      snackbar: false,
	      snackColor: '',
	      snackText: '',
	      dialog: false,
	      dateMenu: false,
	      modal: false,
	      items: [],
	      members: [
	      	'admin',
	      	'bradcole'
	      ],
	      eventNames: [
	      	'BZW - Blizzard Warning',
	      	'CFA - Coastal Flood Watch',
	      	'CFW - Coastal Flood Warning',
	      	'DSW - Dust Storm Warning',
	      	'EWW - Extreme Wind Warning',
	      	'FFA - Flash Flood Watch'
	      ],
	      curItem: null,
	      headers: [
	      	{
	      		text: 'Site Id',
	      		value: 'site_id'
	      	},
	      	{
	      		text: 'Owner',
	      		value: 'owner'
	      	},
	      	{
	      		text: 'Phone',
	      		value: 'phone'
	      	},
	      	{
	      		text: 'Location',
	      		value: 'location'
	      	},
	      	{
	      		text: 'Status',
	      		value: 'account_active'
	      	},
	      	{
	      		text: 'Action',
	      		value: 'action',
	      		width: 100
	      	},
	      ],
	       	defaultIndex: -1,
      		editItem: {
      			connection_interval: 1
      		},
      		defaultItem: {

      		},
      		rules: {
	          required: value => {
	            return !!value || 'This field is required.'
	          },
	      	}
	    }),

	    mounted () {
	      this.items = fetchAllUsers()

	      this.fetchSites()
	    },

	    computed: {
	      formTitle () {
	        return this.defaultIndex === -1 ? 'Add Account' : 'Edit Account'
	      },
	    },

	    methods: {
	      	beautifyEmail,

	      	showSnack (res) {
		        if (res.data.status == 'Ok') {
		          this.snackText = 'Success'
		          this.snackColor = 'success'
		        } else {
		          this.snackText = 'Failed'
		          this.snackColor = 'warning'
		        }
		        this.snackbar = true
	      	},

		      close () {
		      	this.dialog = false
		      },

		      configureFLS (item) {
		      	this.$router.push({ path: `/root/configure/${item.fls_id}`})
		      },

	      	closeDialog () {
		      	this.dialog = false
		        setTimeout(() => {
		          this.defaultItem = Object.assign({}, this.defaultItem)
		          this.defaultIndex = -1
		        }, 300)
	      	},

	      	async fetchSites () {
	      		try{
	      			const res = await Get(`admin/all/sites`)
	      			console.log(res)
	      		} catch (e) {
	      			console.log(e.response)
	      		}
	      	},

	      	editFLS (item) {
	      	  	this.defaultIndex = this.items.indexOf(item)
		        this.editItem = Object.assign({}, item)
		        this.dialog = true
	      	},

	      	addFls () {
	      		this.$refs.form.validate()
	      		if (!this.valid) {
	      			return
	      		}
	      	 	const item = Object.assign({}, this.editItem)
		        let res = {
		        	data: {
		        		status: 'Ok' 
		        	}
		        }
		        if (this.defaultIndex > -1) {
		          	updateFLSListing(item)
	            	Object.assign(this.items[this.defaultIndex], item)
		        } else {
		          	creatFlsListing(item)
		            this.items.push(item)
		        }
		        this.closeDialog()

		        this.showSnack(res)
	      	},

	      	deleteFLS (item) {
		      	this.curItem = item
		      	this.modal = true
	      	},

	      	_delete() {
		      	this.items = this.items.filter(item => item.id != this.curItem.id)
		      	this.modal = false
	      	},

	      	sendEmail () {
	      		
	      	}
	  	}
	}
</script>