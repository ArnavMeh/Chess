var row, col, board, selectedPiece; //bs that needs to be optimized




//chess algo
export const ComputerV2 = (color, b, depth) => {//color to move on board
    if (color) { var mult = 1; } else { var mult = -1; }
    var currentEval = evaluate(b);

    var myPoss = possBoards(color, b, false);

    if (myPoss.length != 0) {
        const a1 = {
            newBoard: b,
            nextBoards: []
        };
    
        for (var x=0; x<myPoss.length; x++) {
            var myMove = myPoss[x];
            var oppPoss = possBoards(!color, myMove.newBoard, true);
            if (oppPoss.length == 0) {
                if (isThreatened("king", !color, myMove.newBoard, false)) {
                    return {
                        move: [myMove.move],
                        e: 10000*mult
                    };
                }
            } else {
                if (depth > 1) {
                    for (var i=0; i<oppPoss.length; i++) {
                        var oppMove = oppPoss[i];
                        var myBestMove = ComputerV2(color, oppMove.newBoard, (depth-1));
                        
                        if (myBestMove) {
                            oppPoss[i].e = myBestMove.e;
                        } else {
                            oppPoss[i].e = -10000*mult;
                        }
                    }
                } else {
                    for (var i=0; i<oppPoss.length; i++) {
                        var e = evaluate(oppPoss[i].newBoard)*mult;

                        if (e > currentEval) {
                            return {
                                move: [myMove.move],
                                e: e
                            };
                        } else {
                            oppPoss[i].e = e;
                        }
                    }
                }
                a1.nextBoards.push({
                    ...myMove,
                    nextBoards: oppPoss
                });
            }
        }

        return miniMax(a1);
    }
}

const miniMax = (tree) => {
    var max = {
        move: tree.nextBoards[0].move,
        e: -10000
    };
    for (var x in tree.nextBoards) {

        var min = {
            move: tree.nextBoards[x].nextBoards[0].move,
            e: 10000
        };
        for (var y in tree.nextBoards[x].nextBoards) {
            var base = tree.nextBoards[x].nextBoards[y];
            var e = base.e;

            if (e < min.e) {
                min = {
                    move: base.move,
                    e: e
                };
            }
        }
        if (max.e < min.e) {
            max = {
                move: [tree.nextBoards[x].move],
                e: min.e
            };
        } else if (max.e == min.e) {
            max.move.push(tree.nextBoards[x].move);
        }
    }

    return max;
}

const possBoards = (color, b, toEval) => {//color to move on board
    const possBoards = [];
    var moves = allPossibleMoves(color, b).movelist;
    var movesLen = moves.length;

    var i=0;
    while (i<movesLen) {
        var theorBoard=[[...b[0]], [...b[1]], [...b[2]], [...b[3]], [...b[4]], [...b[5]], [...b[6]], [...b[7]]];
        theorBoard = movePiece(moves[i][0], moves[i][1], moves[i][2], moves[i][3], theorBoard);
        if (toEval) {
            possBoards.push({
                move: [moves[i][0], moves[i][1], moves[i][2], moves[i][3]],
                newBoard: theorBoard,
                e: evaluate(theorBoard),
                nextBoards: []
            });
        } else {
            possBoards.push({
                move: [moves[i][0], moves[i][1], moves[i][2], moves[i][3]],
                newBoard: theorBoard,
                nextBoards: []
            });
        }
        i++;
    }
    return (possBoards)
}
const movePiece = (r, c, toR, toC, b) => {
    var p = b[r][c];
    if (p.name == "king" && Math.abs(c-toC) > 1) {
        if (toC == 6) {
            var rookCol = 7, newRookCol = 5;
        } else { //colindex = 2
            var rookCol = 0, newRookCol = 3;
        }
        b[toR][newRookCol] = {...b[toR][rookCol], moved: true};
        b[toR][rookCol] = null;
    } else {
        if (p.name=="pawn" && toR == 0) {
            p = {name: "queen", color: true, moved: true, char: "q"};
        } else if (p.name=="pawn" && toR == 7) {
            p = {name: "queen", color: false, moved: true, char: "w"};
        }
    }
    b[toR][toC] = {...p, moved: true};
    b[r][c] = null;
    return b;
}
const evaluate = (b) => {
    var evaluation = 0;
    var r=0;
    while (r != 8) {
        var c=0;
        while (c != 8) {
            var p = b[r][c];
            if (p) {
                evaluation += p.value;
            }
            c++;
        }
        r++;
    }
    return evaluation;
}







