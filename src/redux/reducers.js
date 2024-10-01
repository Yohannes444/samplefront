import { combineReducers } from "redux";

import userReducer from "./slice/userSlice"; // Add userReducer


const rootReducer = combineReducers({
  user: userReducer, // Add user reducer
  
});

export default rootReducer;
