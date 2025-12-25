#include "Game.h"
#include <iostream>

Game::Game() {
	this->board = new Board();
}

Game::Game(std::string notation) {
	this->board = new Board(notation);
}