import { MOVE, UNDO_MOVE, CLEAR_MOVE } from '../types';

const initialState = [];

const NotationReducer = (state = initialState, action) => {
    switch (action.type) {
        case MOVE:
            if (state.length === 0) {
                return [action.payload];
            } else {
                if (typeof action.payload.white === 'undefined') {
                    const len = state.length;
                    return state.map((move, index) => (index + 1) === len ? { ...move, black: action.payload.black } : move)
                } else {
                    return [...state, action.payload];
                }
            }
        case UNDO_MOVE:
            return state.pop();
        case CLEAR_MOVE:
            return [];
        default:
            return state;
    }
}

export default NotationReducer;