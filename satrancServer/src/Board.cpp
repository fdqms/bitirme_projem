#include "Board.h"

using namespace std;

/*
maçlar
oyun id: int | notasyon: string | beyaz oynayan oyuncu id: int | siyah oynayan oyuncu id: int | beyaz mı siyah mı kazandı: bool

hamleler
hamle id: int | maç id: int | hamle notasyonu: string

kullanıcılar
kullanıcı id: int | kullanıcı adı: string | parola: 256 char | kaydolma tarihi: date time | elo: integer | toplam maç sayısı: integer

grafik çıkarma eklenecek
*/

Board::Board()
{
	const string notation = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

	this->ep = false;
	this->rok = false;
	this->orderColor = true;
	this->mate = false;
	this->whiteTime = (clock_t)180000;
	this->blackTime = (clock_t)180000;
	this->lastMoveTime = clock();

	int i = 7, j = 7;

	for (int k = 0; k < notation.length(); k++)
	{

		if (notation[k] == '/')
		{
			j--;
			i = 7;
		}
		else
		{
			switch (notation[k])
			{
			case 'p': // lower case -> black
				this->pieces[i][j] = Piece(1, false);
				break;
			case 'n': // r:pawn notation[k]:knight r:rook b:bishop q:queen k:king
				this->pieces[i][j] = Piece(2, false);
				break;
			case 'b':
				this->pieces[i][j] = Piece(3, false);
				break;
			case 'r':
				this->pieces[i][j] = Piece(4, false);
				break;
			case 'q':
				this->pieces[i][j] = Piece(5, false);
				break;
			case 'k':
				this->pieces[i][j] = Piece(6, false);
				break;
			case 'P':
				this->pieces[i][j] = Piece(1, true);
				break;
			case 'N':
				this->pieces[i][j] = Piece(2, true);
				break;
			case 'B':
				this->pieces[i][j] = Piece(3, true);
				break;
			case 'R':
				this->pieces[i][j] = Piece(4, true);
				break;
			case 'Q':
				this->pieces[i][j] = Piece(5, true);
				break;
			case 'K':
				this->pieces[i][j] = Piece(6, true);
				break;
			default:
				if (isdigit(notation[k]))
				{
					int l;
					for (l = 0; l < notation[k] - '0'; l++)
					{
						this->pieces[i - l][j] = Piece();
					}
					i -= (l - 1);
				}

				break;
			}
			i--;
		}
	}
}

Board::Board(string notation) // oyun tipi eklenecek
{
	this->ep = false;
	this->rok = false;
	this->orderColor = true;
	this->mate = false;
	this->whiteTime = (clock_t)180000; // süre oyun tipine göre ayarlanacak
	this->blackTime = (clock_t)180000;
	this->lastMoveTime = clock();

	int i = 7, j = 7;

	for (int k = 0; k < notation.length(); k++)
	{

		if (notation[k] == '/')
		{
			j--;
			i = 7;
		}
		else
		{
			switch (notation[k])
			{
			case 'p': // lower case -> black
				this->pieces[i][j] = Piece(1, false);
				break;
			case 'n': // r:pawn notation[k]:knight r:rook b:bishop q:queen k:king
				this->pieces[i][j] = Piece(2, false);
				break;
			case 'b':
				this->pieces[i][j] = Piece(3, false);
				break;
			case 'r':
				this->pieces[i][j] = Piece(4, false);
				break;
			case 'q':
				this->pieces[i][j] = Piece(5, false);
				break;
			case 'k':
				this->pieces[i][j] = Piece(6, false);
				break;
			case 'P':
				this->pieces[i][j] = Piece(1, true);
				break;
			case 'N':
				this->pieces[i][j] = Piece(2, true);
				break;
			case 'B':
				this->pieces[i][j] = Piece(3, true);
				break;
			case 'R':
				this->pieces[i][j] = Piece(4, true);
				break;
			case 'Q':
				this->pieces[i][j] = Piece(5, true);
				break;
			case 'K':
				this->pieces[i][j] = Piece(6, true);
				break;
			default:
				if (isdigit(notation[k]))
				{
					int l;
					for (l = 0; l < notation[k] - '0'; l++)
					{
						this->pieces[i - l][j] = Piece();
					}
					i -= (l - 1);
				}

				break;
			}
			i--;
		}
	}
}

