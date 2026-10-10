import React, {useState , useEffect, useContext} from 'react'
import Field from './Field'
import axios from 'axios'
 import { socket } from './socket'
import { dataContext } from './App'
import { Link } from 'react-router-dom'



export default function RandomFight() {
  const props = useContext(dataContext)
    const [ready , setReady] = useState(false)
    const [opponentData , setOpponentData] = useState({})
    const [roomID , setRoomID] = useState('')
    useEffect(()=>{  //do cancel button
        // props.socket.emit('randomFight' , {user: props.user, peerid:props.peer.id , FirstVanguard : props.activeDeck.FirstVanguard , socket:props.socket} ) //send sleeves and playmat also

        //send to server and setresoinse opponent
 
        let sorted = props.activeDeck.RideDeck.sort((card1 ,card2) => (card1.grade < card2.grade) ? 1 : (card1.grade > card2.grade) ? -1 : 0)
        //do sorted on deck save instead
        let unitImages = props.activeDeck.MainDeck.map((card)=>card.img)
        props.activeDeck.RideDeck = [...sorted]
 
        axios.post(props.backendUrl +'randomfight' , {displayname: props.user.displayname   , FirstVanguard : props.activeDeck.FirstVanguard ,
          Sleeves:props.activeDeck.Sleeves, Playmat:props.activeDeck.Playmat ,unitImages:unitImages
        } )
        .then((response)=>{
     
            
            socket.emit('joinRandom' , response.data.roomId)
            setRoomID(response.data.roomId)
            setOpponentData(response.data);
 
          //removeresponse  get firstvg from random
            setReady(true)
    
        //remove activeDeck from user to prevent viewing opponent deck in console

        })

      //  props.setMadeListeners(true)
    }, [])
  return (
    <div> 
      {  ready? <Field  user ={props.user} activeDeck = {props.activeDeck} opponentData= {opponentData} roomID ={roomID} socket ={props.socket}  backendUrl= {props. backendUrl }
       setCurrentPage={props.setCurrentPage}   madeListeners = {props.madeListeners} setMadeListeners={props. setMadeListeners} setFormat ={props.setFormat} format ={props.format}
      /> : <div> Girls are preparing, please wait warmly 

        <div> <Link to='/home' > <button onClick={(()=>{
          axios.post(props.backendUrl +'leaveRandomfight' , {displayname: props.user.displayname   , FirstVanguard : props.activeDeck.FirstVanguard } )
 
        })} >Leave</button></Link></div>
      </div> }

    </div>
  )
}
