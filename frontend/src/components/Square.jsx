import React from 'react'
import Button from 'react-bootstrap/Button'
import './board.css';
export default function Square({square_text}) {
  return (
    <div className='col'>
      <Button variant="secondary">{square_text}</Button>
      </div>
  )
}
