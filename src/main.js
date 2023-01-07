import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'

import VueCookies from 'vue-cookies'

import './styles/app.css';

const { ipcRenderer } = require("electron");

const store = createStore({
    state() {
        return {
            baseUrl: "youtube.com/watch?v=",
            videoIdRegex: /^[a-zA-Z0-9-_]{11}$/,
            videoID: null,
            videoDetail: null,
            state: null,
            progress: 0,
            videoType: 'mp3',
            videoQuality: 'highestvideo',
            searching: false,
            downloads: VueCookies.get('downloads') || []
        }
    },
    getters: {
        videoFormatController: (state) => state.videoIdRegex.test(state.videoID),
        isVideoValid: (state) => state.videoDetail && state.videoDetail === "Video unavailable" ? false : state.videoDetail,
        modal: (state) => state.state && state.state !== 'started',
        loading: (state) => state.state && state.state === 'started',
    },
    mutations: {
        setVideoID(state, value) {
            state.videoID = value
        },
        setVideoDetail(state, value) {
            state.videoDetail = value
        },
        setState(state, value) {
            state.state = value
        },
        setProgress(state, value) {
            state.progress = value
        },
        setVideoType(state, value) {
            state.videoType = value
        },
        setVideoQuality(state, value) {
            state.videoQuality = value
        },
        setSearching(state, value) {
            state.searching = value
        },
        setDownloads(state, value) {
            state.downloads = value
        },
        setStateDefault(state) {
            const defaults = ['videoID', 'videoDetail', 'state', 'searching']

            Object.keys(initialStateCopy).map(key => {
                if (defaults.includes(key)) {
                    state[key] = initialStateCopy[key]
                }
            })
        }
    },
    actions: {
        getDetail({ state, getters, commit }) {
            if (getters.videoFormatController) {
                commit('setSearching', true)

                ipcRenderer.send("yt:detail", state.videoID);
            }
        },
        download({ state }) {
            ipcRenderer.send(
                "yt:download", {
                videoURL: "https://www." + state.baseUrl + state.videoID,
                type: state.videoType,
                quality: state.videoQuality,
            }
            );
        },
        updateDownloads({ state, commit }) {
            const downloads = state.downloads

            downloads.unshift(state.videoDetail.title)

            VueCookies.set('downloads', JSON.stringify(downloads))

            commit('setDownloads', downloads)

            commit('setStateDefault')
        }
    }
})

const initialStateCopy = JSON.parse(JSON.stringify(store.state))

const app = createApp(App)

app.use(store)

app.use(VueCookies, { expires: '7d' })

app.mount('#app')
