import { LOGIN, LOGOUT, REGISTER } from '../types';

export function LoginAction(username, password){
    return {
        type: LOGIN,
        payload: {username, password}
    };
}

export function RegisterAction(username, password){
    return {
        type: REGISTER,
        payload: {username, password}
    };
}

export function LogoutAction(){
    return {
        type: LOGOUT
    };
}