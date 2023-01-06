import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'

import './styles/app.css';

const store = createStore({
    state() {
        return {
            count: 0
        }
    },
    mutations: {
        increment(state) {
            state.count++
        }
    }
})


const app = createApp(App)

app.use(store)

app.mount('#app')
