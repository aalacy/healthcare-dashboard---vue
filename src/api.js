import axios from 'axios'
import moment from 'moment'

// export const BASE_API = process.env.BASE_API
// export const BASE_API = 'http://localhost:5000'
export const BASE_API = 'http://18.191.147.68'

const getAuthToken = () => {
	return localStorage.getItem('token')
}

/* 
  API methods
*/

// API schema
export const Call = async (url, method, data={}) => {
	let res = {}
	try {
		res = await axios({
			url: `${BASE_API}/${url}`,
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'Authorization': getAuthToken()
			},
			method,
			data
		})
	} catch(e) {
		res = e.response
	}
	return res.data
}

export const Post = async (url, data) => {
	return await Call(url, 'POST', data)
}

export const Get = async (url, data) => {
	return await Call(url, 'GET', data)
}

export const Put = async (url, data) => {
	return await Call(url, 'PUT', data)
}

// mock data
let flsListing = [
	{
		id: 1,
		username: 'admin',
		fls_id: '0000000001',
		controller_location: 'test1',
		controller_description: 'test1',
		controller_type: 'test1',
		connection_interval: '1',
		event_name: '',
	},
	{
		id: 2,
		username: 'bradcole',
		fls_id: '16777200',
		controller_location: 'Lake Johnson',
		controller_description: 'Valve',
		controller_type: 'Pond',
		connection_interval: '22',
		event_name: '',
		maintain_connnection: 'Maintain connection',
		sent_on: '2020-05-16 09:57:18',
		received_on: '2020-05-16 09:57:18',
	}
]

const flsCommandsHistories = [
	{
		id: 1,
		type: 'maintain',
		fls_id: '0000000001',
		maintain_connection: 'Maintain connection',
		sent_on: '2020-02-16 09:57:18',
		received_on: '2020-02-16 09:57:18',
		status: 'Waiting'
	},
	{
		id: 2,
		fls_id: '0000000001',
		type: 'config',
		conn_period: 20,
		stuck_valve: 10,
		WB_chan: 1,
		RSSI: 0,
		bat_ov: 30,
		bat_uv: 50,
		sent_on: '2020-03-16 09:57:18',
		received_on: '2020-03-16 09:57:18',
		status: 'Cancelled'
	},
	{
		id: 3,
		fls_id: '16777200',
		type: 'event_code',
		event_code: 'FFA - Flash Flood Watch',
		action: 'Notify and Energize Relay',
		timeout: 10,
		relays: 'Both Relays 1 & 2',
		sent_on: '2020-04-16 09:57:18',
		received_on: '2020-04-16 09:57:18',
		status: 'Sent'
	}
]

const smsConfigs = [
	{
		event: 'Costal Flood Watch',
		none: false,
		notify_only: true,
		notify_and_open_valve: false,
		notify_and_partial_open_valve: true,
		notify_valve_closes: false
	},
	{
		event: 'Costal Flood Warning',
		none: false,
		notify_only: true,
		notify_and_open_valve: false,
		notify_and_partial_open_valve: false,
		notify_valve_closes: false
	},
	{
		event: 'Flash Flood Watch',
		none: false,
		notify_only: true,
		notify_and_open_valve: false,
		notify_and_partial_open_valve: false,
		notify_valve_closes: false
	},
	{
		event: 'Flash Flood Warning',
		none: true,
		notify_only: true,
		notify_and_open_valve: false,
		notify_and_partial_open_valve: true,
		notify_valve_closes: true
	},
	{
		event: 'Flood Watch',
		none: false,
		notify_only: true,
		notify_and_open_valve: false,
		notify_and_partial_open_valve: false,
		notify_valve_closes: false
	},
	{
		event: 'Flood Warning',
		none: false,
		notify_only: true,
		notify_and_open_valve: false,
		notify_and_partial_open_valve: true,
		notify_valve_closes: true
	},
	{
		event: 'Hurricane Watch',
		none: false,
		notify_only: false,
		notify_and_open_valve: false,
		notify_and_partial_open_valve: true,
		notify_valve_closes: false
	},
	{
		event: 'Hurricane Warning',
		none: false,
		notify_only: true,
		notify_and_open_valve: true,
		notify_and_partial_open_valve: true,
		notify_valve_closes: false
	},
	{
		event: 'Severe Thunderstorm Watch',
		none: false,
		notify_only: true,
		notify_and_open_valve: true,
		notify_and_partial_open_valve: true,
		notify_valve_closes: false
	},
	{
		event: 'Severe Thunderstorm Warning',
		none: false,
		notify_only: true,
		notify_and_open_valve: false,
		notify_and_partial_open_valve: true,
		notify_valve_closes: true
	},
]

