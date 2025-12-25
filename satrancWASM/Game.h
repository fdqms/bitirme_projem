#ifndef GAME_H
#define GAME_H

#include <iostream>
#include "Board.h"

class Game
{
	public:
		Game();
		Game(std::string);
		Board *board;

	private:
		float whiteTime, blackTime;
};

#endif