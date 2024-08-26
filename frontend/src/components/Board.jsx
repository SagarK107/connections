import React, { useEffect, useState } from 'react'
import Square from './Square'
import './board.css'
import Button from 'react-bootstrap/esm/Button';


export default function Board({puzzle_id}) {
  const [text,setText] = useState("a");
  const [answerToThemeAndDifficultyMapping,setAnswerToThemeAndDifficultyMapping] = useState({});
  const [answerGrid,setAnswersGrid] = useState([]);
  const [selectedAnswers,setSelectedAnswers] = useState([]);
  const [alreadyAnswered,setAlreadyAnswered] = useState([]);
  const [remainingSets,setRemainingSets] = useState(0);
  const [lives,setLives] = useState(0);

  const ANSWER_NOT_SELECTED = 0;
  const ANSWER_ALREADY_SELECTED = 1;
  const FOUR_ANSWERS_ALREADY_SELECTED = 2;

  const THEME_INDEX = 0;
  const DIFFICULTY_INDEX = 1;
  const IS_SELECTED_INDEX = 2;

  const difficultyMap = {
    1 : "warning",
    2: "success",
    3: "info",
    4: "danger"
  }
  
  function shuffleArray(array) {
    // Create a copy of the array to avoid mutating the original array
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  function modifyArrayAfterCorrectAnswer(selectedAnswers,answersData) {
    
    const newAnswersData = [];
    const tempTheme = structuredClone(answerToThemeAndDifficultyMapping);
    //Remove the answers from the theme mapping
    for (const key of selectedAnswers)
    {
        delete tempTheme.key;
      
    }
    setAnswerToThemeAndDifficultyMapping(tempTheme);
    // Remove the answers from the answers grid
    console.log(selectedAnswers)
    const flattenedGrid = answerGrid.flat(Infinity).filter(e => !selectedAnswers.includes(e));
    console.log(flattenedGrid);
    const newGrid = [];
    for (var i = 0; i < remainingSets - 1; i++)
    {
      const a = [];
      for (var j = 0; j < 4;j++)
      {
        a.push(flattenedGrid[i * (remainingSets - 1) + j]);
      }
      newGrid.push(a);
    }
    setAnswersGrid(newGrid);
    setRemainingSets(remainingSets - 1);
    console.log(newGrid);
  }
  
  useEffect( () => {
    if (remainingSets == 0)
    {
      console.log("You won!");
    }

  },[remainingSets]

  )
  function verifyAnswer()
  {
    if (selectedAnswers.length === 4)
      
    {
      var i = 0;
      const check = answerToThemeAndDifficultyMapping[selectedAnswers[0]][THEME_INDEX]
      for (var answer of selectedAnswers)
        {
          if (answerToThemeAndDifficultyMapping[answer][THEME_INDEX] !== check)
          {
            console.log("Wrong");
            console.log(answer,check);
            setLives(lives - 1);
            return false;
          }
        }
    }
    modifyArrayAfterCorrectAnswer(selectedAnswers,answerGrid);
    setSelectedAnswers([]);
    setRemainingSets(remainingSets - 1);
    console.log("Correct!");
    return true;
    
  }

  function handleAnswer() {
    if (verifyAnswer())
    {
      var a = [];
      for (var answer of selectedAnswers)
      {
        a.push([answer,answerToThemeAndDifficultyMapping[answer][DIFFICULTY_INDEX]]);

        // setAnswersGrid(answerGrid.filter(e => e !== answer));
      }
      console.log(a);
      setAlreadyAnswered([...alreadyAnswered,a]);
    }
  }

  function addAnswer(answer)
  {
    
    if (selectedAnswers.length < 4 && !selectedAnswers.includes(answer))
      {
        setSelectedAnswers([...selectedAnswers,answer]);
        console.log(`${answer} is selected`);
        return ANSWER_NOT_SELECTED; // Answer selected succesfully
      }
    else if (selectedAnswers.includes(answer))
    {
      //Remove answer
      setSelectedAnswers(selectedAnswers.filter(a => a != answer));
      console.log(`${answer} is already selected,removing`);
      return ANSWER_ALREADY_SELECTED;

    }
    console.log(`4 answers already selected`);
      return FOUR_ANSWERS_ALREADY_SELECTED;
  }
  
  function handleData(data)
  {
    
    const o = {};
    const a = [];
    const b = [];
    console.log(data);
    for (const [row,pattern] of Object.entries(data))
    {
      
      for (const [key,answer] of Object.entries(pattern))
      {
        if (key !== "id" && key !== "theme" && key !== "difficulty")
          {
            o[answer] = [pattern["theme"],pattern["difficulty"],false];
            b.push(answer);
          }
      }
      
    }
    
    const c = shuffleArray(b);
    
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
    console.log(o);
    setAnswerToThemeAndDifficultyMapping(o);
    setAnswersGrid(a);
    
  }
  useEffect( () => {
    if (puzzle_id > 0)
    {
      console.log(puzzle_id);
      fetch(`http://localhost:3001/api/${puzzle_id}`)
      .then(response => response.json())
      .then(data =>{
         handleData(data);
         setRemainingSets(4);
         setLives(4);
      }
        )
      
      .catch(e => console.log(e));
    }
  },[puzzle_id])
  

  function tileClickedFunction(text)
  {
    console.log(answerToThemeAndDifficultyMapping);
    setAnswerToThemeAndDifficultyMapping({... answerToThemeAndDifficultyMapping,
      [text]: answerToThemeAndDifficultyMapping[text].map((e,i) =>
      {
        console.log(e);
        if (i === 2)
          return !e;
        else
          return e;
      }
    )
    })
    
  }
  
  return (
    lives > 0 ?
    <div>
    {
      alreadyAnswered.map(
        a => <Button variant={difficultyMap[a[0][1]]}>{
          a.map(e => e[0]).join(",")
        }</Button>
      )
    }
     {
      answerGrid.map(
        (e,i) => 
          <div className={`${i} row`}>
            {e.map( f =>
                <Square square_text={f} addAnswer={addAnswer} selected={answerToThemeAndDifficultyMapping[f][IS_SELECTED_INDEX]}
                clickFunction={tileClickedFunction}/>
            )}
            </div>
        )
      
     }
     <div>
     Lives: {lives}
     </div>
     
     <Button onClick={e => handleAnswer()} variant='warning'>Submit Answer</Button>
     
    </div>
    :
    <div>
      Game Over!
    </div>
  )
}
