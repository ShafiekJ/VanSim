import React, {useState, useEffect} from 'react'
 

export default function StackHandler(props) {
  const [paid, setPaid] = useState(false)
  const [costHandler, setCostHandler] = useState(false)
  const [chosenCard , setChosenCard] = useState()
  const [index, setIndex] = useState()

  return (
    <div>
 {useEffect (()=>{

 } , [paid])}
{costHandler && <AbilityHandler costHandler = {costHandler} index={index} setCostHandler={setCostHandler} setPaid={setPaid} chosenCard={chosenCard} stack={props.stack} setStack= {props.setStack}/>}
        {props.stack.map((card, index)=>{return <div
        onMouseEnter={(()=>{props.setViewCard(card)})}
            onClick={(()=>{
              setChosenCard(card)
              setIndex(index)
              setCostHandler(true)
 
        })}><img src = {card.img} /></div>})}
    </div>
  )
}
