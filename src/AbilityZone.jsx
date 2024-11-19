import React, {useEffect} from 'react'
import './AbilityZone.css'



export default function AbilityZone(props) {
 

 
  useEffect(()=>{//scroll horizontal
    document.getElementById('abilityZone').addEventListener('wheel' , (e)=>{
  
    
      e.preventDefault()
  
      if(e.deltaY > 0){
         document.getElementById('abilityZone').scrollLeft = document.getElementById('abilityZone').scrollLeft + 100
      }
      else{
        document.getElementById('abilityZone').scrollLeft = document.getElementById('abilityZone').scrollLeft - 100
      }
       
    } , {passive:false })
 let place = ''
},[])
    return (
  
  
  
      <div id = {'abilityZone'}  >
        {props.abilityZone.length === 0? <>No targets found, click confirm</> : <></>} 
        {props.abilityZone.map( (card , i)=>{ return  <div key = {i} className = {'zone card'}
         onMouseEnter={(()=>{props.setViewCard(card)})}><img src={card.img} />  <div></div> {card.place}</div> } )}
         
         </div>
      )
    }