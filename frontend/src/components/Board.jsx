import React, { useEffect, useState } from 'react'
import Square from './Square'
import './board.css'
import Button from 'react-bootstrap/esm/Button';


export default function Board({puzzle_id}) {
  const [text,setText] = useState("a");
  const [puzzleData,setPuzzleData] = useState({});
  const [answersData,setAnswersData] = useState([[]]);
  const [selectedAnswers,setSelectedAnswers] = useState([]);

  const ANSWER_NOT_SELECTED = 0;
  const ANSWER_ALREADY_SELECTED = 1;
  const FOUR_ANSWERS_ALREADY_SELECTED = 2;
  
  function shuffleArray(array) {
    // Create a copy of the array to avoid mutating the original array
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  function verifyAnswer()
  {
    if (selectedAnswers.length === 4)
      
    {
      var i = 0;
      const check = puzzleData[selectedAnswers[0]]
      for (var answer of selectedAnswers)
        {
          if (puzzleData[answer] !== check)
          {
            console.log("Wrong");
            console.log(answer,check);
            setSelectedAnswers([]); // Empty selected Answers
            return false;
          }
        }
    }
    setSelectedAnswers([]);
    console.log("Correct!");
    return true;
    
  }

  function addAnswer(answer)
  {
    console.log(answer);
    if (selectedAnswers.length < 4 && !selectedAnswers.includes(answer))
      {
        setSelectedAnswers([...selectedAnswers,answer]);
        return ANSWER_NOT_SELECTED; // Answer selected succesfully
      }
    else if (selectedAnswers.includes(answer))
    {
      //Remove answer
      selectedAnswers(selectedAnswers.filter(a => a != answer));
      return ANSWER_ALREADY_SELECTED;

    }
      return FOUR_ANSWERS_ALREADY_SELECTED;
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
            o[answer] = pattern["theme"];
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
    console.log(o);
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
                <Square square_text={f} addAnswer={addAnswer}/>
            )}
            </div>
        )
      
     }
     <Button onClick={e => verifyAnswer()} variant='warning'>Submit Answer</Button>
     
    </div>
  )
}
