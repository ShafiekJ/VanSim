import  React , {useState , useEffect} from 'react'
import axios from 'axios'
import Field from './Field'

let lobbyNum = 0
export default function FriendFight({  socket, activeDeck, user, setCurrentPage, backendUrl }) {
    const [waiting , setWaiting] = useState(false)
    const [roomID , setRoomID] = useState('')
    const [inLobby , setInLobby] = useState(false)
 
    const [readyCount , setReadyCount] = useState(0)
    const [opponentData, setOpponentData] = useState(null)
    const [ready, setReady] = useState(false)

useEffect(()=>{

    socket.on('connect' , (socket)=>{
        console.log('connected to server')
    })
    socket.on('message' , (message)=>{
        console.log('gotteeen ' , message)
      })

    socket.on('no_room', ()=>{
        alert("Room doesn't exist")
    })
    socket.on('room_full' , ()=>{
        alert('Room is Full')
    })
    socket.on('joined_room' , (data)=>{
 
        //setCurrentPage('roomlobby') , change page to 
        setInLobby(true)
 
    })
 
    socket.on('sendUserData' , (data)=>{
            let tempOpp = data[lobbyNum%2]

            setOpponentData(tempOpp)
            setReady(true)

    })
    socket.on('updateRoom',()=>{
        setOpponentData(null)
        lobbyNum = 1
        console.log(lobbyNum)
 
    })

    socket.on('opponentData', (data)=>{console.log(data)})
} ,[])

 
 {if(inLobby === false)  return (
        <div>
            //
            <button onClick={(async ()=>{
                //make post request tp server and get room id back, display room id after
                //give peerID when signing in, send peerID when clicking host and join
                if(!waiting){
                    setWaiting(true)
                    socket.emit('message' , 'ass')
                    await axios.post( backendUrl+'friendfight/host' , {  socketId : socket.id}).then(async (response)=>{
                        setWaiting(false);
                        console.log(response.data)
                        let roomId = response.data.roomId
                        setRoomID(roomId)
                        lobbyNum = 1
                        socket.emit('join_room' , {roomId : roomId , host:true , userData:{displayname:user.displayname, 
                            Sleeves:props.activeDeck.Sleeves, Playmat:props.activeDeck.Playmat, 
                            FaceCard:activeDeck.FaceCard ,FirstVanguard : activeDeck.FirstVanguard ,socketid:socket.id}})
                        //detect when someone joins the room from here
                        //set timeout when userjoins timeout exits and normal matchmakingt hing
                        //show roomId
                        //emit event to create and join room, on join emit event to join room on server 
                    })
                }
    
            })} >
                {
                    //makes a 'room'/ array in the server when other person joins do usual matchmaking thing 
                   
                }
                Host
            </button>
                <input  placeholder={"Room ID"}
                onChange={((e)=>{
                    setRoomID(e.target.value)
                })}
               
                />
                 {console.log(roomID)}
            <button onClick={(async ()=>{
                //post input to server
                
                if(!waiting){
                    setWaiting(true)
                  
                        setWaiting(false);
                //if room is not full join 

                        socket.emit('join_room' , {roomId : roomID,host:false, userData:{displayname:user.displayname, 
                            Sleeves:props.activeDeck.Sleeves, Playmat:props.activeDeck.Playmat, 
                            FaceCard:activeDeck.FaceCard, FirstVanguard : activeDeck.FirstVanguard ,socketid:socket.id}})

                        lobbyNum = 2
                        
                        //send get opponetdata
                        //show roomId
           
                }
            })}>
                {
                    //generates a room id , use an object to bind room ids and rooms in the serverafter successful pairing, remove room id
                }
                Join
            </button>
    
                <button onClick={(()=>{//leave room, emit leaveroom
                   setCurrentPage('home')
                })} >
                    Back
                </button>
        </div>
      ) 
      else{
        return (
            <div>
      {  ready?
       <Field  user ={user} activeDeck = {activeDeck} opponentData= {opponentData}  roomID ={roomID} socket ={socket}
       setCurrentPage={setCurrentPage} 
      /> 
      
      : 
         <div>
      <div >
  {/* userData */}
      {user.displayname}
     <img className={'faceCard'} src =  {activeDeck.FaceCard} /> 
      </div>

      <div>Lobby Code : {roomID}</div>
 
      <button onClick={(()=>{
          //emit leave lobby signal
          setInLobby(false)
          setOpponentData(null)
          socket.emit('leave' , {roomId: roomID, lobbyNum, socketid:socket.id}) //add to server
      })}>Leave Lobby</button>
      
       </div> }
 
    </div>
     )
      }

 } 
}
