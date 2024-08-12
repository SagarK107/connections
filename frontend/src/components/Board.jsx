import React, { useEffect, useState } from 'react'
import Square from './Square'


export default function Board({puzzle_id}) {
  const [text,setText] = useState("a");
  const [puzzleData,setPuzzleData] = useState({});
  const [squares,setSquares] = useState([]);
  
  const answers_set = new Set(["answer1","answer2","answer3","answer4"]);

  const fetchData = () => {
  
    fetch("http://localhost:3001")
    .then(response => response.text())
    .then(text_response => setText(text_response))
    .catch(error => console.log("error!"));
    console.log(text);
    
  };
  useEffect ( () => {
    fetchData();

  },[])

  useEffect( () => {
    if (puzzle_id > 0)
    {
      fetch(`http://localhost:3001/api/${puzzle_id}`)
      .then(response => response.json())
      .then(data => {
        
        
        var a = [];
        for (const [key,value] of Object.entries(data))
        {
          if ( key !== "id")
          {
            a.push(value);
          }
            
        }
        console.log(puzzleData,a);
        updateSquares(a)
    })
      .catch(e => console.log(e));

      
      
      
    }
  },[puzzle_id])
  
  const updateSquares = (a) => {
    console.log(a);
    const arr = [];
        for (const value of a)
          {
            console.log(value);
            fetch(`http://localhost:3001/api/pattern/${value}`)
            .then(e => e.json())
            .then(e => 
              {
                for (const [k,v] of Object.entries(e))
                {
                  console.log(k,v)
                  if (answers_set.has(k))
                  {
                    arr.push(v)
                  }
                }
                console.log(arr);
                setSquares([...squares,...arr]);
          })
            
            .catch(j => console.log(j));

            
          }
      

  }
  
  
  console.log(squares);
  return (
    <div>
      {
        squares.map(
          e =>
            <div key={e}>
              {e}
              </div>
        )
      }
      
    </div>
  )
}
