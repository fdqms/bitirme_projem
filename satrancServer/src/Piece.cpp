#include "Piece.h"

Piece::Piece() {
	this->type = 0;
}

Piece::Piece(int type, bool color) {
	this->type = type;
	this->color = color;
	this->didMove = false;
}

void Piece::move() {
	this->didMove = true;
}

int Piece::getType() {
	return this->type;
}

bool Piece::getColor() {
	return this->color;
}

bool Piece::getDidMove() {
	return this->didMove;
}