import React from 'react'
import Button from 'react-bootstrap/Button'
import './board.css';
export default function Square({square_text,addAnswer}) {
  return (
    <div className='col'>
      <Button variant="secondary" onClick={e => addAnswer(square_text)}>{square_text}</Button>
      </div>
  )
}
