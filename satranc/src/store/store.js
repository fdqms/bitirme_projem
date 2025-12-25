import { createStore, applyMiddleware, combineReducers  } from "redux";
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import AuthReducer from "./reducers/authReducer";
import NotationReducer from "./reducers/notationReducer";

const reducers = combineReducers({
    notations : NotationReducer,
    auth: AuthReducer
});

const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk)));

export default store;