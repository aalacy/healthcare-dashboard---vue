<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
    class="min-vh"
  >
    <v-row no-gutters>
      <v-col cols="auto" class="mr-auto">
        <weather />
      </v-col>
      <v-col cols="auto" class="ml-auto mt-10 hidden-md-and-down">
        <clock />
      </v-col>
    </v-row>
    <v-card
      icon="mdi-account-multiple"
      title="Owners"
      class="px-5 py-3"
    >
      <v-card-title>
        Control Panel
      </v-card-title>
      <v-card-title>
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
        :items="valves"
        item-key="valve_id"
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
        <template v-slot:item.open_value="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                icon 
                v-on="on"
                @click.stop="openValve(item)"
              >
                <v-icon large color="success">mdi-lock-open-variant-outline</v-icon>
              </v-btn>
            </template>
            <span>Open Valve</span>
          </v-tooltip>
        </template>
        <template v-slot:item.partial_open_value="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                icon 
                v-on="on"
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
                @click.stop="closeValve(item)"
              >
                <v-icon large color="red darken-4">mdi-lock-outline</v-icon>
              </v-btn>
            </template>
            <span>Close Valve</span>
          </v-tooltip>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip label outlined :color="valveStatusColor(item.status)" dark>
            <div class="subtitle-2">{{ item.status.toUpperCase() }}</div>
          </v-chip>
        </template>

      <!--   <template v-slot:item.link_status="{ item }">
          <v-chip label outlined :color="linkStatusColor(item.link_status)" dark>
            <div class="subtitle-2">{{ item.link_status.toUpperCase() }}</div>
          </v-chip>
        </template> -->

        <template v-slot:item.error="{ item }">
          <v-chip label outlined :color="errorStatusColor(item.error)" dark>
            <div class="subtitle-2">{{ item.error.toUpperCase() }}</div>
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
          <div>History Listing - FLSID ({{ historyValves.length }})</div>
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
            :items="historyValves"
            item-key="_id"
            class="mx-3 custom-alert"
            :items-per-page="5"
            :search="historySearch"
          >
            <template v-slot:item.valve_status="{ item }">
              <v-chip label outlined :color="valveStatusColor(item.valve_status)" dark>
                <div class="subtitle-2">{{ item.valve_status.toUpperCase() }}</div>
              </v-chip>
            </template>

            <template v-slot:item.error="{ item }">
              <v-chip label outlined :color="errorStatusColor(item.error)" dark>
                <div class="subtitle-2">{{ item.error.toUpperCase() }}</div>
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
  import { Post } from '../../api'
  import EmittingAnalogClock from 'vue-emitting-analog-clock';

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
          // {
          //   text: 'Customer Name',
          //   value: 'owner',
          //   align: 'center'
          // },
          {
            text: 'Location',
            value: 'location',
            align: 'center',
            width: 110
          },
          {
            text: 'Description',
            value: 'desc',
            align: 'center',
            width: 130
          },
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
            value: 'open_value',
            align: 'center',
            sortable: false,
            width: 90
          },
          {
            text: 'Patial Open Valve',
            value: 'partial_open_value',
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
          {
            text: 'NWS Signal Frequency',
            value: 'nws_signal',
            align: 'center',
            width: 130
          },
          {
            text: 'Connection Inverval (min)',
            value: 'interval',
            align: 'center',
            width: 140
          },
          // {
          //   text: 'Most Recent Connection',
          //   value: 'date',
          //   align: 'center',
          //   width: 130
          // },
          {
            text: 'Error',
            value: 'error_status',
            align: 'center',
            width: 80
          },
          {
            text: 'Last Test',
            value: 'last_test_date',
            align: 'center',
            width: 110
          },
          {
            text: 'Water Elevation',
            value: 'water_elevation',
            align: 'center',
            width: 110
          },
          {
            text: 'Minimum Elevation',
            value: 'minimum_elevation',
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
            value: 'date',
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
            text: 'Reason Code',
            value: 'reason',
            align: 'center',
            width: 250
          },
          {
            text: 'Error',
            value: 'error',
            align: 'center',
            width: 120
          },
        ],
        valves: [],
        historyValves: [],
        selectedDates: [],
      }
    },

    components: {
      Weather: () => import('./component/Weather'),
      Clock: () => import('./component/Clock'),
    },

    computed: {
     computedDateFormatted () {
      if (this.selectedDates.length) {
        return this.selectedDates[0] + ' ~ ' + this.selectedDates[1]
      } else {
        return ''
      }
     }
    },

    async mounted () {
      this.fetchSites()
    },

    methods: {
      beautifyEmail,

      valveStatusColor (valve_status) {
        valve_status = valve_status.toLowerCase()
        if (valve_status == 'open') {
          return 'success'
        } else if (valve_status == 'closed') {
          return 'red darken-3'
        } else {
          return 'yellow darken-4'
        }
      },

      linkStatusColor (link_status) {
        link_status = link_status.toLowerCase()
        if (link_status == 'connected') {
          return 'success'
        } else {
          return 'red darken-3'
        } 
      },

      errorStatusColor (error) {
        error = error.toLowerCase()
        if (error == 'good') {
          return 'success'
        } else {
          return 'red darken-3'
        } 
      },

      async fetchSites () {
        this.loading = "secondary"
        // const site_id = localStorage.getItem('site_id')
        const site_id = '203eebc5-973b-4bc3-b66f-5fc41f5da11a' 
        const res = await Post(`sites/get/site`, {site_id})
        if (res.data.status != 'success') {
          this.snackText = res.data.message
          this.snackColor = res.data.status
          this.snack = true
        } else if (res.data){
          const _site = JSON.parse(res.data.data)
          _site.valve.map(valve => {
            this.valves.push({
              ...valve,
              owner: _site.owner,
              location: _site.city + ' ' +_site.state,
              type: _site.type
            })
          })
        }
        this.loading = false
      },

      showHistory (item) {
        this.historyValves = this.controllers
        this.historyDialog = true
      },

      openValve (item) {

      },

      partialOpenValve (item) {

      },

      closeValve (item) {

      },

      filterRange (date) {
        this.$refs.menu.save(date)
        console.log(date)
        const startDate = date[0]
        const endDate = date[1]
        const self = this
        this.historyValves = this.controllers.filter(controller => self.$moment(controller.connected_at).isSameOrAfter(startDate) && self.$moment(controller.connected_at).isSameOrBefore(endDate)
        )
      },

      refreshHistory () {
        this.selectedDates = []
        this.historyValves = this.controllers
      }
    },
  }
</script>

<style>
  .vue-emitting-analog-clock div {
    box-shadow: 1px 1px 5px 0px #000;
  }
</style>