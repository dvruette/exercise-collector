import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase/app'

Vue.config.productionTip = false

// Initialize Firebase
const config = {
  apiKey: "AIzaSyCGVORWpd49Iu8XSvLJ0Z8GmM5tmh0nMxk",
  authDomain: "exercisecollector.firebaseapp.com",
  databaseURL: "https://exercisecollector.firebaseio.com",
  projectId: "exercisecollector",
  storageBucket: "exercisecollector.appspot.com",
  messagingSenderId: "1022114898202"
}
firebase.initializeApp(config)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
