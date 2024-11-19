import React from 'react'

export default function Popup(props) {


//separate file with all functions
if(props.type === 'stand'  && !props.pause){
  
  return ;
 
}
  else if(props.type === 'ride' && !props.pause){
    return(
 
    <div
  
    id = "ride-check"  className = {'popup'}  onContextMenu={(()=>{
      //setSubphase stride

    })}>
 
      <button onClick={(()=>{//import ride function
      props.setPopup(false)
      props.rideFromHand()
 
      document.getElementById('wait').click()


      })}>Ride from Hand </button>
      <button onClick={(async()=>{
 
// props.setPopup(false)
          props.rideFromRideDeck()
      
        document.getElementById('wait').click()
   
        // props.setPhase('main')
        //call ridedeck ride
      })}>Ride from RideDeck </button>
      <button onClick={(()=>{
        //setSubphase stride

        document.getElementById('wait').click()

        props.setPopup(false)
        // props.setPhase('main')
      })}>Do not Ride </button> {// can still stride
 
      }
    </div>)
  }
  else if(props.type === 'stride' && !props.pause){
    return(<div id = "stride-check" onContextMenu={(()=>{
      //setMainphase

    })}>

      Stride?
      <button onClick={(()=>{
        //call ridedeck ride
      })}>Stride</button>
      <button onClick={(()=>{
        //setSubphase stride

        props.setPhase('main')
      })}>Do not Stride </button> {// can still stride
      }
    </div>)
  }

else if(props.type === 'overDress'){
  return(
 
    <div
 
    id = "overDress-check"   className = {'popup'} onContextMenu={(()=>{
      //setSubphase stride

    })}>
      overDress?

      <button onClick={(async()=>{

        props.overDress(props.index)
        props.setPopup(false)
      })}>overDress</button>
      <button onClick={(()=>{
            //do useeffect for popup, when true disable click on field
            
            props.setPopup(false)
            document.getElementById('wait').click()
      })}> Normal Call  </button> {

      }
    </div>)


}

else if(props.type === 'guard'){
  return(
 
    <div
 
    id = "guard-check"   className = {'popup'} onContextMenu={(()=>{
      //setSubphase stride

    })}>
      Guard?
{'/n'}
      <button onClick={(async()=>{
        props.setPhase('wait')
        props.guard()

      })}>Guard </button>
      <button onClick={(()=>{
            props.setPhase('wait')
        props.noGuard()
      })}>No Guard </button> {

      }
    </div>)


}

else if(props.pause){
  return(
 
    <div
    id = "guard-check"  className = {'popup'}  onContextMenu={(()=>{
      //setSubphase stride

    })}>{
      //change flex direction
    }
      Pay Cost? <br></br>
      {props.currentAbility.text}
      <br></br>
      <button id={'paid'} onClick={(async()=>{

        props.setPause(false)
 
        props.costPaid.current = true
        // await props.currentAbility.effect()

 
        document.getElementById('ability-wait').click()
        props.setPopup(false)
      })}> Yes </button>
      <button onClick={(()=>{
 
      props.setPause(false)
     
      props.costPaid.current = false

      document.getElementById('ability-wait').click()
      props.setPopup(false)
      })}>No</button> {

      }
    </div>)

}

else if(props.actAbility !== null && props.phase === 'main'){
  
  let abilities = Object.values(props.actAbility.abilities)
 
  return(
 
    <div 
    id = "guard-check"  className = {'popup'} onContextMenu={(()=>{
      //setSubphase stride

    })}  
    >
 
<div > {}{
  abilities.filter((ability)=>{return ability.type === "ACT"})
.map((item , i) => 

<div key = {i} onClick={(()=>{
        //resolveAbility({item.ability , item})
 
        props.setCurrentAbility(item)
 
      })}>
        {"Ability " + (i+1) } </div>)
        //currentability.text
    //    { item.text}
    
}
{props.currentAbility.text}
<button id={'actAbility-activate'} onClick={(()=>{
  document.getElementById('ability-wait').click()
  props.resolveAbility(props.currentAbility , props.actAbility)
})}>Activate </button>
</div> 
    


    </div>)

}

else if(props.type === 'youMay'){
 
  return(
 
    <div 
    id = "guard-check"  className = {'popup'} onContextMenu={(()=>{
      //setSubphase stride
      

    })} >
       {props.currentAbility.text}
  <div> <button onClick={(()=>{ props.costPaid.current = true ; props.setPopup(false);document.getElementById('wait').click();})}>Yes</button> 
  <button onClick={(()=>{ props.costPaid.current = false ; props.setPopup(false);document.getElementById('wait').click();})}> No</button> 
  
  
  
  </div>
 

    </div>
    )

}

else if(props.type === 'choose'){

  let choices = props.costPaid.current
 return(

   <div 
   id = "choose"  className = {'popup'} onContextMenu={(()=>{
     //setSubphase stride
     

   })} >
      {props.currentAbility.text}
 <div> 
 {choices.map((item , i)=>
<button onClick={(()=>{ props.setPopup(false);props.costPaid.current = item ;document.getElementById('wait').click(); })} >{item.text}</button>

)}
 
 </div>


   </div>
   )

}

else if(props.type === 'youLose'){
 
  return(

    <div 
    id = "gameOver"  className = {'popup'} >
   <div>
 You Lose
   </div>
   <div>
   <button onClick={(()=>{
      props.returnHome()
    })} >Home</button>

   </div>
    </div>
    )
 

}

else if(props.type === 'youWin'){
 
 return(

   <div 
   id = "gameOver"  className = {'popup'} >
  <div>
You Win
  </div> 
  
  <div>
    <button onClick={(()=>{
      props.returnHome()
    })} >Home</button>

  </div>
   </div>
   )

}

else if(props.type === 'surrender'){
 
  return(
 
    <div 
    id = "surrender"  className = {'popup'} >
   <div>
Surrender?

   </div> 
   
   <div>
   <button onClick={(()=>{
    props.setPopupWord(props.turnState.prevWord)
 
     })} >No</button>
     <button onClick={(()=>{
       props.surrender()
     })} >Yes</button>
 
   </div>
    </div>
    )
 
 }
 else if(props.type === 'surrendered'){
 
  return(
 
    <div 
    id = "surrender"  className = {'popup'} >
 
Opponent left
 <button onClick={(()=>{
   props.surrender()
 })} >Leave</button>
    </div>
    )
 
 }
}
