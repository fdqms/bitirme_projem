#ifndef BOARD_H
#define BOARD_H

#include <iostream>
#include <list>
#include <math.h>
#include <ctype.h>
#include <iterator>

#include <ctime>
#include "Piece.h"
#include "Vec2.h"

using namespace std;

class Board
{
public:
	Board();
	Board(std::string notation);
	bool move(int x, int y, int x2, int y2);
	void print();

	bool getMate()
	{
		return this->mate;
	}
	bool getWinner()
	{
		return !this->orderColor;
	}
	bool getOrderColor()
	{
		return this->orderColor;
	}

	void setWhiteTime();
	void setBlackTime();
	double getWhiteTime();
	double getBlackTime();

	bool promotion(int, int, int);

private:
	list<list<Vec2>> checkPieces;
	Piece pieces[8][8];

	bool orderColor = false;

	bool check();
	bool checkMate();
	bool mate;

	bool movablePawn(int x, int y, int x2, int y2);
	bool movableKnight(int x, int y, int x2, int y2);
	bool movableBishop(int x, int y, int x2, int y2);
	bool movableRook(int x, int y, int x2, int y2);
	bool movableQueen(int x, int y, int x2, int y2);
	bool movableKing(int x, int y, int x2, int y2);
	bool checkRok(int x, int y);
	bool rok;
	bool ep, epColor;
	int epX, epY;

	clock_t whiteTime, blackTime, lastMoveTime;
};

#endif