bool Board::move(int x, int y, int x2, int y2)
{

	if (this->mate)
	{
		cout << "satir 166" << endl;
		return false;
	}

	Piece selectedPiece = this->pieces[x][y];
	Piece targetPiece = this->pieces[x2][y2];

	if (selectedPiece.getType() == 0 || selectedPiece.getColor() != orderColor || (targetPiece.getType() != 0 && selectedPiece.getColor() == targetPiece.getColor()))
	{
		cout << "satir 174" << endl;
		return false;
	}

	bool movable = false;

	switch (selectedPiece.getType())
	{
	case 0:
		break;
	case 1:
		movable = movablePawn(x, y, x2, y2);
		if (movable && abs(y - y2) < 2)
		{
			this->ep = false;
		}
		break;
	case 2:
		movable = movableKnight(x, y, x2, y2);
		break;
	case 3:
		movable = movableBishop(x, y, x2, y2);
		break;
	case 4:
		movable = movableRook(x, y, x2, y2);
		break;
	case 5:
		movable = movableQueen(x, y, x2, y2);
		break;
	case 6:
		movable = movableKing(x, y, x2, y2);
		break;
	default:
		break;
	}

	if (movable)
	{

		Piece tmpPiece = this->pieces[x2][y2];

		this->pieces[x][y] = Piece();
		this->pieces[x2][y2] = selectedPiece;

		if (check())
		{
			cout << "sah cekildi" << endl;
			this->pieces[x][y] = this->pieces[x2][y2];
			this->pieces[x2][y2] = tmpPiece;
			return false;
		}
		else
		{

			if (this->rok)
			{
				if (selectedPiece.getType() == 6)
				{
					if (x2 == 1)
					{
						this->pieces[1][y] = selectedPiece;
						this->pieces[2][y] = this->pieces[0][y];
						this->pieces[3][y] = Piece();
						this->pieces[0][y] = Piece();
					}
					else if (x2 == 5)
					{
						this->pieces[5][y] = selectedPiece;
						this->pieces[2][y] = this->pieces[7][y];
						this->pieces[3][y] = Piece();
						this->pieces[7][y] = Piece();
					}
				}
				this->rok = false;
			}

			this->mate = checkMate();

			this->checkPieces.clear();

			this->orderColor = !(this->orderColor);

			return true;
		}
		cout << "not movable" << endl;
	}
	return false;
}

bool Board::promotion(int x, int y, int pieceType)
{
	if (this->pieces[x][y].getType() == 1 && this->orderColor != this->pieces[x][y].getColor())
	{
		if (y == 0 || y == 7)
		{
			this->pieces[x][y] = Piece(pieceType, this->pieces[x][y].getColor());
			return true;
		}
	}
	return false;
}

bool Board::check()
{

	int kingX = -1, kingY = -1;
	for (int j = 0; j < 8; j++)
	{
		for (int i = 7; i >= 0; i--)
		{
			if (this->pieces[i][j].getType() == 6 && this->pieces[i][j].getColor() == this->orderColor)
			{
				kingX = i;
				kingY = j;
			}
		}
	}

	for (int j = 0; j < 8; j++)
	{
		for (int i = 7; i >= 0; i--)
		{
			if (this->pieces[i][j].getType() != 0 && this->pieces[i][j].getColor() != this->orderColor)
			{
				switch (this->pieces[i][j].getType())
				{
				case 1:
					return movablePawn(i, j, kingX, kingY);
					break;
				case 2:
					return movableKnight(i, j, kingX, kingY);
					break;
				case 3:
					return movableBishop(i, j, kingX, kingY);
					break;
				case 4:
					return movableRook(i, j, kingX, kingY);
					break;
				case 5:
					return movableQueen(i, j, kingX, kingY);
					break;
				default:
					break;
				}
			}
		}
	}
	return false;
}

