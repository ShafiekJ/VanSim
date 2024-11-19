import React , {useEffect, useState} from 'react'
import axios from 'axios'
import {v4 as uuidv4} from 'uuid'
import {Peer} from 'peerjs'
import { io } from 'socket.io-client'
import './Login.css'
export default function Login(props) {
//send current activedeck to server on logout and get it back when log in
  const [username , setUsername] = useState('');
  const [password , setPassword] = useState('');
  const [waitingForServer , setWaitingForServer] = useState(false)
useEffect(()=>{
if(props.loggedIn){
 
  props.setCurrentPage('home')
}

}, [props.loggedIn])
useEffect(()=>{

  document.getElementById("loginMain").addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard

    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("loginSubmit").click();
    }
  })
},[])
  return (

    //ask server for session . if yes, go to next page. else display login screen else display sign up screen
    <div id='loginMain'  className='info'>
      Login  
      <div  id='loginInput'>
        {
          //send message to server to keep track of active users
        }
      Username : <input id ={'username'} type={'email'} required={true}  onChange={(e)=>setUsername(e.target.value)} />
      Password : <input id ={'password'} type={'password'} required={true}  onChange={(e)=>setPassword(e.target.value)}/>
      </div>
      <div id='loginButtons' >
        <button type={'button'} id = {'loginSubmit'} onClick={(async()=>{ //disable button onclick to prevent multiplw xlixks
         if(waitingForServer){alert('Waiting for server');return}
         else{

   
         try{
          setWaitingForServer(true)
          
          await axios.post(  props.backendUrl + 'login' , {username : username , password:password}).then(
            async (res)=>{
           
            props.setSocket(await io.connect(props.backendUrl))
            props.setLoggedIn(res.data.user); 
            let tempUser = {displayname: res.data.userData.displayname , username:res.data.userData.username
             // profilepic: res.data.userData.profilepic
            }
            props.setUser(tempUser);props.setActiveDeck(res.data.userData.activeDeck)
            
                      }  
            )
}
catch{
  alert('Login Error')
}
setWaitingForServer(false)

}
            //setUser
          //prevent same user login
             
 
            // if(props.loggedIn === false){alert('Login Failed')}
          }
        )
        }  >Submit</button>
     

     
      </div>


      <button type={'button'} id = {'register'} onClick={(()=>{ //disable button onclick to prevent multiplw xlixks
        props.setCurrentPage('register')
        })
        }  >Register</button>



    </div>
  )
}
