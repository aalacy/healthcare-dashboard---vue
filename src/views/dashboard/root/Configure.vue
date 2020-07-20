<template>
	<v-container
	    id="dashboard"
	    fluid
	    tag="section"
	    class="min-vh"
	  >
	  	<v-row>
	  		<v-col cols="12" md="7">
				<v-card
					class="px-5 py-3"
				>
					<v-card-title>
				        Command Set for FLs Id: {{ fls_id }}
				        <v-spacer></v-spacer>
				        <v-btn color="success" :loading="loading" :disable="loading" @click="getCommandsHistories">History</v-btn>
				    </v-card-title>
				    <v-data-table
				        :loading="loading"
				        :headers="headers"
				        :items="items"
				        item-key="id"
				        class="custom-alert my-4"
				        hide-default-footer
			      	> 
			      	</v-data-table>
					
					<v-row
						class="align-center"
					>
						<v-col
							cols="12"
							md="4"
						>
					      	<v-select
				          		:loading="loading"
					            v-model="command"
					            :items="commands"
					            attach
					            chips
					            label="Select a command"
					            required
				          	></v-select>
			          	</v-col>
						<v-btn class="ml-3" color="success" :loading="loading" :disabled="loading || !command" @click="submit">Submit</v-btn>
			      	</v-row>

			      	<v-card v-if="command && command !='Clear all event codes'" class="mt-2" outlined>
			      		<v-card-text>
							<template v-if="command=='Set Fips 1 & 2'">
								<v-form
					              ref="fips12Form"
					              v-model="fips12Valid"
					            >
									<v-row>
				      					<v-col
											cols="12"
											md="6"
				      					>
				      						<v-text-field
				      							type="number"
						                      v-model="fips12.code_1"
						                      :loading="loading"
						                      :rules="[rules.required, rules.number]"
						                      hide-details="auto"
						                      class="mb-5"
						                      label="FIPS Code #1"
						                      hint="Min 0, Max 999999"
						                      required
						                    />
				      					</v-col>
				      					<v-col
											cols="12"
											md="6"
				      					>
				      						<v-text-field
				      							type="number"
						                      v-model="fips12.code_2"
						                      :loading="loading"
						                      :rules="[rules.required, rules.number]"
						                      hide-details="auto"
						                      class="mb-5"
						                      label="FIPS Code #2"
						                      hint="Min 0, Max 999999"
						                      required
						                    />
				      					</v-col>
				      				</v-row>
				      			</v-form>
							</template>
							<template v-if="command=='Set Fips 3 & 4'">
								<v-form
					              ref="fips34Form"
					              v-model="fips34Valid"
					            >
									<v-row>
				      					<v-col
											cols="12"
											md="6"
				      					>
				      						<v-text-field
				      							type="number"
						                      v-model="fips34.code_3"
						                      :loading="loading"
						                      :rules="[rules.required, rules.number]"
						                      hide-details="auto"
						                      class="mb-5"
						                      label="FIPS Code #3"
						                      hint="Min 0, Max 999999"
						                      required
						                    />
				      					</v-col>
				      					<v-col
											cols="12"
											md="6"
				      					>
				      						<v-text-field
				      							type="number"
						                      v-model="fips34.code_4"
						                      :loading="loading"
						                      :rules="[rules.required, rules.number]"
						                      hide-details="auto"
						                      class="mb-5"
						                      label="FIPS Code #4"
						                      hint="Min 0, Max 999999"
						                      required
						                    />
				      					</v-col>
				      				</v-row>
				      			</v-form>
							</template>
							<template v-if="command=='Set Event code'">
								<v-form
					              ref="eventCodeForm"
					              v-model="eventCodeValid"
					            >
					            	<v-row>
					            		<v-col
											cols="12"
											md="6"
										>
									      	<v-select
									            v-model="event.event_code"
									            :items="events"
									            attach
									            chips
									            label="Event code"
									            required
								          	></v-select>
							          	</v-col>
							          	<v-col
											cols="12"
											md="6"
										>
									      	<v-select
									            v-model="event.action"
									            :items="actions"
									            attach
									            chips
									            label="Action"
									            required
								          	></v-select>
							          	</v-col>
							          	<v-col
											cols="12"
											md="6"
				      					>
				      						<v-text-field
				      							type="number"
						                      v-model="event.timeout"
						                      :loading="loading"
						                      :rules="[rules.required, rules.number]"
						                      hide-details="auto"
						                      class="mb-5"
						                      label="Timeout"
						                      hint="Delay in 5 min increments"
						                      required
						                    />
				      					</v-col>
				      					<v-col
											cols="12"
											md="6"
										>
									      	<v-select
									            v-model="event.relays"
									            :items="relays"
									            attach
									            chips
									            label="Relays"
									            required
								          	></v-select>
							          	</v-col>
						          	</v-row>
								</v-form>
							</template>
			      		</v-card-text>
			      	</v-card>
				</v-card>
			</v-col>
			<v-col cols="12" md="5">
				<v-card
					class="px-5 py-3"
				>
					<v-card-title>
				        Configuration
				        <v-spacer></v-spacer>
				        <v-btn class="ml-3" color="success" :loading="loading" :disabled="loading" @click="submit">Submit</v-btn>
				    </v-card-title>

				    <v-card-text>
			      			<template >
			      				<v-form
					              ref="confForm"
					              v-model="confValid"
					            >
				      				<v-row>
				      					<v-col
											cols="12"
											md="6"
				      					>
				      						<v-text-field
				      							type="number"
						                      v-model="config.conn_period"
						                      :loading="loading"
						                      :rules="[rules.required, rules.number]"
						                      hide-details="auto"
						                      class="mb-5"
						                      label="Connection Period"
						                      hint="Time between status packets sent to web site in minutes (min 1, max 255)"
						                      required
						                    />
				      					</v-col>
				      					<v-col
											cols="12"
											md="6"
				      					>
				      						<v-text-field
				      							type="number"
						                      v-model="config.stuck_valve"
						                      :loading="loading"
						                      :rules="[rules.required, rules.number]"
						                      hide-details="auto"
						                      class="mb-5"
						                      label="Stuck Valve"
						                      hint="Time to transition (open-to-closed or closed-to-open) in seconds (min 1, max 255)"
						                      required
						                    />
				      					</v-col>
				      					<v-col
											cols="12"
											md="6"
				      					>
				      						<v-text-field
				      							type="number"
						                      v-model="config.WB_chan"
						                      :loading="loading"
						                      :rules="[rules.required, rules.chan]"
						                      hide-details="auto"
						                      class="mb-5"
						                      label="WB Chan"
						                      hint="Weather band receiver (min 1, max 7)"
						                      required
						                    />
				      					</v-col>
				      					<v-col
											cols="12"
											md="6"
				      					>
				      						<v-text-field
				      							type="number"
						                      v-model="config.RSSI"
						                      :loading="loading"
						                      :rules="[rules.required, rules.number]"
						                      hide-details="auto"
						                      class="mb-5"
						                      label="RSSI"
						                      hint="Threshold to report low signal in dB (min 1, max 255)"
						                      required
						                    />
				      					</v-col>
				      					<v-col
						                    cols="12"
						                    md="6"
					                  	>
						                  	<v-select
						                  		:loading="loading"
									            v-model="config.bat_ov"
									            :items="BatOvs"
									            :rules="[rules.required]"
									            attach
									            chips
									            label="Bat OV"
									            hint="Battery OverVoltage threshold, Represents 0.1V to 51.1V in 1/10V increments (min 0.1, max 51.1)"
									            persistent-hint
									            required
								          	></v-select>
					                  	</v-col>
					                  	<v-col
						                    cols="12"
						                    md="6"
					                  	>
						                  	<v-select
						                  		:loading="loading"
									            v-model="config.bat_uv"
									            :items="BatUvs"
									            :rules="[rules.required]"
									            attach
									            chips
									            label="Bat UV"
									            hint="Battery UnderVoltage threshold, Represents 0.1V to 51.1V in 1/10V increments (min 0.1, max 51.1)"
									            persistent-hint
									            required
								          	></v-select>
					                  	</v-col>
				      				</v-row>
				      			</v-form>
			      			</template>
			      		</v-card-text>

				</v-card>
			</v-col>
		</v-row>

		<v-dialog v-model="historyDialog">
			<v-card>
				<div class="font-weight-medium display-1 d-flex justify-space-between align-center ml-6 mr-2 pt-5">
		          <div>History Commands ({{ commandsHistories.length }})</div>
		          <v-btn text icon @click="historyDialog = false">
		            <v-icon>mdi-close</v-icon>
		          </v-btn>
		        </div>
				<!-- <v-card-text> -->
					<v-list class="history-list">
				      	<v-list-item-group>
					        <v-list-item
					        	v-for="(item, i) in commandsHistories"
		          				:key="i"
					        >
					        	<v-list-item-content
									v-if="item.type == 'fips12'"
					        	>
					        	
			        				<v-row>
			        					<v-col
					        				cols="auto"
					        			>
					        				<v-chip>{{i + 1}}</v-chip>
						        		</v-col>
						                <v-col
						                  cols="auto"
						                >
							        		<b class="display-1">Fips Code #1</b>
				                    		<div class="text--secondary">{{item.code_1}}</div>
				                    	</v-col>
				                    	<v-col
						                  cols="auto"
						                >
							        		<b class="display-1">Fips Code #2</b>
				                    		<div class="text--secondary">{{item.code_2}}</div>
				                    	</v-col>
				                    	<v-col
						                  cols="auto"
						                >
							        		<b class="display-1">Command Sent On</b>
				                    		<div class="text--secondary">{{item.sent_on}}</div>
				                    	</v-col>
				                    	<v-col
						                  cols="auto"
						                >
							        		<b class="display-1">Command Received On</b>
				                    		<div class="text--secondary">{{item.received_on}}</div>
				                    	</v-col>
				                    	<v-col
						                  cols="auto"
						                >
							        		<b class="display-1">Command Status</b>
				                    		<div class="text--secondary">{{item.status}}</div>
				                    	</v-col>
				                    </v-row>
					        	</v-list-item-content>
					        	<v-list-item-content
									v-if="item.type == 'fips34'"
					        	>
			        				<v-row>
			        					<v-col
					        				cols="auto"
					        			>
					        				<v-chip>{{i + 1}}</v-chip>
						        		</v-col>
						                <v-col
						                  cols="auto"
						                >
							        		<b class="display-1">Fips Code #3</b>
				                    		<div class="text--secondary">{{item.code_3}}</div>
				                    	</v-col>
				                    	<v-col
						                  cols="auto"
						                >
							        		<b class="display-1">Fips Code #4</b>
				                    		<div class="text--secondary">{{item.code_4}}</div>
				                    	</v-col>
				                    	<v-col
						                  cols="auto"
						                >
							        		<b class="display-1">Command Sent On</b>
				                    		<div class="text--secondary">{{item.sent_on}}</div>
				                    	</v-col>
				                    	<v-col
						                  cols="auto"
						                >
							        		<b class="display-1">Command Received On</b>
				                    		<div class="text--secondary">{{item.received_on}}</div>
				                    	</v-col>
				                    	<v-col
						                  cols="auto"
						                >
							        		<b class="display-1">Command Status</b>
				                    		<div class="text--secondary">{{item.status}}</div>
				                    	</v-col>
				                    </v-row>
					        	</v-list-item-content>
					        	<v-list-item-content
									v-if="item.type == 'maintain'"
					        	>
			        				<v-row>
			        					<v-col
					        				cols="auto"
					        			>
					        				<v-chip>{{i + 1}}</v-chip>
						        		</v-col>
						                <v-col
						                  cols="auto"
						                >
							        		<b class="display-1">Maintain Connection</b>
				                    		<div class="text--secondary">{{item.maintain_connection}}</div>
				                    	</v-col>
				                    	<v-col
						                  cols="auto"
						                >
							        		<b class="display-1">Command Sent On</b>
				                    		<div class="text--secondary">{{item.sent_on}}</div>
				                    	</v-col>
				                    	<v-col
						                  cols="auto"
						                >
							        		<b class="display-1">Command Received On</b>
				                    		<div class="text--secondary">{{item.received_on}}</div>
				                    	</v-col>
				                    	<v-col
						                  cols="auto"
						                >
							        		<b class="display-1">Command Status</b>
				                    		<div class="text--secondary">{{item.status}}</div>
				                    	</v-col>
				                    </v-row>
					        	</v-list-item-content>
					        	
					        	<v-list-item-content
									v-if="item.type == 'event_code'"
					        	>
			        				<v-row>
			        					<v-col
					        				cols="auto"
					        			>
					        				<v-chip>{{i + 1}}</v-chip>
						        		</v-col>
						                <v-col
						                  cols="auto"
						                >
							        		<b class="display-1">Event Code</b>
				                    		<div class="text--secondary">{{item.event_code}}</div>
				                    	</v-col>
				                    	<v-col
						                  cols="auto"
						                >
							        		<b class="display-1">Action</b>
				                    		<div class="text--secondary">{{item.action}}</div>
				                    	</v-col>
				                    	<v-col
						                  cols="auto"
						                >
							        		<b class="display-1">Timeouts</b>
				                    		<div class="text--secondary">{{item.timeout}}</div>
				                    	</v-col>
				                    	<v-col
						                  cols="auto"
						                >
							        		<b class="display-1">Relays</b>
				                    		<div class="text--secondary">{{item.relays}}</div>
				                    	</v-col>
				                    	<v-col
						                  cols="auto"
						                >
							        		<b class="display-1">Command Sent On</b>
				                    		<div class="text--secondary">{{item.sent_on}}</div>
				                    	</v-col>
				                    	<v-col
						                  cols="auto"
						                >
							        		<b class="display-1">Command Received On</b>
				                    		<div class="text--secondary">{{item.received_on}}</div>
				                    	</v-col>
				                    	<v-col
						                  cols="auto"
						                >
							        		<b class="display-1">Command Status</b>
				                    		<div class="text--secondary">{{item.status}}</div>
				                    	</v-col>
				                    </v-row>
					        	</v-list-item-content>
						    </v-list-item>
						</v-list-item-group>
					</v-list>
				<!-- </v-card-text> -->
			</v-card>
		</v-dialog>

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
  	import { Get, latestCommand, submitCommand, getCommandsHistories } from '../../../api'

  	export default {
	    name: 'Configure',

	    data: () => ({
	      loading: false,
	      search: '',
	      snackbar: false,
	      snackColor: '',
	      snackText: '',
	      items: [],
	      commandsHistories: [],
	      BatOvs: [],
	      BatUvs: [],
	      events: [
	      	'BZW - Blizzard Warning',
	      	'CFA - Coastal Flood Watch',
	      	'CFW - Coastal Flood Warning',
	      	'DSW - Dust Storm Warning'
	      ],
	      actions: [
	      	'No Action',
	      	'Notify',
	      	'Notify and Energize Relay',
	      	'Notify and Deenergize Relay',
	      	'RWT',
	      ],
	      relays: [
	      	'None',
	      	'Relay 1 only',
	      	'Relay 2 only',
	      	'Both Relays 1 & 2',
	      ],
	      command: '',
	      commands: [
	      	'Clear all event codes',
	      	'Set Fips 1 & 2',
	      	'Set Fips 3 & 4',
	      	'Set Event code'
	      ],
	      dialog: false,
	      historyDialog: false,
	      modal: false,
	      fls_id: -1,
	      headers: [],
	      defaultHeaders : {
		      maintain: [
		      	{
		      		text: 'Id',
		      		value: 'id',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Maintain Connection',
		      		value: 'maintain_connection',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Sent On',
		      		value: 'sent_on',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Received On',
		      		value: 'received_on',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Status',
		      		value: 'status',
		      		align: 'center'
		      	}
		      ],
		      event_code: [
		      	{
		      		text: 'Id',
		      		value: 'id',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Event Code',
		      		value: 'event_code',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Action',
		      		value: 'action',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Timeout',
		      		value: 'timeout',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Relays',
		      		value: 'relays',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Sent On',
		      		value: 'sent_on',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Received On',
		      		value: 'received_on',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Status',
		      		value: 'status',
		      		align: 'center'
		      	}
		      ],
	       	  fips12: [
		      	{
		      		text: 'Id',
		      		value: 'id',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Fips Code #1',
		      		value: 'code_1',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Fips Code #2',
		      		value: 'code_2',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Sent On',
		      		value: 'sent_on',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Received On',
		      		value: 'received_on',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Status',
		      		value: 'status',
		      		align: 'center'
		      	}
		      ],
		      fips34: [
		      	{
		      		text: 'Id',
		      		value: 'id',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Fips Code #3',
		      		value: 'code_3',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Fips Code #4',
		      		value: 'code_4',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Sent On',
		      		value: 'sent_on',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Received On',
		      		value: 'received_on',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Status',
		      		value: 'status',
		      		align: 'center'
		      	}
		      ],
		      config: [
		      	{
		      		text: 'Id',
		      		value: 'id',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Connection Period',
		      		value: 'conn_period',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Stuck Valve',
		      		value: 'stuck_valve',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Web chan',
		      		value: 'WB_chan',
		      		align: 'center'
		      	},
		      	{
		      		text: 'RSSI',
		      		value: 'RSSI',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Bat OV',
		      		value: 'bat_ov',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Bat UV',
		      		value: 'bat_uv',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Sent On',
		      		value: 'sent_on',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Received On',
		      		value: 'received_on',
		      		align: 'center'
		      	},
		      	{
		      		text: 'Status',
		      		value: 'status',
		      		align: 'center'
		      	}
		      ],
		  },
	      rules: {
	          required: value => {
	            return !!value || 'This field is required.'
	          },
	          number: value => {
	          	return (value > 0 && value < 255) || 'Please input value between 1 and 255'
	          },
	          chan: value => {
	          	return (value > 0 && value < 7) || 'Please input value between 1 and 255'
	          }
	      	},
	      	config: {},
	      	fips12: {},
	      	fips34: {},
	      	event: {},
	      	confValid: true,
	      	fips12Valid: true,
	      	fips34Valid: true,
	      	eventCodeValid: true,
	    }),

	    mounted() {
	    	this.fls_id = this.$router.history.current.params.id
	    	this.getLatestCommand()
	    	for (var i = 0.1; i < 51.2; i +=0.1) {
	    		this.BatOvs.push(i.toFixed(2))
	    	}
	    	this.BatUvs = this.BatOvs
	    },

	    methods: {
	    	getCommandsHistories () {
	    		this.commandsHistories = getCommandsHistories(this.fls_id)
	    		this.historyDialog = true
	    	},

	    	getLatestCommand () {
	    		this.items = latestCommand(this.fls_id)
		    	this.headers = this.defaultHeaders[this.items[0].type]
		    },

	    	submit () {
	    		if (this.command == 'Set configuration') {
	    			this.$refs.confForm.validate()
	    			if (this.confValid) {
	    				submitCommand({
	    					fls_id: this.fls_id,
	    					type: 'config',
	    					...this.config
	    				})
	    			}
	    		} else if (this.command == 'Clear all event codes') {

	    			return
	    		} else if (this.command == 'Set Fips 1 & 2') {
	    			this.$refs.fips12Form.validate()
	    			if (this.fips12Valid) {
	    				submitCommand({
	    					fls_id: this.fls_id,
	    					type: 'fips12',
	    					...this.fips12
	    				})
	    			}
	    		} else if (this.command == 'Set Fips 3 & 4') {
	    			this.$refs.fips34Form.validate()
	    			if (this.fips34Valid) {
	    				submitCommand({
	    					fls_id: this.fls_id,
	    					type: 'fips34',
	    					...this.fips34
	    				})
	    			}
	    		} else if (this.command == 'Set Event code') {
	    			this.$refs.eventCodeForm.validate()
	    			if (this.eventCodeValid) {
	    				submitCommand({
	    					fls_id: this.fls_id,
	    					type: 'event_code',
	    					...this.event
	    				})
	    			}
	    		}

	    		this.getLatestCommand()
	    	}
	    }
	}
</script>

<style>
	.v-list-item:nth-of-type(odd) {
	 	background: rgba(0, 0, 0, .05);
	}

	.history-list b {
		color: #0c2c52;
	}
</style>