bool Board::checkMate()
{

	int kingX = -1, kingY = -1;

	for (int j = 0; j < 8; j++)
	{
		for (int i = 7; i >= 0; i--)
		{
			if (this->pieces[i][j].getType() == 6 && this->pieces[i][j].getColor() == this->orderColor)
			{
				kingX = i;
				kingY = j;
			}
		}
	}

	for (int j = 0; j < 8; j++)
	{
		for (int i = 0; i < 8; i++)
		{
			if (this->pieces[i][j].getType() != 0)
			{
				if (this->pieces[i][j].getColor() != this->pieces[kingX][kingY].getColor())
				{
					switch (this->pieces[i][j].getType())
					{
					case 1:
						if (movablePawn(i, j, kingX, kingY))
						{
							this->checkPieces.push_back({Vec2(i, j)});
						}
						break;
					case 2:
						if (movableKnight(i, j, kingX, kingY))
						{
							this->checkPieces.push_back({Vec2(i, j)});
						}
						break;
					case 3:
						if (movableBishop(i, j, kingX, kingY))
						{
							list<Vec2> tmpList = {};
							if (i > kingX)
							{
								if (j > kingY)
								{
									for (int y = j; y > kingY; y--)
									{
										tmpList.push_back(Vec2(i + y - j, y));
									}
								}
								else if (j < kingY)
								{
									for (int y = j; y < kingY; y++)
									{
										tmpList.push_back(Vec2(i + j - y, y));
									}
								}
							}
							else
							{ // i < kingX | j > kingY
								if (j > kingY)
								{
									for (int y = j; y > kingY; y--)
									{
										tmpList.push_back(Vec2(i + j - y, y));
									}
								}
								else if (j < kingY)
								{ // i < kingX | j < kingY
									for (int y = j; y < kingY; y++)
									{
										tmpList.push_back(Vec2(i + y - j, y));
									}
								}
							}

							if (tmpList.size() > 0)
							{
								this->checkPieces.push_back(tmpList);
							}
						}
						break;
					case 4:
						if (movableRook(i, j, kingX, kingY))
						{
							list<Vec2> tmpList = {};
							if (i == kingX)
							{
								if (j < kingY)
								{
									for (int y = j; y < kingY; y++)
									{
										tmpList.push_back(Vec2(i, y));
									}
								}
								else
								{
									for (int y = j; y > kingY; y--)
									{
										tmpList.push_back(Vec2(i, y));
									}
								}
							}
							else
							{
								if (i < kingX)
								{
									for (int x = i; x < kingX; x++)
									{
										tmpList.push_back(Vec2(x, j));
									}
								}
								else
								{
									for (int x = i; x > kingX; x--)
									{
										tmpList.push_back(Vec2(x, j));
									}
								}
							}
							if (tmpList.size() > 0)
							{
								this->checkPieces.push_back(tmpList);
							}
						}
						break;
					case 5:
						if (movableQueen(i, j, kingX, kingY))
						{
							list<Vec2> tmpList = {};
							if (j > kingY)
							{
								if (i > kingX)
								{
									for (int y = j; y > kingY; y--)
									{
										tmpList.push_back(Vec2(i + y - j, y));
									}
								}
								else if (i < kingX)
								{
									for (int y = j; y < kingY; y++)
									{
										tmpList.push_back(Vec2(i + j - y, y));
									}
								}
								else
								{
									for (int y = j; y > kingY; y--)
									{
										tmpList.push_back(Vec2(i, y));
									}
								}
							}
							else if (j < kingY)
							{
								if (i > kingX)
								{
									for (int y = j; j < kingY; y++)
									{
										tmpList.push_back(Vec2(i + j - y, y));
									}
								}
								else if (i < kingX)
								{
									for (int y = j; j < kingY; y++)
									{
										tmpList.push_back(Vec2(i + y - j, y));
									}
								}
								else
								{
									for (int y = j; y < kingY; y++)
									{
										tmpList.push_back(Vec2(i, y));
									}
								}
							}
							else
							{
								if (i > kingX)
								{
									for (int x = i; x > kingX; x--)
									{
										tmpList.push_back(Vec2(x, j));
									}
								}
								else if (i < kingX)
								{
									for (int x = i; x < kingX; x++)
									{
										tmpList.push_back(Vec2(x, j));
									}
								}
								else
								{
									continue;
								}
							}
							if (tmpList.size() > 0)
							{
								this->checkPieces.push_back(tmpList);
							}
						}
						break;
					default:
						break;
					}
				}
			}
		}
	}

	if (this->checkPieces.size() == 0)
	{
		return false;
	}
	else if (this->checkPieces.size() > 0)
	{

		list<Vec2> tmpKing;

		for (int k = -1; k < 2; k++)
		{
			for (int l = -1; l < 2; l++)
			{
				if ((kingX + k) < 8 && (kingX + k) > -1 && (kingY + l) > -1 && (kingY + l) < 8)
				{
					if (movableKing(kingX, kingY, kingX + k, kingY + l))
					{
						tmpKing.push_back(Vec2(kingX + k, kingY + l));
					}
				}
			}
		}

		for (list<list<Vec2>>::iterator y = this->checkPieces.begin(); y != this->checkPieces.end(); y++)
		{
			for (list<Vec2>::iterator x = (*y).begin(); x != (*y).end(); x++)
			{
				if (static_cast<int>(tmpKing.size()) > 0)
				{
					for (list<Vec2>::iterator z = tmpKing.begin(); z != tmpKing.end(); z++)
					{
						if ((*x).getX() == (*z).getX() && (*x).getY() == (*z).getY())
						{
							if (this->pieces[(*x).getX()][(*x).getY()].getType() == 0)
							{
								tmpKing.erase(z);
								break;
							}
							else if (abs(kingX - (*x).getX()) > 1 || abs(kingX - (*x).getX()) > 1)
							{
								tmpKing.erase(z);
								break;
							}
						}
					}
				}
			}
		}

		if (static_cast<int>(tmpKing.size()) > 0)
		{
			return false;
		}

		if (this->checkPieces.size() == 1)
		{
			bool a = false;
			for (list<list<Vec2>>::iterator y = this->checkPieces.begin(); y != this->checkPieces.end(); y++)
			{
				for (list<Vec2>::iterator x = (*y).begin(); x != (*y).end(); x++)
				{
					for (int j = 0; j < 8; j++)
					{
						for (int i = 0; i < 8; i++)
						{
							if (this->pieces[i][j].getType() != 0)
							{
								if (this->pieces[i][j].getColor() == this->orderColor)
								{
									switch (this->pieces[i][j].getType())
									{
									case 1:
										a |= movablePawn(i, j, (*x).getX(), (*x).getY());
										break;
									case 2:
										a |= movableKnight(i, j, (*x).getX(), (*x).getY());
										break;
									case 3:
										a |= movableBishop(i, j, (*x).getX(), (*x).getY());
										break;
									case 4:
										a |= movableRook(i, j, (*x).getX(), (*x).getY());
										break;
									case 5:
										a |= movableQueen(i, j, (*x).getX(), (*x).getY());
										break;
									}
								}
							}
						}
					}
				}
			}
			return !a;
		}
	}
	return false;
}

