import React, {useState , useEffect} from 'react'
import Field from './Field'
import axios from 'axios'
 



export default function RandomFight(props) {
 
    const [ready , setReady] = useState(false)
    const [opponentData , setOpponentData] = useState({})
    const [roomID , setRoomID] = useState('')
    useEffect(()=>{  //do cancel button
        // props.socket.emit('randomFight' , {user: props.user, peerid:props.peer.id , FirstVanguard : props.activeDeck.FirstVanguard , socket:props.socket} ) //send sleeves and playmat also

        //send to server and setresoinse opponent
 
        let sorted = props.activeDeck.RideDeck.sort((card1 ,card2) => (card1.grade < card2.grade) ? 1 : (card1.grade > card2.grade) ? -1 : 0)
        //do sorted on deck save instead
        props.activeDeck.RideDeck = [...sorted]
 
        axios.post(props.backendUrl +'randomfight' , {displayname: props.user.displayname   , FirstVanguard : props.activeDeck.FirstVanguard ,
          Sleeves:props.activeDeck.Sleeves, Playmat:props.activeDeck.Playmat
        } )
        .then((response)=>{
     
            
            props.socket.emit('joinRandom' , response.data.roomId)
            setRoomID(response.data.roomId)
            setOpponentData(response.data);
 
          //removeresponse  get firstvg from random
            setReady(true)
    
        //remove activeDeck from user to prevent viewing opponent deck in console

        })


    }, [])
  return (
    <div>
      {  ready? <Field  user ={props.user} activeDeck = {props.activeDeck} opponentData= {opponentData} roomID ={roomID} socket ={props.socket}
       setCurrentPage={props.setCurrentPage} 
      /> : <div> Girls are preparing, please wait warmly 

        <div>  <button onClick={(()=>{
          axios.post(props.backendUrl +'leaveRandomfight' , {displayname: props.user.displayname   , FirstVanguard : props.activeDeck.FirstVanguard } ).then((res)=>{
            props.setCurrentPage('home')
            console.log(res)
          })
        })} >Leave</button> </div>
      </div> }

    </div>
  )
}
