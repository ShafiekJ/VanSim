import { useState, useEffect } from 'react'

import './App.css'
import DeckBuildConfirm from './DeckBuildConfirm'
import Deckbuilder from './Deckbuilder'
import DeckManager from './DeckManager';
import Home from './Home';

import FriendFight from './FriendFight';
import RandomFight from './RandomFight';

import Login from './Login';
import Register from './Register';
import Rematch from './Rematch';

//const images = import.meta.glob('./images/*.{png,jpg,jpeg,svg}', { eager: true });

 

function App() {
 
// //do userobject{
//   username , profile photo , lastuseddeck

// }
 

const [activeDeck , setActiveDeck] = useState({faceCard:''})
const [decks, setDecks] = useState([])
const [editDeck , setEditDeck] = useState(null)
const [user, setUser] = useState({
username : '',
displayname : '',

})
const [onlineUsers, setOnlineUsers] = useState(0)
const [peer , setPeer] = useState(null)
const [socket, setSocket] = useState(null)
const [loggedIn , setLoggedIn] = useState(false)
const [currentPage , setCurrentPage] = useState('home')
const [clan , setClan] = useState('Royal Paladin')
const [format , setFormat] = useState('Standard')
const [nation , setNation] = useState('Dark States')

 const backendUrl = 'http://localhost:30000/'
//const backendUrl = 'https://server-6hpl.onrender.com/'
// useEffect(()=>{console.log(user)
//   axios.post('http://localhost:30000/loginCheck' , user).then((response)=>{setLoggedIn(response.data) ;  console.log(loggedIn)})

// })   
 

useEffect(()=>{//in game chage ridedeck zone to show topcard back onclick check show card back to opponent
  //infield for each wait function give it a separate div to click
  //hide butotons after click to prevent mulitple events
  //show when waiting for opponent
  //in deckbuilder remove sentinel count when removeing sentinel from ride deck
  if(!loggedIn){
    setCurrentPage('login')
  }
  }, [loggedIn])
  
  return (<>
  <div id = {'app'} onContextMenu={((e)=>{
      e.preventDefault();
 
  })}  onAuxClick={((e)=>{e.preventDefault()})}  onMouseDown={(e) => {
  if (e.target.tagName !== "INPUT") {
    e.preventDefault();
  }
  }}>

  {currentPage === 'login' && <Login  setCurrentPage = {setCurrentPage} setLoggedIn={setLoggedIn} loggedIn = {loggedIn}  setOnlineUsers = {setOnlineUsers}
  setUser = {setUser}   setSocket={setSocket} setActiveDeck={setActiveDeck} backendUrl = {backendUrl}  />}

  {currentPage === 'register' && <Register  setCurrentPage = {setCurrentPage} backendUrl = {backendUrl} 
    setUser = {setUser}   setActiveDeck={setActiveDeck}  setLoggedIn={setLoggedIn} loggedIn = {loggedIn} 
  setSocket={setSocket} 
  />}
  
  {currentPage === 'friendfight' && <FriendFight  setCurrentPage = {setCurrentPage}  user = {user}  
  peer ={peer} activeDeck={activeDeck} socket={socket} backendUrl = {backendUrl}/>}
  
  {currentPage === 'randomfight' && <RandomFight setCurrentPage = {setCurrentPage} user = {user} 
  peer ={peer} activeDeck={activeDeck} socket = {socket} backendUrl = {backendUrl}/>}
  
  {currentPage === 'home' && <Home setCurrentPage =  {setCurrentPage}   user = {user} setDecks = {setDecks} 
  activeDeck = {activeDeck} onlineUsers = {onlineUsers} setOnlineUsers={setOnlineUsers} socket={socket} backendUrl = {backendUrl}/>}
  
  {currentPage === 'deckmanager' && <DeckManager currentPage ={currentPage} setCurrentPage = {setCurrentPage} user = {user}   decks = {decks} setDecks={setDecks} editDeck={editDeck} 
  setNation=  {setNation} setEditDeck={setEditDeck} setActiveDeck={setActiveDeck} activeDeck={activeDeck} backendUrl = {backendUrl}/>}

  {currentPage === 'deckbuildconfirm' && <DeckBuildConfirm setClan = {setClan} setFormat = {setFormat} setNation = {setNation}
   setCurrentPage = {setCurrentPage}  backendUrl = {backendUrl}/>}

  {currentPage === 'deckbuilder' && <Deckbuilder user = {user} clan = {clan} decks = {decks} nation = {nation}  setActiveDeck={setActiveDeck} activeDeck={activeDeck}
  setCurrentPage = {setCurrentPage} editDeck={editDeck} setEditDeck={setEditDeck} backendUrl = {backendUrl}/>}

{currentPage === 'rematch' && <Rematch user = {user} clan = {clan} decks = {decks} nation = {nation} 
  setCurrentPage = {setCurrentPage} editDeck={editDeck} setEditDeck={setEditDeck} backendUrl = {backendUrl}/>}
  </div>
  
  
  {//random lobby, has field as child, send user and opponent as props, do the same for friendfight. finish decks. 
  //do game css better. uploadonline. do donation and ads. do login and register and deckmanager and deckconfirm and popup andabilityazone 
  //alert other player when one leaves. handle friendfight leaving
    // click random -> get opponent -> opponent and user put in waiting room where decide who goes first ->
    //handle optional abilities
    //do hover on abiltieslist to show ability text
  }
  
  </>)
}
export default App
