import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';

function Square (props) {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {

	handleClick(i) {
		const squares = this.state.squares.slice();
	    if (calculateWinner(squares) || squares[i]) {
	      return;
	    }
		
		squares[i] = this.state.xIsNext ? 'X':'O';
		this.setState({
			squares:squares,
			xIsNext: !this.state.xIsNext,
		});
	}
	
	renderSquare(i){
		return (
			<Square
				value={this.props.squares[i]} 
				onClick={()=>this.props.onClick(i)}
			/>
		)
	}
	
	renderRow(i) {
		return (
			<div className="bord-row">
				{this.renderSquare(0+i*10)}
				{this.renderSquare(1+i*10)}
				{this.renderSquare(2+i*10)}
				{this.renderSquare(3+i*10)}
				{this.renderSquare(4+i*10)}
				{this.renderSquare(5+i*10)}
				{this.renderSquare(6+i*10)}
				{this.renderSquare(7+i*10)}
				{this.renderSquare(8+i*10)}
				{this.renderSquare(9+i*10)}
			</div>
		)
	}
	
	render(){
		return (
			<div>
				<div className="status">{status}</div>		
				{this.renderRow(0)}
				{this.renderRow(1)}
				{this.renderRow(2)}
				{this.renderRow(3)}
				{this.renderRow(4)}
				{this.renderRow(5)}
				{this.renderRow(6)}
				{this.renderRow(7)}
				{this.renderRow(8)}
				{this.renderRow(9)}
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history:[{
				squares: Array(100).fill(null),
			}],
			stepNumber: 0,
			xIsNext:true,
			winner:null,
		};
	}
	
	handleClick(i) {
		const history = this.state.history.slice(0,this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if(squares[i] || this.state.winner){
			return;
		}
		
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		const winner  = this.calculateWinner(squares,i);
		this.setState({
			history: history.concat([{
				squares:squares,
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
			winner:winner,
		});
	}
	
	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		});
	}
	
	calculateWinner(squares,i) {
		if(i < 0 || i >= squares.length){
			return null;
		}
		const point = 0;
		const winstep = 4;
		const x = Math.floor(i/10);
		const y = i%10;
		const value = squares[i];
		if(!value){
			return null;
		}
		
		let mergeAll = [];		
		for(let j=1; j <= winstep; j++){
			let merge = [];
			if(y-j>=0){
				if(x-j>=0 && squares[(x-j)*10 + y-j]){
					merge.push({index:(x-j)*10 + y-j,x:x-j,y:y-j,d:'A'});
				}
				if(squares[x*10 + y-j]){
					merge.push({index:x*10 + y-j,x:x,y:y-j,d:'B'});
				}
				if(x+j<=9 && squares[(x+j)*10 + y-j]){
					merge.push({index:(x+j)*10 + y-j,x:x+j,y:y-j,d:'C'});
				}
			} 
			
			if(x+j<=9 && squares[(x+j)*10 + y]){
				merge.push({index:(x+j)*10 + y,x:x+j,y:y,d:'D'});
			}
			 
			if(y+j<=9){
			 	if(x+j<=9 && squares[(x+j)*10 + y+j]){
				 	merge.push({index:(x+j)*10 + y+j,x:x+j,y:y+j,d:'E'});
				}
				if(squares[x*10 + y+j]){					
					merge.push({index:x*10 + y+j,x:x,y:y+j,d:'F'});
				}
			 	if(x-j>=0 && squares[(x-j)*10 + y+j]){
				 	merge.push({index:(x-j)*10 + y+j,x:x-j,y:y+j,d:'G'});
				}
			}
			 
		 	if(x-j>=0 && squares[(x-j)*10 + y]){
			 	merge.push({index:(x-j)*10 + y,x:x-j,y:y,d:'H'});
			}

			mergeAll.push(merge);
		}
		
		let inner1 = mergeAll[winstep-1];
		if(inner1.length < 1){
			return null;
		}
		
		for(let j = 0; j < inner1.length; j++){
			let pp = inner1[j];
			let cValue = squares[pp.index];
			if(!cValue || cValue!=value){
				continue;
			}
			
			let pp2 = this.getNextPiontByDirection(mergeAll[winstep-2],pp.d);
			if(!pp2 || squares[pp2.index]!=value){
				continue;
			}
			
			let pp3 = this.getNextPiontByDirection(mergeAll[winstep-3],pp2.d);
			if(!pp3 || squares[pp3.index]!=value){
				continue;
			}
			
			let pp4 = this.getNextPiontByDirection(mergeAll[winstep-4],pp3.d);
			if(!pp4 || squares[pp4.index]!=value){
				continue;
			}
			return value;
		}
	  	return null;
	}
	
	getNextPiontByDirection(pointArray,direction){
		for(let i = 0 ; i < pointArray.length;  i++){
			let pp = pointArray[i];
			if(pp && pp.d == direction){
				return pp;
			}
		}
		return null;
	}
	
	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner  = this.state.winner;
		
		const moves = history.map((step,move) => {
			const desc = move ?
				'Go to move #'+ move :
				'Go to game start';
			return (
				<li key={move}>
					<button onClick={()=>this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});
		
		let status;
		if(winner) {
			status = 'Winner: '+winner;
		} else {
			status = 'Next player: '+(this.state.xIsNext ? 'X' : 'O');
		}
		
		return (
			<div>
				<div className="game" >
					<div className="game-board" >
						<div>{status} <button className="resetButton" onClick={()=>this.jumpTo(0)}>Restart</button></div>
						<Board 
							squares={current.squares}
							onClick={(i) => this.handleClick(i)}
						/>
					</div>
				</div>
				<div className="game-info">
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}


render(<Game />, document.getElementById('root'));
