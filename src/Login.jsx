import React , {useContext, useEffect, useState} from 'react'
import axios from 'axios'
import {v4 as uuidv4} from 'uuid'
 
import { io } from 'socket.io-client'
import './Login.css'
import { socket } from './socket.js'
import { dataContext } from './App'
import { BrowserRouter , Navigate} from 'react-router-dom'
export default function Login() {
//send current activedeck to server on logout and get it back when log in
const props = useContext(dataContext)

  const [username , setUsername] = useState('');
  const [password , setPassword] = useState('');
  const [waitingForServer , setWaitingForServer] = useState(false)

//might be possilbe to save field game state using localstorage

useEffect(()=>{
    const loggedInUser = localStorage.getItem("vansimUser");
 
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
socket.connect()

      let tempUser = {displayname: foundUser.displayname , username:foundUser.username
        // profilepic: res.data.userData.profilepic
       }
       props.setUser(tempUser);props.setActiveDeck(foundUser.activeDeck)
       
     props.setLoggedIn(foundUser); 
    }

 
 
 
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
        {props.loggedIn? <Navigate to='/home'/> : <></>
          //send message to server to keep track of active users
        }
      Username : <input id ={'username'} type={'email'} required={true}  onChange={(e)=>setUsername(e.target.value)} />
      Password : <input id ={'password'} type={'password'} required={true}  onChange={(e)=>setPassword(e.target.value)}/>
      </div>
      <div id='loginButtons' >
        <button type={'button'} id = {'loginSubmit'} onClick={(async()=>{ //disable button onclick to prevent multiplw xlixks
         if(waitingForServer){alert('Waiting for server');return}
         else{
          console.log(props.loggedIn)
   
         try{
          setWaitingForServer(true)
          
          await axios.post(  props.backendUrl + 'login' , {username : username , password:password}).then(
            async (res)=>{
           
            socket.connect()
            props.setLoggedIn(res.data.user); 
            
            localStorage.setItem('vansimUser', JSON.stringify(res.data.userData))
            
            let tempUser = {displayname: res.data.userData.displayname , username:res.data.userData.username
             // profilepic: res.data.userData.profilepic
            }
            
            console.log(res.data )
            props.setDecks(res.data.decks)
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
        }  >  Submit</button>
     

     
      </div>


      <button type={'button'} id = {'register'} onClick={(()=>{ //disable button onclick to prevent multiplw xlixks
        props.setCurrentPage('register')
        })
        }  >Register</button>



    </div>
  )
}
