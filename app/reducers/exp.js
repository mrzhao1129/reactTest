const initialState = [];

export default function exp(state = initialState, action){
  switch(action.type) {
    case "test1":
      return action.type;
    default: 
      return state;
  }
}