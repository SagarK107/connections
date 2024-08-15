
import  Button  from 'react-bootstrap/Button';
import './App.css';
import Board from './components/Board';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FormControl } from 'react-bootstrap';
import { useState } from 'react';


function App() {
  const [puzzleIdText,setPuzzleIdText] = useState(-1);
  const [puzzleId,setPuzzleId] = useState(-1);

  return (
    <div className="App">
      Connections
      <div>
        <FormControl type="number" onChange ={e => setPuzzleIdText(e.target.value)} placeholder='Enter Puzzle ID' className='mx-auto'/>
        <Button variant="primary" onClick={e => setPuzzleId(puzzleIdText)}>Submit</Button>
        </div>
      <div>
      <Board puzzle_id={puzzleId} />
      </div>
      
    </div>
  );
}

export default App;
