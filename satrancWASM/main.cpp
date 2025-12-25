#include <iostream>
#include <string>
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <limits.h>
#include "Board.h"

Board *board = new Board("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
int8_t* moves = (int8_t*)malloc(sizeof(int8_t)*4);

extern "C" {

    int8_t* aiMove(){
        
        int val;

        if(board->getOrderColor()){
            val = INT_MIN;
        }else{
            val = INT_MAX;
        }

        int depth = 10;
        for(int j=0;j<8;j++){
            for(int i=0;i<8;i++){
                if(board->getOrderColor()){
                    val = max(val, board->minimax(i,j,depth, true, -1,-1));
                }else{
                    val = min(val, board->minimax(i,j,depth, false, -1,-1));
                }
            }
        }

        for(int i=0;i<4;i++){
            *(moves+i) = i*i;
        }

        return moves;
    }

    bool doMove(int x, int y, int x2, int y2){
        return board->move(x,y,x2,y2);
    }
    

}