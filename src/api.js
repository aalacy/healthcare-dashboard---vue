import axios from 'axios'
import moment from 'moment'

// export const BASE_API = process.env.BASE_API
export const BASE_API = 'http://localhost:5000'
// export const BASE_API = 'https://urinotsecure.revampcybersecurity.com'

const getAuthToken = () => {
	return localStorage.getItem('token')
}

/* 
  API methods
*/

// API schema
export const Post = async (url, data={}) => {
	let res = {}
	try {
		res = await axios({
			url: `${BASE_API}/${url}`,
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'Authorization': getAuthToken()
			},
			method: 'POST',
			data
		})
	} catch(e) {
		res = e.response
	}
	return res
}

export const Get = async (url, data) => {
	let res = {}
	try {
		res = await axios({
			url: `${BASE_API}/${url}`,
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'Authorization': getAuthToken()
			},
			method: 'GET',
			data
		})
	} catch(e) {
		res = e.response
	}
	return res
}

export const updateAnswer = async (data) => {
	let value = []
	try {
		await axios({
			url: `${BASE_API}/api/public/update`,
			data: data,
			method: 'POST'
		})
		
	} catch(e) {}
}

export const deleteAnswer = async (data) => {
	return await updateAnswer(data)
}

export const createAnswer = async (data) => {
	return await updateAnswer(data)
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

export const members  = [
	{
		"id":"fb10e53e-e267-4c21-a41d-317d7002d13b",
		"first":"admin",
		"last":"admin",
		"dob":"2020-05-16",
		"email":"admin@gmail.com",
		"phone":"12345555",
		"site":"",
		"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1ODk3MzkzMzQsImlhdCI6MTU4OTY1MjkzNCwic3ViIjoiZmIxMGU1M2UtZTI2Ny00YzIxLWE0MWQtMzE3ZDcwMDJkMTNiIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJhZG1pbiI6ZmFsc2UsInJvbGUiOiJhZG1pbiJ9.-Pz6nOysWBsZDPZb7lvCV-W2PHyTNaCruY8d_V6syKo",
		"verified_email":false,
		"active":false,
		"admin":false,
		"role":"admin"
	},
	{
	    "id": "9007de7f-0cf1-4761-9b66-7074d4c14f85",
	    "first": "sss",
	    "last": "sss",
	    "dob": "2020-05-13",
	    "email": "ssssss@sdf.dd",
	    "phone": "3234234234",
	    "site": "dd",
	    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1ODkzNjU2NjUsImlhdCI6MTU4OTI3OTI2NSwic3ViIjoiOTAwN2RlN2YtMGNmMS00NzYxLTliNjYtNzA3NGQ0YzE0Zjg1IiwiZW1haWwiOiJzc3Nzc3NAc2RmLmRkIiwiYWRtaW4iOmZhbHNlLCJyb2xlIjoiYWRtaW4ifQ.ONTpIAZM67O1rM23oGOQFYJZHzD_hQafbhsyKwJcI4Y",
	    "verified_email": false,
	    "active": false,
	    "admin": false,
	    "role": "admin"
	}
]

// mock server
export const getMyProfile = (email) => {
	return members.filter(member => member.email == email)[0]
}

export const getSMSConfigs = (user_id) => {
	return smsConfigs;
}

export const submitCommand = (command) => {
	flsCommandsHistories.push({
		id: flsCommandsHistories.length + 1,
		...command,
		sent_on: moment().format('YYYY-MM-DD HH:mm:ss'),
		received_on: moment().add(10, 'days').format('YYYY-MM-DD HH:mm:ss'),
		status: 'Waiting'
	})
}

export const getCommandsHistories = (fls_id) => {
	return flsCommandsHistories.filter(item => item.fls_id == fls_id).sort((a, b) => new Date(b.sent_on) - new Date(a.sent_on))
}

export const latestCommand = (fls_id) => {
	const commands = flsCommandsHistories.filter(item => item.fls_id == fls_id).sort((a, b) => new Date(b.sent_on) - new Date(a.sent_on))
	let command = []
	if (commands.length > 0) {
		command = [commands[0]]
	}
	return command
}

export const fetchAllUsers = () => {
	return [
		{
			id: 1,
			account_id: 'fb10e53e-e267-4c21-a41d-317d7002d13b',
			email: 'admin@gmail.com',
			phone: 123456,
			controllers_cnt: 1,
			staff_cnt: 1,
			location: 'test location',
			token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1ODkzNjU3MzAsImlhdCI6MTU4OTI3OTMzMCwic3ViIjoiZmIxMGU1M2UtZTI2Ny00YzIxLWE0MWQtMzE3ZDcwMDJkMTNiIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJhZG1pbiI6ZmFsc2UsInJvbGUiOiJhZG1pbiJ9.Ql9mGgSYnXCRLIoAEVg6XB4AFZf6EgD2f7UD5YMTZfI'
		},
		{
			id: 2,
			account_id: 'eb10e53e-e267-4c21-a41d-317dsdfwed13b',
			email: 'test2@email.com',
			phone: 123456,
			controllers_cnt: 1,
			staff_cnt: 1,
			location: 'test location 1',
			token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1ODkzNjU3MzAsImlhdCI6MTU4OTI3OTMzMCwic3ViIjoiZmIxMGU1M2UtZTI2Ny00YzIxLWE0MWQtMzE3ZDcwMDJkMTNiIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJhZG1pbiI6ZmFsc2UsInJvbGUiOiJhZG1pbiJ9.Ql9mGgSYnXCRLIoAEVg6XB4AFZf6EgD2f7UD5YMTZfI'
		}
	]
}

export const fetchFLSListing = () => {
	return flsListing
}

export const getFLS = (id) => {
	return flsListing.filter(fls => fls.id == id)
}

export const updateFLSListing = (item) => {
	let _flsListing = flsListing.map(fls => {
		if (fls.id == item.id) {
			return item
		} else {
			return fls
		}
	})

	flsListing = _flsListing
}

export const creatFlsListing = (item) => {
	flsListing.push(item)
}

