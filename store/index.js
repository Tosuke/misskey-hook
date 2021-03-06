import Vue from 'vue'
import Vuex from 'vuex'
import user from '~/plugins/user'
import firebase from '~/plugins/firebase'
import { firebaseMutations, firebaseAction } from 'vuexfire'

const db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

const uidTask = user().then(u => u && u.uid)

const createStore = () =>
  new Vuex.Store({
    state: {
      hooks: [],
      user: null,
      uid: null
    },
    mutations: {
      ...firebaseMutations,
      setUser(state, { user }) {
        state.user = user
      },
      setUid(state, { uid }) {
        state.uid = uid
      }
    },
    actions: {
      async nuxtClientInit({ dispatch }) {
        await Promise.all([dispatch('initHooks'), dispatch('initUser')])
      },
      async initUser({ commit }) {
        const uid = await uidTask
        if (!uid) return
        const userDoc = await db
          .collection('users')
          .doc(uid)
          .get()
        commit('setUser', { user: userDoc.data() })
        commit('setUid', { uid })
      },
      initHooks: firebaseAction(async ({ bindFirebaseRef }) => {
        const uid = await uidTask
        if (!uid) return
        const hooksRef = db
          .collection('users')
          .doc(uid)
          .collection('hooks')
        await bindFirebaseRef('hooks', hooksRef)
      }),
      async signOut({ commit }) {
        await firebase.auth().signOut()
        commit('setUser', { user: null })
      },
      async createHook({ state }, { name }) {
        const {
          host,
          accessToken,
        } = state.user

        const uid = state.uid

        const hooksRef = db
          .collection('users')
          .doc(uid)
          .collection('hooks')

        // TODO: Use Transation
        const hookRef = await hooksRef.add({
          name,
          host,
          token: accessToken,
        })
        await hookRef.update({
          id: hookRef.id
        })
      },
      async deleteHook({ state }, { id }) {
        const uid = state.uid
        const hookRef = db.collection('users').doc(uid).collection('hooks').doc(id)
        await hookRef.delete()
      }
    }
  })

export default createStore
