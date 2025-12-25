#ifndef GAME_H
#define GAME_H

#include <iostream>
#include "stdint.h"
#include "Board.h"

class Game
{
	public:
		Game(int64_t);
		Game(std::string, int64_t);
		Board *board;

		int64_t getPlayer1();
		int64_t getPlayer2();
		void setPlayer2(int64_t);

	private:
		int64_t p1, p2;
		float whiteTime, blackTime;
		bool draw = false;
};

#endif