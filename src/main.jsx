import React from "react";
import ReactDOM from "react-dom/client";

function Sq(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Bd extends React.Component {
  renderSq(i) {
    return (
      <Sq 
        value={this.props.sqb[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSq(0)}
          {this.renderSq(1)}
          {this.renderSq(2)}
        </div>
        <div className="board-row">
          {this.renderSq(3)}
          {this.renderSq(4)}
          {this.renderSq(5)}
        </div>
        <div className="board-row">
          {this.renderSq(6)}
          {this.renderSq(7)}
          {this.renderSq(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history : [{
        sqs: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext : true,
    }
  }

  handleClick(i) {
    const h = this.state.history.slice(0, this.state.stepNumber + 1);
    const c = h[h.length - 1];
    const sq = c.sqs.slice();

    if (calcWin(sq) || sq[i]) {
      return;
    }

    sq[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: h.concat([{
        sqs: sq
      }]),
      stepNumber: h.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(s) {
    this.setState({
      stepNumber: s,
      xIsNext: (s % 2) === 0,
    })
  }

  render() {
    const h = this.state.history;
    const c = h[this.state.stepNumber];
    const w = calcWin(c.sqs);
    
    const ms = h.map((s, m) => {
      const d = m ? 'Go to move #' + m : 'Go to game start';
      return (
        <li key={m}>
          <button onClick={() => this.jumpTo(m)}>{d}</button>
        </li>
      );
    });

    let s;
    if (w) {
      s = 'Winnder: ' + w;
    } else {
      s = "Next player: " + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Bd 
            sqb={c.sqs}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{s}</div>
          <ol>{ms}</ol>
        </div>
      </div>
    );
  }
}

function calcWin(sq) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if(sq[a] && sq[a] == sq[b] && sq[a] == sq[c]) {
      return sq[a];
    }
  }
  return null;
 }

ReactDOM.createRoot(document.getElementById('root')).render(
  <Game />
)
