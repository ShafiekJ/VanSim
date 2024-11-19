import React , {useState, createContext, useEffect} from 'react'

import './DeckBuildConfirm.css'


export const context = createContext()

export default function DeckBuildConfirm(props) {

  const [clan , setClan] = useState('Royal Paladin')
  const [format , setFormat] = useState('Premium')
  const [nation , setNation] = useState('Dark States')

  // const clanList = ['Royal Paladin' , 'Oracle Think Tank' , 'Angel Feather', 'Shadow Paladin' , 'Gold Paladin' , 'Genesis' , 'Kagero' , 'Nubatama' , 'Tachikaze' , 'Murakumo' , 'Narukami' , 'Nova Grappler' , 'Dimension Police' , 'Etranger' , 'Link Joker' , 'Spike Brothers' , 'Dark Irregulars' , 'Pale Moon' , 'Gear Chronicle' , 'Granblue' , 'Bermuda Triangle' , 'Aqua Force' , 'Megacolony' , 'Great Nature' , 'Neo Nectar']
  const nationList = ['Dragon Empire' , 'Dark States' , 'Brandt Gate', 'Keter Sanctuary', 'Stoicheia', 'Lyrical Monasterio' , 'Touken Ranbu', 'SHAMAN KING'] //,'Monster Strike' , 'BanG Dream!'
  const formatList = ['Standard' , 'Premium']
  const [clicked  , setClicked] = useState(nationList[0])
 


  return (
    
    <div>





      <div className='buttonHolder'>
  {
  //clanList.map((ele, index)=>{return <div key={ele}><button onClick={()=>{props.setClan(ele); props.setFormat('Premium');console.log(clan)}}> {clanList[index]} </button></div>})
  }
  {nationList.map((ele, index)=>{return <div key={ele}><button
  className= {clicked ? 'clicked' : ''}
  
  onClick={()=>{props.setNation(ele); setClicked(ele);props. setCurrentPage('deckbuilder') }}> 
  {nationList[index]} </button></div>})}
     
      </div>
      <button onClick={(()=> {props.setCurrentPage('deckmanager') })}> back</button>
      <button onClick={(()=> { })}> Gripho</button>
    </div>
  )
}
