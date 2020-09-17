<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
    class="min-vh"
  >
    <div class="d-flex align-end justify-space-between">
      <clock />
      <weather />
    </div>
    <v-card
      icon="mdi-account-multiple"
      title="Control Panel"
      class="px-5 py-3"
    >
      <v-card-title>
        Control Panel
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          class="mb-3"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="controllers"
        item-key="controller_id"
        :items-per-page="5"
        :search="search"
        class="custom-alert"
        color="secondary"
      >
        <template v-slot:loading="{ item }">
          <v-progress-linear
            indeterminate
            color="yellow darken-2"
          ></v-progress-linear>
        </template>
        <template v-slot:header.link_status="{ header }">
          <div>
            <div class="mb-2">{{header.text}}</div>
            <v-icon color="red darken-2">mdi-radio-tower</v-icon>
          </div>
        </template>
        <template v-slot:item.owner="{ item }">
          <span v-html="beautifyEmail(item.owner)"></span>
        </template>
        <template v-slot:item.location="{ item }">
          <span>{{ item.city}}, {{item.state}}</span>
        </template>
        <template v-slot:item.history="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                icon 
                v-on="on"
                @click.stop="showHistory(item)"
              >
                <v-icon large >mdi-history</v-icon>
              </v-btn>
            </template>
            <span>Show History</span>
          </v-tooltip>
        </template>
        <template v-slot:item.open_valve="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                icon 
                v-on="on"
                :disabled="disabledControl(item, 'opened')"
                @click.stop="openValve(item)"
              >
                <v-icon large color="success">mdi-lock-open-variant-outline</v-icon>
              </v-btn>
            </template>
            <span>Open Valve</span>
          </v-tooltip>
        </template>
        <template v-slot:item.partial_open_valve="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                icon 
                v-on="on"
                :disabled="disabledControl(item, 'partial_opened')"
                @click.stop="partialOpenValve(item)"
              >
                <v-icon large color="yellow darken-4">mdi-lock-open-outline</v-icon>
              </v-btn>
            </template>
            <span>Partial Open Valve</span>
          </v-tooltip>
        </template>
        <template v-slot:item.close_valve="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                icon 
                v-on="on"
                :disabled="disabledControl(item, 'closed')"
                @click.stop="closeValve(item)"
              >
                <v-icon large color="red darken-4">mdi-lock-outline</v-icon>
              </v-btn>
            </template>
            <span>Close Valve</span>
          </v-tooltip>
        </template>

        <template v-slot:item.valve_status="{ item }">
          <v-chip label outlined :color="valveStatusColor(item.valve_status)" dark>
            <div class="subtitle-2">{{ toUpper(item.valve_status) }}</div>
          </v-chip>
        </template>

        <template v-slot:item.link_status="{ item }">
          <v-chip label outlined :color="linkStatusColor(item.link_status)" dark>
            <div class="subtitle-2">{{ toUpper(item.link_status || 'off') }}</div>
          </v-chip>
        </template>

        <template v-slot:item.error="{ item }">
          <v-chip label outlined :color="errorStatusColor(item.error)" dark>
            <div class="subtitle-2">{{ toUpper(item.error) }}</div>
          </v-chip>
        </template>
      </v-data-table>
    </v-card>

    <!-- History Dialog -->
    <v-dialog
      v-model='historyDialog'
    >
      <v-card>
        <div class="font-weight-medium display-1 d-flex justify-space-between align-center ml-6 mr-2 pt-5">
          <div>History - {{ curControllerId }}</div>
          <v-btn text icon @click="historyDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <div class="ma-2">
          <v-row class="ma-2">
            <v-col  cols="12" md="8">
              <v-text-field
                v-model="historySearch"
                append-icon="mdi-magnify"
                label="Search"
                class="mb-3"
                single-line
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3" sm="8">
              <v-dialog
                ref="menu"
                v-model="menu"
                :return-value.sync="selectedDates"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="computedDateFormatted"
                    label="Select Date Range"
                    readonly
                    v-on="on"
                  >
                    <v-icon slot="prepend" @click="menu = true">mdi-calendar</v-icon>
                    <v-icon slot="append"  @click="refreshHistory()">mdi-refresh</v-icon>
                  </v-text-field>
                </template>
                  <v-date-picker v-model="selectedDates" range scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="secondary" @click="menu = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="filterRange(selectedDates)">OK</v-btn>
                  </v-date-picker>
              </v-dialog>
            </v-col>
          </v-row>
          <v-data-table
            :loading="loadingHistory"
            :headers="historyHeaders"
            :items="historyControllers"
            item-key="_id"
            class="mx-3 custom-alert"
            :items-per-page="5"
            :search="historySearch"
          >
            <template v-slot:item.valve_status="{ item }">
              <v-chip label outlined :color="valveStatusColor(item.valve_status)" dark>
                <div class="subtitle-2">{{ toUpper(item.valve_status) }}</div>
              </v-chip>
            </template>

            <template v-slot:item.error="{ item }">
              <v-chip label outlined :color="errorStatusColor(item.error)" dark>
                <div class="subtitle-2">{{ toUpper(item.error) }}</div>
              </v-chip>
            </template>
          </v-data-table>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import { beautifyEmail } from '../../util'
  import { fetchAllControllers, fetchSiteHistory, updateController, updateControllerValve } from '../../api'
  import { mapState } from 'vuex'
  import { toUpper, toLower } from 'lodash'

  export default {
    name: 'DashboardDashboard',

    data () {
      return {
        loading: true,
        loadingHistory: false,
        menu: false,
        search: '',
        historySearch: '',
        historyDialog: false,
        snackbar: false,
        snackColor: '',
        snackText: '',
        shadowing: false,
        headers: [
          {
            text: 'Location',
            value: 'location',
            align: 'center',
            width: 110
          },
          // {
          //   text: 'Description',
          //   value: 'desc',
          //   align: 'center',
          //   width: 130
          // },
          {
            text: 'Type',
            value: 'type',
            align: 'center',
            width: 90
          },
          {
            text: 'Valve Status',
            value: 'valve_status',
            align: 'center',
            width: 90
          },
          {
            text: 'Open Valve',
            value: 'open_valve',
            align: 'center',
            sortable: false,
            width: 90
          },
          {
            text: 'Partial Open Valve',
            value: 'partial_open_valve',
            align: 'center',
            sortable: false,
            width: 120
          },
          {
            text: 'Close Valve',
            value: 'close_valve',
            align: 'center',
            sortable: false,
            width: 90
          },
          {
            text: 'NWS Valve Open Time (min)',
            value: 'open_duration',
            align: 'center',
            width: 150
          },
          {
            text: 'Battery Voltage',
            value: 'battery_voltage',
            align: 'center',
            width: 100
          },
          {
            text: 'NWS Reception',
            value: 'nws_reception',
            align: 'center',
            width: 120
          },
          // {
          //   text: 'NWS Signal Frequency',
          //   value: 'nws_signal',
          //   align: 'center',
          //   width: 130
          // },
          {
            text: 'Connection Inverval (min)',
            value: 'interval',
            align: 'center',
            width: 140
          },
          // {
          //   text: 'Error',
          //   value: 'error_status',
          //   align: 'center',
          //   width: 80
          // },
          {
            text: 'Most Recent Connection',
            value: 'most_recent_connection',
            align: 'center',
            width: 110
          },
          {
            text: 'Current Water Elevation',
            value: 'water_elevation',
            align: 'center',
            width: 110
          },
          {
            text: 'Minimum Water Elevation',
            value: 'minimum_elevation',
            align: 'center',
            width: 110
          },
          {
            text: 'Link Status',
            value: 'link_status',
            align: 'center',
            width: 110
          },
          {
            text: 'History',
            value: 'history',
            align: 'center',
            sortable: false
          },
        ],
        historyHeaders: [
          {
            text: 'Date & Time',
            value: 'datetime',
            align: 'center',
          },
          {
            text: 'Valve Status',
            value: 'valve_status',
            align: 'center',
            width: 150
          },
          {
            text: 'Battery Voltage',
            value: 'battery_voltage',
            align: 'center',
            width: 170
          },
          {
            text: 'NWS Reception',
            value: 'nws_reception',
            align: 'center',
            width: 170
          },
          {
            text: 'NWS Frequency',
            value: 'nws_frequency',
            align: 'center',
            width: 170
          },
          {
            text: 'Water Level Reading',
            value: 'water_level_reading',
            align: 'center',
            width: 220
          },
          // {
          //   text: 'Reason Code',
          //   value: 'reason',
          //   align: 'center',
          //   width: 250
          // },
          // {
          //   text: 'Error',
          //   value: 'error',
          //   align: 'center',
          //   width: 120
          // },
        ],
        controllers: [],
        historyControllers: [],
        selectedDates: [],
        curControllerId: {}
      }
    },

    components: {
      Weather: () => import('./component/Weather'),
      Clock: () => import('./component/Clock'),
    },

    computed: {
      // ...mapState(['siteId']),
      computedDateFormatted () {
      if (this.selectedDates.length) {
        return this.selectedDates[0] + ' ~ ' + this.selectedDates[1]
      } else {
        return ''
      }
      }
    },

    async mounted () {
      this.fetchSiteControllers()
    },

    methods: {
      beautifyEmail,
      toUpper,
      toLower,

      disabledControl (item, status) {
        return item.valve_status == status
      },

      valveStatusColor (valve_status) {
        valve_status = toLower(valve_status)
        if (valve_status == 'opened') {
          return 'success'
        } else if (valve_status == 'closed') {
          return 'red darken-3'
        } else {
          return 'yellow darken-4'
        }
      },

      linkStatusColor (link_status) {
        link_status = toLower(link_status)
        if (link_status == 'connected') {
          return 'success'
        } else if (link_status == 'off'){
          return 'red darken-3'
        } else {
          return 'yellow darken-4'
        }
      },

      errorStatusColor (error) {
        error = toLower(error)
        if (error == 'good') {
          return 'success'
        } else {
          return 'red darken-3'
        } 
      },

      async fetchSiteControllers () {
        this.loading = "secondary"
        // const site_id = '203eebc5-973b-4bc3-b66f-5fc41f5da11a' 
        const res = await fetchAllControllers()
        this.snackText = res.message
        this.snackColor = res.status
        this.snack = true
        res.data.map(controller => {
          this.controllers.push({
            ...controller,
            owner: controller.owner,
            location: controller.city + ' ' +controller.state,
            type: controller.type
          })
        })
        this.loading = false
      },

      async showHistory (item) {
        const res = await fetchSiteHistory(item)
        this.snackText = res.message
        this.snackColor = res.status
        this.snack = true
        this.historyControllers = res.data
        this.historyDialog = true
        console.log(item)
        this.curControllerId = item.controller_id
      },

      async openValve (item) {
        this.loading = true
        const new_item = Object.assign({}, item)
        new_item.valve_status = 'opened'
        const res = await updateControllerValve(new_item)
        if (res.status == 'success') {
          item.valve_status = 'opened'
        }
        this.loading = false
      },

      async partialOpenValve (item) {
        this.loading = true
        const new_item = Object.assign({}, item)
        new_item.valve_status = 'partial_opened'
        const res = await updateControllerValve(new_item)
        if (res.status == 'success') {
          item.valve_status = 'partial_opened'
        }
        this.loading = false
      },

      async closeValve (item) {
        this.loading = true
        const new_item = Object.assign({}, item)
        new_item.valve_status = 'closed'
        const res = await updateControllerValve(new_item)
        if (res.status == 'success') {
          item.valve_status = 'closed'
        }
        this.loading = false
      },

      filterRange (date) {
        this.$refs.menu.save(date)
        const startDate = date[0]
        const endDate = date[1]
        const self = this
        this.historyControllers = this.controllers.filter(controller => self.$moment(controller.connected_at).isSameOrAfter(startDate) && self.$moment(controller.connected_at).isSameOrBefore(endDate)
        )
      },

      refreshHistory () {
        this.selectedDates = []
        this.historyControllers = this.controllers
      }
    },
  }
</script>

<style>
  .vue-emitting-analog-clock div {
    box-shadow: 1px 1px 5px 0px #000;
  }
</style>