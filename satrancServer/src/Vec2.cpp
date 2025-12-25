#include "Vec2.h"

Vec2::Vec2() {
	
}

Vec2::Vec2(int x, int y) {
	this->x = x;
	this->y = y;
}

int Vec2::getX() {
	return this->x;
}

int Vec2::getY() {
	return this->y;
}