import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import './board.css';
export default function Square({square_text,addAnswer,selected,clickFunction}) {
  
  function isSelected(selected)
  {
    return selected ? "secondary" : "outline-secondary"
  }

  function squareClicked ()
  {
    addAnswer(square_text);
    clickFunction(square_text);

  }
  return (
    <div className='col'>
      <Button variant={isSelected(selected)} onClick={e => squareClicked()}>{square_text}</Button>
      </div>
  )
}
