<template>
  <v-card 
    :loading="loading"
    v-if="weatherInfo"
    width="300" hover  class="yellow-bg pt-2 ">
        <div class="d-flex align-center pa-4">
            <h3 class="d-inline-block display-2 font-weight-bold grow">
              <div>{{curentCity}}</div>
              <div class="body-2">{{desc}}</div>
            </h3>
            <img v-if="icon" class="icon" width=96 height=96 :src="icon" />
        </div>
        <v-divider />
        <v-sheet tile color="primary" class="pa-2 white--text weather-small">
            <div class="d-flex align-center">
                <h1 class="display-3 ml-3 font-weight-medium">{{parseInt(main.temp)}}<sup clas="title">o</sup>F</h1>
                <div class="ml-auto mr-2">
                  <b>Details</b>
                  <v-divider class="my-1" />
                  <div class="d-flex justify-space-between">
                    <div class="mr-3">
                      <div>Feels Like</div>
                      <div>Wind</div>
                      <div>Humidity</div>
                      <div>Pressure</div>
                    </div>
                    <div>
                      <div>{{parseInt(main.feels_like)}}<sup>o</sup>F</div>
                      <div>{{weatherInfo.wind.speed}}&nbsp;m/s</div>
                      <div>{{main.humidity}}&nbsp;%</div>
                      <div>{{main.pressure}}&nbsp;hPa</div>
                    </div>
                  </div>
                </div>
            </div>
        </v-sheet>
        <div v-if="false" class="text-center title">See 7-Day Forecast <v-icon color="white" small>mdi-chevron-triple-right</v-icon></div>
    </v-card>
</template>
<script>
  import { fetchSite, Post } from '../../../api'
  export default {
    name: 'Weather',

    data: () => ({
      week: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
      date: '',
      time: '',
      site: null,
      weatherInfo: null,
      loading: false
    }),

    computed: {
      currentDate () {
        return this.$moment().format('ddd, DD')
      },

      currentMonth () {
        return this.$moment().format('MMMM')
      },

      curentCity() {
        return this.site ? this.site.location + ', US' : ''
      },
      main () {
        if (this.weatherInfo) {
          return this.weatherInfo.main
        } 
        return ''
      },
      desc () {
        if (this.weatherInfo && this.weatherInfo.weather.length) {
          return this.weatherInfo.weather[0].description
        } 
        return ''
      },
      icon () {
        if (this.weatherInfo && this.weatherInfo.weather.length) {
          return `//openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/${this.weatherInfo.weather[0].icon}.png`
        } 
        return ''
      }
    },

    async mounted () {
      this.updateTime();
      setInterval(this.updateTime, 1000);

      await this.getWeatherData()
    },

    methods: {
      updateTime () {
        this.time = this.$moment().format('dddd, hh:mm:ss A')
      },

      async getWeatherData() {
        this.loading = true
        const site_id = localStorage.getItem('site_id')
        const res = await Post('admin/get/site', {site_id})
        if (res.status == 'success') {
          this.site = res.data
          if (res.weather_info.cod == 200) {
            this.weatherInfo = res.weather_info
          }
        }
        this.loading = false
      },
    }
  }
</script>

<style lang="scss" scoped>
  #clock {
      font-family: 'Share Tech Mono', monospace;
  }

  .weather-small {
    font-size: 12px;
  }
  .icon {
    position: absolute;
    display: block;
    right: 5%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(0%);
    border-radius: 4px;
  }
  .yellow-bg {
    background: #e8960c;
  }
</style>