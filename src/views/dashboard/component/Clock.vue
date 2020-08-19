<template>
	<v-card hover height=100 color="primary" class="py-2 white--text">
		<v-card-title>Current Date:<small class="ml-2">{{ date }}</small></v-card-title>
		<v-card-title>Current Time:<small class="ml-2">{{ time }}</small></v-card-title>
	</v-card>
</template>

<script>
	export default {
		name: 'Clock',

		data: () => ({
			time: '',
			date: '',
		}),

		mounted () {
			this.updateTime();
			setInterval(this.updateTime, 1000);
		},

		methods: {
			updateTime () {
			    this.time = this.$moment().format('hh:mm:ss A')
			    this.date = this.$moment().format('dddd, MMM DD YYYY')
			},
		}
	}
</script>