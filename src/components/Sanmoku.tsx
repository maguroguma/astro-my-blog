import { useState } from 'preact/hooks';
import '@/styles/game.css';

export default () => {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState<(string | null)[][]>([
    Array(9).fill(null),
  ]);
  const currentSquares = history[history.length - 1];

  const handlePlay = (nextSquares: (string | null)[]) => {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  };

  const jumpTo = (nextMove: number) => {
    // TODO
  };

  const moves = history.map((squares: (string | null)[], move: number) => {
    const description = move > 0 ? `Go to move #${move}` : `Go to game start`;
    return (
      <li>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

const Board = ({
  xIsNext,
  squares,
  onPlay,
}: {
  xIsNext: boolean;
  squares: (string | null)[];
  onPlay: (f: (string | null)[]) => void;
}) => {
  const handleClick = (i: number) => {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }

    onPlay(nextSquares);
  };

  // state の変化のたびに再計算・再レンダリングされる
  const status = (() => {
    const winner = calculateWinner(squares);
    return winner
      ? 'Winner: ' + winner
      : 'Next player: ' + (xIsNext ? 'X' : 'O');
  })();

  return (
    <>
      <div className={status}>{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
};

const Square = ({
  value,
  onSquareClick,
}: {
  value: string | null;
  onSquareClick: () => void;
}) => {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
};

const calculateWinner = (squares: (string | null)[]) => {
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
};
