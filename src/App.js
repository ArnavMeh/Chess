import React, {useState, useEffect} from 'react';
import './App.css';
import {defBoard, defDots} from './functions/Setup';
import {isThreatened, allPossibleMoves, ComputerV2} from './functions/Move';

import {Table, Button, Progress, Radio, Slider} from 'antd'

const App = () => {
  
	const [board, setBoard] = useState({
		b: [
			[...defBoard[0]], [...defBoard[1]], 
			[...defBoard[2]], [...defBoard[3]], 
			[...defBoard[4]], [...defBoard[5]], 
			[...defBoard[6]], [...defBoard[7]]
		]
	});
	
	const [turn, setTurn] = useState(true);

	const [dots, setDots] = useState({moves: defDots});
	const [check, setCheck] = useState(false);
	const [selected, setSelected] = useState({row: null, col: null});
	const [history, setHistory] = useState([]);
	const [evaluation, setEvaluation] = useState(50);
	
	const [player1, setPlayer1] = useState("person");
	const [player2, setPlayer2] = useState("person");
	const [compTimer, setCompTimer] = useState(0);
	const [firstMove, setFirstMove] = useState(true);
	
	const Mover = (player) => {
		if (player !== "person") { 
			if (player == "level 2") { 
				var out = ComputerV2(turn, board.b, 2)
				var moves = out?.move;
				var val = out?.e/15+50;
			} else if (player == "level 1") {
				var out = ComputerV2(turn, board.b, 1);
				var moves = out?.move;
				var val = out?.e/15+50
			} else if (player == "level 0") {
				var out = allPossibleMoves(turn, board.b);
				var moves = out?.movelist;
				var val = out?.evaluation/15+50;
			}

			if (moves) {
				var move = moves[Math.floor(Math.random()*moves.length)];
				if (move) {
					movePiece(move[0], move[1], move[2], move[3]);
				} else {
					console.log("checkmate!");
				}
			}
			if (val > 100) {
				setEvaluation(100);
			} else if (val<0) {
				setEvaluation(0);
			} else {
				setEvaluation(val);
			}
		}
	}


	useEffect(() => {
		setTimeout(() => {
			if (firstMove) {
				Mover(player1);
				setFirstMove(false);
			} else {
				if (turn==true) {
					Mover(player1);
				}
				if (turn==false) {
					Mover(player2);
				}
			}
		}, compTimer);
	}, [turn, player1, player2, firstMove])


	const addHistory = (color, item) => {
		if (color) {
			var newHist = [...history, ...[{
				white: item,
				black: ""
			}]]

			setHistory(newHist)
		} else {
			var newHist = history
			newHist[newHist.length-1].black = item
			setHistory(newHist)
		}
	}

	const movePiece = (r, c, toR, toC) => {
		console.log(board.b[r][c])
		var p = board.b[r][c];

		if (p.name == "knight") {
			var pre = "Kn";
		} else if (p.name == "pawn") {
			var pre = "";
		} else {
			var pre = p.name.charAt(0).toUpperCase();
		}

		if (board.b[toR][toC]) {
			pre += "x"
		}

		if (p.name == "king" && Math.abs(c-toC) > 1) {
			if (toC == 6) {
				var rookCol = 7, newRookCol = 5;
				addHistory(p.color, "0-0");
			} else { //colindex = 2
				var rookCol = 0, newRookCol = 3;
				addHistory(p.color, "0-0-0");
			}
			board.b[toR][newRookCol] = {...board.b[toR][rookCol], moved: true};
			board.b[toR][rookCol] = null;
		} else {
			var add = ""
			if (p.name=="pawn" && toR == 0) {
				p = {name: "queen", color: true, moved: true, char: "q"};
				add = "Q";
			} else if (p.name=="pawn" && toR == 7) {
				p = {name: "queen", color: false, moved: true, char: "w"};
				add = "Q";
			}
			addHistory(p.color, pre + String.fromCharCode(97 +toC) + (8-toR) + add);
		}
		
		board.b[toR][toC] = {...p, moved: true};
		board.b[r][c] = null;
		
		var data = allPossibleMoves(!turn, board.b)
		setDots({moves: data.movelist});
		
		

		setCheck(isThreatened("king", !turn, board.b, false));
		setSelected({row: null, col: null});
		setTurn(!turn);
	}

	const click = (piece, rowIndex, colIndex, dotted, isSelected) => {
		if (selected.row !== null) { //piece already selected
			if (isSelected) { //clicked on same piece
				setSelected({row: null, col: null});
			} else if (piece?.color == turn) { //clicked on piece of their color
				setSelected({row: rowIndex, col: colIndex});
			} else if (dotted) { //clicked on moveable square
				movePiece(selected.row, selected.col, rowIndex, colIndex)
			} else { //click on other
				setSelected({row: null, col: null});
			}
		} else { //no piece already selected
			if (piece?.color == turn) { //clicked on piece of their color
				setSelected({row: rowIndex, col: colIndex});
			}
		}
	}
	
	const columns = [
		{
			title: "#",
			dataIndex: "#",
			align: "center",
			width: "35px",
			render: (text, record, index) => index+1
		},
		{
			title: "White",
			dataIndex: "white",
			align: "center"
		},
		{
			title: "Black",
			dataIndex: "black",
			align: "center"
		},
	]

	return (
		<div style={{background:"#f5f5f5", paddingBottom:"300px"}}>
			<div style={{display:"flex", alignItems:"center", flexDirection:"column", paddingTop:"100px"}}>

				<div style={{fontSize:"40px", fontWeight:"600", paddingBottom:"50px"}}>
					Very Bad Chess
				</div>
			
				<div style={{width: "890px", display:"flex", justifyContent:"space-between"}}>
					<div style={{width:"0px", display:"flex", alignItems:"center", marginRight:"10px"}}>
						<Progress
							type="line"
							strokeWidth={30}
							strokeLinecap="square"
							percent={evaluation}
							trailColor="#202020"
							strokeColor="#ffffff"
							showInfo={false}
							style={{
								transform: "rotate(-90deg) translateX(-320px)"
							}}
						/>
					</div>
					
					<div style={{
						width:"650px", height: "650px",
						display:"flex", flexDirection:"column",
						justifyContent:"center", alignItems:"center",
						borderWidth:"5px", borderStyle:"solid", borderRadius:"15px", 
						backgroundColor:"black"
					}}>
						{board.b.map((row, rowIndex) => 
							<div style={{display:"flex", justifyContent:"center"}}>
								{row.map((piece, colIndex) => {
									//square colors
									var inCheck = check && check[0] == rowIndex && check[1] == colIndex;
									if (inCheck) {
										var bgColor = "firebrick";
									} else if ((colIndex+rowIndex)%2 === 0) {
										var bgColor = "white", txtColor = "lightblue";
									} else {
										var bgColor = "lightblue", txtColor = "white";
									}
									
									//dots
									var dotted = dots.moves.findIndex(item => item[0]==selected.row && item[1]==selected.col && item[2]==rowIndex && item[3]==colIndex) !== -1;
									if (piece) {
										var dotColor = "maroon";
									} else {
										var dotColor = "slategray";
									}
									
									//selected
									var isSelected = selected.row == rowIndex && selected.col == colIndex;
									if (isSelected) {
										var imgWidth = "70px";
									} else {
										var imgWidth = "65px";
									}

									//centering
									if (piece?.name == "pawn") {
										var botMarg = "20px"; 
									} else if (piece?.name == "rook") {
										var botMarg = "10px"; 
									} else {
										var botMarg = "0px"; 
									}
									

									return (
										<div 
											style={{backgroundColor: bgColor, width:"80px", height:"80px", borderRadius:"10px", display:"flex", justifyContent:"center", alignItems:"center"}}
											onClick={() => { click(piece, rowIndex, colIndex, dotted, isSelected) }}
										>
											{dotted && 
												<div style={{position:"absolute", width:"25px", height:"25px", background: dotColor, borderRadius:"12.5px", opacity:".6"}}/>
											}
											{/* <div style={{position:"absolute", margin:"0 55px 55px 0", fontSize:"20px", color:txtColor}}>
												{rowIndex}, {colIndex}
											</div> */}
											{piece &&
												<div className="chess" style={{textAlign:"center", fontSize: imgWidth, marginBottom: botMarg}}>{piece.char}</div>
											}
										</div>
									);
								})}
							</div>
						)}
					</div>

					<div style={{width:"170px"}}>

						<Button style={{marginBottom:"15px", width: "100%"}} onClick={() => {
							setBoard({
								b: [
									[...defBoard[0]], [...defBoard[1]], 
									[...defBoard[2]], [...defBoard[3]], 
									[...defBoard[4]], [...defBoard[5]], 
									[...defBoard[6]], [...defBoard[7]]
								]
							});
							setCheck(false);
							if (turn == true) {
								setFirstMove(true);
							}
							setTurn(true);
							setHistory([]);
							setDots({moves: allPossibleMoves(true, defBoard).movelist});
							setEvaluation(50);
							
						}}>
							New Game
						</Button>

						<Radio.Group
							style={{width: "100%"}}
							defaultValue={player2} 
							onChange={e => setPlayer2(e.target.value)}
							size="small"
						>
							<Radio.Button style={{width: "40%", textAlign:"center"}} value="person">Person</Radio.Button>
							<Radio.Button style={{width: "30%", textAlign:"center"}} value="level 0">Lvl 0</Radio.Button>
							<Radio.Button style={{width: "30%", textAlign:"center"}} value="level 1">Lvl 1</Radio.Button>
							<Radio.Button style={{width: "30%", textAlign:"center"}} value="level 2">Lvl 2</Radio.Button>
						</Radio.Group>
						<Radio.Group
							style={{ width: "100%"}}
							defaultValue={player1} 
							onChange={e => setPlayer1(e.target.value)}
							size="small"
						>
							<Radio.Button style={{width: "40%", textAlign:"center"}} value="person">Person</Radio.Button>
							<Radio.Button style={{width: "30%", textAlign:"center"}} value="level 0">Lvl 0</Radio.Button>
							<Radio.Button style={{width: "30%", textAlign:"center"}} value="level 1">Lvl 1</Radio.Button>
							<Radio.Button style={{width: "30%", textAlign:"center"}} value="level 2">Lvl 2</Radio.Button>
						</Radio.Group>

						<Slider 
							style={{marginBottom:"15px"}}
							defaultValue={500-compTimer}
							max={500}
							min={0}
							onChange={val => setCompTimer(500-val)}
							tooltipVisible={false}
						/>

						<Table
							style={{width: "100%"}}
							dataSource={history}
							columns={columns}
							bordered={true}
							size="small"
							pagination={false}
							scroll={{ y: 430 }}
						/>
						
					</div>
				</div>


			</div>
		</div>
	);
}

export default App;
