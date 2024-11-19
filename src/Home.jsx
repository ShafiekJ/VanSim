import React ,{useEffect} from 'react'
import axios from 'axios';

import {Adsense} from '@ctrl/react-adsense';
import Ad from './Ad';
import './Home.css'
export default function Home(props) {
  let user = props.user
  let activeDeck = props.activeDeck


  useEffect(()=>{
  if(props.socket)
    props.socket.on('Recieved' , (data)=>{
      props.setOnlineUsers(data.onlineUsers)
    })
  
  
  }, [])

  useEffect(()=>{
    //import cards in app and pass as props
    
    }, [])

  return (
    <div id = {'home-container'}>
      <div id='bannerHolder'>
      <div id='banner' >Bleh</div>
      <div id={'leftside'}>
 

   <a href='https://discord.gg/dhywT9me' target="_blank"className='homeButton'> <button onClick={(()=>{ 
      
    })} >
      Discord
    </button></a>
 
  <a href='https://ko-fi.com/vansim' target="_blank"className='homeButton' id= 'donate'>
        <button   onClick={(()=>{
    
        })}>
        Donate
      
          

        </button> 
         </a>
 <button className='homeButton' onClick={(()=>{props.setCurrentPage('deckmanager');
            axios.post(props.backendUrl + 'decks' , {user: props.user})
            .then(response =>  
            props.setDecks(response.data) ) 
 
 

      } ) }>Change Deck</button>


<button className='homeButton' onClick={(()=>{props.setCurrentPage('friendfight')})}>
      Friend Fight
      </button>

        <button className='homeButton' onClick={(()=>{
   
          
          
          props.setCurrentPage('randomfight')})}>Random Fight</button>


      </div>
      </div>
       <div id={'rightside'}>
  Users Online : {props.onlineUsers}
<div id="userInfo">
  <div>

  </div>
  {user.displayname}
 
</div>
<div id='deckInfo'>
  Active Deck
  <div>
    <img src= {props.activeDeck.FaceCard} className='faceCard'></img>
  </div>
<div>
  {props.activeDeck.Name}
</div>

 <div className='horizontal-ad' > 
 
 </div>
</div>
       </div>

    </div>
  )
}


 


