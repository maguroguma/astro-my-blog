import { useState } from 'preact/hooks';
import '@/styles/game.css';

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}

const Square = () => {
  const [value, setValue] = useState<string | null>(null);

  const handleClick = () => {
    setValue('X');
  };

  return (
    <button className="square" onClick={handleClick}>
      {value}
    </button>
  );
};
