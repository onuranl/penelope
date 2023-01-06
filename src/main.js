import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'

import './styles/app.css';

const { ipcRenderer } = require("electron");

const store = createStore({
    state() {
        return {
            baseUrl: "youtube.com/watch?v=",
            videoIdRegex: /^[a-zA-Z0-9-_]{11}$/,
            videoID: null,
            videoDetail: null,
            progress: 0,
            selectedType: 'mp3',
            selectedQuality: 'highestvideo',
            loading: false,
            modal: false,
        }
    },
    getters: {
        videoFormatController: (state) => state.videoIdRegex.test(state.videoID),
        isVideoValid: (state) => state.videoDetail && state.videoDetail === "Video unavailable" ? false : state.videoDetail
    },
    mutations: {
        setVideoID(state, value) {
            state.videoID = value
        },
        setVideoDetail(state, value) {
            state.videoDetail = value
        },
        setProgress(state, value) {
            state.progress = value
        },
        setSelectedType(state, value) {
            state.selectedType = value
        },
        setSelectedQuality(state, value) {
            state.selectedQuality = value
        },
        setLoading(state, value) {
            state.loading = value
        },
        setModal(state, value) {
            state.modal = value
        }
    },
    actions: {
        getDetail({ state, getters, commit }) {
            if (getters.videoFormatController) {
                commit('setLoading', true)

                ipcRenderer.send("yt:detail", state.videoID);
            }
        },
        download({ state, commit }) {
            commit('setModal', true)

            ipcRenderer.send(
                "yt:download", {
                videoURL: "https://www." + state.baseUrl + state.videoID,
                type: state.selectedType,
                quality: state.selectedQuality,
            }
            );
        }
    }
})

const app = createApp(App)

app.use(store)

app.mount('#app')
