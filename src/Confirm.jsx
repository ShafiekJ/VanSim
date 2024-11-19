import React,{useState} from 'react'
import axios from 'axios'
export default function Confirm(props) {

    
    if(props.message ==='back'){
        // 
          return (
    <div  className='confirm' >
        {props.confirmMessage}
        <button  onClick={(()=>{props.setShowConfirm(false)})}  >No</button>
        <button   onClick={(()=>{props.setCurrentPage('deckmanager')})} >Yes</button>
    </div>
  )
    }
else{
 

    return(
    <div className='confirm' >
               {props.confirmMessage}
        <button onClick={(()=>{props.setShowConfirm(false)})} >Back</button>
        <button onClick={(async ()=>{
            //send request to save deck
            
            let deck = props.fullDeck
            console.log(deck)
            if(props.activeDeck.name === props.fullDeck.name){
                        
                props.setActiveDeck(props.fullDeck) 
                await axios.post(props.backendUrl + 'lastUsedDeck' , {username:props.user.username, deck:deck , act:'update'})
        }

            if(props.overwrite === true){

                    await axios.post(props.backendUrl + 'editDeck' , {username:props.user.username , deck:props.fullDeck } ).then(()=>{

                        props.setCurrentPage('deckmanager');
                    })
                    
                    .catch(error => console.error(error))
                }
                      else{
                        await axios.post(props.backendUrl + 'newDeck' , {username:props.user.username , deck:props.fullDeck } ).then(()=>{
                            
                            props.setCurrentPage('deckmanager')
                        })
               
                      .catch(error => console.error(error))
                     
                    }   


      
        })} >Save</button>
    </div>)
}
}
