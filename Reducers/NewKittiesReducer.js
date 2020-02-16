const initialState = { imageUri: [], myCats:[] }

function reducer(state = initialState, action) {
  let nextState
  console.log(action)
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
        myCats: [action.value],
      }
      return nextState || state
    
  default:
    return state
  }
}

export default reducer