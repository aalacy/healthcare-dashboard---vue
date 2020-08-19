import axios from 'axios'
import moment from 'moment'
import jwtDecode from 'jwt-decode'
require('dotenv').config()

export const BASE_API = process.env.VUE_APP_BACKEND_URL
// export const BASE_API = 'http://18.191.147.68'

const getAuthToken = () => {
	return localStorage.getItem('token')
}

const getEmail = () => {
	return jwtDecode(localStorage.getItem('token')).email
}

export const getRole = () => {
	return jwtDecode(localStorage.getItem('token')).role.toLowerCase()
}

export const isAdmin = () => {
	return getRole() == 'admin' || getRole() == 'root'
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
		if (e.response.status == 401) {
			// authentication token is expired.
			localStorage.removeItem('token')
			localStorage.removeItem('custom')
			localStorage.removeItem('jwt')
			localStorage.removeItem('roottoken')
			localStorage.removeItem('email')
			localStorage.removeItem('site_id')
			location.href = '/auth/login'
		}
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
	return await Post('admin/get/site', { site_id })
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

export const removeSite = async (site_id) => {
	const data = {
		site_id
	}
	return await Post('admin/delete/site', data)
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

export const removeStaff = async(email, user_id) => {
	const data = {
		site_id: localStorage.getItem('site_id'),
		email,
		user_id
	}
	return await Post('sites/delete', data)
}

export const addStaff = async(item) => {
	const data = {
		site_id: localStorage.getItem('site_id'),
		...item,
	}
	return await Post('auth/create', data)
}

/*
*	User profile
*/

export const getAlerts = async(email) => {
	const data = {
		site_id: localStorage.getItem('site_id'),
		email,
	}
	return await Post('auth/get/alerts', data)
}

export const getMyProfile = async (email) => {
	const data = {
		site_id: localStorage.getItem('site_id'),
		email,
	}
	return await Post('sites/get/user', data)
}

export const updateProfile = async (item) => {
	const data = {
		...item,
		site_id: localStorage.getItem('site_id'),
	}
	return await Post('auth/update/profile', data)
}

export const updatePassword = async (item) => {
	const data = {
		...item,
		email: getEmail(),
		site_id: localStorage.getItem('site_id'),
	}
	return await Post('auth/update/password', data)
}

export const updateAlert = async (item) => {
	const data = {
		...item,
		email: getEmail(),
		site_id: localStorage.getItem('site_id'),
	}
	return await Post('auth/update/alerts', data)
}