bool Board::movablePawn(int x, int y, int x2, int y2)
{
	Piece selectedPiece = this->pieces[x][y];
	Piece targetPiece = this->pieces[x2][y2];

	if (this->pieces[x][y].getDidMove())
	{
		if (abs(y - y2) > 1)
		{
			return false;
		}
	}
	else
	{
		if (abs(y - y2) > 2)
		{
			return false;
		}
	}

	if (this->ep && selectedPiece.getColor() != this->epColor && this->epX == x2)
	{
		if (this->epColor)
		{
			if (this->epY == (y2 + 1))
			{
				this->pieces[epX][epY] = Piece();
				return true;
			}
		}
		else
		{
			if (this->epY == (y2 - 1))
			{ // 5 4
				this->pieces[epX][epY] = Piece();
				return true;
			}
		}
	}

	if (selectedPiece.getColor())
	{ // TODO
		if (y == 1)
		{
			if (y2 == 3 && targetPiece.getType() == 0)
			{
				this->ep = true;
				this->epX = x2;
				this->epY = y2;
				this->epColor = selectedPiece.getColor();
				return true;
			}
			else
			{
				return (y2 - y == 1) && ((abs(x2 - x) == 1 && targetPiece.getType() != 0) || ((x2 - x) == 0 && targetPiece.getType() == 0));
			}
		}
		else
		{
			return (y2 - y == 1) && ((abs(x2 - x) == 1 && targetPiece.getType() != 0) || ((x2 - x) == 0 && targetPiece.getType() == 0));
		}
	}
	else
	{
		if (y == 6)
		{
			if (y2 == 4 && targetPiece.getType() == 0)
			{
				this->ep = true;
				this->epX = x2;
				this->epY = y2;
				this->epColor = selectedPiece.getColor();
				return true;
			}
			else
			{
				return (y - y2 == 1) && ((abs(x2 - x) == 1 && targetPiece.getType() != 0) || ((x2 - x) == 0 && targetPiece.getType() == 0));
			}
		}
		else
		{
			return (y - y2 == 1) && ((abs(x2 - x) == 1 && targetPiece.getType() != 0) || ((x2 - x) == 0 && targetPiece.getType() == 0));
		}
	}
}

