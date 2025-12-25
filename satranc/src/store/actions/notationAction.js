import { MOVE, UNDO_MOVE, CLEAR_MOVE } from '../types';

export function doMove(move){
    return {
        type: MOVE,
        payload: move
    };
}

export function undoMove(){
    return {
        type: UNDO_MOVE
    };
}

export function clearMove(){
    return {
        type: CLEAR_MOVE
    };
}