//moves
export const allPossibleMoves = (color, b) => {
    board = b;
    var movelist = [];
    var evaluation = 0;

    var r=0;
    while (r != 8) {
        var c=0;
        while (c != 8) {
            selectedPiece = board[r][c];
            row = r;
            col = c;

            if (selectedPiece) {
                evaluation += selectedPiece.value;

                if (selectedPiece.color == color) {
                    var name = selectedPiece.name;
                    
                    if (name == "pawn") {
                        movelist = [...movelist, ...filterList(pawnMoves(), selectedPiece, r, c)];
                    } else if (name == "knight") {
                        movelist = [...movelist, ...filterList(knightMoves(), selectedPiece, r, c)];
                    } else if (name == "rook") {
                        movelist = [...movelist, ...filterList(rookMoves(), selectedPiece, r, c)];
                    } else if (name == "king") {
                        movelist = [...movelist, ...filterList(kingMoves(), selectedPiece, r, c)];
                    } else if (name == "bishop") {
                        movelist = [...movelist, ...filterList(bishopMoves(), selectedPiece, r, c)];
                    } else if (name == "queen") {
                        movelist = [...movelist, ...filterList(bishopMoves(), selectedPiece, r, c), ...filterList(rookMoves(), selectedPiece, r, c)];
                    }
                }
            }
            
            c++;
        }
        r++;
    }

    return {movelist, evaluation}
}
const filterList = (movelist, p, r, c) => {
    const newMoveList=[];
    var x=0, len=movelist.length;

    while (x<len) {
        
        var theorBoard=[
            [...board[0]], [...board[1]], [...board[2]], [...board[3]],
            [...board[4]], [...board[5]], [...board[6]], [...board[7]]
        ];
        var moveRow = movelist[x][0];
        var moveCol = movelist[x][1];

        theorBoard[moveRow][moveCol] = p;
        theorBoard[r][c] = null;
        var threatenedSquares = threats(!p.color, theorBoard);

        if (!isThreatened("king", p.color, theorBoard, threatenedSquares)) {
            newMoveList.push([r, c, moveRow, moveCol]);
        }
        x++;
    } 
    
    return newMoveList;
}




export const isThreatened = (name, color, b, threatenedSquares) => {
    if (threatenedSquares == false) {
        threatenedSquares = threats(!color, b);
    }
    var x=0, len=threatenedSquares.length;
    while (x<len) {
        var pRow = threatenedSquares[x][0];
        var pCol = threatenedSquares[x][1];
        var piece = b[pRow][pCol];
        if (piece) {
            if (piece.name == name && piece.color == color) {
                return [pRow, pCol];
            }
        }
        x++;
    }
    return false;
}
const threats = (color, b) => {
    var threatenedSquares = [];

    var rowTemp=row;
    var colTemp=col;
    var selectedTemp=selectedPiece;
    var boardTemp=board;
    board=b;

    var r=0;
    while (r != 8) {
        var c=0;
        while (c != 8) {
            row=r;
            col=c;
            selectedPiece = b[r][c];
            
            if (selectedPiece) {
                var name = selectedPiece.name;

                if (selectedPiece.color == color) {
                    if (name == "pawn") {
                        threatenedSquares = [...threatenedSquares, ...pawnThreats(color)];
                    } else if (name == "knight") {
                        threatenedSquares = [...threatenedSquares, ...knightMoves()];
                    } else if (name == "rook") {
                        threatenedSquares = [...threatenedSquares, ...rookMoves()];
                    } else if (name == "king") {
                        threatenedSquares = [...threatenedSquares, ...singleMover([[-1, -1], [-1, 0], [-1, 1], [0, 1], [0, -1], [1, -1], [1, 0], [1, 1]], [], true)];
                    } else if (name == "bishop") {
                        threatenedSquares = [...threatenedSquares, ...bishopMoves()];
                    } else if (name == "queen") {
                        threatenedSquares = [...threatenedSquares, ...bishopMoves(), ...rookMoves()];
                    }
                }
            }
            c++;
        }
        r++;
    }

    row=rowTemp;
    col=colTemp;
    selectedPiece=selectedTemp;
    board=boardTemp;

    return threatenedSquares; 
}




