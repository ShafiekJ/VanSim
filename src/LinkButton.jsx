import React from 'react'
import { Link } from 'react-router-dom'
export default function LinkButton({to,id,className,onClick,text}) {
  return (

    <Link to={to||''} ><button id={id} className={className} onClick={onClick} >{text}</button></Link>
  )
}
