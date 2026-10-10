import React , {useState ,  useEffect , useRef,useContext} from 'react'
 import cards from '../../Backend/cards.json'
 import gCards from '../../Backend/gCards.json'
 import vCards from '../../Backend/vCards.json'
 import './Deckbuilder.css'
import { dataContext } from './App'
 import banlist from '../../Backend/banlist.json'
 import sleeves from '../../Backend/Sleeves.json'
 import playmats from '../../Backend/Playmats.json'
 import Confirm from './Confirm'
 import CustomImage from './CustomImage'
import Message from './Message'


 

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

let list = cards
export default function Deckbuilder( ) { 
  const props = useContext(dataContext)

  if(props.format === 'Premium'){
    list = [...vCards, ...gCards , ...cards ]
  }
  else if(props.format === 'V Premium'){
    list = vCards
  }
  else if(props.format === 'Standard'){
    list = cards
  }
//make useref all let nonsense above

let decksLength = props.decks.length
const [loading , setLoading] = useState(true)
const [showMessage , setShowMessage] = useState(false)
const [overwrite , setOverwrite ]= useState(false)
const [deckName , setDeckName] = useState( "newDeck" + decksLength)//newDeck + decks.length import deckname
const [mainDeck , setMainDeck ]= useState([])
const [rideDeck , setRideDeck] = useState([])
const [gDeck , setGDeck] = useState([])
const [deckCount, setDeckCount] = useState(0)
const [gDeckCount, setGDeckCount] = useState(0)
const [triggerCount, setTriggerCount] = useState(0)
const [sentinelCount , setSentinelCount] = useState(0)
const deckType = useRef('normal')
const [filter, setFilter] = useState({grade : -1, text:'' , name:'', cardtype: ''})
const [confirmMessage, setConfirmMessage] = useState('')
const [sleeve, setSleeve] = useState({
  MainDeck: sleeves[0].img,
  RideDeck:sleeves[0].img,
  GDeck:sleeves[0].img
})
const sleeveButton = useRef()
const firstVanguard = useRef(undefined)
const faceCard = useRef('')
const sleeveType = useRef('MainDeck')
const [playmat, setPlaymat] = useState(playmats[0].img)
const [showConfirm, setShowConfirm] = useState(false)
const [message, setMessage] = useState('')
const [counts, setCounts] = useState({})
const [gCounts, setGCounts] = useState({})
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

 

let nationCards = list.filter((card)=>{return card.nation === ""|| card.nation.includes(props.nation)})
if(props.format !== 'Standard'){
  let nations = {
    
  }
  nationCards =  list.filter((card)=>{return card.nation === ""|| card.clan.includes(props.clan) ||card.nation.includes(nations[props.clan]) })
}
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
let normalUnits = mainDeck.filter((card)=>{return card.cardtype.includes('Normal Unit')})
 

  let nation = props.nation
  
  const allCards = cards.filter((card)=>{return card.nation === ""|| card.nation === nation})

  const [viewCard , setViewCard ]= useState(allCards[0])
 
 
async function validateDeck(deck , deckType = 'normalDeck' , format = 'Standard'){//come back
//loop trough main and ride and g deck 
if(faceCard.current === ''){
  deck.FaceCard = deck.MainDeck[0].img
}
let deckValid = false
 
if(format === 'Premium'){
  const check = function(){
 
    if(gDeck.length > 16){return false}
 
    if( firstVanguard.current == undefined ){
      return false
    }
 
    let main = [...deck.MainDeck]
  
    if( main.length !== 49){
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

    if(firstVanguard.current.cardtype.includes('Trigger Unit')){
      triggers ++
    }
    if(firstVanguard.current.text.includes('[CONT]:Sentinel')){
      sentinel ++ 
    }

   
    if(triggers !== 16 || sentinel > 4){
      return false
    }
    
    return true
  }
  deckValid = check()
 
}

else if(format === 'V Premium'){
const check = function(){

  if(gDeck.length > 0){return false}
  if( firstVanguard.current == undefined ){
    return false
  }
  let main = [...deck.MainDeck]

  if( main.length !== 49){
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

  if(firstVanguard.current.cardtype.includes('Trigger Unit')){
    triggers ++
  }
  if(firstVanguard.current.text.includes('[CONT]:Sentinel')){
    sentinel ++ 
  }

 
  if(triggers !== 16 || sentinel > 4){
    return false
  }
  
  return true
}
deckValid = check()
 
}

else if(format === 'Standard'){
  const deckTypes = {
  'normal' : function(){
    if(gDeck.length > 0){return false}
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
    let triggers = 0;
    let sentinel = 0;
    for(let i =0; i<ride.length;i++){
      if(!ride[i].cardtype.includes('Unit')){
        return false
      }
      if(rideDeckCards[ride[i].grade]){
        rideDeckCards[ride[i].grade] = false
        rideCount ++
      }
      if(ride[i].cardtype.includes('Trigger Unit')){
        triggers ++
      }
      if(ride[i].text.includes('[CONT]:Sentinel')){
        sentinel ++ 
      }
      
    }
    if(rideCount !== 4){
      return false
    }

    
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
  'gripho' : function(deck){
    if(gDeck.length > 0){return false}
    let ride = deck.RideDeck
    let main = deck.MainDeck
    if(ride.length !== 5 || main.length !== 50){
      return false
    }
    let rideDeckCards = {
      0:true,
      1:true,
      2:true,
      3:true
    }
    let hasGripho = false
    let hasOver = false
    let calamityCount = 0
    let rideCount = 0
    let triggers = 0;
    let sentinel = 0;
    for(let i =0; i<ride.length;i++){
      if(!ride[i].cardtype.includes('Unit')){
        return false
      }
      if(rideDeckCards[ride[i].grade]){
        rideDeckCards[ride[i].grade] = false
        rideCount ++
      }
      if(ride[i].cardtype.includes('Trigger Unit')){

        triggers ++
        if(ride[i].triggereffect.includes('Over'))
          hasOver = true
        }

      if(ride[i].text.includes('[CONT]:Sentinel')){
        sentinel ++ 
      }
      
      if(ride[i].cardtype.includes('Calamity')){
        calamityCount ++ 
      }
      
      if(ride[i].name === 'Griphosid'){
        hasGripho = true
      }
      
    }
    if(calamityCount !== 3){
      return false
    }
    if(hasOver === false){
      return false
    }
    if(hasGripho === false){
      return false
    }
    
    
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
  'stride' :function(){
    //SORT ridedck and check grade 0 name then check if other ridedeck cards are the right ones
    let ride = deck.RideDeck.sort((card1 ,card2) => (card1.grade < card2.grade) ? -1 : (card1.grade > card2.grade) ? 1 : 0)
    let main = deck.MainDeck
    const decks = {
      //grade0name : 
      'Undying Departed, Grenache': 'Parting Shade Pirate Swordsman, Colombard Vampire Princess of Night Fog, Nightrose' ,
      'Happiness Collector' :  'Moonlight Melody Tamer, Betty Card Dealer, Jacqueline Masked Magician, Harri',
    }
    if(ride.length !== 4 || main.length !== 50){
      return false
    }
    let rideDeckCards = {
      0:false,
      1:true,
      2:true,
      3:true
    }
    let rideCount =1
    let triggers = 0;
    let sentinel = 0;
    let g0 = ride[0]
 
    if(!decks[g0.name]){
      return false

    }
    let text = decks[g0.name]
 
    for(let i =1; i<ride.length;i++){
      if(!ride[i].cardtype.includes('Unit')){
        return false
      }
      if(rideDeckCards[ride[i].grade]){
        rideDeckCards[ride[i].grade] = false
        rideCount ++
      }
      let name = ride[i].name
  
      if(!text.includes(name) && gdeck.length > 0){
        return false
      }
      if(main[i].cardtype.includes('Trigger Unit')){
        triggers ++
      }
      if(main[i].text.includes('[CONT]:Sentinel')){
        sentinel ++ 
      }
      
    }
    if(rideCount !== 4){
      return false
    }
    if(gDeck.length > 0){
      let possibleG4s = {
        'Undying Departed, Grenache': 'Ghostie Great King, Obadiah Mist Phantasm Pirate King, Nightrose' ,
        'Happiness Collector' :  'Jester Demonic Dragon, Lunatec Dragon Dragon Masquerade, Harri',
      }
      for(let i = 0;i<gDeck.length;i++){

        let card = gDeck[i]
        let cardName = card.name
        if(!possibleG4s[g0.name].includes(cardName) ){
          return false
        }
      }
    }
    
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
  }
}
deckValid = deckTypes[deckType]()
}


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
    if (filter.cardtype ){
    newCards =  newCards.filter((card)=>{return card.cardtype.toLowerCase().includes(filter.cardtype.toLowerCase())})
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
  //if cardnamne is aqua sentianel max = 6 then check if only aqua in confirm
 
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
function canAddGDeck(card){
 
if(deckType.current !== 'stride' && props.format !== 'Premium'){
  return false
}
if(gDeckCount === 16){
  return
}
 
let accessible = {

}
let cardName = card.name
let canAdd = false
let inDeck = gCounts[card.name]

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
 
return canAdd

}

async function addCardGDeck(card){
//come back when g guardians
let cardName = card.name
if(canAddGDeck(card)){
  setGDeck([...gDeck, card])
  if(gCounts[cardName] !== undefined){
    gCounts[cardName] += 1
  }
  else{gCounts[cardName] = 1}
  setGCounts({...gCounts})
  setGDeckCount(prevDeckCount => prevDeckCount + 1)
}

}
async function addCardMaindeck(card){//for maindeck if add === false , setmessage and display message in alert
  //check if card can be added => check if in deck, if it is check if the amount ind eck is less equal to than bacnlist an
  //less than banlist amount in deck
 
  if(deckCount === 50 &&!card.cardtype.includes('G Unit') ){return;}
  let add = true
  let cardName = card.name
//do can add check 
 
//do triggercheck
add = await canAdd(cardName)
 
if(card.cardtype.includes('G Unit')){
  await addCardGDeck(card);

 return
}
if(card.cardtype.includes('Trigger Unit') && add){
  add = await triggerCheck(card);

 
}
 
if(card.text.includes('[CONT]:Sentinel') && add){
  add = await sentinelCheck(card);
}
 
 
if(add){
  //give id then   add
  if(card.triggereffect){
    let triggerType = card.triggereffect.split(' ')[0]
 
  if(deckTriggers[triggerType] < deckProperties.current[triggerType]){
    deckTriggers[triggerType] ++
    setDeckTriggers({...deckTriggers})
    setTriggerCount(prevTriggerCount => prevTriggerCount + 1); 
  }
}
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
async function removeGDeck(index){
  let card =  gDeck.splice(index, 1)[0]
  
  gCounts[card.name] --;
  setGDeckCount(prevDeckCount => prevDeckCount - 1); 
  setGDeck([...gDeck])
  setGCounts({...gCounts})

}
 
async function removeMainDeck(section , index){
  let card
  
if(section === 'normalUnits'){
  card =  normalUnits.splice(index, 1)[0]
}
 
 if(section === 'triggers'){
  card =  triggers.splice(index, 1)[0]
 
    let triggerType = card.triggereffect.split(' ')[0]
 
     deckTriggers[triggerType] --; 
setDeckTriggers({...deckTriggers})
     setTriggerCount(prevTriggerCount => prevTriggerCount - 1); 
}

 if(section === 'orders'){
  card =  orders.splice(index, 1)[0]
}

if(card.text.includes('[CONT]:Sentinel') ){
  setSentinelCount(prevSentinelCount => prevSentinelCount - 1);;
}
  counts[card.name] --;
  setDeckCount(prevDeckCount => prevDeckCount - 1); 
  setMainDeck([...normalUnits , ...triggers , ...orders])
  setCounts({...counts})
 
}

async function addCardRideDeck(card){
  if(props.format !== 'Standard'){
    if(card.grade === 0 && !card.cardtype.includes('Order')){
      let add = false
      let cardName = card.name

      add = await canAdd(cardName)
 
      if(card.cardtype.includes('Trigger Unit') && add){
        add = await triggerCheck(card);
 
      }
      if(card.text.includes('[CONT]:Sentinel') && add){
        add = await sentinelCheck(card);
      }
 
      if(add){
        //give id then   add
        if(firstVanguard.current !== undefined){
          counts[firstVanguard.current.name]--;
          let trigger = 0
          let sentinel = 0
          if(card.cardtype.includes('Trigger')){
 
              let triggerType = card.triggereffect.split(' ')[0]
           
               deckTriggers[triggerType] ++; 
            trigger ++;
               
          }
 
          if(card.text.includes('[CONT]:Sentinel') ){
           sentinel ++;
            
          }

          if(firstVanguard.current.cardtype.includes('Trigger')){
 
            let triggerType = firstVanguard.current.triggereffect.split(' ')[0]
         
             deckTriggers[triggerType] --; 
            trigger --;
             
        }

        if(firstVanguard.current.text.includes('[CONT]:Sentinel') ){  
 
          sentinel --;
        }
     setTriggerCount(prevTriggerCount => prevTriggerCount + trigger); 
   
        setSentinelCount(sentinelCount + sentinel);;
        setDeckTriggers({...deckTriggers})
        }
        if(counts[cardName] !== undefined){
          counts[cardName] += 1
        }
        else{counts[cardName] = 1}
        setCounts({...counts})


        if(firstVanguard.current === undefined){
        setDeckCount(prevDeckCount => prevDeckCount + 1); 
        if(card.cardtype.includes('Trigger')){
 
            let triggerType = card.triggereffect.split(' ')[0]
         
             deckTriggers[triggerType] ++; 
        setDeckTriggers({...deckTriggers})
             setTriggerCount(prevTriggerCount => prevTriggerCount + 1); 
        }
 


        }
        
      
        firstVanguard.current = card;
        
        setSleeve({...sleeve});
        setMainDeck([...mainDeck])
       
      }
 
    }
 
   
    return}
  let key = 'grade'+ card.grade
  if(card.grade >3){timedDisplay('Cannot add grade ' + card.grade + ' to Ride Deck');return}
  
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
 
 
  if(counts[cardName] !== undefined){
    counts[cardName] += 1
    
  }
  else{counts[cardName] = 1}
  rideDeckCounts.current[key] = true
  setRideDeck([...rideDeck , card]) 
  //setDeckCount(prevDeckCount => prevDeckCount + 1); 
  setCounts({...counts})
  if(card.grade === 0){firstVanguard.current = card}
  else if(card.grade === 3){faceCard.current = card.img}
}
 


//set gripho = true
}

async function removeCardRideDeck(index){
  if(props.format !== 'Standard'){
    if(firstVanguard.current != undefined){
      let card = firstVanguard.current
      firstVanguard.current = undefined; 
 
       if(card.cardtype.includes('Trigger')){
      
          let triggerType = card.triggereffect.split(' ')[0]
       
           deckTriggers[triggerType] --; 
      setDeckTriggers({...deckTriggers})
           setTriggerCount(prevTriggerCount => prevTriggerCount - 1); 
      }
      if(card.text.includes('[CONT]:Sentinel')){
        setSentinelCount(prevSentinelCount => prevSentinelCount - 1);;
      }
        counts[card.name] --;
        setDeckCount(prevDeckCount => prevDeckCount - 1); 
        setMainDeck([...normalUnits , ...triggers , ...orders])
        setCounts({...counts})
       
    }
    return}
  let card = rideDeck[index]
 
  let key = 'grade'+ card.grade


  if(card.cardtype.includes('Trigger Unit')){
//handle trigger nonsense
let triggerType = card.triggereffect.split(' ')[0]
 
deckTriggers[triggerType]--;
setDeckTriggers({...deckTriggers})
 
setTriggerCount(prevTriggerCount => prevTriggerCount - 1); 
  }

  if(card.text.includes('[CONT]:Sentinel')){
    setSentinelCount(prevSentinelCount => prevSentinelCount - 1);;
  }
  rideDeckCounts.current[key] = false;
  counts[card.name]--;
  rideDeck.splice(index , 1)
 // setDeckCount(prevDeckCount => prevDeckCount - 1); 
  setRideDeck([...rideDeck])
  setCounts({...counts})

}
async function importDeck(){ 
  let format = props.editDeck.Format   
   props.setFormat(props.editDeck.Format)   
   props.setClan(props.editDeck.Clan)  
  
  if(format === '' || format == undefined){format = 'Standard' ; props.setFormat('Standard')} 
  console.log(props.format)
if(format === 'Premium'){
 
  firstVanguard.current = props.editDeck.FirstVanguard
  let tempMain = [...props.editDeck.MainDeck ]

  faceCard.current = props.editDeck.FaceCard
  setSleeve(props.editDeck.Sleeves)
  setPlaymat(props.editDeck.Playmat)
  let tempDeckCount = 0
  let tempTriggerCount = 0

  let card = firstVanguard.current

  if(card.cardtype.includes('Trigger Unit') ){
    let triggerType = card.triggereffect.split(' ')[0]
    deckTriggers[triggerType] ++;
    tempTriggerCount++;
    setDeckTriggers({...deckTriggers})
  }
  if(card.text.includes('[CONT]:Sentinel')){
    setSentinelCount(prevSentinelCount => prevSentinelCount + 1);;
  }
  if(counts[card.name] !== undefined){
    counts[card.name] += 1

  }
  else{counts[card.name] = 1}
  tempDeckCount++;

 
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

    if(props.editDeck.GDeck){
      let tempG = props.editDeck.GDeck
      for(let i = 0;i<tempG.length;i++){

        let card = tempG[i]
        let cardName = card.name
      
        if(gCounts[cardName] !== undefined){
          gCounts[cardName] += 1
        }
        else{gCounts[cardName] = 1}
        setGCounts({...gCounts})
        setGDeckCount(prevDeckCount => prevDeckCount + 1)
      }
      setGDeck([...props.editDeck.GDeck])
    }
    setMainDeck(tempMain)
    setTriggerCount(tempTriggerCount)
    setDeckCount(tempDeckCount)
    setDeckName(props.editDeck.Name)
    
}
else if(format === 'V Premium'){
  firstVanguard.current = props.editDeck.FirstVanguard
  let tempMain = [...props.editDeck.MainDeck]

  faceCard.current = props.editDeck.FaceCard
  setSleeve(props.editDeck.Sleeves)
  setPlaymat(props.editDeck.Playmat)
  let tempDeckCount = 0
  let tempTriggerCount = 0
 

  let card = firstVanguard.current

  if(card.cardtype.includes('Trigger Unit') ){
    let triggerType = card.triggereffect.split(' ')[0]
    deckTriggers[triggerType] ++;
    tempTriggerCount++;
    setDeckTriggers({...deckTriggers})
  }
  if(card.text.includes('[CONT]:Sentinel')){
    setSentinelCount(prevSentinelCount => prevSentinelCount + 1);;
  }
  if(counts[card.name] !== undefined){
    counts[card.name] += 1

  }
  else{counts[card.name] = 1}
  tempDeckCount++;


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
 
    setMainDeck(tempMain)
    setTriggerCount(tempTriggerCount)
    setDeckCount(tempDeckCount)
    setDeckName(props.editDeck.Name)
    
}
  else if(format === 'Standard'){

    let tempMain = props.editDeck.MainDeck
    let tempRide = props.editDeck.RideDeck
    firstVanguard.current = props.editDeck.FirstVanguard
    faceCard.current = props.editDeck.FaceCard
    setSleeve(props.editDeck.Sleeves)
    setPlaymat(props.editDeck.Playmat)
    let tempDeckCount = 0
    let tempTriggerCount = 0
    let tempSleeve = ''
    let tempPlaymat = ''
    let nation = props.editDeck.nation //props.setNation(props.editDeck.nation)
    deckType.current = props.editDeck.deckType || 'normal'
   
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
        if(props.editDeck.GDeck){
          let tempG = props.editDeck.GDeck
          for(let i = 0;i<tempG.length;i++){
            
            let card = tempG[i]
            let cardName = card.name
 
            if(gCounts[cardName] !== undefined){
              gCounts[cardName] += 1
            }
            else{gCounts[cardName] = 1}
            setGCounts({...gCounts})
            setGDeckCount(prevDeckCount => prevDeckCount + 1)
          }
          setGDeck([...props.editDeck.GDeck])
        }
        
    setMainDeck(tempMain)
    setRideDeck(tempRide)
    setTriggerCount(tempTriggerCount)
    setDeckCount(tempDeckCount)
    setDeckName(props.editDeck.Name)
  

  }
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
  const getImages = async ()=>{  }
  getImages()
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
    FaceCard: faceCard.current,
    FirstVanguard: firstVanguard.current,
    Sleeves:sleeve,
    Playmat:playmat,
    Nation:nation,
    deckType: deckType.current,
    Format : props.format || 'Standard',
    Clan: firstVanguard.current.clan || ''
  }

if(gDeck.length > 0){
  fullDeck.current['GDeck'] = gDeck
}
  if(!await validateDeck(fullDeck.current, deckType.current,props.format)){
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
<div id='deckTypeButtons' >

<button onClick={(()=> {deckType.current = 'normal' } )}> Normal</button>
      <button onClick={(()=> {  deckType.current = 'gripho'  })}> Gripho</button>
      <button onClick={(()=> { deckType.current = 'stride' } )}> Stride</button>
</div>
</div>

 
<div id="collectionStuff">
Name Search: <input id='searchBar' placeholder = {'Name Search'}  onChange={((e)=>{setFilter({...filter , name:e.target.value}) 


})}/><br></br>
Text Search: <input id='searchBar' placeholder = {'Text Search'}   onChange={((e)=>{setFilter({...filter , text:e.target.value}) 


})}/>
{showMessage && <Message message = {message}  />}

{showConfirm && <Confirm  user={props.user} fullDeck={fullDeck.current} message={message} setShowConfirm={setShowConfirm} backendUrl = {props.backendUrl} confirmMessage={confirmMessage}  
 setCurrentPage={props.setCurrentPage} overwrite ={overwrite} deckName = {deckName} setActiveDeck={props.setActiveDeck} activeDeck={props.activeDeck} decks={props.decks} setDecks={props.setDecks}   />} 
<div>  
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
<div className='typeButtons'> 
    <button onClick={(()=>{
    if(filter.cardtype.includes('Normal Unit')) {  
    filter.cardtype = ""  
    }
    else{filter.cardtype = "Normal Unit" }
    setFilter({...filter})
  })} >Normal Unit</button>

  <button onClick={(()=>{
    if(filter.cardtype.includes('Trigger Unit')) {  
     filter.cardtype = ""  
    }
    else{ filter.cardtype = "Trigger Unit"  }
    setFilter({...filter})
  })} >Trigger Unit</button>
  <button onClick={(()=>{
    if(filter.cardtype.includes('Normal Order')) {  
     filter.cardtype = ""  
    }
    else{filter.cardtype = "Normal Order" }
    setFilter({...filter})

  })} >Normal Order</button>
  <button onClick={(()=>{
    if(filter.cardtype.includes('Blitz Order')) {  
     filter.cardtype = ""  
    }
    else{filter.cardtype = "Blitz Order" }
    setFilter({...filter})

  })} >Blitz Order</button> 
    <button onClick={(()=>{
    
    if(filter.cardtype.includes('Set Order')) {  
     filter.cardtype = ""  
    }
    else{filter.cardtype = "Set Order" }
    setFilter({...filter})

  })} >Set Order</button> 
   
   </div>

<button onClick={(()=>{setFilter({grade : -1, text:'' , name:'', cardtype: ''})})}>Reset Filters</button>
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
  <div>
    G Deck Count: {gDeckCount} /16
  </div>
  </div>
   </div>
   </div>
    <div  id='container'>
 
<div id="viewCard" className='cardView'>
 
  
  
   <div className='cardImg'><CustomImage id='builderCardImg' className='cardImg' src = { viewCard.img} /></div>
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

onContextMenu={((e)=>{e.preventDefault();addCardRideDeck(card)})} >
  
  
  <CustomImage src = {card.img} alt={card.name} loading={'eager' || 'lazy' }  />

   </div>} ) 
  
  }
{/* } */}
</div>
<div id="deck">

{  props.format === 'Standard' ?   <div className='rideDeck'> 
          Ride Deck
          <div className={'cards'} >  
{ rideDeck.map((k, index)=>{
return <div   key = {index} className ={'rideDeckCard'} 
onMouseEnter= {((e)=>{setViewCard(k) })} onContextMenu={((e)=>{e.preventDefault(); 
  removeCardRideDeck(index)})} > 
  <CustomImage  className ={'deckCard'} src = { k.img}/></div>
})}
</div>

        </div>  : <div className={'cards deckCard'} >
          FV
          <div onMouseEnter= {((e)=>{setViewCard(firstVanguard.current) })} onContextMenu={((e)=>{e.preventDefault(); 
  removeCardRideDeck(0)})}  >{firstVanguard.current !== undefined ? <CustomImage   src= {firstVanguard.current.img} /> : <></>}</div>
          </div>}
      <div id= {'mainDeck'}> Main Deck

      <h4>Normal Units</h4>
<div id={'normalunits'} className='deckSection' >  
<div className={'cards'} >  
{normalUnits.map((k, index)=>{
return <div key = {index} className ={'deckCard'}  
onMouseEnter= {((e)=>{ setViewCard(k)})} onClick={((e)=>{e.preventDefault(); let card = normalUnits[index] ; addCardMaindeck(card) })}
onContextMenu={((e)=>{e.preventDefault();removeMainDeck( 'normalUnits', index )})}> 
<CustomImage  className ={'deckCard'} src = {  k.img}/></div>
})} 
</div>   
</div>
<h4>Trigger Units</h4>
<div id={'triggerunits'} className='deckSection' >   
<div className='cards'> 
{triggers.map((k, index)=>{ return <div key = {index} className ={'deckCard'} 
onMouseEnter= {((e)=>{ setViewCard(k)})} onClick={((e)=>{e.preventDefault(); let card = triggers[index] ; addCardMaindeck(card)})} 
onContextMenu={((e)=>{e.preventDefault();removeMainDeck( 'triggers', index )})}> 
  <CustomImage  className ={'deckCard'} src = {k.img}/></div>
})} 
</div> 
</div>  
<h4>Orders</h4>
<div id={'orders'} className='deckSection' >    
<div className='cards'> 
{orders.map((k, index)=>{ return <div key = {index} className ={'deckCard'}  
onMouseEnter= {((e)=>{ setViewCard(k)})} onClick={((e)=>{e.preventDefault();let card = orders[index] ; addCardMaindeck(card) })}
onContextMenu={((e)=>{e.preventDefault();removeMainDeck( 'orders', index )})}> 
<CustomImage className ={'deckCard'} src = { k.img}/></div>
})} 
</div>  
</div>
 
      </div>
      <div className='gDeck'> 
          G Deck
          <div className={'cards'} >  
{ gDeck.map((k, index)=>{
return <div   key = {index} className ={'gDeckCard'} onClick={((e)=>{e.preventDefault(); let card = gDeck[index] ; addCardGDeck(card)})}
onMouseEnter= {((e)=>{setViewCard(k) })} onContextMenu={((e)=>{e.preventDefault(); 
  removeGDeck(index)})} > 
  <CustomImage   className ={'deckCard'} src = { k.img}/></div>
})}
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
  sleeveType.current = 'RideDeck'
  setSleeve({...sleeve})
})} >Ride Deck Sleeves</button>
<button onClick={((e)=>{
  if(sleeveButton.current){
    sleeveButton.current.disabled = false
  }
  e.target.disabled = true
  sleeveButton.current = e.target
  sleeveType.current = 'MainDeck'
    setSleeve({...sleeve})
})} >Main Deck Sleeves</button>
<button onClick={((e)=>{
  if(sleeveButton.current){
    sleeveButton.current.disabled = false
  }
  e.target.disabled = true
  sleeveButton.current = e.target
  sleeveType.current = 'GDeck'
    setSleeve({...sleeve})
})} >G Deck Sleeves</button>

</div>
<div id='sleeveContainer' >
  {sleeves.map((sleev , index)=>{
              let selected = false ;

              if(sleeve[sleeveType.current]  === sleev.img){
                //highlight deck
                selected = true
              }
  
  
  return <div  key={index} className={`sleeve  ` +  (selected && 'selectedPlaymat') }   onClick={(()=>{
 
sleeve[sleeveType.current] = sleev.img
 
setSleeve({...sleeve})
})}  > 
<CustomImage src = { sleev.img}/>

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
<CustomImage src = {mat.img} />

</div>})}
</div>
</div>
 


    </div>
  )
  //do deck name check nezxt
}
