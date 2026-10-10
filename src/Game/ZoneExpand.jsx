import React from 'react'
import CustomImage from '../CustomImage'
export default function ZoneExpand(props) {
 
    return (
      
    <div id = {'zoneExpand'}  >
      <div className='zoneName' >
      {props.zoneName} 
      </div>
      <div className='zoneCards' id = {'zoneCards'}>
        
      {props.zone.map((card , i)=>{return <div key = {i} className = {'card'} 
    onMouseEnter={(()=>{props.setViewCard(card)})}><CustomImage src={card.img} /> 
    
    </div>})}
      </div>

    
    
    </div>
  )
}
