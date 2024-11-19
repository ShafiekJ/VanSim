import React from 'react'
import './Message.css'

export default function Message(props) {
  return (
    <div  id='messageHolder'  style  = {{
      "height":"200px",
      "width": "500px",
      "backgroundColor": "black",
      "position":"absolute",
      'zIndex':10,
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
