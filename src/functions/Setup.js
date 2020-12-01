const wPawn = {
    name: "pawn",
    color: true,
    moved: false,
    char: "p",
    value: 1
}
const bPawn = {
    name: "pawn",
    color: false,
    moved: false,
    char: "o",
    value: -1
}

const wRook = {
    name: "rook",
    color: true,
    moved: false,
    char: "r",
    value: 5.63
}
const bRook = {
    name: "rook",
    color: false,
    moved: false,
    char: "t",
    value: -5.63
}

const wKing = {
    name: "king",
    color: true,
    moved: false,
    char: "k",
    value: 0
}
const bKing = {
    name: "king",
    color: false,
    moved: false,
    char: "l",
    value: 0
}

const wBishop = {
    name: "bishop",
    color: true,
    moved: false,
    char: "b",
    value: 3.33
}
const bBishop = {
    name: "bishop",
    color: false,
    moved: false,
    char: "v",
    value: -3.33
}

const wKnight = {
    name: "knight",
    color: true,
    moved: false,
    char: "n",
    value: 3.05
}
const bKnight = {
    name: "knight",
    color: false,
    moved: false,
    char: "m",
    value: -3.05
}

const wQueen = {
    name: "queen",
    color: true,
    moved: false,
    char: "q",
    value: 9.5
}
const bQueen = {
    name: "queen",
    color: false,
    moved: false,
    char: "w",
    value: -9.5
}

export const defBoard = [
    [bRook, bKnight, bBishop, bQueen, bKing, bBishop, bKnight, bRook],
    [bPawn, bPawn, bPawn, bPawn, bPawn, bPawn, bPawn, bPawn],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [wPawn, wPawn, wPawn, wPawn, wPawn, wPawn, wPawn, wPawn],
    [wRook, wKnight, wBishop, wQueen, wKing, wBishop, wKnight, wRook]
]

export const defDots = [
    [6, 0, 5, 0], [6, 0, 4, 0],
    [6, 1, 5, 1], [6, 1, 4, 1],
    [6, 2, 5, 2], [6, 2, 4, 2],
    [6, 3, 5, 3], [6, 3, 4, 3],
    [6, 4, 5, 4], [6, 4, 4, 4],
    [6, 5, 5, 5], [6, 5, 4, 5],
    [6, 6, 5, 6], [6, 6, 4, 6],
    [6, 7, 5, 7], [6, 7, 4, 7],
    [7, 1, 5, 0], [7, 1, 5, 2],
    [7, 6, 5, 5], [7, 6, 5, 7]
]