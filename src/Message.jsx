import React from 'react'
import './Message.css'

export default function Message(props) {
  return (
    <div  id='messageHolder'  style  = {{
      "height":"100px",
      "width": "200px",
 
      "position":"absolute",
     
      'display':"flex",
      'flexDirection':"row",
      "justifyContent":"center",
      "alignItems":"center",
      "xOverFlow": "scroll",
      "overflow" : 'auto'
 
  }} > 
        <div id={'message'}>  {props.message} </div>
    </div>
  )
}
