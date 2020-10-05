import  { fetchAllControllers } from '@/api'
export const strict = false

export default {
  namespaced: true,	
  state: {
  	controllers: [],
  	loading: false,
  	error: ''
  },
  mutations: {
  	setControllers(state, e) {
  		state.controllers = e
  	},
  	setLoading(state, e) {
  		state.loading = e
  	}
  },
  actions: {
  	async getControllers({ commit }, payload) {
  		commit('setLoading', 'secondary')

      const res = await fetchAllControllers()
      if (res.status == 'success') {
      	let controllers = []
      	res.data.map(controller => {
          let link_status = 'Active'
          if (controller.error_conditions != 0) {
            link_status = 'Error'
          } else if (!['1', '2', '3'].includes(controller.valve_status)) {
            link_status = 'In Progress'
          }
          controllers.push({
            ...controller,
            location: controller.city + ' ' +controller.state,
            link_status
          })
        })
      	commit('setControllers', controllers)
      }
      commit('setLoading', false)
    },
    setLoading({ commit }, payload) {
    	commit('setLoading', payload)
    }
  }
}