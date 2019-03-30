import Vue from 'vue'
import Vuex, { Store, GetterTree, MutationTree, ActionTree } from 'vuex'

Vue.use(Vuex)


interface State {
  totalTasks: number
  doneTasks: number
}

const state: State = {
  totalTasks: 0,
  doneTasks: 0
}

const getters: GetterTree<State, State> = {
  getTotalTasks: state => state.totalTasks,
  getDoneTasks: state => state.doneTasks,
}

const mutations: MutationTree<State> = {
  clearTasks(state) {
    state.totalTasks = 0
    state.doneTasks = 0
  },
  
  incrementTotalTasks(state) {
    state.totalTasks += 1
  },
  decrementTotalTasks(state) {
    state.totalTasks -= 1
  },

  incrementDoneTasks(state) {
    state.doneTasks += 1
  },
  decrementDoneTasks(state) {
    state.doneTasks -= 1
  },
}

const store: Store<State> = new Vuex.Store<State>({
  state,
  getters,
  mutations,
  actions: {

  }
})

export default store
