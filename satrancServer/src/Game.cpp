#include "Game.h"
#include <iostream>

Game::Game(int64_t p1) {
	this->board = new Board();
	this->p1 = p1;
	this->p2 = -1;
}

Game::Game(std::string notation, int64_t p1) {
	this->board = new Board(notation);
	this->p1 = p1;
}

int64_t Game::getPlayer1(){
	return this->p1;
}

int64_t Game::getPlayer2(){
	return this->p2;
}

void Game::setPlayer2(int64_t p2){
	this->p2 = p2;
}