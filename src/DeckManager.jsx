import React, {useState , useEffect} from 'react'
import axios from 'axios'


 
export default   function DeckManager(props) {

 const [changeActiveDeck , setChangeActiveDeck] = useState(false)
  //add deck info on right side, add button edit deck and set deck
  //on normal click setstate activedeck to show deck info - triggers ride deck small deck overview
 useEffect( ()=>{

   axios.post(props.backendUrl +'decks' , {username: props.user.username})
  .then((response) => {

      props.setDecks(response.data)

  }  
) 

 } , [props.currentPage])




//do deck limit

  return (
    <div id = {'deckManagerHolder'}>

      <div id={'deckHolder'}  > 

     
<div id={'decks'}>
      {props.decks.length > 0 ? props.decks.map((deck, i ) =>{
        let selected = false ;

        if(deck.Name === props.activeDeck.Name){
          //highlight deck
          selected = true
        }

        return <div className={`deck  ` +  (selected && 'active') } key = {i}   onClick={async ()=>{ //make state for action
         // await axios.post('http://localhost:30000/lastUsedDeck' , {username:props.username, deck:Object.values(props.decks)[0] , act:'update'}) //add new button setactivedeck, onclick put this
         // setCurrentPage('home')

          
         if(props.editDeck!== null){ props.setNation(deck.Nation);props.setEditDeck(deck)//setEditDEck deck.name
          ;props.setCurrentPage('deckbuilder')}

          else if(changeActiveDeck === true){props.setActiveDeck(deck); setChangeActiveDeck(false)
            await axios.post(props.backendUrl + 'lastUsedDeck' , {username:props.user.username, deck:deck , act:'update'})
          
          }

        }}>   
          
 
          <img src = {deck["FaceCard"]}/>
          {
            deck.Name
          }

        </div>
        }) : <div> No Decks </div>}
 </div>
        
</div>

<div id ={'deckManagerButtons'}>
          <button onClick={()=>{props.setCurrentPage('home')} }> Back</button>    
         <button onClick={(()=>{props.setCurrentPage('deckbuildconfirm')})}>New Deck</button>
         <button onClick={(()=>{props.setEditDeck({})})}>Edit Deck</button>
         <button onClick={(()=>{  setChangeActiveDeck(true)   })}>Set Active Deck</button>
</div>

    </div>
  )
}
