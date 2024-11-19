import React , {useState, useEffect} from 'react'
import axios from 'axios';
import { io } from 'socket.io-client'
export default function Register(props) {
    const [username , setUsername] = useState('');
    const [displayname , setDisplayname] = useState('');
    const [password , setPassword] = useState('');
    const [waitingForServer , setWaitingForServer] = useState(false)
    useEffect(()=>{

      document.getElementById("registerMain").addEventListener("keypress", function(event) {
        // If the user presses the "Enter" key on the keyboard
    
        if (event.key === "Enter") {
          // Cancel the default action, if needed
          event.preventDefault();
          // Trigger the button element with a click
          document.getElementById("registerSubmit").click();
        }
      })
    },[])
    return (
  
      //ask server for session . if yes, go to next page. else display login screen else display sign up screen
      <div  id='registerMain' className='info'>
        Register
        <div  >
        UserName : <input id ={'username'} type={'email'} required={true} onChange={(e)=>setUsername(e.target.value)} />
        DisplayName : <input id ={'displayname'} type={'text'} required={true}  onChange={(e)=>setDisplayname(e.target.value)}/>
        Password : <input id ={'password'} type={'password'} required={true}  onChange={(e)=>setPassword(e.target.value)}/>
        </div>
        <div>
          <button type={'submit'} id = {'registerSubmit'} onClick={(
            async ()=>{ //disable button onclick to prevent multiplw xlixks
          if(waitingForServer){alert('Waiting for server');return}
  
            setWaitingForServer(true)
            await  axios.post(props.backendUrl +'register' , {username : username , password:password , displayname: displayname, profilepic:''})
            .then(async (res)=>{console.log(res)
              props.setSocket(await io.connect(props.backendUrl))
              props.setLoggedIn(res.data.user); 
              let tempUser = {displayname: displayname, username:username
               // profilepic: res.data.userData.profilepic
              }
              props.setUser(tempUser);props.setActiveDeck(res.data.user.activeDeck)
              props.setCurrentPage('home')
            })
 
          setWaitingForServer(false)
        })
          }  >Submit</button>
        </div>
        <button type={'button'} id = {'login'} onClick={(()=>{ //disable button onclick to prevent multiplw xlixks
          props.setCurrentPage('login')
          })
          }  >Login</button>
      </div>
    )
}
