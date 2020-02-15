const initialState = { imageUri: [], myCats:[] }

function reducer(state = initialState, action) {
    console.log('init :', state)
  let nextState
  switch (action.type) {
    case 'ADD_IMAGE':
        nextState = {
          ...state,
          imageUri: [action.value],
        }
        return nextState || state


    case 'ADD_CAT':
      nextState = {
        ...state,
        myCats: [...state.myCats, action.value],
      }
      return nextState || state
    
  default:
    return state
  }
}

export default reducer