// mock server

export const getSMSConfigs = (user_id) => {
	return smsConfigs;
}

export const submitCommand = async (command) => {
	const data = {
		...command,
		site_id: localStorage.getItem('site_id')
	}
	return await Post('commands/update/fips', data)
}

export const createEvent = async (event) => {
	const data = {
		...event,
		site_id: localStorage.getItem('site_id')
	}
	return await Post('commands/create/events', data)
}

export const updateControllerConfig = async (config) => {
	const data = {
		...config,
		site_id: localStorage.getItem('site_id')
	}
	return await Post('commands/update/config', data)
}

export const clearCommands = async (controller_id) => {
	const data = {
		controller_id,
		site_id: localStorage.getItem('site_id')
	}
	return await Post('commands/delete/events', data)
}

export const getCommandsHistories = async (controller_id) => {
	const data = {
		controller_id,
		site_id: localStorage.getItem('site_id')
	}
	const fips = await Post('commands/get/fips_history', data)
	const events = await Post('commands/get/events_history', data)
	const configs = await Post('commands/get/config_history', data)

	return {
		fips: fips.data,
		events: events.data,
		configs: configs.data
	}
}

export const latestCommand = async (controller_id) => {
	const data = {
		controller_id,
		site_id: localStorage.getItem('site_id')
	}
	return await Post('commands/get/commands', data)
}

/*
	Sites
*/

export const getSite = async () => {
    const site_id = localStorage.getItem('site_id')
	return await Post('admin/get/site', { site_id }).data
}

export const updateSite = async (item) => {
	const data = {
		site_id: item.site_id,
		owner: item.owner,
		phone: item.phone,
		location: item.location,
		account_status: item.account_status
	}
	return await Put('admin/update/site', data)
}

export const fetchAllSites = async () => {
	const res = await Get('admin/all/sites')
	return res.data
}

export const createSite = async (item) => {
	return await Post('admin/create/site', item)
}


/*
*	Controllers
*/

export const createController = async (item) => {
	const data = {
		...item,
		site_id: localStorage.getItem('site_id')
	}
	return await Post('controller/create', data)
}

export const fetchAllControllers = async () => {
	const data = {
		site_id: localStorage.getItem('site_id')
	}
	return await Post('sites/all/controllers', data)
}

export const updateControllerValve = async (item) => {
	item.error = 'No'
	item.reason = "Don't know"
	return await Post('sites/update/controller', item)
}

export const updateController = async (item) => {
	const data = {
		...item,
		site_id: localStorage.getItem('site_id')
	}
	return await Post('controller/update', data)
}

export const deleteController = async (controller_id) => {
	const data = {
		controller_id,
		site_id: localStorage.getItem('site_id')
	}
	return await Post('controller/delete', data)
}

export const fetchSiteHistory = async (item) => {
	return await Post('sites/history', item)
}


/*
* Users
*/

export const getSiteUsers = async () => {
	const data = {
		site_id: localStorage.getItem('site_id')
	}
	return await Post('sites/all/users', data)
}

export const updateMemberStatus = async (email, active) => {
	const data = {
		site_id: localStorage.getItem('site_id'),
		email,
		active
	}
	return await Post('sites/update/activate', data)
}

export const removeStaff = async(user_id) => {
	const data = {
		site_id: localStorage.getItem('site_id'),
		user_id,
	}
	return await Post('sites/delete', data)
}

/*
*	User profile
*/

export const getAlerts = async(user_id) => {
	const data = {
		site_id: localStorage.getItem('site_id'),
		user_id,
	}
	return await Post('auth/get/alerts', data)
}

export const getMyProfile = async (email) => {
	const data = {
		site_id: localStorage.getItem('site_id'),
		email,
	}
	return await Post('auth/get/profile', data)
}

export const updateProfile = async (email) => {
	const data = {
		...item,
		site_id: localStorage.getItem('site_id'),
	}
	return await Post('auth/update/profile', data)
}
