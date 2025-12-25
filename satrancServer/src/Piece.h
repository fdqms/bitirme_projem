#ifndef PIECE_H
#define PIECE_H

class Piece
{
	public:
		Piece();
		Piece(int type, bool color);
		void move();
		int getType();
		bool getColor();
		bool getDidMove();
	private:
		int type;
		bool color;
		bool didMove;
};

#endif