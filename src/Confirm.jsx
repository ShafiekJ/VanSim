import React,{useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Confirm(props) {
const [buttonClicked,setButtonClicked] = useState(false)
let navigate = useNavigate()

if(props.message === 'deleteDeck'){
    return (
        <div  className='confirm' >
            {props.confirmMessage}<br></br>
            <button  onClick={(()=>{props.show({show:false, deck:'' , click:false})})}  >No</button>
            <button   onClick={(()=>{
            if(buttonClicked){alert('Waiting for server'); return;}
            setButtonClicked(true)
axios.post(props.backendUrl +'deleteDeck' , {username: props.username, deckName:props.deleteDeck.deck}).then((res)=>{

    props.show({show:false, deck:'' , click:false})
  props.setDecks(res.data.decks.decks)
  setButtonClicked(false)
})

            })} >Yes</button>
        </div>
      )
}
    
    else if(props.message ==='back'){
        // 
          return (
    <div  className='confirm' >
        {props.confirmMessage}<br></br>
        <button  onClick={(()=>{props.setShowConfirm(false)})}  >No</button>
        <button   onClick={(()=>{navigate('/deckmanager') } )} >Yes</button>
    </div>
  )
    }
else{
 

    return(
    <div className='confirm' >
               <div>{props.confirmMessage}</div><br></br>
        <button onClick={(()=>{props.setShowConfirm(false)})} >Back</button>
        <button onClick={(async ()=>{
            //send request to save deck
            
            let deck = props.fullDeck
            if(buttonClicked){alert('Waiting for server'); return;}
            setButtonClicked(true)
            if(props.activeDeck.name === props.fullDeck.name){
                        
                props.setActiveDeck(props.fullDeck) 
                await axios.post(props.backendUrl + 'lastUsedDeck' , {username:props.user.username, deck:deck , act:'update'})
                
        }

            if(props.overwrite === true){

                    await axios.post(props.backendUrl + 'editDeck' , {username:props.user.username , deck:props.fullDeck } ).then((res)=>{
                        props.setDecks(res.data.decks)
                       navigate('/deckmanager')

                    })
                    
                    .catch(error => console.error(error))
                }
                      else{
                        await axios.post(props.backendUrl + 'newDeck' , {username:props.user.username , deck:props.fullDeck } ).then(()=>{
                            props.setDecks([...props.decks , props.fullDeck])
                            navigate('/deckmanager')
                        })
               
                      .catch(error => console.error(error))
                     
                    }   

                    setButtonClicked(false)
      
        })} >Save</button>
    </div>)
}
}
