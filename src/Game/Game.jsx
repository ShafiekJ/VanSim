import React , {useEffect, useState, useRef} from 'react'

import './Game.css'


  var abilities  = []
 

export default function Game(props ) {
  
// {person} = props
  
  const {circles} = props
  const {zones} = props
  const {showZone} = props 
  const {setShowZone} = props
  const {zone} = props 
  const {setZone} = props
  const MainDeck = props.MainDeck
  const setMainDeck = props.setMainDeck
 const RideDeck = props.RideDeck
 const sleeves = props.sleeves
 const Playmat = props.playmat
const defaultSleeves = '/images/Sleeves/Sleeve153.webp'
const defaultPlaymat = "/images/Raindear-Playmat.png"
 

  //const [GDeck , setGDeck] = useState(Object.values(props.activeDeck.GDeck))
  
 const {popup, setPopup} = props
 


 let dropZone = zones.drop
 let soul = zones.soul
 let bindZone = zones.bind
 let damage = zones.damage
 let trigger = zones.trigger
 let removed = zones.removed
 let crestZone = zones.crest
 let orderZone = zones.orderZone
 let orderArea = zones.orderArea
 let draw = props.draw


  const [stack , setStack] = useState([])
  //change
 
 
  const [showStack , setShowStack] = useState([])


  return (
    <div className='holder' onClick={(()=>{ })}  onContextMenu={((e)=> {
    //  e.preventDefault(); 
    
      setShowZone(false); 
      //have another component? store the zoneExpand, have a new component for only ability zone expand
      //give zoneExpand a dynamic id and control whether or not to close it based ont hat id
      } )}  >

      
      
 
 
    <div className='container' loading='eager' >
   
    <div className='field'  style={{backgroundImage:`url(${Playmat || defaultPlaymat})`}} onClick={(()=>{
      console.log(props.circles, props.zones)
    })}  >
      <div className='left-side'>
        <div className='leftTop' >
        <div className='crest-zone  ' id={`${props.person}CrestZone`} onClick={(()=>{setShowZone(true) ; setZone(crestZone);props.setZoneName(`${props.person} ` +"CREST") })} >
        <div className='crest'>{crestZone[crestZone.length-1] === undefined ? <></> :<img src = {crestZone[crestZone.length-1].img} onMouseEnter={(()=>{props.setViewCard(crestZone[crestZone.length-1])})}/>} 
        </div>
        </div>
     
      <div className='order-zone zone' onClick={(()=>{setShowZone(true) ; setZone(orderZone); props.setZoneName(`${props.person} ` +"ORDERZONE") })} >
      <div className='card '>{orderZone[orderZone.length-1] === undefined ? <></> :<img src = {orderZone[orderZone.length-1].img} onMouseEnter={(()=>{props.setViewCard(orderZone[orderZone.length-1])})}/>} 
         </div>    
         </div>


            </div>
      <div className='g-zone'>
        <div className='face-up-g'> </div>
        <div className='g-deck'  style={{backgroundImage:`url(${sleeves.GDeck || defaultSleeves})`}} >
 
        </div>
   
      </div>
      <div className='damage-zone zone' id={`${props.person}Damage`} onClick={(()=>{setShowZone(true) ; setZone(damage);props.setZoneName(`${props.person} ` +"DAMAGE")})} >
        {damage.map((card , i) => {return <div key = {i}  className='rotate-holder'
        style={{
          'zIndex': i ,
          'translate' : `0 ${i-1}0px `
 
          }} >  
            <div onMouseEnter={(()=>{props.setViewCard(damage[i])})} className='card' key = {i} onClick={(()=>{ 
      
    })}><img key ={i} src={card.img}  /> </div> </div> })}
 </div>
      </div>
      <div className='center'>
        <div className='centerHolder'>
        <div className='GC' id={`${props.person}GC`} onClick={(()=>{props.setZone(circles[`${props.person}` + "GC"].guardians) ;props.setShowZone(true); props.setZoneName(`${props.person} ` +"GC")   })} >
        
        {circles[`${props.person}` + "GC"].guardians.map((card , i) => {return <div key = {i} className='rotate-holder'
        style={{
          'zIndex': damage[i] ,
          'translate' : `0 ${damage[i]}0px`
 
          }} >  
       <div onMouseEnter={(()=>{props.setViewCard(circles[`${props.person}` + "GC"].guardians[i])})} className='card' key = {i} onClick={(()=>{ 
      
      })}><img key ={i} src={card.img}  /> </div></div> })}
        </div>
        <div className='circles' id={`${props.person}Circles`} onClick={(()=>{
  
      
      
      
    
    
    })} >

 
        <div className='front-row' id={`${props.person}FrontRow`}>
 
         <div className='RG' id ={`${props.person}FLRG` } onClick ={(()=>{ })}> {circles[`${props.person}` + "FLRG"].unit === null ? <></> : 
         <div className='unitInfo card unit' ><img  src = {circles[`${props.person}` + "FLRG"].unit.img } onMouseEnter={(()=>{props.setViewCard(circles[`${props.person}` + "FLRG"].unit)})}  />      <div className='attackInfo' >
         <div>{circles[`${props.person}` + "FLRG"].unit.tempPower +   circles[`${props.person}` + "FLRG"].powergain}  </div> <br></br><br></br>
         <img src = '/images/Assets/Critical-Icon.png' className='critIcon'></img>
         <div>{circles[`${props.person}` + "FLRG"].unit.tempCrit }</div><br></br>
         {/* <div>{circles[`${props.person}` + "FLRG"].unit.tempDrive }</div> */}
          </div></div>}  </div>
        
        
   
         <div className='VG' id={`${props.person}VG`}>
         {
            circles[`${props.person}` + "VG"].unit ? 
                  <div id='right-arm' className='arms' >{(circles[`${props.person}` + "VG"].unit !=null && circles[`${props.person}` + "VG"].unit.arms == null) ? <></> :  <div className='unitInfo card' ><img  src = {circles[`${props.person}` + "VG"].unit.arms.right.img } onMouseEnter={(()=>{props.setViewCard(circles[`${props.person}` + "VG"].unit.arms.right)})}  /> </div>} </div>
         :<></>
          }



          
          { circles[`${props.person}` + "VG"].unit ==null ? <></> :
         
          <div className='card unitInfo unit' onContextMenu={((e)=>{
            e.preventDefault();e.stopPropagation();setZone(soul);setShowZone(true) ;props.setZoneName(`${props.person} ` +"SOUL")})} >
   <img src = {circles[`${props.person}` + "VG"].unit.img }   onMouseEnter={(()=>{props.setViewCard(circles[`${props.person}` + "VG"].unit)})}/>
     <div className='attackInfo' >
          <div>{circles[`${props.person}` + "VG"].unit.tempPower +   circles[`${props.person}` + "VG"].powergain}  </div> <br></br><br></br>
          <img src = '/images/Assets/Critical-Icon.png' className='critIcon'></img>
          <div>{circles[`${props.person}` + "VG"].unit.tempCrit }</div><br></br>
          {/* <div>{circles[`${props.person}` + "VG"].unit.tempDrive }</div> */}
           </div>
          
          
          </div> } 
          {          circles[`${props.person}` + "VG"].unit ?
         <div id='left-arm' className='arms' >{(  circles[`${props.person}` + "VG"].unit.arms == null) ? <></> :  
         <div className='unitInfo card' ><img  src = {circles[`${props.person}` + "VG"].unit.arms.left.img } 
         onMouseEnter={(()=>{props.setViewCard(circles[`${props.person}` + "VG"].unit.arms.left)})}  /> </div>} </div>
          : <></>  }
             
          </div> 
          
        
        
        
         <div className='RG' id ={`${props.person}FRRG`}  onClick ={(()=>{ })} > {circles[`${props.person}` + "FRRG"].unit === null ? <></> : 
         <div className='unitInfo card unit'><img src = {circles[`${props.person}` + "FRRG"].unit.img } onMouseEnter={(()=>{props.setViewCard(circles[`${props.person}` + "FRRG"].unit)})}  />      <div className='attackInfo' >
         <div>{circles[`${props.person}` + "FRRG"].unit.tempPower +   circles[`${props.person}` + "FRRG"].powergain}  </div> <br></br><br></br>
         <img src = '/images/Assets/Critical-Icon.png' className='critIcon'></img>
         <div>{circles[`${props.person}` + "FRRG"].unit.tempCrit }</div><br></br>
         {/* <div>{circles[`${props.person}` + "FRRG"].unit.tempDrive }</div> */}
          </div> </div>} </div>
        </div> 
        <div className='back-row' id={`${props.person}BackRow`}> 
        
        
        <div className='RG' id ={`${props.person}BLRG`} onClick ={(()=>{ })} >{circles[`${props.person}` + "BLRG"].unit === null ? <></> :
         <div className='unitInfo card unit'><img src = {circles[`${props.person}` + "BLRG"].unit.img } onMouseEnter={(()=>{props.setViewCard(circles[`${props.person}` + "BLRG"].unit)})}  />      <div className='attackInfo' >
         <div>{circles[`${props.person}` + "BLRG"].unit.tempPower +   circles[`${props.person}` + "BLRG"].powergain}  </div> <br></br><br></br>
         <img src = '/images/Assets/Critical-Icon.png' className='critIcon'></img>
         <div>{circles[`${props.person}` + "BLRG"].unit.tempCrit }</div><br></br>
         {/* <div>{circles[`${props.person}` + "BLRG"].unit.tempDrive }</div> */}
          </div> </div>} </div>
        
        
        <div className='RG' id ={`${props.person}BCRG`}  onClick ={(()=>{ })}   >{circles[`${props.person}` + "BCRG"].unit === null ? <></> : 
        <div className='unitInfo card unit'><img src = {circles[`${props.person}` + "BCRG"].unit.img } onMouseEnter={(()=>{props.setViewCard(circles[`${props.person}` + "BCRG"].unit)})}  />      <div className='attackInfo' >
        <div>{circles[`${props.person}` + "BCRG"].unit.tempPower +   circles[`${props.person}` + "BCRG"].powergain}  </div> <br></br><br></br>
        <img src = '/images/Assets/Critical-Icon.png' className='critIcon'></img>
        <div>{circles[`${props.person}` + "BCRG"].unit.tempCrit }</div><br></br>
        {/* <div>{circles[`${props.person}` + "BCRG"].unit.tempDrive }</div> */}
         </div></div>}</div>
        
        
        
        <div className='RG' id ={`${props.person}BRRG`}  onClick ={(()=>{ })}   >{circles[`${props.person}` + "BRRG"].unit === null ? <></> : 
        <div className='unitInfo card unit'><img src = {circles[`${props.person}` + "BRRG"].unit.img } onMouseEnter={(()=>{props.setViewCard(circles[`${props.person}` + "BRRG"].unit)})}  />      <div className='attackInfo' >
        <div>{circles[`${props.person}` + "BRRG"].unit.tempPower +   circles[`${props.person}` + "BRRG"].powergain}  </div> <br></br><br></br>
        <img src = '/images/Assets/Critical-Icon.png' className='critIcon'></img>
        <div>{circles[`${props.person}` + "BRRG"].unit.tempCrit }</div><br></br>
        {/* <div>{circles[`${props.person}` + "BRRG"].unit.tempDrive }</div> */}
         </div> </div>}</div>
        </div>

        </div> 
        </div>
      </div>
      <div className='right-side'>
        
      <div className='trigger-zone zone' id={`${props.person}TriggerZone`} >
      <div className='rotate-holder' >

      <div className='card'>{trigger[trigger.length-1] === undefined ? <></> :<img src = {trigger[trigger.length-1].img} 
      onClick={(()=>{})}
      onMouseEnter={(()=>{  if(trigger.length>0) {  props.setViewCard(trigger[trigger.length-1]);}  })}/>}</div> 
 
      </div>
      </div>
{/*      <div className='order-area' onClick={(()=>{setShowZone(true) ; setZone(orderArea) })} >
      <div className='card'>{orderArea[orderArea.length-1] === undefined ? <></> :<img src = {orderArea[orderArea.length-1].img} onMouseEnter={(()=>{props.setViewCard(orderArea[orderArea.length-1])})}/>} 
         </div>    
         </div>
          */}
        <div className='decks'>

        <div className='main-deck' id={`${props.person}MainDeck`}  style={{backgroundImage:`url(${sleeves.MainDeck || defaultSleeves})`}} 
        onClick={(()=>{      draw(); setZone(MainDeck); setShowZone(true)
 })}   >
             
      </div>
      <div className='ride-deck' id={`${props.person}RideDeck`} style={{backgroundImage:`url(${sleeves.RideDeck || defaultSleeves})`}}  onClick={(()=>{ if(props.person === 'user'){setShowZone(true) ; setZone(RideDeck)} })}>
      {/* <div >{(RideDeck === undefined) ? <></> :
      (  RideDeck[RideDeck.length-1] && RideDeck[RideDeck.length-1].faceup) ?         
      <img className='ride-deck'  src = {RideDeck[RideDeck.length-1].img} 

      onMouseEnter={(()=>{props.setViewCard(RideDeck[RideDeck.length-1])})}/> : 

            <img src = {sleeves} />
      
        
        }   </div>  */}

        </div>
        </div>
        {/* <div className='removed-zone zone' id={`${props.person}RemovedZone`}>    </div>  */}
          <div className='dropBind' >
        <div className='drop-zone zone' id={`${props.person}DropZone`} onClick={(()=>{setShowZone(true) ; setZone(dropZone);props.setZoneName(`${props.person} ` +"DROP") })}>
        <div className='card'>{dropZone[dropZone.length-1] === undefined ? <></> :
        <img src = {dropZone[dropZone.length-1].img} 
        onMouseEnter={(()=>{props.setViewCard(dropZone[dropZone.length-1])})}/>}</div> 
        </div>
        <div className='bind-zone zone' id={`${props.person}BindZone`} onClick={(()=>{setShowZone(true) ; setZone(bindZone);props.setZoneName(`${props.person} ` +"BIND") })} >
        <div className='card'>{bindZone[bindZone.length-1] === undefined ? <></> :<img src = {bindZone[bindZone.length-1].img} onMouseEnter={(()=>{props.setViewCard(bindZone[bindZone.length-1])})}/>} 
        </div>
        </div>


        </div>

      </div>
    </div>
    <div className='extra'>
      {/* {stack.length !== 0 && <StackHandler setViewCard= {props.setViewCard} stack = {stack}  showStack = {showStack} setShowStack={setShowStack}  setStack= {setStack} />} */}

    </div>
    </div>

    </div>
  )
}