bool Board::movableKnight(int x, int y, int x2, int y2)
{
	bool a = y == y2 + 2 && x == x2 + 1;
	bool b = y == y2 + 2 && x == x2 - 1;
	bool c = y == y2 + 1 && x == x2 + 2;
	bool d = y == y2 - 1 && x == x2 + 2;
	bool e = y == y2 - 2 && x == x2 + 1;
	bool f = y == y2 - 2 && x == x2 - 1;
	bool g = y == y2 + 1 && x == x2 - 2;
	bool h = y == y2 - 1 && x == x2 - 2;
	bool i = y == y2 && x == x2;

	return (a || b || c || d || e || f || g || h) ^ i;
}

bool Board::movableBishop(int x, int y, int x2, int y2)
{
	Piece selectedPiece = this->pieces[x][y];
	Piece targetPiece = this->pieces[x2][y2];

	bool a = x - y == x2 - y2;
	bool b = y + x == y2 + x2;
	bool c = y == y2 && x == x2;

	if (a)
	{
		if (y > y2)
		{
			for (int j = y2 + 1; j < y; j++)
			{ // 0 0 2 2
				if (this->pieces[x2 + j - y2][j].getType() != 0)
				{
					return false;
				}
			}
		}
		else if (y < y2)
		{
			for (int j = y + 1; j < y2; j++)
			{ // 0 0 2 2
				if (this->pieces[x + j - y][j].getType() != 0)
				{
					return false;
				}
			}
		}
	}

	if (b)
	{
		if (y > y2)
		{
			for (int j = y2 + 1; j < y; j++)
			{
				if (this->pieces[x2 + y2 - j][j].getType() != 0)
				{
					return false;
				}
			}
		}
		else if (y < y2)
		{
			for (int j = y + 1; j < y2; j++)
			{ // x1:2 y1:0 - x2:0 y2:2
				if (this->pieces[x + y - j][j].getType() != 0)
				{
					return false;
				}
			}
		}
	}

	return (a || b) ^ c;
}

bool Board::movableRook(int x, int y, int x2, int y2)
{

	if (x == x2)
	{
		if (y > y2)
		{
			for (int j = y2 + 1; j < y; j++)
			{
				if (this->pieces[x][j].getType() != 0)
				{
					return false;
				}
			}
			return true;
		}
		else if (y2 > y)
		{
			for (int j = y + 1; j < y2; j++)
			{
				if (this->pieces[x][j].getType() != 0)
				{
					return false;
				}
			}
		}
		else
		{
			return false;
		}
	}
	else if (y == y2)
	{
		if (x > x2)
		{
			for (int j = x2 + 1; j < x; j++)
			{
				if (this->pieces[j][y].getType() != 0)
				{
					return false;
				}
			}
		}
		else if (x2 > x)
		{
			for (int j = x + 1; j < x2; j++)
			{
				if (this->pieces[j][y].getType() != 0)
				{
					return false;
				}
			}
		}
		else
		{
			return false;
		}
	}
	else
	{
		return false;
	}

	return true;
}

