import React , {useState ,  useEffect , useContext , useRef} from 'react'
 import cards from '../../Backend/tempCards.js'
 import './Deckbuilder.css'

 import banlist from '../../Backend/banlist.json'
 import sleeves from '../../Backend/Sleeves.json'
 import playmats from '../../Backend/Playmats.json'
 import Confirm from './Confirm'

import Message from './Message'

var faceCard = ''

var firstVanguard

const choiceRestrict = {//for other formats change to {format:{list}}
'Demon Stealth Dragon, Shiranui "Oboro' : ['Dragon Deity King of Resurgence, Dragveda'],
'Dragon Deity King of Resurgence, Dragveda' : ['Demon Stealth Dragon, Shiranui "Oboro'],
'Cerrgaon':['Dragheart, Luard'],
'Dragheart, Luard':['Cerrgaon'],
//e.g purpletrap : {jillvseries , pericorn}
}
const contAmounts = {
  'Neatness Meteor Shower' : 16
}
export default function Deckbuilder(props) { 

//make useref all let nonsense above

let decksLength = props.decks.length
const [loading , setLoading] = useState(true)
const [showMessage , setShowMessage] = useState(false)
const [overwrite , setOverwrite ]= useState(false)
const [deckName , setDeckName] = useState( "newDeck" + decksLength)//newDeck + decks.length import deckname
const [mainDeck , setMainDeck ]= useState([])
const [rideDeck , setRideDeck] = useState([])
const [deckCount, setDeckCount] = useState(0)
const [triggerCount, setTriggerCount] = useState(0)
const [sentinelCount , setSentinelCount] = useState(0)
const [filter, setFilter] = useState({grade : -1, text:'' , name:''})
const [confirmMessage, setConfirmMessage] = useState('')
const [sleeve, setSleeve] = useState({
  MainDeck: sleeves[0].img,
  RideDeck:sleeves[0].img,
  GDeck:sleeves[0].img
})
const sleeveButton = useRef()
const deckType = useRef('MainDeck')
const [playmat, setPlaymat] = useState(playmats[0].img)
const [showConfirm, setShowConfirm] = useState(false)
const [message, setMessage] = useState('')
const [counts, setCounts] = useState({})
const [deckTriggers, setDeckTriggers] = useState({
  "Heal" : 0,
  "Critical" : 0,
  "Front" : 0,
  "Draw": 0,
  "Over":0,
  "Total":0
})

const fullDeck = useRef({

})

const   rideDeckCounts = useRef({
grade0:false,
grade1:false,
grade2:false,
grade3:false,

})



const nationCards = cards.filter((card)=>{return card.nation === ""|| card.nation === props.nation})
const [filteredCards, setFilteredCards] = useState(nationCards)

function display(text){
  setMessage(text)
  setShowMessage(true)
  }
  
  async function timedDisplay(text){
    display(text)
    //after x seconds setmessage - false
  await new Promise(resolve => setTimeout(()=>{
  setShowMessage(false)
    resolve()
  } , 2000))
  
  }

const deckProperties = useRef({
  "gripho":false, //if rideDeck has gripho and 3 calamity, set to true, if true rideDeckcounts[over]= null, on ridedeckadd if grip true and c over 
  rideDeckSize: 4, // chage for gripho
  gDeck:null, //change for chronoand friends
  "Heal" : 4, //max values for triggers
  "Critical" : 8,
  "Front" : 8,
  "Draw": 8,
  "Over":1,
  "Total":16,
  sentinelMax:4,

})


let triggers = mainDeck.filter((card)=>{return card.cardtype.includes('Trigger Unit')})
let orders = mainDeck.filter((card)=>{return card.cardtype.includes('Order')})
let normalUnits = mainDeck.filter((card)=>{return card.cardtype.includes('Normal Unit') && !card.text.includes('[CONT]:Sentinel')})
let sentinels = mainDeck.filter((card)=>{return card.text.includes('[CONT]:Sentinel')})

  let nation = props.nation
  
  const allCards = cards.filter((card)=>{return card.nation === ""|| card.nation === nation})

  const [viewCard , setViewCard ]= useState(allCards[0])
 
const deckTypes = {
  normalDeck:{

  }
}

async function validateDeck(deck , deckType = 'normalDeck' ){//come back
//loop trough main and ride and g deck 
console.log('invalidate' , deck)
 
let deckValid = false
const deckTypes = {
  'normalDeck' : function(){
    let ride = deck.RideDeck
    let main = deck.MainDeck
    if(ride.length !== 4 || main.length !== 50){
      return false
    }
    let rideDeckCards = {
      0:true,
      1:true,
      2:true,
      3:true
    }
    let rideCount = 0
    for(let i =0; i<ride.length;i++){
      if(!ride[i].cardtype.includes('Unit')){
        return false
      }
      if(rideDeckCards[ride[i].grade]){
        rideDeckCards[ride[i].grade] = false
        rideCount ++
      }

      
    }
    if(rideCount !== 4){
      return false
    }
    let triggers = 0;
    let sentinel = 0;
    
    for(let i =0; i<main.length;i++){
      if(main[i].cardtype.includes('Trigger Unit')){
        triggers ++
      }
      if(main[i].text.includes('[CONT]:Sentinel')){
        sentinel ++ 
      }
    }
    if(triggers !== 16 || sentinel > 4){
      return false
    }
    return true
  },
  'griphoDeck' : function(deck){
    
  },
  'strideDeck' : function(deck){
    
  }
}
deckValid = deckTypes[deckType]()

return deckValid
}
function filterCards(){
  let newCards = [...nationCards]
  if (filter.grade > -1){
    newCards = newCards.filter((card)=>{return card.grade === filter.grade})
  }
  if (filter.text){
    newCards =  newCards.filter((card)=>{return card.text.toLowerCase().includes(filter.text.toLowerCase()) })
  }
  if (filter.name ){
    newCards =  newCards.filter((card)=>{return card.name.toLowerCase().includes(filter.name.toLowerCase())})
  }
return newCards
} 
 

//functions
function choiceRestrictCheck(cardName){
  let hasChoiceRestricted = false;
 
  if(choiceRestrict[cardName]){//if card to add is on choice restrict list
    let choiceRestrictedCard = choiceRestrict[cardName]
    for (let i = 0;i<choiceRestrictedCard.length;i++){
      if(counts[choiceRestrictedCard[i]]){//if deck currently contains a card that is choice restricted with a card on the list
        timedDisplay(`${choiceRestrictedCard[i]} and ${cardName} are choice restricted`)
        return false
      }
    }
  }
  return true
}
async function sentinelCheck(card){
  
 
  if(sentinelCount < deckProperties.current.sentinelMax){
    setSentinelCount(prevSentinelCount => prevSentinelCount + 1);
    return true
  }
return false
}

async function triggerCheck(card){//fix next
 
  if(deckProperties.current.Total === triggerCount){return false}
  if(card.triggereffect){
    let triggerType = card.triggereffect.split(' ')[0]
 
    if(deckTriggers[triggerType] < deckProperties.current[triggerType]){
      deckTriggers[triggerType] ++
      setDeckTriggers({...deckTriggers})
      setTriggerCount(prevTriggerCount => prevTriggerCount + 1); 
      return true
    }

}
return false
}

async function canAdd(cardName){//fix banlist[cardname] : 0
  //compare amount in deck with amount on banlist, compare amount of triggers , compare amount in ridedeck
  let canAdd = false
  let inDeck = counts[cardName]
  
  let banlistAmount = banlist[cardName]
  if(banlist[cardName]){
    //return dobanlistcheck

    if(banlistAmount < inDeck){
      canAdd = true
     }
  }
  else if(choiceRestrict[cardName]){
   if(choiceRestrictCheck(cardName)){
    canAdd = true
  } 
  }
  else if(contAmounts[cardName]){
     if( inDeck == null ||(inDeck < contAmounts[cardName])){
      canAdd = true
     }
    //dospecial check, eg premium aqua 
  }
  else if( inDeck == null ||(inDeck < 4)){
    canAdd = true
  }

  // if(inDeck !== (null || undefined)  && banlistAmount > inDeck){//if card is in deck
 
  //       console.log(banlistAmount)
  //   //check choicerestrict
  //   canAdd = await choiceRestrictCheck(cardName)
  
  // }

return canAdd
}


async function addCardMaindeck(card){//for maindeck if add === false , setmessage and display message in alert
  //check if card can be added => check if in deck, if it is check if the amount ind eck is less equal to than bacnlist an
  //less than banlist amount in deck
  if(deckCount === 50){return;}
  let add = true
  let cardName = card.name
//do can add check 
 
//do triggercheck
add = await canAdd(cardName)
if(card.cardtype.includes('Trigger Unit') && add){
  add = await triggerCheck(card);

 
}
if(card.text.includes('[CONT]:Sentinel') && add){
  add = await sentinelCheck(card);
}
 

if(add){
  //give id then   add
 
  if(counts[cardName] !== undefined){
    counts[cardName] += 1
  }
  else{counts[cardName] = 1}
  setCounts({...counts})
  setDeckCount(prevDeckCount => prevDeckCount + 1); 
  mainDeck.push(card)
  setMainDeck([...mainDeck])
 
}
 

}

 
async function removeMainDeck(section , index){
  let card
if(section === 'normalUnits'){
  card =  normalUnits.splice(index, 1)[0]
}
else if(section === 'triggers'){
  card =  triggers.splice(index, 1)[0]
 
    let triggerType = card.triggereffect.split(' ')[0]
 
     deckTriggers[triggerType] --; 
setDeckTriggers({...deckTriggers})
     setTriggerCount(prevTriggerCount => prevTriggerCount - 1); 
}
else if(section === 'orders'){
  card =  orders.splice(index, 1)[0]
}
else if(section === 'sentinels'){
  card =  sentinels.splice(index, 1)[0]
  setSentinelCount(prevSentinelCount => prevSentinelCount - 1);;
}
  counts[card.name] --;
  setDeckCount(prevDeckCount => prevDeckCount - 1); 
  setMainDeck([...normalUnits , ...triggers , ...orders, ...sentinels])
  setCounts({...counts})
 
}

async function addCardRideDeck(card){
  let key = 'grade'+ card.grade
  if(rideDeckCounts.current[key ] !== false){timedDisplay('Can only have 1 card of Grade ' + card.grade + ' in Ride Deck');return}
  let add = true
  let cardName = card.name


//do can add check 

add = await canAdd(cardName)
//do triggercheck
if(card.cardtype.includes('Trigger Unit')&& add){
  add = await triggerCheck(card);

}
if(card.text.includes('[CONT]:Sentinel')&& add){
  add = await sentinelCheck(card);
}

if(add){
  //give id then   add
  if(deckProperties.current.gripho === true && card.triggereffect.split(' ')[0] === 'Over'){
    rideDeckCounts.current['Over'] = card
  }
 
  if(counts[cardName] !== undefined){
    counts[cardName] += 1
    
  }
  else{counts[cardName] = 1}
  rideDeckCounts.current[key] = true
  setRideDeck([...rideDeck , card]) 
  //setDeckCount(prevDeckCount => prevDeckCount + 1); 
  setCounts({...counts})
  if(card.grade === 0){firstVanguard = card}
  else if(card.grade === 3){faceCard = card.img}
}
 


//set gripho = true
}

async function removeCardRideDeck(index){
  let card = rideDeck[index]
 
  let key = 'grade'+ card.grade


  if(card.cardtype.includes('Trigger Unit')){
//handle trigger nonsense
let triggerType = card.triggereffect.split(' ')[0]
 
deckTriggers[triggerType]--;
setDeckTriggers({...deckTriggers})
if(card.text.includes('[CONT]:Sentinel')){
  setSentinelCount(prevSentinelCount => prevSentinelCount - 1);;
}
setTriggerCount(prevTriggerCount => prevTriggerCount - 1); 
  }
  rideDeckCounts.current[key] = false;
  counts[card.name]--;
  rideDeck.splice(index , 1)
 // setDeckCount(prevDeckCount => prevDeckCount - 1); 
  setRideDeck([...rideDeck])
  setCounts({...counts})

}
async function importDeck(){//DO SPECIAL IMPORT FOR gripho and shit

  let tempMain = props.editDeck.MainDeck
  let tempRide = props.editDeck.RideDeck
  firstVanguard = props.editDeck.FirstVanguard
  faceCard = props.editDeck.FaceCard
  setSleeve(props.editDeck.Sleeves)
  setPlaymat(props.editDeck.Playmat)
  let tempDeckCount = 0
  let tempTriggerCount = 0
  let tempSleeve = ''
  let tempPlaymat = ''
  let nation = props.editDeck.nation //props.setNation(props.editDeck.nation)
  for(let i = 0;i<tempMain.length;i++){
    let card = tempMain[i]
    let cardName = card.name
    if(card.cardtype.includes('Trigger Unit') ){
      let triggerType = card.triggereffect.split(' ')[0]
      deckTriggers[triggerType] ++;

      tempTriggerCount++;
      setDeckTriggers({...deckTriggers})
    }
    if(card.text.includes('[CONT]:Sentinel')){
      setSentinelCount(prevSentinelCount => prevSentinelCount + 1);;
    }
    
    

      if(counts[cardName] !== undefined){
        counts[cardName] += 1
 
      }
      else{counts[cardName] = 1}
      tempDeckCount++;
   
    }
    for(let i = 0;i<tempRide.length;i++){
      let card = tempRide[i]
      let cardName = card.name
      if(card.cardtype.includes('Trigger Unit') ){
        let triggerType = card.triggereffect.split(' ')[0]
        deckTriggers[triggerType] ++;
  
        tempTriggerCount++;
        setDeckTriggers({...deckTriggers})
      }
      if(card.text.includes('[CONT]:Sentinel')){
        setSentinelCount(prevSentinelCount => prevSentinelCount + 1);;
      }
      
      
  
        if(counts[cardName] !== undefined){
          counts[cardName] += 1
      
        }
        else{counts[cardName] = 1}
        //tempDeckCount++;
        
      }
    setCounts({...counts})
   rideDeckCounts.current = {
      grade0:true,
      grade1:true,
      grade2:true,
      grade3:true,
      
      }
  setMainDeck(tempMain)
  setRideDeck(tempRide)
  setTriggerCount(tempTriggerCount)
  setDeckCount(tempDeckCount)
  setDeckName(props.editDeck.Name)

  props.setEditDeck(null)//if doesnt work, set to null on save deck
}

useEffect(()=>{
  if(props.editDeck !== null){
    importDeck()
  }

},[])
 

useEffect(()=>{ // load all images

setLoading(false)

},[])

useEffect(()=>{
  let newCards = filterCards()
 setFilteredCards(newCards)
},[filter])


{if(loading) {
  return (
    <div>
      Loading make loading comopoenet
    </div>

  )
}

}

  return (
    <div onAuxClick ={((e)=>{e.preventDefault()})} >
      <div id='topBar'>
      <div className='buttons'>
 
 <button  onClick={(()=>{setMessage('back'); setConfirmMessage('Go Back?'); setShowConfirm(true)}) }  >Back</button> 
 
 <button  onClick={(async ()=>{
   let decks = props.decks
   let decknameTaken = false
   fullDeck.current = {
    Name:deckName,
    MainDeck: mainDeck,
    RideDeck:rideDeck,
    FaceCard: faceCard,
    FirstVanguard: firstVanguard,
    Sleeves:sleeve,
    Playmat:playmat,
    Nation:nation
  }

  if(!await validateDeck(fullDeck.current)){
    timedDisplay('Invalid Deck'); return
  }
   //loop through decknames.
   for(let i =0;i< decks.length;i++){
 
     if(decks[i].Name !== (null||undefined)){
       if(decks[i].Name === deckName){
         setOverwrite(true)
         decknameTaken = true
       }
     }
   }
   if(decknameTaken){setConfirmMessage('Saving will overwrite deck \n' + deckName)}
   else{setConfirmMessage('Save Deck?')}
 

     setMessage('saveDeck'); setShowConfirm(true);



   
 
})} >Save Deck</button> 
</div>


<div id="collectionStuff">
Name Search: <input id='searchBar' placeholder = {'Name Search'}  onChange={((e)=>{setFilter({...filter , name:e.target.value}) 


})}/><br></br>
Text Search: <input id='searchBar' placeholder = {'Text Search'}   onChange={((e)=>{setFilter({...filter , text:e.target.value}) 


})}/>
{showMessage && <Message message = {message}  />}

{showConfirm && <Confirm  user={props.user} fullDeck={fullDeck.current} message={message} setShowConfirm={setShowConfirm} backendUrl = {props.backendUrl} confirmMessage={confirmMessage}  
 setCurrentPage={props.setCurrentPage} overwrite ={overwrite} deckName = {deckName} setActiveDeck={props.setActiveDeck} activeDeck={props.activeDeck} />} 
<div> grade buttons
  <button onClick={(()=>{
    if(filter.grade === 0) {  
    filter.grade = -1  
    }
    else{filter.grade = 0}
    setFilter({...filter})
  })} >Grade 0</button>
  <button onClick={(()=>{
    if(filter.grade === 1) {  
    filter.grade = -1  
    }
    else{filter.grade = 1}
    setFilter({...filter})
  })} >Grade 1</button>
  <button onClick={(()=>{

    if(filter.grade === 2) {  
    filter.grade = -1  
    }
    else{filter.grade = 2}
    setFilter({...filter})

  })} >Grade 2</button>
  <button onClick={(()=>{

    if(filter.grade === 3) {  
    filter.grade = -1  
    }
    else{filter.grade = 3}
    setFilter({...filter})

  })} >Grade 3</button> 
    <button onClick={(()=>{
    
    if(filter.grade === 4) {  
    filter.grade = -1  
    }
    else{filter.grade = 4}
    setFilter({...filter})

  })} >Grade 4</button> 
</div>


</div>


 
   <div id='deckStuff'>
   Deck Name: <input id='deckName' required={true} onChange={((e)=>{setDeckName(e.target.value)}) }  placeholder= {deckName} />
  <div id=''> filters

  <div>
  Deck Count: {deckCount}/50
  </div>
  <div>
    Trigger Count: {triggerCount} /16
  </div>
  </div>
   </div>
   </div>
    <div  id='container'>
 
<div id="viewCard" className='cardView'>
 
  
  
   <div className='cardImg'><img id='builderCardImg' className='cardImg'  src = {viewCard.img} /></div>
    <div className='cardName'>{viewCard.name}</div>    
   <div className='cardFlavor'>{viewCard.flavor}</div>
    <div className='cardText'>{viewCard.text}</div>

 
</div>
{
  //do displayList
  // setDisplayList(cardList.filter((card)=>{  return card.name.toLowerCase().includes(search.toLowerCase()) ;} ))
}
<div id="collection">


{filteredCards
.map( (card , index)=>{
  
  return <div className='collectionCard' key = {index} onMouseEnter = {(()=>{setViewCard(card);})} onClick={(()=>{ addCardMaindeck(card) })}  
onAuxClick = {((e)=>{ 
    e.preventDefault(); e.stopPropagation(); 
    if(e.button !== 2){e.preventDefault();  }//leftclick
//else{e.preventDefault();  addCard(k , banlist , cards, true);} ;
})//middle click

}

onContextMenu={((e)=>{e.preventDefault();addCardRideDeck(card)})}>
  
  
  <img src = {card.img} loading={'eager' || 'lazy' } />

   </div>} ) 
  
  }
{/* } */}
</div>
<div id="deck">

      <div className='rideDeck'> 
          Ride Deck
          <div className={'cards'} >  
{ rideDeck.map((k, index)=>{
return <div   key = {index} className ={'rideDeckCard'} 
onMouseEnter= {((e)=>{setViewCard(k) })} onContextMenu={((e)=>{e.preventDefault(); 
  removeCardRideDeck(index)})} > 
  <img    className ={'deckCard'} src = { k.img}/></div>
})}
</div>

        </div>
      <div id= {'mainDeck'}> Main Deck

      <h4>Normal Units</h4>
<div id={'normalunits'} className='deckSection' >  
<div className={'cards'} >  
{normalUnits.map((k, index)=>{
return <div key = {index} className ={'deckCard'}  
onMouseEnter= {((e)=>{ setViewCard(k)})} onContextMenu={((e)=>{e.preventDefault(); })}
onClick={((e)=>{e.preventDefault();removeMainDeck( 'normalUnits', index )})}> 
<img className ={'deckCard'} src = { k.img}/></div>
})} 
</div>   
</div>
<h4>Trigger Units</h4>
<div id={'triggerunits'} className='deckSection' >   
<div className='cards'> 
{triggers.map((k, index)=>{ return <div key = {index} className ={'deckCard'} 
onMouseEnter= {((e)=>{ setViewCard(k)})} onContextMenu={((e)=>{e.preventDefault(); })}
onClick={((e)=>{e.preventDefault();removeMainDeck( 'triggers', index )})}> 
  <img className ={'deckCard'} src = { k.img}/></div>
})} 
</div> 
</div>  
<h4>Orders</h4>
<div id={'orders'} className='deckSection' >    
<div className='cards'> 
{orders.map((k, index)=>{ return <div key = {index} className ={'deckCard'}  
onMouseEnter= {((e)=>{ setViewCard(k)})} onContextMenu={((e)=>{e.preventDefault(); })}
onClick={((e)=>{e.preventDefault();removeMainDeck( 'orders', index )})}> 
<img className ={'deckCard'} src = { k.img}/></div>
})} 
</div>  
</div>
<h4>Sentinels</h4>
<div id={'sentinels'} className='deckSection'  >    
<div className='cards' > 
 {sentinels.map((k, index)=>{return <div key = {index} className ={'deckCard'}  
onMouseEnter= {((e)=>{ setViewCard(k)})} onContextMenu={((e)=>{e.preventDefault(); })}
onClick={((e)=>{e.preventDefault();removeMainDeck( 'sentinels', index )})}> 
 <img className ={'deckCard'} src = { k.img}/></div>
})} 
</div>      
</div> 
      </div>

</div>

    </div>
 
<div  className='accessories' >
<h5>Sleeves</h5>
 
<div> 
<button disabled = {false} onClick={((e)=>{
  if(sleeveButton.current){
    sleeveButton.current.disabled = false
  }
  e.target.disabled = true
  sleeveButton.current = e.target
  deckType.current = 'RideDeck'
  setSleeve({...sleeve})
})} >Ride Deck Sleeves</button>
<button onClick={((e)=>{
  if(sleeveButton.current){
    sleeveButton.current.disabled = false
  }
  e.target.disabled = true
  sleeveButton.current = e.target
    deckType.current = 'MainDeck'
    setSleeve({...sleeve})
})} >Main Deck Sleeves</button>
<button onClick={((e)=>{
  if(sleeveButton.current){
    sleeveButton.current.disabled = false
  }
  e.target.disabled = true
  sleeveButton.current = e.target
    deckType.current = 'GDeck'
    setSleeve({...sleeve})
})} >G Deck Sleeves</button>

</div>
<div id='sleeveContainer' >
  {sleeves.map((sleev , index)=>{
              let selected = false ;

              if(sleeve[deckType.current]  === sleev.img){
                //highlight deck
                selected = true
              }
  
  
  return <div  key={index} className={`sleeve  ` +  (selected && 'selectedPlaymat') }   onClick={(()=>{
 
sleeve[deckType.current] = sleev.img
 
setSleeve({...sleeve})
})}  > 
<img src = {sleev.img}/>

</div>})}
</div>





 <h5>Playmats</h5>
<div id='playmats' >


  {playmats.map((mat , index)=>{
            let selected = false ;

            if(playmat  === mat.img){
  
              selected = true
            }
    
    return <div key={index} className={`playmat  ` +  (selected && 'selectedPlaymat') }       onClick={(()=>{setPlaymat(mat.img);
 
    })}  >
<img src = {mat.img}/>

</div>})}
</div>
</div>
 


    </div>
  )
  //do deck name check nezxt
}
