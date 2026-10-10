import React, { useContext } from 'react'
import { dataContext } from './App'

export default function CustomImage(props ) {
  const data = useContext(dataContext)
  const backendUrl = data.backendUrl
const fakeCrossOrigin = 'a'

const setList = {}
let fullLink = backendUrl + props.src
 
if(props.src[0] === backendUrl[backendUrl.length-1]){
fullLink = backendUrl + (props.src).replace('/' , '')

}
  return (
    <img  id={props.id} className={props.className} src ={fullLink} crossOrigin={fakeCrossOrigin} onClick={props.onClick} onMouseEnter={props.onMouseEnter} alt={props.alt} loading={props.loading} />
  )
}