bool Board::movableQueen(int x, int y, int x2, int y2)
{
	Piece selectedPiece = this->pieces[x][y];
	Piece targetPiece = this->pieces[x2][y2];

	if (x > x2)
	{
		if (y > y2)
		{
			if (x - y == x2 - y2)
			{
				for (int j = y2 + 1; j < y; j++)
				{
					if (this->pieces[x2 + j - y2][j].getType() != 0)
					{
						return false;
					}
				}
				return true;
			}
			return false;
		}
		else if (y < y2)
		{
			if (x + y == x2 + y2)
			{
				for (int j = y + 1; j < y2; j++)
				{
					if (this->pieces[x + y - j][j].getType() != 0)
					{
						return false;
					}
				}
				return true;
			}
			return false;
		}
		else
		{
			for (int j = x2 + 1; j < x; j++)
			{
				if (this->pieces[j][y].getType() != 0)
				{
					return false;
				}
			}
			return true;
		}
	}
	else if (x < x2)
	{
		if (y > y2)
		{
			if (x + y == x2 + y2)
			{
				for (int j = y2 + 1; j < y; j++)
				{
					if (this->pieces[x2 + y2 - j][j].getType() != 0)
					{
						return false;
					}
				}
				return true;
			}
			return false;
		}
		else if (y < y2)
		{
			if (x - x2 == y - y2)
			{
				for (int j = y + 1; j < y2; j++)
				{
					if (this->pieces[x + j - y][j].getType() != 0)
					{
						return false;
					}
				}
				return true;
			}
			return false;
		}
		else
		{
			for (int j = x + 1; j < x2; j++)
			{
				if (this->pieces[j][y].getType() != 0)
				{
					return false;
				}
				return true;
			}
		}
	}
	else
	{
		if (y > y2)
		{
			for (int j = y2 + 1; j < y; j++)
			{
				if (this->pieces[x][j].getType() != 0)
				{
					return false;
				}
			}
			return true;
		}
		else if (y < y2)
		{
			for (int j = y + 1; j < y2; j++)
			{
				if (this->pieces[x][j].getType() != 0)
				{
					return false;
				}
			}
			return true;
		}
		else
		{
			return false;
		}
	}
	return false;
}

bool Board::movableKing(int x, int y, int x2, int y2)
{
	Piece selectedPiece = this->pieces[x][y];
	Piece targetPiece = this->pieces[x2][y2];

	if (selectedPiece.getColor() == targetPiece.getColor())
	{
		return false;
	}

	if (x == x2 && y == y2)
	{
		return false;
	}

	if (!selectedPiece.getDidMove() && y == y2)
	{

		bool a = true;
		if (x2 == 1)
		{
			if (!checkRok(1, y))
			{
				for (int i = x - 1; i > x2; i--)
				{
					if (this->pieces[i][y].getType() != 0)
					{
						a = false;
					}
				}
				if (a)
				{
					this->rok = true;
					return true;
				}
			}
		}
		else if (x2 == 3)
		{
			if (!checkRok(3, y))
			{
				for (int i = x + 1; i < x2; i++)
				{
					if (this->pieces[i][y].getType() != 0)
					{
						a = false;
					}
				}
				if (a)
				{
					this->rok = true;
					return true;
				}
			}
		}
	}

	return (abs(y2 - y) <= 1 && abs(x2 - x) <= 1);
}

bool Board::checkRok(int x, int y)
{
	for (int j = 0; j < 8; j++)
	{
		for (int i = 0; i < 8; i++)
		{
			if (this->pieces[i][j].getColor() != this->orderColor)
			{
				switch (this->pieces[i][j].getType())
				{
				case 1:
					return movablePawn(i, j, x, y);
					break;
				case 2:
					return movableKnight(i, j, x, y);
					break;
				case 3:
					return movableBishop(i, j, x, y);
					break;
				case 4:
					return movableRook(i, j, x, y);
					break;
				case 5:
					return movableQueen(i, j, x, y);
					break;
				default:
					continue;
				}
			}
		}
	}
	return false;
}

void Board::setWhiteTime()
{
	clock_t now = clock();
	double dif = (double)(this->whiteTime - now + this->lastMoveTime);

	cout << "kalan zaman: " << dif << endl;

	if (dif > 0)
	{
		this->whiteTime -= (now - this->lastMoveTime);
	}
	else
	{
		this->orderColor = true;
		this->mate = true;
	}
	this->lastMoveTime = clock();
}

void Board::setBlackTime()
{
	clock_t now = clock();
	double dif = (double)(this->blackTime + this->lastMoveTime - now);

	cout << "kalan zaman: " << dif << endl;

	if (dif > 0)
	{
		this->blackTime -= (now - this->lastMoveTime);
	}
	else
	{
		this->orderColor = false;
		this->mate = true;
	}
	this->lastMoveTime = clock();
}

double Board::getWhiteTime()
{
	return (double)this->whiteTime / CLOCKS_PER_SEC;
}

double Board::getBlackTime()
{
	return (double)this->blackTime / CLOCKS_PER_SEC;
}