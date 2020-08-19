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
              Command Set for FLs Id: {{ controller_id }}
              <v-spacer></v-spacer>
              <v-btn color="success" :loading="loading" :disable="loading" @click="getCommandsHistories">History</v-btn>
          </v-card-title> 

          <div class="mt-3">Latest Event</div>

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
          
          <template v-if="command && command !='Clear all event codes'" class="mt-2">
            <v-card outlined>
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
                                v-model="fips12.fips_1"
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
                                    v-model="fips12.fips_2"
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
                                    v-model="fips34.fips_3"
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
                                    v-model="fips34.fips_4"
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
                            v-model="event.code"
                            :items="events"
                            attach
                            chips
                            label="Event code"
                            @change="selectEvent"
                            return-object
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
          </template>
        </v-card>
      </v-col>
      <v-col cols="12" md="5">
        <v-card
          class="px-5 py-3"
        >
            
          <v-card-title>
            Configuration
            <v-spacer></v-spacer>
            <v-btn class="ml-3" color="success" :loading="loading" :disabled="loading" @click="updateConfig">Submit</v-btn>
            </v-card-title>

            <v-card-text>
              <template>
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
                            v-model="config.connection_period"
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
                          <v-select
                            v-model="config.web_chan"
                            :loading="loading"
                            :items="WBChannels"
                            :rules="[rules.required]"
                            hide-details="auto"
                            chips
                            class="mb-5"
                            label="WB Chan"
                            hint="Weather band receiver channel"
                            required
                          />
                        </v-col>
                        <v-col
                      cols="12"
                      md="6"
                        >
                          <v-text-field
                            type="number"
                            v-model="config.rssi_threshold"
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
          <div>History Commands</div>
          <v-btn text icon @click="historyDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-card-text>

          <v-tabs
            class="elevation-2 mt-4"
            color="white"
            light
            centered
            grow
            show-arrows
          >
            <v-tabs-slider class="blue darken-3"></v-tabs-slider>
          
            <v-tab
              v-for="(data, key) in historyData"
              :key="key"
              :href="`#${key}`"
              class="success"
            >
              {{ data }}
            </v-tab>

            <v-tab-item
              v-for="(result, key) in historyData"
              :key="key"
              :value="key"
            >
              <v-data-table
                :loading="loading"
                :headers="historyHeaders[key]"
                :items="commandsHistories[key]"
                item-key="id"
                class="custom-alert my-4"
                hide-default-footer
              > 
                <template v-slot:item.sent="item">
                  
                </template>
              </v-data-table>
            </v-tab-item>
          </v-tabs>
        </v-card-text>
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
    import { beautifyEmail, WBChannels } from '../../util'
    import { 
      clearCommands, 
      latestCommand, 
      submitCommand, 
      createEvent, 
      updateControllerConfig, 
      getCommandsHistories 
    } from '../../api'

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
        historyData: {
          events: "Events",
          fips: 'Fips',
          configs: 'Commands'
        },
        events: [
          {text: 'Costal Flood Watch', value: '1'},
          {text: 'Costal Flood Warning', value: '2'},
          {text: 'Flash Flood Watch', value: '3'},
          {text: 'Flash Flood Warning', value: '4'},
          {text: 'Flood Watch', value: '5'},
          {text: 'Flood Warning', value: '6'},
          {text: 'Hurricane Watch', value: '7'},
          {text: 'Hurricane Warning', value: '8'},
          {text: 'Severe Thunderstorm Watch', value: '9'},
          {text: 'Severe Thunderstorm Warning', value: '10'},
          {text: 'Storm Surge Watch', value: '12'},
          {text: 'Storm Surge Warning', value: '13'},
          {text: 'Tropical Storm Watch', value: '14'},
          {text: 'Tropical Storm Warning', value: '15'},
          {text: 'Lost NWS Signal', value: '16'},
          {text: 'FLS Open Valve', value: '17'},
          {text: 'FLS Partial Valve', value: '18'},
          {text: 'FLS CLose Valve', value: '19'},
          {text: 'Battery Low', value: '20'},
          {text: 'Battery High', value: '21'},
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
        controller_id: -1,
        headers: [],
        historyHeaders: {
          fips: [
            {
              text: 'Fips Code #1',
              value: 'fips_1',
              align: 'center'
            },
            {
              text: 'Fips Code #2',
              value: 'fips_2',
              align: 'center'
            },
            {
              text: 'Fips Code #3',
              value: 'fips_3',
              align: 'center'
            },
            {
              text: 'Fips Code #4',
              value: 'fips_4',
              align: 'center'
            },
            {
              text: 'Sent',
              value: 'sent',
              align: 'center'
            },
            {
              text: 'Status',
              value: 'status',
              align: 'center'
            }
          ],
          events: [
            {
              text: 'Id',
              value: 'command_id',
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
          ],
          configs: [
            {
              text: 'Connection Period',
              value: 'connection_period',
              align: 'center'
            },
            {
              text: 'Stuck Valve',
              value: 'stuck_valve',
              align: 'center'
            },
            {
              text: 'Web chan',
              value: 'web_chan',
              align: 'center'
            },
            {
              text: 'RSSI',
              value: 'rssi_threshold',
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
              text: 'Sent',
              value: 'sent',
              align: 'center'
            },
            {
              text: 'Status',
              value: 'status',
              align: 'center'
            }
          ],
        },
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
              value: 'command_id',
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

      computed: {
        WBChannels() {
          return WBChannels()
        }
      },

      mounted() {
        this.controller_id = this.$router.history.current.params.id
        this.getLatestCommand()
        for (var i = 0.1; i < 51.2; i +=0.1) {
          this.BatOvs.push(i.toFixed(2))
        }
        this.BatUvs = this.BatOvs
      },

      methods: {
        showSnack (res) {
          this.snackText = res.message
          this.snackColor = res.status
          this.snackbar = true
        },

        selectEvent () {
          this.event.command_id = this.event.code.value
          this.event.event_code = this.event.code.text
        },

        async getCommandsHistories () {
          this.commandsHistories = await getCommandsHistories(this.controller_id)
          this.historyDialog = true
        },

        async getLatestCommand () {
          this.headers = this.defaultHeaders['event_code']
          try {
              const res = await latestCommand(this.controller_id)
              if (res.status == 'success' && res.data.length) {
                this.items = [res.data[res.data.length-1]]
              }
          } catch (e) { console.log(e)}
        },

        updateConfig() {
          this.command = 'Set configuration'
          this.submit()
        },

        submit () {
          const self = this
          this.$dialog.confirm({
            text: 'Are you sure?',
            title: 'Warning',
            actions: {
              false: 'No',
              true: {
                color: 'red',
                text: 'Yes',
                handle: () => {
                  self._submit()
                }
              }
            }
          })  
        },

        async _submit () {
          this.loading = true
          let res
          if (this.command == 'Set configuration') {
            this.$refs.confForm.validate()
            if (this.confValid) {
              res = await updateControllerConfig({
                controller_id: this.controller_id,
                ...this.config
              })
            }
          } else if (this.command == 'Clear all event codes') {
            res = await clearCommands(this.controller_id)
          } else if (this.command == 'Set Fips 1 & 2') {
            this.$refs.fips12Form.validate()
            if (this.fips12Valid) {
              try {
                res = await submitCommand({
                  controller_id: this.controller_id,
                  ...this.fips12
                })
              } catch (e) { console.log(e)}
            }
          } else if (this.command == 'Set Fips 3 & 4') {
            this.$refs.fips34Form.validate()
            if (this.fips34Valid) {
              try {
                res = await submitCommand({
                  controller_id: this.controller_id,
                  ...this.fips34
                })
              } catch (e) { console.log(e)}
            }
          } else if (this.command == 'Set Event code') {
            this.$refs.eventCodeForm.validate()
            if (this.eventCodeValid) {
              try {
                res = await createEvent({
                  controller_id: this.controller_id,
                  ...this.event
                })
              } catch (e) { console.log(e)}
            }
            this.getLatestCommand()
          }

          this.loading = false
          this.showSnack(res)
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