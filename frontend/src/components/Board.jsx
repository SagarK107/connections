import React, { useEffect, useState } from 'react'
import Square from './Square'
import './board.css'


export default function Board({puzzle_id}) {
  const [text,setText] = useState("a");
  const [puzzleData,setPuzzleData] = useState({});
  const [answersData,setAnswersData] = useState([[]]);
  
  function shuffleArray(array) {
    // Create a copy of the array to avoid mutating the original array
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  function handleData(data)
  {
    console.log(data);
    const o = {};
    const a = [];
    const b = [];
    for (const [row,pattern] of Object.entries(data))
    {
      
      for (const [key,answer] of Object.entries(pattern))
      {
        if (key !== "id" && key !== "theme" && key !== "difficulty")
          {
            o[answer] = key;
            b.push(answer);
          }
      }
      
    }
    console.log(b);
    const c = shuffleArray(b);
    console.log(c);
    for (var i = 0; i < c.length; i += 4)
    {
      const d = [];
      for (var x = i; x < i + 4; x++)
      {
        
        d.push(c[x]);
      }
      console.log(d);
      a.push(d);
    }

    setPuzzleData(o);
    setAnswersData(a);
    console.log(a);
  }
  useEffect( () => {
    if (puzzle_id > 0)
    {
      console.log(puzzle_id);
      fetch(`http://localhost:3001/api/${puzzle_id}`)
      .then(response => response.json())
      .then(data => handleData(data))
      .catch(e => console.log(e));
    }
  },[puzzle_id])
  

  
 
  return (
    <div>
     {
      answersData.map(
        (e,i) => 
          <div className={`${i} row`}>
            {e.map( f =>
                <Square square_text={f} />
            )}
            </div>
        )
      
     }
     
    </div>
  )
}
