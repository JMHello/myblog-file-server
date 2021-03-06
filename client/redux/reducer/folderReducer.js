const initialState = []

export const actionTypes = {
  GET_FOLDERS: 'GET_FOLDERS',
  SET_FOLDERS: 'SET_FOLDERS',
  DEL_FOLDER: 'DEL_FOLDER',
  ADD_FOLDER: 'ADD_FOLDER',
  MODYFY_FOLDER: 'MODYFY_FOLDER',
}

export const actions = {
  get_folders: function () {
    return {
      type: actionTypes.GET_FOLDERS,
    }
  },
  del_folder: function (id) {
    return {
      type: actionTypes.DEL_FOLDER,
      id
    }
  },
  add_folder: function (name) {
    return {
      type: actionTypes.ADD_FOLDER,
      name
    }
  },
  modify_folder: function (id, name) {
    return {
      type: actionTypes.MODYFY_FOLDER,
      id,
      name
    }
  }
}

export function reducer (state=initialState, action) {
  switch (action.type) {
    case actionTypes.SET_FOLDERS:
      return [...action.data]
    default:
      return state
  }
}