<template>
	<v-card width="330" hover color="primary" class="px-6 pt-2 white--text">
        <div class="d-flex align-baseline">
            <h3 class="d-inline-block white--text display-2 font-weight-bold">Raleigh</h3>
            <div class="ml-auto">
                <span class="font-weight-medium white--text">
                	{{currentDate}}
                    {{ currentMonth }}
                </span>
            </div>
        </div>
        <div class="py-2 weather-small">
            <div class="d-flex align-center">
                <div class="display-6 white--text">
                	<v-icon x-large color="white">mdi-cloud-outline</v-icon>
                </div>
                <h1 class="display-3 ml-3 font-weight-medium">32<sup>0</sup></h1>
                <div class="ml-auto">
                	<div>+66<sup>0</sup></div>
                	<v-divider />
                	<div>+59<sup>0</sup></div>
                </div>
            </div>
            <small class="">Rainy day</small>
        </div>
      	<v-divider />
      	<div class="text-center title">See 7-Day Forecast <v-icon color="white" small>mdi-chevron-triple-right</v-icon></div>
    </v-card>
</template>
<script>
	export default {
		name: 'Weather',

		data: () => ({
			week: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
			date: '',
			time: '',
		}),

		computed: {
			currentDate () {
				return this.$moment().format('ddd, DD')
			},

			currentMonth () {
				return this.$moment().format('MMMM')
			}
		},

		mounted () {
			this.updateTime();
			setInterval(this.updateTime, 1000);
		},

		methods: {
			updateTime () {
			    this.time = this.$moment().format('dddd, hh:mm:ss A')
			},
		}
	}
</script>

<style lang="scss" scoped>
	#clock {
	    font-family: 'Share Tech Mono', monospace;
	}
</style>