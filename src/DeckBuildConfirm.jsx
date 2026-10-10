import React , {useState, createContext, useEffect,useContext} from 'react'

import { Navigate, useNavigate } from 'react-router-dom'
import { dataContext } from './App'
import './DeckBuildConfirm.css'



export default function DeckBuildConfirm() {
const navigate = useNavigate()
  const props = useContext(dataContext)
  const [clan , setClan] = useState('Royal Paladin')
  const [format , setFormat] = useState('Premium')
  const [nation , setNation] = useState('Dark States')

const clanList = ['Royal Paladin' , 'Oracle Think Tank' , 'Angel Feather', 'Shadow Paladin' , 'Gold Paladin' , 'Genesis' , 'Kagero' ,
   'Nubatama' , 'Tachikaze' , 'Murakumo' , 'Narukami' , 'Nova Grappler' , 'Dimension Police' , 'Link Joker' , 'Spike Brothers' , 
   'Dark Irregulars' , 'Pale Moon' , 'Gear Chronicle' , 'Granblue' , 'Bermuda Triangle' , 'Aqua Force' , 'Megacolony' , 'Great Nature' , 'Neo Nectar'
  , 'Touken Ranbu', 'BanG Dream!'
  ]
  const nationList = ['Dragon Empire' , 'Dark States' , 'Brandt Gate', 'Keter Sanctuary', 'Stoicheia', 'Lyrical Monasterio' , 'Touken Ranbu', 'SHAMAN KING','Monster Strike' , 'BanG Dream!'] //
  const formatList = ['Standard' , 'V Premium' , 'Premium']
  const [clicked  , setClicked] = useState(nationList[0])
 


  return (
    
    <div>





      <div className='buttonHolder'>
  {
  //clanList.map((ele, index)=>{return <div key={ele}><button onClick={()=>{props.setClan(ele); props.setFormat('Premium');console.log(clan)}}> {clanList[index]} </button></div>})
  }Standard
  {nationList.map((ele, index)=>{return <div key={ele}><button
  className= {clicked ? 'clicked' : '' }
  
  onClick={()=>{props.setNation(ele);props.setFormat('Standard'); setClicked(ele);  navigate('/deckbuilder') }}> 
  {nationList[index]} </button></div>})}


     
      </div>
<div>
<br></br><br></br>
V Premium
{clanList.map((clan)=><button key={clan} onClick={(()=>{
  props.setClan(clan); props.setFormat('V Premium');  navigate('/deckbuilder') 
})} >{clan}</button>)}
</div>
<br></br><br></br>
<div>
Premium
{clanList.map((clan)=><button key={clan}  onClick={(()=>{
  props.setClan(clan); props.setFormat('Premium') ; navigate('/deckbuilder') 
})} >{clan}</button>)}
</div>



      <button onClick={(()=> { navigate('/deckmanager') })}> back</button>

    </div>
  )
}
