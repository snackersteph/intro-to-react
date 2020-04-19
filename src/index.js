import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// In JavaScript classes, you will always need to call super when defining the constructor of a
// subclass. All React components that have a constructor should start with a super(props) call

// When you call setState in a component, React automatically updates the child components
// inside of it too

// The DOM <button> element's onClick attribute has a special meaning to React because it 
// is a built-in component

// Since the Square components no longer maintain state, the Square components receive values
// from the Board component and inform the Board component when they're clicked. In React 
// terms, the Square components are now controlled components
function Square(props) {
  return (
    <button 
      className="square"
      onClick={props.onClick}
    >
    {props.value}
    </button>
  )
}

// To collect data from multiple children, or to have two child components communicate with each 
// other, you need to declare the shared state in their parent component instead. The parent
// component can pass the state back down to the children by using props; this keeps the child 
// components in sync with each other and with the parent component
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    let status;
    if (winner) {
      status = 'Winner ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// key is a special and reserved property in React (along with ref, a more advanced feature).
// When an element is created, React extracts the key property and stores the key directly on the 
// returned element. Even though the key may look like it belongs in props, key cannot be 
// referenced using this.props.key. React automatically uses key to decide which components to
// update. A component cannot inquire about its key

// It is strongly recommended that you assign proper keys whenever you build dynamic lists

// Using the array index as a key is problematic when trying to re-order a list's items or inserting
// or removing list items. Keys do not need to be globally unique, they only need to be unique 
// between components and their siblings

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// Why immutability is important

  // Data Change with Mutation
    // var player = {score: 1, name: 'Jeff'};
    // player.score = 2;
    // Now player is {score: 2, name: 'Jeff'}

  // Data Change without Mutation
    // var player = {score: 1, name: 'Jeff'};

    // var newPlayer = Object.assign({}, player, {score: 2});
    // Now player is unchanged, but newPlayer is {score: 2, name: 'Jeff'}

    // Or if you are using object spread syntax proposal, you can write:
    // var newPlayer = {...player, score: 2};

  // Complex Features Become Simple
    // Avoiding direct data mutation lets us keep previous versions of the game's history intact,
    // and reuse them later

  // Detecting Changes
    // If the immutable object that is being referenced is different than the previous one, then 
    // the object has changed

  // Determining When to Re-Render in React
    // The main benefit of immutability is that it helps you build pure components in React
    // Immutable data can easily determine if changes have been made which helps to determine
    // when a component requires re-rendering

//  Pure components
  // Just like pure functions in JavaScript, a React component is considered a Pure Component if 
  // it renders the same output for the same state and props value. React provides the PureComponent
  // base class for these class components. Class components that extend the React PureComponent
  // class are treated as pure components

// Function components
  // In React, function components are a simpler way to write components that only contain a render
  // method that don't have their own state. Instead of defining a class which extends 
  // React.Component, we can write a function that takes props as input and returns what should
  // be rendered. Function components are less tedious to write than classes, and many
  // components can be expressed this way.
