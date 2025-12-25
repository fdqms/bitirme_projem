import Cookies from 'universal-cookie';
import { LOGIN, LOGOUT, REGISTER } from '../types';

const cookie = new Cookies();
const initialState = cookie.get('name') != null;

const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return true;
        case REGISTER:
            return true;
        case LOGOUT:
            cookie.remove('token');
            cookie.remove('name');
            return false;
        default:
            return state;
    }
}

export default AuthReducer;