const singleMover = (moves, starting, takes) => {
    const dotArray = starting;
    var x=0, len = moves.length;

    while (x<len) {
        var r = row+moves[x][0];
        var c = col-moves[x][1];
        if (-1<r && r<8 && -1<c && c<8) {
            var l = board[r][c];
            if (l) {
                if (l.color !== selectedPiece.color) {
                    dotArray.push([r, c]);
                }
            } else if (takes) {
                dotArray.push([r, c]);
            }
        }
        x++;
    }

    return dotArray;
}

const kingMoves = () => {
    var threatenedSquares = threats(!selectedPiece.color, board)

    const canCastleThrough = (r1, start, end) => {
        var len=threatenedSquares.length;
        for (var x=start; x<=end; x++) {
            if (x!=4 && board[r1][x]) {
                return false;
            } else {
                var i=0;
                while (i<len) {
                    if (r1 == threatenedSquares[i][0] && x == threatenedSquares[i][1]) {
                        return false;
                    }
                    i++;
                }
            }
        }
        return true;
    }

    var dotArray = [];
    if (selectedPiece.color) { var r=7 } else { var r=0 }
    if (selectedPiece.moved == false && board[r][0]?.moved == false && canCastleThrough(r, 1, 4)) {
        dotArray.push([r, 2]);
    }
    if (selectedPiece.moved == false && board[r][7]?.moved == false && canCastleThrough(r, 4, 6)) {
        dotArray.push([r, 6]);
    }
    
    return singleMover([[-1, -1], [-1, 0], [-1, 1], [0, 1], [0, -1], [1, -1], [1, 0], [1, 1]], dotArray, true);
}

const pawnMoves = () => {
    var dotArray = [];
    if (selectedPiece.color) { var dir = -1; } else { var dir = 1; }

    if (0<row && row<9){
        if (!board[row+dir][col]) {
            dotArray.push([row+dir, col]);
            if (selectedPiece.moved == false) {
                if (!board[row+2*dir][col]) {
                    dotArray.push([row+2*dir, col]);
                }
            }
        }
    }

    return singleMover([[dir, 1], [dir, -1]], dotArray, false);
}
const pawnThreats = (color) => {
    if (color) { var dir = -1; } else { var dir = 1; }
    return singleMover([[dir, 1], [dir, -1]], [], true);
}

const knightMoves = () => {
    return singleMover([[-2, 1], [-2, -1], [-1, 2] ,[-1, -2], [1, -2], [1, 2], [2, 1], [2, -1]], [], true);
}



const multiMover = (moves, starting) => {
    const dotArray = starting;
    var x=0, len = moves.length;

    while (x<len) {
        var r = row;
        var c = col;
        var rowInc = moves[x][0];
        var colInc = moves[x][1];
        while (-1-rowInc<r && r<8-rowInc && -1-colInc<c && c<8-colInc && (!board[r][c] || (r==row && c==col))) {
            r+=rowInc;
            c+=colInc;
            if (board[r][c]) {
                if (board[r][c].color == !selectedPiece.color) {
                    dotArray.push([r, c]);
                }
            } else {
                dotArray.push([r, c]);
            }
        }
        x++;
    }

    return dotArray;
}

const rookMoves = () => {
    return multiMover([[1,0], [-1,0], [0,1], [0,-1]], []);
}

const bishopMoves = () => {
    return multiMover([[1,1], [1,-1], [-1,1], [-1,-1]], []);
}



   

const printer = (coordArr, name) => {
    var str = name + ": ";
    coordArr.map((x, index) => {
        x.map(elem => {
            str += elem
        });
        if (index !== coordArr.length-1) {
            str+=", ";
        }
    })

    if (str.length == 0) {
        console.log(str + "no items");
    } else {
        console.log(str);
    }
}