const state = {
  visitedViews: [],
  cachedViews: [],
  viewDataCached: {

  }
}

const mutations = {
  ADD_VISITED_VIEW: (state, view) => {
    if (state.visitedViews.some(v => v.path === view.path)) return
    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-name',
        query: view.meta.dicID
      })
    )
  },
  ADD_CACHED_VIEW: (state, view) => {
    if (state.cachedViews.includes(view.name)) return
    if (!view.meta.noCache) {
      state.cachedViews.push(view.name)
      // tag中重新打开路由后，如果存在前面的设置dicIDStatus状态则清除
      if (state.viewDataCached["dicIDStatus" + view.meta.dicID]) {
        delete state.viewDataCached["dicIDStatus" + view.meta.dicID]
      }
    }
  },

  DEL_VISITED_VIEW: (state, view) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        break
      }
    }
  },
  DEL_CACHED_VIEW: (state, view) => {
    const index = state.cachedViews.indexOf(view.name)
    index > -1 && state.cachedViews.splice(index, 1)
    // 刷新标识,无论是否存在缓存都需要刷新标识并且删除缓存

    state.viewDataCached["dicIDStatus" + view.meta.dicID] = true
    delete state.viewDataCached['dicIDForm' + view.meta.dicID]
    delete state.viewDataCached['dicIDData' + view.meta.dicID]
  },

  DEL_OTHERS_VISITED_VIEWS: (state, view) => {
    state.visitedViews = state.visitedViews.filter(v => {
      return v.meta.affix || v.path === view.path
    })
  },
  DEL_OTHERS_CACHED_VIEWS: (state, view) => {
    const index = state.cachedViews.indexOf(view.name)
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(index, index + 1)
    } else {
      // if index = -1, there is no cached tags
      state.cachedViews = []
    }
    // 删除关闭路由的缓存
    for (let key in state.viewDataCached) {
      let dicID = ''
      if (key.indexOf('dicIDData') > -1) {
        let text = 'dicIDData'
        let index = key.lastIndexOf(text) + text.length;
        dicID = key.substring(index, key.length);
        if (dicID != view.meta.dicID) {
          delete state.viewDataCached['dicIDForm' + dicID]
          delete state.viewDataCached['dicIDData' + dicID]
          state.viewDataCached["dicIDStatus" + dicID] = true
        }
      }
    }

  },

  DEL_ALL_VISITED_VIEWS: state => {
    // keep affix tags
    const affixTags = state.visitedViews.filter(tag => tag.meta.affix)
    state.visitedViews = affixTags
  },
  DEL_ALL_CACHED_VIEWS: (state, view) => {
    state.cachedViews = []
    // 删除所有路由的缓存



    for (let key in state.viewDataCached) {
      let dicID = ''
      if (key && key.indexOf('dicIDData') > -1) {
        let text = 'dicIDData'
        let index = key.lastIndexOf(text) + text.length;
        dicID = key.substring(index, key.length);
        delete state.viewDataCached['dicIDForm' + dicID]
        delete state.viewDataCached['dicIDData' + dicID]
      }
      // 因为打开当前页面没离开的时候没缓存到，导致操作右键关闭所有后缓存了，为了再次打开左侧界面的缓存需清除，所以需要在做右键关闭时赋予状态标识不做缓存。
      state.viewDataCached["dicIDStatus" + dicID] = true
    }

  },

  UPDATE_VISITED_VIEW: (state, view) => {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }
}

const actions = {
  addView({ dispatch }, view) {
    dispatch('addVisitedView', view)
    dispatch('addCachedView', view)
  },
  addVisitedView({ commit }, view) {
    commit('ADD_VISITED_VIEW', view)
  },
  addCachedView({ commit }, view) {
    commit('ADD_CACHED_VIEW', view)
  },

  delView({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delVisitedView', view)
      dispatch('delCachedView', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delVisitedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_VISITED_VIEW', view)
      resolve([...state.visitedViews])
    })
  },
  delCachedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_CACHED_VIEW', view)
      resolve([...state.cachedViews])
    })
  },

  delOthersViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delOthersVisitedViews', view)
      dispatch('delOthersCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delOthersVisitedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
  delOthersCachedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_CACHED_VIEWS', view)
      resolve([...state.cachedViews])
    })
  },

  delAllViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delAllVisitedViews', view)
      dispatch('delAllCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delAllVisitedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_VISITED_VIEWS')
      resolve([...state.visitedViews])
    })
  },
  delAllCachedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_ALL_CACHED_VIEWS', view)
      resolve([...state.cachedViews])
    })
  },

  updateVisitedView({ commit }, view) {
    commit('UPDATE_VISITED_VIEW', view)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}