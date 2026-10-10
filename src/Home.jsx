import React ,{useEffect, useContext} from 'react'
import axios from 'axios';
import { dataContext } from './App.jsx';
import {Adsense} from '@ctrl/react-adsense';
import Ad from './Ad';
import CustomImage from './CustomImage'
import LinkButton from './LinkButton.jsx';
import { socket } from './socket';
import './Home.css'
import { useNavigate } from 'react-router-dom';




export default function Home(props) {
  const navigate = useNavigate()
  const data = useContext(dataContext);
  console.log(data)
  let user = data.user
  let activeDeck = data.activeDeck
  const formats = ['Standard' , 'V Premium' , 'Premium']

  useEffect(()=>{
 
     socket.on('Recieved' , (dta)=>{
 
      data.setOnlineUsers(dta.onlineUsers)
  
      //  
    })
  
  
  }, [])
 

  return (
    
    <div id = {'home-container'}>
    {console.log(data.user , dataContext)}
      <div id='bannerHolder'>
      <div id='banner' >Bleh</div>
      <div id={'leftside'}>
 
<LinkButton className='homeButton' to='/login' text='Log Out' onClick={(()=>{
    localStorage.removeItem('vansimUser')
     socket.disconnect();
  data.setLoggedIn(false);
  
  } )}  ></LinkButton>

    <LinkButton className='homeButton' text='Discord'  onClick={(()=>{ 
          document.getElementById('discordLink').click()
    })} ><a href='https://discord.gg/SdARYHjvXP' id='discordLink' target="_blank"></a>
      
    </LinkButton>
 
 
        <LinkButton  className='homeButton' text='Donate' onClick={(()=>{
   // document.getElementById('donateLink').click()
 
        })}>
        
      
        <a href='https://ko-fi.com/vansim' target="_blank" id= 'donateLink'>
        </a>
        </LinkButton> 
        
 <LinkButton className='homeButton' to='/deckManager' text = 'Change Deck' ></LinkButton>


<LinkButton className='homeButton' to='/friendfight' text='Friend Fight' onClick={(()=>{})}>
      
      </LinkButton>

        <a><button className='homeButton'  onClick={(async()=>{
          
          //check if deck format matches selected format
          
          if(data.format === activeDeck.Format ){
             
            navigate('/randomfight')
          }
          else if(data.format === 'Standard' && activeDeck.Format == undefined){
            navigate('/randomfight')
          }
          else{
            alert('Wrong Deck For This Format')
          }
             })}
          
          
          >Random Fight</button></a>


      </div>
      </div>
       <div id={'rightside'}>
  Users Online : {data.onlineUsers}
<div id="userInfo">
  <div id='formatHolder' >
          {formats.map((format)=>  <button key={format} className={( 'format') } onClick={(()=>{data.setFormat(format)})} >{format}  </button>)}
  </div>
  {user.displayname}
 
</div>
<div id='deckInfo'>
  Active Deck
  <div>
    <CustomImage src= {data.activeDeck.FaceCard} className='faceCard'/> 
  </div>
<div>
  {data.activeDeck.Name}
</div>

 <div className='horizontal-ad' > 
 
 </div>
</div>
       </div>

    </div>
  )
}


 


