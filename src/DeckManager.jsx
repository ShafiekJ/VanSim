import React, {useState , useEffect, useContext} from 'react'
import axios from 'axios'
import Confirm from './Confirm'
import CustomImage from './CustomImage'
import { dataContext } from './App'
 import LinkButton from './LinkButton'
import { Navigate, useNavigate } from 'react-router-dom'


export default   function DeckManager( ) {
  const navigate = useNavigate()
  const props = useContext(dataContext)
 const deckMax = 10
 const deckAmount = props.decks.length
 
 const [changeActiveDeck , setChangeActiveDeck] = useState(false)
 const [deleteDeck , setDeleteDeck] = useState({show:false, deck:'', click:false})
  //add deck info on right side, add button edit deck and set deck
  //on normal click setstate activedeck to show deck info - triggers ride deck small deck overview
 useEffect( ()=>{
 
if(props.decks.length === 0)
 
   axios.post(props.backendUrl +'decks' , {username: props.user.username})
  .then((response) => {

      props.setDecks(response.data)

  }  

) 

 } , [props.currentPage])




//do deck limit

  return (  <div id = {'deckManagerHolder'}>
      <div id={'deckHolder'}  > 

     
<div id={'decks'}>
      {props.decks.length > 0 ? props.decks.map((deck, i ) =>{
        let selected = false ;

        if(deck.Name === props.activeDeck.Name){
          //highlight deck
          selected = true
        }

        return <div className={`deck  ` +  (selected && 'active') } key = {i}   onClick={async (e)=>{ //make state for action
         // await axios.post('http://localhost:30000/lastUsedDeck' , {username:props.username, deck:Object.values(props.decks)[0] , act:'update'}) //add new button setactivedeck, onclick put this
         // setCurrentPage('home')
          console.log(deck)
         if(deleteDeck.click){
            if(deck.Name === props.activeDeck.Name ){alert('Change active deck first') ;return}
            setDeleteDeck({show:true, deck:deck.Name , click:false})
           
          }
          
         else if(props.editDeck!== null){ props.setNation(deck.Nation);props.setEditDeck(deck)//setEditDEck deck.name
          ;navigate('/deckbuilder')}

          else if(changeActiveDeck === true){props.setActiveDeck(deck); setChangeActiveDeck(false)
             await axios.post(props.backendUrl + 'lastUsedDeck' , {username:props.user.username, deck:deck , act:'update'}).then((res)=>{
              localStorage.setItem('vansimUser', JSON.stringify(res.data))
             })
            
          }

        }}>   
          
 
          <CustomImage src = {deck.FaceCard}/>
          {
            deck.Name
          }

        </div>
        }) : <div> No Decks </div>}
 </div>
        
</div>

<div id ={'deckManagerButtons'}>
          <LinkButton  to='/home' text='Back' onClick={()=>{ } }>  </LinkButton>    
          <button onClick={(()=>{ 
               setDeleteDeck({show:false, deck:'' , click:true})
               props.setEditDeck(null);

          })}>Delete Deck</button>

         <button onClick={(()=>{
          if(deckAmount === deckMax){
            alert("Can't make anymore decks")
          }
          else{
              navigate('/deckbuildconfirm')
          }
          })}>New Deck</button>
         <button onClick={(()=>{props.setEditDeck({}) ; setDeleteDeck({show:false, deck:'' , click:false})  })}>Edit Deck</button>
         <button onClick={(()=>{ props.setEditDeck(null); setChangeActiveDeck(true)  ;setDeleteDeck({show:false, deck:'' , click:false})  })}>Set Active Deck</button>
         {deckAmount } / {deckMax}
</div>
{deleteDeck.show && <Confirm message = {'deleteDeck'} show={setDeleteDeck} deleteDeck={deleteDeck} backendUrl={props.backendUrl} confirmMessage={`Delete Deck ${deleteDeck.deck}`} username={props.user.username} setDecks={props.setDecks}/>}

    </div>
 
  )
}
