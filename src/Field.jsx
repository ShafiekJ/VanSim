import React, {useEffect, useState, useRef} from 'react'
import Game from './Game/Game'
import { RGCircle, VGCircle, GCircle } from './Circles'

import './Field.css'
import ZoneExpand from './Game/ZoneExpand'
import Popup from './Popup'
import Info from './Info'

import AbilityZone from './AbilityZone'
import Message from './Message'
//import tempAbilities from './tempAbilities.jsx'
let opponentChoice
//peerjs fuck off do using socketio
export default function Field({setCurrentPage, user, socket , activeDeck , opponentData, roomID}) {

const getSecondOrder  = useRef(()=>{return null})

function makeEnergyGenerator(){
  let generator =   {
    "name": "Energy Generator",
    "grade": 0,
    "text": "(You may only have one ride deck crest in a ride deck)\n[AUTO](Ride Deck):When you ride, put this card into the crest zone, and if you went second, Energy Charge (3).\n[CONT]:You may have up to ten energy.\n[AUTO]:At the beginning of your ride phase, Energy Charge (3).\n[ACT]1/Turn:COST [Energy Blast (7)], and draw a card.",
    "skill": "",
    "power": 0,
    "critical": 0,
    "shield": 0,
    "img": "/images/D-PR-851 2024.png",
    "nation": "",
    "clan": "",
    "race": "",
    "set": "D Promo Cards",
    "setNo": "D-PR-851 2024",
    "cardtype": "Ride Deck Crest",
    "flavor": "",
    "format": "Standard",
    "sleeve": "",
    "triggereffect": "",
    "phonetic": "Enerugījenerētā"

  }
  playerObjects.current['energy'] = 0
  playerObjects.current['maxEnergy'] = 0

 
generator['place'] = 'rideDeck'
generator['previousArea'] = 'rideDeck'
generator['state'] = ''
 


return generator
}


function abilityGiver(abilities , id){
let newAbilities = {}
let values = Object.values(abilities)
 
for(let i =0;i<values.length;i++){
  let name = 'ability' + (i + 1);
  newAbilities[name] = {...values[i]}
  newAbilities[name]['abilityId'] = id+name
  if(newAbilities[name].effect)
  newAbilities[name].effect['abilityId'] = id+name
}
return newAbilities
}
  function getDressMaterial(name){
    let materials = {
    'Vairina' : nameIsX('Trickstar'),
    'Vairina Valiente' : nameIsX('Trickstar'),
    'Vairina Arcs' : nameIsX('Trickstar'),
    'Vairina Erger' : nameIsX('Trickstar'),
    'Vairina Exspecta' : [{cardProperty:'isOverDress' ,propertyToFind :true , condition:'='}],
    }
return materials[name] || []
  }
function makeUnit(card , id){//actabilitiesnext 
  let newCard = {...card}

    if(abilities[newCard.name]){
 
      newCard['abilities'] =  abilityGiver(abilities[newCard.name] , id )
 
    }
    newCard['hasOverDress'] = false
    newCard['hasRevolDress'] = false
    if(newCard.abilities){
  if(newCard.text.includes('[overDress]-')){
    newCard['hasOverDress'] = true
    newCard['dressMaterial'] = getDressMaterial(newCard.name)
  }

  if(newCard.text.includes('[RevolDress]-')){
    newCard['hasRevolDress'] = true
  }
}

  newCard['state'] = ''
  newCard['place'] = 'deck' //do for rg cards and vg cards and gc cards

  newCard['previousArea'] = 'deck'
  newCard['fromRideDeck'] = false
  newCard['tempGrade'] = card.grade
  newCard['tempName'] = card.name
  newCard['tempPower'] = card.power
  newCard['circle'] = ''
  newCard['influence'] = {}
  newCard['cannotBeMovedTo'] = []
  newCard['cannotBePlacedOn'] = []
  newCard['canBeRidden'] = true
  newCard['tempCrit'] = card.critical
  newCard['tempShield'] = card.shield
  newCard['drive'] = 1
  newCard['tempDrive'] = 1
  newCard['targetNum'] = 1
  newCard['discardValue'] = 1
  newCard['retireValue'] = 1
  newCard['intoSoulValue'] = 1
  newCard['imprisoned'] = false
  newCard['opponentRetire'] = true
  newCard['canAttack'] = true
  newCard['canAttackFromBackrow'] = false
  newCard['cannotAttack'] = []
  newCard['canBeBoosted'] = true
  newCard['boosting'] = false
  newCard['intercepting'] = false
  newCard['isBoosted'] = false
  newCard['canBeHit'] = true
  newCard['canAttack'] = true
  newCard['canBeAttacked'] = true
  newCard['canDrive'] = true
  newCard['customAttack'] = false
  newCard['attackFunction'] = null
  newCard['stand'] = true
  newCard['standInStand'] = true
  newCard['faceup'] = true
  newCard['id'] = id
  newCard['player'] = opponentData.player
  newCard['continuousEffect'] = {}
  newCard['back'] = '/images//Sleeves/Catherine-Sleeves.png' // sleeve img
  newCard['canBoostCheck'] = true
  newCard['canInterceptCheck'] = true

  if( card.skill === " Boost"){
    newCard['canBoost'] = true



    newCard['hasBoost'] = true
  }
 
  else if(card.skill === " Intercept"){
    newCard['canIntercept'] = false
 
    newCard['hasIntercept'] = true
  }
  else  if(card.skill === " Twin Drive!!"){
    newCard['drive'] = 2
    newCard['tempDrive'] = 2
  }
  else  if(card.skill === " Triple Drive!!"){
    newCard['drive'] = 3
    newCard['tempDrive'] = 3
  }
  card['sentinel'] = false
  if(card.text.includes('Sentinel')){
    card['sentinel'] = true
  }
  newCard['triggerType'] = '!'
if(newCard.triggereffect){
  newCard['triggerType'] =  newCard.triggereffect.split(' ')[0]
  let splitted =  card.triggereffect.split(' ')
  newCard['triggerPower']=Number(splitted[3]) || Number(splitted[2])
  if(splitted[0] === 'Critical'){
    newCard['triggerCrit'] = 1
  }
  if(splitted[0] === 'Over'){
    newCard['additionalEffect'] = additionalEffects[newCard.name]
    newCard['additionalEffect'].effect['abilityId'] = id
  }
}
if(newCard.cardtype.includes('Order')){
  makeOrder(newCard , id)
}
  return newCard
  }

function makeOrder(card , id){
let newCard = card
newCard['tempGrade'] = card.grade
newCard['canBePlayed'] = false
newCard['id'] = id
if(orderEffects[newCard.name]){
  newCard['orderEffects'] = {...orderEffects[newCard.name]}
}
else{
  newCard['orderEffects'] = {...orderEffects["Truehearted Ruby"]}
}
if(newCard.orderEffects.text.includes('Deity Arms')){
  newCard.orderEffects['deityArms'] = {}
  let text =  newCard.orderEffects.text.split(' ')[0]
  newCard.orderEffects['deityArms']['position'] = text.toLowerCase()
  let vname = newCard.orderEffects.text.split('"')[1]
  newCard.orderEffects['deityArms']['vanguardName'] = vname
}
newCard.orderEffects.effect['orderId'] = id+newCard.name
if(abilities[newCard.name]){
  newCard['abilities'] = abilityGiver(abilities[newCard.name] )
}
newCard['state'] = ''
newCard['place'] = 'deck' //do for rg cards and vg cards and gc cards

newCard['previousArea'] = 'deck'
newCard['fromRideDeck'] = false
newCard['tempGrade'] = card.grade
newCard['tempName'] = card.name
newCard['tempPower'] = card.power
newCard['circle'] = ''
newCard['canAlchemagic'] = false
newCard['influence'] = {}
newCard['discardValue'] = 1
newCard['retireValue'] = 1
newCard['intoSoulValue'] = 1
newCard['imprisoned'] = false
newCard['stand'] = true
newCard['faceup'] = true
newCard['id'] = id
newCard['continuousEffect'] = {}
newCard['back'] = '/images//Sleeves/Catherine-Sleeves.png'
return newCard
}

 
 
//eventlisteners
const Listeners = useRef({
  callHand : null, 
  callCircle : null,
  battleCircle: null,
  actListener:null,
  zoneGuardListener: null
})   
const prevTurnLogs = useRef([ 
])
const turnLog = useRef([ //at end turn add to prevTurnLogs and reset
])
//

/* eg event = { have a property system to search these
action: 'retire',
player : 'You' / opponent,
doneBy: card, 
doneOn : opponentcard,


}*/

function addEvent(player = 'You' , action = '' , card= {name : '', id :-1, circle:'userFRRG'},opponentCard= {name : '', id :-2 , circle:'userFRRG'} , power = 0){
  let logs = {
    'draw' : `${player} drew ${opponentCard.name}`,//fix
    'called' : `${player} called ${opponentCard.name} from ${opponentCard.previousArea} to ${opponentCard.circle[4] + opponentCard.circle[5]}`,
    'retire' : `${player} retired ${opponentCard.name} by effect of ${card.name}`,
     'effectDraw' : `${player} drew ${opponentCard.name} by effect of ${card.name}`,
    'superiorCall' : `${player} called ${opponentCard.name} by effect of ${card.name}`,
    'normalCall' : `${player} called ${opponentCard.name} by effect of ${card.name}`,
    'increasePower' : `${player} increased the Power of ${opponentCard.name} by ${power} using the effect of ${card.name}`,
    'increaseCrit' : `${player} increased the Critical of ${opponentCard.name} by ${power} using the effect of ${card.name}`,
    'increaseShield' : `${player} increased the Shield of ${opponentCard.name} by ${power} using the effect of ${card.name}`,
    'increaseDrive' : `${player} increased the Drive of ${opponentCard.name} by ${power} using the effect of ${card.name}`,
    'finalRush' : `${player} activated Final Rush by effect of ${card.name}`,
    'soulCharge' : `${player} Soul Charged ${opponentCard.name} using the effect of ${card.name}`,
    'effectStand': `${player} stood ${opponentCard.name} using the effect of ${card.name}`,
  }
  turnState.current.event = action
  let text = logs[action]
return { 
  action: action,
  player :player,
  card: card, //affecting card
  opponentCard : opponentCard, //affected card
  text:text,
}
}
function yourCard(card){

  if(card.player === opponentData.player){
    return true
  }
  return false

}
function searchEvents(action = '', player = 'You'){// filter for action and return
  let searched = turnLog.current.filter(event => event.action === action && event.player === player)

  }
function logEffect(action , card){
  addToYourLog(action , card, turnState.current.card)
}
function addToYourLog( action = '', opponentCard= {name : '', id :-2, img:'', circle:'userFRRG'} , card= {name : '', id :-1, img:'', circle:'userFRRG'} , power = 0){ // eg retired {cardName} by effect of {eventcard}
// for draw, how to show draw to player only, dont send card data to opponent logs

let event = addEvent('You' ,action, card, opponentCard , power)
turnLog.current.push(event)

  socket.emit('fightUpdate', { roomId :roomID,  command:'updateLogs', item :{
    action : action, card:card , opponentCard:opponentCard , power:power
  }})
}

function addOpponentLog(action = '', opponentCard= {name : '', id :-2, img:'', circle:'userFRRG'} , card= {name : '', id :-1, img:'', circle:'userFRRG'} , power){ 

  let event = addEvent('Opponent' ,action, card, opponentCard , power)
  turnLog.current.push(event)
  setMainDeck([...MainDeck])
  }

const usedHPTs = useRef({

})

 
 const playerObjects = useRef({
  abilities:{abilities:{

  }},
  yourTurn : false ,
  phase : '',
  "personaRide" : false ,
  "ordersToPlay" : 1, //set to 1 at endofturn
  "ordersPlayedAmount": 0, //make an array of all orders played compare length with orderstoplau
  "sleeves": '/images/Catherine-Sleeves.png',
  "turn" : false,

  "turnState": '',
  'attacking':false,
  'damageToLose':6,
  'canAlchemagic' : false,
  'hasPrison':false,
  'unitsStoodThisTurn':{}, //have id : {name, circle}
  'rearguardsPutIntoSoul' : [], //i
  'rearguardsRetired' : [],
  opponentRearguardsRetired : false, 
  'rearguardsBound' : [],
  'rodeThisTurn' : false,
  'ordersPlayed' : {},
  'orderFilter' : [], //proprtyarray
  'damageThisTurn':[],
  'attacksThisTurn' : 0,
  'rearguardsPlacedThisTurn':[] ,
  finalRush : false, 
  blackWings : false,
  whiteWings: false,
  checkWhiteWings: true,
  checkBlackWings :true,
  world:'',
  lastestCardId: 0,
  energy:0,
 mainPhaseSwitch : mainPhaseSwitch ,
 rideFromRideDeck : rideFromRideDeck,
  //or units palced add ids amd work with that to prevent mutiple occuramces
//make a list of actions taken
})

const thisTurn = useRef({
  counterCharged: false,
  soulCharged:false,
  rode:false,
  alchemagicOrder : false ,
  retiredOpponentRearguard: false,
  overSoul:false,
  vangurdHit:false,
  vanguardAttacked:false,
  calledRearguardOtherHandThisTurn : false,
  yourRearguardWasRetiredThisTurn : false,
  soulBlast4OrMoreThisTurn : false,
  yourVanguardSung :false,
  vanguardsAttackHit : false
})

function yourVanguardSungThisTurn(){
  return thisTurn.current.yourVanguardSung
}
function alchemagicOrderThisTurn(){
  return thisTurn.current.alchemagicOrder
}

function soulChargedThisTurn(){
  return thisTurn.current.soulCharged
}

function counterChargedThisTurn(){
  return thisTurn.current.counterCharged
}
function calledRearguardOtherHandThisTurn(){
  return thisTurn.current.counterCharged
}
function retiredOpponentRearguardThisTurn(){
  return thisTurn.current.retiredOpponentRearguard
}
function yourRearguardWasRetiredThisTurn(){
  return thisTurn.current.yourRearguardWasRetiredThisTurn
}
function rodeThisTurn(){
  return thisTurn.current.rode
}
function vanguardOverSoulThisTurn(){
  return thisTurn.current.overSoul
}
function ifYourVanguardWasHitThisTurn(){
  return thisTurn.current.vangurdHit
}
function vanguardsAttackHitThisTurn(){
  return thisTurn.current.vanguardsAttackHit
}
function ifYourVanguardWasAttackedThisTurn(){
  return thisTurn.current.vanguardAttacked
}
//put ridefunctions and playorde rfunctions in playerfunctions as default and change them when ability does

const opponentObjects = useRef({
  hasPrison : false,
})

const currentBattle = useRef({
  "attackingUnit" : null, 
  "defendingUnits" : null,
  "boostingUnits" : [],
  "boostingIds":[],
  "attackingUnitType" : null,
  "defendingUnitType" : null, //object where {circle.id: card.unittype}
  "guardRestrict" : null,
  "restrictFunction" :  null ,
  "unitsHit" : [],
  'revealedUnits':[]
})

const endTurnFunctions = useRef({
 'user':{},
 'units':{}
})

const endBattleFunctions = useRef({
  'user':{},
  'units':{}
})

const playerFunctions = useRef({//siht like hendrina and hadhuntrer

 })

 const opponentWaiting = useRef(false)

//eg, push 'Alchemagic' : {'Hendrina': set plyer cb cost 0} do a useeffect for this

//states
 
  const tempDeck = useRef({...activeDeck})
  let newDeck = tempDeck.current
  const basicPropertyArray = [{"cardProperty" :  'grade' , "propertyToFind": -2 , "condition": '>'}]
  const [loading , setLoading] = useState(true)
  const [MainDeck , setMainDeck] = useState(newDeck.MainDeck)
  const [viewCard , setViewCard] = useState(newDeck.FaceCard)    

  const [opponentHand , setOpponentHand] = useState(5)
  const [opponentDeck , setOpponentDeck] = useState(40)
  const [popupWord , setPopupWord] = useState('')
  const [popup, setPopup] = useState(false)
  const  subPhase = useRef('') 
  const  turnState = useRef({
    state: '', card:{} , ability:{} , subState : '', called:[],inAbility:false ,event:''
  })//driveCheck, damagecheck whatnot
  const  opponentTurnState = useRef({
    state: '', card:{} , ability:{} , subState : '', called:[],inAbility:false ,event:''
  })
function turnStateCardId(){//make card state currentcard
 
    return  currentCard.id
  }
  function resetTurnState(){
    turnState.current = {
      state: '', card:{} , ability:{} , subState : '' , called:[], inAbility:false ,event:''
    }
  }
  function payingCost(){
if(turnState.current.state === 'payingCost'){
  return true
}
return false
  }
  function doingEffect(){
    if(turnState.current.state === 'doingEffect'){
      return true
    }
    return false
  }
  const  currentEvent  = useRef('')//when 
  const userUnitPower  = useRef(0)
  const  opponentUnitPower  = useRef(0)

  function setUserUnitPower(power){
    userUnitPower.current = power
  }
  function setOpponentUnitPower(power){
    opponentUnitPower.current = power
  }
  function unitPower(userPower , opponentPower){
    setUserUnitPower(userPower)
    setOpponentUnitPower(opponentPower)
  }
  const [currentAbility , setCurrentAbility] = useState({
  
      "condition": 
  function(card) { if (card.state === 'rodeUpon') {  return true;} return false;}, 
      "cost": null,
      "effect": function ( ){
 draw( ); 
    },
      "text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
      "1/Turn": false, 
      "type": "AUTO", 
      "category": "rodeUpon",
      "permanent": true ,
      "costPaid" : false
      
    
  })
const [currentCard, setCurrentCard] = useState({...newDeck.FirstVanguard})
 
 const continuous = useRef({
 
}) 
const conditionalContinuous = useRef({//for abilities that are constantly checed, how many worlds etc

})
const continuousValues = useRef({

})
  const [actAbility , setActAbility] = useState(null)

  const eventCard = useRef({called:[], retired:[], bound:[], bounced:[], souled:[],})
  function resetEventCard(){
    eventCard.current =  {called:[], retired:[], bound:[], bounced:[], souled:[],} 
  }

async function searchEventCard(unit, event  , propertyArray = basicPropertyArray ){
  if(event !== turnState.current.event){
 
    return}
let obj = eventCard.current[event]
let foundUnits = await searchZones(obj, propertyArray) 
 
if(foundUnits.length === 0){
  return false
}
//unit['eventCard'] = foundUnits.forEach((card)=>card.id !== unit.id) //causes infinite loop

return true
}

  
  const  costPaid  = useRef(false)

  const oppDeck = useRef({RideDeck:[]})

const [showLog, setShowLog] = useState(false)
const [message , setMessage] = useState('')
const [showMessage , setShowMessage] = useState(false)
const [zoneName, setZoneName] = useState('')
const [zone , setZone] = useState([]) // zone to show
const [showZone , setShowZone] = useState(false) // saying to show the selected zone
const [abilityZone , setAbilityZone] = useState([]) // zone to show
const [showAbilityZone , setShowAbilityZone] = useState(false) // saying to show the selected zone
const [showInfo , setShowInfo] = useState(false)
const [phase , setPhase] = useState('')
const [subphase, setSubphase] = useState('')
const [playerTurn , setPlayerTurn] = useState()
const [confirm , setConfirm] = useState(false)

const [index,setIndex] = useState()

// const ridePhase = ['ride' , 'stride']
//const battlePhase = ['attack' , 'guard' , 'trigger' ,'damage']
const [pause , setPause] = useState(false)
const abilitiesList  = useRef([])
const opponentAbilitiesList = useRef([])
/* user zones*/
// const [hand, setHand] = useState([])
// main deck 
// zones circles
const turnCount = useRef(0)


const [userCircles , setUserCircles] = useState({
  [`user` + "VG"]   :  new VGCircle(null, 0), 
  [`user` + "FLRG"] :  new RGCircle('FL' , null, 0, 0) ,
  [`user` + "BLRG"] :  new RGCircle('BL' , null, 0, 0,),
  [`user` + "BCRG"] :  new RGCircle('BC' , null, 0, 0),
  [`user` + "BRRG"] :  new RGCircle('BR' , null, 0, 0),
  [`user` + "FRRG"] :  new RGCircle('FR' , null, 0, 0),
  [`user` + "GC"] :  new GCircle([])
 })

const [userZones , setUserZones] = useState({
 drop : [] ,
 bind : [] ,
 trigger : [],
 damage : [],
 orderZone : [],
 orderArea : [],
 removed : [],
 gDeck : [],
 soul : [],
 hand:[],
 crest: []

})

const currentOpponentZones  = useRef({
  drop : [] ,
  bind : [] ,
  trigger : [],
  damage : [],
  orderZone : [],
  orderArea : [],
  removed : [],
  gDeck : [],
  soul : [],
  hand:[], 
 crest: []
 })
let opponentZones = currentOpponentZones.current
 const  currentOpponentCircles = useRef({
  [`opponent` + "VG"]   :  new VGCircle(null, 0), 
  [`opponent` + "FLRG"] :  new RGCircle('FL' , null, 0, 0) ,
  [`opponent` + "BLRG"] :  new RGCircle('BL' , null, 0, 0,),
  [`opponent` + "BCRG"] :  new RGCircle('BC' , null, 0, 0),
  [`opponent` + "BRRG"] :  new RGCircle('BR' , null, 0, 0),
  [`opponent` + "FRRG"] :  new RGCircle('FR' , null, 0, 0),
  [`opponent` + "GC"] :  new GCircle([])
 })
let opponentCircles = currentOpponentCircles.current
 
const playerResources = useRef({
  'energy':()=>{
    let energy = playerObjects.current.energy
 
    let zone = Array(energy).fill(({name:'energy', grade: -1})) 
    return zone
  }, 
  'hand' : () =>userZones.hand , 
  'counterBlast' :  () =>userZones.damage.filter((card)=>{return card.faceup === true}) ,  
  'soul' :  () =>userZones.soul ,
  'soulDifferentGrade': ()=>{
    let count = []
    let foundGrades = {

    }
    for(let i = 0; i<userZones.soul.length; i++){
      let unit = userZones.soul[i]
      if(!foundGrades[unit.tempGrade]){
        foundGrades[unit.tempGrade] = unit.tempGrade
        count.push(unit)
      }
    }
 
    return count

  }, 
  'drop' : () =>userZones.drop ,
  'rideDeck': ()=>newDeck.RideDeck,
  'orderZone' : () =>userZones.orderZone ,
  'rg' : async ()=>{
    let search = await searchCircles( //make thisunit only return an array of circle units
rearguard()
    )
   
    let zone = []
    search.forEach((card)=>{zone.push(userCircles[card].unit)})

   return zone
  },
  'units' : async ()=>{
    let search = await searchCircles()
   
    let zone = []
    search.forEach((card)=>{zone.push(userCircles[card].unit)})

   return zone
  },
  'thisUnit' : async (card)=>{
    let search = await searchCircles( //make thisunit only return an array of circle units
    [  {
      "cardProperty": "id",
      "propertyToFind": card.id,
      "condition": "="
    }
]
  )
 
  let zone = []
  search.forEach((card)=>{zone.push(userCircles[card].unit)})
  
 return zone
},
'inSoul': async (card)=>{

  let search = await searchZones(userZones.soul, searchId(card.id))
 
  let zone = []
  search.forEach((card)=>{zone.push(userCircles[card].unit)})
  
 return zone
},
'inDrop': async (card)=>{
  
  let search = await searchZones(userZones.drop, searchId(card.id))
  let zone = []
  search.forEach((card)=>{zone.push(userCircles[card].unit)})
  
 return zone
},
'inBind': async ()=>{
  let card = turnState.current.card
  let search = await searchZones(userZones.bind, searchId(card.id))
  let zone = []
  search.forEach((card)=>{zone.push(userCircles[card].unit)})
  
 return zone
},
'otherUnits' : async (card)=>{let search = await searchCircles( //make thisunit only return an array of circle units
  [  {
    "cardProperty": "id",
    "propertyToFind":  card.id,
    "condition": "!="
  }
]
)
let zone = []
search.forEach((card)=>{zone.push(userCircles[card].unit)})

return zone
},
'otherRearguards' : async (card)=>{

  let search = await searchCircles( //make thisunit only return an array of circle units
  [  {
    "cardProperty": "id",
    "propertyToFind": card.id,
    "condition": "!="
  },
  {
    "cardProperty": "place",
    "propertyToFind": 'RC',
    "condition": "="
  }
]
)
 let zone = []
 search.forEach((card)=>{zone.push(userCircles[card].unit)})

return zone
},
 'otherCards' : async (card , zone)=>{
 
  let search = await searchZones(userZones[zone] , 
  [  {
    "cardProperty": "id",
    "propertyToFind": card.id,
    "condition": "!="
  },
]
)

 
return search
},
}) 


const playerAbilities = useRef({})

const  searchOperators = {
  '=' :  function(cardProperty, propertyToFind) { return cardProperty === propertyToFind} , 
  '!=' :  function(cardProperty, propertyToFind) { return cardProperty !== propertyToFind} , 
  '>=' :  function(cardProperty, propertyToFind) { return cardProperty >= propertyToFind} , 
  '<=' :  function(cardProperty, propertyToFind) { return cardProperty <= propertyToFind} ,
  '>' :  function(cardProperty, propertyToFind) { return cardProperty > propertyToFind} , 
  '<' :  function(cardProperty, propertyToFind) { return cardProperty < propertyToFind} ,
  'includes' :  function(cardProperty, propertyToFind) { return cardProperty.includes(propertyToFind)} , 
  '!includes' :  function(cardProperty, propertyToFind) { return !(cardProperty.includes(propertyToFind))} , 
 'or':  function(cardProperty, propertyToFind) { return propertyToFind.includes(cardProperty)} , //make propertytofind a combination of the properties ie  , a or b = 'a b'
}


const abilities =  {  
  "Earnescorrect Leader, Clarissa": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedByRiding(unit, "Accurate Interval, Clarissa")){return true} return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "toHand": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "name",
          "propertyToFind": "Aim to be the Strongest Idol!",
          "condition": "="
        }
      ]
    },
    "effect": async function (unit){await toHand(newDeck.MainDeck , this.toHand.amount, this.toHand.filter , ) }
  },
  "text": "[AUTO]:When this unit is placed on (VC) by riding from \"Accurate Interval, Clarissa\", COST [Counter Blast (1)], search your deck for up to one \"Aim to be the Strongest Idol!\", reveal it and put it into your hand, and shuffle your deck.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": async function (unit){ if(whenThisUnitsAttackHits(unit) && onVC(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "increasePower": {
      "amount": 1,
      "power" : 5000,
      "filter": [
        {
          "cardProperty": "place",
          "propertyToFind": "RC",
          "condition": "=",
          
        },
        {
          "cardProperty": "name",
          "propertyToFind": "Earnescorrect",
          "condition": "includes",
          
        }
      ]
    },
    "effect": async function (unit){draw(this.draw.amount); await chooseUnits(1, this.increasePower.filter, (unit)=>{increasePowerEndTurn(unit, 5000)})}
  },
  "text": "[AUTO](VC):When this unit's attack hits, draw a card, choose one of your rear-guards with \"Earnescorrect\" in its card name, and it gets [Power]+5000 until end of turn.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Archangel of Twin Wings, Alestiel": {
"ability1": {
  "condition": async function (unit){ if(beginningOfMain() && onVC(unit)){return true} return false},
  "cost": null,
  "effect": {
    "toHand": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      let len = userZones.bind.length
      await toHand(userZones.bind , this.toHand.amount)
      if(len !== userZones.bind.length){
        bindTop(1)
      }
    }
  },
  "text": "[AUTO](VC):At the beginning of your main phase, choose a card from your bind zone, put it into your hand, and if you put a card, bind the top card of your deck face up.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": async function (unit){ if(duringYourTurn() && whiteWings() && onVC(unit)){return true} return false},
  "on": async function (unit){ increasePower(unit, 5000);increaseCrit(unit, 1)},
  "off": async function (unit){  increasePower(unit, -5000);increaseCrit(unit, -1)},
  "isOn": false,
  "text": "White Wings-[CONT](VC):During your turn, this unit gets [Power]+5000/[Critical]+1.",
  "type": "CONT",
  "permanent": true,
  "cost": null
},
"ability3": {
  "condition": async function (unit){ if(duringYourTurn() && blackWings() && onVC(unit)){return true} return false},
  "on": async function (unit){
    decreaseOpponentUnitsPower(unit, -5000, basicPropertyArray)

   },
  "off": async function (unit){

    removeAllOfYourOpponentsUnits(unit.id)
   },
  "isOn": false,
  "text": "Black Wings-[CONT](VC):During your turn, all your opponent's units get [Power]-5000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Heartfelt Song, Loronerol": {
"ability1": {
  "condition": async function (unit){ return true},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount) }
  },
  "effect": {
    "singOrder": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "cardtype",
          "propertyToFind": "Song",
          "condition": "includes"
        }
      ]
    },
    "effect": async function (unit){ await singOrder(this.singOrder.amount )}
  },
  "text": "[ACT](VC)1/Turn:COST [Counter Blast (1)], choose a face up Song from your order zone, and sing it. (Activate the Song's ability of the Song, and turn it face down after that ability resolves)",
  "1/Turn": true,
  "Used1/Turn": false,
  "H1/Turn": false,
  "type": "ACT",
  "permanent": true,
  "costPaid": false
},
"ability2": {
  "condition": async function (unit){ if(whenThisUnitAttacksOnVC(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      let faceDowns = await searchZones(userZones.orderZone , facedown())
      if(faceDowns.length >=2){
        await singOrder(1)
        await guardRestrictEndBattle(unit, 'noSentinel')
      }
    }
  },
  "text": "[AUTO](VC):When this unit attacks, if you have two or more face down cards in your order zone, choose a face up Song from your order zone, sing it, and until end of that battle, your opponent cannot call sentinels from hand to (GC).",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Prismagica, Wilista": {
"ability1": {
  "condition": async function (unit){ if(onVC(unit)){return true} return false},
  "cost": {
    "soul": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "name",
          "propertyToFind": "Truehearted Ruby",
          "condition": "="
        }
      ]
    },
    "costEffect": async function (unit){ await soulBlast(this.soul.amount , this.soul.filter)}
  },
  "effect": {
    "increasePower": {
      "amount": 15000,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){ increasePowerEndTurn(unit , this.increasePower.amount);  
 
      yourOpponentCannotInterceptUntilEndTurn(this.abilityId, unit )
    }
  },
  "text": "[ACT](VC):COST [Soul Blast (1) \"Truehearted Ruby\"], until end of turn, this unit gets [Power]+15000, and your opponent cannot intercept.",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "type": "ACT",
  "permanent": true,
  "costPaid": false
},
"ability2": {
  "condition": async function (unit){if(onVC(unit)){return true} return false},
  "cost": {
    "soul": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "name",
          "propertyToFind": "Everlasting Sapphire",
          "condition": "="
        }
      ]
    },
    "costEffect": async function (unit){ await soulBlast(this.soul.amount , this.soul.filter)}
  },
  "effect": {
    "callFromTopX": {
      "lookAmount": 5,
      "callAmount": 2,
      "func" : function (unit){increasePowerEndTurn(unit , 5000)},
      "filter": units()
    },
    "effect": async function (unit){
      let theRest = await callFromTopX(this.callFromTopX.lookAmount, this.callFromTopX.callAmount , this.callFromTopX.filter,undefined  ,false, (card)=>{increasePowerEndTurn(card , 5000)},)
      await putDrop(theRest)
    }
 
    },
  "text": "[ACT](VC):COST [Soul Blast (1) \"Everlasting Sapphire\"], look at five cards from the top of your deck, choose up to two unit cards from among them, call them to open (RC), discard the rest, and those units get [Power]+5000 until end of turn.",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "type": "ACT",
  "permanent": true,
  "costPaid": false
}
},
"Incessant Vocal, Elkel": {
"ability1": {
  "condition": async function (unit){ if(whenYourVanguardIsPlaced(unit) && onRC(unit)){return true} return false},
  "cost": {
    "hand": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){bindThisUnit(unit)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount)}
  },
  "text": "[AUTO](RC):When your vanguard is placed, COST [bind this unit], and draw a card.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": async function (unit){ if(whenThisCardIsBound(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      playerObjects.current.whiteWings = true
      playerObjects.current.blackWings = true
      playerObjects.current.checkWhiteWings = false
      playerObjects.current.checkBlackWings = false
      untilEndTurn(()=>{
        playerObjects.current.whiteWings = false
        playerObjects.current.blackWings = false
        playerObjects.current.checkWhiteWings = true
        playerObjects.current.checkBlackWings = true
       } , unit)
    } 
  },
  "text": "[AUTO]:When this card is bound, both White Wings and Black Wings of your cards are active until end of your opponent's next turn.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Attentive Deep Love, Ottilie": {
"ability1": {
  "condition": async function (unit){ if( whenYouPlay(
  [{
      "cardProperty": "name",
      "propertyToFind": "Truehearted Ruby",
      "condition": "="
    }]
  )&& ifYourVanguardIs( 'Prismagica, Wilista')){return true} return false},
  "cost": null,
  "effect": {
    "increasePower": {
      "amount": 10000,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){increasePowerEndTurn(this.increasePower.amount) ; increaseOrderAmount()}
  },
  "text": "[AUTO](RC):When you play \"Truehearted Ruby\", if your vanguard is \"Prismagica, Wilista\", this unit gets [Power] +10000 until end of turn, and you may play an additional order this turn. (Increase the number of plays when activated)",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Capriccio of Circulating Star, Ingrid": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedOnRCOtherThanFrom(unit , 'hand')){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){await counterCharge(1); 
      let other = await getOtherUnitInColumn(unit)
      stand(other)
    }
  },
  "text": "[AUTO]:When this unit is placed on (RC) other than from hand, Counter Charge (1), choose one of your other rear-guards in the same column, and [Stand] it.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": async function (unit){ if(whenThisUnitAttacks(unit) && onRC(unit)){return true} return false},
  "cost": null,
  "effect": {
    "increasePower": {
      "amount": 5000,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){increasePowerEndBattle(unit, this.increasePower.amount) ;
       lingeringRemoveEndBattle(()=>(botDeckRG(unit)) , unit)}//botdeck
  },
  "text": "[AUTO](RC):When this unit attacks, this unit gets [Power]+5000 until end of that battle. At the end of that battle, put this unit on the bottom of your deck. (It must be put on the bottom of your deck)",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Rondo of Eventide Moon, Feltyrosa": {
"ability1": {
  "condition": async function (unit){ if(onVC(unit) && whenYourDriveCheckReveals([
    {
      "cardProperty": "cardtype",
      "propertyToFind": "Normal Unit",
      "condition": "="
    },
    {
      "cardProperty": "race",
      "propertyToFind": "Ghost",
      "condition": "="
    }
  ])

)

{

  return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){ 
      await callFromTrigger(1 , undefined, 'userFrontRow' , true , );

    if(userZones.trigger.length === 0){
      await resolveAbility( // make a function for this
        {
          "condition": 
      function(card) {true}, 
      "cost": {
        counterBlast: {
          "amount": 1,
          "filter": [

          ]
        },
        "costEffect": async function (unit){await counterBlast(this.counterBlast.amount)}
      },
          "effect": async function (unit){; 
            increaseDriveEndBattle(unit , 1)
        },
          "text": "COST [Counter Blast (1)], this unit gets drive +1 until end of that battle.",
          "1/Turn": false, 
          "type": "AUTO", 
          "category": "rodeUpon",
          "permanent": true ,
          "costPaid" : false
          
        
      }
      )
    }
    }
  },
  "text": "[AUTO](VC):When your drive check reveals a <Ghost> normal unit, you may call that unit to an open front row (RC). Then, if you called, COST [Counter Blast (1)], this unit gets drive +1 until end of that battle. (During this battle, increase the drive of this unit by one. Even if this is the last drive check of the battle, you will still perform an additional drive check)",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Honest Council President, Eknoa": {
"ability1": {
  "condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit) && yourVanguardSungThisTurn()){return true} return false},
  "cost": {
    "hand": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){draw(this.hand.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      increasePowerEndTurn(unit, 5000)
      await resolveNewAbility(unit, {
        "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
        "hand": {
          "amount": 1,
          "filter": basicPropertyArray
        },
        "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await discard(this.hand.amount)}
      } , ()=>{draw(2)})
    }
  },
  "text": "[AUTO](RC)1/Turn:When this unit attacks, if your vanguard sung a Song this turn, this unit gets [Power]+5000 until end of turn, then COST [Counter Blast (1) & discard a card from your hand], and draw two cards.",
  "type": "AUTO",
  "1/Turn": true,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Earnescorrect Member, Evelyn": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedOnRCFrom(unit , 'hand') &&ifYourVanguardIs('Earnescorrect Leader, Clarissa') ){return true} return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "search": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "name",
          "propertyToFind": "Earnescorrect",
          "condition": "includes"
        },
        {
          "cardProperty": "grade",
          "propertyToFind": 3,
          "condition": "<"
        }
      ]
    },
    "effect": async function (unit){
      let card = await clickAbilityZone(newDeck.MainDeck, 1, this.search.filter)

      let selectedCard = card.selected[0]

      let search = await searchCircles([ {
        "cardProperty": "name",
        "propertyToFind": selectedCard.name,
        "condition": "="
      }
    ])

    if(search.length > 0){
      addToZone(newDeck.MainDeck, userZones.hand ,[selectedCard])
    }
    else{
      await callFromAbilityZone([selectedCard], 1,[selectedCard], undefined ,true)
    }
    }
  },
  "text": "[AUTO]:When this unit is placed on (RC) from hand, if your vanguard is \"Earnescorrect Leader, Clarissa\", COST [Counter Blast (1)], search your deck for up to one grade 2 or less card with \"Earnescorrect\" in its card name and reveal it, and if you have no rear-guards with the same card name as that card, call it to an open (RC). Shuffle your deck.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Dedicated Serenade, Eleonore": {
"ability1": {
  "condition": async function (unit){ if(whenThisUnitAttacks(unit) && onRC(unit)){return true} return false},
  "cost": {
    "soul": {
      "amount": 2,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "increasePower": {
      "amount": 15000,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){increasePowerEndBattle(unit , this.increasePower.amount) ; lingeringRemoveEndBattle(()=>(topDeckRG(unit)) , unit)}//topdeck
  },
  "text": "[AUTO](RC):When this unit attacks, COST [Soul Blast (2)], and this unit gets [Power]+15000 until end of that battle. At the end of that battle, put this unit on the top of your deck.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Opposing Kindness, Virginia": {
"ability1": {
  "condition": async function (unit){ if(endOfBattleThisUnitAttackedWhileBoosted(unit) && playedOrderThisTurn()){return true} return false},
  "cost": {
    "thisUnit": {
      "amount": 1,
      "filter": basicPropertyArray
    },
     "costEffect": async function (unit){await soulThisUnit(unit)}

  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){await counterCharge(1)} 
  },
  "text": "[AUTO](RC):At the end of the battle this unit attacked while boosted, if you played an order this turn, COST [put this unit into your soul], and Counter Charge (1).",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Brilliance and Elegance, Aerith": {
"ability1": {
  "condition": async function (unit){ if(whenThisUnitAttacksWhileBoosted(unit) && ifYourVanguardIs('Astesice, Kairi')){return true} return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "call": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){await callFromHand( this.call.amount, undefined , true)}
  },
  "text": "[AUTO](RC):When this unit attacks while boosted, if your vanguard is \"Astesice, Kairi\", COST [Counter Blast (1)], choose up to one card from your hand, and call it to an open (RC).",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Unrelenting Talent, Henrietta": {
"ability1": {
  "condition": async function (unit){ if(whenThisUnitIsBoosted(unit)){return true} return false},
  "cost": {
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      let boosted = currentBattle.current.boostingUnits
      for (let i =0;i<boosted.length;i++){
        increasePowerEndBattle(unit , boosted[i].tempShield)
      }
    }
  },
  "text": "[AUTO](RC):When this unit is boosted, COST [Soul Blast (1)], and increase the [Power] of this unit by the original [Shield] of the unit that is boosting this unit until end of that battle.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Fleeting Longing, Baruel": {
"ability1": {
  "condition": async function (unit){ if(blackWings() && whenPlacedOnRC(unit) ){return true} return false},
  "cost": {
    "soul": {
      "amount": 3,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount)}// come back
  },
  "text": "Black Wings (Active when bind only has even grades)-[AUTO]:When this unit is placed on (RC), COST [Soul Blast (3)], choose one of your opponent's units for every two of your rear-guards with even grades, and they get [Power]-5000 until end of turn. Then, your opponent puts all of their [Power] 0 or less rear-guards on the bottom of their deck in any order. (Same unit cannot be chosen twice)",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Earnescorrect Supporter, Leona": {
"ability1": {
  "condition": async function (unit){  if(onRC(unit) && !duringYourTurn()&& turnState.current.event === 'retired'){
    let retired = eventCard.current.retired.filter((card)=>{return card.id !== unit.id && card.name.includes('Earnescorrect')})
  if(retired.length > 0)
    return true
  } return false}, 
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      if(unit.place!== 'RC'){return}
      await resolveNewAbility(unit,{
    "hand": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount);await discard(this.hand.amount)}
  },  async ()=>{      
    let rCards = await clickAbilityZone(eventCard.current.retired, 1)
    await addToZone(userZones.drop, userZones.hand, rCards.selected)})

    }//log
  },
  "text": "[AUTO](RC):When your other rear-guard with \"Earnescorrect\" in its card name is retired during your opponent's turn, if this unit is on (RC), COST [Soul Blast (1) & discard a card from your hand], and put that retired card into your hand.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Join Grasp, Ernesta": {
"ability1": {
  "condition": async function (unit){ if(onBackRowRC(unit) && await whenYourOtherRearguardIsPlaced(unit) && duringBattlePhase()){ return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){standThisUnit(unit)}
  },
  "text": "[AUTO](Back Row RC):When your other <Ghost> is placed on (RC) during your battle phase, [Stand] this unit.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Tranquil Affection, Elivira": {
"ability1": {
  "condition": async function (unit){ if(onRC(unit) && whenYouPlay([
    {
      "cardProperty": "name",
      "propertyToFind": "Everlasting Sapphire",
      "condition": "="
    }
  ]) && ifYourVanguardIs('Prismagica, Wilista')){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount)}
  },
  "text": "[AUTO](RC):When you play \"Everlasting Sapphire\", if your vanguard is \"Prismagica, Wilista\", draw a card.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Wings with Rainbow Glow, Erimuel": {
"ability1": {
  "condition": async function (unit){ if(whiteWings() &&
    whenPlacedOnRC(unit) && ifYourOpponentsVanguardIsGrade3orGreater() ){return true} return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      let count = 0 
      let keys = Object.keys(userCircles)
      keys.forEach((key)=>{
        let temp = userCircles[key].unit
        if(temp){
        if(temp.tempGrade %2 === 1){
          count++;
        }
    
      }})
      count = Math.floor(count /3)
await chooseUnits(count, rearguard(), (card)=>{increasePowerEndTurn(card, 5000); increaseCritEndTurn(card, 1)})
      //searchcircles for oddGrade -> divide lengthby3 add that many listeners
    }// come back
  },
  "text": "White Wings (Active when bind only has odd grades)-[AUTO]:When this unit is placed on (RC), if your opponent's vanguard is grade 3 or greater, COST [Counter Blast (1)], choose one of your rear-guards for every three of your units with odd grades, and it gets [Power]+5000/[Critical]+1 until end of turn. (You cannot choose the same unit twice)",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Fighting Spirit Recharge!, Louisa": {
"ability1": {
  "condition": async function (unit){ if(whenThisUnitBoosts(unit) && yourVanguardSungThisTurn()){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){increasePowerEndBattle(unit, 5000)

      if(unit.circle === 'BCRG'){
        await counterCharge(1)
      }
    }//log
  },
  "text": "[AUTO](RC):When this unit boosts, if your vanguard sung a Song this turn, this unit gets [Power]+5000 until end of that battle, and if this unit is in the back row center, Counter Charge (1).",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},

"Six-Flower Fractale": {
"ability2": {
  "condition": async function (unit){ if(whenThisCardIsPutIntoOrderZone(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
 
      await youMay( 1 , async ()=>{await turnOrderZoneFaceUp( 1 , facedown()) })
 
    }
  },
  "text": "[AUTO]:When this card is put into the Order Zone, choose a face down card from your Order Zone, and you may turn it face up.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability3": {
  "condition": async function (unit){ if(whenSung(unit)){return true} return false},
  "cost": null,
  "effect": {

    "effect": async function (unit){
      let facedowns = await searchZones(userZones.orderZone, this.facedown.filter )
      let facedownNum = facedowns.length

      let amountStood = 0
      await chooseUnits(facedownNum , rearguard() , (unit)=>{standThisUnit(unit); amountStood++})

      increasePowerEndTurn(unit , (amountStood * 10000))
    }
  },
  "text": "[AUTO](Order Zone):When this Song is sung, choose the same number of your rear-guards as the number of face down cards in your Order Zone, and [Stand] them. Choose one of your vanguards, and it gets [Power]+10000 until end of turn for each unit that was [Stand] by this effect.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Lovable Dress, Lija": {
"ability1": {
  "condition": async function (unit){ if(endOfBattleThisUnitAttacked(unit)){return true} return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount); botDeckUnit(unit)  }
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "increasePower": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "name",
          "propertyToFind": "Earnescorrect",
          "condition": "includes"
        }
      ]
    },
    "effect": async function (unit){draw(this.draw.amount); 
      await chooseUnits(this.increasePower.amount, this.increasePower.filter , (unit)=>{increasePowerEndTurn(unit, 5000)})}
  },
  "text": "[AUTO](RC):At the end of the battle this unit attacked, COST [Counter Blast (1) & put this unit on the bottom of your deck], draw a card, choose one of your units with \"Earnescorrect\" in its card name, and it gets [Power]+5000 until end of turn.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Selfie Practice, Anneliese": {
"ability1": {
  "condition": async function (unit){ if(endOfBattleThisUnitAttackedWhileBoosted(unit)){return true} return false},
  "cost": {
    "costEffect": async function (unit){soulThisUnit(unit)}
  },
  "effect": {
    "increasePower": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "place",
          "propertyToFind": "RC",
          "condition": "="
        }
      ]
    },
    "effect": async function (unit){
      chooseUnits(this.increasePower.amount , this.increasePower.filter , (unit)=>{increasePowerEndTurn(unit, 5000)} )}
  },
  "text": "[AUTO](RC):At the end of the battle this unit attacked while boosted, COST [put this unit into your soul], choose one of your rear-guards, and it gets [Power]+5000 until end of turn.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Wish Fulfilled by a Pair, Milia": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "call": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "name",
          "propertyToFind": "Dreaming Eyes, Emmeline",
          "condition": "="
        }
      ]
    },
    "effect": async function (unit){await callFromDeck(this.call.amount ,undefined ,true)}
  },
  "text": "[AUTO]:When this unit is placed on (RC), COST [Counter Blast (1)], search your deck for up to one \"Dreaming Eyes, Emmeline\", call it to an open (RC), and shuffle your deck.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Powerful Dash, Andora": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedOnRCFrom(unit, 'hand')){return true} return false},
  "cost": {
    "counterBlast": {
      "amount": 2,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "increaseCrit": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){increaseCritEndTurn(unit , this.increaseCrit.amount)}
  },
  "text": "[AUTO]:When this unit is placed on (RC) from hand, COST [Counter Blast (2)], and this unit gets [Critical]+1 until end of turn.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Brainy Player, Bibbuel": {
"ability1": {

  "cost": {
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },

    "costEffect": async function (unit){ await soulBlast(this.soul.amount) ; retireThisUnit(unit)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "choose": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "cardtype",
          "propertyToFind": "Trigger Unit",
          "condition": "="
        }
      ]
    },
    "effect": async function (unit){draw(this.draw.amount);await choose(this.choose.amount , userZones.bind ,this.choose.filter , (card)=>{card.tempGrade ++} ) }
  },
  "text": "[ACT](RC):COST [Soul Blast (1) & Retire this unit], draw a card, choose up to one trigger unit from your bind zone, and it gets grade +1 until end of turn.",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "type": "ACT",
  "permanent": true,
  "costPaid": false
},
"ability2": {
  "condition": async function (unit){ if(whiteWings() && (onRC(unit) || onGC(unit))){return true} return false},
  "on": async function (unit){increasePower(unit,  5000) ; increaseShield(unit , 5000) },
  "off": async function (unit){ increasePower(unit,  -5000) ; increaseShield(unit , -5000) },
  "isOn": false,
  "text": "White Wings (Active when bind only has odd grades)-[CONT](RC/GC):This unit gets [Power]+5000/[Shield]+5000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Earnescorrect Member, Katalyn": {
"ability1": {
  "condition": async function (unit){  let otherUnit = currentBattle.current.attackingUnit ;
     if(whenYourOtherUnitsAttackHits(unit) 
    && otherUnit.name === 'Earnescorrect Leader, Clarissa' && otherUnit.place === 'VC' && onRC(unit)){return true} return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "hand": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount); await discard(this.hand.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){standThisUnit(unit)}
  },
  "text": "[AUTO](RC):When the attack of the \"Earnescorrect Leader, Clarissa\" on your (VC) hits, COST [Counter Blast (1) & discard a card], and [Stand] this unit.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Shining As-is, Alestiel": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedOnVC(unit)){return true} return false},
  "cost": null,
  "effect": {
    "bind": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      let len = userZones.bind.length

   superiorAdd(userZones.bind, userZones.hand , 1 , undefined , undefined, true)
      await toBotDeck(userZones.bind , this.bind.amount , )
      if(len !== userZones.bind.length){
        //bind top deck
        bindTop(1)

      }

    }
  },
  "text": "[AUTO]:When this unit is placed on (VC), choose a card from your bind zone, put it on the bottom of your deck, and if you put a card, bind the top card of your deck face up.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": async function (unit){return whiteWings()&& onVC(unit) },
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount) }
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){increaseCritEndTurn(unit)}
  },
  "text": "White Wings-[ACT](VC)1/Turn:COST [Counter Blast (1)], and this unit gets [Critical]+1 until end of turn.",
  "1/Turn": true,
  "Used1/Turn": false,
  "H1/Turn": false,
  "type": "ACT",
  "permanent": true,
  "costPaid": false
},
"ability3": {
  "condition": async function (unit){ if(blackWings(unit) && onVC(unit) && duringTheBattleThisUnitAttacked(unit)){return true} return false},
  "on": async function (unit){guardRestrictEndBattle(unit , 'noTriggerUnits') },
  "off": async function (unit){ removeGuardRestrict()},
  "isOn": false,
  "text": "Black Wings-[CONT(VC):During the battle this unit attacked, your opponent cannot call trigger units from hand to (GC).",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Talent of Enjoyment, Feltyrosa": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false},
  "cost": {
    "hand": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "race",
          "propertyToFind": "Ghost",
          "condition": "="
        },
        {
          "cardProperty": "cardtype",
          "propertyToFind": "Normal Unit",
          "condition": "="
        },
      ]
    },
    "costEffect": async function (unit){
      let revealed = await reveal(1 , userZones.hand , this.hand.filter )
      addToZone(userZones.hand , newDeck.MainDeck, revealed ,'hand' , false )

    }
  },
  "effect": {
    "drop": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "race",
          "propertyToFind": "Ghost",
          "condition": "="
        }
      ]
    },
    "effect": async function (unit){await toHand(userZones.drop , this.drop.amount, this.drop.filter)}
  },
  "text": "[AUTO]:When this unit is rode upon, COST [reveal a <Ghost> normal unit from hand, and put it on the top of your deck], choose a <Ghost> from your drop, and put it into your hand.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": async function (unit){  if((onVC(unit)||onRC(unit))&& duringYourTurn() 
  && await rearguardAmountCheck(3 , [{
      "cardProperty": "race",
      "propertyToFind": "Ghost",
      "condition": "="},
      {"cardProperty": "place",
        "propertyToFind": "RC",
        "condition": "="} ])
  ){return true} return false},
  "on": async function (unit){increasePower(unit, 5000) },
  "off": async function (unit){increasePower(unit, -5000) },
  "isOn": false,
  "text": "[CONT](VC/RC):During your turn, if you have three or more <Ghost> on your (RC), this unit gets [Power]+5000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Accurate Interval, Clarissa": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedByRiding(unit , 'Serious Challenger, Clarissa')){return true} return false},
  "cost": {
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "look": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "name",
          "propertyToFind": "Earnescorrect",
          "condition": "includes"
        },
        {
          "cardProperty": "grade",
          "propertyToFind": 3,
          "condition": "<"
        },
      ]
    },
    "effect": async function (unit){
      let rest = await lookTopXAdd(userZones.hand , 7 , 1 , [
      {
        "cardProperty": "name",
        "propertyToFind": "Earnescorrect",
        "condition": "includes"
      },
      {
        "cardProperty": "grade",
        "propertyToFind": 3,
        "condition": "<"
      },

    ])
    rest = await shuffleTheRest(rest)
    await putBotDeck(rest)
  
  }// comeback
  },
  "text": "[AUTO]:When this unit is placed on (VC) by riding on \"Serious Challenger, Clarissa\", COST [Soul Blast (1)], look at seven cards from the top of your deck, choose up to one grade 2 or less card with \"Earnescorrect\" in its card name from among them, reveal it and put it into your hand, shuffle the rest and put them on the bottom of your deck.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": async function (unit){ if( onVC(unit)&& duringYourTurn()){
    let rgs = await searchCircles(rearguard())
    if(rgs.length === 0)
    return true} return false},
  "on": async function (unit){increasePower(unit , 5000) },
  "off": async function (unit){increasePower(unit , -5000) },
  "isOn": false,
  "text": "[CONT](VC):During your turn, if you have no rear-guards, this unit gets [Power]+5000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Heavenly Recital, Emmael": {
"ability1": {
  "condition": async function (unit){ if(blackWings() && onRC(unit) && endOfBattleThisUnitAttackedWhileBoosted(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      //addevent listener to rc and soul , 
      await chooseOneOfTheFollowing([{
       text:'Choose RG',  
       effect: async()=>{
        await bounceYourRearguards(1)
       }
      },
    {
      text:'Choose from soul',
      effect: async()=>{
        let len = userZones.soul.length
        await soulToHand(1)
        if(len !==  userZones.soul.length){
          soulThisUnit(unit)
        }
       }
    },
  
  ])

    }
  }, 
  "text": "Black Wings (Active when bind only has even grades)-[AUTO](RC):At the end of the battle this unit attacked while boosted, choose a card from your soul or rear-guards, and you may return it to your hand. If you chose from your soul, put this unit into your soul.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Blossoming Vocal, Loronerol": {
"ability1": {
  "condition": async function (unit){ if(onVC(unit) && duringYourTurn() &&
     searchZoneLength(1, userZones.orderZone ,  [
      {
        "cardProperty": "cardtype",
        "propertyToFind": "Song",
        "condition": "includes"
      },
      {
        "cardProperty": "faceup",
        "propertyToFind": true,
        "condition": "="
      }
    ])){return true} return false},
  "on": async function (unit){increasePower(unit , 5000) },
  "off": async function (unit){increasePower(unit , -5000) },
  "isOn": false,
  "text": "[CONT](VC):During your turn, if your Order Zone has a face up Song, this unit gets [Power]+5000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
},
"ability2": {
  "condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false},
  "cost": null,
  "effect": {
    "deck": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "cardtype",
          "propertyToFind": "Song",
          "condition": "includes"
        },
        {
          "cardProperty": "grade",
          "propertyToFind": 2,
          "condition": "="
        },
      ]
    },
    "effect": async function (unit){
      let handLength = userZones.hand.length
      
      let zone = joinZones(userZones.hand , newDeck.MainDeck)

      await toOrder(zone , 1 , this.deck.filter)
      await removeById(userZones.hand , userZones.orderZone[0].id)
      await removeById(newDeck.MainDeck , userZones.orderZone[0].id)
      if(handLength !== userZones.hand.length){//took from hand
        draw()
      }
      else{
        shuffleDeck()
      }
    } 
  },
  "text": "[AUTO]:When this unit is rode upon, search your deck or hand for up to one grade 2 Song card, reveal it and put it into your Order Zone, and if you searched your deck, shuffle your deck. If you put from your hand, draw a card.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Expanding World, Wilista": {
"ability1": {
  "condition": async function (unit){ if(onVC(unit) && whenYouPlay([
    {
      "cardProperty": "cardtype",
      "propertyToFind": "Gem",
      "condition": "includes"
    }
  ])){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount)}
  },
  "text": "[AUTO](VC)1/Turn:When you play a Gem card, draw a card.",
  "type": "AUTO",
  "1/Turn": true,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": async function (unit){ if(onGC(unit)){return true} return false},
  "on": async function (unit){ 
    let gemsLength = await searchZones(userZones.drop,  [
      {
        "cardProperty": "cardtype",
        "propertyToFind": "Gem",
        "condition": "includes"
      }
    ]).length
    let shields = gemsLength / 2
    increaseShield(unit , (5000 * shields))
  },
  "off": async function (unit){         
    let gemsLength = await searchZones(userZones.drop,  [
    {
      "cardProperty": "cardtype",
      "propertyToFind": "Gem",
      "condition": "includes"
    }
  ]).length
  let shields = gemsLength / 2
  increaseShield(unit , -(5000 * shields))},
  "isOn": false,
  "text": "[CONT](GC):This unit gets [Shield]+5000 for every two Gem cards in your drop.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Mystic Voice, Renata": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      
      let currentBot = newDeck.MainDeck[0]
   
      await dropToBotDeck(1, gem())
      let newBot = newDeck.MainDeck[0]

      if(newBot.id !== currentBot.id){
        await dropToSoul(1 , [{cardProperty:'name' , propertyToFind:newBot.name, condition:'='}])
      }
       


    }
  },
  "text": "[AUTO]:When this unit is placed on (RC), choose up to two Gem cards with the same card names from your drop, put a card from among them on the bottom of your deck, and put the rest into your soul.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Advent Stroke, Shedael": {
"ability1": {
  "condition": async function (unit){ onRC(unit)},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){ await counterBlast(this.counterBlast.amount) ; soulThisUnit(unit)}
  },
  "effect": {
    "choose": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount);await choose(this.choose.amount , userZones.bind ,this.choose.filter , (card)=>{card.tempGrade ++} ) }
  },
  "text": "[ACT](RC):COST [Counter Blast (1) & Put this unit into your soul], draw a card, choose up to one card from your bind zone, and it gets grade +1 until end of turn.",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "type": "ACT",
  "permanent": true,
  "costPaid": false
},
"ability2": {
  "condition": async function (unit){ if(blackWings() && onRC(unit)){return true} return false},
  "on": async function (unit){unit.canBeChosen = false  }, //do something for being attacked
  "off": async function (unit){unit.canBeChosen = true  },
  "isOn": false,
  "text": "Black Wings (Active when bind only has even grades)-[CONT](RC):This unit cannot be chosen by your opponent's effects, and cannot be attacked by your opponent's rear-guards.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Sweet Tone, Kriemhild": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedOnRC(unit) && phaseCheck('battle')){return true} return false},
  "cost": {
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "increasePower": {
      "amount": 10000,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){increasePowerEndTurn(unit , this.increasePower.amount)}
  },
  "text": "[AUTO]:When this unit is placed on (RC) during your battle phase, COST [Soul Blast (1)], and this unit gets [Power]+10000 until end of turn.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Distinct Wordsense, Flor": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedOnRCFrom(unit , 'hand')){return true} return false},
  "cost": null,
  "effect": {
    "searchUnit": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "grade",
          "propertyToFind": 2,
          "condition": "!="
        },
        {
          "cardProperty": "cardtype",
          "propertyToFind": 'Unit',
          "condition": "includes"
        },
      ]
    },
    "effect": async function (unit){



      let topCard = await lookTopX(1)
 
      revealIt(topCard)
 
      let remaining 
      if(searchUnit(topCard[0] , this.searchUnit.filter )){
   
        remaining =  await superiorCall(topCard , undefined ,1 , 'userCircles' , true)
      }
      putBotDeck(remaining)
 
    }
  },
  "text": "[AUTO]:When this unit is placed on (RC) from hand, reveal the top card of your deck, and if it is a non-grade 2 unit card, call it to an open (RC). If you could not call a card, put the revealed card on the bottom of your deck.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Mini-live After School, Katina": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
  "cost": {
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "hand": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount) ; await discard(this.hand.amount)}
  },
  "effect": {
    "search": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "cardtype",
          "propertyToFind": "Gem",
          "condition": "includes"
        }
      ]
    },
    "effect": async function (unit){await toHand(userZones.drop, 1, this.search.filter)}
  },
  "text": "[AUTO]:When this unit is placed on (RC), COST [Soul Blast (1) & discard a card from your hand], choose a Gem card from your drop, and put it into your hand.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Magnificent Timbre, Lyudia": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "cardtype",
          "propertyToFind": "Normal Unit",
          "condition": "="
        }
      ]
    },
    "hand": {
      "amount": 2,
      "filter": [
        {
          "cardProperty": "cardtype",
          "propertyToFind": "Normal Unit",
          "condition": "="
        }
      ]
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount) ;
      let revealed =  await reveal(this.hand.amount , userZones.hand, this.hand.filter)
      revealed = await rearrange(revealed)
      putBotDeck(revealed)

    }
     
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "cardtype",
          "propertyToFind": "Normal Unit",
          "condition": "="
        }
      ]
    },
    "effect": async function (unit){
      let name = userCircles.userVG.unit.name
      await toHand(newDeck.MainDeck , 1, [
        {
          "cardProperty": "name",
          "propertyToFind": name,
          "condition": "="
        }
      ])
    }
  },
  "text": "[AUTO]:When this unit is placed on (RC), COST [Counter Blast (1) & reveal 2 normal units from your hand, and put them on the bottom of your deck in any order], choose one of your vanguards, search your deck for up to one card with the same card name as that card, reveal it and put it into your hand, and shuffle your deck.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Cloudless Heart, Miael": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedOnRC(unit) && whiteWings()){return true} return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "clan",
          "propertyToFind": "",
          "condition": "="
        },
      ]
    },
    "soul": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "clan",
          "propertyToFind": "",
          "condition": "="
        },
      ]
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount); await soulBlast(this.soul.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "tempPower",
          "propertyToFind": 8000,
          "condition": "="
        }
      ]
    },
    "effect": async function (unit){await toHand(userZones.drop, this.drop.amount,this.drop.fiter)}
  },
  "text": "White Wings (Active when bind only has odd grades)-[AUTO]:When this unit is placed on (RC), COST [Counter Blast (1) & Soul Blast (1)], choose a [Power]8000 card from your drop, and put it into your hand.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Determined Cheerfulness, Sarka": {
"ability1": {
  "condition": async function (unit){ if(1){return true} return false},
  "on": async function (unit){ },
  "off": async function (unit){ },
  "isOn": false,
  "text": "[CONT]:Sentinel (You may only have up to four cards with \"[CONT]:Sentinel\" in a deck.)",
  "type": "CONT",
  "permanent": true,
  "cost": null
},
"ability2": {
  "condition": async function (unit){ if(whenPutOnGC(unit)){return true} return false},
  "cost": null,
  "effect": {
    "hand": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      await perfectGuard()
    if(userZones.hand.length > 2){
      await discard(1)
    }
    
    }
  },
  "text": "[AUTO]:When this unit is put on (GC), choose one of your units, and it cannot be hit until end of that battle. If your hand has two or more cards, choose a card from your hand, and discard it.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Soapy Splash, Riviena": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false},
  "on": async function (unit){ },
  "off": async function (unit){ },
  "isOn": false,
  "text": "[CONT]:Sentinel (You may only have up to four cards with \"[CONT]:Sentinel\" in a deck.)",
  "type": "CONT",
  "permanent": true,
  "cost": null
},
"ability2": {
  "condition": async function (unit){ if(whenPutOnGC(unit)){return true} return false},
  "cost": null,
  "effect": {
    "hand": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      await perfectGuard()
    if(userZones.hand.length > 2){
      await discard(1)
    }
    
    }
  },
  "text": "[AUTO]:When this unit is put on (GC), choose one of your units, and it cannot be hit until end of that battle. If your hand has two or more cards, choose a card from your hand, and discard it.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Diva of Refreshing Calm, Christine": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false},
  "on": async function (unit){ },
  "off": async function (unit){ },
  "isOn": false,
  "text": "[CONT]:Sentinel (You may only have up to four cards with \"[CONT]:Sentinel\" in a deck.)",
  "type": "CONT",
  "permanent": true,
  "cost": null
},
"ability2": {
  "condition": async function (unit){ if(whenPutOnGC(unit)){return true} return false},
  "cost": null,
  "effect": {
    "hand": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      await perfectGuard()
    if(userZones.hand.length > 2){
      await discard(1)
    }
    
    }
  },
  "text": "[AUTO]:When this unit is put on (GC), choose one of your units, and it cannot be hit until end of that battle. If your hand has two or more cards, choose a card from your hand, and discard it.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Musical Committee, Nicolene": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false},
  "on": async function (unit){ },
  "off": async function (unit){ },
  "isOn": false,
  "text": "[CONT]:Sentinel (You may only have up to four cards with \"[CONT]:Sentinel\" in a deck.)",
  "type": "CONT",
  "permanent": true,
  "cost": null
},
"ability2": {
  "condition": async function (unit){ if(whenPutOnGC(unit)){return true} return false},
  "cost": null,
  "effect": {
    "hand": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      await perfectGuard()
    if(userZones.hand.length > 2){
      await discard(1)
    }
    
    }
  },
  "text": "[AUTO]:When this unit is put on (GC), choose one of your units, and it cannot be hit until end of that battle. If your hand has two or more cards, choose a card from your hand, and discard it.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Unwelcoming in Private, Desiel": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false},
  "on": async function (unit){ },
  "off": async function (unit){ },
  "isOn": false,
  "text": "[CONT]:Sentinel (You may only have up to four cards with \"[CONT]:Sentinel\" in a deck.)",
  "type": "CONT",
  "permanent": true,
  "cost": null
},
"ability2": {
  "condition": async function (unit){ if(whenPutOnGC(unit)){return true} return false},
  "cost": null,
  "effect": {
    "hand": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      await perfectGuard()
    if(userZones.hand.length > 2){
      await discard(1)
    }
    
    }
  },
  "text": "[AUTO]:When this unit is put on (GC), choose one of your units, and it cannot be hit until end of that battle. If your hand has two or more cards, choose a card from your hand, and discard it.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Fulfill Sweets, Angelma": {
"ability1": {
  "condition": async function (unit){ if(onBackRowRC(unit) && whenYourOtherRearguardIsPlaced(unit) && phaseCheck('battle')){return true} return false},
  "cost": {
    "soul": {
      "amount": 2,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount)}
  },
  "text": "[AUTO](Back Row RC)1/Turn:When your other unit is placed on (RC) during your battle phase, COST [Soul Blast (2)], and draw a card.",
  "type": "AUTO",
  "1/Turn": true,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Earnescorrect Supporter, Trilby": {
"ability1": {
  "condition": async function (unit){ if(whenYourVanguardsAttackHits(unit) && onRC(unit)){return true} return false},
  "cost": null,
  "effect": {
    "increasePower": {
      "amount": 5000,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){increasePowerEndTurn(unit , this.increasePower.amount)}
  },
  "text": "[AUTO](RC):When your vanguard's attack hits, this unit gets [Power]+5000 until end of turn.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Blue-haired Prodigy, Receus": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){await chooseUnits(1 ,
      [
        {
          "cardProperty": "id",
          "propertyToFind": unit.id,
          "condition": "!="
        }
      ] , (unit)=>{
      increasePowerEndTurn(unit , 10000)
    } )}
  },
  "text": "[AUTO]:When this unit is placed on (RC), choose one of your other units, and it gets [Power]+10000 until end of turn.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Madder Red Runway": {
"ability2": {
  "condition": async function (unit){ if(whenThisCardIsPutIntoOrderZone(unit) && ifYourOpponentsVanguardIsGrade3orGreater()){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount)}
  },
  "text": "[AUTO]:When this card is put into the Order Zone, if your opponent's vanguard is grade 3 or greater, draw a card.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability3": {
  "condition": async function (unit){ if(whenSung(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      await chooseUnits(1, [            {
        "cardProperty": "place",
        "propertyToFind": "VC",
        "condition": "="
      }] , 
    (card)=>{increaseCritEndTurn(unit , 1)}
    )
    }
  },
  "text": "[AUTO](Order Zone):When this Song is sung, choose one of your vanguards, and it gets [Critical]+1 until end of turn.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Twilight Sound of Waves": {
"ability2": {
  "condition": async function (unit){ if(whenThisCardIsPutIntoOrderZone(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      await chooseUnits(1, [            {
        "cardProperty": "place",
        "propertyToFind": "VC",
        "condition": "="
      }] , 
    (card)=>{increasePowerEndTurn(unit , 5000)}
    )
    }
  },
  "text": "[AUTO]:When this card is put into your Order Zone, choose one of your vanguards, and it gets [Power]+5000 until end of turn.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability3": {
  "condition": async function (unit){ if(whenSung(unit) ){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      //get frontrow -> increaseonall frontorow
      await doAllFrontRow((card)=>{
        increasePowerEndTurn(card, 5000)
      })
    }
  },
  "text": "[AUTO](Order Zone):When this Song is sung, all of your front row units get [Power]+5000 until end of turn.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Windy Harmonica, Tertes": {
"ability1": {
  "condition": async function (unit){ if(whenThisUnitAttacks(unit) && onRC(unit)){return true} return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){increasePowerEndTurn(unit , 5000)}
  },
  "text": "[AUTO](RC):When this unit attacks, COST [Counter Blast (1)], and this unit gets [Power]+5000 until end of turn.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Sophisticate, Teresia": {
"ability1": {
  "condition": async function (unit){ if(ifYouPlayedAnOrderThisTurn() &&whenThisUnitAttacks(unit) && onRC(unit) ){return true} return false},
  "cost": {
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){increasePowerEndTurn(unit , 5000)}
  },
  "text": "[AUTO](RC):When this unit attacks, if you played an order this turn, COST [Soul Blast (1)], and this unit gets [Power]+5000 until end of turn.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Relaxed Conversation, Philomena": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){increaseOrderAmount()}
  },
  "text": "[AUTO]:When this unit is placed on (RC), you can play an additional order this turn. (It increases each time this ability is activated)",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Stronger Yearning in the Heart, Florenzia": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedOnRCOtherThanFrom(unit , 'hand')){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      makeConditionalContinuous(this.abilityId , unit, (unit)=>whenThisUnitAttacksOnRC(unit) , ()=>{guardRestrictEndBattle('twoOrMore')} , ()=>{removeGuardRestrict()} )
      untilEndTurn(()=>{
        removeConditionalContinuous(this.abilityId)
      }, unit)
    
    }
  },
  "text": "[AUTO]:When this unit is placed on (RC) other than from hand, until end of turn, when your opponent would call cards from their hand to (GC) for the battle this unit attacked, they must call two or more at the same time.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Positive Singing, Louche": {
"ability1": {
  "condition": async function (unit){ if(onRC(unit) && duringYourTurn()){return true} return false},
  "on": async function (unit){ 
    addContinuousPowerGain(this.abilityId,unit , userZones.orderZone , 2000,  )
  },
  "off": async function (unit){removeContinuousValue(this.abilityId) },
  "isOn": false,
  "text": "[CONT](RC):During your turn, this unit gets [Power]+2000 for each of your cards in your order zone.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Active Life, Jerry": {
"ability1": {
  "condition": async function (unit){ if(whenYourUnitIsAttacked(earnescorrect()) && onRC(unit)){return true} return false},
  "cost": {
    "thisUnit": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await retireThisUnit(unit)}
  },
  "effect": {
    "choose": {
      "amount": 1,
      "filter":[
        {
          "cardProperty": "name",
          "propertyToFind": "Earnescorrect",
          "condition": "includes"
        },
        {
          "cardProperty": "beingAttacked",
          "propertyToFind": true,
          "condition": "="
        },
      ]
    },
    "effect": async function (unit){
      await chooseUnits(this.choose.amount , this.choose.filter , (unit)=>{
        increasePowerEndBattle(unit, 10000)
      })
    }
  },
  "text": "[AUTO](RC):When your unit with \"Earnescorrect\" in its card name is attacked, COST [retire this unit], choose one of the attacked units, and it gets [Power]+10000 until end of that battle.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Midnight Lesson, Vannh": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
  "cost": {
    "counterBlast": {
      "amount": 2,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "callTopDeck": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "cardtype",
          "propertyToFind": "Trigger Unit",
          "condition": "="
        }
      ]
    },
    "effect": async function (unit){
        await callFromTopXShuffleRest(5, 2, this.callFromTopDeck.filter, true)
    }
  },
  "text": "[AUTO]:When this unit is placed on (RC), COST [Counter Blast (2)], look at five cards from the top of your deck, choose up to two trigger units from among them, call them to open (RC), and shuffle your deck.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Registering Emotions, Romana": {
"ability1": {
  "condition": async function (unit){ if(playedOrderThisTurn('Truehearted Ruby') && playedOrderThisTurn('Everlasting Sapphire')){return true} return false},
  "on": async function (unit){increasePower(unit , 10000) },
  "off": async function (unit){increasePower(unit , -10000)  },
  "isOn": false,
  "text": "[CONT](RC):If you played \"Truehearted Ruby\" and \"Everlasting Sapphire\" this turn, this unit gets [Power]+10000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Flight to the Yonder, Cheluel": {
"ability1": {
  "condition": async function (unit){ if(whenThisUnitAttacks(unit) && blackWings() && onRC(unit)){return true} return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){soulCharge(1);
   await changeOpponentUnits(1 , rearguard() , 'cannotStandNextStand')

    }
  },
  "text": "Black Wings (Active when bind only has even grades)-[AUTO](RC):When this unit attacks, COST [Counter Blast (1)], Soul Charge (1), choose one of your opponent's rear-guards, and that unit cannot [Stand] during the next stand phase.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Head Groupie, Marleen": {
"ability1": {
  "condition": async function (unit){ if( (onRC(unit) || onGC(unit)) && await rearguardAmountCheck(3 , [{
    "cardProperty": "race",
    "propertyToFind": "Ghost",
    "condition": "="},
    {"cardProperty": "place",
      "propertyToFind": "RC",
      "condition": "="} ])){return true} return false},
  "on": async function (unit){ increasePower(unit , 2000) ; increaseShield(unit , 5000)},
  "off": async function (unit){increasePower(unit , -2000) ; increaseShield(unit , -5000) },
  "isOn": false,
  "text": "[CONT](RC/GC):If you have three or more <Ghost> on your (RC), this unit gets [Power]+2000/[Shield]+5000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Howling Ballad, Fanael": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedOnRC(unit) && blackWings()){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      soulCharge(1)
      giveBoost(unit)}
  },
  "text": "Black Wings (Active when bind only has even grades)-[AUTO](RC):When this unit is placed on (RC), Soul Charge (1), and this unit gets \"Boost\" until end of turn.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Friendship, Hilda": {
"ability1": {
  "condition": async function (unit){ if(whenPutOnGC(unit)){return true} return false},
  "cost": null,
  "effect": {
    "bounce": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "name",
          "propertyToFind": "Earnescorrect",
          "condition": "includes"
        }
      ]
    },
    "effect": async function (unit){await bounceYourRearguards(1, earnescorrectRG())}
  },
  "text": "[AUTO]:When this unit is put on (GC), choose up to one of your rear-guards with \"Earnescorrect\" in its card name, and return it to your hand. (Even if the unit being attacked is removed, drive checks and abilities that activate at the end of battle are performed)",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Hair-braiding Aspiration, Heilwig": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedOnRC(unit) && phaseCheck('battle')){return true} return false},
  "cost": {
    "thisUnit": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){soulThisUnit(unit)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount)}
  },
  "text": "[AUTO]:When this unit is placed on (RC) during your battle phase, COST [put this unit into your soul], and draw a card.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Loaded Sentiments, Evelina": {
"ability1": {
  "condition": async function (unit){ if(whenPutOnGC(unit)){return true} return false},
  "cost": {
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "choose": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "name",
          "propertyToFind": "Earnescorrect",
          "condition": "includes"
        }
      ]
    },
    "effect": async function (unit){await chooseUnits(this.choose.amount, this.choose.filter,
      (card)=>{increasePowerEndBattle(card, 10000)}

    )}
  },
  "text": "[AUTO]:When this unit is put on (GC), COST [Soul Blast (1)], choose one of your units with \"Earnescorrect\" in its card name, and it gets [Power]+10000 until end of that battle.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Charming Style, Tsetsilia": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedOnRCFrom(unit , 'hand')
  && await rearguardAmountCheck(3, [            {
    "cardProperty": "id",
    "propertyToFind": unit.id,
    "condition": "!="
  }])){return true} return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount)}
  },
  "text": "[AUTO]:When this unit is placed on (RC) from hand, if you have three or more other rear-guards, COST [Counter Blast (1)], and draw a card.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Dancing Score, Elmer": {
"ability1": {
  "condition": async function (unit){ if(whenPutOnGC(unit)){return true} return false},
  "cost": {
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      let num = getZoneLength(userZones.orderZone)
      increaseShieldEndBattle(unit , (num * 5000) )
    }
  },
  "text": "[AUTO]:When this unit is put on (GC), COST [Soul Blast (1)], and this unit gets [Shield]+5000 until end of that battle for each of your cards in your order zone.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Best Rival, Train": {
"ability1": {
  "condition": async function (unit){ if(onBackRowRC(unit)){return true} return false},
  "on": async function (unit){ giveBoost() ; increasePower(unit , -2000)},
  "off": async function (unit){ removeBoost() ; increasePower(unit , 2000)},
  "isOn": false,
  "text": "[CONT](Back Row RC):This unit unit gets \"Boost\" and [Power]-2000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Love-gazing, Tyrusiel": {
"ability1": {
  "condition": async function (unit){ if(whenPutOnGC(unit) && blackWings()){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
     await changeOpponentUnits(1 ,backrowRearguards() ,'rest')


    }
  },
  "text": "Black Wings (Active when bind only has even grades)-[AUTO]:When this unit is put on (GC), choose one of your opponent's back row rear-guards, and [Rest] it.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Candid Big Sister, Audrey": {
"ability1": {
  "condition": async function (unit){ if(onRC(unit) && duringYourTurn() && (getZoneLength(userZones.orderZone) > 0)){return true} return false},
  "on": async function (unit){ increasePower(unit , 5000)},
  "off": async function (unit){ increasePower(unit , -5000)},
  "isOn": false,
  "text": "[CONT](RC):During your turn, if your Order Zone has a card, this unit gets [Power]+5000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Blooming Season, Rudi": {
"ability1": {
  "condition": async function (unit){ if(onRC(unit) && await whenYourRearguardIsPlaced(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){increasePowerEndTurn(unit ,  (5000))}
  },
  "text": "[AUTO](RC):When your rear-guard is returned to your hand, this unit gets [Power]+5000 until end of turn.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Tense Moment, Katie": {
"ability1": {
  "condition": async function (unit){ if((onVC(unit) || onRC(unit)) && !duringYourTurn()){return true} return false},
  "on": async function (unit){increasePower(unit , -2000) },
  "off": async function (unit){ increasePower(unit , 2000)},
  "isOn": false,
  "text": "[CONT](VC/RC):During your opponent's turn, this unit gets [Power]-2000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Beautiful Day Off, Feltyrosa": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false},
  "cost": {
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "drop": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "race",
          "propertyToFind": "Ghost",
          "condition": "="
        }
      ]
    },
    "effect": async function (unit){await toHand(userZones.drop, this.drop.amount , this.drop.filter, 'drop')}
  },
  "text": "[AUTO]:When this unit is rode upon, COST [Soul Blast (1)], choose up to one <Ghost> in your drop, and put it into your hand.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": async function (unit){ if((onVC(unit)||onRC(unit)) && duringYourTurn() 
  && await rearguardAmountCheck(1, [{
      "cardProperty": "race",
      "propertyToFind": "Ghost",
      "condition": "="},
      {"cardProperty": "place",
        "propertyToFind": "RC",
        "condition": "="} ])
  ){return true} return false},
  "on": async function (unit){increasePower(unit, 2000) },
  "off": async function (unit){increasePower(unit, -2000) },
  "isOn": false,
  "text": "[CONT](VC/RC):During your turn, if you have a <Ghost> on your (RC), this unit gets [Power]+2000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Classy Breeze, Harriet": {
"ability1": {
  "condition": async function (unit){ if(onRC(unit) &&duringYourTurn() && (getZoneLength(userZones.orderZone) > 1)){return true} return false},
  "on": async function (unit){increasePower(unit , 5000) },
  "off": async function (unit){increasePower(unit , -5000)  },
  "isOn": false,
  "text": "[CONT](RC):During your turn, if your Order Zone has two or more cards, this unit gets [Power]+5000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Steady Progress, Pecoree": {
"ability1": {
  "condition": async function (unit){ if(await ifYouHaveAUnitWithInItsCardName('Earnescorrect')){return true} return false},
  "on": async function (unit){ increasePower(unit, 2000)},
  "off": async function (unit){  increasePower(unit, -2000)},
  "isOn": false,
  "text": "[CONT](RC):During your turn, if you have a unit with \"Earnescorrect\" in its card name, this unit gets [Power]+2000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Indecisive Sky, Alestiel": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedOnVC(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      bindTop(this.draw.amount)
 
  }
  },
  "text": "[AUTO]:When this unit is placed on (VC), bind the top card of your deck.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": async function (unit){ if(whiteWings() && onVC(unit)){return true} return false},
  "on": async function (unit){ playerObjects.current.rideFromRideDeck = 
    async function (){

      if(newDeck.RideDeck[newDeck.RideDeck.length-1] == null){timedDisplay('no more ride deck'); return}
    
      await soulBlast(1)
      
      userCircles  [`user` + "VG"].unit['state'] = 'rodeUpon'
     userZones.soul.push(userCircles[`user` + "VG"].unit)

     
      userCircles  [`user` + "VG"].unit = {...newDeck.RideDeck.pop(newDeck.RideDeck.length-1)}
     userCircles  [`user` + "VG"].unit['state'] = 'placed'
     userCircles  [`user` + "VG"].unit['place'] = 'VC'
     userCircles  [`user` + "VG"].unit['circle'] = 'userVG'

      setPopup(false)
   
    for(let i = 0; i< newDeck.RideDeck.length; i++){
      await searchCardAbilities(newDeck.RideDeck[i])
 
    }
    await searchAbilities()
      await waitAbilities()
    

      setUserCircles({...userCircles})

     }



   },
  "off": async function (unit){  playerObjects.current.rideFromRideDeck = defaults.current.rideFromRideDeck},
  "isOn": false,
  "text": "White Wings-[CONT](VC):When you would ride from your ride deck, you may \"Soul Blast (1)\" instead of \"Choose a card from your hand, and discard it\".",
  "type": "CONT",
  "permanent": true,
  "cost": null
},
"ability3": {
  "condition": async function (unit){ if( onVC(unit)){return true} return false},
  "on": async function (unit){ 
 
    allOfYourOpponentsUnits(this.abilityId , newPropertyArray([grade1OrLess() , rearguard()]) ,  'cannotAttack' , unit.circle)


}, 
  "off": async function (unit){removeAllOfYourOpponentsUnits(this.abilityId) },
  "isOn": false,
  "text": "Black Wings-[CONT](VC):All of your opponent's grade 1 or less rear-guards cannot attack this unit.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Scramble Sprint, Selma": {
"ability1": {
  "condition": async function (unit){ if(onRC(unit) && whenThisUnitBoostsAVanguard(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount)
      await discard(1)
    }
  },
  "text": "[AUTO](RC):When this unit boosts a vanguard, draw a card, choose a card from your hand, and discard it.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Throbbing Search, Loronerol": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false},
  "cost": null,
  "effect": {
    "deck": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "cardtype",
          "propertyToFind": "Song",
          "condition": "includes"
        },
        {
          "cardProperty": "grade",
          "propertyToFind": 1,
          "condition": "="
        },
      ]
    },
    "effect": async function (unit){
      let handLength = userZones.hand.length
      
      let zone = joinZones(userZones.hand , newDeck.MainDeck)

      await toOrder(zone , 1 , this.deck.filter)
      await removeById(userZones.hand , userZones.orderZone[0].id)
      await removeById(newDeck.MainDeck , userZones.orderZone[0].id)
      if(handLength !== userZones.hand.length){
        draw()
      }
      else{
        shuffleDeck()
      }
    } 
  },
  "text": "[AUTO]:When this unit is rode upon, search your deck or hand for up to one grade 1 Song card, reveal it and put it into your Order Zone, and if you searched your deck, shuffle your deck. If you put it from hand, draw a card.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Proof of Hard Work, Wilista": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false},
  "cost": {
    "hand": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await handToSoul(1)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){await deckToHand(1, gem())}
  },
  "text": "[AUTO]:When this unit is rode upon, COST [put a card from your hand into your soul], search your deck for up to one Gem card, reveal it and put it into your hand, and shuffle your deck.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": async function (unit){ if(whenYouPlay([]) && onRC(unit)){return true} return false},
  "cost": {
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){increasePowerEndTurn(unit , 5000)}
  },
  "text": "[AUTO](RC):When you play an order, COST [Soul Blast (1)], and this unit gets [Power]+5000 until end of turn.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Fleeting Maiden, Hannelore": {
"ability1": {
  "condition": async function (unit){ if(await whenYourOtherRearguardIsPlaced(unit, sameColumn(unit))){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      increasePowerEndTurn(unit, 2000)
    }
  },
  "text": "[AUTO](RC):When your other rear-guard is placed in the same column as this unit, this unit gets [Power]+2000 until end of turn.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Enthusiastic Noon, Chantal": {
"ability1": {
  "condition": async function (unit){ if(onRC(unit)){return true} return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount) }
  },
  "effect": {
    "choose": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "circle",
          "propertyToFind": "VC",
          "condition": "="
        }
      ]
    },
    "effect": async function (unit){await chooseUnits(1, this.choose.filter, (unit)=>{increasePowerEndTurn(unit , 5000)})}
  },
  "text": "[ACT](RC)1/Turn:COST [Counter Blast (1)], choose one of your vanguards, and it gets [Power]+5000 until end of turn.",
  "1/Turn": true,
  "Used1/Turn": false,
  "H1/Turn": false,
  "type": "ACT",
  "permanent": true,
  "costPaid": false
}
},
"Advancing Courage, Bertieu": {
"ability1": {
  "condition": async function (unit){ if(whenThisUnitBoosts(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){increasePowerEndTurn(unit , 2000)}
  },
  "text": "[AUTO](RC):When this unit boosts, this unit gets [Power]+2000 until end of turn.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Precise Curriculum, Libuse": {
"ability1": {
  "condition": async function (unit){ if(onRC(unit) && ifYouPlayedAnOrderThisTurn()){return true} return false},
  "on": async function (unit){ increasePower(unit, 2000)},
  "off": async function (unit){increasePower(unit, -2000) },
  "isOn": false,
  "text": "[CONT](RC):If you played an order this turn, this unit gets [Power]+2000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Serious Challenger, Clarissa": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedByRiding(unit , "Dignified Will, Clarissa")){return true} return false},
  "cost": null,
  "effect": {
    "look": {
      "amount": 1,
      "filter": [

      ]
    },
    "effect": async function (unit){
      
      let rest = await lookTopXAdd(userZones.hand , 7 , 1 , [{
      "cardProperty": "name",
      "propertyToFind": "Earnescorrect",
      "condition": "includes"
    },
    {
      "cardProperty": "grade",
      "propertyToFind": 2,
      "condition": "<"
    },])
  
    rest = await shuffleTheRest(rest)
    await putBotDeck(rest)
  
  }
  },
  "text": "[AUTO]:When this unit is placed on (VC) by riding on \"Dignified Will, Clarissa\", look at seven cards from the top of your deck, choose up to one grade 1 or less card with \"Earnescorrect\" in its card name from among them, reveal it and put it into your hand, shuffle the rest and put them on the bottom of your deck.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": async function (unit){ if(onVC(unit) && duringYourTurn() ){
    let rgs = await searchCircles(rearguard())
    if(rgs.length === 0)
    return true} return false},
  "on": async function (unit){ increasePower(unit, 5000)},
  "off": async function (unit){increasePower(unit, -5000) },
  "isOn": false,
  "text": "[CONT](VC):During your turn, if you do not have any rear-guards, this unit gets [Power]+5000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Little Peace, Prael": {
"ability1": {
  "condition": async function (unit){ if(whiteWings() && ( onRC(unit) || onGC(unit))){return true} return false},
  "on": async function (unit){ increasePower(unit, 2000); increaseShield(unit, 5000)},
  "off": async function (unit){increasePower(unit, -2000) ; increaseShield(unit, -5000)},
  "isOn": false,
  "text": "White Wings (Active when bind only has odd grades)-[CONT](RC/GC):This unit gets [Power]+2000/[Shield]+5000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Little Lady, Helmina": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedOnRC(unit) &&
    await rearguardAmountCheck(0 , [
      {
        "cardProperty": "race",
        "propertyToFind": "Ghost",
        "condition": "="
      },          {
        "cardProperty": "place",
        "propertyToFind": "RC",
        "condition": "="
      }
    ])
  ){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){

      await chooseUnits(1, [  {
      "cardProperty": "place",
      "propertyToFind": "RC",
      "condition": "="
    }] , (card)=>{increasePowerEndTurn(card , 5000)})

  }
  },
  "text": "[AUTO]:When this unit is placed on (RC), if you have another <Ghost> on (RC), choose one of your rear-guards, and it gets [Power]+5000 until end of turn.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Dependable Senior, Aries": {
"ability1": {
  "condition": async function (unit){ if(onGC(unit) && await openRC()>=3){return true} return false},
  "on": async function (unit){ increaseShield(unit , 10000)},
  "off": async function (unit){ increaseShield(unit , -10000)},
  "isOn": false,
  "text": "[CONT](GC):If you have three or more open (RC), this unit gets [Shield]+10000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Dreaming Eyes, Emmeline": {
"ability1": {
  "condition": async function (unit){ if(onRC(unit) && 
    await rearguardAmountCheck(1 , [
      {
        "cardProperty": "id",
        "propertyToFind": unit.id,
        "condition": "!="
      }, {
        "cardProperty": "circle",
        "propertyToFind": "RC",
        "condition": "="
      }
    ])){return true} return false},
  "on": async function (unit){ increasePower(unit , 5000)},
  "off": async function (unit){ increasePower(unit , -5000)},
  "isOn": false,
  "text": "[CONT](RC):If you have three or more other rear-guards, this unit gets [Power]+5000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Happiness Distribution, Danael": {
"ability1": {
  "condition": async function (unit){ if(onRC(unit)&&whiteWings() &&whenThisUnitBoosts(unit)){return true} return false},
  "cost": {
    "soul": {
      "amount": 2,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      let grade1s = await searchCircles( newPropertyArray([grade1(), [
        {
          "cardProperty": "name",
          "propertyToFind": unit.name,
          "condition": "!="
        }
      ]]  ))
      let grade3s = await searchCircles(grade3())
      let sum = grade1s.length + grade3s.length

      await increaseUnitsPowerEndTurn(1, 5000 * sum)
    }
  },
  "text": "White Wings (Active when bind only has odd grades)-[AUTO](RC):When this unit boosts, COST [Soul Blast (2)], choose one of your other units, and it gets [Power]+5000 until end of turn for each of your other units with odd grades.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Appassionato, Justine": {
"ability1": {
  "condition": async function (unit){ if(ifThisCardIsDiscarded(unit) && duringYourTurn()){return true} return false},
  "cost": {
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      let temp =[unit]

      await superiorCall(temp , undefined, 1 , 'userCircles' , true, 'hand')
      if(temp.length > 0){
        userZones.drop.push(temp[0])
      }
    }
  },
  "text": "[AUTO]:When this card is discarded from hand during your turn, COST [Soul Blast (1)], and call this card to an open (RC).",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Sky-quivering Motion, Malibuel": {
"ability1": {
  "condition": async function (unit){ if(onRC(unit) && duringYourTurn() && whiteWings()){return true} return false},
  "on": async function (unit){ increasePower(unit , 10000)},
  "off": async function (unit){ increasePower(unit , -10000)},
  "isOn": false,
  "text": "White Wings (Active when bind only has odd grades)-[CONT](RC):During your turn, this unit gets [Power]+10000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Admired Dear Sister, Feltyrosa": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount)}
  },
  "text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"To Deliver a Song, Loronerol": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount)}
  },
  "text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Brilliance in the Ore, Wilista": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount)}
  },
  "text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Monochromic Personality, Alestiel": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount)}
  },
  "text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Dignified Will, Clarissa": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount)}
  },
  "text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Romantic Happiness": {
"ability2": {
  "condition": async function (unit){ if(whenSung(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount)
      await chooseUnits(1 , [            {
        "cardProperty": "place",
        "propertyToFind": "VC",
        "condition": "="
      }] , (card )=>{increasePowerEndTurn(card , 5000)})
    }
  },
  "text": "[AUTO](Order Zone):When this Song is sung, draw a card, choose one of your vanguards, and it gets [Power]+5000 until end of turn.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
}, 
"Astesice, Kairi": {
"ability1": {
  "condition": function (unit){ if(whenThisUnitAttacks(unit) && onVC(unit)){return true} return false},
  "cost": {
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "choose": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "place",
          "propertyToFind": "RC",
          "condition": "="
        }
      ]
    },
    "effect": async function (unit){await chooseUnits(2, this.choose.filter, bounce)}
  },
  "text": "[AUTO](VC):When this unit attacks, COST [Soul Blast (1)], choose up to two of your rear-guards, and return them to your hand.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": function (unit){ if(endOfBattleThisUnitAttacked(unit) && onVC(unit) && personaRodeThisTurn()){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){

      await superiorCallFrontRow(userZones.hand , undefined , 1, false ,'hand')
      await superiorCallBackRow(userZones.hand , undefined , 1, false ,'hand')

    }
  },
  "text": "[AUTO](VC):At the end of the battle this unit attacked, if you persona rode this turn, choose up to two cards from your hand, and call them to (RC) in different rows.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Astesice, Kiyora": {
"ability1": {
  "condition": function (unit){ if(whenThisUnitAttacks(unit) && onVC(unit)){return true} return false},
  "cost": null,
  "effect": {
    "choose": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "place",
          "propertyToFind": "RC",
          "condition": "="
        }
      ]
    },
    "effect": async function (unit){
      await youMay('arg' , async (arg)=>{await chooseUnits(1, this.choose.filter , (unit)=>{bounce(unit )})})} 
  },
  "text": "[AUTO](VC):When this unit attacks, choose one of your rear-guards, and you may return it to hand.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": function (unit){ if(whenThisUnitIsBoosted(unit)){return true} return false},
  "on": async function (unit){ increasePower(unit , 5000)},
  "off": async function (unit){ increasePower(unit , -5000)},
  "isOn": false,
  "text": "[CONT](RC):During the battle this unit is boosted, this unit gets [Power]+5000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Astesice, Nanami": {
"ability1": {
  "condition": function (unit){ if(whenPlacedOnVC(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      await callFromDrop(1,[
        {
          "cardProperty": "grade",
          "propertyToFind": 1,
          "condition": "<="
        }
      ] ,undefined , false, (unit)=>rest(unit))
    }
  },
  "text": "[AUTO]:When this unit is placed on (VC), you may choose a grade 1 or less card from your drop, and call it to (RC) as [Rest].",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){increasePowerEndTurn(unit, 2000)}
  },
  "text": "[AUTO]:When this unit is placed on (RC), this unit gets [Power]+2000 until end of turn.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Astesice, Mion": {
"ability1": {
  "condition": function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount)}
  },
  "text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Energetic Attendance, Calfy": {
"ability1": {
  "condition": function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){increasePowerEndTurn(unit , 10000)}
  },
  "text": "[AUTO]:When this unit is placed on (RC), this unit gets [Power]+10000 until end of turn.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Slight Slump?, Apelle": {
"ability1": {
  "condition": function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){increasePowerEndTurn(unit , 10000)}
  },
  "text": "[AUTO]:When this unit is placed on (RC), COST [Counter Blast (1)], and this unit gets [Power]+10000 until end of turn.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Earnest Wish, Hanael": {
"ability1": {
  "condition": function (unit){ if(whenRodeUpon(unit)){return true} return false},
  "on": async function (unit){ },
  "off": async function (unit){ },
  "isOn": false,
  "text": "[CONT]:Sentinel (You may only have up to four cards with \"[CONT]:Sentinel\" in a deck.)",
  "type": "CONT",
  "permanent": true,
  "cost": null
},
"ability2": {
  "condition": function (unit){ if(whenPutOnGC(unit)){return true} return false},
  "cost": {
    "hand": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){discard(this.hand.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){          await perfectGuard()
      
      }
  },
  "text": "[AUTO]:When this unit is put on (GC), COST [discard a card from your hand], choose one of your units, and it cannot be hit until end of that battle.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Munching Girl, Seeya": {
"ability1": {
  "condition": function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
  "cost": {
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      let len  = userZones.hand.length
      let cards  = await lookTopDeck(1)
      await chooseOneOfTheFollowing([{
text:'Call To RC' , effect: async ()=>{await callFromAbilityZone(cards,1, cards , undefined , true)}
      }, 
    {
      text:'Add To Hand' , effect: async ()=>{
        putHand(cards)
      }
    }])

if(userZones.hand.length !== len){
  await discard(1)
}

    
    }
  },
  "text": "[AUTO]:When this unit is placed on (RC), COST [Soul Blast (1)], look at the top card of your deck, call it to an open (RC) or put it into your hand. If you put a card into your hand, choose a card from your hand, and discard it.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
}, 
"Worldwide Special Live Tour!": {
"ability1": {
  "condition": async function (unit){if(whenPlacedOnRC(unit)){return true} return false },
  "cost": {
    "counterBlast": {
      "amount": 2,
      "filter": basicPropertyArray
    },
     "costEffect": async function (unit){await counterBlast(this.counterBlast.amount) }
  },
  "effect": {
    "choose": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "place",
          "propertyToFind": "VC",
          "condition": "="
        }
      ]
    },
    "effect": async function (unit){
      await chooseUnits(1 , vanguard() , (card)=>{
        allOfYourUnits(1, rearguard() , (unit)=>{
          increasePower(unit , 5000)
        } , 
        (unit)=>{
          increasePower(unit , -5000)
        } 
      )
    untilEndTurn(()=>{
      removeAllOfYourUnits(1)
    } ,card)

    }
    )

    }
  },
  "text": "[ACT](Order Zone)1/Turn:COST [Counter Blast (2)], choose one of your vanguards, and until end of turn, it gets \"[CONT](VC):All of your rear-guards get [Power]+5000.\".",
  "1/Turn": true,
  "Used1/Turn": false,
  "H1/Turn": false,
  "type": "ACT",
  "permanent": true,
  "costPaid": false
}
},
"Fighting Together, Yoh Asakura": { 
"ability1": {
  "condition": async function (unit){if(onVC(unit)){return true} return false },
  "cost": {
    "rg": {
      "amount": 1,
      "filter": amidamaruRG()
    },
      "costEffect": async function (unit){await soulYourRearguards(1 , amidamaruRG()) }
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount);
     let abilityId =  giveCONTAbility(unit , (unit)=>  onVC(unit) && duringYourTurn() , 
      (unit)=>{allOfYourUnits(4, frontrowUnits(), (unit)=>{increasePower(unit , 5000)} , (unit)=>{increasePower(unit , -5000)})} ,
       () =>{removeAllOfYourUnits(4) })

       untilEndTurn(()=>{removeAbility(unit, abilityId)}, unit)
       thisTurn.current.overSoul = true}
    
  },
  "text": "[Over Soul]-[ACT](VC)1/Turn:COST [Put a rear-guard with \"Amidamaru\" in its card name into your soul], draw a card, and until end of turn, this unit gets \"[CONT](VC):All of your front row units get [Power]+5000.\".",
  "1/Turn": true,
  "Used1/Turn": false,
  "H1/Turn": false,
  "type": "ACT",
  "permanent": true,
  "costPaid": false
},
"ability2": {
  "condition": async function (unit){ if(whenThisUnitAttacksOnVC(unit) && ifDamageZoneHas4OrMore()){return true} return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){increaseCritEndBattle(unit ,1)}
  },
  "text": "[AUTO](VC):When this unit attacks, if your damage zone has four or more cards, COST [Counter Blast (1)], and this unit gets [Critical]+1 until end of that battle.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Battle of Fate, Yoh Asakura": {
"ability1": {
  "condition": async function (unit){ if(onVC(unit) && ifThisUnitIsBoostedByInItsName(unit , 'Amidamaru')){return true} return false},
  "cost": {
"counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount); increasePowerEndBattle(unit ,5000)}
  },
  "text": "[AUTO](VC):When this unit is boosted by a unit with \"Amidamaru\" in its card name, COST [Counter Blast (1)], draw a card and this unit gets [Power]+5000 until the end of that battle.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": async function (unit){ if(onRC(unit)){return true} return false},
  "on": async function (unit){increasePower(unit, 2000)},
  "off": async function (unit){increasePower(unit, -2000)},
  "isOn": false,
  "text": "[CONT](RC):During your turn, this unit gets [Power]+2000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Shaman, Yoh Asakura": {
"ability1": {
  "condition": async function (unit){ if(whenRidingFrom(unit, 'Yoh Asakura')){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      await callFromDeck(1,  [
        {
          "cardProperty": "name",
          "propertyToFind": "Legendary Samurai, Amidamaru",
          "condition": "="
        }
      ] , 'userBCRG')

    }
  },
  "text": "[AUTO]:When this unit is placed on (VC) by riding from \"Yoh Asakura\", search your deck for up to one \"Legendary Samurai, Amidamaru\", call it to your back row center (RC), and shuffle your deck.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Yoh Asakura": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount)}
  },
  "text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Famous Delinquent, \"Wooden Sword\" Ryu": {
"ability1": {
  "condition": async function (unit){ if(onRC(unit) && whenYourVanguardsAttackHits(unit) && ifYourVanguardHasXInItsName(unit , 'Yoh Asakura')){return true} return false},
  "cost": {
"counterBlast": {
      "amount": 2,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){standThisUnit(unit)}
  },
  "text": "[AUTO](RC):When the attack of your vanguard with \"Yoh Asakura\" in its card name hits, COST [Counter Blast (2)], and [Stand] this unit.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Itako, Anna Kyoyama": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false},
  "on": async function (unit){},
  "off": async function (unit){},
  "isOn": false,
  "text": "[CONT]:Sentinel (You may only have up to four cards with \"[CONT]:Sentinel\" in a deck.)",
  "type": "CONT",
  "permanent": true,
  "cost": null
},
"ability2": {
  "condition": async function (unit){ if(whenPutOnGC(unit)){return true} return false},
  "cost": {
    "hand": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await discard(this.hand.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){  await perfectGuard()}
  },
  "text": "[AUTO]:When this unit is put on (GC), COST [discard a card from your hand], choose one of your units, and it cannot be hit until end of that battle.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Legendary Samurai, Amidamaru": {
"ability1": {
  "condition": async function (unit){ if(onRC(unit)  && duringYourTurn() && ifYourVanguardHasXInItsName(unit , 'Yoh Asakura')){return true} return false},
  "on": async function (unit){increasePower(unit, 5000) ; 
    makeConditionalContinuous(this.abilityId, unit , (unit)=>vanguardOverSoulThisTurn() , (unit)=>{increaseCrit(unit ,1)}, (unit)=>{increaseCrit(unit ,-1)})},
  "off": async function (unit){increasePower(unit, -5000) ; removeConditionalContinuous(this.abilityId) },
  "isOn": false,
  "text": "[CONT](RC):During your turn, if you have a vanguard with \"Yoh Asakura\" in its card name, this unit gets [Power]+5000, and if that vanguard is [Over Soul] this turn, this unit gets [Critical]+1.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Manifested Form, Eliza": {
"ability1": {
  "condition": async function (unit){ if(duringTheBattleThisUnitBoosted(unit) ){return true} return false},
  "on": async function (unit){},
  "off": async function (unit){},
  "isOn": false,
  "text": "[CONT](RC):During the battle this unit boosted a unit with \"Faust VIII\" in its card name, this unit gets [Power]+5000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Persistent Thief, Tokageroh": {
"ability1": {
  "condition": async function (unit){ if(onRC(unit) && duringYourTurn()){return true} return false},
  "on": async function (unit){increasePower(unit, 2000) ;  
    allOfYourUnits(this.abilityId, newPropertyArray([[{cardProperty:'name', propertyToFind:'Wooden Sword\" Ryu' , condition:'includes'}] , sameColumn(unit)]) 
  
  ,(card)=>{increasePower(card , 5000)},  
    (card)=>{increasePower(card , -5000)},

)},
  "off": async function (unit){increasePower(unit, -2000)
    removeAllOfYourUnits(this.abilityId)

   },
  "isOn": false,
  "text": "[CONT](RC):During your turn, this unit gets [Power]+2000, and all of your units with \"\"Wooden Sword\" Ryu\" in their card names in the same column as this unit get [Power]+5000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},

"Diabolos, \"Violence\" Bruce": {
"ability1": {
  "condition": async function (unit){ if(onVC(unit) && beginningOfRide() ){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      finalRushEndTurn(unit)
    }
  },
  "text": "[AUTO](VC):At the start of your Ride Phase, you \"Final Rush\" until end of turn.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": async function (unit){ if(onVC(unit) && whenThisUnitAttacks(unit) && finalRush()){return true} return false},
  "cost": {
    "soul": {
      "amount": 5,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "stand": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "circle",
          "propertyToFind": "F",
          "condition": "includes"
        }
      ]
    },
    "effect": async function (unit){
   await standAll(this.stand.filter )
    }
  },
  "text": "[AUTO](VC):When this unit attacks, if you are in \"Final Rush\", COST [Soul Blast (5)], and [Stand] all of your front row rear-guards.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Diabolos, \"Anger\" Richard": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedOnVC(unit)){return true} return false},
  "cost": {
    "rg": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){
      await chooseUnits(this.rg.amount , this.rg.filter , soulThisUnit)
    }
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount)}
  },
  "text": "[AUTO]:When this unit is placed on (VC), COST [put a rear-guard into your soul], and draw a card.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": async function (unit){ if(onRC(unit) && finalRush()){return true} return false},
  "on": async function (unit){increasePower(unit , 5000)},
  "off": async function (unit){increasePower(unit , -5000)},
  "isOn": false,
  "text": "[CONT](RC):If you are in \"Final Rush\", this unit gets [Power]+5000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Diabolos, \"Bad\" Steve": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedOnVC(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      await superiorCall(userZones.soul , undefined, 1, 'userBCRG')
      soulCharge(1)
    }
  },
  "text": "[AUTO]:When this unit is placed on (VC), choose a card from your soul, call it to your back row center (RC), and Soul Charge (1).",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": async function (unit){ if(onRC(unit) && finalRush()){return true} return false},
  "on": async function (unit){increasePower(unit, 5000)},
  "off": async function (unit){increasePower(unit , -5000)},
  "isOn": false,
  "text": "[CONT](RC):If you are in \"Final Rush\", this unit gets [Power]+5000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Diabolos, \"Innocent\" Matt": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){

      draw(this.draw.amount)}
  },
  "text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true

}
},
"Time-fissuring Fist Colossus": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      soulCharge(1);
      if(finalRush()){
        
        await resolveNewAbility(unit, counterBlastObject(1) , (unit)=>{increasePowerEndTurn(unit, 15000)})
      }
    }
  },
  "text": "[AUTO]:When this unit is placed on (RC), Soul Charge (1). Then, if you are in \"Final Rush\", COST [Counter Blast (1)], and this unit gets [Power]+15000 until end of turn.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},

"Steam Gunner, Brody": {
"ability1": {
  "condition": async function (unit){ if(whenPutOnGC(unit)){return true} return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){increaseShieldEndBattle(unit ,5000)}
  },
  "text": "[AUTO]:When this unit is put on (GC), COST [Counter Blast (1)], and this unit gets [Shield]+5000 until end of that battle.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Acrobat Presenter": {
"ability1": {
  "condition": async function (unit){ if(onRC(unit) && ifYourVanguardIs('Diabolos, \"Violence\" Bruce' ) &&(whenThisUnitAttacks(unit)|| whenThisUnitBoosts(unit))){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      soulCharge(1)
      if(finalRush()){
        soulCharge(1)
      }
    }
  },
  "text": "[AUTO](RC):When this unit attacks or boosts, if your vanguard is \"Diabolos, \"Violence\" Bruce\", Soul Charge (1), and if you are in \"Final Rush\", Soul Charge (1).",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Psychic Prima, Miranda": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false},
  "on": async function (unit){},
  "off": async function (unit){},
  "isOn": false,
  "text": "[CONT]:Sentinel (You may only have up to four cards with \"[CONT]:Sentinel\" in a deck.)",
  "type": "CONT",
  "permanent": true,
  "cost": null
},
"ability2": {
  "condition": async function (unit){ if(whenPutOnGC(unit)){return true} return false},
  "cost": {
    "hand": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){discard(this.hand.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      await perfectGuard()
    }
  },
  "text": "[AUTO]:When this unit is put on (GC), COST [discard a card from your hand], choose one of your units, and it cannot be hit until end of that battle.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},

"Chakrabarthi Divine Dragon, Nirvana": {
"ability1": {
  "condition": async function (unit){if(onVC(unit)){return true} return false },
  "cost": {
    "hand": {
      "amount": 1,
      "filter": basicPropertyArray
    },
     "costEffect": async function (unit){await discard(this.hand.amount) }
  },
  "effect": {
    "call": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "grade",
          "propertyToFind": 0,
          "condition": "="
        }
      ]
    },
    "effect": async function (unit){
      await callFromDrop(1 , this.call.filter)
    }
  },
  "text": "[ACT](VC)1/Turn:COST [Discard a card from your hand], choose a grade 0 card from your drop, and call it to (RC).",
  "1/Turn": true,
  "Used1/Turn": false,
  "H1/Turn": false,
  "type": "ACT",
  "permanent": true,
  "costPaid": false
},
"ability2": {
  "condition": async function (unit){ if(onVC(unit) && whenThisUnitAttacks(unit)){return true} return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "increasePower": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "hasOverDress",
          "propertyToFind": true,
          "condition": "="
        }
      ]
    },
    "effect": async function (unit){
      increasePowerEndTurn(unit , 10000)
      increaseAllUnitsPowerEndTurn(this.increasePower.filter, 10000)
    }
  },
  "text": "[AUTO](VC):When this unit attacks, COST [Counter Blast (1)], and this unit and all of your units with the [overDress] ability get [Power]+10000 until end of turn.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Blaze Maiden, Reiyu": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUponBy(unit , "Chakrabarthi Divine Dragon, Nirvana")){return true} return false},
  "cost": {
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "add": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "name",
          "propertyToFind": "Vairina",
          "condition": "="
        }
      ]
    },
    "effect": async function (unit){
      await deckToHand(1, this.add.filter )
    }
  },
  "text": "[AUTO]:When this unit is rode upon by \"Chakrabarthi Divine Dragon, Nirvana\", COST [Soul Blast (1)], search your deck for up to one \"Vairina\", reveal it and put it into your hand, and shuffle your deck.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": async function (unit){ if(duringTheBattleThisUnitAttacked(unit)){return true} return false},
  "on": async function (unit){increasePower(unit , 2000)},
  "off": async function (unit){increasePower(unit, -2000)},
  "isOn": false,
  "text": "[CONT](VC/RC):During the battle this unit attacked, this unit gets [Power]+2000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Blaze Maiden, Rino": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUponBy(unit, 'Blaze Maiden, Reiyu')){return true} return false},
  "cost": null,
  "effect": {
    "call": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "name",
          "propertyToFind": "Trickstar",
          "condition": "="
        }
      ]
    },
    "effect": async function (unit){
        await callFromDeck(1, this.call.filter)
    }
  },
  "text": "[AUTO]:When this unit is rode upon by \"Blaze Maiden, Reiyu\", search your deck for up to one \"Trickstar\", call it to (RC), and shuffle your deck.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": async function (unit){ if(duringTheBattleThisUnitAttacked(unit)){return true} return false},
  "on": async function (unit){increasePower(unit , 2000)},
  "off": async function (unit){increasePower(unit, -2000)},
  "isOn": false,
  "text": "[CONT](VC/RC):During the battle this unit attacked, this unit gets [Power]+2000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Sunrise Egg": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount)}
  },
  "text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Fire Slash Dragon, Inferno Sword": {
"ability1": {
  "condition": async function (unit){ if(duringTheBattleThisUnitAttacked(unit) && onRC(unit)){return true} return false},
  "on": async function (unit){increasePower(unit , 2000)},
  "off": async function (unit){increasePower(unit, -2000)},
  "isOn": false,
  "text": "[CONT](RC):During the battle this unit attacked, this unit gets [Power]+2000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Vairina": {
"ability2": {
  "condition": async function (unit){ if(onRC(unit) && ifOverDress(unit) && whenThisUnitAttacksAVanguard(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      increasePowerEndBattle(unit ,10000)
      await resolveNewAbility(unit , {
        soul:{
          amount:2,
          costEffect:async function (){await soulBlast(this.soul.amount)}
        }
      } ,  {effect:async function (){await retireOpponentRearguards(1)} } ) 
    }
  },
  "text": "[AUTO](RC):When this unit in the [overDress] state attacks a vanguard, this unit gets [Power]+10000 until end of that battle. Then, COST [Soul Blast (2)], choose one of your opponent's rear-guards, and retire it.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},

"Escort Stealth Dragon, Hayashi Kaze": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false},
  "on": async function (unit){},
  "off": async function (unit){},
  "isOn": false,
  "text": "[CONT]:Sentinel (You may only have up to four cards with \"[CONT]:Sentinel\" in a deck.)",
  "type": "CONT",
  "permanent": true,
  "cost": null
},
"ability2": {
  "condition": function (unit){ if(whenPutOnGC(unit)){return true} return false},
  "cost": {
    "hand": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){discard(this.hand.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){    await perfectGuard()
      
      }
  },
  "text": "[AUTO]:When this unit is put on (GC), COST [discard a card from your hand], choose one of your units, and it cannot be hit until end of that battle.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Trickstar": {
"ability1": {
  "condition": async function (unit){ if(onRC(unit)){return true} return false},
  "on": async function (unit){unit['canBeChosen'] = false},
  "off": async function (unit){unit['canBeChosen'] = true},
  "isOn": false,
  "text": "[CONT](RC):This unit cannot be chosen by your opponent's card effects.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},

"Apex Ruler, Bastion": {
"ability1": {
  "condition": async function (unit){ if(onVC(unit) && duringYourTurn()){return true} return false},
  "on": async function (unit){allOfYourUnits(
    unit.id , [
      {
        "cardProperty": "grade",
        "propertyToFind": 3,
        "condition": "="
      }
    ],
    (unit)=>{increasePower(unit , 2000)},
    (unit)=>{increasePower(unit , -2000)}
  )},
  "off": async function (unit){removeAllOfYourUnits(unit.id)},
  "isOn": false,
  "text": "[CONT](VC):During your turn, all of your grade 3 units get [Power]+2000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
},
"ability2": {
  "condition": async function (unit){ 
    if(onVC(unit)  ){
  let check =  await endOfBattleYourDriveCheckRevealed([
    {
      "cardProperty": "grade",
      "propertyToFind": 3,
      "condition": "="
    }
  ])
  if(check === true) {
    return true
  } 
  
  } return false  },
  "cost": {
    "hand": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await discard(this.hand.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){await chooseUnits(1, [
      {
        "cardProperty": "place",
        "propertyToFind": "RC",
        "condition": "="
      }
    ], (unit)=>{
      standThisUnit(unit)
      increasePowerEndTurn(unit, 10000)
    })}
  },
  "text": "[AUTO](VC)1/Turn:At the end of the battle that your drive check revealed a grade 3, COST [discard a card from your hand], choose one of your rear-guards, [Stand] it, and it gets [Power]+10000 until end of turn.",
  "type": "AUTO",
  "1/Turn": true,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Knight of Heavenly Spear, Rooks": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUponBy(unit , 'Apex Ruler, Bastion')){return true} return false},
  "cost": {
    "hand": {
      "amount": 3,
      "filter": [
        {
          "cardProperty": "grade",
          "propertyToFind": 3,
          "condition": "="
        }
      ]
    },
    "costEffect": async function (unit){await reveal(this.hand.amount, userZones.hand, this.hand.filter)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount)}
  },
  "text": "[AUTO]:When this unit is rode upon by \"Apex Ruler, Bastion\", COST [reveal three grade 3 cards from your hand], and draw a card.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": async function (unit){ if(onRC(unit) && duringYourTurn() && await ifYouHave3OrMoreGrade3() ){return true} return false},
  "on": async function (unit){getsBoost(unit); increasePower(unit ,5000)},
  "off": async function (unit){removeBoost(unit); increasePower(unit ,-5000)},
  "isOn": false,
  "text": "[CONT](RC):During your turn, if you have three or more grade 3 units, this unit gets \"Boost\", and [Power]+5000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Knight of Heavenly Sword, Fort": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUponBy(unit, "Knight of Heavenly Spear, Rooks")){return true} return false},
  "cost": {
    "hand": {
      "amount": 2,
      "filter": [
        {
          "cardProperty": "grade",
          "propertyToFind": 3,
          "condition": "="
        }
      ]
    },
    "costEffect": async function (unit){await reveal(this.hand.amount , userZones.hand, this.hand.filter)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      let topCard = newDeck.MainDeck.splice(0,1)
      await reveal(1 , topCard )
      if(topCard[0].cardtype.includes('Unit')){
        await superiorCall(topCard , undefined ,1 , 'userCircles' , true)
      }
      else{
        addToZone(topCard, userZones.drop, topCard)
      }
    }
  },
  "text": "[AUTO]:When this unit is rode upon by \"Knight of Heavenly Spear, Rooks\", COST [reveal two grade 3 cards from your hand], reveal the top card of your deck, call it to (RC) if it is a unit card, and put it into your drop if it isn't.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": async function (unit){if(onRC(unit)){return true} return false },
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
     "costEffect": async function (unit){await counterBlast(this.counterBlast.amount) }
  },
  "effect": {
    "choose": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "grade",
          "propertyToFind": 3,
          "condition": "="
        },
        {
          "cardProperty": "place",
          "propertyToFind": 'VC',
          "condition": "="
        }
      ]
    },
    "effect": async function (unit){await chooseUnits(1 ,this.choose.filter, (unit)=>{increasePowerEndTurn(unit,  5000)})}
  },
  "text": "[ACT](RC)1/Turn:COST [Counter Blast (1)], choose one of your grade 3 vanguards, and it gets [Power]+5000 until end of turn.",
  "1/Turn": true,
  "Used1/Turn": false,
  "H1/Turn": false,
  "type": "ACT",
  "permanent": true,
  "costPaid": false
}
},
"Knight of Heavenly Bows, Base": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount)}
  },
  "text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Vehement Witch, Ramana": {
"ability1": {
  "condition": async function (unit){ if(onRC(unit) && whenThisUnitAttacks(unit)){return true} return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount) }
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){increasePowerEndBattle(unit ,5000)}
  },
  "text": "[AUTO](RC):When this unit attacks, COST [Counter Blast (1)], and this unit gets [Power]+5000 until end of that battle.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Knight of Broadaxe, Rafluke": {
"ability1": {
  "condition": async function (unit){if(onRC(unit)){return true} return false },
  "cost": {
    "thisUnit": {
      "amount": 1,
      "filter": basicPropertyArray
    },
     "costEffect": async function (unit){await soulThisUnit(unit) }
  },
  "effect": {
    "choose": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "grade",
          "propertyToFind": 3,
          "condition": "="
        }, 
        {
          "cardProperty": "place",
          "propertyToFind": 'RC',
          "condition": "="
        }

      ]
    },
    "effect": async function (unit){
      await chooseUnits(1, this.choose.filter , (unit)=>{increasePowerEndTurn(unit ,10000)})
    }
  },
  "text": "[ACT](RC):COST [Put this unit into your soul], choose one of your grade 3 rear-guards, and it gets [Power]+10000 until end of turn.",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "type": "ACT",
  "permanent": true,
  "costPaid": false
}
},
"Platinum Wolf": {
"ability1": {
  "condition": async function (unit){if(onRC(unit)){return true} return false },
  "cost": {
    "soul": {
      "amount": 2,
      "filter": basicPropertyArray
    },
     "costEffect": async function (unit){await soulBlast(this.soul.amount) }
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){increasePowerEndTurn(unit ,5000)}
  },
  "text": "[ACT](RC):COST [Soul Blast (2)], and this unit gets [Power]+5000 until end of turn.",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "type": "ACT",
  "permanent": true,
  "costPaid": false
}
},
"Lifesaving Angel, Kurabiel": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false},
  "on": async function (unit){},
  "off": async function (unit){},
  "isOn": false,
  "text": "[CONT]:Sentinel (You may only have up to four cards with \"[CONT]:Sentinel\" in a deck.)",
  "type": "CONT",
  "permanent": true,
  "cost": null
},
"ability2": {
  "condition": function (unit){ if(whenPutOnGC(unit)){return true} return false},
  "cost": {
    "hand": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){discard(this.hand.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){          await perfectGuard()
      
      }
  },
  "text": "[AUTO]:When this unit is put on (GC), COST [discard a card from your hand], choose one of your units, and it cannot be hit until end of that battle.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Sylvan Horned Beast King, Magnolia": {
"ability1": {
  "condition": async function (unit){ if(onVC(unit) && endOfBattleThisUnitAttacked(unit)){return true} return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "chooseUnits": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "place",
          "propertyToFind": "RC",
          "condition": "="
        }
      ]
    },
    "effect": async function (unit){
      if(personaRodeThisTurn()){
        this.chooseUnits.amount = 3
      }
      await chooseUnits(this.chooseUnits.amount, this.chooseUnits.filter, (unit)=>{canAttackFromBackrowEndTurn(unit); increasePower(unit, 5000)})
    }
  },
  "text": "[AUTO](VC):At the end of the battle this unit attacked, COST [Counter Blast (1)], choose one of your rear-guards, and until end of turn, that unit can attack from the back row, and gets [Power]+5000. If you persona rode this turn, choose three rear-guards instead of one.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Sylvan Horned Beast, Lattice": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUponBy(unit, "Sylvan Horned Beast King, Magnolia")){return true} return false},
  "cost": {
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      let zone = await lookTopX(1)
      if(zone[0].cardtype.includes('Unit')){
        await superiorCall(zone)
      }
      else{
        addToZone(zone, userZones.soul, zone)
      }
    }
  },
  "text": "[AUTO]:When this unit is rode upon by \"Sylvan Horned Beast King, Magnolia\", COST [Soul Blast (1)], reveal the top card of your deck, if it is a unit card, call it to (RC), and if it isn't, put it into your hand.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": async function (unit){ if(onBackRowRC(unit) && whenThisUnitAttacksAVanguard(unit)){return true} return false},
  "cost": {
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){increasePowerEndBattle(unit ,10000)}
  },
  "text": "[AUTO](Back Row RC):When this unit attacks a vanguard, COST [Soul Blast (1)], and this unit gets [Power]+10000 until end of that battle.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Sylvan Horned Beast, Charis": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUponBy(unit,'Sylvan Horned Beast, Lattice')){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      let zone = await lookTopX(1)
      if(zone[0].grade <=2){
        await superiorCall(zone)
      }
      else{
        addToZone(zone, userZones.soul, zone)
      }
    }
  },
  "text": "[AUTO]:When this unit is rode upon by \"Sylvan Horned Beast, Lattice\", you may reveal the top card of your deck. If it is a grade 2 or less unit card, call it to (RC), and if it isn't, put it into your soul.",
  "type": "AUTO", 
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": async function (unit){ if(onBackRowRC(unit) &&duringTheBattleThisUnitAttacked(unit)){return true} return false},
  "on": async function (unit){increasePower(unit ,5000)},
  "off": async function (unit){increasePower(unit ,-5000)},
  "isOn": false,
  "text": "[CONT](Back Row RC):During the battle this unit attacked, this unit gets [Power]+5000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Sylvan Horned Beast, Lotte": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount)}
  },
  "text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},

"Sylvan Horned Beast, Dooger": {
"ability1": {
  "condition": async function (unit){ if(onRC(unit) && await rearguardAmountCheck(5)){return true} return false},
  "on": async function (unit){increasePower(unit ,5000)},
  "off": async function (unit){increasePower(unit ,-5000)},
  "isOn": false,
  "text": "[CONT](RC):If you have four or more other rear-guards, this unit gets [Power]+5000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Looting Petal Stomalia": {
"ability1": {
  "condition": async function (unit){if(onRC(unit)){return true} return false },
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
     "costEffect": async function (unit){await counterBlast(this.counterBlast.amount); await soulBlast(this.soul.amount)}
  },
  
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){increasePowerEndTurn(unit, 5000); getsBoostEndTurn(unit)}
  },
  "text": "[ACT](RC)1/Turn:COST [Counter Blast (1) & Soul Blast (1)], and until end of turn, this unit gets \"Boost\" and [Power]+5000.",
  "1/Turn": true,
  "Used1/Turn": false,
  "H1/Turn": false,
  "type": "ACT",
  "permanent": true,
  "costPaid": false
}
},
"Knight of Friendship, Cyrus": {
"ability1": {
  "condition": async function (unit){if(onRC(unit)){return true} return false },
  "cost": {
    "soul": {
      "amount": 2,
      "filter": basicPropertyArray
    },
     "costEffect": async function (unit){await soulBlast(this.soul.amount) }
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      let topCard = newDeck.MainDeck.splice(0,1)
     await  reveal(1 , topCard )
      if(topCard[0].cardtype.includes('Unit')){
        await superiorCall(topCard , undefined ,1 , 'userCircles' , true)
      }
      else{
        addToZone(topCard, userZones.hand, topCard)
      }
    }
  },
  "text": "[ACT](RC)1/Turn:COST [Soul Blast (2)], reveal the top card of your deck, if it is a unit card, call it to (RC), and if it isn't, put it into your hand.",
  "1/Turn": true,
  "Used1/Turn": false,
  "H1/Turn": false,
  "type": "ACT",
  "permanent": true,
  "costPaid": false
}
},
"Hopeful Maiden, Alejandra": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false},
  "on": async function (unit){},
  "off": async function (unit){},
  "isOn": false,
  "text": "[CONT]:Sentinel (You may only have up to four cards with \"[CONT]:Sentinel\" in a deck.)",
  "type": "CONT",
  "permanent": true,
  "cost": null
},
"ability2": {
  "condition": function (unit){ if(whenPutOnGC(unit)){return true} return false},
  "cost": {
    "hand": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){discard(this.hand.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){ await perfectGuard()
      
      }
  },
  "text": "[AUTO]:When this unit is put on (GC), COST [discard a card from your hand], choose one of your units, and it cannot be hit until end of that battle.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},

"Aurora Battle Princess, Seraph Snow": {
"ability1": {
  "condition": async function (unit){ if(onVC(unit) && duringYourTurn() ){return true} return false},
  "on": async function (unit){
    makeConditionalContinuous(this.abilityId, unit, async () => await opponentImprisonedAmount() > 0 , ()=>increasePower(unit ,10000) , ()=>increasePower(unit ,-10000))
    makeConditionalContinuous(this.abilityId + 1,unit, async () =>await opponentImprisonedAmount() > 2 , ()=>increaseDrive(unit ,1) , ()=>increaseDrive(unit ,-1))
    
  },
  "off": async function (unit){
    removeConditionalContinuous(this.abilityId)
    removeConditionalContinuous(this.abilityId + 1)
  },
  "isOn": false,
  "text": "[CONT](VC):During your turn, if one or more of your opponent's cards are imprisoned in your Prison, this unit gets [Power]+10000, and if three or more cards are imprisoned, this unit gets drive +1.",
  "type": "CONT",
  "permanent": true,
  "cost": null
},
"ability2": {
  "condition": async function (unit){if(onVCRC(unit)){return true} return false },
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
     "costEffect": async function (unit){
      await counterBlast(this.counterBlast.amount)
       }
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){

      await imprisonOpponentRearguards(2)
    }
  },
  "text": "[ACT](VC/RC)1/Turn:COST [Counter Blast (1)], choose two of your opponent's rear-guards, and imprison them in your Prison. (Put them into your Order Zone that has a Prison)",
  "1/Turn": true,
  "Used1/Turn": false,
  "H1/Turn": false,
  "type": "ACT",
  "permanent": true,
  "costPaid": false
}
},
"Aurora Battle Princess, Risatt Pink": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedOnVC(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){await makeOpponent(unit)}
  },
  "text": "[AUTO]:When this unit is placed on (VC), your opponent chooses a card from their hand, and imprisons it in your Prison. (Put it into your Order Zone that has a Prison)",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": async function (unit){ if(onRC(unit)&&   opponentImprisonedAmount() > 1){return true} return false},
  "on": async function (unit){increasePower(unit ,2000)},
  "off": async function (unit){increasePower(unit, -2000)}, 
  "isOn": false,
  "text": "[CONT](RC):If one or more of your opponent's cards are imprisoned in your Prison, this unit gets [Power]+2000.",
  "type": "CONT",
  "permanent": true,
  "cost": null
}
},
"Aurora Battle Princess, Kyanite Blue": {
"ability1": {
  "condition": async function (unit){ if(whenPlacedOnVC(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "cardtype",
          "propertyToFind": "Prison",
          "condition": "includes"
        }
      ]
    },
    "effect": async function (unit){
      await deckToHand(this.draw.amount , this.draw.filter)}
  },
  "text": "[AUTO]:When this unit is placed on (VC), search your deck for up to one Prison card, reveal it and put it into your hand, and shuffle your deck.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
},
"ability2": {
  "condition": async function (unit){ if(whenPlacedOnRC(unit) &&   opponentImprisonedAmount() > 1){return true} return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
     "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await soulBlast(this.soul.amount) }
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount)}
  },
  "text": "[AUTO]:When this unit is placed on (RC), if one or more of your opponent's cards are imprisoned in your Prison, COST [Counter Blast (1) & Soul Blast (1)], and draw a card.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Aurora Battle Princess, Ruby Red": {
"ability1": {
  "condition": async function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw(this.draw.amount)}
  },
  "text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
  "type": "AUTO",
  "1/Turn": false,
  "Used1/Turn": false,
  "H1/Turn": false,
  "permanent": true
}
},
"Alert Guard Gunner": {
"ability1": {
"condition": async function (unit){ if(onRC(unit) && whenThisUnitsAttackHitsAVanguard(unit)){return true} return false},
"cost": null,
"effect": { 
  "draw": {
    "amount": 2,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await imprisonOpponentRearguards(this.draw.amount)}
},
"text": "[AUTO](RC):When this unit's attack hits a vanguard, choose up to two of your opponent's rear-guards, and imprison them in your Prison. (Put them into your Order Zone that has a Prison)",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Security Patroller": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
"cost": {
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await imprisonOpponentRearguards(1)}
},
"text": "[AUTO]:When this unit is placed on (RC), COST [Soul Blast (1)], choose one of your opponent's rear-guards, and imprison it in your Prison. (Put it into your Order Zone that has a Prison)",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Autonomic Caution": {
"ability1": {
"condition": async function (unit){ if(onRCGC(unit) && await opponentImprisonedAmount() > 1){return true} return false},
"on": async function (unit){increasePower(unit , 2000) ; increaseShield(unit , 5000)},
"off": async function (unit){increasePower(unit , -2000) ; increaseShield(unit , -5000)},
"isOn": false,
"text": "[CONT](RC/GC):If one or more of your opponent's cards is imprisoned in your Prison, this unit gets [Power]+2000/[Shield]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Craggy Monster, Girgrand": {
"ability1": {
"condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false},
"on": async function (unit){},
"off": async function (unit){},
"isOn": false,
"text": "[CONT]:Sentinel (You may only have up to four cards with \"[CONT]:Sentinel\" in a deck.)",
"type": "CONT",
"permanent": true,
"cost": null
},
"ability2": {
"condition": async function (unit){ if(whenPutOnGC(unit)){return true} return false},
"cost": {
  "hand": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await discard(this.hand.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){ await perfectGuard()}
},
"text": "[AUTO]:When this unit is put on (GC), COST [discard a card from your hand], choose one of your units, and it cannot be hit until end of that battle.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Galaxy Central Prison, Galactolus": {
"ability3": {
"condition": async function (unit){ if(whenThisCardIsPutIntoOrderZone(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){soulCharge(3)}
},
"text": "[AUTO]:When this card is put into the Order Zone, Soul Charge (3).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability4": {
"condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false},
"on": async function (unit){},
"off": async function (unit){},
"isOn": false,
"text": "[CONT](Order Zone):When your opponent can normal call a rear-guard, they can perform the following:",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Sealed Blaze Maiden, Bavsargra": {
"ability1": {
"condition": async function (unit){ if(onVC(unit) && whenThisUnitIsArmed(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){soulCharge(1) ; await callFromDrop(1 , grade1OrLess())}
},
"text": "[AUTO](VC)1/Turn:When this unit is Armed, Soul Charge (1), choose a grade 1 or less card from your drop, and call it to (RC).",
"type": "AUTO",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){if(onVC (unit) && ifThisUnitIsArmed2OrMore(unit)){return true} return false },
"cost": {
  "soul": {
    "amount": 2,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await soulBlast(this.soul.amount) }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){retireAllOpponentsRearguards(frontrowRearguards()) ; increaseCritEndTurn(unit , 1)}
},
"text": "[ACT](VC)1/Turn:If this unit is Armed with two or more cards, COST [Soul Blast (2)], retire all of your opponent's front row rear-guards, and this unit gets [Critical]+1 until end of turn.",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Sealed Blaze Dragon, Halibadra": {
"ability1": {
"condition": async function (unit){ if(whenRidingFrom(unit, 'Sealed Blaze Dragon, Namorkahr')){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await dropToHand(this.draw.amount , arms())}
},
"text": "[AUTO]:When this unit is placed on (VC) by riding from \"Sealed Blaze Dragon, Namorkahr\", choose an Arms card from your drop, and put it into your hand.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit) && ifYourVanguardIsArmed()){return true} return false}, 
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increasePowerEndBattle(unit , 5000)}
},
"text": "[AUTO](RC):When this unit attacks, if your vanguard is Armed, this unit gets [Power]+5000 until end of that battle.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Sealed Blaze Dragon, Namorkahr": {
"ability1": {
"condition": async function (unit){ if(whenRidingFrom(unit, 'Sealed Blaze Dragon, Arhinsa')){return true} return false},
"cost": {
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    await deckToHand(1, nameXOrY(
       '\"Sealed Blaze Sword, Prithivih\"' ,  '\"Sealed Blaze Shield, Swayanbuh\"' 
    ) 
  
  )
  }
},
"text": "[AUTO]:When this unit is placed on (VC) by riding from \"Sealed Blaze Dragon, Arhinsa\", COST [Soul Blast (1)], search your deck for up to one \"Sealed Blaze Sword, Prithivih\" or \"Sealed Blaze Shield, Swayanbuh\", reveal it and put it into your hand, and shuffle your deck.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if(onRC(unit) && whenThisUnitAttacks(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increasePowerEndBattle(unit ,2000)}
},
"text": "[AUTO](RC):When this unit attacks, this unit gets [Power]+2000 until end of that battle.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Sealed Blaze Dragon, Arhinsa": {
"ability1": {
"condition": async function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)}
},
"text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Sealed Blaze Dragon, Ulsalra": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
"cost": {
  "counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await dropToHand(1, arms())}
},
"text": "[AUTO]:When this unit is placed on (RC), COST [Counter Blast (1)], choose an Arms card from your drop, and put it into your hand.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Sealed Blaze Dragon, Shirunga": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitBoosts(unit)){return true} return false},
"cost": {
  "hand": {
    "amount": 1,
    "filter": [
      {
        "cardProperty": "cardtype",
        "propertyToFind": "Arms",
        "condition": "includes"
      }
    ]
  },
  "costEffect": async function (unit){await discard(this.hand.amount , this.hand.filter)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)}
},
"text": "[AUTO](RC):When this unit boosts, COST [discard an Arms card from your hand], and draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Sealed Blaze Sword, Prithivih": {
"ability3": {
"condition": async function (unit){ if(onVC(unit) && whenUnitArmedWithThisCardAttacks(unit)){return true} return false},
"cost":null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    let armedUnit = theUnitArmedWithThisCard(unit)
    increasePowerEndBattle(armedUnit , 10000)
    untilEndBattle(async ()=>{
      await resolveNewAbility(unit , null , ()=>{})
    } , unit)
  } // come back
},
"text": "[AUTO](VC):When the unit Armed with this card attacks, that Armed unit gets [Power]+10000 until end of that battle. At the end of that battle, if your opponent's damage zone has four or less cards, COST [Counter Blast (2) & put this card into your drop], choose one of your opponent's vanguards, and deal one damage.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Sealed Blaze Shield, Swayanbuh": {
"ability3": {
"condition": async function (unit){ if(  onVC(unit) && whenUnitArmedWithThisCardIsAttacked(unit) ){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increasePowerEndBattle(theUnitArmedWithThisCard(unit), 10000)}
},
"text": "[AUTO](VC)1/Turn:When the unit Armed with this card is attacked, that Armed unit gets [Power]+10000 until end of that battle.",
"type": "AUTO",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Kashuu Kiyomitsu Kiwame": {
"ability1": {
"condition": async function (unit){ if(onVC(unit) && duringYourTurn() && await ifDamageZoneHasNoFaceup()){return true} return false},
"on": async function (unit){increasePower(unit , 10000)},
"off": async function (unit){increasePower(unit , -10000)},
"isOn": false,
"text": "[CONT](VC):During your turn, if you have no face up cards in your damage zone, this unit gets [Power]+10000.",
"type": "CONT",
"permanent": true,
"cost": null
},
"ability2": {
"condition": async function (unit){if(onVC(unit)){return true} return false },
"cost": {
  "counterBlast": {
    "amount": 1,
    "filter": [
      {
        "cardProperty": "clan",
        "propertyToFind": "",
        "condition": "="
      }
    ]
  },
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await soulBlast(this.soul.amount) }

},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    
    await lookTopPutTopOrBottom(1)
    draw()
  }
},
"text": "[ACT](VC)1/Turn:COST [Counter Blast (1) & Soul Blast (1)], look at the top card of your deck, put it on the top or bottom of your deck, and draw a card.",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Kashuu Kiyomitsu Toku": {
"ability1": {
"condition": async function (unit){ if(whenRodeUponBy(unit , 'Kashuu Kiyomitsu Kiwame')){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await deckToHand(1 , name('Yamatonokami Yasusada'))}
},
"text": "[AUTO]:When this unit is rode upon by \"Kashuu Kiyomitsu Kiwame\", search your deck for up to one \"Yamatonokami Yasusada\", reveal it and put it to your hand, and shuffle your deck.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if(onRC(unit)){return true} return false},
"on": async function (unit){increasePower(unit , 2000)},
"off": async function (unit){increasePower(unit , -2000)},
"isOn": false,
"text": "[CONT](RC):During your turn, this unit gets [Power]+2000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Kashuu Kiyomitsu Sentou": {
"ability1": {
"condition": async function (unit){ if(whenRodeUponBy(unit , 'Kashuu Kiyomitsu Toku')){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
   let card =  await lookTopX(1)
   let selected = await clickAbilityZone(card, 1)
   await putTopDeck(selected.selected)
   await putSoul(selected.notSelected)
  }
},
"text": "[AUTO]:When this unit is rode upon by \"Kashuu Kiyomitsu Toku\", look at the top card of your deck, and put it on the top of your deck or into your soul.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if(onRC(unit) && duringYourTurn()){return true} return false},
"on": async function (unit){increasePower(unit , 2000)},
"off": async function (unit){increasePower(unit , -2000)},
"isOn": false,
"text": "[CONT](RC):During your turn, this unit gets [Power]+2000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Kashuu Kiyomitsu": {
"ability1": {
"condition": async function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)}
},
"text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Ishikirimaru": {
"ability1": {
"condition": async function (unit){ if(onRC(unit) && await ifDamageZoneHasNoFaceup()){return true} return false},
"on": async function (unit){increasePower(unit , 5000)},
"off": async function (unit){increasePower(unit , -5000)},
"isOn": false,
"text": "[CONT](RC):During your turn, if you have no face up cards in your damage zone, this unit gets [Power]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Yamatonokami Yasusada": {
"ability1": {
"condition": async function (unit){if(onRC(unit)){return true} return false },
"cost": {
  "discard": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount) }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    let power = 5000
    if(ifYourVanguardIs('Kashuu Kiyomitsu Kiwame')){
      power = 10000
    }
  increasePowerEndTurn(unit ,power)
  }
},
"text": "[ACT](RC):COST [Counter Blast (1)], and this unit gets [Power]+5000 until end of turn. If your vanguard is \"Kashuu Kiyomitsu Kiwame\", get [Power]+10000 instead of +5000.",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Heshikiri Hasebe": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await rearrangeTopX(2)} 
},
"text": "[AUTO]:When this unit is placed on (RC), look at two cards from the top of your deck, and put them on the top of your deck in any order.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Imanotsurugi": {
"ability1": {
"condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false},
"on": async function (unit){},
"off": async function (unit){},
"isOn": false,
"text": "[CONT]:Sentinel (You may only have up to four cards with \"[CONT]:Sentinel\" in a deck.)",
"type": "CONT",
"permanent": true,
"cost": null
},
"ability2": {
"condition": async function (unit){ if(whenPutOnGC(unit)){return true} return false},
"cost": {
  "hand": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await discard(this.hand.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    await chooseUnits(1, undefined , (card)=>{
      
    })
  }
},
"text": "[AUTO]:When this unit is put on (GC), COST [discard a card from your hand], choose one of your units, and it cannot be hit until end of that battle.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Fudou Yukimitsu": {
"ability1": {
"condition": async function (unit){if(onRC(unit)){return true} return false },
"cost": {
  "discard": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount) }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    
    let putTop = await topOrBottom(1)
    if(putTop === false){
      increasePowerEndTurn(unit, 2000)
    }
  }
},
"text": "[ACT](RC)1/Turn:COST [Counter Blast (1)], look at the top card of your deck, and put it on the top or bottom of your deck. If you put it on the bottom of your deck, this unit gets [Power]+2000 until end of turn.",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},

"Bandmaster of Blossoming Bonds, Lianorn": {
"ability1": {
"condition": async function (unit){ if(whenWouldBeRodeUpon(unit)){return true} return false},
"on": async function (unit){unit.name = 'Grand March of Full Bloom, Lianorn'},
"off": async function (unit){unit.name = 'Bandmaster of Blossoming Bonds, Lianorn'},
"isOn": false,
"text": "[CONT]:When this card would be rode upon, it is also regarded as \"Grand March of Full Bloom, Lianorn\".",
"type": "CONT",
"permanent": true,
"cost": null
},
"ability2": {
"condition": async function (unit){ if(whenThisUnitAttacksOnVC(unit)){return true} return false},
"cost": {
  "soul": {
    "amount": 1, 
    "filter": basicPropertyArray
  },
  "hand": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount); await discard(this.hand.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    let boostCount = 0

     
    await doAllUnits(newPropertyArray([backrowRearguards() , standUnits() , hasBoost()]) , (card)=>{
      boostCount++
      boostUnit(card , unit)

    })
    if(boostCount >= 3){
      increaseDriveEndBattle(unit , 1)
      untilEndBattle(async ()=>{
        await chooseUnits(2 , backrowRearguards(), (card)=>{stand(card)})
      } , unit)
    }

  }
},
"text": "[AUTO](VC):When this unit attacks, COST [Soul Blast (1) & discard a card from hand], and boost this unit with all of your back row [Stand] units with \"Boost\". If you boosted this unit with three or more units, this unit gets drive +1 until end of that battle, and at the end of that battle, choose two of your back row rear-guards, and [Stand] them.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability3": {
"condition": async function (unit){ if(duringTheBattleThisUnitBoosted(unit)){return true} return false},
"on": async function (unit){increasePower(unit, 2000)},
"off": async function (unit){increasePower(unit, -2000)},
"isOn": false,
"text": "[CONT](RC):During the battle this unit is boosted, this unit gets [Power]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Brilliant Tune, Rektina": {
"ability1": {
"condition": async function (unit){ if(whenRodeUponByIncludes(unit , 'Lianorn')){return true} return false},
"cost": {
  "soul": {
    "amount": 1, 
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await callFromDrop(1, grade1OrLess())}
},
"text": "[AUTO]:When this unit is rode upon by a unit with \"Lianorn\" in its card name, COST [Soul Blast (1)], choose a grade 1 or less card from your drop, and call it to (RC).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if(onRC(unit) )
  { let zone = await searchCircles(backrowRearguards())
    if(zone.length > 2)
    return true} return false},
"on": async function (unit){giveBoost(unit)},
"off": async function (unit){removeBoost(unit)},
"isOn": false,
"text": "[CONT](RC):If your back row has three or more rear-guards, this unit gets \"Boost\".",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Budding of Pleasant Sounds, Gracia": {
"ability1": {
"condition": async function (unit){ if(whenRodeUponBy(unit , 'Brilliant Tune, Rektina')){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await youMay(1, async ()=>{
    await callThisCard(unit)
  })}
},
"text": "[AUTO]:When this unit is rode upon by \"Brilliant Tune, Rektina\", you may call this card to (RC).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if(duringTheBattleThisUnitBoosted(unit) && currentBattle.current.attackingUnit.circle === 'VC'){return true} return false},
"on": async function (unit){increasePower(unit , 5000)},
"off": async function (unit){increasePower(unit , -5000)},
"isOn": false,
"text": "[CONT](RC): During the battle this unit boosted a vanguard, this unit gets [Power]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Announcing Wind of Spring, Corphie": {
"ability1": {
"condition": async function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)}
},
"text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Groovy Dragon": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitAttacksAVanguard(unit) && onRC(unit)){
  let zone = await searchCircles(backrowRearguards())
    if(zone.length > 2)
  return true} return false},
"cost": {
"counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increasePowerEndBattle(unit , 10000)}
},
"text": "[AUTO](RC):When this unit attacks a vanguard, if your back row has three or more rear-guards, COST [Counter Blast (1)], and this unit gets [Power]+10000 until end of that battle.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Upbeat Dragon": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitIntercepts(unit)){
 
  let zone = await searchCircles(newPropertyArray([backrowRearguards() , grade1OrLess()]))
  if(zone.length > 0)
  return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increaseShieldEndBattle(unit , 10000)}
},
"text": "[AUTO]:When this unit intercepts, if your back row has two or more grade 1 or less rear-guards, this unit gets [Shield]+10000 until end of that battle.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Yield Elf": {
"ability1": {
"condition": async function (unit){if(onRC(unit) && ifYourVanguardIsGrade3orGreater()){return true} return false },
"cost": {
"counterBlast": {
      "amount": 2,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)}
},
"text": "[ACT](RC)1/Turn:If your vanguard is grade 3 or greater, COST [Counter Blast (2)], and draw a card.",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Lively Rhythm, Biara": {
"ability1": {
"condition": async function (unit){ if(whenTheAttackThisUnitBoostedHitsAVanguard(unit)){return true} return false},
"cost": {

  "hand": {
    "amount": 1,
    "filter": grade2OrLess()
  },
  "costEffect": async function (unit){await handToSoul(this.hand.amount , grade2OrLess() )}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)}
},
"text": "[AUTO](RC):When the attack this unit boosted hits a vanguard, COST [put a grade 2 or less card from hand into soul], and draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Knight of Pure, Theadore": {
"ability1": {
"condition": async function (unit){ if(ifThisCardIsDiscarded(unit) &&  playerObjects.current.phase === 'ride'){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await youMay(1, async ()=>{
    await callThisCard(unit)
  })}
},
"text": "[AUTO]:When this card is discarded from hand during your ride phase, you may call this card to (RC).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Clapping Dragon": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRCFrom(unit , 'hand') && onFrontRowRC(unit)){
  let zone = await searchCircles(backrowRearguards() )
  if(zone.length > 2) return true} return false},
"cost": {
"counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)

    if(ifYourOpponentsVanguardIsGrade3orGreater())
    {
      increasePowerEndTurn(unit , 10000)
    }

  }
},
"text": "[AUTO]:When this unit is placed on a front row (RC) from hand, if your back row has three or more units, COST [Counter Blast (1)], draw a card, and if your opponent's vanguard is grade 3 or greater, this unit gets [Power]+10000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Jewel-embracing Dragon Fang, Drajeweled": {
"ability1": {
"condition": async function (unit){ if(whenWouldBeRodeUpon(unit)){return true} return false},
"on": async function (unit){unit.name = 'Demonic Jewel Dragon, Drajeweled'},  
"off": async function (unit){unit.name = 'Jewel-embracing Dragon Fang, Drajeweled'},
"isOn": false,
"text": "[CONT]:When this card would be rode upon, it is also regarded as \"Demonic Jewel Dragon, Drajeweled\".",
"type": "CONT",
"permanent": true,
"cost": null
},
"ability2": {
"condition": async function (unit){ if(whenThisUnitAttacksOnVC(unit)){return true} return false},
"cost": {
  "soulDifferentGrade": {
    "amount": 4, 
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlastDifferentGrade(this.soulDifferentGrade.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    let oppVG = currentOpponentCircles.current.opponentVG.unit
    let power = oppVG.tempPower - 1
    await decreaseOpponentUnits(1 , vanguard() , power , 'powerEndTurn')
    if(oppVG.tempGrade >=3){
      increaseCritEndTurn(unit , 1)
    }

  }
},
"text": "[AUTO](VC):When this unit attacks a vanguard, COST [Soul Blast (4) cards with different grades], choose one of your opponent's vanguards, until end of turn, increase or decrease its [Power] to 1, and if your opponent's vanguard is grade 3 or greater, this unit gets [Critical]+1. ([Power] at that time becomes 1, and can increase or decrease afterwards)",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability3": {
"condition": async function (unit){  if( thisTurn.current.soulBlast4OrMoreThisTurn ){return true} return false},
"on": async function (unit){increasePower(unit, 5000)},
"off": async function (unit){increasePower(unit , -5000)},
"isOn": false,
"text": "[CONT](RC):If you Soul Blast (4) or more cards at the same time for the cost of your card's ability this turn, this unit gets [Power]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Demonic Stone Dragon, Jewelneel": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitsAttackHitsAVanguard(unit) && onVCRC(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){soulCharge(1)}
},
"text": "[AUTO](VC/RC):When this unit's attack hits a vanguard, Soul Charge (1).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if(whenRodeUponByIncludes(unit  , 'Drajeweled')){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){//come
    soulCharge(1)
  }
},
"text": "[AUTO]:When this unit is rode upon by a unit with \"Drajeweled\" in its card name, Soul Charge (1), and if your soul has three or more cards with different grades, draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Jewel Core Dragon": {
"ability1": {
"condition": async function (unit){ if(whenRodeUponBy(unit, 'Demonic Stone Dragon, Jewelneel')){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await callThisCard(unit)}
},
"text": "[AUTO]:When this unit is rode upon by \"Demonic Stone Dragon, Jewelneel\", call this card to (RC).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit) || whenThisUnitBoosts(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    increasePowerEndBattle(unit , 5000)
    untilEndBattle(()=>{
      soulThisUnit(unit)
    } , unit)
  }
},
"text": "[AUTO](RC):When this unit attacks or boosts, this unit gets [Power]+5000 until end of that battle. At the end of that battle, put this unit into your soul. (This effect is mandatory)",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Jewelias Dracokid": {
"ability1": {
"condition": async function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)}
},
"text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Truculence Raider": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit) && ifYourVanguardHasXInItsName(unit , 'Drajeweled')){return true} return false},
"cost": {

  "counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    increasePowerEndBattle(unit , 10000)
    untilEndBattle(()=>{
      soulThisUnit(unit)
    } , unit)
  }
},
"text": "[AUTO](RC):When this unit attacks, if you have a vanguard with \"Drajeweled\" in its card name, COST [Counter Blast (1)], and this unit gets [Power]+10000 until end of that battle. At the end of that battle, put this unit into your soul.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Mystic Accordionist": {
"ability1": {
"condition": async function (unit){ if(ifThisCardIsDiscarded(unit) &&  playerObjects.current.phase === 'ride'){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){youMay(1, ()=>{

    soulThisCard(unit)
  })}
},
"text": "[AUTO]:When this card is discarded from hand during your ride phase, you may put this card into your soul.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Avid Heaper": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitBoosts(unit) && currentBattle.current.attackingUnit.tempGrade >=2){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){youMay(1, ()=>{
    soulCharge(1)
  })}
},
"text": "[AUTO](RC):When this unit boosts a grade 2 or greater unit, you may Soul Charge (1).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Direful Doll, Kjerstin": {
"ability1": {
"condition": async function (unit){if(onRC(unit) && ifYourVanguardIsGrade3orGreater()){return true} return false },
"cost": {
  "counterBlast": {
    "amount": 2, 
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)}
},
"text": "[ACT](RC)1/Turn:If your vanguard is grade 3 or greater, COST [Counter Blast (2)], and draw a card.",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"One Who Calls Upon Raging Thunder, Furgres": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit) && ifYourVanguardHasXInItsName(unit , 'Drajeweled')){return true} return false},
"cost": {
  "soul": {
    "amount": 1, 
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await dropToSoul(1) ; increasePowerEndTurn(unit ,2000)}
},
"text": "[AUTO]:When this unit is placed on (RC), if you have a vanguard with \"Drajeweled\" in its card name, COST [Soul Blast (1)], choose a card from your drop, put it into your soul, and this unit gets [Power]+2000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Ultrasound Sirie": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRCFrom(unit , 'hand')){return true} return false},
"cost": {
"counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    await lookTopXAddShuffleRest(userZones.soul, 3, 1)
    if(ifYourSoulHas4OrMoreDifferentGrades()){
      draw()
    }
  }
},
"text": "[AUTO]:When this unit is placed on (RC) from hand, COST [Counter Blast (1)], look at three cards from the top of your deck, choose a card from among them, put it into your soul, shuffle your deck, and if your soul has four or more cards with different grades, draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Friend of the Netherworld, Ling": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    await lookTopXAddBotDeckRestAnyOrder(userZones.soul, 2, 1)
  }
},
"text": "[AUTO]:When this unit is placed on (RC), look at the top two cards of your deck, choose a card from among them, put it into your soul, and put the rest on the bottom of your deck.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Youthberk \"Protofall Arms\"": {
"ability1": {
"condition": async function (unit){ if(whenWouldBeRodeUpon(unit)){return true} return false},
"on": async function (unit){unit.name = 'Youthberk \"Skyfall Arms'},
"off": async function (unit){unit.name  = 'Youthberk \"Protofall Arms'},
"isOn": false,
"text": "[CONT]:When this card would be rode upon, it is also regarded as \"Youthberk \"Skyfall Arms\"\".",
"type": "CONT",
"permanent": true,
"cost": null
},
"ability2": {
"condition": async function (unit){ if(onVC(unit) && endOfBattleThisUnitAttacked(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
await revolDress()
  }
},
"text": "[RevolDress]-[AUTO](VC):At the end of the battle this unit attacked, choose up to one card with \"RevolForm\" in its card name from your hand, ride it as [Stand], and it gets drive -2 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability3": {
"condition": async function (unit){ if(rodeThisTurn() && onRC(unit)){return true} return false},
"on": async function (unit){increasePower(unit, 5000)},
"off": async function (unit){increasePower(unit, -5000)},
"isOn": false,
"text": "[CONT](RC):If your grade 3 or greater vanguard was placed this turn, this unit gets [Power]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Knight of Ardent Light, Youth": {
"ability1": {
"condition": async function (unit){ if(whenRodeUpon(unit) && userCircles.userVG.unit.hasRevolDress){return true} return false},
"cost": {
"counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await dropToHand(1 , grade2OrGreater())}
},
"text": "[AUTO]:When this unit is rode upon by a unit with the [RevolDress] ability, COST [Counter Blast (1)], choose a grade 2 or greater card from your drop, and put it into your hand.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if(whenThisUnitIsBoosted(unit) && onVCRC(unit)){return true} return false},
"cost": {
  "soul": {
    "amount": 1, 
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increasePowerEndBattle(unit ,5000)}
},
"text": "[AUTO](VC/RC):When this unit is boosted, COST [Soul Blast (1)], and this unit gets [Power]+5000 until end of that battle.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Determined to Break Away, Youth": {
"ability1": {
"condition": async function (unit){ if(duringTheBattleThisUnitAttacked(unit) && onVCRC(unit)){return true} return false},
"on": async function (unit){increasePower(unit , 2000)},
"off": async function (unit){increasePower(unit , -2000)},
"isOn": false,
"text": "[CONT](VC/RC):During the battle this unit attacked, this unit gets [Power]+2000.",
"type": "CONT",
"permanent": true,
"cost": null
},
"ability2": {
"condition": async function (unit){ if(whenRodeUponBy(unit, 'Knight of Ardent Light, Youth')){return true} return false},
"cost": {
  "soul": {
    "amount": 1, 
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    let zone = await lookTopX(3)
    await getAbilityZone(zone)
    await chooseOneOfTheFollowing([ 
      {text: 'Add a Youthberk card' , effect: async ()=>{await toHand(zone , 1 , nameIncludesX('Youthberk'))}},
      {text: 'Call a Grade 2 or less' , effect: async ()=>{await superiorCall(zone , grade2OrLess() , 1)}} 
    ])
    putBotDeck(zone)



  }
},
"text": "[AUTO]:When this unit is rode upon by \"Knight of Ardent Light, Youth\", COST [Soul Blast (1)], look at the top three cards of your deck, choose up to one card with \"Youthberk\" in its card name from among them and reveal it and put it into your hand, or choose up to one grade 2 or less unit card from among them and call it to (RC), and put the rest on the bottom of your deck in any order.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Youth Following in Footsteps, Youth": {
"ability1": {
"condition": async function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)}
},
"text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Youthberk \"RevolForm: Zest\"": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnVC(unit) && placedByRevolDress(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
increasePowerEndTurn(unit , 15000)
if(personaRodeThisTurn()){
  increaseCritEndTurn(unit , 1)
}

  }
},
"text": "[AUTO]:When this unit is placed on (VC) by the [RevolDress] ability, until end of turn, this unit gets [Power]+15000, and if you persona rode this turn, it gets [Critical]+1.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if(onVC(unit) && atEndOfTurn()){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
 
    await superiorRide(userZones.soul , [{"cardProperty" :  'hasRevolDress' , "propertyToFind": true, "condition": '='}] , (card)=>{rest(card)})
  }
},
"text": "[AUTO](VC):At the end of your turn, choose a card with the [RevolDress] ability from your soul, and ride it as [Rest].",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Internalize Mage": {
"ability1": {
"condition": async function (unit){if(onRC(unit) && ifYourVanguardHasXInItsName(unit , 'Youthberk')){return true} return false },
"cost": {
  "counterBlast": {
    "amount": 2,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount) }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increasePowerEndTurn(unit , 10000)}
},
"text": "[ACT](RC)1/Turn:If you have a vanguard with \"Youthberk\" in its card name, COST [Counter Blast (2)], and this unit gets [Power]+10000 until end of turn.",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Knight of Partings, Lloygre": {
"ability1": {
"condition": async function (unit){ if(onRC(unit) && yourVanguardIsPlacedByRevolDress()){return true} return false},
"cost": {
"counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increasePowerEndTurn(unit , 10000)}
},
"text": "[AUTO](RC):When your vanguard is placed by the [RevolDress] ability, COST [Counter Blast (1)], and this unit gets [Power]+10000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Stardiness Dragon": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitIntercepts(unit)){
  let arr = await searchZones(userZones.soul , nameIncludesX('RevolForm'))
  if(arr.length > 0)
  return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increaseShieldEndBattle(unit, 10000)}
},
"text": "[AUTO]:When this unit intercepts, if you have a card with \"RevolForm\" in its card name in your soul, this unit gets [Shield]+10000 until end of that battle.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Witch of Revocation, Fectil": {
"ability1": {
"condition": async function (unit){ if(ifThisCardIsDiscarded(unit) &&  playerObjects.current.phase === 'ride'){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await callThisCard(unit)}
},
"text": "[AUTO]:When this card is discarded from hand during your ride phase, you may call this card to (RC).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Knight of Piercing, Cadwalla": {
"ability1": {
"condition": async function (unit){ if(endOfBattleThisUnitAttackedAVanguardOnRC(unit)&& unitAmountCheck(3)){return true} return false},
"cost": {
  "soul": {
    "amount": 1, 
    "filter": basicPropertyArray
  },
  "thisUnit": {
    "amount": 1,
    "filter": basicPropertyArray
  },
 
  "costEffect": async function (unit){await soulBlast(this.soul.amount);await retireThisUnit(unit)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    let hsize = userZones.hand.length
    let zone = await lookTopX(3)
    let prop = newPropertyArray([grade2OrGreater() , units()])
    let rem = await toHand(zone , 1, prop)
    if( hsize !== userZones.hand.length){
      draw()
    }
    putBotDeck(rem)
  }
},
"text": "[AUTO](RC):At the end of the battle this unit attacked a vanguard, if you have four or more units, COST [Soul Blast (1) & retire this unit], look at the top three cards of your deck, choose up to one grade 2 or greater unit card from among them, reveal it and put it into your hand, and shuffle your deck. If you did not reveal, draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Vairina Valiente": {
"ability2": {
"condition": async function (unit){ if(onRC(unit)){return true} return false},
"on": async function (unit){addContinuousPowerGain(this.abilityId , unit , unit.originalDress , 5000)},
"off": async function (unit){
  //removeco
  removeContinuousValue(this.abilityId )
},
"isOn": false,
"text": "[CONT](RC):This unit gets [Power]+5000 for each of this unit's originalDress.",
"type": "CONT",
"permanent": true,
"cost": null
},
"ability3": { 
"condition": async function (unit){ if(whenThisUnitsAttackHitsOnRC(unit) && ifOverDress(unit)){return true} return false},
"cost": {
"counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "hand": {
      "amount": 1,
      "filter": basicPropertyArray
    },
 
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await discard(this.hand.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await standThisUnit(unit)}
},
"text": "[AUTO](RC)1/Turn:When the attack of this unit in the [overDress] state hits, COST [Counter Blast (1) & discard a card from your hand], and [Stand] this unit.",
"type": "AUTO",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Heavy Artillery of Dust Storm, Eugene": {
"ability1": {
"condition": async function (unit){if(onVC(unit)){return true} return false },
"cost": {
  "rg": {
    "amount":2,
    "filter": [
      {
        "cardProperty": "clan",
        "propertyToFind": "",
        "condition": "="
      },
      {
        "cardProperty": "stand",
        "propertyToFind": true,
        "condition": "="
      }
    ]
  },
   "costEffect": async function (unit){await chooseUnits(this.rg.amount , this.rg.filter , (card)=>{rest(card)}) }
},
"effect": {
  "rg": {
    "amount": 2,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    await retireOpponentRearguards(1);
    increasePowerEndTurn(unit , 10000)
  }
},
"text": "[ACT](VC)1/Turn:COST [[Rest] two rear-guards], choose one of your opponent's rear-guards, retire it, and this unit gets [Power]+10000 until end of turn.",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
},
"ability2": {
"condition": async function (unit){if(onVC(unit) && opponentRearguardWasRetiredThisTurn()){return true} return false },
"cost": {
  "soul": {
    "amount": 5,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await soulBlast(this.soul.amount) }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){

    let num = await opponentOpenRC()
    let theRest = await callFromTopX(num ,num)
    await putSoul(theRest)
  }
},
"text": "[ACT](VC)1/Turn:If your opponent's rear-guard was retired this turn, COST [Soul Blast (5)], look at the same number of cards from the top of your deck as the number of your opponent's open (RC), choose any number of unit cards from among them, call them to (RC), and put the rest into your soul.",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Master of Gravity, Baromagnes": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitAttacksOnVC(unit)){return true} return false},
"cost": {
  "counterBlast": {
    "amount":1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    //perfromall
    await performAll([
      {effect: ()=>{

        draw()
      } , value : 5 , condition: '<='},
      {effect: ()=>{

        increasePowerEndBattle(unit ,10000)
        increaseCritEndBattle(unit ,1)
      } , value : 10 , condition: '<='},
      {effect: async ()=>{
         doAllUnits( rearguard() , (unit)=>{
          soulThisUnit(unit)
        } )
         doAllOpponentUnits(undefined , 'soul') 
        await callFromSoul(2,undefined,undefined,undefined,(card)=>{increasePowerEndTurn(card,10000)}) 
      } , value : 15 , condition: '<='},
    ] , userZones.soul.length)
  }
},
"text": "[AUTO](VC):When this unit attacks, COST [Counter Blast (1)], and perform all of the following according to the number of cards in your soul.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Diabolos Boys, Eden": {
"ability1": {
"condition": async function (unit){ if(finalRushOnRC(unit)){
  let event = latestEvent()
  return true} return false}, 
"on": async function (unit){
  increasePower(unit , 5000)
  makeConditionalContinuous(this.abilityId , unit , ()=>{
    if(playerObjects.current.unitsStoodThisTurn[unit.id]){return true}
return false
}, ()=>{increaseCrit(unit, 1);} , ()=>{increaseCrit(unit, -1)}    )
},
"off": async function (unit){
  increasePower(unit , -5000)
 removeConditionalContinuous(this.abilityId )
},
"isOn": false,
"text": "[CONT](RC):If you are in \"Final Rush\", this unit gets [Power]+5000, and if this unit [Stand] this turn by a card effect, [Critical]+1.",
"type": "CONT",
"permanent": true,
"cost": null
},
"ability2": {
"condition": async function (unit){ if(whenThisUnitsAttackHitsOnRC(unit)){return true} return false},
"cost": {
  "counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await retireOpponentRearguards(1)}
},
"text": "[AUTO](RC):When this unit's attack hits, COST [Counter Blast (1)], choose one of your opponent's rear-guards, and retire it.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Cardinal Deus, Orfist": {
"ability1": {
"condition": async function (unit){ if( duringYourTurn() && onVCRC(unit) && (ifYourWorldIsDarkNight() ||ifYourWorldIsAbyssalDarkNight() ) ){return true} return false},
"on": async function (unit){increasePower(unit , 5000)},
"off": async function (unit){increasePower(unit , -5000)},
"isOn": false,
"text": "[CONT](VC/RC):During your turn, if your World is Dark Night or Abyssal Dark Night, this unit gets [Power]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
},
"ability2": {
"condition": async function (unit){if(onVC(unit) ){return true} return false },
"cost": {
  "counterBlast": {
    "amount": 2,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount)
    
    }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
 
    await callToken('Shadow Army' , 3 )
 
  }
},
"text": "[ACT](VC):If your World is Abyssal Dark Night, COST [Counter Blast (2)], and call up to three Shadow Army tokens to (RC). (Your World changes when you play a specific order. Shadow Army has [Power]15000 and Boost)",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Aurora Battle Princess, Agra Rouge": {
"ability1": {
"condition": async function (unit){ if(onRCGC(unit) && await opponentImprisonedAmount() > 1){return true} return false},
"on": async function (unit){increasePower(unit, 5000) ; increaseShield(unit, 10000)},
"off": async function (unit){increasePower(unit, -5000) ; increaseShield(unit, -10000)},
"isOn": false,
"text": "[CONT](RC/GC):If two or more of your opponent's cards are imprisoned in your Prison, this unit gets [Power]+5000/[Shield]+10000.",
"type": "CONT",
"permanent": true,
"cost": null
},
"ability2": {
"condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
"cost": {
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    await imprisonOpponentRearguards(1, frontrowRearguards())
  }
},
"text": "[AUTO]:When this unit is placed on (RC), COST [Soul Blast (1)], choose one of your opponent's front row rear-guards, and imprison it in your Prison. (Put it into your Order Zone that has a Prison)",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Grand Heavenly Sword, Alden": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
"cost": {
  "counterBlast": {
    "amount": 2,
    "filter": basicPropertyArray
  },
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(2) ; await soulBlast(1)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    await callFromHand(1)
    await searchEventCard(unit, 'called' , grade3())
    if(unit['eventCard'].length > 0){
      draw(2)
    }
  }
},
"text": "[AUTO]:When this unit is placed on (RC), COST [Counter Blast (2) & Soul Blast (1)], choose a card from your hand, and call it to (RC). If you called a grade 3, draw two cards.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if(whenThisUnitAttacksOnRC (unit)  && await rearguardAmountCheck(3 , [
  {
    "cardProperty": "grade",
    "propertyToFind": 3,
    "condition": "="
  }])){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increasePowerEndTurn(unit , 5000)}
},
"text": "[AUTO](RC):When this unit attacks, if you have three or more grade 3 units, this unit gets [Power]+5000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Hexaorb Sorceress": {
"ability1": {
"condition": async function (unit){ if(onVC(unit) && await whenYourDriveCheckRevealsATrigger()){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    await chooseUnits(1, rearguard() , (unit)=>{increasePowerEndTurn(unit , 10000)})
  }
},
"text": "[AUTO](VC):When your drive check reveals a trigger unit, choose one of your rear-guards, and it gets [Power]+10000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){if(onVC(unit) && personaRodeThisTurn()){return true} return false },
"cost":
{
  "counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount) ; await soulBlast(this.soul.amount)}
} 
,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
  await  toTopDeck(userZones.hand, 1, [{cardProperty : 'triggerType' , propertyToFind:'CriticalFront' , condition:'or'}]) 
  increaseDriveEndTurn(unit, 1)
  }
},
"text": "[ACT](VC)1/Turn:If you persona rode this turn, COST [Counter Blast (1) & Soul Blast (1)], reveal up to one [Critical] trigger or [Front] trigger from your hand and put it on the top of your deck, and this unit gets drive +1 until end of turn.",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Mysterious Rain Spiritualist, Zorga": {
"ability1": {
"condition": async function (unit){ if(onVC(unit)){return true} return false}, 
"on": async function (unit){
  playerObjects.current.canAlchemagic = true
  getSecondOrder.current = async function() {
 
    let canPayOrders = []
    let orders = await searchZones(userZones.drop, normalOrder())
    for (let i in orders) {
      let ord = orders[i]
  
      if(await costChecker(ord.orderEffects.cost, ord) ){
        canPayOrders.push(ord)
   
      }
    }
 
   let bindLen = userZones.bind.length
    if(canPayOrders.length === 0){return null}
    await toBind(canPayOrders , 1)
    let len = userZones.bind.length
    if(len === bindLen){return null}
    let alcheOrder = userZones.bind[len -1]
    removeById(userZones.drop , alcheOrder.id)
    return alcheOrder
  }
},
"off": async function (unit){playerObjects.current.canAlchemagic = false}, 
"isOn": false,
"text": "[CONT](VC):When you would play a normal order, you can bind a normal order with a different card name from your drop, and Alchemagic. (Combine the costs, and add the effect to the back!)",
"type": "CONT",
"permanent": true,
"cost": null
},
"ability2": {
"condition": async function (unit){if(onVC(unit)){return true} return false },
"cost": {
  "counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount) }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await callFromDrop(1)}
},
"text": "[ACT](VC)1/Turn:COST [Counter Blast (1)], choose a card from your drop zone, and call it to (RC).",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Sylvan Horned Beast, Giunosla": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit) && isOnBackrow(unit)){return true} return false},
"cost": {
  "counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){let power = unit.tempPower
    await chooseUnits(1, rearguard(), (unit)=>{
      increasePowerEndTurn(unit, power)
    })

  }
},
"text": "[AUTO](Back Row RC):When this unit attacks, COST [Counter Blast (1)], choose one of your other rear-guards, and it gets this unit's [Power] until end of turn. (Increase its [Power] at that time)",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Vairina Arcs": {
"ability2": {
"condition": async function (unit){ if(whenPlacedOnRC(unit) && ifOverDress(unit)){return true} return false},
"cost": {
  "counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount)}
},
"effect": {
  "draw": {
    "amount": 2,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount);increasePowerEndTurn(unit , 5000)}
},
"text": "[AUTO]:When this unit is placed on (RC), if it [overDress], COST [Counter Blast (1)], draw two cards, and this unit gets [Power]+5000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Stealth Dragon, Tensha Stead": {
"ability1": {
"condition": async function (unit){ if(whenTheAttackThisUnitBoostedHits(unit)){return true} return false},
"cost": {
  "counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "thisUnit": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount); retireThisUnit(unit)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
  chooseUnits(1, vanguard(), (unit)=>{
    let name = unit.name
    deckToHand(1, name(name))

  })  
  }
},
"text": "[AUTO](RC):When the attack this unit boosted hits, COST [Counter Blast (1) & retire this unit], choose one of your vanguards, search your deck for up to one card with the same card name as that card, reveal it and put it into your hand, and shuffle your deck.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Upward Acrobat, Marjorie": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit) && finalRushOnRC(unit)){return true} return false},
"cost": {
  "otherRearguards": {
    "amount": 1,
    "filter": rearguard()
  },
  "costEffect": async function (unit){
    await soulOtherRearguards(1)
  }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount); soulCharge(1); increasePowerEndTurn(unit, 10000)}
},
"text": "[AUTO](RC)1/Turn:When this unit attacks, if you are in \"Final Rush\", COST [put one of your other rear-guards into your soul], draw a card, Soul Charge (1), and this unit gets [Power]+10000 until end of turn.",
"type": "AUTO",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Steam Battler, Gungnram": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){soulCharge(1)}
},
"text": "[AUTO]:When this unit is placed on (RC), Soul Charge (1).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){if(onRC(unit)){return true} return false },
"cost": {
  "soul": {
    "amount": 3,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await soulBlast(this.soul.amount) }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)}
},
"text": "[ACT](RC)1/Turn:COST [Soul Blast (3)], and draw a card.",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Hyperspeed Robo, Chevalstud": {
"ability1": {
"condition": async function (unit){if(onRC(unit)){return true} return false },
"cost": {
  "counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await soulBlast(this.soul.amount) }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    await imprisonOpponentRearguards(1);
    let zoneAmount = await opponentImprisonedAmount()
    if(zoneAmount >= 3){
      draw(1)
    }
  }
},
"text": "[ACT](RC)1/Turn:COST [Counter Blast (1) & Soul Blast (1)], choose one of your opponent's rear-guards, and imprison it in your Prison. Then, if three or more of your opponent's cards are imprisoned in your Prison, you draw a card.",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Detonation Monster, Bobalmine": {
"ability1": {
"condition": async function (unit){ if(endOfBattleThisUnitBoosted(unit) && await ifOrderZoneHasASetOrder()){return true} return false},
"cost": {
  "thisUnit": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){soulThisUnit(unit)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await counterCharge(1)}
},
"text": "[AUTO](RC):At the end of the battle this unit boosted, if your Order Zone has a Set Order, COST [put this unit into your soul], and Counter Charge (1).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Knight of War Damage, Fosado": {
"ability1": {
"condition": async function (unit){ if(onRC(unit)){return true} return false},
"on": async function (unit){unit.canBeChosen = false},
"off": async function (unit){unit.canBeChosen = true},
"isOn": false,
"text": "[CONT](RC):This unit cannot be chosen by your opponent's card effects.",
"type": "CONT",
"permanent": true,
"cost": null
},
"ability2": {
"condition": async function (unit){ if(whenThisUnitsAttackHitsOnRC(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await counterCharge(1) ; await soulCharge(1)}
},
"text": "[AUTO](RC):When this unit's attack hits, Counter Charge (1)/Soul Charge (1).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Painkiller Angel": {
"ability1": {
"condition": async function (unit){ if(endOfBattleThisUnitBoosted(unit)){return true} return false},
"cost": {
  "thisUnit": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(1); retireThisUnit(unit)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)}
},
"text": "[AUTO](RC):At the end of the battle this unit boosted, COST [Soul Blast (1) & retire this unit], and draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Inheritance Maiden, Hendrina": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await youMay( 1
     ,async ()=>{await mill(3)})}
},
"text": "[AUTO]:When this unit is placed on (RC), you may discard three cards from the top of your deck.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){if(whenPlacedOnRC(unit)){return true} return false },
"cost": {
  "thisUnit": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await retireThisUnit(unit) }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){

    await addPlayerFunction('Alchemagic' , async (orderEffect)=>{ if(orderEffect.cost.soul){

      orderEffect.cost.soul.amount = 0

    } }  , unit)
  }
},
"text": "[ACT](RC):COST [Retire this unit], until end of turn, the next time you would Alchemagic an order and play it, you may choose not to pay all of that cost's Soul Blast.",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Spurring Maiden, Ellenia": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRCFrom(unit , 'hand')){return true} return false},
"cost": {
  "counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await soulBlast(this.soul.amount) }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await callFromDrop(1, grade2OrLess() , undefined , false, (unit)=>{increasePowerEndTurn(unit, 5000)})}
},
"text": "[AUTO]:When this unit is placed on (RC) from hand, COST [Counter Blast (1) & Soul Blast (1)], choose a grade 2 or less card from your drop, call it to (RC), and it gets [Power]+5000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Penetrate Dragon, Tribash": {
"ability1": {
"condition": async function (unit){ if(whenYourVanguardsAttacks(unit) && await opponentRGAmountLessThan(3) ){return true} return false},
"cost": {
  "thisUnit": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){soulThisUnit(unit)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    await chooseUnits(1, vanguard() , (unit)=>{
      increaseCritEndBattle(unit , 1)
    })
  }
},
"text": "[AUTO](RC):When your vanguard attacks, if your opponent has two or less rear-guards, COST [put this unit into your soul], choose one of your vanguards, and it gets [Critical]+1 until end of that battle.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Cataclysmic Bullet of Dust Storm, Randor": {
"ability1": {
"condition": async function (unit){ if(whenRodeUponBy(unit ,'Heavy Artillery of Dust Storm, Eugene' )){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount); 
   await dropToSoul(1, )
  }
},
"text": "[AUTO]:When this unit is rode upon by \"Heavy Artillery of Dust Storm, Eugene\", draw a card, choose up to one card from your drop, and put it into your soul.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if(whenThisUnitAttacks(unit) && onVCRC(unit) && await opponentRGAmountLessThan(2)){return true} return false},
"cost": {
"counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){soulCharge(1); increasePowerEndBattle(unit , 5000)}
},
"text": "[AUTO](VC/RC):When this unit attacks, if your opponent has two or less rear-guards, COST [Counter Blast (1)], Soul Charge (1), and this unit gets [Power]+5000 until end of that battle.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Dragritter, Dabbaax": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
"cost": {
"counterBlast": {
    "amount":2,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){soulCharge(1); await retireOpponentRearguards(1)}
},
"text": "[AUTO]:When this unit is placed on (RC), COST [Counter Blast (2)], Soul Charge (1), choose one of your opponent's rear-guards, and retire it.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Stealth Rogue of Strife, Fudoumaru": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitsAttackHitsOnRC(unit)){return true} return false},
"cost": {
  "hand": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){discard(this.hand.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)}
},
"text": "[AUTO](RC):When this unit's attack hits, COST [discard a card from your hand], and draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Dragritter, Alwalith": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
"cost": {
  "counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await soulBlast(this.soul.amount) }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await retireOpponentRearguards(1 , grade2OrGreater())}
},
"text": "[AUTO]:When this unit is placed on (RC), COST [Counter Blast (1) & Soul Blast (1)], choose one of your opponent's grade 2 or greater rear-guards, and retire it.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Twin Buckler Dragon": {
"ability1": {
"condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false},
"on": async function (unit){},
"off": async function (unit){},
"isOn": false,
"text": "[CONT]:Sentinel (You may only have up to four cards with \"[CONT]:Sentinel\" in a deck.)",
"type": "CONT",
"permanent": true,
"cost": null
},
"ability2": {
"condition": async function (unit){ if(whenPutOnGC(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await perfectGuard();
    if(userZones.hand.length > 2){
      await discard(1)
    }

  }
},
"text": "[AUTO]:When this unit is put on (GC), choose one of your units, and it cannot be hit until end of that battle. If your hand has two or more cards, choose a card from your hand, and discard it.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Phantasma Magician, Curtis": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit) && ifYourVanguardIs('Master of Gravity, Baromagnes')){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await soulCharge(2)}
},
"text": "[AUTO]:When this unit is placed on (RC), if your vanguard is \"Master of Gravity, Baromagnes\", Soul Charge (2).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){if(onRC(unit) && ifYourSoulHas10OrMore()){return true} return false },
"cost": {
  "counterBlast": {
    "amount": 2,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount) }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    await doAllUnits(frontrowUnits(), (unit)=>{increasePowerEndTurn(unit , 5000)})
  }
},
"text": "[ACT](RC):If your soul has ten or more cards, COST [Counter Blast (2)], and all of your front row units get [Power]+5000 until end of turn.",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Electro Spartan": {
"ability1": {
"condition": async function (unit){ if(whenRodeUponBy(unit , 'Master of Gravity, Baromagnes')){return true} return false},
"cost": {
  "hand": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await handToSoul(1)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount); soulCharge(1)}
},
"text": "[AUTO]:When this unit is rode upon by \"Master of Gravity, Baromagnes\", COST [put a card from your hand into your soul], draw a card, and Soul Charge (1).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
"cost": {
  "counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){soulCharge(2)}
},
"text": "[AUTO]:When this unit is placed on (RC), COST [Counter Blast (1)], and Soul Charge (2).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Shadow Leak Magician": {
"ability1": {
"condition": async function (unit){ if(onRC(unit)){return true} return false},
"on": async function (unit){unit.canBeChosen = false},
"off": async function (unit){unit.canBeChosen =true},
"isOn": false,
"text": "[CONT](RC):This unit cannot be chosen by your opponent's card effects.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Protobulb Dragon": {
"ability1": {
"condition": async function (unit){ if(finalRushOnRC(unit) &&( whenThisUnitAttacks(unit) ||whenThisUnitBoosts(unit) )){return true} return false},
"cost": {
"counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "otherRearguards": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount); await soulOtherRearguards(1)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    await soulToHand(1)
  }
},
"text": "[AUTO](RC):When this unit attacks or boosts, if you are in \"Final Rush\", COST [Counter Blast (1) & put another rear-guard into your soul], choose a card from your soul, and put it into your hand.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Recusal Hate Dragon": {
"ability1": {
"condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false},
"on": async function (unit){},
"off": async function (unit){},
"isOn": false,
"text": "[CONT]:Sentinel (You may only have up to four cards with \"[CONT]:Sentinel\" in a deck.)",
"type": "CONT",
"permanent": true,
"cost": null
},
"ability2": {
"condition": async function (unit){ if(whenPutOnGC(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    await perfectGuard()
    if(userZones.hand.length > 2){
      await discard(1)
    }
  }
},
"text": "[AUTO]:When this unit is put on (GC), choose one of your units, and it cannot be hit until end of that battle. If your hand has two or more cards, choose a card from your hand, and discard it.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Granaroad Fairtigar": {
"ability1": {
"condition": async function (unit){if(onRC(unit)){return true} return false },
"cost": {
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increasePowerEndTurn(unit ,2000);await imprisonOpponentRearguards(1, frontrowRearguards())}
},
"text": "[ACT](RC)1/Turn:COST [Soul Blast (1)], and this unit gets [Power]+2000 until end of turn. Choose one of your opponent's front row rear-guards, and imprison it in your Prison. (Put them into your Order Zone that has a Prison)",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Cardinal Noid, Cubisia": {
"ability1": {
"condition": async function (unit){ if(onVC(unit) && await ifAWorldIsPutIntoOrderzone()){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await increaseUnitsPowerEndTurn(1, 5000)}
},
"text": "[AUTO](VC):When a World is put into your order zone, choose one of your units, and it gets [Power]+5000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if(duringYourTurn() && ifYourWorldIsAbyssalDarkNight()){return true} return false},
"on": async function (unit){increasePower(unit , 5000)},
"off": async function (unit){increasePower(unit , -5000)},
"isOn": false,
"text": "[CONT](RC):During your turn, if your World is Abyssal Dark Night, this unit gets [Power]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Polar Cold Monster, Drumler": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit) && ifYourWorldIsAbyssalDarkNight()){return true} return false},
"cost": {
  "counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await soulBlast(this.soul.amount) }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)}
},
"text": "[AUTO]:When this unit is placed on (RC), if your World is Abyssal Dark Night, COST [Counter Blast (1) & Soul Blast (1)], and draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Fighting Dragon, Goldog Dragon": {
"ability1": {
"condition": async function (unit){ if(whenThisCardIsDiscarded(unit) && duringYourTurn() &&await ifOrderZoneHasASetOrder()){return true} return false},
"cost": {
"counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}

},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    await callThisCard(unit)
  }
},
"text": "[AUTO]:When this card is discarded from hand during your turn, if you have a Set Order in your Order Zone, COST [Counter Blast (1)], and call this card to (RC).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Violate Dragon": {
"ability1": {
"condition": async function (unit){ if(whenPutOnGC(unit)){return true} return false},
"on": async function (unit){},
"off": async function (unit){},
"isOn": false,
"text": "[CONT]:Sentinel (You may only have up to four cards with \"[CONT]:Sentinel\" in a deck.)",
"type": "CONT",
"permanent": true,
"cost": null
},
"ability2": {
"condition": async function (unit){ if(whenPutOnGC(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){        
    await perfectGuard()
    if(userZones.hand.length > 2){
      await discard(1)
    }}
},
"text": "[AUTO]:When this unit is put on (GC), choose one of your units, and it cannot be hit until end of that battle. If your hand has two or more cards, choose a card from your hand, and discard it.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Hollowing Moonlit Night": {
"ability3": {
"condition": async function (unit){ if(whenThisCardIsPutIntoOrderZone(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)}
},
"text": "[AUTO]:When this card is put into order zone, draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability4": {
"condition": async function (unit){ if(0){return true} return false},
"on": async function (unit){
  
},
"off": async function (unit){},
"isOn": false,
"text": "[CONT](Order Zone):If your order zone only has World cards, the following effects are active according to the number of cards in your order zone.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Dark Strain Dragon": {
"ability1": {
"condition": async function (unit){if(onRC(unit) && await ifYouHave3OrMoreGrade3()){return true} return false },
"cost": {
  "soul": {
    "amount": 2,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){   
    await doAllUnits(basicPropertyArray , (unit)=>{
      giveBoost(unit)
    })

  }
},
"text": "[ACT](RC):If you have three or more grade 3 units, COST [Soul Blast (2)], and all of your grade 3 units get \"Boost\" until end of turn.",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Big Snake Witch, Solaria": {
"ability1": {
"condition": async function (unit){ if(ifThisCardIsDiscarded(unit) && duringYourTurn()){return true} return false},
"cost": {
  "counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await soulBlast(this.soul.amount) }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)}
},
"text": "[AUTO]:When this card is discarded from hand during your turn, COST [Counter Blast (1) & Soul Blast (1)], and draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Pentagleam Sorceress": {
"ability1": {
"condition": async function (unit){ if(whenRodeUponBy(unit, 'Hexaorb Sorceress')){return true} return false},
"cost": null, 
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
await rearrangeTopX(3)
  }
},
"text": "[AUTO]:When this unit is rode upon by \"Hexaorb Sorceress\", look at three cards from the top of your deck, and put them on the top of your deck in any order.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    let putTop = await lookTopPutTopOrBottom(1,0)
    if(putTop === false){
      increasePowerEndTurn(unit ,2000)

    }

  }
},
"text": "[AUTO]:When this unit is placed on (RC), look at the top card of your deck, and put it on the top or bottom of your deck. If you put it on the bottom of your deck, this unit gets [Power]+2000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Divine Sister, Tartine": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
"cost": {
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "thisUnit": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await soulBlast(this.soul.amount); await restThisUnit(unit)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
await lookTopPutTopOrBottom(2)
  }
},
"text": "[AUTO]:When this unit is placed on (RC), COST [Soul Blast (1) & [Rest] this unit], look at two cards from the top of your deck, choose a card from among them, put it on the top of your deck, and put the rest on the bottom of your deck.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Divine Sister, Faciata": {
"ability1": {
"condition": async function (unit){ if(onRC(unit) && await whenYourDriveCheckRevealsATrigger()){return true} return false},
"cost": {
  "soul": {
    "amount": 2,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await counterCharge(1)}
},
"text": "[AUTO](RC)1/Turn:When your drive check reveals a trigger unit, COST [Soul Blast (2)], and Counter Charge (1).",
"type": "AUTO",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Aegismare Dragon": {
"ability1": {
"condition": async function (unit){ if(1){return true} return false},
"on": async function (unit){},
"off": async function (unit){},
"isOn": false,
"text": "[CONT]:Sentinel (You may only have up to four cards with \"[CONT]:Sentinel\" in a deck.)",
"type": "CONT",
"permanent": true,
"cost": null
},
"ability2": {
"condition": async function (unit){ if(whenPutOnGC(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){        
    await perfectGuard()
    if(userZones.hand.length > 2){
      await discard(1)
    }}
},
"text": "[AUTO]:When this unit is put on (GC), choose one of your units, and it cannot be hit until end of that battle. If your hand has two or more cards, choose a card from your hand, and discard it.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Black Tears Husk Dragon": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnVC(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await dropToHand(1, normalOrder())}
},
"text": "[AUTO]:When this unit is placed on (VC), choose up to one normal order from your drop, and put it into your hand.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if(onRC(unit) && ifYouPlayedAnOrderThisTurn()){return true} return false},
"on": async function (unit){increasePower(unit ,5000)},
"off": async function (unit){increasePower(unit , -5000)},
"isOn": false,
"text": "[CONT](RC):If you played an order this turn, this unit gets [Power]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Sylvan Horned Beast, Agleo": {
"ability1": {
"condition": async function (unit){if(onRC(unit)){return true} return false },
"cost": {
  "thisUnit": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await retireThisUnit(unit)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await chooseUnits(2, undefined , (unit)=>{increasePowerEndTurn(unit , 5000)})}
},
"text": "[ACT](RC):COST [Retire this unit], choose two of your units, and they get [Power]+5000 until end of turn.",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Planar Prevent Dragon": {
"ability1": {
"condition": async function (unit){ if(1){return true} return false},
"on": async function (unit){},
"off": async function (unit){},
"isOn": false,
"text": "[CONT]:Sentinel (You may only have up to four cards with \"[CONT]:Sentinel\" in a deck.)",
"type": "CONT",
"permanent": true,
"cost": null
},
"ability2": {
"condition": async function (unit){ if(whenPutOnGC(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){        
    await perfectGuard()
    if(userZones.hand.length > 2){
      await discard(1)
    }}
},
"text": "[AUTO]:When this unit is put on (GC), choose one of your units, and it cannot be hit until end of that battle. If your hand has two or more cards, choose a card from your hand, and discard it.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Stealth Dragon, Hadou Shugen": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit) && await haveAnOverdressUnit()){return true} return false},
"cost": {

  "counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await retireOpponentRearguards(1)}
},
"text": "[AUTO]:When this unit is placed on (RC), if you have a unit in the [overDress] state, COST [Counter Blast (1)], choose one of your opponent's rear-guards, and retire it.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Stealth Rogue of Iron Blade, Oshikuni": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit) && await opponentRGAmountLessThan(2)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increasePowerEndBattle(unit , 5000)}
},
"text": "[AUTO](RC):When this unit attacks, if your opponent has two or less rear-guards, this unit gets [Power]+5000 until end of that battle.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Dragritter, Zafar": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitIntercepts(unit)){return true} return false},
"cost": {
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increaseShieldEndBattle(unit , 5000)}
},
"text": "[AUTO]:When this unit intercepts, COST [Soul Blast (1)], and this unit gets [Shield]+5000 until end of that battle.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Extremist Dragon, Velocihazard": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitBoosts(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increasePowerEndTurn(unit, 2000)}
},
"text": "[AUTO](RC):When this unit boosts, this unit gets [Power]+2000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Gunning of Dust Storm, Nigel": {
"ability1": {
"condition": async function (unit){ if(whenRodeUponBy(unit, 'Cataclysmic Bullet of Dust Storm, Randor')){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){soulCharge(1)}
},
"text": "[AUTO]:When this unit is rode upon by \"Cataclysmic Bullet of Dust Storm, Randor\", Soul Charge (1).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if(onRC(unit)&& whenOpponentsRearguardIsRetiredDuringYourMainPhase(unit)){return true} return false},
"cost": {
  
"counterBlast": {
"amount": 1,
"filter": [
  {
    "cardProperty": "clan",
    "propertyToFind": "",
    "condition": "="
  }
]
},
  "thisUnit": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await counterBlast(1) ;await retireThisUnit(unit)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await retireOpponentRearguards(1)}
},
"text": "[AUTO](RC):When your opponent's rear-guard is retired during your main phase, COST [Counter Blast (1) & retire this unit], choose one of your opponent's rear-guards, and retire it.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Stealth Fiend, Shigamanago": {
"ability1": {
"condition": async function (unit){ if(onRC(unit)&& await whenOpponentsRearguardIsRetiredDuringYourMainPhase(unit)){return true} return false},
"cost": {
  "thisUnit": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await retireThisUnit(unit)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    let zone = await lookTopX(1)
    let remaining = await superiorCall(zone)
    addToZone(remaining, userZones.soul, remaining, 'deck')
  }
},
"text": "[AUTO](RC):When your opponent's rear-guard is retired during your main phase, COST [retire this unit], look at the top card of your deck, and you may call a unit card from among them to (RC). If you do not, put the rest into your soul.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Double Gun of Dust Storm, Bart": {
"ability1": {
"condition": async function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)}
},
"text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Selfish Engraver": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitsAttackHitsOnRC(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){soulCharge(1)}
},
"text": "[AUTO](RC):When this unit's attack hits, Soul Charge (1).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if(endOfBattleThisUnitAttackedOnRC(unit) && ifYourSoulHas10OrMore()){return true} return false},
"cost": {
  "thisUnit": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await soulThisUnit(unit)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await counterCharge(1)}
},
"text": "[AUTO](RC):At the end of the battle this unit attacked, if your soul has ten or more cards, COST [put this unit into your soul], and Counter Charge (1).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Soulful Wildmaster, Megan": {
"ability1": {
"condition": async function (unit){ if(onRC(unit) && thisTurn.current.soulCharged === true){return true} return false}, 
"on": async function (unit){increasePower(unit, 2000)},
"off": async function (unit){increasePower(unit, -2000)},
"isOn": false,
"text": "[CONT](RC):If you Soul Charge this turn, this unit gets [Power]+2000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Eminence Jaboberus": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitBoosts(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increasePowerEndTurn(unit , 2000)}
},
"text": "[AUTO](RC):When this unit boosts, this unit gets [Power]+2000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Steam Artist, Pithana": {
"ability1": {
"condition": async function (unit){if(onRC(unit)){return true} return false },
"cost": {
  "thisUnit": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await soulThisUnit(unit)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await increaseUnitsPowerEndTurn(1, 2000)}
},
"text": "[ACT](RC):COST [Put this unit into your soul], choose one of your units, and it gets [Power]+2000 until end of turn.",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Steam Detective, Uvaritt": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    let power = 2000
    if(finalRush()){
      power = 5000
    }


    await chooseUnits(1, sameColumn(unit) , (unit)=>{
      increasePowerEndTurn(unit, power)
    })
  }
},
"text": "[AUTO]:When this unit is placed on (RC), choose one of your other units in the same column as this unit, and it gets [Power]+2000 until end of turn. If you are in \"Final Rush\", it gets [Power]+5000 instead of +2000.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Direful Doll, Simone": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitBoosts(unit) && ifYourSoulHas5OrMore()){return true} return false},
"cost": {
"counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    guardRestrictEndBattle(unit , 'twoOrMore')
  }
},
"text": "[AUTO](RC):When this unit boosts, if your soul has five or more cards, COST [Counter Blast (1)], and until end of that battle, when your opponent would call cards from their hand to (GC), they must call two or more at the same time.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Deep Soniker": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnVC(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){soulCharge(1)}
},
"text": "[AUTO]:When this unit is placed on (VC), Soul Charge (1).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if(onRC(unit) && ifYourSoulHas10OrMore()){return true} return false},
"on": async function (unit){increasePower(unit, 10000)},
"off": async function (unit){increasePower(unit,  -10000)},
"isOn": false,
"text": "[CONT](RC):During your turn, if your soul has ten or more cards, this unit gets [Power]+10000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Uncanny Burning": {
"ability1": {
"condition": async function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)}
},
"text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Lightning Thief Monster, Jabattail": {
"ability1": {
"condition": async function (unit){ if(ifYourWorldIsAbyssalDarkNight() && onRC(unit)){return true} return false},
"on": async function (unit){unit.attackFunction = attackColumn},
"off": async function (unit){unit.attackFunction = null},
"isOn": false,
"text": "[CONT](RC):If your World is Abyssal Dark Night, when this unit would attack, it battles all of the units in one of your opponent's columns.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Grapple External": {
"ability1": {
"condition": async function (unit){ if(onRC(unit) && duringTheBattleThisUnitAttacked(unit) && await opponentImprisonedAmount() > 0){return true} return false},
"on": async function (unit){increasePower(unit, 5000)},
"off": async function (unit){increasePower(unit,  -5000)},
"isOn": false,
"text": "[CONT](RC):During the battle this unit attacks, if an opponent's card is imprisoned in your Prison, this unit gets [Power]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Cardinal Noid, Routis": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnVC(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await deckToHand(1 ,[
    {
      "cardProperty": "cardtype",
      "propertyToFind": "World",
      "condition": "includes"
    }
  ] )}
},
"text": "[AUTO]:When this unit is placed on (VC), search your deck for up to one World card, reveal it and put it into your hand, and shuffle your deck.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if((duringTheBattleThisUnitAttacked(unit) || duringTheBattleThisUnitBoosted(unit)) 
  && (ifYourWorldIsDarkNight() || ifYourWorldIsAbyssalDarkNight())){return true} return false},
  "on": async function (unit){increasePower(unit, 2000)},
  "off": async function (unit){increasePower(unit,  -2000)},
"isOn": false,
"text": "[CONT](RC):During the battle this unit attacked or boosted, if your World is Dark Night or Abyssal Dark Night, this unit gets [Power]+2000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Electrode Monster, Adapton": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitBoosts(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increasePowerEndTurn(unit,  -2000)}
},
"text": "[AUTO](RC):When this unit boosts, this unit gets [Power]+2000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Useful Recharger": {
"ability1": {
"condition": async function (unit){ if(whenPutOnGC(unit)){return true} return false},
"cost": {
"counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    if(ifYourWorldIsDarkNight()){
      increaseShieldEndTurn(unit , 5000)
    }
    else if(ifYourWorldIsAbyssalDarkNight()){
      increaseShieldEndTurn(unit , 10000)
    }
  }
},
"text": "[AUTO]:When this unit is put on (GC), COST [Counter Blast (1)], and if your World is Dark Night, this unit gets [Shield]+5000 until end of turn. If it is Abyssal Dark Night, this unit gets [Shield]+10000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Cardinal Fang, Phovi": {
"ability1": {
"condition": async function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)}
},
"text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"In the Darkness Nobody Knows": {
"ability3": {
"condition": async function (unit){ if(whenThisCardIsPutIntoOrderZone(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await retireOpponentRearguards(1 , frontrowRearguards())}
},
"text": "[AUTO]:When this card is put in the order zone, choose one of your opponent's front row rear-guards, and retire it.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability4": {
"condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false},
"on": async function (unit){},
"off": async function (unit){},
"isOn": false,
"text": "[CONT](Order Zone):If your order zone only has World cards, the following effects are active according to the number of cards in your order zone.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Actual Analyst, Kokabiel": {
"ability1": {
"condition": async function (unit){ if(onGC(unit) && ifYourVanguardIs( 'Apex Ruler, Bastion')){return true} return false},
"on": async function (unit){
  let circleG3s =  await searchCircles(grade3())
  let GCG3s = await searchZones(userCircles.userGC.guardians, grade3())

  let shieldAmount = (Math.floor((circleG3s.length + GCG3s.length)/2)) * 5000
  increaseShield(unit , shieldAmount)
},
"off": async function (unit){unit.tempShield = 0},
"isOn": false,
"text": "[CONT](GC):If your vanguard is \"Apex Ruler, Bastion\", this unit gets [Shield]+5000 for every two of your grade 3 units. (Includes this unit)",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Divine Sister, Lepisto": {
"ability1": {
"condition": async function (unit){ if(onRC(unit ) && await whenYourDriveCheckRevealsATrigger()){return true} return false},
"cost": {
"counterBlast": {
    "amount": 2,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){standThisUnit(unit); increasePowerEndTurn(unit ,5000)}
},
"text": "[AUTO](RC):When your drive check reveals a trigger unit, COST [Counter Blast (2)], [Stand] this unit, and it gets [Power]+5000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Remission Sword, Phanuel": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit) && await ifYouHave3OrMoreGrade3()){return true} return false},
"cost": {
"counterBlast": {
    "amount": 2,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increaseCritEndBattle(unit ,1)}
},
"text": "[AUTO](RC):When this unit attacks, if you have three or more grade 3 units, COST [Counter Blast (2)], and this unit gets [Critical]+1 until end of that battle.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Divine Sister, Pastelitos": {
"ability1": {
"condition": async function (unit){ if(onRC(unit) && whenYourDriveCheckRevealsATrigger()){return true} return false},
"cost": {
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increasePowerEndTurn(unit ,5000)}
},
"text": "[AUTO](RC)1/Turn:When your drive check reveals a trigger unit, COST [Soul Blast (1)], and this unit gets [Power]+5000 until end of turn.",
"type": "AUTO",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Tier Square Sorceress": {
"ability1": {
"condition": async function (unit){ if(whenRodeUponBy(unit , 'Pentagleam Sorceress')){return true} return false},
"cost": {
"counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)}
},
"text": "[AUTO]:When this unit is rode upon by \"Pentagleam Sorceress\", COST [Counter Blast (1)], and draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if(onRC(unit) && await whenYourDriveCheckRevealsATrigger()){return true} return false},
"cost": {
"counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){

    await botDeckOpponentRearguards(1, frontrowRearguards())
  }
},
"text": "[AUTO](RC)1/Turn:When your drive check reveals a trigger unit, COST [Counter Blast (1)], choose one of your opponent's front row rear-guards, and put it on the bottom of their deck.",
"type": "AUTO",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Knight of Heavenly Wind, Vachel": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitBoosts(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increasePowerEndTurn(unit, 2000)}
},
"text": "[AUTO](RC):When this unit boosts, this unit gets [Power]+2000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Tri Connect Sorceress": {
"ability1": {
"condition": async function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)}
},
"text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Astute Noble, Eddga": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit)){return true} return false},
"cost": {
"counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increasePowerEndTurn(unit ,5000)}
},
"text": "[AUTO](RC):When this unit attacks, COST [Counter Blast (1)], and this unit gets [Power]+5000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Hydrolic Ram Dragon": {
"ability1": {
"condition": async function (unit){ if(onRC(unit)&& whenThisUnitAttacksAVanguard(unit) ){
  let bindOrder =  await searchZones(userZones.bind , order)
  if(bindOrder.length >0)
  return true
} return false}, 
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increasePowerEndBattle(unit, 5000)}
},
"text": "[AUTO](RC):When this unit attacks a vanguard, if your bind zone has an order card, this unit gets [Power]+5000 until end of that battle.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Dark Pilgrimage": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitBoosts(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increasePowerEndTurn(unit, 2000)}
},
"text": "[AUTO](RC):When this unit boosts, this unit gets [Power]+2000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Rancor Chain": {
"ability1": {
"condition": async function (unit){if(onVC(unit)){return true} return false },
"cost": {
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount)}
},
"effect": {
  "draw": {
    "amount": 2,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    draw(this.draw.amount)
    await discard(1, orders())
  }
},
"text": "[ACT](VC)1/Turn:COST [Soul Blast (1)], draw two cards, choose up to one order card from your hand, discard it, and if you did not discard, choose two cards from your hand, and discard them.",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
},
"ability2": {
"condition": async function (unit){ if(onRC(unit) && playedAnOrderThisTurn()){return true} return false},
"on": async function (unit){increasePower(unit , 2000)},
"off": async function (unit){increasePower(unit , -2000)},
"isOn": false,
"text": "[CONT](RC):If you played an order this turn, this unit gets [Power]+2000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Conspiring Mutant, Admantis": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increaseUnitsPowerEndTurn(1, 5000 , otherRearguard())}
},
"text": "[AUTO]:When this unit is placed on (RC), choose one of your other rear-guards, and it gets [Power]+5000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Dream Nibbling": {
"ability1": {
"condition": async function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)}
},
"text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Dragonic Overlord": {
"ability1": {
"condition": async function (unit){ if(onVCRC(unit) && duringTheBattleThisUnitAttackedARearguard(unit)){return true} return false},
"on": async function (unit){
  await guardRestrictEndBattle(unit, 'cannotCall')
},
"off": async function (unit){
  await removeGuardRestrict()
},
"isOn": false,
"text": "[CONT](VC/RC):During the battle this unit attacked a rear-guard, your opponent cannot call cards from their hand to (GC).",
"type": "CONT",
"permanent": true,
"cost": null
},
"ability2": {
"condition": async function (unit){ if(whenThisUnitsAttackHitsOnVC(unit)){return true} return false},
"cost": {
  "counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "hand": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await discard(this.hand.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){standThisUnit(unit); increaseDriveEndTurn(unit , -1)}
},
"text": "[AUTO](VC)1/Turn:When this unit's attack hits, COST [Counter-Blast 1 & discard a card from your hand], [Stand] this unit, and it gets drive -1 until end of turn.",
"type": "AUTO",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Vairina Erger": {
"ability2": {
"condition": async function (unit){ if(atEndOfBattle() && currentBattle.current.attackingUnit.name === 'Trickstar' &&inHand(unit) && ifYourVanguardIs('Chakrabarthi Divine Dragon, Nirvana') ){
  return true} return false},
"cost": {
  "soul": {
    "amount": 2,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
  
  await superiorOverDress(unit , currentBattle.current.attackingUnit)

  await counterCharge(1)
  }
},
"text": "[AUTO](Hand):At the end of the battle your \"Trickstar\" attacked a vanguard, if your vanguard is \"Chakrabarthi Divine Dragon, Nirvana\", COST [Soul Blast (2)], [overDress] this card on your \"Trickstar\" on (RC) as [Stand], and Counter Charge (1).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability3": {
"condition": async function (unit){ if(onRCGC(unit) && ifOverDress(unit)){return true} return false},
"on": async function (unit){increasePower(unit ,10000) ; increaseShield(unit, 10000)},
"off": async function (unit){increasePower(unit ,-10000) ; increaseShield(unit, -10000)},
"isOn": false,
"text": "[CONT](RC/GC):If this unit is in the [overDress] state, this unit gets [Power]+10000/[Shield]+10000. (Active on opponent's turn too)",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Crimson Igspeller": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit) && whenThisUnitAttacksAVanguard(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){soulCharge(1)}
},
"text": "[AUTO](RC):When this unit attacks a vanguard, Soul Charge (1).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){if(inSoul(unit)){return true} return false }, 
"cost": {
  "counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "inSoul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount) ;await dropThisCard(unit)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){ soulCharge(1)
    await increaseUnitsPowerEndTurn(1, 10000, vanguard())
  }
},
"text": "[ACT](Soul):COST [Counter Blast (1) & Put this card into your drop], Soul Charge (1), choose one of your vanguards, and it gets [Power]+10000 until end of turn.",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Diabolos Jetbacker, Lenard": {
"ability1": {
"condition": async function (unit){ if(finalRushOnRC(unit)){return true} return false},
"on": async function (unit){
  increasePower(unit, 5000)
  unit.attackFunction = attackColumn
},
"off": async function (unit){
  increasePower(unit, -5000)
  unit.attackFunction = null
},
"isOn": false,
"text": "[CONT](RC):If you are in \"Final Rush\", this unit gets [Power]+5000, and when this unit would attack, it battles all of your opponent's units in a column.",
"type": "CONT",
"permanent": true,
"cost": null
},
"ability2": {
"condition": async function (unit){ if(whenThisUnitsAttackHitsOnRC(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){soulCharge(1);
if(ifYourVanguardIs( 'Diabolos, \"Violence\" Bruce')){
await callFromSoul(1, undefined , undefined, true)
}

  }
},
"text": "[AUTO](RC):When this unit's attack hits, Soul Charge (1), and if your vanguard is \"Diabolos, \"Violence\" Bruce\", choose up to one card from your soul, and call it to an open (RC).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Cardinal Draco, Alviderd": {
"ability1": {
"condition": async function (unit){ if(onRC(unit) && ifYourWorldIsDarkNight()){return true} return false},
"on": async function (unit){
  increasePower(unit , 2000)
  makeConditionalContinuous(this.abilityId , unit , ifYourWorldIsAbyssalDarkNight() , (unit)=>{increasePower(unit , 3000)}, (unit)=>{increasePower(unit , -3000)})
},
"off": async function (unit){
  increasePower(unit , -2000)
  removeConditionalContinuous(this.abilityId)
},
"isOn": false,
"text": "[CONT](RC):During your turn, if your World is Dark Night, this unit gets [Power]+2000. If it is Abyssal Dark Night instead, it gets [Power]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
},
"ability2": {
"condition": async function (unit){ if(endOfBattleThisUnitAttackedOnRC(unit)){return true} return false},
"cost": {
  "otherRearguards":{
    "amount": 1,
    "filter": basicPropertyArray
},
  "costEffect": async function (unit){await retireYourRearguards(1 , [
    {
      "cardProperty": "id",
      "propertyToFind": unit.id,
      "condition": "!="
    }, 
    {
      "cardProperty": "name",
      "propertyToFind": 'Shadow Army',
      "condition": "="
    }, 
  ])
}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await retireOpponentRearguards(1)}
},
"text": "[AUTO](RC):At the end of the battle this unit attacked, COST [retire a Shadow Army token], choose one of your opponent's rear-guards, and retire it.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Aurora Battle Princess, Perio Turquoise": {
"ability1": {
"condition": async function (unit){ if(onRC(unit ) && duringYourTurn() && await opponentImprisonedAmount() > 1){return true} return false},
"on": async function (unit){increasePower(unit, 5000)},
"off": async function (unit){increasePower(unit, -5000)},
"isOn": false,
"text": "[CONT](RC):During your turn, if two or more of your opponent's cards are imprisoned in your Prison, this unit gets [Power]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
},
"ability2": {
"condition": async function (unit){ if(onFrontRowRC(unit) ) {
 
  if(turnState.current.event === 'called'){
   

    let called = opponentTurnState.current.called
 
    called.forEach( async (obj)=>{
      let circle = obj.circle.replace('user' , 'opponent')
      let card = currentOpponentCircles.current[circle].unit
      if(card.previousArea === 'prison')
        {
          await doOpponentUnits([card.circle] , 'increasePowerEndTurn' , -5000)
        }

    })

}



} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){

  }
},
"text": "[AUTO](Front Row RC):When your opponent's card imprisoned in your Prison is placed on (RC), that unit gets [Power]-5000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Heavenly Bow of Edifying Guidance, Refuerzos": {
"ability1": {
"condition": async function (unit){ if(onRC(unit) && personaRodeThisTurn()){return true} return false},
"on": async function (unit){giveBoost(unit)},
"off": async function (unit){removeBoost(unit)},
"isOn": false,
"text": "[CONT](RC):If you persona rode this turn, this unit gets \"Boost\".",
"type": "CONT",
"permanent": true,
"cost": null
},
"ability2": {
"condition": async function (unit){ if(onBackRowRC(unit) 
&& turnState.current.stand === true
){return true} return false}, 
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){standThisUnit(unit)}
},
"text": "[AUTO](Back Row RC)1/Turn:When your other unit [Stand] by a card's effect, [Stand] this unit.",
"type": "AUTO",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Phantom Blaster Dragon": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnVC(unit)){return true} return false},
"cost": null,
"effect": {
  "call": {
    "amount": 1,
    "filter": [
      {
        "cardProperty": "name",
        "propertyToFind": "Blaster",
        "condition": "includes"
      }
    ]
  },
  "effect": async function (unit){ await callFromSoul(1, this.call.filter)}
},
"text": "[AUTO]:When this unit is placed on (VC), choose a card with \"Blaster\" in its card name from your soul, and you may call it to (RC).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){if(onVC(unit)){return true} return false },
"cost": {
  "counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "rg": {
    "amount": 3,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount); await retireYourRearguards(this.rg.amount) }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){ await retireOpponentRearguards(2);
     increasePowerEndTurn(unit, 10000); increaseCritEndTurn(unit, 1)}
},
"text": "[ACT](VC)1/Turn:COST [Counter Blast (1) & Retire three rear-guards], choose up to two of your opponent's rear-guards, retire them, and this unit gets [Power]+10000/[Critical]+1 until end of turn.",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Sylvan Horned Beast, Damainaru": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit) && ifYourVanguardIs( 'Sylvan Horned Beast King, Magnolia')){return true} return false},
"cost": {
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    await chooseUnits(1, undefined, (unit)=>{
      canAttackFromBackrowEndTurn(unit)
      increasePowerEndTurn(unit ,5000)
    })
  }
},
"text": "[AUTO]:When this unit is placed on (RC), if your vanguard is \"Sylvan Horned Beast King, Magnolia\", COST [Soul Blast (1)], choose one of your rear-guards, and until end of turn, that unit can attack from the back row, and gets [Power]+5000.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if(thisUnitIsChosenByVanguardAbility(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increasePowerEndTurn(unit, 5000)}
},
"text": "[AUTO](RC)1/Turn:When this unit is chosen by your vanguard's effect, this unit gets [Power]+5000 until end of turn.",
"type": "AUTO",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Rogue Headhunter": {
"ability1": {
"condition": async function (unit){ if(onRC(unit) && ifYouPlayedAnOrderThisTurn() ){return true} return false},
"on": async function (unit){increasePower(unit, 5000)},
"off": async function (unit){increasePower(unit ,-5000)},
"isOn": false,
"text": "[CONT](RC):If you played an order this turn, this unit gets [Power]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
},
"ability2": {
"condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},//come back
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    await addPlayerFunction('Alchemagic' ,  async (orderEffect)=>{ if(orderEffect.cost.counterBlast){
      orderEffect.cost.counterBlast.amount --;

    }   }  , unit)
  }
},
"text": "[AUTO]:When this unit is placed on (RC), the next time you would Alchemagic an order and play it this turn, reduce that cost by Counter Blast (1). (Reduce from the total cost. Does not Counter Charge even if it becomes negative)",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Blaze Fist Monk, Damari": {
"ability1": {
"condition": async function (unit){ if(endOfBattleThisUnitAttackedOnRC(unit)){return true} return false},
"cost": {
  "counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await soulBlast(this.soul.amount) }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await retireOpponentRearguards(1, frontrowRearguards())

    if(ifYourVanguardIs( 'Chakrabarthi Divine Dragon, Nirvana')){
        await callFromDrop(1, grade0())
    }
  }
},
"text": "[AUTO](RC):At the end of the battle this unit attacked, COST [Counter Blast (1) & Soul Blast (1)], choose one of your opponent's front row rear-guards, retire it, and if your vanguard is \"Chakrabarthi Divine Dragon, Nirvana\", choose up to one grade 0 card from your drop, and call it to (RC).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Stealth Dragon, Togachirashi": {
"ability1": {
"condition": async function (unit){ if(whenThisCardIsDiscarded(unit)){return true} return false}, 
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){soulThisCard(unit)}
},
"text": "[AUTO]:When this card is discarded from hand during your turn, you may put this card into your soul.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Dragritter, Iduriss": {
"ability1": {
"condition": async function (unit){if(onRC(unit) && retiredOpponentRearguardThisTurn()){return true} return false }, 
"cost": {
  "discard": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount) }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    await chooseOneOfTheFollowing(
      [{
      text:"This unit gets [Power]+10000 until end of turn." , effect :()=>{increasePowerEndTurn(unit , 10000)} },
      {text:"Put this unit into your soul, choose one of your opponent's grade 2 or greater rear-guards, and retire it." , effect :async ()=>{soulThisUnit(unit) ; await retireOpponentRearguards(1 , grade2OrGreater())}}
    ])
  
  
  }
},
    "text": "[ACT](RC):If your opponent's rear-guard was retired this turn, COST [Counter Blast (1)], and perform one of the following.\n•This unit gets [Power]+10000 until end of turn.\n•Put this unit into your soul, choose one of your opponent's grade 2 or greater rear-guards, and retire it.",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Cleave Muddler": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit) && ifYourVanguardIs( 'Master of Gravity, Baromagnes')){return true} return false},
"cost": {
  "hand": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await discard(this.hand.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increasePowerEndBattle(unit ,5000)
    if(ifYourSoulHas10OrMore()){
      counterCharge(1)
    }
  }
},
"text": "[AUTO](RC):When this unit attacks, if your vanguard is \"Master of Gravity, Baromagnes\", COST [discard a card from your hand], this unit gets [Power]+5000 until end of that battle, and if your soul has ten or more cards, Counter Charge (1).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Legio Wildmaster, Darius": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit) && ifYourOpponentsVanguardIsGrade3orGreater()){return true} return false},
"cost": {
"counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    let power = 5000
    soulCharge(1)
    if(await rearguardAmountCheck(4)){
      power = 10000
    }
    increasePowerEndBattle(unit ,power)
  }
},
"text": "[AUTO](RC):When this unit attacks, if your opponent's vanguard is grade 3, COST [Counter Blast (1)], Soul Charge (1), and this unit gets [Power]+5000 until end of that battle. If you have three or more other rear-guards, [Power]+10000 instead of +5000.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Diabolos Madonna, Mabel": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitBoostsAVanguard(unit) && finalRushOnRC(unit)){return true} return false},
"cost": {
"counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    await chooseUnits(1, vanguard() , (unit)=>{
    giveTripleDriveEndTurn(unit);
    
    }) 
  }
},
"text": "[AUTO](RC):When this unit boosts a vanguard, if you are in \"Final Rush\", COST [Counter Blast (1)], choose one of your vanguards, and it gets \"Triple Drive\" until end of turn. (Drive check three times!)",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Aurora Battle Princess, Derii Violet": {
"ability1": {
"condition": async function (unit){ if(whenPutOnGC(unit) && await opponentImprisonedAmount() > 0){return true} return false},
"cost": {
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    await chooseUnits(1, undefined, (unit)=>{
    if(currentBattle.current.attackingUnit.tempGrade <= 2){
    unit.canBeHit = false
    untilEndBattle((unit)=>{
    unit.canBeHit = true}, unit, undefined)
    }
    })
  }
},
"text": "[AUTO]:When this unit is put on (GC), if one or more of your opponent's cards are imprisoned in your Prison, COST [Soul Blast (1)], choose one of your units, and it cannot be hit by a grade 2 or lower unit's attack until end of that battle.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Cardinal Noid, Thumborino": {
"ability1": {
"condition": async function (unit){ if(ifThisUnitBoosts(unit, 'Shadow Army')){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
  await youMay(unit, (unit)=>{
  increasePowerEndTurn(unit, 15000);
  untilEndBattle(()=>{
  //retire all in col
  doAllUnits(getYourColumn(unit) , (unit)=>{retire(unit)})
  }, unit, undefined)
  
  })
  
  
  } 
},
"text": "[AUTO](RC):When this unit boosts a Shadow Army token, you may have this unit get [Power]+15000 until end of turn. If you do, at the end of that battle, retire all of your rear-guards in the same column as this unit, and draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Ravenous Monster, Marunorm": {
"ability1": {
"condition": async function (unit){if(onRC(unit)){return true} return false },
"cost": {
  "hand": {
    "amount": 1,
    "filter": [
      {
        "cardProperty": "cardtype",
        "propertyToFind": "SetOrder",
        "condition": "includes"
      }
    ]
  },
  "costEffect": async function (unit){await discard(this.hand.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await counterCharge(1)}
},
"text": "[ACT](RC)1/Turn:COST [Discard a set order card from your hand], and Counter Charge (1).",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Soaring Dragon, Prideful Dragon": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit) && await rearguardAmountCheck(5 , grade3Rearguards() )){return true} return false},
"cost": {
  "counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await soulBlast(this.soul.amount) }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
  let eff = draw
  if(personaRodeThisTurn()){
  await youMay(undefined, ()=>{
  eff = ()=>{
  increasePowerEndTurn(unit, 5000);
  increaseCritEndTurn(unit ,1)
  }
  })
  
  }
  eff()
  }
},
"text": "[AUTO](RC):When this unit attacks, if you have four or more grade 3 rear-guards, COST [Counter Blast (1) & Soul Blast (1)], and draw a card. If you persona rode this turn, you may have \"this unit get [Power]+5000/[Critical]+1 until end of turn\" instead of drawing a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Sterilize Angel": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit) && await ifDamageZoneHasNoFaceup() ){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increasePowerEndBattle(unit ,5000)}
},
"text": "[AUTO](RC):When this unit attacks, if your damage zone has no face up cards, this unit gets [Power]+5000 until end of that battle.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Diaglass Sorceress": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRCFrom(unit,'hand') && ( ifYourVanguardIs( 'Pentagleam Sorceress') ||ifYourVanguardIs( 'Hexaorb Sorceress') )){return true} return false},
"cost": {
"counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
      "hand": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await discard(this.hand.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
 let remaining =  await callFromTopX(2,2, units())
    addToZone(remaining, newDeck.MainDeck, remaining, 'deck' , true)
  }
},
"text": "[AUTO]:When this unit is placed on (RC) from hand, if your vanguard is \"Hexaorb Sorceress\" or \"Pentagleam Sorceress\", COST [Counter Blast (1) & discard a card from your hand], look at two cards from the top of your deck, choose up to two unit cards from among them, call them to (RC), and put the rest on the top of your deck in any order.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Maiden of Deep Impression, Urjula": {
"ability1": {
"condition": async function (unit){ if(onRC(unit)){return true} return false}, 
"on": async function (unit){
 
  playerObjects.current.mainPhaseSwitch = switchWithinRow
 
},
"off": async function (unit){
  playerObjects.current.mainPhaseSwitch = defaults.current.mainPhaseSwitch
},
"isOn": false,
"text": "[CONT](RC):When you would move or swap rear-guards during your main phase, you can also move it within the same row.",
"type": "CONT",
"permanent": true,
"cost": null
},
"ability2": {
"condition": async function (unit){ if(onRC(unit)){return true} return false},
"on": async function (unit){allOfYourUnits(this.abilityId , inFrontOfThisUnit(unit) , (card)=>{card.canBeChosen = false},(card)=>{card.canBeChosen = true})}, 
"off": async function (unit){removeAllOfYourUnits(this.abilityId)},
"isOn": false,
"text": "[CONT](RC):Your units in front of this unit cannot be chosen by your opponent's effects.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Strong Fortress Dragon, Gibrabrachio": {
"ability1": {
"condition": async function (unit){if(onRC(unit) && ifYourVanguardIs('Heavy Artillery of Dust Storm, Eugene' )){return true} return false },
"cost": {
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
"thisUnit": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){ await soulBlast(this.soul.amount);await restThisUnit(unit)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await retireOpponentRearguards(1)}
},
"text": "[ACT](RC):If your vanguard is \"Heavy Artillery of Dust Storm, Eugene\", COST [Soul Blast (1) & [Rest] this unit], choose one of your opponent's rear-guards, and retire it.",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
},
"ability2": {
"condition": async function (unit){ if(onRC(unit) && beginningOfBattle() && await opponentRGAmountLessThan(1) ){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){standThisUnit(unit) ; increasePowerEndTurn(unit, 5000)}
},
"text": "[AUTO](RC):At the start of your battle phase, if your opponent has one or less rear-guards, [Stand] this unit, and this unit gets [Power]+5000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Dragon Knight, Nehalem": {
"ability1": {
"condition": async function (unit){ if(whenRodeUponByIncludes(unit , 'Overlord')){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){    await callThisCard(unit)}
},
"text": "[AUTO]:When this unit is rode upon by a unit with \"Overlord\" in its card name, call this card to (RC).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){if(onRC(unit) && ifYourVanguardHasXInItsName(unit , 'Overlord')){return true} return false },
"cost": {
  "soul": {
    "amount": 1,
    "filter":  basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    increasePowerEndTurn(unit ,5000)
    doAllUnits(vanguard() , (unit)=>{
      increasePowerEndTurn(unit ,5000)})
  }
},
"text": "[ACT](RC)1/Turn:If you have a vanguard with \"Overlord\" in its card name, COST [Soul Blast (1)], and this unit and all of your vanguards get [Power]+5000 until end of turn.",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Berserk Dragon": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit) && ifYourVanguardHasXInItsName(unit , 'Overlord')){return true} return false},
"cost": {
"counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    increasePowerEndBattle(unit , 5000)
    resolveNewAbility(unit , counterBlastObject() , async (unit , )=>{await retireOpponentRearguards(1 , grade2OrLess())})

  }
},
"text": "[AUTO](RC):When this unit attacks, if you have a vanguard with \"Overlord\" in its card name, this unit gets [Power]+5000 until end of that battle. Then, COST [Counter Blast (1)], choose one of your opponent's grade 2 or less rear-guards, and retire it.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Blaze Maiden, Tanya": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
"cost": {
"counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await callFromDrop(1, grade0())}
},
"text": "[AUTO]:When this unit is placed on (RC), COST [Counter Blast (1)], choose a grade 0 card from your drop, and call it to (RC).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit)){return true} return false},
"cost": {
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await increaseUnitsPowerEndTurn(1, 5000, grade0())}
},
"text": "[AUTO](RC):When this unit attacks, COST [Soul Blast (1)], choose one of your grade 0 units, and it gets [Power]+5000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Blaze Maiden, Parama": {
"ability1": {
"condition": async function (unit){ if(onGC(unit) && ifYourOpponentsVanguardIsGrade3orGreater()){return true} return false},
"on": async function (unit){increaseShield(unit ,5000)},
"off": async function (unit){increaseShield(unit ,-5000)},
"isOn": false,
"text": "[CONT](GC):If your opponent's vanguard is grade 3 or greater, this unit gets [Shield]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Time Jarett Dragon": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
"cost": {
  "hand": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await handToSoul(this.hand.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)}
},
"text": "[AUTO]:When this unit is placed on (RC), COST [put a card from your hand into your soul], and draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Diabolos Edge, Grantory": {
"ability1": {
"condition": async function (unit){if( onRC(unit)){return true} return false },
"cost": {
  "soul": {
    "amount": 1, 
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    yourOpponentCannotIntercept(this.abilityId)
    untilEndTurn(()=>{
      removeAllOfYourOpponentsUnits(this.abilityId)
    } , unit  )
  }
 
},
"text": "[ACT](RC):COST [Soul Blast (1)], until end of turn, your opponent cannot intercept, and if you are in \"Final Rush\", this unit gets [Power]+5000.",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Freeze Breeze": {
"ability1": {
"condition": async function (unit){ if(whenTheAttackThisUnitBoostedHits(unit) && ifYourVanguardIs('Master of Gravity, Baromagnes')){return true} return false},
"cost":null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){soulCharge(1)

    if(ifYourSoulHas10OrMore()){
      await resolveNewAbility(unit, counterBlastObject(1) , ()=>{draw(2)})
    }
  } 
},
"text": "[AUTO](RC):When the attack this unit boosted hits, if your vanguard is \"Master of Gravity, Baromagnes\", Soul Charge (1), and if your soul has ten or more cards, COST [Counter Blast (1)], and draw two cards.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Diabolos Girls, Natalia": {
"ability1": {
"condition": async function (unit){ if(onGC(unit) && ifYourOpponentsVanguardIsGrade3orGreater()){return true} return false},
"on": async function (unit){increaseShield(unit, 5000)},
"off": async function (unit){increaseShield(unit,-5000)},
"isOn": false,
"text": "[CONT](GC):If your opponent's vanguard is grade 3 or greater, this unit gets [Shield]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Cardinal Noid, Plasteia": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitsAttackHitsOnRC(unit ) && ifThisUnitIsBoostedBy(unit , 'Shadow Army')){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)} 
},
"text": "[AUTO](RC):When this unit's attack boosted by a Shadow Army token hits, draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Cardinal Fang, Marizma": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    let remaining = await lookTopXAdd(userZones.hand , 3 , 1 , world())
    remaining = await rearrange(remaining)
await addToZone(remaining , newDeck.MainDeck , remaining)
  }
},
"text": "[AUTO]:When this unit is placed on (RC), look at three cards from the top of your deck, choose up to one World card from among them, reveal it and put it into your hand, and put the rest on the bottom of your deck in any order.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Cardinal Prima, Ekolpa": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit ) || whenThisUnitBoosts(unit)){return true} return false},
"cost": {
  "otherUnits": {
    "amount": 1,
    "filter": [
      {
        "cardProperty": "name",
        "propertyToFind": "Shadow Army",
        "condition": "="
      }
    ]
  },
  "costEffect": async function (unit){await retireYourRearguards(this.otherUnits.amount , this.otherUnits.filter)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await counterCharge(1)}
},
"text": "[AUTO](RC):When this unit attacks or boosts, if your World is Abyssal Dark Night, COST [retire a Shadow Army token], and Counter Charge (1).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Bizarre Beast, Bagumotor": {
"ability1": {
"condition": async function (unit){if(onRC(unit) && await opponentImprisonedAmount < 2 ){return true} return false },
"cost": {
  "thisUnit": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await restThisUnit(unit)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    await imprisonOpponentCards('drop' , 1, unit())
  } 
},
"text": "[ACT](RC):If one or less of your opponent's cards are imprisoned in your Prison, COST [[Rest] this unit], choose a unit card from your opponent's drop, and imprison it in your Prison.",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Cardinal Draco, Enpyro": {
"ability1": {
"condition": async function (unit){ if(onGC(unit) && ifYourOpponentsVanguardIsGrade3orGreater()){return true} return false},
"on": async function (unit){increaseShield(unit, 5000)},
"off": async function (unit){increaseShield(unit,-5000)},
"isOn": false,
"text": "[CONT](GC):If your opponent's vanguard is grade 3 or greater, this unit gets [Shield]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Exquisite Knight, Olwein": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit) && ifYourVanguardIs('Hexaorb Sorceress')){return true} return false},
"cost": {
  "soul": {
    "amount": 1, 
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    let peek = await lookTopX(2)
  let cards = await clickAbilityZone(peek , 2)
    await rearrange(cards.selected)
await addToZone(cards.selected, newDeck.MainDeck, cards.selected, 'deck' , false)
await rearrange(cards.notSelected)
await addToZone(cards.notSelected, newDeck.MainDeck, cards.notSelected, 'deck' , true)

    

  }
},
"text": "[AUTO]:When this unit is placed on (RC), if your vanguard is \"Hexaorb Sorceress\", COST [Soul Blast (1)], look at two cards from the top of your deck, choose up to two cards from among them, put them on the top of your deck in any order, and put the rest on the bottom of your deck in any order.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if(onRC(unit) && await whenYourDriveCheckRevealsATrigger()){return true} return false},
"cost": {
"counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increasePowerEndTurn(unit ,10000)}
},
"text": "[AUTO](RC):When your drive check reveals a trigger unit, COST [Counter Blast (1)], and this unit gets [Power]+10000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Darkness Maiden, Macha": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit) && ifYourVanguardHasXInItsName(unit , 'Blaster')){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){//come back
    increasePowerEndTurn(unit ,5000);
    await resolveNewAbility(unit ,
     {  "soul": {
      "amount": 1, 
      "filter": basicPropertyArray
    },
    "otherRearguards":{
      "amount": 1,
      "filter": basicPropertyArray
},
    "costEffect": async function (unit){
    await soulBlast(this.soul.amount); await retireYourRearguards(1 , [
      {
        "cardProperty": "id",
        "propertyToFind": unit.id,
        "condition": "!="
      }
    ])
    },
} , async ()=>{
      await callFromTopXShuffleRest(5 , 1 , grade1OrLess())
    })
  }
},
"text": "[AUTO]:When this unit is placed on (RC), if you have a vanguard with \"Blaster\" in its card name, this unit gets [Power]+5000 until end of turn. Then, COST [Soul Blast (1) & retire another rear-guard], look at five cards from the top of your deck, choose up to one grade 1 or less unit card from among them, call it to (RC), and shuffle your deck.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Blaster Dark": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnVC(unit) || whenPlacedOnRC(unit)){return true} return false},
"cost": {
"counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
  "otherRearguards":{
      "amount": 1,
      "filter": basicPropertyArray
},
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await retireYourRearguards(1 , [
      {
        "cardProperty": "id",
        "propertyToFind": unit.id,
        "condition": "!="
      }
    ])}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){  await retireOpponentRearguards(1)
    increaseDriveEndTurn(unit , 1)
  }
},
"text": "[AUTO]:When this unit is placed on (VC) or (RC), COST [Counter Blast (1) & retire another rear-guard], choose one of your opponent's rear-guards, retire it, and this unit gets drive +1 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if(onRC(unit) && duringYourTurn() && yourRearguardWasRetiredThisTurn()){return true} return false},
"on": async function (unit){increasePower(unit , 5000)},
"off": async function (unit){increasePower(unit ,-5000)},
"isOn": false,
"text": "[CONT](RC):During your turn, if your rear-guard was retired this turn, this unit gets [Power]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Witch of Pandering, Brunner": {
"ability1": {
"condition": async function (unit){ if(onRC(unit) && ifYourVanguardHasXInItsName(unit , 'Blaster')){return true} return false},
"on": async function (unit){
  unit['altValue'] = 'retireValue'
  unit.retireValue = 2
},
"off": async function (unit){ 
  unit['altValue'] = ''
   unit.retireValue = 1},
"isOn": false,
"text": "[CONT](RC):If you have a vanguard with \"Blaster\" in its card name, when this unit would be retired for your card's cost, it may be regarded as retiring two rear-guards.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Bard of Heavenly Song, Alpacc": {
"ability1": {
"condition": async function (unit){ if(onGC(unit) && ifYourOpponentsVanguardIsGrade3orGreater()){return true} return false},
"on": async function (unit){increaseShield(unit, 5000)},
"off": async function (unit){increaseShield(unit,-5000)},
"isOn": false,
"text": "[CONT](GC):If your opponent's vanguard is grade 3 or greater, this unit gets [Shield]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Sylvan Horned Beast, Elrante": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit) ){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
//get column -> getColumn(circleId) getopponentColumn(circleId) getOppColumnFromYourUnit(circle)
let allCircles = {
         'userFRRG':{yourCircles : [] , opponentCircles:[ 'opponentFLRG', 'opponentBLRG']},
        'userFLRG':{yourCircles : [] , opponentCircles:[ 'opponentFRRG', 'opponentBRRG']},
        'userBRRG':{yourCircles : ['userFRRG'] , opponentCircles:[ 'opponentFLRG', 'opponentBLRG']},
          'userBLRG':{yourCircles : ['userFLRG'] , opponentCircles:[ 'opponentFRRG', 'opponentBRRG']},
            'userBCRG':{yourCircles : ['userVG'] , opponentCircles:[ 'opponentVG', 'opponentBCRG']},
          
}
 
let circles = allCircles[unit.circle]
let yours = 0
let opponents=  0
 
for(let i = 0; i<2; i++){
  if(currentOpponentCircles.current[circles.opponentCircles[i]].unit){
    opponents ++;
  }
}
if(circles.yourCircles[0] && userCircles[circles.yourCircles[0]].unit){
  yours ++;
}
if(yours + opponents > 1){
  increasePowerEndBattle(unit,  5000)
}
if(yours + opponents > 2){
soulCharge(1)
}

}
},
"text": "[AUTO](RC):When this unit attacks, if two or more units are in front of this unit, this unit gets [Power]+5000 until end of that battle, and if they are three or more, Soul Charge (1).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Fleet Swallower": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit)  && alchemagicOrderThisTurn()){return true} return false},
"cost": {
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){soulBlast(1)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    increasePowerEndBattle(unit , 5000)
    guardRestrictEndBattle(unit , 'twoOrMore')
  }
},
"text": "[AUTO](RC):When this unit attacks, if you Alchemagic an order this turn, COST [Soul Blast (1)], until end of that battle, this unit gets [Power]+5000, and when your opponent would call cards from their hand to (GC), they must call two or more at the same time.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Fairy of Tragic Love": {
"ability1": {
"condition": async function (unit){ if(whenTheAttackThisUnitBoostedHitsAVanguard(unit)){return true} return false},
"cost": {
  "thisUnit": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await bindThisUnit(unit)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){bindToHand(1, orders())}
},
"text": "[AUTO](RC):When the attack this unit boosted hits a vanguard, COST [bind this unit], choose an order card from your bind zone, and put it into your hand.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Sleeve Tugging Belle": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    let bindCard = userZones.bind.length
    await youMay(1 , async ()=>{await addToZone(userZones.bind , userZones.drop , userZones.bind)})

    if(userZones.bind.length === 0){
      increasePowerEndTurn(unit , (bindCard * 5000))
    }
  } 
},
"text": "[AUTO]:When this unit is placed on (RC), you may put all cards from your bind zone into the drop. If you do, this unit gets [Power]+5000 until end of turn for each card put.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Frenzied Heiress": {
"ability1": {
"condition": async function (unit){ if(onGC(unit) && ifYourOpponentsVanguardIsGrade3orGreater()){return true} return false},
"on": async function (unit){increaseShield(unit, 5000)},
"off": async function (unit){increaseShield(unit,-5000)},
"isOn": false,
"text": "[CONT](GC):If your opponent's vanguard is grade 3 or greater, this unit gets [Shield]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Volcanicgun Dragon": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit) && await opponentRGAmountLessThan(0, frontrowRearguards())){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increasePowerEndBattle(unit ,5000)}
},
"text": "[AUTO](RC):When this unit attacks, if your opponent has no front row rear-guards, this unit gets [Power]+5000 until end of that battle.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Crousrock Dragon": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    let chosen = await chooseOpponentUnits(1)
    let circle = await clickCircles(1 , 'opponentFrontRow' , true, true)
 
     socket.emit('fightUpdate', { roomId :roomID,  command:'swapOpponentRG', 
      item : {circleTo : circle[0].replace('opponent' , 'user') ,  circleFrom: chosen[0]}  }) 
  }
},
"text": "[AUTO]:When this unit is placed on (RC), choose one of your opponent's rear-guards, and you may move it to your opponent's open front row (RC).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Dragritter, Nathil": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitIntercepts(unit) && await opponentRGAmountLessThan(2,)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increaseShieldEndBattle(unit ,10000)}
},
"text": "[AUTO]:When this unit intercepts, if your opponent has two or less rear-guards, this unit gets [Shield]+10000 until end of that battle.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Armored Dragon, Mountcannon": {
"ability1": {
"condition": async function (unit){ if(onFrontRowRC(unit) && currentBattle.current.attackingUnit && currentBattle.current.attackingUnit.grade === 0){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    increasePowerEndTurn(unit , 5000)
    increasePowerEndTurn(currentBattle.current.attackingUnit, 5000)
  }
},
"text": "[AUTO](Front Row RC):When your grade 0 unit attacks, this unit and the unit that attacked get [Power]+5000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Dragon Monk, Gojo": {
"ability1": {
"condition": async function (unit){ if(whenTheAttackThisUnitBoostedHits(unit)){return true} return false},
"cost": {
  "thisUnit": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await retireThisUnit(unit)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await counterCharge(1)}
},
"text": "[AUTO](RC):When the vanguard's attack this unit boosted hits, COST [retire this unit], and Counter Charge (1).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Stealth Dragon, Kizanreiji": {
"ability1": {
"condition": async function (unit){if(onRC(unit)){return true} return false },
"cost": {
  "counterBlast": {
    "amount": 1,
    "filter": [
      {
        "cardProperty": "clan",
        "propertyToFind": "",
        "condition": "="
      }
    ]
  },
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await soulBlast(this.soul.amount) }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    let allCircles = {
      'userFRRG':{yourCircles : [] , opponentCircles:[ 'opponentFLRG', 'opponentBLRG']},
     'userFLRG':{yourCircles : [] , opponentCircles:[ 'opponentFRRG', 'opponentBRRG']},
     'userBRRG':{yourCircles : ['userFRRG'] , opponentCircles:[ 'opponentFLRG', 'opponentBLRG']},
       'userBLRG':{yourCircles : ['userFLRG'] , opponentCircles:[ 'opponentFRRG', 'opponentBRRG']},
         'userBCRG':{yourCircles : ['userVG'] , opponentCircles:[ 'opponentVG', 'opponentBCRG']},
       
}
let prop= []
let circles = allCircles[unit.circle].opponentCircles

circles.forEach((circ)=>{prop.push({cardProperty:'circle',propertyToFind:circ, condition:'='})})
    await retireOpponentRearguards(1,prop) 
  }
},
"text": "[ACT](RC)1/Turn:COST [Counter Blast (1) & Soul Blast (1)], choose one of your opponent's rear-guards in the same column as this unit, and retire it.",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Blaze Fist Monk, Enten": {
"ability1": {
"condition": async function (unit){ if(whenTheAttackThisUnitBoostedHits(unit)){return true} return false},
"cost": {
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },

  "thisUnit": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await soulBlast(this.soul.amount);await retireThisUnit(unit)}

},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increaseUnitsPowerEndTurn(1, 10000)}
},
"text": "[AUTO](RC):When the attack this unit boosted hits, COST [Soul Blast (1) & retire this unit], choose one of your units, and it gets [Power]+10000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Blaze Maiden, Aruuna": {
"ability1": {
"condition": async function (unit){if(duringTheBattleThisUnitBoosted(unit) && currentBattle.current.attackingUnit.grade === 0){return true} return false},
"on": async function (unit){increasePower(unit , 5000)},
"off": async function (unit){increasePower(unit , -5000)},
"isOn": false,
"text": "[CONT](RC):During the battle this unit boosted a grade 0, this unit gets [Power]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Embodiment of Armor, Bahr": {
"ability1": {
"condition": async function (unit){ if(whenRodeUponBy(unit, 'Dragon Knight, Nehalem')){return true} return false},
"cost": {
"counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await deckToHand(1, grade1())}
},
"text": "[AUTO]:When this unit is rode upon by \"Dragon Knight, Nehalem\", COST [Counter Blast (1)], search your deck for up to one grade 1 card, reveal it and put it into your hand, and shuffle your deck.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if(onRC(unit) && whenYourVanguardsAttackHits(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increasePowerEndTurn(unit ,5000)}
},
"text": "[AUTO](RC)1/Turn:When your vanguard's attack hits, this unit gets [Power]+5000 until end of turn.",
"type": "AUTO",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Blaze Maiden, Zaara": {
"ability1": {
"condition": async function (unit){ if(onRC(unit) && (await searchCircles([
  {
    "cardProperty": "name",
    "propertyToFind": "Blaze Maiden, Reiyu",
    "condition": "="
  }
]) ||  await searchCircles([
  {
    "cardProperty": "name",
    "propertyToFind": "Blaze Maiden, Rino",
    "condition": "="
  }
])       )){return true} return false},
"on": async function (unit){increasePower(unit ,5000)},
"off": async function (unit){increasePower(unit, -5000)},
"isOn": false,
"text": "[CONT](RC):During your turn, if \"Blaze Maiden, Reiyu\" or \"Blaze Maiden, Rino\" is on your (VC) or (RC), this unit gets [Power]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Lizard Runner, Undeux": {
"ability1": {
"condition": async function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)}
},
"text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Steam Knight, Pashatatal": {
"ability1": {
"condition": async function (unit){if(onRC(unit) && userZones.soul.length <5){return true} return false },
"cost": {
  "thisUnit": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await soulThisUnit(unit)}

},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
   await  increaseUnitsPowerEndTurn(1, 5000)
  }
},
"text": "[ACT](RC):If your soul has four or less cards, COST [put this unit into your soul], choose one of your units, and it gets [Power]+5000 until end of turn.",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Spiracle Splasher": {
"ability1": {
"condition": async function (unit){ if(onRC(unit) && ifYourVanguardIs('Master of Gravity, Baromagnes')){return true} return false},
"on": async function (unit){increasePower(unit ,5000)},
"off": async function (unit){increasePower(unit, -5000)},
"isOn": false,
"text": "[CONT](RC):If your vanguard is \"Master of Gravity, Baromagnes\", this unit gets [Power]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Diabolos Attacker, Arwing": {
"ability1": {
"condition": async function (unit){ if(onVCRC(unit) && whenThisUnitAttacksAVanguard(unit)){return true} return false},
"cost": {
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    let power = 5000
    if(finalRush()){
      power = 15000
    }
    increasePowerEndBattle(unit ,power)
  }
},
"text": "[AUTO](VC/RC):When this unit attacks a vanguard, COST [Soul Blast (1)], and this unit gets [Power]+5000 until end of that battle. If you are in \"Final Rush\", it gets +15000 instead of +5000.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Unbreakable Ice Pillar, Jebinna": {
"ability1": {
"condition": async function (unit){ if(onRC(unit) && whenThisUnitAttacksAVanguard(unit) && ifYourSoulHas10OrMore()){return true} return false},
"cost": {
  "counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await soulBlast(this.soul.amount) }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
      await guardRestrictEndBattle(unit, 'twoOrMore')
  }
},
"text": "[AUTO](RC):When this unit attacks a vanguard, if your soul has ten or more cards, COST [Counter Blast (1) & Soul Blast (1)], and until end of that battle, when your opponent would call cards from their hand to (GC), they must call two or more at the same time.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Steam Artist, Napir": {
"ability1": {
"condition": async function (unit){ if(onGC(unit ) && ifYourSoulHas5OrMore()){return true} return false},
"on": async function (unit){increaseShield(unit ,5000)},
"off": async function (unit){increaseShield(unit ,-5000)},
"isOn": false,
"text": "[CONT](GC):If your soul has five or more cards, this unit gets [Shield]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Diabolos Madonna, Viola": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit) && ifYourVanguardIs('Diabolos, \"Violence\" Bruce')){return true} return false},
"cost": {
"counterBlast": {
    "amount": 2,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increasePowerEndTurn(unit, 10000)}
},
"text": "[AUTO](RC):When this unit attacks, if your vanguard is \"Diabolos, \"Violence\" Bruce\", COST [Counter Blast (2)], and this unit gets [Power]+10000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Pestilent Talon": {
"ability1": {
"condition": async function (unit){ if(onFrontRowRC(unit) && whenYourVanguardIsPlaced(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){soulCharge(1)}
},
"text": "[AUTO](Front Row RC):When your vanguard is placed, Soul Charge (1).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Monitoring Gear Dober": {
"ability1": {
"condition": async function (unit){ if(endOfBattleThisUnitBoosted(unit) && finalRushOnRC(unit)){return true} return false},
"cost": {
  "thisUnit": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await soulThisUnit(unit)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){increaseUnitsPowerEndTurn(1, 10000)}
},
"text": "[AUTO](RC):At the end of the battle this unit boosted, if you are in \"Final Rush\", COST [put this unit into your soul], choose one of your units, and it gets [Power]+10000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Cyclone Circler": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitBoosts(unit) && ifYourSoulHas5OrMore()){return true} return false},
"cost": {
  
"counterBlast": {
"amount": 1,
"filter": [
  {
    "cardProperty": "clan",
    "propertyToFind": "",
    "condition": "="
  }
]
},

  "thisUnit": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await soulThisUnit(unit)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await increaseUnitsPowerEndTurn(3, 5000 , frontrowUnits())}
},
"text": "[AUTO](RC):When this unit boosts, if your soul has five or more cards, COST [Counter Blast (1) & put this unit into your soul], choose three of your front row units, and they get [Power]+5000 until end of turn. (The [Power] gained from this unit's boost will be lost)",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Steam Engineer, Peperi": {
"ability1": {
"condition": async function (unit){ if( whenThisUnitBoostsARearguard(unit) && personaRodeThisTurn()){return true} return false},
"cost": {
  "counterBlast": {
    "amount": 1,
    "filter": [
      {
        "cardProperty": "clan",
        "propertyToFind": "",
        "condition": "="
      }
    ]
  },
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await soulBlast(this.soul.amount) }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){guardRestrictEndBattle(unit , 
    'grade1OrGreater'
  )}
},
"text": "[AUTO](RC):When this unit boosts a rear-guard, if you persona rode this turn, COST [Counter Blast (1) & Soul Blast (1)], and your opponent cannot call grade 1 or greater cards from their hand to (GC) until end of that battle.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Diabolos Boys, Chester": {
"ability1": {
"condition": async function (unit){ if(duringTheBattleThisUnitBoosted(unit) && currentBattle.current.attackingUnit.circle === 'VC'){return true} return false},
"on": async function (unit){increasePower(unit , 5000)},
"off": async function (unit){increasePower(unit , -5000)},
"isOn": false,
"text": "[CONT](RC):During the battle this unit boosted a vanguard, this gets [Power]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Deformed Hammer": {
"ability1": {
"condition": async function (unit){ if(onRC(unit) && duringYourTurn() && ifYourSoulHas5OrMore()){return true} return false},
"on": async function (unit){increasePower(unit ,2000)},
"off": async function (unit){increasePower(unit, -2000)},
"isOn": false,
"text": "[CONT](RC):During your turn, if you have five or more cards in your soul, this unit gets [Power]+2000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},

"Cardinal Draco, Zelgio": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit)){return true} return false},
"cost": {
  "otherUnits": {
    "amount": 1,
    "filter": [
      {
        "cardProperty": "name",
        "propertyToFind": "Shadow Army",
        "condition": "="
      }
    ]
  },

  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount); await retireYourRearguards(1, this.otherUnits.filter)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await guardRestrictEndBattle(unit , 'twoOrMore')}
},
"text": "[AUTO](RC):When this unit attacks, COST [Soul Blast (1) & retire a Shadow Army Token], and until end of that battle, when your opponent would call cards from their hand to (GC), they must call two or more at the same time.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Aurora Battle Princess, Mel Horizon": {
"ability1": {
"condition": async function (unit){ if(onRC(unit) && whenThisUnitAttacksAVanguard(unit)){return true} return false},
"cost": {
"counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await imprisonOpponentRearguards(1);increasePowerEndTurn(unit, 5000)}
},
"text": "[AUTO](RC):When this unit attacks a vanguard, COST [Counter Blast (1)], choose one of your opponent's rear-guards, imprison it in your Prison, and this unit gets [Power]+5000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Hard Fist Dragon, Metalknuckler Dragon": {
"ability1": {
"condition": async function (unit){ if(onRC(unit) && personaRodeThisTurn()){return true} return false},
"on": async function (unit){increasePower(unit, 5000)},
"off": async function (unit){increasePower(unit ,-5000)},
"isOn": false,
"text": "[CONT](RC):If you persona rode this turn, this unit gets [Power]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Twisting Bulldoze": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit) 

){
  let yourRG = await searchCircles(rearguard())
  let oppRG = await searchCircles(rearguard() , 'opponent')
  if(yourRG.length > oppRG.length){
    return true
  }
  } return false},
"cost": {
  "counterBlast": {
    "amount": 1,
    "filter": [
      {
        "cardProperty": "clan",
        "propertyToFind": "",
        "condition": "="
      }
    ]
  },
 
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);  }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await soulCharge(1); increasePowerEndBattle(unit , 10000)}
},
"text": "[AUTO](RC):When this unit attacks, if the number of your rear-guards is more than your opponent's, COST [Counter Blast (1)], Soul Charge (1), and this unit gets [Power]+10000 until end of that battle.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Cardinal Fang, Estrett": {
"ability1": {
"condition": async function (unit){ if(onRC(unit) &&ifYourWorldIsAbyssalDarkNight() &&(endOfTurn()|| endOfOpponentsTurn())){return true} return false}, 
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    if(duringYourTurn()){
      await retireYourRearguards(1)
      await makeOpponent(unit)
    }
    else{
      await makeOpponent(unit)
      await retireYourRearguards(1)
    
    }
  }
},
"text": "[AUTO](RC):At the end of each turn, if your World is Abyssal Dark Night, both you and your opponent choose one of your own rear-guards, and retire them. (The turn fighter chooses the unit to retire first)",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Aurora Battle Princess, Birett Canary": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    let imprisoned =  await opponentImprisoned()
    let cards = await clickAbilityZone( imprisoned, 1)
    let ids = cards.selected.map((card)=>card.id)
 
 
    await moveOpponentCards('opponentImprisoned' , 'drop' , cards.selected)

  }
},
"text": "[AUTO]:When this unit is placed on (RC), choose one of your opponent's imprisoned cards in your Prison, and put it into their drop.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Harming Bite Monster, Zabocanni": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitsAttackHitsAVanguard(unit) && onRC(unit) && unit.isBoosted){return true} return false},
"cost": {
  "counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await soulBlast(this.soul.amount) }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)}
},
"text": "[AUTO](RC):When this unit's attack hits a vanguard, if this unit was boosted, COST [Counter Blast (1), Soul Blast (1)], draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Cardinal Prima, Altepo": {
"ability1": {
"condition": async function (unit){ if(whenPutOnGC(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    if(ifYourWorldIsDarkNight()){soulCharge(1)}
    if(ifYourWorldIsAbyssalDarkNight()){soulCharge(2)}
  }
},
"text": "[AUTO]:When this unit is put on (GC), if your World is Dark Night, Soul Charge (1). If it is Abyssal Dark Night, Soul Charge (2).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Aurora Battle Princess, Roudend Azalea": {
"ability1": {
"condition": async function (unit){ if(duringTheBattleThisUnitBoosted(unit) && opponentImprisonedAmount() > 1){return true} return false}, 
"on": async function (unit){increasePower(unit , 5000)},
"off": async function (unit){increasePower(unit , -5000)},
"isOn": false,
"text": "[CONT](RC):During the battle this unit boosted, if two or more of your opponent's cards are imprisoned in your Prison, this unit gets [Power]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Aurora Battle Princess, Wapper Plun": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit) && await opponentImprisonedAmount() > 4){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){

    await chooseOneOfTheFollowing([
      {text: 'Counter Charge ' , effect : async ()=>{await counterCharge(1)}} ,   {text: 'Soul Charge ' , effect : async ()=>{await soulCharge(3)}}
    ])
  }
},
"text": "[AUTO]:When this unit is placed on (RC), if five or more of your opponent's cards are imprisoned in your Prison, Counter Charge (1) or Soul Charge (3).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Spinvac Robo, Ramroot": {
"ability1": {
"condition": async function (unit){ if(onRC(unit) && await ifOrderZoneHasASetOrder()){return true} return false},
"on": async function (unit){getsIntercept(unit)},
"off": async function (unit){removeIntercept(unit)},
"isOn": false,
"text": "[CONT](RC):If you have a Set Order in your order zone, this unit gets \"Intercept\".",
"type": "CONT",
"permanent": true,
"cost": null
}
},

"Eclipsed Moonlight": {
"ability3": {
"condition": async function (unit){ if(whenThisCardIsPutIntoOrderZone(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await callToken('Shadow Army' , 1)}
},
"text": "[AUTO]:When this card is put into order zone, call a Shadow Army token to (RC). (Shadow Army has [Power]15000 and Boost)",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability4": {
"condition": async function (unit){ if(inOrderZone(unit) && await ifOrderZoneHasOnlyWorlds()){return true} return false},
"on": async function (unit){},
"off": async function (unit){},
"isOn": false,
"text": "[CONT](Order Zone):If your order zone only has World cards, the following effects are active according to the number of cards in your order zone.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Virulence Dragon": {
"ability1": {
"condition": async function (unit){ if(retiredForCost(unit)){return true} return false},
"cost": {
  "counterBlast": {
    "amount": 1,
    "filter": [
      {
        "cardProperty": "clan",
        "propertyToFind": "",
        "condition": "="
      }
    ]
  },
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await soulBlast(this.soul.amount) }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){doAllUnits(blaster() , (card)=>{increasePowerEndTurn(card , 5000)})}
},
"text": "[AUTO]:When this unit is retired from (RC) for the cost of your card, COST [Counter Blast (1) & Soul Blast (1)], and all of your units with \"Blaster\" in their card names get [Power]+5000 until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Octadevote Sorceress": {
"ability1": {
"condition": async function (unit){ if(await whenYourDriveCheckRevealsATrigger(unit) && ifYourVanguardIs('Hexaorb Sorceress')){return true} return false},
"cost": {
  "thisUnit": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){retireThisUnit(unit)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
await chooseOneOfTheFollowing([
  {text: 'Counter Charge ' , effect : async ()=>{await counterCharge(1)}} ,   {text: 'Soul Charge ' , effect : async ()=>{await soulCharge(1)}}
])

  }
},
"text": "[AUTO](RC):When your drive check reveals a trigger unit, if your vanguard is \"Hexaorb Sorceress\", COST [retire this unit], and Counter Charge (1) or Soul Charge (1).",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Heavenly Staff of Kind Intention, Colthese": {
"ability1": {
"condition": async function (unit){ if(whenYourDriveCheckReveals([{cardProperty:'id' , propertyToFind: unit.id , condition:'='}])){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await youMay(1, async () =>{await callThisCard(unit , 'userCircles' , true , (unit)=>{giveBoostEndTurn(unit)})})}  
},
"text": "[AUTO]:When this card is revealed for your drive check, you may call this card to an open (RC). If you do, this unit gets \"Boost\" until end of turn.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Heavenly Blade of Sublime, Bethida": {
"ability1": {
"condition": async function (unit){ if(whenThisCardIsDiscarded(unit) && duringYourTurn()){return true} return false},
"cost": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){
    await counterBlast(2); await soulBlast(1)
  }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
 
      let circles = await getOpponentColumn()
      await removeOpponentUnits(circles , 'botDeck')


  }
},
"text": "[AUTO]:When this card is discarded from hand during your turn, COST [Counter Blast (2) & Soul Blast (1)], you choose a column, and your opponent puts all of their rear-guards in that same column on the bottom of their deck in any order.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Divine Sister, Petit Four": {
"ability1": {
"condition": async function (unit){ if(onGC(unit) && await ifYouHave3OrMoreGrade3()){return true} return false},
"on": async function (unit){increaseShield(unit ,5000)},
"off": async function (unit){increaseShield(unit, -5000)},
"isOn": false,
"text": "[CONT](GC):If you have three or more grade 3 units, this unit gets [Shield]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Knight of Heavenly Destruction, Kapald": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRCFrom(unit , 'hand')){return true} return false},
"cost": {
  "counterBlast": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "otherUnits": {
    "amount": 1,
    "filter": rearguard()
  },
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount); await chooseUnits(1, this.otherUnits.filter, (unit)=>{rest(unit)}) }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){

    let cards = await lookTopX(1)
    await reveal(1 , cards)
    let isOrder = await searchZones(cards , orders())
    let isG3 = await searchZones(cards , grade3())
    if( isOrder.length > 0|| isG3.length > 0 ){
      addToZone(cards,  userZones.hand , cards)
    }
    else{
      await callFromAbilityZone(cards,1 , cards)
    }
  }
},
"text": "[AUTO]:When this unit is placed on (RC) from hand, COST [Counter Blast (1) & [Rest] another rear-guard], reveal the top card of your deck, put it into your hand if it is an order card or a grade 3, and call it to (RC) if it isn't.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Additional Angel": {
"ability1": {
"condition": async function (unit){if(whenPlacedOnRC(unit)){return true} return false },
"cost": {
  "soul": {
    "amount": 1, 
    "filter": basicPropertyArray
  },
 
  "thisUnit": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await soulBlast(this.soul.amount) ; await damage(unit)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){await callFromDamage(1 , newPropertyArray([grade3() , faceup()]))}
},
"text": "[ACT](RC):COST [Soul Blast (1) & Put this unit into your damage zone], choose a face up grade 3 card from your damage zone, and call it to (RC).",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Advancement Magic, Melcoco": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
"cost": {
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount); await discard(1)}
},
"text": "[AUTO]:When this unit is placed on (RC), COST [Soul Blast (1)], draw a card, choose a card from your hand, and discard it.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Knight of Heavenly Roar, Reedy": {
"ability1": {
"condition": async function (unit){if(onRC(unit)){return true} return false },
"cost": {
  "soul": {
    "amount": 2,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    makeConditionalContinuous(this.abilityId , unit , ()=>{if(userZones.trigger[0] ) {
 
      let card  =userZones.trigger[0]
      if( card.triggereffect && card.state === 'revealedForDriveCheck'){
        card.triggerPower += 5000
        untilEndTurn(()=>{
 
          card.triggerPower -=5000
        } , card)
}
    }}  )  
    untilEndTurn(()=>{removeConditionalContinuous(this.abilityId)} , unit)

  } 
},
"text": "[ACT](RC):COST [Soul Blast (2)], and until end of turn, the [Power] increase of the trigger effects revealed by your drive check gets +5000.",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Blaster Javelin": {
"ability1": {
"condition": async function (unit){ if(whenRodeUponBy(unit , 'Blaster Dark')){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
let cards = await revealTopX(1)

if(cards[0].cardtype.includes('Unit')){

    await callFromAbilityZone(cards , 1 , cards , undefined , false , (called)=>{
      rest(called)
    })

}
else{
  await putDrop(cards)
}

  }
},
"text": "[AUTO]:When this unit is rode upon by \"Blaster Dark\", reveal the top card of your deck, call it to (RC) as [Rest] if it is a unit card, and discard it if it isn't.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
},
"ability2": {
"condition": async function (unit){ if(onRC(unit) && duringYourTurn() &&ifYourVanguardHasXInItsName(unit , 'Blaster')){return true} return false},
"on": async function (unit){increasePower(unit , 2000)},
"off": async function (unit){increasePower(unit, -2000)},
"isOn": false,
"text": "[CONT](RC):During your turn, if you have a vanguard with \"Blaster\" in its card name, this unit gets [Power]+2000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Black Sage, Charon": {
"ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit) && ifYourVanguardHasXInItsName(unit, 'Blaster')){return true} return false},
"cost": {
  "thisUnit": {
    "amount": 1,
    "filter": standUnits()
  },
   "costEffect": async function (unit){await restThisUnit(unit)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    let cards = await lookTopX(1)

    if(cards[0].cardtype.includes('Unit')){
      await youMay(1 , async ()=>{
        await callFromAbilityZone(cards , 1 , cards , undefined , false , (called)=>{
          untilEndTurn(()=>{retire(called)} , called)
        })
      })
    }
    else{
      putTopDeck(cards)
    }

  }
},
"text": "[AUTO]:When this unit is placed on (RC), if you have a vanguard with \"Blaster\" in its card name, COST [[Rest] this unit], look at the top card of your deck, and you may call it to (RC) if it is a unit card. At the end of that turn, retire that called unit. (Put it on the top of the deck if you did not call)",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Fullbau": {
"ability1": {
"condition": async function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){draw(this.draw.amount)}
},
"text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Shieldfisher Dragon": {
"ability1": {
"condition": async function (unit){ if(onVCRC(unit) && calledRearguardOtherHandThisTurn()){return true} return false},
"on": async function (unit){unit.canAttack = true},
"off": async function (unit){unit.canAttack = false},
"isOn": true,
"text": "[CONT](VC/RC):This unit can only attack if you called rear-guards other than from hand this turn.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Iron Anchor Resentment Dragon": {
"ability1": {
"condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false},
"on": async function (unit){},
"off": async function (unit){},
"isOn": false,
"text": "[CONT](VC):When you would play a normal order, you can bind a normal order with the same card name from your drop, and Alchemagic. (Combine the costs, and add the effect to the back!)",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Coffin Shooter": {
"ability1": {
"condition": async function (unit){if(inDrop(unit)){return true} return false },
"cost": {
  "soul": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   
 'drop' :{
  "amount": 1,
  "filter": orders()
 },
 "costEffect": async function (unit){await soulBlast(this.soul.amount); await toBind(userZones.drop , this.drop.amount , this.drop.filter)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    await callThisCard(unit , undefined, true)
  } 
},
"text": "[ACT](Drop)1/Turn:COST [Soul Blast (1), bind an order card from drop], call this card to an open (RC).",
"1/Turn": true,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Sylvan Horned Beast, Bojalcorn": {
"ability1": {
"condition": async function (unit){if(onRC(unit)){return true} return false },
"cost": {
  "discard": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await counterBlast(this.counterBlast.amount) }
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    unit.attackFunction = attackFrontrow
    untilEndTurn(()=>{unit.attackFunction = null} , unit)
  }
},
"text": "[ACT](RC):COST [Counter Blast (1)], and until end of turn, this unit gets [CONT](Back Row RC):When this unit would attack, this unit battles all of your opponent's front row units.\".",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Indiscriminate Shooting Mutant, Barretwasp": {
"ability1": {
"condition": async function (unit){ if(onBackRowRC(unit)){return true} return false},
"on": async function (unit){
unit.canIntercept = true
},
"off": async function (unit){
  unit.canIntercept = false
},
"isOn": false,
"text": "[CONT](RC):This unit can intercept from the back row.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Roaring Pistil, Langeena": {
"ability1": {
"condition": async function (unit){ if(onGC(unit)){ 
  let dropOrders = await searchZones(userZones.drop, orders())
  let bindOrders = await searchZones(userZones.bind, orders())
  if((dropOrders.length + bindOrder.length) >= 3){return true}} return false},
"on": async function (unit){
increaseShield(unit, 5000)
},
"off": async function (unit){
  increaseShield(unit, -5000)
},
"isOn": false,
"text": "[CONT](GC):If you have a total of three or more order cards in your drop and bind zone, this unit gets [Shield]+5000.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Promised Brave Shooter": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit)){return true} return false},
"cost": {
  "soul": {
    "amount": 2,  
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
    let circles = await searchCircles(otherRearguard(unit))
    increasePowerEndBattle(unit, (5000 * circles.length))
  }
},
"text": "[AUTO](RC):When this unit attacks, COST [Soul Blast (2)], this unit gets [Power]+5000 until end of battle for each of your other rear-guards.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Sylvan Horned Beast, Tealuf": {
"ability1": {
"condition": async function (unit){ if(1){return true} return false},
"on": async function (unit){unit.cannotBePlacedOn = ['userFRRG' , 'userFLRG'] ; unit.cannotBeMovedTo = ['userFRRG' , 'userFLRG']  ; unit.canBeRidden = false},
"off": async function (unit){unit.cannotBePlacedOn = [] ; unit.cannotBeMovedTo = []  ; unit.canBeRidden = true},
"isOn": false,
"text": "[CONT]:This card cannot be ridden, called or moved to the front row.",
"type": "CONT",
"permanent": true,
"cost": null
}
},
"Lady Demolish": {
"ability1": {
"condition": async function (unit){ if(whenTheAttackThisUnitBoostedHitsAVanguard(unit) ){return true} return false},
"cost": null,
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
await youMay(0 , ()=>{mill(5)})
  } 
},
"text": "[AUTO](RC):When the attack this unit boosted hits a vanguard, you may discard the top five cards of your deck.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Sylvan Horned Beast, Bilber": {
"ability1": {
"condition": async function (unit){if(onRC(unit)){return true} return false },
"cost": {
  "soul": {
    "amount": 1, 
    "filter": basicPropertyArray
  },
  "thisUnit": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await soulBlast(this.soul.amount) ; await retireThisUnit(unit)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
   let cards =  await callFromTopX(3 , 1, units() , 'userBackRow' , false , )
   await addToZone(cards , userZone.drop , cards)
  }
},
"text": "[ACT](RC):COST [Soul Blast (1) & retire this unit], look at three cards from the top of your deck, choose up to one unit card from among them, call it to a back row (RC), and discard the rest. That called unit cannot be moved to another (RC) until end of turn.",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"type": "ACT",
"permanent": true,
"costPaid": false
}
},
"Sylvan Horned Beast, Croucotte": {
"ability1": {
"condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit) || whenThisUnitBoosts(unit)){return true} return false},
"cost": {
  "soul": {
    "amount": 1, 
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount)}
},
"effect": {
  "draw": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "effect": async function (unit){
let rgNum = await searchCircles(rearguard())
increasePowerEndBattle(unit , (rgNum.length * 2000))

}
},
"text": "[AUTO](RC):When this unit attacks or boosts, COST [Soul Blast (1)], and this unit gets [Power]+2000 until end of that battle for each of your rear-guards.",
"type": "AUTO",
"1/Turn": false,
"Used1/Turn": false,
"H1/Turn": false,
"permanent": true
}
},
"Vairina Exspecta": {
  "ability2": {
    "condition": async function (unit){ if(onRC(unit)){return true} return false},
    "on": async function (unit){ makeConditionalContinuous(this.abilityId , unit , ()=>{if(onRC(unit) && ifOverDress(unit) )return true }
      , (unit)=>{let power = 0 ; unit.originalDress.forEach((card)=>{
        power += card.power
      })  ; increasePower(unit , power)}
      , (unit)=>{let power = 0 ; unit.originalDress.forEach((card)=>{
        power += card.power
      }); increasePower(unit , -power) }
  
  )},
    "off": async function (unit){ removeConditionalContinuous(this.abilityId)},
    "isOn": false,
    "text": "[CONT](RC):This unit gets the original [Power] of all of its originalDress. (Active on opponent's turn too)",
    "type": "CONT",
    "permanent": true,
    "cost": null
  },
  "ability3": {
    "condition": async function (unit){ if(onRC(unit) && whenThisUnitAttacksAVanguard(unit) && ifYourOpponentsVanguardIsGrade3orGreater() && ifOverDress(unit)){return true} return false},
    "cost": {
"counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
    },
    "effect": {

      "effect": async function (unit){
        increasePowerEndBattle(unit , 15000) ;     increaseCritEndBattle(unit , 1) ;
        untilEndBattle(()=>{ 
          addToZone(unit.originalDress , userZones.drop , unit.originalDress);
          unit.isOverDress = false
          unit.originalDress = undefined
        } , unit)
      }
    },
    "text": "[AUTO](RC):When this unit attacks a grade 3 or greater vanguard, if this unit is in the [overDress] state, COST [Counter Blast (1)], and this unit gets [Power]+15000/[Critical]+1 until end of that battle. At the end of that battle, put all of this unit's originalDress into the drop. ([overDress] state ends if there is no originalDress)",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Howitzer of Dust Storm, Dustin": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnRC(unit) && ifYourVanguardIs('Heavy Artillery of Dust Storm, Eugene')){return true} return false},
    "cost": {
    "hand": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await handToSoul(this.hand.amount)}
    },
    "effect": {

      "effect": async function (unit){draw(this.draw.amount); await retireOpponentRearguards(1 ,grade2OrGreater())}
    },
    "text": "[AUTO]:When this unit is placed on (RC), if your vanguard is \"Heavy Artillery of Dust Storm, Eugene\", COST [put a card from your hand into your soul], draw a card, choose one of your opponent's grade 2 or greater rear-guards, and retire it.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  },
  "ability2": {
    "condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit)){return true} return false},
    "soul": {
      "amount": 1, 
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)},
    "effect": {

      "effect": async function (unit){
        let oppUnits = await searchCircles(rearguard() , 'opponent')
        let openRG = 5 - oppUnits.length
        increasePowerEndBattle(unit , openRG * 2000)
      }
    },
    "text": "[AUTO](RC):When this unit attacks, COST [Soul Blast (1)], and this unit gets [Power]+2000 until end of that battle for each of your opponent's open (RC).",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Avaricious Demonic Dragon, Greedon": {
  "ability1": {
    "condition": async function (unit){ if(onVC(unit) && ifYourSoulHas('Avaricious Demonic Dragon, Greedon')){return true} return false},
    "on": async function (unit){ playerObjects.current.damageToLose = 7},
    "off": async function (unit){ playerObjects.current.damageToLose = 6},
    "isOn": false,
    "text": "[CONT](VC):If your soul has an \"Avaricious Demonic Dragon, Greedon\", the number of cards in your damage zone for you to lose becomes seven.",
    "type": "CONT",
    "permanent": true,
    "cost": null
  },
  "ability2": {
    "condition": async function (unit){ if(endOfBattleThisUnitAttackedOnVC(unit)){return true} return false},
      "cost" : { 
        "soul": {
      "amount": 2, 
      "filter": basicPropertyArray
    },
    'rg' : {
      "amount": 4, 
      "filter": standUnits()
    } ,
    "costEffect": async function (unit){await soulBlast(this.soul.amount); await soulYourRearguards(this.rg.amount, this.rg.filter)},
  },
    "effect": {

      "effect": async function (unit){standThisUnit(unit); if(ifYourSoulHas10OrMore()){icnreasePowerEndTurn(unit , 15000)}}
    },
    "text": "[AUTO](VC):At the end of the battle this unit attacked, COST [Soul Blast (2) & put four [Stand] rear-guards into your soul], and [Stand] this unit. If your soul has ten or more cards, this unit gets [Power]+15000 until end of turn.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Diabolos Returner, Deryck": {
  "ability1": {
    "condition": async function (unit){ if(finalRushOnRC(unit)){return true} return false},
    "on": async function (unit){ increasePower(unit , 5000)},
    "off": async function (unit){increasePower(unit , -5000) },
    "isOn": false,
    "text": "[CONT](RC):If you are in \"Final Rush\", this unit gets [Power]+5000.",
    "type": "CONT",
    "permanent": true,
    "cost": null
  },
  "ability2": {
    "condition": async function (unit){onRC(unit) },
    "cost": {
"counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "rg":{
      "amount": 1,
      "filter": basicPropertyArray
},
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount); await soulYourRearguards(1)}
 
    },
    "effect": {

      "effect": async function (unit){
        let amount = ~~(userZones.soul.length / 4)
        await retireOpponentRearguards(amount);
        if(finalRush()){
  let num = await opponentOpenRC()
  let theRest = await callFromTopX(num, num, units())
       await addToZone(theRest, userZones.soul, theRest)
        }
      }
    },
    "text": "[ACT](RC)1/Turn:COST [Counter Blast (1) & put a rear-guard into your soul], choose one of your opponent's rear-guards for every four cards in your soul, and retire it. Then, if you are in \"Final Rush\", look at the same number of cards from the top of your deck as the number of your opponent's open (RC), choose any number of unit cards from among them, call them to (RC), and put the rest into your soul.",
    "1/Turn": true,
    "Used1/Turn": false,
    "H1/Turn": false,
    "type": "ACT",
    "permanent": true,
    "costPaid": false
  }
},
"Gravidia Nordlinger": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnVC(unit)){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){await deckToOrder(2, meteorite())}
    },
    "text": "[AUTO]:When this unit is placed on (VC), search your deck for up to two Meteorite cards, put them into your Order Zone, and shuffle your deck.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  },
  "ability2": {
    "condition": async function (unit){ if(whenThisUnitAttacksOnVC(unit)){return true} return false},
cost:{
  "counterBlast": {
      "amount":1,
      "filter": basicPropertyArray
    },
    'orderZone' : {
      'amount': 1,
      'filter' : meteorite()
      },
  "costEffect": async function (){

    let howManyMeteor = userZones.orderZone.filter((card)=>{return card.cardtype.includes('Meteorite')}) 
    let options = []
    for(let i= 1;i< howManyMeteor.length + 1; i ++){
      let num = i 

      options.push({
        text : 'Put '+  i , effect: ()=>{turnState.current['tempCB'] = i
 
        }
      })
    }
    await chooseOneOfTheFollowing(options)
await counterBlast(this.counterBlast.amount)
await orderToDrop(turnState.current['tempCB'] , meteorite())
 
  } 
},
    "effect": {

      "effect": async function (unit){
      let meteorAmount = turnState.current['tempCB']
        increasePowerEndBattle(unit, 15000)
        if(meteorAmount >= 3){
          increaseCritEndBattle(unit, 1)
        }
        if(meteorAmount >= 5){
          makeConditionalContinuous(this.abilityId , unit , async ()=>{if(userZones.trigger[0] ) {
 
            let card  =userZones.trigger[0]
            if( card.triggereffect && card.state === 'revealedForDriveCheck'){
 
              await triggerHandler(card)
      }
          }}  )  
          untilEndBattle(()=>{removeConditionalContinuous(this.abilityId)} , unit)
      
        }


      }
    },
    "text": "[AUTO](VC):When this unit attacks, COST [Counter Blast (1) & put one or more Meteorites from your Order Zone into your drop], until end of that battle, this unit gets [Power]+15000, if you put three or more Meteorite cards into your drop for this cost, it gets [Critical]+1, and if you put five or more, your trigger effects activate twice.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Cardinal Draco, Destijade": {
  "ability1": {
    "condition": async function (unit){ if(onRC(unit)){return true} return false},
    "on": async function (unit){  
      makeConditionalContinuous(this.abilityId, unit , 
      async ()=>{if(ifYourWorldIsDarkNight()) {
 
    }}, (unit)=>{increasePower(unit, 2000)}, (unit)=>{increasePower(unit , -2000)}, )  
    makeConditionalContinuous(this.abilityId + 1, unit , 
      async ()=>{if(ifYourWorldIsAbyssalDarkNight()) {
 
    }}, (unit)=>{increasePower(unit, 5000)}, (unit)=>{increasePower(unit , -5000)}, )  
  
  
  
  },
    "off": async function (unit){
      removeConditionalContinuous(this.abilityId)
      removeConditionalContinuous(this.abilityId + 1)

     },
    "isOn": false,
    "text": "[CONT](RC):If your World is Dark Night, this unit gets [Power]+2000. If it is Abyssal Dark Night instead, this unit gets [Power]+5000. (Active on your opponent's turn too)",
    "type": "CONT",
    "permanent": true,
    "cost": null
  },
  "ability2": {
    "condition": async function (unit){ if(endOfBattleThisUnitAttackedOnRC(unit)){return true} return false},
cost:{   
  "otherRearguards":{
  "amount": 3,
  "filter": shadowArmy()
},
"costEffect": async function (unit){await retireYourRearguards(this.otherRearguards.amount , this.otherRearguards.filter)}},
    "effect": {

      "effect": async function (unit){
        await standThisUnit(unit)
      }
    },
    "text": "[AUTO](RC):At the end of the battle this unit attacked, COST [retire three Shadow Army tokens], and [Stand] this unit.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Heavenly Shock of Distinction, Lagrele": {
  "ability1": {
    "condition": async function (unit){ if(whenThisUnitAttacksAVanguard(unit) && onRC(unit)){return true} return false},
cost:{
  "counterBlast": {
      "amount":0,
      "filter": basicPropertyArray
    },
    'rg' : {
      'amount': 0,
      'filter' : basicPropertyArray
      },
  "costEffect": async function (){

    let howManyRG = await searchCircles(rearguard()) 
    let options = []
    for(let i= 0;i< howManyRG.length; i ++){
      let num = i 

      options.push({
        text : 'Put '+  i , effect: ()=>{turnState.current['tempCB'] = i
 
        }
      })
    }
    await chooseOneOfTheFollowing(options)
await counterBlast(this.counterBlast.amount)
await restYourRearguards(turnState.current['tempCB'] )
 
  } 
},
    "effect": {

      "effect": async function (unit){
        let restAmount = turnState.current['tempCB'] 
        unit.canDrive = true
        increasePower(unit, 5000)
 

        untilEndBattle(async ()=>{
          increasePower(unit ,-5000);
          unit.canDrive = false
          if(restAmount <=3){
            await discard(3)
          }
          if(restAmount <=1){
            await discard(2)
          }
        } , unit)
      }
    },
    "text": "[AUTO](RC):When this unit attacks a vanguard, COST [Counter Blast (2) & [Rest] any number of other rear-guards], until end of that battle, this unit performs drive check, and gets [Power]+5000. At the end of that battle, if three or less units were [Rest] for this cost, choose three cards from your hand, discard them, and if one or less units were [Rest] for this cost, choose two cards from your hand, discard them. (Drive check is performed after guardian's call)",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Magic of Objective, Kakarone": {
  "ability1": {
"condition": async function (unit){ if(whenPlacedOnRC(unit) && ( ifYourVanguardIs( 'Pentagleam Sorceress') ||ifYourVanguardIs( 'Hexaorb Sorceress') )){return true} return false},

cost:{
  "soul": {
    "amount": 1, 
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount)}
},
    "effect": {

      "effect": async function (unit){
        await rearrangeTopX(2)
      }
    },
    "text": "[AUTO]:When this unit is placed on (RC), if your vanguard is \"Hexaorb Sorceress\" or \"Pentagleam Sorceress\", COST [Soul Blast (1)], look at two cards from the top of your deck, and put them on the top of your deck in any order.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  },
  "ability2": {
    "condition": async function (unit){ if(onRCGC(unit)&& ifYourVanguardIs( 'Hexaorb Sorceress') ){return true} return false},
    "on": async function (unit){increasePower(unit, 2000);increaseShield(unit ,5000) },
    "off": async function (unit){increasePower(unit, -2000);increaseShield(unit ,-5000)},
    "isOn": false,
    "text": "[CONT](RC/GC):If your vanguard is \"Hexaorb Sorceress\", this unit gets [Power]+2000/[Shield]+5000. (Active on your opponent's turn too)",
    "type": "CONT",
    "permanent": true,
    "cost": null
  }
},
"Flagship Dragon, Flagburg Dragon": {
  "ability1": {
    "condition": async function (unit){ if(whenThisUnitAttacksAVanguard(unit)&& onVC(unit)){return true} return false},
cost:{
  "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
    "effect": {

      "effect": async function (unit){
        await performAll([
          {effect: async ()=>{
              draw()
          } , value : 3 , condition: '<='},
          {effect: async ()=>{
            await retireOpponentRearguards(2)
          } , value :4 , condition: '<='},
          {effect: async ()=>{
              increasePowerEndBattle(unit ,10000)
              guardRestrictEndBattle(unit, 'threeOrMore')
          } , value : 5 , condition: '<='},        
  
        ] , playerObjects.current.attacksThisTurn)
      }
    },
    "text":"[AUTO](VC):When this unit attacks a vanguard, COST [Counter Blast (1)], and perform all of the effects below according to the number of times you attacked this turn."+
 "•3 or more ‐ Draw a card. " +
"•4 or more ‐ Choose two of your opponent's rear-guards, and retire them."+
"•5 or more ‐ Until end of that battle, this unit gets [Power]+10000, and when your opponent would call cards from their hand to (GC), they must call three or more at the same time." ,
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Shadowcloak": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnRCFrom(unit, 'hand')){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){
        let obj = await clickAbilityZone(newDeck.MainDeck, 1, orders())
        
        let selected = obj.selected
 
        if(selected.length !==0){
          let inDrop = await searchZones(userZones.drop, nameIsX(selected[0].name))
 
          if(inDrop.length === 0){
            addToZone(selected , userZones.drop , obj.selected)
          }
          else{
            addToZone(selected , userZones.hand , obj.selected)
          }
        }

      }
    },
    "text": "[AUTO]:When this unit is placed on (RC) from hand, search your deck for up to one order card and reveal it, and if your drop does not have a card with the same card name as that card, discard the revealed card. Shuffle your deck.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  },
  "ability2": {
    "condition": async function (unit){ if(whenYouPlay([]) &&   onRC(unit)){return true} return false},
cost:{    
  "soul": {
  "amount": 1, 
  "filter": basicPropertyArray
},
"costEffect": async function (unit){await soulBlast(this.soul.amount)}},
    "effect": {

      "effect": async function (unit){
        increasePowerEndTurn(unit , 5000);
        if(duringAlchemagic()){
          await youMay(1 , async()=>{
            await bounceYourRearguards(1)
          })
        }
      }
    },
    "text": "[AUTO](RC):When you play an order, COST [Soul Blast (1)], and this unit gets [Power]+5000 until end of turn. If it was Alchemagic, choose one of your other rear-guards, and you may return it to your hand.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Stealth Dragon, Fushimachi Madoka": {
  "ability1": {
    "condition": async function (unit){ if(onRCGC(unit)){return true} return false},
    "on": async function (unit){ makeConditionalConintuous(this.abilityId, unit, (unit)=>{
      if (currentOpponentZones.current.drop.length >=4){return true}return false
    } , (unit)=>{increasePower(unit, 2000);  increaseShield(unit, 5000 )} , 
    (unit)=>{increasePower(unit, -2000);  increaseShield(unit, -5000 ) })
  
    makeConditionalConintuous(this.abilityId + 1, unit, (unit)=>{
      if (currentOpponentZones.current.drop.length >=8){return true}return false
    } , (unit)=>{increaseShield(unit, 5000 )} , 
    (unit)=>{ increaseShield(unit, -5000 ) })
  
  },
    "off": async function (unit){removeConditionalContinuous(this.abilityId); removeConditionalContinuous(this.abilityId+1);  },
    "isOn": false,
    "text": "[CONT](RC/GC):If your opponent's drop has four or more cards, this unit gets [Power]+2000/[Shield]+5000. Then, if there are eight or more, it gets [Shield]+5000. (Active on your opponent's turn too)",
    "type": "CONT",
    "permanent": true,
    "cost": null
  }
},
"Blaze Maiden, Ximena": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
cost:{
  "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
  },
    "effect": {

      "effect": async function (unit){

        await lookTopXAddShuffleRest(userZones.hand, 7, 1, [{cardProperty:'hasOverDress' , propertyToFind:true, condition:'='}])
      }
    },
    "text": "[AUTO]:When this unit is placed on (RC), COST [Counter Blast (1)], look at seven cards from the top of your deck, choose up to one card with the [overDress] ability from among them, reveal it and put it into your hand, and shuffle your deck.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Dragritter, Shihab": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){increasePowerEndTurn(unit, 5000)}
    },
    "text": "[AUTO]:When this unit is placed on (RC), this unit gets [Power]+5000 until end of turn.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  },
  "ability2": {
    "condition": async function (unit){ if(onRC(unit)){return true} return false},
    "on": async function (unit){ playerObjects.current.rideFromRideDeck = 
      async function (){
  
        if(newDeck.RideDeck[newDeck.RideDeck.length-1] == null){timedDisplay('no more ride deck'); return}
        await chooseOneOfTheFollowing([{text:'Discard 1' , effect: async ()=>{
          await discard(1)
        }} , {text:'Put Into Soul' , effect: ()=>{
          soulThisUnit(unit)
        }}])
        userCircles  [`user` + "VG"].unit['state'] = 'rodeUpon'
       userZones.soul.push(userCircles[`user` + "VG"].unit)
  
       
        userCircles  [`user` + "VG"].unit = {...newDeck.RideDeck.pop(newDeck.RideDeck.length-1)}
       userCircles  [`user` + "VG"].unit['state'] = 'placed'
       userCircles  [`user` + "VG"].unit['place'] = 'VC'
       userCircles  [`user` + "VG"].unit['circle'] = 'userVG'
  
        setPopup(false)
      await searchAbilities()
        await waitAbilities()
      
  
        setUserCircles({...userCircles})
  
       }
  
  
  
     },
    "off": async function (unit){  playerObjects.current.rideFromRideDeck = defaults.current.rideFromRideDeck},
    "isOn": false,
    "text": "[CONT](RC):When you would ride from your ride deck, you may ride with \"Put this unit into your soul\" instead of \"Choose a card from your hand, and discard it\".",
    "type": "CONT",
    "permanent": true,
    "cost": null
  }
},
"Steam Mage, Ashur-da": {
  "ability1": {
    "condition": async function (unit){ if(onGC(unit) && userZones.soul.length >=7){return true} return false},
    "on": async function (unit){ increaseShield(unit, 5000)},
    "off": async function (unit){ increaseShield(unit, -5000)},
    "isOn": false,
    "text": "[CONT](GC):If your soul has seven or more cards, this unit gets [Shield]+5000.",
    "type": "CONT",
    "permanent": true,
    "cost": null
  },
  "ability2": {
    "condition": async function (unit){ if(whenRetiredFromGC(unit)){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){await youMay(unit, (card)=>{soulThisCard(card)})}
    },
    "text": "[AUTO]:When this unit is retired from (GC), you may put this card into your soul.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Diabolos Madonna, Regina": {
  "ability1": {
    "condition": async function (unit){ onRC(unit) && finalRush()},
    "cost": {
"counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },  
     "otherRearguards":{
      "amount": 2,
      "filter": basicPropertyArray
},
    "costEffect": async function (unit){
      await counterBlast(this.counterBlast.amount);
      await soulYourRearguards(2 , [
      {
        "cardProperty": "id",
        "propertyToFind": unit.id,
        "condition": "!="
      }
    ])}
 
    },
    "effect": {

      "effect": async function (unit){await callFromSoul(1, undefined, undefined, undefined, (card)=>{increasePowerEndTurn(card, 10000)});
      increasePowerEndTurn(unit, 10000)
    }
    },
    "text": "[ACT](RC)1/Turn:If you are in \"Final Rush\", COST [Counter Blast (1) & put two other rear-guards into your soul], choose a card from your soul, call it to (RC), and that unit and this unit get [Power]+10000 until end of turn.",
    "1/Turn": true,
    "Used1/Turn": false,
    "H1/Turn": false,
    "type": "ACT",
    "permanent": true,
    "costPaid": false
  }
},
"Desire Devil, Incane": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnRC(unit) && personaRodeThisTurn()){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){soulCharge(1)}
    },
    "text": "[AUTO]:When this unit is placed on (RC), if you persona rode this turn, Soul Charge (1).",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  },
  "ability2": {
    "condition": async function (unit){ if(putIntoSoulFromRC(unit) && duringVanguardAbility()){return true} return false},
cost:{"counterBlast": {
      "amount": 2,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}},
    "effect": {

      "effect": async function (unit){0
        await chooseUnits(1 , vanguard() , (card)=>{
          increasePowerEndTurn(unit, 5000);
          increaseDriveEndTurn(unit, 1)
        })

      }
    },
    "text": "[AUTO]:When this unit is put from (RC) into your soul for your vanguard's ability, COST [Counter Blast (2)], choose one of your vanguards, and it gets [Power]+5000/drive +1 until end of turn.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Aurora Battle Princess, Execute Lemonun": { 
  "ability1": { 
    "condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit)){return true} return false},
cost:{   
   "counterBlast": {
  "amount": 1,
  "filter":basicPropertyArray
},
"soul": {
  "amount": 3,
  "filter": basicPropertyArray
},
 "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await soulBlast(this.soul.amount) }},
    "effect": {

      "effect": async function (unit){
        await imprisonOpponentRearguards(3)
        if(await opponentImprisonedAmount >=3){
          increasePowerEndBattle(unit, 10000)
        }
        if(await opponentImprisonedAmount >=5){
          increaseCritEndBattle(unit, 1)
        }
      }
    },
    "text": "[AUTO](RC):When this unit attacks, COST [Counter Blast (1) & Soul Blast (3)], choose up to three of your opponent's rear-guards, and imprison them in your Prison. If three or more of your opponent's cards are imprisoned in your Prison, until end of that battle, this unit gets [Power]+10000, and if five or more are imprisoned, this unit gets [Critical]+1.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Gravidia Stanner": {
  "ability1": {
    "condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false},
    "on": async function (unit){ },
    "off": async function (unit){ },
    "isOn": false,
    "text": "[CONT](RC/GC):If your drop and Order Zone have a total of five or more set orders, this unit gets [Power]+5000/[Shield]+5000. (Active on opponent's turn too)",
    "type": "CONT",
    "permanent": true,
    "cost": null
  }
},
"Aurora Battle Princess, Tra Bouquenvillea": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},//come back
    "cost": null,
    "effect": {

      "effect": async function (unit){
        let id
        let circle
        let called
        await youMay(1, async ()=>{
          let select = await clickAbilityZone(await opponentImprisoned(), 1)
          if(select.selected.length === 0){return}
          id = select.selected[0].id
          let clicked = await clickCircles(1, 'opponentCircles' , true)

          circle = clicked[0]
          await makeOpponent(unit , {circle: circle , id:id})
          if(currentOpponentCircles.current[circle].unit){
            await imprisonOpponentRearguards(1)
          }
        })
      }
    },
    "text": "[AUTO]:When this unit is placed on (RC), choose one of your opponent's unit cards imprisoned in your Prison, and you may call it to your opponent's open (RC). If you called it, choose one of your opponent's rear-guards, and imprison it in your Prison. (You choose the circle to be called to)",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Easerod Angel": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
cost:{    "soul": {
  "amount": 1, 
  "filter": basicPropertyArray
},
"costEffect": async function (unit){await soulBlast(this.soul.amount)}},
    "effect": {

      "effect": async function (unit){
        let peek = await lookTopX(1)
        let unitFound = await searchZones(peek, units())
        if(unitFound[0]){
       await callFromAbilityZone(unitFound, 1, unitFound, sameColumn(unit)[0].propertyToFind , false, undefined,) 
        }
        else{
          putTopDeck(peek)
        }
      }
    },
    "text": "[AUTO]:When this unit is placed on (RC), COST [Soul Blast (1)], look at the top card of your deck, if it is a unit card, you may call it to a (RC) in the same column as this unit. Return it to its original spot if you do not call)",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Heavenly Incitation Above the Clouds, Blagar": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnRC(unit) && userZones.hand.length <=4){return true} return false},
cost:counterBlastObject(1),
    "effect": {

      "effect": async function (unit){

        await callFromTopXShuffleRest(5,1,grade3())
      }
    },
    "text": "[AUTO]:When this unit is placed on (RC), if your hand has four or less cards, COST [Counter Blast (1)], look at five cards from the top of your deck, choose up to one grade 3 unit card from among them, call it to (RC), and shuffle your deck.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Magic of Revelation, Totris": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnRC(unit) && ifYourVanguardIsGrade3orGreater()){return true} return false},
cost:counterBlastObject(),
    "effect": {

      "effect": async function (unit){await deckToHand(1, nameIsX('Hexaorb Sorceress'))}
    },
    "text": "[AUTO]:When this unit is placed on (RC), if you have a grade 3 or greater vanguard, COST [Counter Blast (1)], search your deck for up to one \"Hexaorb Sorceress\", reveal it and put it into your hand, and shuffle your deck.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Aggress Blue Dragon": {
  "ability1": {
    "condition": async function (unit){ if(endOfBattleThisUnitAttackedOnRC(unit) && attackedARearguard() && ifYourVanguardIs('Flagship Dragon, Flagburg Dragon')){return true} return false},
cost:soulBlastObject(),
    "effect": {

      "effect": async function (unit){standThisUnit(unit)}
    },
    "text": "[AUTO](RC)1/Turn:At the end of the battle this unit attacked a rear-guard, if your vanguard is \"Flagship Dragon, Flagburg Dragon\", COST [Soul Blast (1)], and [Stand] this unit.",
    "type": "AUTO",
    "1/Turn": true,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Sylvan Horned Beast, Gabregg": {//come back
  "ability1": {
    "condition": async function (unit){ if(onRC(unit) && whenYourOtherUnitAttacks(unit) && ifSameColumn(unit, currentBattle.current.attackingUnit)){return true} return false},
cost:{    "soul": {
  "amount": 1, 
  "filter": basicPropertyArray
},
"costEffect": async function (unit){await soulBlast(this.soul.amount)}},
    "effect": {

      "effect": async function (unit){
        increasePowerEndTurn(unit, 10000);
        let oppUnits = await searchCircles(rearguard(), 'opponent')
        let grades = {}
        for(let i =0 ; i <oppUnits.length; i++){
          let circle = oppUnits[i].replace('user', 'opponent')
          let grade = currentOpponentCircles.current [circle] .unit.tempGrade
          if(grades[grade] === undefined){
            grades[grade] = grade
          }
        }
 

        makeConditionalContinuous(this.abilityId, unit, (unit)=>{ return(isAttacking() && isAttackingUnit(unit) ) } ,   ()=>{
 
          guardRestrictEndBattle(unit, 'withoutChosenGrade' , grades  )
        })
          untilEndTurn(()=>{
            removeConditionalContinuous(this.abilityId)
          } , unit)
      }
    },
    "text": "[AUTO](RC):When your other unit in the same column as this unit attacks, COST [Soul Blast (1)], and this unit gets [Power]+10000 until end of turn. Choose all of your opponent's rear-guards, and for the battle that this unit attacked this turn, your opponent cannot call cards with the same grade as the chosen units from their hand to (GC).",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Sylvan Horned Beast, Enbarr": {
  "ability1": {
    "condition": async function (unit){ if((whenPlacedOnRC(unit) || whenPutOnGC(unit) && ifYourVanguardIs('Sylvan Horned Beast King, Magnolia'))){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){increasePowerEndTurn(unit, 5000); increaseShieldEndTurn(unit, 5000)}
    },
    "text": "[AUTO]:When this unit is placed on (RC) or put on (GC), if your vanguard is \"Sylvan Horned Beast King, Magnolia\", this unit gets [Power]+5000/[Shield]+5000 until end of turn.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Blaze Fist Monk, Gyoukou": {
  "ability1": {
    "condition": async function (unit){ if(ifThisCardIsDiscarded(unit) && duringYourTurn() && ifYourVanguardIs('Chakrabarthi Divine Dragon, Nirvana')){return true} return false},
cost:soulBlastObject(),
    "effect": {

      "effect": async function (unit){
      await retireOpponentRearguards(1) }
    },
    "text": "[AUTO]:When this card is discarded from hand during your turn, if your vanguard is \"Chakrabarthi Divine Dragon, Nirvana\", COST [Soul Blast (1)], choose one of your opponent's rear-guards, and retire it.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Blaze Maiden, Toresa": {
  "ability1": {
    "condition": async function (unit){ if(whenThisUnitsAttackHitsOnRC(unit)){return true} return false},
cost:counterBlastObject(),
    "effect": {

      "effect": async function (unit){
      await dropToHand(1, hasOverDressAbility())
      }
    },
    "text": "[AUTO](RC):When this unit's attack hits, COST [Counter Blast (1)], choose a card from your drop with the [overDress] ability, and return it to your hand.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Steel Bullet of Dust Storm, Ethan": {
  "ability1": {
    "condition": async function (unit){ if(whenYourVanguardsAttackHits(unit) && onRC(unit)){return true} return false},
cost:{    "thisUnit": {
  "amount": 1,
  "filter": basicPropertyArray
},
 "costEffect": async function (unit){await retireThisUnit(unit)}},
    "effect": {

      "effect": async function (unit){draw(this.draw.amount); await counterCharge(1)}
    },
    "text": "[AUTO](RC):When your vanguard's attack hits, COST [retire this unit], draw a card, and Counter Charge (1).",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Twin Strike of Dust Storm, Orlando": {
  "ability1": {
    "condition": async function (unit){ inSoul(unit) && opponentRearguardWasRetiredThisTurn()},
    "cost": {
"counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
    },
    "effect": {

      "effect": async function (unit){await callThisCard(unit)}
    },
    "text": "[ACT](Soul):If your opponent's rear-guard was retired this turn, COST [Counter Blast (1)], and call this card to (RC).",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "type": "ACT",
    "permanent": true,
    "costPaid": false
  },
  "ability2": {
    "condition": async function (unit){ if(whenYourVanguardsAttacks(unit) && ifYourVanguardIsGrade3orGreater() && onRC(unit)){return true} return false},
cost:{
  "thisUnit": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await soulThisUnit(unit)}},
    "effect": {

      "effect": async function (unit){await increaseUnitsPowerEndTurn(1, 5000, vanguard())}
    },
    "text": "[AUTO](RC):When your grade 3 or greater vanguard attacks, COST [put this unit into your soul], choose one of your vanguards, and it gets [Power]+5000 until end of turn.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Burning Flail Dragon": {
  "ability1": {
    "condition": async function (unit){ if(endOfBattleThisUnitBoosted(unit)){return true} return false},
    cost:{
      "thisUnit": {
        "amount": 1,
        "filter": basicPropertyArray
      },
       "costEffect": async function (unit){await soulThisUnit(unit)}},
        "effect": {
    
          "effect": async function (unit){await increaseUnitsPowerEndTurn(1, 2000, )}
        },
    "text": "[AUTO](RC):At the end of the battle this unit boosted, COST [put this unit into your soul], choose one of your units, and it gets [Power]+2000 until end of turn.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Diabolos Striker, Bryan": {
  "ability1": {
    "condition": async function (unit){ onRC(unit)},
    "cost": {
      "soul": {
        "amount": 2, 
        "filter": basicPropertyArray
      },
      "costEffect": async function (unit){await soulBlast(this.soul.amount)}
    },
    "effect": {

      "effect": async function (unit){
await doAllUnits(frontrow() , (card)=>{increasePowerEndTurn(card,5000)})
if(finalRush()){
  increaseCritEndTurn(userCircles.userVG.unit, 1)
}
      }
    },
    "text": "[ACT](RC)1/Turn:COST [Soul Blast (2)], until end of turn, all of your front row units get [Power]+5000, and if you are in \"Final Rush\", choose one of your vanguards, and it gets [Critical]+1.",
    "1/Turn": true,
    "Used1/Turn": false,
    "H1/Turn": false,
    "type": "ACT",
    "permanent": true,
    "costPaid": false
  }
},
"Keenly Loodely": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnRC(unit) && ifYourVanguardIs('Master of Gravity, Baromagnes')){return true} return false},
cost:counterBlastObject(),
    "effect": {

      "effect": async function (unit){

let clicked = await clickAbilityZone(userZones.soul,userZones.soul.length , normalUnit())
        let amountClicked = clicked.selected.length
        increasePowerEndTurn(unit, amountClicked*5000);
        await addToDeck(clicked.selected, userZones.soul)
      }
    },
    "text": "[AUTO]:When this unit is placed on (RC), if your vanguard is \"Master of Gravity, Baromagnes\", COST [Counter Blast (1)], choose any number of normal units from your soul, and this unit gets [Power]+5000 until end of turn for each card chosen. Return all of the chosen cards to your deck and shuffle it. (Cards from the ride deck are returned to the ride deck face up)",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Desire Devil, Boshokku": {
  "ability1": {
    "condition": async function (unit){ if(whenRodeUponBy(unit, 'Avaricious Demonic Dragon, Greedon')){return true} return false},
cost:{    "hand": {
  "amount": 1,
  "filter": basicPropertyArray
},
"costEffect": async function (unit){await handToSoul(this.hand.amount)}},
    "effect": {

      "effect": async function (unit){await deckToHand(1, nameIsX(unit.name))}
    },
    "text": "[AUTO]:When this unit is rode upon by \"Avaricious Demonic Dragon, Greedon\", COST [put a card from your hand into your soul], search your deck for a card with the same card name as this card, reveal it and put it into your hand, and shuffle your deck.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  },
  "ability2": {
    "condition": async function (unit){ if(inSoul(unit)&& duringYourTurn()&&ifDamageZoneHas4OrMore()&&ifYourVanguardIs('Avaricious Demonic Dragon, Greedon')){return true} return false},
    "on": async function (unit){increasePower(userCircles.userVG.unit , 5000) },
    "off": async function (unit){increasePower(userCircles.userVG.unit , -5000)  },
    "isOn": false,
    "text": "[CONT](Soul):During your turn, if your damage zone has four or more cards, the \"Avaricious Demonic Dragon, Greedon\" on your (VC) gets [Power]+5000.",
    "type": "CONT",
    "permanent": true,
    "cost": null
  }
},
"Desire Devil, Mucca": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnRCFrom(unit, 'hand') && ifYourVanguardIs('Avaricious Demonic Dragon, Greedon')){return true} return false},
cost:{
  "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "soul": {
      "amount": 2, 
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await soulBlast(this.soul.amount)}
},
    "effect": {

      "effect": async function (unit){await callFromSoul(1)}
    },
    "text": "[AUTO]:When this unit is placed on (RC) from hand, if your vanguard is \"Avaricious Demonic Dragon, Greedon\", COST [Counter Blast (1) & Soul Blast (2)], choose a card from your soul, and call it to (RC).",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  },
  "ability2": {
    "condition": async function (unit){ if(whenYourVanguardsAttacks(unit) && onRC(unit) && personaRodeThisTurn()){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){increasePowerEndTurn(userCircles.userVG.unit, 5000)}
    },
    "text": "[AUTO](RC):When your vanguard attacks, if you persona rode this turn, choose one of your vanguards, and it gets [Power]+5000 until end of turn.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Stem Deviate Dragon": {
  "ability1": {
    "condition": async function (unit){ if(endOfBattleThisUnitBoosted(unit)){return true} return false},
    cost:{
      "thisUnit": {
        "amount": 1,
        "filter": basicPropertyArray
      },
       "costEffect": async function (unit){await soulThisUnit(unit)}},
        "effect": {
    
          "effect": async function (unit){await increaseUnitsPowerEndTurn(1, 2000, )}
        },
    "text": "[AUTO](RC):At the end of the battle this unit boosted, COST [put this unit into your soul], choose one of your units, and it gets [Power]+2000 until end of turn.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Gravidia Barringer": {
  "ability1": {
    "condition": async function (unit){ if((whenPlacedOnVC(unit)||whenPlacedOnRC(unit))){
      let ord = await searchZones(userZones.orderZone, meteorite())
      if(ord.length >0 )
      return true
    } return false},
cost:{    "soul": {
  "amount": 3, 
  "filter": basicPropertyArray
},
"costEffect": async function (unit){await soulBlast(this.soul.amount)}},
    "effect": {

      "effect": async function (unit){draw(this.draw.amount);
        increasePowerEndTurn(unit, 5000)
      }
    },
    "text": "[AUTO]:When this unit is placed on (VC) or (RC), if you have a Meteorite in your Order Zone, COST [Soul Blast (3)], draw a card, and this unit gets [Power]+5000 until end of turn.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  },
  "ability2": {
    "condition": async function (unit){ if(onRC(unit)){
      let drop = await searchZones(userZones.drop, setOrder()) 
      let ord = await searchZones(userZones.orderZone, setOrder()) 
      if((drop.length + ord.length ) >= 5)
      return true
    
    } return false},
    "on": async function (unit){increasePower(unit, 5000)},
    "off": async function (unit){ increasePower(unit, -5000)},
    "isOn": false,
    "text": "[CONT](RC):If your drop and Order Zone have a total of five or more set orders, this unit gets [Power]+5000. (Active on opponent's turn too)",
    "type": "CONT",
    "permanent": true,
    "cost": null
  }
},
"Aurora Battle Princess, Survey Vermillion": {
  "ability1": {
    "condition": async function (unit){ if(onRC(unit) ){

      if(turnState.current.event === 'called'){
        let event = latestEvent()
        if(event.opponentCard.previousArea === 'prison' && !yourCard(event.opponentCard))
        {
          return true
        }

    }
      } return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){soulCharge(1)}
    },
    "text": "[AUTO](RC)1/Turn:When your opponent's card is placed on (RC) from your Order Zone, Soul Charge (1).",
    "type": "AUTO",
    "1/Turn": true,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Cardinal Fang, Rayosia": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){
        let rest = await lookTopXAdd(userZones.hand, 3, 1, world())
        rest = await rearrange(rest)
        await putBotDeck(rest)
      }
    },
    "text": "[AUTO]:When this unit is placed on (RC), look at three cards from the top of your deck , choose up to one World card from among them, reveal it and put it into your hand, and put the rest on the bottom of your deck in any order.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  },
  "ability2": {
    "condition": async function (unit){ onRC(unit) && ifYourVanguardIs('Cardinal Deus, Orfist')},
    "cost": {
      "soul": {
        "amount": 1,
        "filter": basicPropertyArray
      },
      "thisUnit": {
        "amount": 1,
        "filter": basicPropertyArray
      },
       "costEffect": async function (unit){await soulBlast(this.soul.amount); await retireThisUnit(unit) }
    },
    "effect": {

      "effect": async function (unit){
        await callToken('Shadow Army' , 1)
      }
    },
    "text": "[ACT](RC):If your vanguard is \"Cardinal Deus, Orfist\", COST [Soul Blast (1) & retire this unit], and call a Shadow Army token to (RC).",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "type": "ACT",
    "permanent": true,
    "costPaid": false
  }
},
"Gravidia Orgueil": {
  "ability1": {
    "condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit) || whenThisUnitBoosts(unit)){
      let ord = await searchZones(userZones.orderZone, meteorite())
      if(ord.length >=3)
      return true} return false},
cost:{    "soul": {
  "amount": 2, 
  "filter": basicPropertyArray
},
"costEffect": async function (unit){await soulBlast(this.soul.amount)}},
    "effect": {

      "effect": async function (unit){await counterCharge(1) ; increasePowerEndTurn(unit, 5000)}
    },
    "text": "[AUTO](RC):When this unit attacks or boosts, if your Order Zone has three or more Meteorites, COST [Soul Blast (2)], Counter Charge (1), and this unit gets [Power]+5000 until end of turn.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Patrol Robo, Dekarcop": {
  "ability1": {
    "condition": async function (unit){ if(endOfBattleThisUnitBoosted(unit)){return true} return false},
    cost:{
      "thisUnit": {
        "amount": 1,
        "filter": basicPropertyArray
      },
       "costEffect": async function (unit){await soulThisUnit(unit)}},
        "effect": {
    
          "effect": async function (unit){await increaseUnitsPowerEndTurn(1, 2000, )}
        },
    "text": "[AUTO](RC):At the end of the battle this unit boosted, COST [put this unit into your soul], choose one of your units, and it gets [Power]+2000 until end of turn.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Overcoming an Eternity": {
  "ability3": {
    "condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false},
    "on": async function (unit){ },
    "off": async function (unit){ },
    "isOn": false,
    "text": "[CONT](Order Zone):If your order zone only has World cards, the following effects are active according to the number of cards in your order zone.",
    "type": "CONT",
    "permanent": true,
    "cost": null
  },
  "ability6": {
    "condition": async function (unit){ if(inOrderZone(unit) && turnState.current.event === 'called'){
      let called = turnState.current.called
      called.forEach((obj)=>{
        let card = userCircles[obj.circle].unit
        if(card.name === 'Shadow Army')
          {
            increasePowerEndTurn(card , 5000)
          }

      })

       } return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){}
    },
    "text": "[AUTO](Order Zone):When your Shadow Army token is placed, that placed unit gets [Power]+5000 until end of turn.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Knight of Severe Punishment, Geid": {
  "ability1": {
    "condition": async function (unit){ if(retiredForCost(unit)){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){
        await lookTopXAddBotDeckRestAnyOrder(userZones.hand, 3, 1, blaster())
      }
    },
    "text": "[AUTO]:When this unit is retired from (RC) for the cost of your card, look at three cards from the top of your deck, choose up to one card with \"Blaster\" in its card name from among them, reveal it and put it into your hand, and put the rest on the bottom of your deck in any order.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Magic of Appreciation, Nanaful": {
  "ability1": {
    "condition": async function (unit){ if(whenYourDriveCheckRevealsATrigger(unit) && onRC(unit)){return true} return false},
cost:{
  "hand": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await handToSoul(this.hand.amount)}},
    "effect": {

      "effect": async function (unit){draw(this.draw.amount)}
    },
    "text": "[AUTO](RC):When your drive check reveals a trigger unit, COST [put a card from your hand into your soul], and draw a card.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Drilling Angel": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
cost:{
  
  "drop": {
    "amount": 1,
    "filter": basicPropertyArray
  },
  "costEffect": async function (unit){await dropToSoul(this.drop.amount)}
},
    "effect": {

      "effect": async function (unit){

        let card = userZones.soul[userZones.soul.length -1]
 
        await callFromTopXShuffleRest(3, 1, nameIsX(card.name))
      }
    },
    "text": "[AUTO]:When this unit is placed on (RC), COST [put a unit card from your drop into your soul], look at three cards from the top of your deck, choose up to one card from among them with the same card name as the card put into your soul for this cost, call it to (RC), and shuffle your deck.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Blade Feather Dragon": {
  "ability1": {
    "condition": async function (unit){ if(endOfBattleThisUnitBoosted(unit)){return true} return false},
    cost:{
      "thisUnit": {
        "amount": 1,
        "filter": basicPropertyArray
      },
       "costEffect": async function (unit){await soulThisUnit(unit)}},
        "effect": {
    
          "effect": async function (unit){await increaseUnitsPowerEndTurn(1, 2000, )}
        },
    "text": "[AUTO](RC):At the end of the battle this unit boosted, COST [put this unit into your soul], choose one of your units, and it gets [Power]+2000 until end of turn.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},

"Pride to Protect": {
  "ability3": {
    "condition": async function (unit){ if(inOrderZone(unit)){return true} return false},
    "on": async function (unit){ allOfYourUnits(this.abilityId, grade3Rearguards() , (card)=>{
      getsBoost(card)
    }   , (card)=>{removeBoost(card)})},
    "off": async function (unit){removeAllOfYourUnits(this.abilityId) },
    "isOn": false,
    "text": "[CONT](Order Zone):All of your grade 3 rear-guards get \"Boost\".",
    "type": "CONT",
    "permanent": true,
    "cost": null
  }
},
"Ascendance Assault": {
  "ability1": {
    "condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false},
cost:{
  "otherCards": {
    "amount": 1, 

    'zone': 'soul',
    "filter": basicPropertyArray
  },

  'altCost':{
    "hand": {
      "amount": 1,
      "filter": orPropertyArray([nameIsX('Flagship Dragon, Flagburg Dragon') , nameIsX("Inroad Shooter")])
    },
    'placedHOlder' : []
  },
  "costEffect": async function (unit){
    let arr= [ ]
    let soulB = this.otherCards
    let handB = this.altCost.hand
    if(await costChecker({otherCards:this.otherCards ,   'placedHolder' : []} , unit)){
      arr.push({text:'Pay with Soul Blast' , effect:async function(){
        await soulBlast(soulB.amount, [{"cardProperty" :  'id' , "propertyToFind": unit.id, "condition": '!='} ])  }}  )
    }
    if(await costChecker(this.altCost) , unit){
      arr.push({text:'Pay with "reveal a \"Flagship Dragon, Flagburg Dragon\" or \"Inroad Shooter\" '
         , effect:async function (){await reveal(handB.amount, userZones.hand ,handB.filter)  }}  )
    }

    await chooseOneOfTheFollowing(arr)
  
  }
},
    "effect": {

      "effect": async function (unit){await callThisCard(unit)}
    },
    "text": "[AUTO]:You may pay \"reveal a \"Flagship Dragon, Flagburg Dragon\" or \"Inroad Shooter\" from your hand\" for this cost. When this unit is rode upon, COST [Soul Blast (1) other than this card], and call this card to (RC).",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  },
  "ability2": {
    "condition": async function (unit){ if(whenYourOtherRearguardAttacksAVanguard(unit) && onRC(unit) &&
       ifYourVanguardIs('Flagship Dragon, Flagburg Dragon')){return true} return false},
cost:{"counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}},
    "effect": {

      "effect": async function (unit){standThisUnit(unit)}
    },
    "text": "[AUTO](RC)1/Turn:When your other rear-guard attacks a vanguard, if your vanguard is \"Flagship Dragon, Flagburg Dragon\", COST [Counter Blast (1)], and [Stand] this unit.",
    "type": "AUTO",
    "1/Turn": true,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Blooming Petal, Caryophyllus": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnRC(unit)&& userZones.soul.length === 0){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){soulCharge(2)}
    },
    "text": "[AUTO]:When this unit is placed on (RC), if your soul has no cards, Soul Charge (2).",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"High Rate Burst Dragon": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnRC(unit) && ifYourVanguardIs('Flagship Dragon, Flagburg Dragon')){return true} return false},
cost:null,
    "effect": {

      "effect": async function (unit){
        await chooseUnits(1, otherRearguard(unit) , async (card)=>{

          let ability = makeAbility()
          await giveAUTOAbilityEndTurn(card , (uni)=>(whenThisUnitAttacksOnRC(uni)
        && playerObjects.current.attacksThisTurn === 1) , {    "counterBlast": {
          "amount": 1,
          "filter": [
            {
              "cardProperty": "clan",
              "propertyToFind": "",
              "condition": "="
            }
          ]
        },
        "soul": {
          "amount": 1,
          "filter": basicPropertyArray
        },
         "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await soulBlast(this.soul.amount) },  
        
        } , 
      
      (uni)=>{standThisUnit(uni)}
      )
        })

      }
    },
    "text": "[AUTO]:When this unit is placed on (RC), if your vanguard is \"Flagship Dragon, Flagburg Dragon\", choose one of your other rear-guards, and it gets \"[AUTO](RC):When this unit attacks, if it is the first battle of this turn, COST [Counter Blast (1) & Soul Blast (1)], and [Stand] this unit.\" until end of turn.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Unappeasable Wild Crow": {
  "ability1": {
    "condition": async function (unit){if(onRC(unit) && playedAnOrderThisTurn()){return true} return false},
    "cost": {
      "hand": {
        "amount": 1,
        "filter": basicPropertyArray
      },
      "costEffect": async function (unit){await discard(this.hand.amount)}
    },
    "effect": {

      "effect": async function (unit){draw(1)}
    },
    "text": "[ACT](RC)1/Turn:If you played an order this turn, COST [discard an order card from your hand], and draw a card.",
    "1/Turn": true,
    "Used1/Turn": false,
    "H1/Turn": false,
    "type": "ACT",
    "permanent": true,
    "costPaid": false
  }
},
"Aspiring Maiden, Alana": {
  "ability1": {
    "condition": async function (unit){ if(endOfBattleThisUnitBoosted(unit)){return true} return false},
    cost:{
      "thisUnit": {
        "amount": 1,
        "filter": basicPropertyArray
      },
       "costEffect": async function (unit){await soulThisUnit(unit)}},
        "effect": {
    
          "effect": async function (unit){await increaseUnitsPowerEndTurn(1, 2000, )}
        },
    "text": "[AUTO](RC):At the end of the battle this unit boosted, COST [put this unit into your soul], choose one of your units, and it gets [Power]+2000 until end of turn.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},

"Titlist Dragon, Musashid Armor": {
  "ability1": {
    "condition": async function (unit){ if(onVC(unit)){return true} return false},
    "on": async function (unit){ await makeConditionalContinuous(this.abilityId, unit, ()=>turnState.current.event === 'normalRide' 
    , ()=>{

      personaRide()}
    
    
    )},
    "off": async function (unit){ removeConditionalContinuous(this.abilityId)},
    "isOn": false,
    "text": "[CONT]:The normal ride from hand on this unit by a unit with different card name is regarded as persona ride too.",
    "type": "CONT",
    "permanent": true,
    "cost": null
  }
},
"Piercing Bullet of Dust Storm, Maynard": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnVC(unit) || whenPlacedOnRC(unit)){return true} return false},
cost:{"counterBlast": {
      "amount": 2,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}},
    "effect": {

      "effect": async function (unit){
        let col = await getOpponentColumn()
        let prop = []
        col.forEach((circ)=>{prop.push({cardProperty:'circle',propertyToFind:circ, condition:'=' , })})
 
        retireAllOpponentsRearguards(orPropertyArray(prop))
      }
    },
    "text": "[AUTO]:When this unit is placed on (VC) or (RC), COST [Counter Blast (2)], choose one of your opponent's rear-guards, and retire all of your opponent's rear-guards in the same column as that unit.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Patrol Dragon, Scoutptera": {
  "ability1": {
    "condition": async function (unit){ if(whenThisUnitIsBoosted(unit)){return true} return false},
cost:{"counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}},
    "effect": {

      "effect": async function (unit){await retireOpponentRearguards(1, grade2OrGreater())
        increasePowerEndBattle(unit, 2000)

      }
    },
    "text": "[AUTO](RC):When this unit is boosted, COST [Counter Blast (1)], choose one of your opponent's grade 2 or greater rear-guards, retire it, and this unit gets [Power]+2000 until end of that battle.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Blast Artillery Dragon, Brachioforce": {
  "ability1": {
    "condition": async function (unit){ if(whenThisUnitsAttackHitsOnRC(unit)){return true} return false},
cost:{    "thisUnit": {
  "amount": 1,
  "filter": basicPropertyArray
},
 "costEffect": async function (unit){await retireThisUnit(unit)}},
    "effect": {

      "effect": async function (unit){draw(1)
        await retireOpponentRearguards(1)

      }
    },
    "text": "[AUTO](RC):When this unit's attack hits, COST [retire this unit], draw a card, choose one of your opponent's rear-guards, and retire it.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Blaze Pole Monk, Shakune": {
  "ability1": {
    "condition": async function (unit){ if(onRC(unit)&&currentBattle.current.attackingUnit && currentBattle.current.attackingUnit.grade === 0 && currentBattle.current.attackingUnit.state === 'attacks'){return true} return false},
cost:{  
"counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
 
  "thisUnit": {
  "amount": 1,
  "filter": basicPropertyArray
},
 "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await retireThisUnit(unit)}},
    "effect": {

      "effect": async function (unit){increasePowerEndTurn(currentBattle.current.attackingUnit, 10000)}
    },
    "text": "[AUTO](RC):When your grade 0 rear-guard attacks, COST [Counter Blast (1) & retire this unit], and the unit that attacked gets [Power]+10000 until end of that battle.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Flare Scourge Dragon": {
  "ability1": {
    "condition": async function (unit){ if( onRC(unit) && await whenYourRearguardIsPlaced(unit, isOverDress())){
      
      return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){increasePowerEndTurn(unit, unit['eventCard'].length * (5000))}
    },
    "text": "[AUTO](RC):When your rear-guard is placed, if it was an [overDress], this unit gets [Power]+5000 until end of turn.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Stun Voltech Dragon": {
  "ability1": {
    "condition": async function (unit){ if(vanguardsAttackHitThisTurn(unit) && onRC(unit) ){return true} return false},
    "on": async function (unit){increasePower(unit, 10000) },
    "off": async function (unit){ increasePower(unit, -10000)},
    "isOn": false,
    "text": "[CONT](RC):If your vanguard's attack hit this turn, this unit gets [Power]+10000.",
    "type": "CONT",
    "permanent": true,
    "cost": null
  }
},
"Blaze Fist Monk, Tenji": {
  "ability1": {
    "condition": async function (unit){ if(  onRC(unit)  && await whenYourRearguardIsPlaced(unit,isOverDress())){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){
        let handSize = userZones.hand.length
        await youMay(1, ()=>{draw(1)})
        if(userZones.hand.length !== handSize){
          await discard(1)
        }
      }
    },
    "text": "[AUTO](RC):When your rear-guard is placed, if it was an [overDress], you may draw a card. If you drew, choose a card from your hand, and discard it.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Angled Shot of Dust Storm, Alastair": {
  "ability1": {
    "condition": async function (unit){ if(whenPutOnGC(unit) && currentBattle.current.attackingUnit.isBoosted === false){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){increaseShieldEndBattle(unit, 10000)}
    },
    "text": "[AUTO]:When this unit is put on (GC), if your opponent's attacking unit is not boosted, this unit gets [Shield]+10000 until end of that battle.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Hunting Bullet of Dust Storm, Cedric": {
  "ability1": {
    "condition": async function (unit){ if(duringYourTurn() && onRC(unit) && await opponentRGAmountLessThan(2)){return true} return false},
    "on": async function (unit){ increasePower(unit, 5000)},
    "off": async function (unit){ increasePower(unit, -5000)},
    "isOn": false,
    "text": "[CONT](RC):During your turn, if your opponent has two or less rear-guards, this unit gets [Power]+5000.",
    "type": "CONT",
    "permanent": true,
    "cost": null
  }
},
"Deflect Pulse Dragon": {
  "ability1": {
    "condition": async function (unit){ if(whenPutOnGC(unit)){let g0 = await searchCircles(grade0()); 
      if(g0.length > 0)
      return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){increaseShieldEndBattle(unit, 5000)}
    },
    "text": "[AUTO]:When this unit is put on (GC), if you have a grade 0 rear-guard, this unit gets [Shield]+5000 until end of that batte.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Diabolos Charger, Nate": {
  "ability1": {
    "condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit) && ifYourVanguardIsGrade3orGreater()){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){increasePowerEndTurn(unit, 5000)}
    },
    "text": "[AUTO](RC):When this unit attacks, if your vanguard is grade 3 or greater, this unit gets [Power]+5000 until end of turn.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  },
  "ability2": {
    "condition": async function (unit){ finalRushOnRC(unit)},
    "cost": {
      "counterBlast": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "soul": {
        "amount": 1,
        "filter": basicPropertyArray
      },
       "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await soulBlast(this.soul.amount) }
    },
    "effect": {

      "effect": async function (unit){
        unit.attackFunction = attackFrontrow

        untilEndTurn(()=>{
          unit.attackFunction = null
        }, unit)

      }
    },
    "text": "[ACT](RC):If you are in \"Final Rush\", COST [Counter Blast (1) & Soul Blast (1)], and until end of turn, when this unit would attack, it battles all of your opponent's front row units.",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "type": "ACT",
    "permanent": true,
    "costPaid": false
  }
},
"Desire Devil, Hystera": {
  "ability1": {
    "condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit)){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){
        let multiplier = 2000
        if(userZones.damage.length >=5){
          multiplier = 5000
        }
        let standRG = await searchCircles(newPropertyArray([standUnits(), rearguard()]))
        increasePowerEndTurn(unit, (multiplier * standRG.length))
      }
    },
    "text": "[AUTO](RC):When this unit attacks, this unit gets [Power]+2000 until end of turn for each of your [Stand] rear-guards. If your damage zone has five or more cards, it gets +5000 instead of +2000.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Diabolos Madonna, Meryl": {
  "ability1": {
    "condition": async function (unit){ if(whenThisUnitAttacksAVanguard(unit) && onRC(unit) ){return true} return false},
cost:null,
    "effect": {

      "effect": async function (unit){increasePowerEndTurn(unit, 2000)

        if(finalRush()){
          await resolveNewAbility(unit, soulBlastObject() , async()=>{increasePowerEndTurn(userCircles.userVG.unit, 10000)})
        }

      }
    },
    "text": "[AUTO](RC):When this unit attacks a vanguard, until end of turn, this unit gets [Power]+2000, and if you are in \"Final Rush\", COST [Soul Blast (1)], choose one of your vanguards, and it gets [Power]+10000.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Desire Devil, Acratz": {
  "ability1": {
    "condition": async function (unit){ if(putIntoSoulFromRC(unit) && duringVanguardAbility()){return true} return false},
cost:{"counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}},
    "effect": {

      "effect": async function (unit){

        increasePowerEndTurn(userCircles.userVG.unit, 10000)
      }
    },
    "text": "[AUTO]:When this unit is put from (RC) into your soul by your vanguard's ability, COST [Counter Blast (1)], choose one of your vanguards, and it gets [Power]+10000 until end of turn.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Piercing Assistant": {
  "ability1": {
    "condition": async function (unit){ if(personaRodeThisTurn()  &&onRC(unit) && turnState.current.event === 'soulCharge' ){return true} return false},
cost:{"counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}},
    "effect": {

      "effect": async function (unit){draw(1)}
    },
    "text": "[AUTO](RC)1/Turn:When you Soul Charge by your card's ability, if you persona rode this turn, COST [Counter Blast (1)], and draw a card.",
    "type": "AUTO",
    "1/Turn": true,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Metallize Erosio": {
  "ability1": {
    "condition": async function (unit){ if(onRC(unit) && userZones.soul.length >=0){return true} return false},
    "on": async function (unit){ 
      let col = await getColumn(unit.circle)
      col = col.opponent
 
      let prop = []
      col.forEach((circ)=>{prop.push({cardProperty:'circle',propertyToFind:circ, condition:'=' , })})
      yourOpponentCannotIntercept(this.abilityId,orPropertyArray(prop) )
      yourOpponentCannotBoost(this.abilityId + 1,orPropertyArray(prop) )
    },
    "off": async function (unit){ removeAllOfYourOpponentsUnits(this.abilityId);  removeAllOfYourOpponentsUnits(this.abilityId + 1)},
    "isOn": false,
    "text": "[CONT](RC):If your soul has seven or more cards, all of your opponent's rear-guards in same column as this unit loses \"Intercept\" and \"Boost\", and cannot get them.",
    "type": "CONT",
    "permanent": true,
    "cost": null
  }
},
"Evil Eye of Prohibition, Quen Lu": {
  "ability1": {
    "condition": async function (unit){ onRC(unit)},
    "cost": {
      "thisUnit": {
        "amount": 1,
        "filter": basicPropertyArray
      },
       "costEffect": async function (unit){await soulThisUnit(unit)}
    },
    "effect": {

      "effect": async function (unit){
        await chooseUnits(1, rearguard() , async (card)=>{
          increasePowerEndTurn(card, 2000)
          if(userZones.soul.length >=7){
            makeConditionalContinuous(this.abilityId, card, async ()=>{if(currentBattle.current.attackingUnit && currentBattle.current.attackingUnit.id === card.id){
              await guardRestrictEndBattle(card, 'grade1orGreater')
              untilEndTurn(()=>{
                removeConditionalContinuous(this.abilityId)
              }, card)
            }}  )
            
        
          }

        })
      }
    },
    "text": "[ACT](RC):COST [Put this unit into your soul], choose one of your rear-guards, and it gets [Power]+2000 until end of turn. Then, if your soul has seven or more cards, your opponent cannot call grade 1 or greater cards from their hand to (GC) for the battle that that rear-guard attacks this turn.",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "type": "ACT",
    "permanent": true,
    "costPaid": false
  }
},
"Diabolos Boys, Cyril": {
  "ability1": {
    "condition": async function (unit){ if(whenThisUnitBoosts(unit)&& currentBattle.current.attackingUnit.tempGrade=== 3){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){
        yourOpponentCannotIntercept(this.abilityId, basicPropertyArray)
        untilEndBattle(()=>{
          removeAllOfYourOpponentsUnits(this.abilityId)
        })

      }
    },
    "text": "[AUTO](RC):When this unit boosts a grade 3 unit, your opponent cannot intercept until end of that battle.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Diabolos Girls, Belinda": {
  "ability1": {
    "condition": async function (unit){ if(onRC(unit) && beginningOfMain() && ifYourVanguardIsGrade3orGreater() ){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){soulCharge(1)
        if(finalRush()){
          increasePowerEndTurn(unit, 5000)
        }
      }
    },
    "text": "[AUTO](RC):At the beginning of your main phase, if your vanguard is grade 3 or greater, Soul Charge (1), and if you are in \"Final Rush\", this unit gets [Power]+5000 until end of turn.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Desire Devil, Gouman": {
  "ability1": {
    "condition": async function (unit){ if(whenRodeUponBy(unit,'Desire Devil, Boshokku')){return true} return false},
cost:{
  "rideDeck": {
    "amount": 1,
    "filter": nameIsX('Avaricious Demonic Dragon, Greedon')
  },
   "costEffect": async function (unit){await reveal(1, newDeck.RideDeck,nameIsX('Avaricious Demonic Dragon, Greedon') )}
},
    "effect": {

      "effect": async function (unit){draw(1)}
    },
    "text": "[AUTO]:When this unit is rode upon by \"Desire Devil, Boshokku\", COST [reveal a \"Avaricious Demonic Dragon, Greedon\" from your ride deck], and draw a card.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  },
  "ability2": {
    "condition": async function (unit){ if(putIntoSoulFromRC(unit) && duringVanguardAbility()&& ifYourOpponentsVanguardIsGrade3orGreater()){return true} return false},
cost:{
  "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}
},
    "effect": {

      "effect": async function (unit){guardRestrictEndTurn(unit, 'twoOrMore')}
    },
    "text": "[AUTO]:When this unit is put from (RC) into your soul by your vanguard's ability, if your opponent's vanguard is grade 3 or greater, COST [Counter Blast (1)], and until end of turn, when your opponent would call cards from hand to (GC), they must call two or more at the same time.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Desire Devil, Yaaba": {
  "ability1": {
    "condition": async function (unit){ inSoul(unit) && ifYourVanguardIs('Avaricious Demonic Dragon, Greedon')},
    "cost": {
      "inSoul": {
        "amount": 1, 
        "filter": basicPropertyArray
      },
      "costEffect": async function (unit){await dropThisCard(unit)}
    },
    "effect": {

      "effect": async function (unit){await increaseUnitsPowerEndTurn(1, 5000, vanguard())}
    },
    "text": "[ACT](Soul):If your vanguard is \"Avaricious Demonic Dragon, Greedon\", COST [put this card into your drop], choose one of your vanguards, and it gets [Power]+5000 until end of turn.",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "type": "ACT",
    "permanent": true,
    "costPaid": false
  }
},
"Desire Devil, Taida": {
  "ability1": {
    "condition": async function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){draw(this.draw.amount)}
    },
    "text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Geo Acceleration": {},
"Cardinal Draco, Stil Juge": {
  "ability1": {
    "condition": async function (unit){ if(ifThisUnitIsBoostedBy(unit , 'Shadow Army')){return true} return false},
cost:{    "soul": {
  "amount": 1, 
  "filter": basicPropertyArray
},
"costEffect": async function (unit){await soulBlast(this.soul.amount)}},
    "effect": {

      "effect": async function (unit){await counterCharge(1)}
    },
    "text": "[AUTO](RC):When this unit is boosted by a Shadow Army token, COST [Soul Blast (1)], and Counter Charge (1).",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Gravidia Pribram": {
  "ability1": {
    "condition": async function (unit){ if(whenThisUnitsAttackHitsOnRC(unit)){
      return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){await deckToOrder(1, meteorite())}
    },
    "text": "[AUTO](RC):When this unit's attack hits, search your deck for up to one Meteorite card, put it into your Order Zone, and shuffle your deck.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Aurora Battle Princess, Cuff Spring": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){
       await  makeOpponent(unit)
      }
    },
    "text": "[AUTO]:When this unit is placed on (RC), your opponent chooses a card from their hand, and imprisons it in your Prison. If it was imprisoned, your opponent draws a card.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Cardinal Draco, Abstrim": {
  "ability1": {
    "condition": async function (unit){ if(onRC(unit) && ifYourWorldIsAbyssalDarkNight()){return true} return false},
    "on": async function (unit){unit.attackFunction = allUnitsAttack},
    "off": async function (unit){ unit.attackFunction = null },
    "isOn": false,
    "text": "[CONT](RC):If your World is Abyssal Dark Night, this unit can attack your opponent's back row units.",
    "type": "CONT",
    "permanent": true,
    "cost": null
  }
},
"Gravidia Laigle": {
  "ability1": {
    "condition": async function (unit){ if(whenThisUnitAttacksOnRC(unit)){
      let ord = await searchZones(userZones.orderZone, meteorite())
      if(ord.length >0 )
        return true} return false},
    "on": async function (unit){ guardRestrictEndBattle(unit, 'twoOrMore')},
    "off": async function (unit){ },
    "isOn": false,
    "text": "[CONT](RC):During the battle that this unit attacks, if your Order Zone has three or more Meteorites, when your opponent would call cards from their hand to (GC), they must call two or more at the same time.",
    "type": "CONT",
    "permanent": true,
    "cost": null
  }
},
"Blitz Interrupter": {
  "ability1": {
    "condition": async function (unit){ if(whenPutOnGC(unit)){return true} return false},
cost:{
  "soul": {
    "amount": 1, 
    "filter": basicPropertyArray
  },
 
  "hand": {
    "amount": 1,
    "filter": setOrder()
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount); await discard(this.hand.amount,this.hand.filter)}
},
    "effect": {

      "effect": async function (unit){increaseShieldEndBattle(unit, 15000)}
    },
    "text": "[AUTO]:When this unit is put on (GC), COST [Soul Blast (1) & discard a Set Order from your hand], and this unit gets [Shield]+15000 until end of that battle.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Cardinal Fang, Kinetia": {
  "ability1": {
    "condition": async function (unit){ if(onRC(unit) && whenYourVanguardIsAttacked()){return true} return false},
cost:{    "thisUnit": {
  "amount": 1,
  "filter": basicPropertyArray
},
 "costEffect": async function (unit){await retireThisUnit(unit)}},
    "effect": {

      "effect": async function (unit){
        await chooseUnits(1, vanguard(), (card)=>{
          let power = 0
          if(ifYourWorldIsDarkNight()){
            power = 5000
          }
          else if(ifYourWorldIsAbyssalDarkNight()){
            power = 10000
          }
          increasePowerEndBattle(card, power)
        })
      }
    },
    "text": "[AUTO](RC):When your vanguard is attacked, COST [retire this unit], choose one of your vanguards, and if your World is Dark Night, it gets [Power]+5000 until end of that battle. If it is Abyssal Dark Night instead of Dark Night, it gets [Power]+10000 until end of that battle.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Aurora Battle Princess, Shirer Zenith": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
cost:{
  "counterBlast": {
        "amount": 1,
        "filter": basicPropertyArray
      },
      "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}},
    "effect": {

      "effect": async function (unit){
        let circles = await chooseOpponentUnits(1, rearguard())
        if(circles.length > 0){
          let card = currentOpponentCircles.current[circles[0]]
          soulCharge(card.tempGrade)
          await removeOpponentUnits(circles , 'imprison')
        }

      }
    },
    "text": "[AUTO]:When this unit is placed on (RC), COST [Counter Blast (1)], choose one of your opponent's rear-guards, imprison it in your Prison, and Soul Charge (1) for each grade of that imprisoned card.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Gravidia Wells": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnVC(unit)){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){
        await lookTopXAddShuffleRest(userZones.hand, 7, 7, meteorite())
      }
    },
    "text": "[AUTO]:When this unit is placed on (VC), look at seven cards from the top of your deck, choose any number of Meteorite cards, reveal them and put them into your hand, and shuffle your deck.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  },
  "ability2": {
    "condition": async function (unit){ onRC(unit) && ifYourVanguardIs('Gravidia Nordlinger')},
    "cost": {
      "soul": {
        "amount": 1, 
        "filter": basicPropertyArray
      },
      "costEffect": async function (unit){await soulBlast(this.soul.amount)}
    },
    "effect": {

      "effect": async function (unit){
        await handToOrder(2, meteorite())
        increasePowerEndTurn(unit, 2000)
      }
    },
    "text": "[ACT](RC)1/Turn:If your vanguard is \"Gravidia Nordlinger\", COST [Soul Blast (1)], choose up to two Meteorite cards from your hand, put them into your Order Zone, and this unit gets [Power]+2000 until end of turn.",
    "1/Turn": true,
    "Used1/Turn": false,
    "H1/Turn": false,
    "type": "ACT",
    "permanent": true,
    "costPaid": false
  }
},
"Aurora Battle Princess, Tear Croca": {
  "ability1": {
    "condition": async function (unit){ if(whenPutOnGC(unit)){
      let ord = await searchZones(userZones.orderZone, setOrder())
      if(ord.length >=1)
      return true} return false},
cost:{"counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}},
    "effect": {

      "effect": async function (unit){increaseShieldEndBattle(unit, 10000)}
    },
    "text": "[AUTO]:When this unit is put on (GC), if your Order Zone has a Set Order, COST [Counter Blast (1)], and this unit gets [Shield]+10000 until end of that battle.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Gravidia Dellen": {
  "ability1": {
    "condition": async function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){draw(this.draw.amount)}
    },
    "text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Refablishment Dock": {
  "ability3": {
    "condition": async function (unit){ if(whenThisCardIsPutIntoOrderZone(unit)){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){draw(1)}
    },
    "text": "[AUTO]:When this card is put into the Order Zone, draw a card.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  },
  "ability4": {
    "condition": async function (unit){ if(inOrderZone(unit)){return true} return false},
    "on": async function (unit){ allOfYourUnits(this.abilityId, grade2(), (card)=>{getsBoost(card)} , (card)=>{removeBoost(card)})},
    "off": async function (unit){ removeAllOfYourUnits(this.abilityId)},
    "isOn": false,
    "text": "[CONT](Order Zone):All of your grade 2 rear-guards get \"Boost\".",
    "type": "CONT",
    "permanent": true,
    "cost": null
  }
},
"Neatness Meteor Shower": {
  "ability2": {
    "condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false},
    "on": async function (unit){ },
    "off": async function (unit){ },
    "isOn": false,
    "text": "[CONT]:You may have up to sixteen \"Neatness Meteor Shower\" in your deck.",
    "type": "CONT",
    "permanent": true,
    "cost": null
  },
  "ability3": {
    "condition": async function (unit){ if(whenThisCardIsPutIntoOrderZone(unit)){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){
        youMay(1, ()=>{soulCharge(1)})
        if(duringVanguardAbility()){
          youMay(1, ()=>{draw(1)})
        }

      }
    },
    "text": "[AUTO]:When this card is put into the Order Zone, you may Soul Charge (1). If it was put by your vanguard's ability, you may draw a card.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  },
  "ability4": {
    "condition": async function (unit){ if(ifThisCardIsPutInto(unit,'drop') && unit.previousArea ==='orderZone'){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){await retireOpponentRearguards(1)}
    },
    "text": "[AUTO]:When this card is put into your drop from the Order Zone, choose one of your opponent's rear-guards, and retire it.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Heavenly Core of Wonder, Fortitudo": {
  "ability1": {
    "condition": async function (unit){ if(onRC(unit)){
      let latest = latestEvent()
      if(latest.action === 'effectStand')
      return true} return false},
cost:{    "thisUnit": {
  "amount": 1,
  "filter": basicPropertyArray
},
 "costEffect": async function (unit){await restThisUnit(unit)}},
    "effect": {

      "effect": async function (unit){

    await increaseUnitsPowerEndTurn(1, 5000, rearguard())}
    },
    "text": "[AUTO](RC):When your unit [Stand] by a card's ability, COST [[Rest] this unit], choose one of your other rear-guards, and it gets [Power]+5000 until end of turn.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Heaven Sent Great Magic, Milmomo": {
  "ability1": {
    "condition": async function (unit){ if(onRC(unit) && await whenYourDriveCheckRevealsATrigger() && ifYourVanguardIs('Hexaorb Sorceress')){return true} return false},
cost:{    "soul": {
  "amount": 1, 
  "filter": basicPropertyArray
},
"costEffect": async function (unit){await soulBlast(this.soul.amount)}},
    "effect": {

      "effect": async function (unit){increasePowerEndTurn(unit, 5000)}
    },
    "text": "[AUTO](RC):When your drive check reveals a trigger unit, if your vanguard is \"Hexaorb Sorceress\", COST [Soul Blast (1)], and this unit gets [Power]+5000 until end of turn.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Bullseye Scope, Gaderel": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnRC(unit)&&
    userCircles.userVG.unit.tempGrade === currentOpponentCircles.current.opponentVG.unit.tempGrade
    ){return true} return false},
cost:{"counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}},
    "effect": {

      "effect": async function (unit){
        increasePowerEndTurn(unit, 5000)
        await increaseUnitsPowerEndTurn(1 , 5000,  [{"cardProperty" :  'id' , "propertyToFind":unit.id , "condition": '!=>'}])}
    },
    "text": "[AUTO]:When this unit is placed on (RC), if your and your opponent's vanguards have the same grade, COST [Counter Blast (1)], choose one of your other rear-guards, that unit and this get [Power]+5000 until end of turn.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Heavenly Shield of Encompassment, Felicida": {
  "ability1": {
    "condition": async function (unit){onRC(unit) &&personaRodeThisTurn() },
    "cost": {
"counterBlast": {
      "amount": 2,
      "filter": basicPropertyArray
    },
    "thisUnit": {
      "amount": 1,
      "filter": basicPropertyArray
    },
 
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await retireThisUnit(unit)}
    },
    "effect": {

      "effect": async function (unit){await chooseUnits(1, grade3(), (card)=>{
        increaseDriveEndTurn(card, 1)
      })}
    },
    "text": "[ACT](RC):If you persona rode this turn, COST [Counter Blast (2) & retire this unit], choose one of your grade 3 units, and it gets drive +1 until end of turn.",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "type": "ACT",
    "permanent": true,
    "costPaid": false
  }
},
"Knight of Heavenly Bullet, Proklis": {
  "ability1": {
    "condition": async function (unit){ onRC(unit)},
    "cost": {
    "thisUnit": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "otherRearguards":{
      "amount": 1,
      "filter": basicPropertyArray
},
     "costEffect": async function (unit){await retireThisUnit(unit); await restYourRearguards(1)}
    },
    "effect": {

      "effect": async function (unit){
        let rest = await lookTopXAdd(userZones.hand, 3, 3,grade3())
        putDrop(rest)
      }
    },
    "text": "[ACT](RC):COST [Put this unit into your soul & [Rest] another rear-guard], look at three cards from the top of your deck, choose any number of grade 3 cards from among them, reveal them and put them into your hand, and discard the rest.",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "type": "ACT",
    "permanent": true,
    "costPaid": false
  }
},
"Magic of Realization, Kikitsch": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
cost:null,
    "effect": {

      "effect": async function (unit){
        let handS= userZones.hand.length
        await handToBotDeck (1, orPropertyArray([{cardProperty : 'triggerType' , propertyToFind:'Critical' , condition:'='},{cardProperty : 'triggerType' , propertyToFind:'Front' , condition:'='}]))
        if(handS !== userZones.hand.length){
          await resolveNewAbility(unit, soulBlastObject() , ()=>{draw(1)})
        }
      }
    },
    "text": "[AUTO](RC):When this unit is placed on (RC), choose up to one [Critical] trigger or [Front] trigger from your hand, reveal it and put it on the bottom of your deck. If you put a card, COST [Soul Blast (1)], and draw a card.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Diffuser Angel": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
cost:{    "hand": {
  "amount": 1,
  "filter": basicPropertyArray
},
"costEffect": async function (unit){await handToSoul(this.hand.amount)}},
    "effect": {

      "effect": async function (unit){await increaseUnitsPowerEndTurn(1, 5000, vanguard())}
    },
    "text": "[AUTO]:When this unit is placed on (RC), COST [put a card from your hand into your soul], choose one of your vanguards, and that unit and this unit get [Power]+5000 until end of turn.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Knight of Heavenly Piercing, Esalta": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnRC(unit) || (ifThisCardIsDiscarded(unit)&& duringYourTurn())){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){
        await chooseUnits(1, backrowRearguards(), (card)=>{standThisUnit(card)})
      }
    },
    "text": "[AUTO]:When this card is placed on (RC) or discarded from hand during your turn, choose one of your back row rear-guards, and [Stand] it.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Knight of Heavenly Stride, Salire": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
cost:{
  "soul": {
    "amount": 1, 
    "filter": basicPropertyArray
  },
 
  "hand": {
    "amount": 3,
    "filter": grade3()
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount);await reveal(this.hand.amount,userZones.hand, this.hand.filter)}
},
    "effect": {

      "effect": async function (unit){
        await dropToTopDeck(1, grade3())
      }
    },
    "text": "[AUTO]:When this unit is placed on (RC), COST [Soul Blast (1) & reveal three grade 3 from your hand], choose a grade 3 card from your drop, and put it on the top of your deck.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Magic of Starry Skies, Marlna": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
cost:{
  "hand": {
    "amount": 1,
    "filter": nameIsX('Hexaorb Sorceress')
  },
  "costEffect": async function (unit){await discard(this.hand.amount,this.hand.filter)}
},

    "effect": {

      "effect": async function (unit){
        await increaseUnitsPowerEndTurn(1, 10000,nameIsX('Hexaorb Sorceress'))
      }
    },
    "text": "[AUTO]:When this unit is placed on (RC), COST [discard a \"Hexaorb Sorceress\" from your hand], choose a Hexaorb Sorceress on your (VC) or (RC), and it gets [Power]+10000 until end of turn.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Removal Angel": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnRC(unit)){return true} return false},
cost:{    "hand": {
  "amount": 1,
  "filter": sentinel()
},
"costEffect": async function (unit){await discard(this.hand.amount, this.hand.filter)}},
    "effect": {

      "effect": async function (unit){
        await chooseOneOfTheFollowing([{text:'Counter Charge 1' , effect:async ()=>{await counterCharge(1)} } , 
          {text:'Soul Charge 2' , effect:async ()=>{await soulCharge(2)}}  , 
        ])
      }
    },
    "text": "[AUTO]:When this unit is placed on (RC), COST [discard a sentinel from your hand], and Counter Charge (1) or Soul Charge (2).",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Knight of Heavenly Release, Hulp": {
  "ability1": {
    "condition": async function (unit){ if(onGC(unit)){return true} return false},
    "on": async function (unit){ allOfYourUnits(this.abilityId, grade3() , (card)=>{increaseShield(card, 5000)} ,(card)=>{increaseShield(card, -5000)} ,  )},
    "off": async function (unit){ removeAllOfYourUnits(this.abilityId)},
    "isOn": false,
    "text": "[CONT](GC):All of your grade 3 units get [Shield]+5000.",
    "type": "CONT",
    "permanent": true,
    "cost": null
  }
},
"Fabricated Dragon of Ruination": {
  "ability1": {
    "condition": async function (unit){ if(whenPlacedOnVC(unit)){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){
        let zone = await searchZones(userZones.drop, normalOrder())
        
        let select = await clickAbilityZone(zone, 1,)
        if(select.selected.length === 0){return}
        let order = select.selected[0]

        order.orderEffects.cost = null
        await play(order)

      }

    },
    "text": "[AUTO]:When this unit is placed on (VC), choose a Normal Order from your drop, and you may play it without paying its cost. (This play is counted towards the number of orders played)",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Miscreant Beating": {
  "ability1": {
    "condition": async function (unit){ if(onRC(unit)){return true} return false},
    "on": async function (unit){ addContinuousValue(this.abilityId, userZones.bind, 5000, orders())},
    "off": async function (unit){ removeContinuousValue(this.abilityId)},
    "isOn": false,
    "text": "[CONT](RC):This unit gets [Power]+5000 for each order card in your bind zone. (Active on opponent's turn too)",
    "type": "CONT",
    "permanent": true,
    "cost": null
  }
},
"Creed Assault": {
  "ability1": {
    "condition": async function (unit){ if(onRC(unit)){
      let stood = Object.values(playerObjects.current.unitsStoodThisTurn)
      if(stood.length === 0 || stood.filter((card)=>card.circle.includes('RG')).length === 0 )
      return true} return false},
    "on": async function (unit){unit.canAttack = false },
    "off": async function (unit){ unit.canAttack = true},
    "isOn": false,
    "text": "[CONT](RC):If your rear-guard did not [Stand] by a card's effect this turn, this unit cannot attack.",
    "type": "CONT",
    "permanent": true,
    "cost": null
  },
  "ability2": {
    "condition": async function (unit){ if(onRC(unit) && duringTheBattleThisUnitAttacked(unit) && attackedAVanguard()){return true} return false},
    "on": async function (unit){increasePower(unit, 10000) },
    "off": async function (unit){ increasePower(unit,-10000)},
    "isOn": false,
    "text": "[CONT](RC):During the battle this unit attacked a vanguard, this unit gets [Power]+10000.",
    "type": "CONT",
    "permanent": true,
    "cost": null
  }
},
"Sylvan Horned Beast, Linbur": {
  "ability1": {
    "condition": async function (unit){ if(onBackRowRC(unit)){return true} return false},
    "on": async function (unit){ allOfYourUnits(this.abilityId , backrow() , (card)=>{increasePower(card, 2000) , increasePower(card,-2000)})},
    "off": async function (unit){ removeAllOfYourUnits(this.abilityId)},
    "isOn": false,
    "text": "[CONT](Back Row RC):All of your back row rear-guards get [Power]+2000. (This unit is included)",
    "type": "CONT",
    "permanent": true,
    "cost": null
  }
},
"Sylvan Horned Beast, Barometz": {
  "ability1": {
    "condition": async function (unit){ if(onFrontRowRC(unit) || onVC(unit)){return true} return false},
    "on": async function (unit){ unit.canAttack = false},
    "off": async function (unit){ unit.canAttack = true},
    "isOn": false,
    "text": "[CONT](VC/RC):This unit cannot attack from the front row.",
    "type": "CONT",
    "permanent": true,
    "cost": null
  }
},
"Inroad Shooter": {
  "ability1": {
    "condition": async function (unit){ if(whenRodeUponBy(unit , 'Ascendance Assault')){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){await callThisCard(unit)}
    },
    "text": "[AUTO]:When this unit is rode upon by \"Ascendance Assault\", call this card to (RC).",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  },
  "ability2": {
    "condition": async function (unit){ if(onRC(unit) && (ifYourVanguardIs('Flagship Dragon, Flagburg Dragon') || ifYourVanguardIs('Ascendance Assault'))){return true} return false},
    "on": async function (unit){ increasePower(unit, 2000); getsIntercept(unit)},
    "off": async function (unit){ increasePower(unit, -2000); removeIntercept(unit) },
    "isOn": false,
    "text": "[CONT](RC):If your vanguard is \"Flagship Dragon, Flagburg Dragon\" or \"Ascendance Assault\", this unit gets \"Intercept\", and [Power]+2000.",
    "type": "CONT",
    "permanent": true,
    "cost": null
  }
},
"Sylvan Horned Beast, Molemora": {
  "ability1": {
    "condition": async function (unit){ if(onRC(unit) && whenYourOtherUnitAttacks(unit) && isOnBackrow(currentBattle.current.attackingUnit)){return true} return false},
cost:{
  "thisUnit": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await restThisUnit(unit)}
},
    "effect": {

      "effect": async function (unit){
        increasePowerEndBattle(currentBattle.current.attackingUnit, 10000)
      }
    },
    "text": "[AUTO](RC):When your other rear-guard attacks from the back row, COST [[Rest] this unit], and the unit that attacked gets [Power]+10000 until end of that battle.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Carrion Processing": {
  "ability1": {
    "condition": async function (unit){onRC(unit) },
    "cost": {
"counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "thisUnit": {
      "amount": 1,
      "filter": basicPropertyArray
    },
 
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await bindThisUnit(unit)}

    },
    "effect": {

      "effect": async function (unit){await dropToHand(1, orders())}
    },
    "text": "[ACT](RC):COST [Counter Blast (1) & Bind this unit], choose an order card from your drop, and put it into your hand.",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "type": "ACT",
    "permanent": true,
    "costPaid": false
  }
},
"Prized Trident": {
  "ability1": {
    "condition": async function (unit){ if(onRC(unit) && whenYourOtherUnitAttacks(unit) && playerObjects.current.attacksThisTurn >= 5 ){return true} return false},
cost:{
  "thisUnit": {
    "amount": 1,
    "filter": basicPropertyArray
  },
   "costEffect": async function (unit){await soulThisUnit(unit)}
},
    "effect": {

      "effect": async function (unit){await counterCharge(1)}
    },
    "text": "[AUTO](RC):When your other unit attacks, if it is the fifth battle of this turn, COST [put this unit into your soul], and Counter Charge (1).",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Sylvan Horned Beast, Hedgc": {
  "ability1": {
    "condition": async function (unit){ if(onRC(unit) &&whenYourOtherRearguardIsPlaced(unit)){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){increasePowerEndTurn(unit, 5000)}
    },
    "text": "[AUTO](RC)1/Turn:When your other rear-guard is placed, this unit gets [Power]+5000 until end of turn.",
    "type": "AUTO",
    "1/Turn": true,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
"Officer Cadet, Charicles": {
  "ability1": {
    "condition": async function (unit){ if(whenRodeUponIfSecond(unit)){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){draw(this.draw.amount)}
    },
    "text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  }
},
'Energy Generator':{
  "ability1": {
    "condition": async function (unit){ if(unit.place === 'rideDeck' && whenYourVanguardIsPlaced(unit)){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){
        userZones.crest.push(unit)
        unit.place = 'crest'
        removeById(newDeck.RideDeck, unit.id )
        if(turnCount.current === 2){
          energyCharge(3)
        }
      }
    },
    "text": "[AUTO](Ride Deck):When you ride, put this card into the crest zone, and if you went second, Energy Charge (3).",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  },
  "ability2": {
    "condition": async function (unit){ if( 1){return true} return false},
    "on": async function (unit){ playerObjects.current['maxEnergy'] = 10},
    "off": async function (unit){ playerObjects.current['maxEnergy'] = 100  },
    "isOn": false,
    "text": "[CONT]:You may have up to ten energy.",
    "type": "CONT",
    "permanent": true,
    "cost": null
  },
  "ability3": {
    "condition": async function (unit){ if(beginningOfRide()){return true} return false},
    "cost": null,
    "effect": {

      "effect": async function (unit){energyCharge(3)}
    },
    "text": "[AUTO]:At the beginning of your ride phase, Energy Charge (3).",
    "type": "AUTO",
    "1/Turn": false,
    "Used1/Turn": false,
    "H1/Turn": false,
    "permanent": true
  },
  "ability4": {
    "condition": async function (unit){ return true},
    "cost": {
    "energy": {
      "amount": 7,
      "filter": basicPropertyArray
    },
     "costEffect": async function (unit){energyBlast(7)}
    },
    "effect": {
      "effect": async function (unit){
        draw()
      }
    },
    "text": "[ACT]1/Turn:COST [Energy Blast (7)], and draw a card.",
    "1/Turn": true,
    "Used1/Turn": false,
    "H1/Turn": false,
    "type": "ACT",
    "permanent": true,
    "costPaid": false
  }
}

}
const orderEffects=  {
"Aim to be the Strongest Idol!": {
  "condition": async function (){ let u= await searchCircles(earnescorrect()); if(u.length >= 5){return true}return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){ 
      await allOfYourUnits(this.orderId ,earnescorrect(), (card)=>{increasePower(card, 5000)}, (card)=>{increasePower(card, -5000)} );
      if(ifYourOpponentsVanguardIsGrade3orGreater()){
        await chooseUnits(1, nameIsX('Earnescorrect Leader, Clarissa'), (card)=>{
          giveCONTAbilityEndTurn(card, (uni)=>onVC(uni), (uni)=>{uni.attackFunction = attack3Units}, (uni)=>{uni.attackFunction = normalAttack})
        } )
      }
      untilEndTurn(()=>{
        removeAllOfYourUnits(this.orderId)
      } , unit)
    }
  },
  "text": "Play this if you have five or more units with \"Earnescorrect\" in their different card names!\nUntil end of turn, all of your units with \"Earnescorrect\" in their card names get [Power]+5000. If your opponent's vanguard is grade 3 or greater, choose one of your \"Earnescorrect Leader, Clarissa\", and it gets \"[CONT](VC):When this unit would attack, choose three of your opponent's (VC) or (RC), and this unit battles all of the units on the chosen circles.\".",
  "permanent": true
},
"Truehearted Ruby": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (){ await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (card){ draw(2); await discard(1); soulThisCard(card) }
  },
  "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul.",
  "permanent": true
},
"Clean Clean": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (){ await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){
      draw() ; await increaseUnitsPowerEndTurn(1, 5000)
     }
  },
  "text": "Play this with COST [Counter Blast (1)]!\nDraw a card, choose one of your units, and it gets [Power]+5000 until end of turn.",
  "permanent": true
},
"Everlasting Sapphire": {
  "condition": async function (){if(1){return true}return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (card){
      await increaseUnitsPowerEndTurn(1, 5000); soulThisCard(card)
     }
  },
  "text": "Choose one of your units, and it gets [Power]+5000 until end of turn. Put this card into your soul.",
  "permanent": true
},
"Vibrant Symphony": {
  "condition": async function (){if(1){return true}return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ 
      if(ifYourVanguardWasHitThisTurn()){
        await chooseUnits(1 , beingAttacked() , (card) =>{increasePowerEndBattle(unit, 30000)})
      }
    }
  },
  "text": "If an attack hit your vanguard this turn, choose one of the attacked units, and it gets [Power]+30000 until end of that battle.",
  "permanent": true
},
"Face-Off and Overcome": {
  "condition": async function (){if(ifYourVanguardIs('Archangel of Twin Wings, Alestiel' )){return true}return false}, 
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){ 
      await chooseUnits(1, units() , async (card)=>{
        let power = await searchCircles(orPropertyArray([grade1() , newPropertyArray(grade3()) ]))
        let amount = power.length-1 
        if(amout < 0) amount = 0
        increasePowerEndBattle(card, (power.length-1 * 5000)) 

      })
  let id = unit.id

      makeConditionalContinuous( id , unit, ()=>{
        let drop = userZones.drop
 
        for(let i = drop.length -1; i>=0; i--){
 
          if(drop[i].state.includes('retired')){
            soulThisCard(drop[i])
          }
        }
      }  
      
    )
    untilEndTurn(()=>{removeConditionalContinuous( id)} , unit)

    }
  },
  "text": "Play this if your vanguard is \"Archangel of Twin Wings, Alestiel\"!\nChoose one of your units being attacked, and it gets [Power]+5000 until end of that battle for each of your rear-guards with odd grades. Until end of turn, when your unit with an even grade would be retired from (RC) or (GC), you may put that card into your soul instead of the drop.",
  "permanent": true
},
"Luminescence Fountain": {
  "condition": async function (){if(1){return true}return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ 
      let num = await searchCircles()
      if(num.length > 2){
        doAllUnits(beingAttacked() , (card)=>{increasePowerEndBattle(card , 15000)})
      }
    }
  },
  "text": "If you have three or more rear-guards, all your units being attacked get [Power]+15000 until end of that battle.",
  "permanent": true
},
"Tathagata": {
  "condition": async function (){if(await ifYouHaveAUnitWithInItsCardName('Yoh Asakura')){return true}return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ 
      let amidamarus = await searchCircles([{
        "cardProperty": "name",
        "propertyToFind": "Amidamaru",
        "condition": "includes"
      }, {
        "cardProperty": "place",
        "propertyToFind": "RC",
        "condition": "="
      }])

      if(amidamarus.length >0){
        await increaseUnitsPowerEndTurn(1, 10000,[{
          "cardProperty": "name",
          "propertyToFind": "Yoh Asakura",
          "condition": "includes"
        }, {
          "cardProperty": "place",
          "propertyToFind": "VC",
          "condition": "="
        }])
      }
      else if(amidamarus.length === 0){
        await callFromDrop(1, [{
          "cardProperty": "name",
          "propertyToFind": "Amidamaru",
          "condition": "includes"
        },])
      }
    }
  },
  "text": "Play this if you have a unit with \"Yoh Asakura\" in its card name!\nIf you have a rear-guard with \"Amidamaru\" in its card name, choose one of your vanguards with \"Yoh Asakura\" in its card name, and it gets [Power]+10000 until end of turn. If you do not have a rear-guard with \"Amidamaru\" in its card name, choose a card with \"Amidamaru\" in its card name from your drop, and call it to (RC).",
  "permanent": true
},
"Over Soul Strike!": {
  "condition": async function (){if(1){return true}return false},  
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){
      if(vanguardOverSoulThisTurn()){
        retireAllOpponentsRearguards()
      }
     }
  },
  "text": "(You may only have one [Over] trigger in a deck. When revealed as a trigger, remove that card, draw a card, choose one of your units, and it gets [Power]+100 Million until end of turn! If revealed during drive check, activate its additional effect!)\nAdditional Effect-Choose one of your opponent's vanguards, and deal one damage!(Damage check first even if there are drive checks remaining)\n\nPlay Effect (Resolve this effect when played as an order!)-If your vanguard [Over Soul] this turn, retire all of your opponent's rear-guards.",
  "permanent": true
},
"Brothers' Soul": {
  "condition": async function (){if(1){return true}return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ soulCharge(2)}
  },
  "text": "Soul Charge (2).",
  "permanent": true
},
"Sunburst Evolution": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (){ await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "add": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "name",
          "propertyToFind": "Vairina",
          "condition": "="
        }
      ]
    },
    "effect": async function (){
      await increaseUnitsPowerEndTurn(1, 5000);
      await dropToHand(1, this.add.filter)
     }
  },
  "text": "Play this with COST [Counter Blast (1)]!\nChoose one of your units, and it gets [Power]+5000 until end of turn. Choose a \"Vairina\" from your drop, and put it into your hand.",
  "permanent": true
},
"The Hour of Holy Judgement Cometh": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount": 2,
      "filter": basicPropertyArray
    },
    "costEffect": async function (){ await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ draw(2);     await increaseUnitsPowerEndTurn(1, 5000);}
  },
  "text": "Play this with COST [Counter Blast (2)]!\nDraw two cards, choose one of your units, and it gets [Power]+5000 until end of turn!",
  "permanent": true
},
"Call to the Beasts": {
  "condition": async function (){if(1){return true}return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ 
      let power = 5000
      let search = await searchCircles(backrowRearguards())
      if(search.length >= 3){
        power = 15000
      }
      await increaseUnitsPowerEndBattle(1, power);
    }
  },
  "text": "(A Blitz Order can only be played when you would call a guardian.)\nChoose one of your units, and it gets [Power]+5000 until end of that battle. If you have three or more back row rear-guards, it gets +15000 instead of +5000.",
  "permanent": true
},
"Sealed Blaze Sword, Prithivih": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ }
  },
  "text": "Right Deity Arms - \"Sealed Blaze Maiden, Bavsargra\" (After being played, the specified vanguard Arms it. If a new Right Deity Arms is Armed, put this card into the drop)\nPlay this with COST [Soul Blast (1)]!\n[AUTO](VC):When the unit Armed with this card attacks, that Armed unit gets [Power]+10000 until end of that battle. At the end of that battle, if your opponent's damage zone has four or less cards, COST [Counter Blast (2) & put this card into your drop], choose one of your opponent's vanguards, and deal one damage.",
  "permanent": true
},
"Sealed Blaze Shield, Swayanbuh": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (){ await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ }
  },
  "text": "Left Deity Arms - \"Sealed Blaze Maiden, Bavsargra\" (After being played, the specified vanguard Arms it. If a new Left Deity Arms is Armed, put this card into the drop)\nPlay this with COST [Counter Blast (1)]!\n[AUTO](VC)1/Turn:When the unit Armed with this card is attacked, that Armed unit gets [Power]+10000 until end of that battle.",
  "permanent": true
},
"Kashuu Kiyomitsu Shinken Hissatsu": {
  "condition": async function (){if(1){return true}return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ 
      await chooseUnits(1, vanguard(), (unit)=>{increaseCritEndTurn(unit, 1)})
      if(userZones.damage.length >= 5)
      {await doAllUnits(undefined , (unit)=>{increasePowerEndTurn(unit, 10000)})}
    }
  },
  "text": "(You may only have one [Over] trigger in a deck. When revealed as a trigger, remove that card, draw a card, choose one of your units, and it gets [Power]+100 Million until end of turn! If revealed during drive check, activate its additional effect!)\nAdditional Effect-During this turn, all your units get [Critical]+1!\n\nWhen played (Resolve this effect when played as an order!)-Choose one of your vanguard, and it gets [Critical]+1 until the end of the turn, and if you have 5 or more cards in your damage zone, all your units get [Power]+10000!",
  "permanent": true
},
"Fun Fun Marching!": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ doAllUnits(grade1OrLess() , (unit)=>{increasePowerEndTurn(unit, 5000)})}
  },
  "text": "Play this with COST [Soul Blast (1)]!\nAll of your grade 1 or less rear-guards get [Power]+5000 until end of turn.",
  "permanent": true
},
"Skyfall Fury": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (){ await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){
      if(userCircles.userVG.unit.hasRevolDress){
        await deckToHand(1, nameIsX(
          'Youthberk \"RevolForm: Zest\"'
        ))
      }
     }
  },
  "text": "Play this COST [Counter Blast (1)] if you have a vanguard with the [RevolDress] ability!\nSearch your deck for up to one \"Youthberk \"RevolForm: Zest\"\", reveal it and put it into your hand, and shuffle your deck.",
  "permanent": true
},
"Crawl, you \"Insects\"!": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (){ await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){
      soulCharge(1);
      let every5= userZones.soul.length /5
      let power = 10000 * every5
      await increaseUnitsPowerEndTurn(1, power)
      if(ifYourSoulHas10OrMore){
        draw()
      }
    }
  },
  "text": "Play this with COST [Counter Blast (1)]!\nSoul Charge (1). Then, choose one of your units, and it gets [Power]+10000 until end of turn for every five cards in your soul. If your soul has ten or more cards, draw a card.",
  "permanent": true
},
"Cursed Souls Squirming in Agony": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "soul": {
      "amount": 2,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ 
      let amountToCall = 1
      let func = (unit)=>{}
      if(duringAlchemagic()){
        amountToCall = 2
        func = (unit)=>{increasePowerEndTurn(unit ,5000)}
      }  
      let zone = await lookTopX(4)

      zone = await superiorCall(zone, undefined, amountToCall, undefined, false, 'deck' , (unit)=>{increasePowerEndTurn(unit ,5000)})

      await addToZone(zone , userZones.drop , zone)

    }
  },
  "text": "Play this with COST [Soul Blast (2)]!\nLook at four cards from the top of your deck, choose up to one unit card from among them, call it to (RC), and discard the rest. If during Alchemagic, call up to two cards instead of one to (RC), and all of this order's called units get [Power]+5000 until end of turn.",
  "permanent": true
},
"Grief, Despair, and Rejection": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (){ await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ if(ifYourVanguardIs('Mysterious Rain Spiritualist, Zorga')){
      await increaseUnitsPowerEndTurn(3, 10000)
    }}
  },
  "text": "Play this with COST [Counter Blast (1)]!\nIf your vanguard is \"Mysterious Rain Spiritualist, Zorga\", choose three of your units, and they get [Power]+10000 until end of turn.",
  "permanent": true
},
"Spiritual Body Condensation": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ 

      await callFromDrop ( [          {
        "cardProperty": "grade",
        "propertyToFind": userCircles.userVG.unit.grade,
        "condition": "<="
      }], amountToCall, undefined, false, 'drop' , (unit)=>{increasePowerEndTurn(unit, 5000)})
    }
  },
  "text": "Play this with COST [Soul Blast (1)]!\nChoose a card with grade equal to or less than your vanguard from your drop, call it to (RC), and it gets [Power]+5000 until end of turn.",
  "permanent": true
},
"Sunlight Punishment": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (){

      let counterBlastMax = userZones.damage.filter((card)=>{return card.faceup === true}) 
      let options = []
      for(let i= 1;i< counterBlastMax.length + 1; i ++){
        let num = i 
 
        options.push({
          text : 'Counterblast  '+  i , effect: ()=>{turnState.current['tempCB'] = i}
        })
      }
      await chooseOneOfTheFollowing(options)
 
  await counterBlast(turnState.current['tempCB'])
    
    } 
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){
      await retireOpponentRearguards(turnState.current['tempCB'])
     }
  },
  "text": "Play this with COST [Counter Blast one or more cards]!\nChoose one of your opponent's rear-guards for each Counter Blast paid for this cost, and retire it.",
  "permanent": true
},
"Burn Bright, Pure Prayers": {
  "condition": async function (){if(1){return true}return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){
      if(userZones.damage.length >= 3){
        await increaseUnitsPowerEndBattle(1, 15000)
      }
     }
  },
  "text": "If your damage zone has three or more cards, choose one of your units, and it gets [Power]+15000 until end of that battle.",
  "permanent": true
},
"Tartaros Beatscram": {
  "condition": async function (){if(1){return true}return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){
      if(userZones.soul.length >= 5){
        await increaseUnitsPowerEndBattle(1, 15000)
      }
     }
  },
  "text": "If your soul has five or more cards, choose one of your units, and it gets [Power]+15000 until end of that battle.",
  "permanent": true
},
"Causality Goes Crazy as I Will It": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){
      await increaseUnitsPowerEndTurn(1, 10000, vanguard())
     }
  },
  "text": "Play with this COST [Soul Blast (1)]!\nChoose one of your vanguards, and it gets [Power]+10000 until end of turn.",
  "permanent": true
},
"Lightning Barrier, Emergency Deployment!": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount": 2,
      "filter": basicPropertyArray
    },
    "costEffect": async function (){ await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){
      await increaseUnitsPowerEndBattle(1, 30000, vanguard())
     }
  },
  "text": "Play with this COST [Counter Blast (2)]!\nChoose one of your vanguards, and it gets [Power]+30000 until end of that battle.",
  "permanent": true
},
"Downswing of Sword of Judgement": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "soul": {
      "amount": 1,
      "filter": grade3()
    },
    "costEffect": async function (){ await soulBlast(this.soul.amount , this.soul.filter)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ 
 
      let unit = await chooseOpponentUnits(1, rearguard() )
      let cols = await getColumn(unit[0])

      if(unit)
      await removeOpponentUnits(cols.opponent, 'botDeck')
    }
  },
  "text": "Play this with COST [Soul Blast (1) grade 3]!\nChoose one of your opponent's rear-guards. Your opponent puts all of their rear-guards in the same column as that rear-guard on the bottom of their deck.",
  "permanent": true
},
"Hopeful Testode": {
  "condition": async function (){if(1){return true}return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ 
      let num = await searchCircles()
      if(num.length> 2){
        await chooseUnits(1 ,unit() , (card)=>{increasePowerEndBattle(card , 15000)})
      }
    }
  },
  "text": "If you have three or more units, choose one of your units, and it gets [Power]+15000 until end of that battle.",
  "permanent": true
},
"Tearful Malice": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "rg": {
      "amount": 2,
      "filter": basicPropertyArray
    },
    "costEffect": async function (){ await retireYourRearguards(this.rg.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){draw;soulThisCard(unit);await counterCharge(1) }
  },
  "text": "Play this with COST [retire two rear-guards]!\nDraw a card, put this card into your soul, and Counter Charge (1).",
  "permanent": true
},
"Ghost Chase": {
  "condition": async function (){if(1){return true}return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){
      await chooseUnits(1, basicPropertyArray , (unit)=> increasePowerEndBattle(unit, 5000))
      await bounceYourRearguards(1, newPropertyArray([rearguard() ,  [
        {
          "cardProperty": "state",
          "propertyToFind": "attacked",
          "condition": "!="
        }
      ]]) )
     }
  },
  "text": "Choose one of your units, and it gets [Power]+5000 until end of that battle. Choose one of your rear-guards not being attacked, and return it to your hand.",
  "permanent": true
},
"Sealed Path": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount": 2,
      "filter": basicPropertyArray
    },
    "costEffect": async function (){ await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ 
      await decreaseOpponentUnits(1, vanguard() , -1, 'critEndBattle')
    }
  },
  "text": "Play this with COST [Counter Blast (2)]!\nChoose one of your opponent's vanguards, and that unit gets [Critical]-1 until end of that battle.",
  "permanent": true
},
"Regurgitation from the Underworld": { 
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (){ await counterBlast(this.counterBlast.amount); await soulBlast(this.soul.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ 
      let callAmount = 1
      let oppDrop = currentOpponentZones.current.drop.length
      let userDrop = userZones.drop.length
      let grade = 0
      await retireAnyPlayersRearguards(1)

 
      if(currentOpponentZones.current.drop.length !== oppDrop){
        grade = currentOpponentZones.current.drop[currentOpponentZones.current.drop.length -1].grade
      }
      else if(userZones.drop.length !== userDrop){
        grade = userZones.drop[userZones.drop.length -1].grade
      }
      else{ return}
      if(duringAlchemagic()){
        callAmount = 2
      }
 
      await callFromDrop(callAmount , [{cardProperty:'grade' , propertyToFind:grade , condition:'='}])
    }
  },
  "text": "Play this with COST [Counter Blast (1) & Soul Blast (1)]!\nChoose one of any player's rear-guards, retire it, choose up to one card with the same grade as that card from your drop, and call it to (RC). If during Alchemagic, you may choose up to two instead of one to call.",
  "permanent": true
},
"Wild Intelligence": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (){ await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "call": {
      "amount": 1,
      "filter":  vanguardGradeOrLower(),
 
    },
    "effect": async function (){ 
      mill(3)
      let toCall = 1
      if(ifYourVanguardIs('Sylvan Horned Beast King, Magnolia')){
        toCall = 2
      }
    await callFromDrop(toCall, this.call.filter)
    }
  },
  "text": "Play this with COST [Counter Blast (1)]!\nDiscard three cards from the top of your deck, choose up to one card with the same grade as your vanguard or lower from your drop, and call it to (RC). If your vanguard is \"Sylvan Horned Beast King, Magnolia\", choose up to two cards instead of one.",
  "permanent": true
},
"Horns of Blessing": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "hand": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "hasOverDress",
          "propertyToFind": true,
          "condition": "="
        }
      ]
    },
    "costEffect": async function (unit){await discard(this.hand.amount, this.hand.filter)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){draw(2) }
  },
  "text": "Play this with COST [discard a card with the [overDress] ability from your hand]!\nDraw two cards.",
  "permanent": true
},
"Supernatural Extraction": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "hand": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (){ await counterBlast(this.counterBlast.amount);await discard(this.hand.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ soulCharge(3);
      if(ifYourSoulHas10OrMore()){
        await youMay(1 ,async (a)=>{await soulToHand(1)})
      }
    }
  },
  "text": "Play this with COST [Counter Blast (1) & discard a card from your hand]!\nSoul Charge (3). Then, if your soul has ten or more cards, choose a card from your soul, and you may put it into your hand.",
  "permanent": true
},
"Hellblast Full Dive": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (){ await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){
      draw()
      await callFromHand(1);
      if(finalRush()){
        doAllUnits(frontrowUnits() , (unit)=>{increasePowerEndTurn(unit ,10000)})
      }
     }
  },
  "text": "Play this with COST [Counter Blast (1)]!\nDraw a card, choose a card from your hand, and call it to (RC). Then, if you are in \"Final Rush\", all of your front row units get [Power]+10000 until end of turn.",
  "permanent": true
},
"Moment of Capture! Aurora Battle Princess 24-hr Coverage!": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (){ await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ }
  },
  "text": "Play this with COST [Soul Blast (1)]!\nIf your opponent's hand has four or more cards, your opponent chooses a card from their hand, and imprisons it in your Prison. Then, if three or more of your opponent's cards are imprisoned in your Prison, you choose one of your units, and it gets [Power]+5000 until end of turn.",
  "permanent": true
},
"Form up, O Chosen Knights": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
     "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await soulBlast(this.soul.amount) }
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ 
      let grade3Num = await searchCircles(grade3())
      await performAll([
        {effect: async ()=>{
            await increaseUnitsPowerEndTurn(1, 5000)
        } , value : 2 , condition: '<='},
        {effect: ()=>{
          draw()
        } , value : 3 , condition: '<='},
        {effect: async ()=>{
          await chooseUnits(1, vanguard(), (unit)=>{increaseDriveEndTurn(unit, 1)})
        } , value : 4 , condition: '<='},        

      ] , grade3Num.length)
    }
  },
  "text": "Play this with COST [Counter Blast (1) & Soul Blast (1)]!\nPerform all of the effects below according to the number of your grade 3 units.\n•2 or more - Choose one of your units, and it gets [Power]+5000 until end of turn.\n•3 or more - Draw a card.\n•4 or more - Choose one of your vanguards, and it gets drive +1 until end of turn.",
  "permanent": true
},
"Nectar of Sensationalism": {
  "condition": async function (){if(1){return true}return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ 
      let len = userZones.drop.length
      let power = 5000 * (Math.floor(len /5))
      await chooseUnits(1, rearguard() ,(unit)=>{
        increasePowerEndTurn(unit, power);
        if(userZones.drop.length >= 15){
          increaseCritEndTurn(unit ,1)
        }
      })
    }
  },
  "text": "Choose one of your rear-guards, and until end of turn, it gets [Power]+5000 for every five cards in your drop, and if your drop has fifteen or more cards, it gets [Critical]+1.",
  "permanent": true
},
"Flame Dragon Bombardment": {
  "condition": async function (){if(1){return true}return false}, 
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ 
      await chooseUnits(this.orderId , vanguard() , (card)=>{
        allOfYourUnits(this.orderId, units() , (unit)=>{
          unit.attackFunction = allUnitsAttack 
        } , 
        (unit)=>{
          unit.attackFunction = normalAttack 
        } 
      )
    untilEndTurn(()=>{
      removeAllOfYourUnits(1)
    } ,card)

    }
    )



    }
  },
  "text": "Choose one of your vanguards, and until end of turn, it gets \"[CONT](VC):All of your units can attack your opponent's back row rear-guard when they would attack.\".",
  "permanent": true
},
"Prayers That Will Reach Someday": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){
      let over = await searchCircles([
        {
          "cardProperty": "hasOverDress",
          "propertyToFind": true,
          "condition": "="
        }
      ])
     
    if(over.length > 0){
      await increaseUnitsPowerEndBattle(1, 15000)
    }
    }
  },
  "text": "Play this with COST [Soul Blast (1)]!\nIf you have a rear-guard with the [overDress] ability, choose one of your units, and it gets [Power]+15000 until end of that battle.",
  "permanent": true
},
"Special \"Violence\" Yell": {
  "condition": async function (){if(1){return true}return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ 
      await increaseUnitsPowerEndBattle(1, 20000, nameIsX( 
        'Diabolos, \"Violence\" Bruce' 
      ))
    }
  },
  "text": "Choose a \"Diabolos, \"Violence\" Bruce\" on your (VC) or (RC), and it gets [Power]+20000 until end of that battle.",
  "permanent": true
},
"Explosive! Melting Heart!": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}

  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ 
      let power = -5000 * 3

      await decreaseOpponentUnits(1 , attacking() , power)
    }
  },
  "text": "Play this with COST [Soul Blast (1)]!\nChoose one of your opponent's attacking units, and it gets [Power]-5000 until end of turn for each of your opponent's cards imprisoned in your Prison. (It does not retire even if its [Power] becomes negative)",
  "permanent": true
},
"Noble Will": {
  "condition": async function (){if(1){return true}return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){
      if(await ifYouHave3OrMoreGrade3()){
        await increaseUnitsPowerEndBattle(1, 20000, vanguard())
      }
     }
  },
  "text": "If you have three or more grade 3 units, choose one of your vanguards, and it gets [Power]+20000 until end of that battle. (Including GC)",
  "permanent": true
},
"Harvesting Season": {
  "condition": async function (){if(1){return true}return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (unit){
      //give canmove prop to unit add to continuous 
      allOfYourUnits(1 , backrowRearguards() , (card)=>{
        increasePower(card , 5000)

      } , (card)=>{
        increasePower(card , -5000)
      })

      allOfYourUnits(2 , units() , (card)=>{
        card.cannotBeMovedTo = ['userVG' , 'userFRRG' , 'userFLRG' , 'userBCRG' , 'userBRRG' , 'userBLRG']
        card.canBoost = false 
        card.canBoostCheck = false 
      } , (card)=>{
        card.cannotBeMovedTo = []
        card.canBoost = true 
        card.canBoostCheck = true
      })

      untilEndTurn(()=>{
        removeAllOfYourUnits(1); removeAllOfYourUnits(2);
      }, unit)


     }
  },
  "text": "Until end of turn, all of your back row rear-guards get [Power]+5000, you cannot move rear-guards to other (RC), and they cannot boost.",
  "permanent": true
},
"Overcoming the Unnatural Death": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (){ await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (card){
      bindThisCard(card);
      await dropToHand(2, orders())
     }
  },
  "text": "Play this with COST [Counter Blast (1)]!\nBind this card, choose up to two order cards from your drop, and put them into your hand.",
  "permanent": true
},
"Six-Flower Fractale": {
  "condition": async function (){if(1){return true}return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ }
  },
  "text": "(After a Set Order is played, put it into your Order Zone.)\n[AUTO]:When this card is put into the Order Zone, choose a face down card from your Order Zone, and you may turn it face up.\n[AUTO](Order Zone):When this Song is sung, choose the same number of your rear-guards as the number of face down cards in your Order Zone, and [Stand] them. Choose one of your vanguards, and it gets [Power]+10000 until end of turn for each unit that was [Stand] by this effect.",
  "permanent": true
},
"Madder Red Runway": {
  "condition": async function (){if(1){return true}return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ }
  },
  "text": "(After a Set Order is played, put it into your Order Zone.)\n[AUTO]:When this card is put into the Order Zone, if your opponent's vanguard is grade 3 or greater, draw a card.\n[AUTO](Order Zone):When this Song is sung, choose one of your vanguards, and it gets [Critical]+1 until end of turn.",
  "permanent": true
},
"Twilight Sound of Waves": {
  "condition": async function (){if(1){return true}return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ }
  },
  "text": "(After a Set Order is played, put it into your Order Zone.)\n[AUTO]:When this card is put into your Order Zone, choose one of your vanguards, and it gets [Power]+5000 until end of turn.\n[AUTO](Order Zone):When this Song is sung, all of your front row units get [Power]+5000 until end of turn.",
  "permanent": true
},
"Romantic Happiness": {
  "condition": async function (){if(1){return true}return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ }
  },
  "text": "(After a Set Order is played, put it into your Order Zone.)\n[AUTO](Order Zone):When this Song is sung, draw a card, choose one of your vanguards, and it gets [Power]+5000 until end of turn.",
  "permanent": true
},
"Worldwide Special Live Tour!": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (){ await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ }
  },
  "text": "(After a set order is played, put it into your Order Zone.)\n[ACT](Order Zone)1/Turn:COST [Counter Blast (2)], choose one of your vanguards, and until end of turn, it gets \"[CONT](VC):All of your rear-guards get [Power]+5000.\".",
  "permanent": true
},
"Galaxy Central Prison, Galactolus": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "units": {
      "amount": 1,
      "filter": standUnits()
    },
    "costEffect": async function (){ await chooseUnits(this.units.amount , this.units.filter ,(card)=>{restThisUnit(card)} )}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ }
  },
  "text": "(After a Set Order is played, put it into your Order Zone.)\nCOST [[Rest] one of your units] to play this card!\n[AUTO]:When this card is put into the Order Zone, Soul Charge (3).\n[CONT](Order Zone):When your opponent can normal call a rear-guard, they can perform the following:\n• Soul Blast (1). If they do so, they choose one of their imprisoned cards, and call it to (RC).\n• Counter Blast (1). If they do so, they choose two of their imprisoned cards, and call them to (RC).",
  "permanent": true
},
"Hollowing Moonlit Night": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "effect": async function (){ }
  },
  "text": "(After a Set Order is played, put it into your Order Zone.)\nPlay this with COST [Soul Blast (1)]!\n[AUTO]:When this card is put into order zone, draw a card.\n[CONT](Order Zone):If your order zone only has World cards, the following effects are active according to the number of cards in your order zone.\n•1 card ‐ Your World becomes Dark Night.\n•2 or more cards ‐ Your World becomes Abyssal Dark Night.",
  "permanent": true
},
"Eclipsed Moonlight": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "clan",
          "propertyToFind": "",
          "condition": "="
        }
      ]
    },
    "costEffect": async function (){ await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "clan",
          "propertyToFind": "",
          "condition": "="
        }
      ]
    },
    "effect": async function (){ }
  },
  "text": "(After a Set Order is played, put it into your Order Zone.)\nPlay this with COST [Counter Blast (1)]!\n[AUTO]:When this card is put into order zone, call a Shadow Army token to (RC). (Shadow Army has [Power]15000 and Boost)\n[CONT](Order Zone):If your order zone only has World cards, the following effects are active according to the number of cards in your order zone.\n•1 card ‐ Your World becomes Dark Night.\n•2 or more cards ‐ Your World becomes Abyssal Dark Night.",
  "permanent": true
},

"Best Harvest": {
  "condition": async function (){if(1){return true}return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "clan",
          "propertyToFind": "",
          "condition": "="
        }
      ]
    },
    "effect": async function (){
      await chooseUnits(1, vanguard(), async (card)=>{await giveAUTOAbilityEndTurn(card, ()=>whenOpponentsRearguardIsRetiredDuringYourMainPhase() , null, ()=>{draw()})})
     }
  },
  "text": "Choose one of your vanguards, and until end of turn, it gets \"[AUTO](VC):When your opponent's rear-guard is retired during your main phase, you draw a card.\".",
  "permanent": true
},
"Pandemonium Tactics": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "clan",
          "propertyToFind": "",
          "condition": "="
        }
      ]
    },
    "costEffect": async function (){ await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "clan",
          "propertyToFind": "",
          "condition": "="
        }
      ]
    },
    "effect": async function (){
      soulCharge(4)
      if(finalRush()){
        await performAll([
          {effect: async ()=>{
              await draw()
          } , value : 6 , condition: '<='},
          {effect: async ()=>{
            await doAllUnits(frontrow() , (card)=>{increasePowerEndTurn(card, 10000)})
          } , value : 8 , condition: '<='},
          {effect: async ()=>{
            await chooseUnits(1, vanguard(), (unit)=>{increaseCritEndTurn(unit, 1)})
          } , value : 12 , condition: '<='},        
  
        ] , userZones.soul.length)
      }
     }
  },
  "text": "Play this with COST [Counter Blast (1)]!\nSoul Charge (4). Then, if you are in \"Final Rush\", perform all of the following according to the number of cards in your soul.\n•6 or more - Draw a card.\n•8 or more - All of your front row units get [Power]+10000 until end of turn.\n•12 or more - Choose one of your vanguards, and it gets [Critical]+1 until end of turn.",
  "permanent": true
},
"Overcoming an Eternity": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "soul": {
      "amount": 2, 
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await soulBlast(this.soul.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "clan",
          "propertyToFind": "",
          "condition": "="
        }
      ]
    },
    "effect": async function (){ }
  },
  "text": "(After a Set Order is played, put it into your Order Zone.)\nPlay this with COST [Soul Blast (2)]!\n[CONT](Order Zone):If your order zone only has World cards, the following effects are active according to the number of cards in your order zone.\n•1 card ‐ Your World becomes Dark Night.\n•2 or more cards ‐ Your World becomes Abyssal Dark Night.\n[AUTO](Order Zone):When your Shadow Army token is placed, that placed unit gets [Power]+5000 until end of turn.",
  "permanent": true
},
"Wish for Tomorrow": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "clan",
          "propertyToFind": "",
          "condition": "="
        }
      ]
    },
    "soul": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "hand": {
      "amount": 1,
      "filter": orPropertyArray([{cardProperty : 'triggerType' , propertyToFind:'Critical' , condition:'='},{cardProperty : 'triggerType' , propertyToFind:'Front' , condition:'='}])
    },
 
     "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);await soulBlast(this.soul.amount);
      let revealed = await reveal(this.hand.amount, this.hand.filter)
    turnState.current['reveal'] = revealed }
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "clan",
          "propertyToFind": "",
          "condition": "="
        }
      ]
    },
    "effect": async function (){ 
      if(ifYourOpponentsVanguardIsGrade3orGreater()){
        draw()
      }
      await addToZone(userZones.hand, newDeck.MainDeck, [turnState.current.reveal])
    }
  },
  "text": "Play this with COST [Counter Blast (1) & Soul Blast (1) & reveal a [Critical] trigger or [Front] trigger from your hand]!\nIf your opponent's vanguard is grade 3 or greater, you draw a card, and put the card revealed for this cost on the top of your deck.",
  "permanent": true
},
"Pride to Protect": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "hand": {
      "amount": 1,
      "filter": basicPropertyArray
    },
    "costEffect": async function (unit){await discard(this.hand.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "clan",
          "propertyToFind": "",
          "condition": "="
        }
      ]
    },
    "effect": async function (){ }
  },
  "text": "(After a Set Order is played, put it into your Order Zone.)\nPlay this with COST [discard a card from your hand]!\n[CONT](Order Zone):All of your grade 3 rear-guards get \"Boost\".",
  "permanent": true
},
"Death-inviting Black-magic": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount":  4 - userZones.bind.length,
      "filter": [
        {
          "cardProperty": "clan",
          "propertyToFind": "",
          "condition": "="
        }
      ]
    },
    "costEffect": async function (){ await counterBlast(this.counterBlast.amount())}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "clan",
          "propertyToFind": "",
          "condition": "="
        }
      ]
    },
    "effect": async function (){ draw(2)}
  },
  "text": "This cost is reduced by Counter Blast (1) for each card in your bind zone. (Reduce the total cost if you Alchemagic)\nPlay this with COST [Counter Blast (4)]!\nDraw two cards.",
  "permanent": true
},
"Prayer of Resonating Wishes": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "clan",
          "propertyToFind": "",
          "condition": "="
        }
      ]
    },
    "costEffect": async function (){ await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "clan",
          "propertyToFind": "",
          "condition": "="
        }
      ]
    },
    "effect": async function (unit){ 
      await chooseUnits(1, vanguard() , async (card)=>{
        await giveAUTOAbilityEndTurn(card, async (card)=>(await whenYourRearguardIsPlaced(card , isOverDress()) )  , null,()=>{draw(1) ;  increasePowerEndTurn(unit, 5000)} )

      })
    }
  },
  "text": "Play this with COST [Counter Blast (1)]!\nChoose one of your vanguards, and until end of turn, it gets, \"[AUTO](VC):When your rear-guard is placed, if it was an [overDress], draw a card, and this unit gets [Power]+5000 until end of turn.\".",
  "permanent": true
},
"Ambush Killsmoke": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "clan",
          "propertyToFind": "",
          "condition": "="
        }
      ]
    },
    "costEffect": async function (){ await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "clan",
          "propertyToFind": "",
          "condition": "="
        }
      ]
    },
    "effect": async function (unit){ 
      if(ifYourVanguardIs('Heavy Artillery of Dust Storm, Eugene')){
        let prop = []
        let boost = currentBattle.current.boostingIds
        boost.forEach((card)=>{
          id = card.boostingUnit.id
          prop.push({cardProperty:'id' , propertyToFind:id, condition:'='})})

          await increaseUnitsPowerEndBattle(1, 10000, vanguard())
          untilEndBattle(async ()=>{
            await retireOpponentRearguards(1, prop)
          } , unit)
      }
    }
  },
  "text": "Play this with COST [Counter Blast (1)]!\nIf your vanguard is \"Heavy Artillery of Dust Storm, Eugene\", choose one of your vanguards, it gets [Power]+10000 until end of that battle, at the end of that battle, choose one of the rear-guards that boosted for that battle, and retire it.",
  "permanent": true
},
"Geo Acceleration": {
  "condition": async function (){if(1){return true}return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "clan",
          "propertyToFind": "",
          "condition": "="
        }
      ]
    },
    "effect": async function (){ 
      if(userZones.soul.length >= 4){
        soulCharge(1)
        await decreaseOpponentUnits(1, newPropertyArray(vanguard(), attacking()), -5000, )
      }
    }
  },
  "text": "If your soul has four or more cards, Soul Charge (1), choose one of your opponent's attacking vanguards, and it gets [Power]-5000 until end of that battle.",
  "permanent": true
},
"Refablishment Dock": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "clan",
          "propertyToFind": "",
          "condition": "="
        }
      ]
    },
    "costEffect": async function (){ await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "clan",
          "propertyToFind": "",
          "condition": "="
        }
      ]
    },
    "effect": async function (){ }
  },
  "text": "(After a Set Order is played, put it into your Order Zone.)\nPlay this with COST [Counter Blast (1)]!\n[AUTO]:When this card is put into the Order Zone, draw a card.\n[CONT](Order Zone):All of your grade 2 rear-guards get \"Boost\".",
  "permanent": true
},
"Neatness Meteor Shower": {
  "condition": async function (){if(1){return true}return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "clan",
          "propertyToFind": "",
          "condition": "="
        }
      ]
    },
    "effect": async function (){ }
  },
  "text": "(After a Set Order is played, put it into your Order Zone.)\n[CONT]:You may have up to sixteen \"Neatness Meteor Shower\" in your deck.\n[AUTO]:When this card is put into the Order Zone, you may Soul Charge (1). If it was put by your vanguard's ability, you may draw a card.\n[AUTO]:When this card is put into your drop from the Order Zone, choose one of your opponent's rear-guards, and retire it.",
  "permanent": true
},
"Light that Shines upon the Truth": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "counterBlast": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "clan",
          "propertyToFind": "",
          "condition": "="
        }
      ]
    },
    "costEffect": async function (){ await counterBlast(this.counterBlast.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "clan",
          "propertyToFind": "",
          "condition": "="
        }
      ]
    },
    "effect": async function (unit){ 
      let power = 10000
      await chooseUnits(1, nameIsX('Hexaorb Sorceress') , async (card)=>{
        await resolveNewAbility(card , counterBlastObject(2), ()=>{power = 40000})
        increasePowerEndBattle(card, power)
      })
      
    }
  },
  "text": "Choose a \"Hexaorb Sorceress\" on your (VC) or (RC), and it gets [Power]+10000 until end of that battle. COST [Counter Blast (2)], and it gets +40000 instead of +10000.",
  "permanent": true
},
"In Search of an Ideal Far Away": {
  "condition": async function (){if(1){return true}return false},
  "cost": null,
  "effect": {
    "draw": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "clan",
          "propertyToFind": "",
          "condition": "="
        }
      ]
    },
    "effect": async function (){ 
      await chooseUnits(1, undefined, (card)=>{
        giveAUTOAbilityEndTurn(card, (unit)=>(whenYourOtherUnitAttacks(unit)) , null, (unit)=>{increasePowerEndTurn(unit, 5000)})
      })
    }
  },
  "text": "Choose one of your units, and until end of turn, it gets \"[AUTO](VC/RC):When your other unit attacks, this unit gets [Power]+5000 until end of turn.\".",
  "permanent": true
},
"Hidden in Darkness": {
  "condition": async function (){if(1){return true}return false},
  "cost": {
    "bind": {
      "amount": 4,
      "filter": orders()
    },
    "costEffect": async function (){ await bindtoDrop(this.bind.amount)}
  },
  "effect": {
    "draw": {
      "amount": 1,
      "filter": [
        {
          "cardProperty": "clan",
          "propertyToFind": "",
          "condition": "="
        }
      ]
    },
    "effect": async function (){
      if(currentBattle.current.attackingUnit.place !== 'RC'){return}

      await increaseUnitsPowerEndBattle(1, 20000, beingAttacked())
     }
  },
  "text": "Play this with COST [Counter Blast (1) & put four order cards from your bind zone into your drop]!\nChoose one of your units being attacked by a rear-guard, and it gets [Power]+20000 until end of that battle.",
  "permanent": true
},

}

const additionalEffects = {
  "Greatest Star, Esteranza": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (unit){ 
        let ability = await makeAbility(unit, 'CONT', ()=>duringYourTurn())
        ability.on = async ()=>{allOfYourUnits(this.abilityId, rearguard(), (card)=>{increasePower(card, 10000) }, (card)=>{increasePower(card, -10000) })}
        ability.off = async ()=> {removeAllOfYourUnits(this.abilityId)}
        youGet(ability)
      }
    },
    "text": "Additional Effect - During this fight, you get \"During your turn, all of your rear-guards get [Power]+10000!\""
  },
  "Mysterious Twins, Romia & Rumia": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (unit){ 
        let ability = await makeAbility(unit, 'CONT', ()=>duringYourTurn())
        ability.on = async ()=>{allOfYourUnits(this.abilityId, rearguard(), (card)=>{increasePower(card, 10000) }, (card)=>{increasePower(card, -10000) })}
        ability.off = async ()=> {removeAllOfYourUnits(this.abilityId)}
        youGet(ability)
      }
    },
    "text": "Additional Effect - During this fight, you get \"During your turn, all of your rear-guards get [Power]+10000!\""
  },
  "Demonic Fever, Garviera": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (unit){ 
        let ability = await makeAbility(unit, 'CONT', ()=>duringYourTurn())
        ability.on = async ()=>{allOfYourUnits(this.abilityId, rearguard(), (card)=>{increasePower(card, 10000) }, (card)=>{increasePower(card, -10000) })}
        ability.off = async ()=> {removeAllOfYourUnits(this.abilityId)}
        youGet(ability)
      }
    },
    "text": "Additional Effect - During this fight, you get \"During your turn, all of your rear-guards get [Power]+10000!\""
  },
  "Fantastic Fur-nale, Catrina": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (unit){ 
        let ability = await makeAbility(unit, 'CONT', ()=>duringYourTurn())
        ability.on = async ()=>{allOfYourUnits(this.abilityId, rearguard(), (card)=>{increasePower(card, 10000) }, (card)=>{increasePower(card, -10000) })}
        ability.off = async ()=> {removeAllOfYourUnits(this.abilityId)}
        youGet(ability)
      }
    },
    "text": "Additional Effect - During this fight, you get \"During your turn, all of your rear-guards get [Power]+10000!\""
  },
  "Blessing Diva, Grizael": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (unit){ 
        let ability = await makeAbility(unit, 'CONT', ()=>duringYourTurn())
        ability.on = async ()=>{allOfYourUnits(this.abilityId, rearguard(), (card)=>{increasePower(card, 10000) }, (card)=>{increasePower(card, -10000) })}
        ability.off = async ()=> {removeAllOfYourUnits(this.abilityId)}
        youGet(ability)
      }
    },
    "text": "Additional Effect - During this fight, you get \"During your turn, all of your rear-guards get [Power]+10000!\""
  },
  "Spiritual King of Determination, Olbaria": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){
        await increaseUnitsPowerEndTurn(1, 100000000)
       }
    },
    "text": "Additional Effect-Choose one of your units, and it gets [Power]+100 Million until end of turn!"
  },
  "Over Soul Strike!": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ 
      await dealDamage(1)
 
      }
    },
    "text": "Additional Effect-Choose one of your opponent's vanguards, and deal one damage!(Damage check first even if there are drive checks remaining)"
  },
  "Kashuu Kiyomitsu Shinken Hissatsu": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (unit){ 
        let ability = await makeAbility(unit, 'CONT', ()=>{
          return   userZones.trigger.length > 0  && unit.id === userZones.trigger[0].id
        })
        ability.on = async (unit)=>{allOfYourUnits(this.abilityId, units(), (card)=>{increaseCrit(card, 1) }, (card)=>{increaseCrit(card, -1) })
        untilEndTurn(()=>{
          removeAllOfYourUnits(this.abilityId)
        }, unit)
      }
        ability.off = async ()=> {}
        youGet(ability)
      }
    },
    "text": "Additional Effect-During this turn, all your units get [Critical]+1!"
  },
  "Dragon Deity King of Resurgence, Dragveda": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ 
        await chooseUnits(1, vanguard(), (unit)=>{stand(unit)})
      }
    },
    "text": "Additional Effect - Choose one of your vanguards, and [Stand] it!"
  },
  "Hades Dragon Deity of Resentment, Gallmageheld": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (unit){ 
        let ability = await makeAbility(unit, 'CONT', ()=>duringYourTurn())
        ability.on = async ()=>{allOfYourUnits(this.abilityId, vanguard(), (card)=>{increasePower(card, 10000);increaseCrit(card,1) }, (card)=>{increasePower(card, -10000);increaseCrit(card,1)  })}
        ability.off = async ()=> {removeAllOfYourUnits(this.abilityId)}
        youGet(ability)
      }
    },
    "text": "Additional Effect - You get \"During your turn, all of your vanguards get [Power]+10000/[Critical]+1\" until end of this fight!"
  },
  "Star Dragon Deity of Infinitude, Eldobreath": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ 
        await doAllUnits(frontrowUnits() , (unit)=>{
          increasePowerEndTurn(unit , unit.tempPower)
          increaseCritEndTurn(unit, unit.tempCrit)
        })
      }
    },
    "text": "Additional Effect - Double the [Power] and [Critical] of all of your front row units until end of turn! (Increase to double its [Power] and [Critical] when activated)"
  },
  "Light Dragon Deity of Honors, Amartinoa": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (unit){ 
        let ability = await makeAbility(unit, 'CONT', ()=>{
        return   userZones.trigger.length > 0 && unit.id === userZones.trigger[0].id
        })
        ability.on = async (unit)=>{allOfYourUnits(this.abilityId, rearguard(), (card)=>{card.canDrive = true }, (card)=>{card.canDrive = false })
        untilEndTurn(()=>{
          removeAllOfYourUnits(this.abilityId)
        }, unit)
      }
        ability.off = async ()=> {}
        youGet(ability)
      }
    },
    "text": "Additional Effect - Until end of turn, you also perform drive checks for the battles your rear-guards attack!"
  },
  "Source Dragon Deity of Blessings, Blessfavor": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){
        draw()
        await chooseUnits(1, undefined, (card)=>{increaseCritEndTurn(card, 1);})
        await doAllUnits(frontrowUnits(), (card)=>{increasePowerEndTurn(card, 10000)})
        if(userZones.damage.length >= currentOpponentZones.current.damage.length){
          await heal()
        }
       }
    },
    "text": "Additional Effect - Draw a card! Choose one of your units, it gets [Critical]+1 until end of turn! All of your front row units get [Power]+10000! If your damage zone has the same number of cards as your opponent’s or more, choose a card from your damage zone, and heal it!"
  },
  "Spiritual King of Ignition, Valnout": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Additional Effect - Choose one of your [Stand] rear-guards, and it gets \"[AUTO](RC)1/Turn:At the end of the battle this unit attacked, [Stand] this unit.\" until end of turn. If you did not choose a card, draw a card, choose up to one unit card from your hand, and call it to (RC)."
  },
  "Spiritual King of Aquatics, Idosfaro": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Additional Effect - Choose a card from your drop, put it into your hand, choose one of your units, and it gets [Critical]+1 until end of turn."
  },
  "Spiritual King of Brightsky, Meridzanblia": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Additional Effect - Draw up to one card for every two of your opponent's open circles in total of their (RC) and (GC). Retire all of your opponent's rear-guards and guardians."
  },
  "Spiritual King of Nightsky, Nyxlaszelia": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Additional Effect - Choose up to one card from your damage zone, put it into hand, choose up to one unit card from your hand, call it to (RC), and it gets [Power]+10000 until end of turn."
  },
  "Kasen Kanesada Shinken Hissatsu": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Additional Effect-During this turn, all your units get [Critical]+1!"
  },
  "Mutsunokami Yoshiyuki Shinken Hissatsu": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Additional Effect-During this turn, all your units get [Critical]+1!"
  },
  "Yamanbagiri Kunihiro Shinken Hissatsu": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Additional Effect-During this turn, all your units get [Critical]+1!"
  },
  "Hachisuka Kotetsu Shinken Hissatsu": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Additional Effect-During this turn, all your units get [Critical]+1!"
  },
  "Bringer of Light, Lucifer": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Additional Effect - Perform one of the following."
  },
  "Immortal Knight King of the Round Table, Arthur": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Additional Effect - Perform one of the following."
  },
  "The Close Pair Under the Moonlit Night": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){
        await dealDamage()
       }
    },
    "text": "Additional Effect-Choose one of your opponent's vanguards, and deal one damage!(Damage check first even if there are drive checks remaining)"
  },
  "Ragnarok": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Additional Effect - All of your front row <Man> and <Valkyrie> get [Power]+10000 until end of turn, choose one of your rear-guards, and [Stand] it!"
  },
  "Girl of the Sea Who Refreshes the Soul, Kiskill Lyra": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Additional Effect - Perform one of the following."
  },
  "Shichiseiken": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Additional Effect - Perform one of the following."
  },
  "Oragon": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Additional Effect - Choose one of your units, and it gets [Power]+100 Million until end of turn!"
  },
  "The Moment When History Changes": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Additional Effect-Choose one of your units, and it gets [Power]+100 Million until end of turn!"
  },
  "Get! Treasure Campaign 3pt": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Additional Effect-Choose one of your units, and it gets [Power]+100 Million until end of turn!"
  },
  "Cardfight!! Vanguard overDress": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Additional Effect-Choose one of your units, and it gets [Power]+100 Million until end of turn!"
  },
  "Cardfight!! Vanguard overDress Season2": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Vanguard Exhibition in Gallery AaMo": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Vanguard overDress × Revue Starlight": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Great Vanguard Festival 2021": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Kyushu Cup 2021": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Transcending Hero, El Brave": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Bato Loco Vanguard Fighters League": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Niigata Grand Prix 2021": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Niigata's Sake, Aumont": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Let's Vanguard! Yu-yu Kondo": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Gunma Championship 2021": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Gunma-chan": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Thoughts for the Future, Anna": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Additional Effect-Choose one of your units, and it gets [Power]+100 Million until end of turn!"
  },
  "Explosion!!": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "DraVan ~Keihanshin Area~": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Vanguard overDress × Animax Cafe+ 1st Period": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Vanguard overDress × Animax Cafe+ 2nd Period": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Sendai Championship": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Happy New Year 2022 Water Tiger": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Dragon Empire Nation King": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Dark States Nation King": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Brandt Gate Nation King": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Keter Sanctuary Nation King": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Stoicheia Nation King": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Lyrical Monasterio Nation King": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Touken Ranbu Nation King": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Monster Strike Nation King": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "SHAMAN KING Nation King": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "10th Anniversary Vanguard WGP Participation Prize": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Aichi Birthday Festival 2022": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Great Vanguard Festival 2022": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Cardfight!! Vanguard will+Dress": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Do the Dive": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Vanguard City Trial": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "PARK 2022 Oragon": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Cardfight!! Vanguard × Akibayabai": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Cardfight!! Vanguard Dear Days (Card)": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "JOYSOUND × Vanguard will+Dress": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Additional Effect-Choose one of your units, and it gets [Power]+100 Million until end of turn!"
  },
  "Lunar New Year of the Rabbit, 2023": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "BUSHIROAD EXPO 2023 -ASIA-": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "End of a Camp of Acceptance for the Five": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Starting to Move On for the Five Who Are Lost": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "BLUE BUD, Hina Aoki": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Ancestral Dragon King of Peak Colors, Faunaheldio": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Additional Effect - Choose one of your [Stand] rear-guards, and it gets \"[AUTO](RC)1/Turn:At the end of the battle this unit attacked, [Stand] this unit.\" until end of turn. If you did not choose a card, draw a card, choose up to one unit card from your hand, and call it to (RC)."
  },
  "Underwater Circus Seika": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  },
  "Lunar New Year of the Dragon, 2024": {
    "effect": {
      "draw": {
        "amount": 1,
        "filter": [
          {
            "cardProperty": "clan",
            "propertyToFind": "",
            "condition": "="
          }
        ]
      },
      "effect": async function (){ }
    },
    "text": "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul."
  }
}

const oppEffects = {
"Aurora Battle Princess, Risatt Pink": {  
  "condition": 
  (card)=>{return true}, 
 "cost": null,
 "effect": {
  effect : async function(card) {
  let cards  = await clickAbilityZone(userZones.hand , 1)
  let picked = cards.selected[0]
  imprisonCard(picked)
 


 }},
 "text": "Imprison a card from your hand",
 
 "1/Turn": false, 
 "type": "AUTO", 
 "category": "placed",
 "permanent": true 
 
},
"Cardinal Fang, Estrett": {  
  "condition": 
  (card)=>{return true}, 
 "cost": null,
 "effect": {
  effect : async function(card) {
    await retireYourRearguards(1)
 }},
 "text": "Retire a rearguard",
 
 "1/Turn": false, 
 "type": "AUTO", 
 "category": "placed",
 "permanent": true 
 
},
"Aurora Battle Princess, Cuff Spring": {  
  "condition": 
  (card)=>{return true}, 
 "cost": null,
 "effect": {
  effect : async function(card) {
    let handS = userZones.hand.length
  let cards  = await clickAbilityZone(userZones.hand , 1)
  let picked = cards.selected[0]
 
  imprisonCard(picked)
    if(userZones.hand.length !== handS){
      draw()
    }
 }},
 "text": "Imprison a card from your hand",
 
 "1/Turn": false, 
 "type": "AUTO", 
 "category": "placed",
 "permanent": true 
 
},

'Aurora Battle Princess, Tra Bouquenvillea':{
  "condition": 
  (card)=>{return true}, 
 "cost": null,
 "effect": {
  effect : async function(card) { 
    let id = turnState.current.opponent.id
    let circle = turnState.current.opponent.circle.replace('opponent' , 'user')
 
    await superiorCall(currentOpponentZones.current.orderZone , await newPropertyArray([imprisoned() , 
idIsX(id)
    ])  , 1 ,circle , true,'prison' )  
    socket.emit('fightUpdate',  { roomId :roomID,  command:'updateOpponentZone', item :{zone:'orderZone' , array: currentOpponentZones.current.orderZone}})
    
 }},
 "text": "Imprison a card from your hand",
 
 "1/Turn": false, 
 "type": "AUTO", 
 "category": "placed",
 "permanent": true 
 
}
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//borders
const transparentBorder = '0.3rem solid transparent'
const blueBorder = '0.3rem solid blue'
const redBorder = '0.3rem solid red'
const pinkBorder = '0.3rem solid pink'
const orangeBorder = '0.3rem solid orange'
const greenBorder = '0.3rem solid green'


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//default functions

const defaults = useRef({ //for each one make a function to return to default
 'mainPhaseSwitch' :  async function (){
  //click unit -> get other  unit -> do switch rg
  //make frontrowplace and backrow place
  //change canattack to canattack from backrow-> in attackstep if canattack from backrow can attakc = true
  //do hasintervept and canintercept
  //make tutorial that shows tips based on turnstate
  await new Promise(resolve =>{
    document.getElementById('userCircles').addEventListener('click' , async  ()=>{
   let circle = await getCircle(event)
      if (circle.id ===  'userVG' || circle.id === 'userBCRG'){
        return
      }
      let otherCircle
  
      let otherId
      if(circle.id.includes('F')){
         otherId = circle.id.replace('F' , 'B')
        otherCircle = userCircles[otherId]
      }
      else{
         otherId = circle.id.replace('B' , 'F')
        otherCircle = userCircles[otherId]
      }
      let firstCircle = userCircles[circle.id]
      
      switchRG(circle.id, otherId)
    }, {once:true})    
      })
  } ,

  'rideFromRideDeck' : async function (){

    if(newDeck.RideDeck[newDeck.RideDeck.length-1] == null){timedDisplay('no more ride deck'); return}
  
    await discard(1)
   //setUserZones((oldZones)=>({...oldZones, soul:[...userZones.soul , userCircles[`user` + "VG"].unit]}))
    userCircles  [`user` + "VG"].unit['state'] = 'rodeUpon'
   userZones.soul.push(userCircles[`user` + "VG"].unit)

   
    userCircles  [`user` + "VG"].unit = {...newDeck.RideDeck.pop(newDeck.RideDeck.length-1)}
   userCircles  [`user` + "VG"].unit['state'] = 'placed'
   userCircles  [`user` + "VG"].unit['place'] = 'VC'
   userCircles  [`user` + "VG"].unit['circle'] = 'userVG'
    //setUserZones({...userZones})
    setPopup(false)
 
  //   setPhase('main')
    setUserCircles({...userCircles})
  
  //change to main from field
  // document.getElementById('wait').click()

   }
})


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
} , 1500))

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//turn functions
async function goFirstCheck(){
  let result = 'draw'
 
  while(result === 'draw'){
    result = await rps()
  }
if(result === 'win'){
  currentAbility.text = 'Go First or Second'
  await chooseOneOfTheFollowing([
    {text:'Go First' , effect : ()=>{
      updateTurn()
    }},
    {text:'Go Second' , effect : ()=>{
      socket.emit('fightUpdate', { roomId :roomID,  command:'updateTurn', item :{turnCount: 1}})
      
    }},
 
  ])
}
 
}
function rpsHandler(yourChoice , opponentChoice){
 
if(yourChoice === opponentChoice){
  return 'draw'
}
//do return possibilities[yourchoice][opponentchoice]
let possibilities = {
  'rock' : {
    'paper': 'lose',
    'scissors':'win'
  },
  'paper' : {
    'scissors': 'lose',
    'rock':'win'
  },
  'scissors' : {
    'rock': 'lose',
    'paper':'win'
  },
}
if(!possibilities[yourChoice] || !possibilities[yourChoice][opponentChoice]){
return 'errror'
}
return possibilities[yourChoice][opponentChoice]

}

async function rps(){
  // do popoup for rps, semd tp opp on click
  //rps -> if win -> go firsatcheck -> if lose , wait opponent
  let choice = ''
  currentAbility.text = 'Select one'
await chooseOneOfTheFollowing([
  {text:'ROCK' , effect : ()=>{choice = 'rock'}},
  {text:'PAPER' , effect : ()=>{choice = 'paper'}},
  {text:'SCISSORS' , effect : ()=>{choice = 'scissors'}},
])

socket.emit('fightUpdate', { roomId :roomID,  command:'opponentRPS', 
  item : {oppChoice:choice}  }) 


if(opponentWaiting.current === true){
  opponentWaiting.current =  false 
  socket.emit('fightUpdate', { roomId :roomID,  command:'stopWait', 
    item : { }  })
}
else{
await waitPlayerInput()
}
let result =  await rpsHandler(choice , opponentChoice)
let text = 'You Chose '+ choice.toUpperCase() + ' Opponent chose ' + opponentChoice.toUpperCase() + '\n You ' + result.toUpperCase()
 await timedDisplay(text)
 
 

return result
}

async function gameStart(){
  //buttonChanger(false)

  await shuffleDeck()

  for(let i =0; i<5;i++){
    draw()

  }
 // await mulligan()
 
 await waitForElement('opponentVG')
 if(playerTurn === true){
  standDraw()
 }
 setPhase('stand')
 playerObjects.current.phase = 'stand'
 //do standup func for monsterstrike
}

async function turnStart(){
  //something else for turn phases
  await standDraw()

}

async function updateTurn(turn){
turnCount.current = turn
setPhase('stand')
setPlayerTurn(true)

}


async function mulligan(){
  
let mulliganAmount = 0
let mull
let confirm
setConfirm(true)
await waitForElement('confirm')


let clicked = await clickAbilityZone(userZones.hand , 5 )
mulliganAmount = clicked.selected.length
const button = document.getElementById('confirm');

await addToZone(userZones.hand , newDeck.MainDeck , clicked.selected , 'hand' , true)
draw(mulliganAmount)

}

async function loseCheck(){
  //dekcoutcheck
  //damageallcheck
  //novanguardcheck
  
}

function youLose(){
//saty you lost 
//disable buttons
//show home butt
//show rematch butt
setPopupWord('youLose')
setPopup(true)
socket.emit('fightUpdate' , {roomId:roomID  , command:'youWin'})

}


function youWin(){
  setPopupWord('youWin')
  setPopup(true)
}

function returnHome(){

  socket.emit('fightUpdate' , {roomId:roomID  , command:'surrender'})
  socket.offAnyOutgoing();
  setCurrentPage('home');
}
function rematch(){

}

function surrender(){

  returnHome()
}

async function standDraw(){
 

  await standAllStandPhase()
    draw()
    await searchAbilities()

   await new Promise(resolve =>{
      setTimeout(()=>{
 
        resolve()
      }, 1500)

    })
 
 setPhase('ride')
 playerObjects.current.phase = 'ride'
await  continuousFunctioner()
}

async function ridePhase(){
  //when popup set an await for click
  //abilitycheck for beginning of ride
  subPhase.current = 'beginningOfRide' 
  turnState.current.event = 'beginningOfRide' 
  await searchAbilities()
  await waitAbilities()
  subPhase.current = '' //put in resetfield
  turnState.current.event = ''
 
  setPopupWord('ride')
  setPopup(true)

await waitPlayerInput()

//playerObjects.current.phase = 'main'
setPopupWord('')
    setPopup(false)
 //call functions from each other instead of in order
 //nextphase to control which phase to go to next
 



  //after ride searchabilities
  await searchAbilities()
  await waitAbilities()
  if(userZones.gDeck.length !== 0 ){
    setPopupWord('stride')//make its own function
    setPopup(true)
    await searchAbilities()
  }

  //set popup
  setPhase('main')
  playerObjects.current.phase = 'main'
}

async function mainPhase(){
  subPhase.current = 'beginningMain' 
  playerObjects.current.turnState = 'beginningOfMain'
  turnState.current.event = 'beginningOfMain' 
  await searchAbilities()
  await waitAbilities()
    subPhase.current = 'main' 
  playerObjects.current.turnState = 'main'
  setUserCircles({...userCircles})
}


async function battlePhase(){//have attack flag for attaking units
  subPhase.current = 'beginningBattle' 

  await searchAbilities()
  let attackFunc
  playerObjects.current.phase = 'battle'
  playerObjects.current.turnState = 'battle'
  let defendingUnits
  let boostCircle
  let boostingUnit
  let boostingListener
  document.getElementById('userCircles').addEventListener('click', Listeners.current.battleCircle = async (e)=>{

    if(abilitiesList.current.length !== 0 || isInAbility()){return}
    if(playerObjects.current.attacking){return}//chagnephase
    //cjeck if stand, check if canattack
    
    let unit = await getUserUnit(e)
    let circle = await getCircle(e)
   // if(unit ){return} //if unit is rest do something in rest

    if(unit != null){
 
      if(canAttackCheck(unit)){//check if canbeBoosted and if unit behind
        playerObjects.current.attacking = true
        highlight( await getUnitImg(circle.id) , redBorder)
        updateCurrentBattle('attackingUnit' , unit)


        
        if(isOnFrontrow(unit)&&unit.canBeBoosted ){// and cjeck if 
          let boosting = await getBoostCircle(unit)
          boostCircle = boosting.circle
          boostingListener = boosting.listener

         
        }
        //

         defendingUnits = await attackStep(unit)
  
        if(defendingUnits.length === 0){
          highlight( await getUnitImg(circle.id) , null) 
          
        if(boostingListener){
        document.getElementById(boostCircle).removeEventListener('click', boostingListener)
        }

          return
        }
        let boostImg
        if(userCircles[boostCircle].unit && userCircles[boostCircle].unit.canBoost){
          boostImg= await getUnitImg(boostCircle) 
        }

      if(boostImg && boostImg.style.border === redBorder){
        boostingUnit = userCircles[boostCircle].unit
      }
      else{
        //remove click listnener
        document.getElementById(boostCircle).removeEventListener('click', boostingListener)
      }
      document.getElementById('userCircles').removeEventListener('click' , Listeners.current.battleCircle  )
        await battle(unit, boostingUnit , defendingUnits , )
        //wjat if ability removes atatckingunit //come back
        boostingUnit = null
      }
    }

  })
  //do when endbattlephase remove  

}

 function canAttackCheck(unit){
  let circle = unit.circle
  if(unit.stand === true){
    if(unit.canAttack === true){
      if((circle.includes('F') || circle.includes('V')) || (unit.canAttackFromBackrow && circle.includes('B'))){
        return true
      }
    }    
  }
  return false
}


//////////////////////////////////////////////////////////////////////



 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//one object for circle endphase, onefor zone endphase, onefor global endphase,
//endphse make arrayof endturn keys loop through circles, if unit.id isin keysa rray do obj[unit.id]
async function increasePower(unit, power = 5000){
  
  unit.tempPower = unit.tempPower + power
  if(power > 0)
  addToYourLog('increasePower' , unit, turnState.current.card, power)
setUserCircles({...userCircles})
}
//use for giving to other units

//use for giving to self
async function increasePowerEndTurn(unit, power){

  let id = unit.id
  increasePower(unit, power)
  untilEndTurn(()=>{

    increasePower(unit, -power)}, unit, 'units')
}

async function increasePowerEndBattle(unit, power){
  let id = unit.id
  increasePower(unit, power)

  untilEndBattle(()=>{increasePower(unit, -power)}, unit, 'units')
}
/*
fix search circles
do log
do log searches
make function to test units. 

*/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function increaseShield(unit, shield){
  
  unit.tempShield = unit.tempShield + shield
  if(shield > 0)
    addToYourLog('increaseShield' , unit, turnState.current.card, shield)
}

async function increaseShieldEndTurn(unit, shield){
  //increasepower -> put reverse on endTurn object-> how to get unit in endTurn object -> search circles for units id
  let id = unit.id
  increaseShield(unit, shield)

  untilEndTurn(()=>{increaseShield(unit, -shield)}, unit, 'units')
}

async function increaseShieldEndBattle(unit, shield){
  //increasepower -> put reverse on endTurn object-> how to get unit in endTurn object -> search circles for units id
  let id = unit.id
  increaseShield(unit, shield)

  untilEndBattle(()=>{increaseShield(unit, -shield)}, unit, 'units')
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



async function increaseDrive(unit, drive){
  
  unit.tempDrive = unit.tempDrive + drive
  if(drive > 0)
    addToYourLog('increaseDrive' , unit, turnState.current.card, drive)
}

async function increaseDriveEndBattle(unit, drive){
  //increasepower -> put reverse on endTurn object-> how to get unit in endTurn object -> search circles for units id
  let id = unit.id
  increaseDrive(unit, drive)

  untilEndBattle(()=>{increaseDrive(unit, -drive)}, unit, 'units')
}

async function increaseDriveEndTurn(unit, drive){
  //increasepower -> put reverse on endTurn object-> how to get unit in endTurn object -> search circles for units id
  let id = unit.id
  increaseDrive(unit, drive)

  untilEndTurn(()=>{increaseDrive(unit, -drive)}, unit, 'units')
}

async function lingeringRemoveEndBattle(func , unit){//put id in endtunr or endbattle 
  //search circles for unit id if nothing return 
  let ability = {ability: {condition:null, cost:null , effect:func , category:'Lingering'}, card:unit , img:unit.img}
  //abilitiesList.current.push(ability)
  untilEndBattle(func , unit)


}

async function increaseCrit(unit, crit){
  
  unit.tempCrit = unit.tempCrit + crit
  if(crit > 0)
    addToYourLog('increaseCrit' , unit, turnState.current.card, crit)
}

async function increaseCritEndBattle(unit, crit){
  //increasepower -> put reverse on endTurn object-> how to get unit in endTurn object -> search circles for units id
  let id = unit.id
  increaseCrit(unit, crit)

  untilEndBattle(()=>{increaseCrit(unit, -crit)}, unit, 'units')
}

async function increaseCritEndTurn(unit, crit){
  //increasepower -> put reverse on endTurn object-> how to get unit in endTurn object -> search circles for units id
  let id = unit.id
  increaseCrit(unit, crit)

  untilEndTurn(()=>{increaseCrit(unit, -crit)}, unit, 'units')
}

//////////////////////////////////////////////////////////////////////////////

async function getsBoost(unit){
  if(unit.canBoostCheck)
  unit.canBoost = true
}
async function getsBoostEndTurn(unit){
  getsBoost(unit)
  untilEndTurn(()=>{ unit.canBoost = false}, unit, 'units')
}
async function getsIntercept(unit){
  if(unit.canInterceptCheck)
  unit.canIntercept = true
}
async function removeBoost(unit){
  unit.canBoost = false
}
async function removeIntercept(unit){
  unit.canIntercept = false
}
async function canAttackFromBackrowEndTurn(unit){
  unit.canAttackFromBackrow = true

  untilEndTurn(()=>{unit.canAttackFromBackrow = false}, unit, 'units')
}




async function decreaseOpponentUnits( amount , propertyArray , power , key = 'powerEndTurn'){
let circles = await chooseOpponentUnits(amount , propertyArray )

socket.emit('fightUpdate', { roomId :roomID,  command:'changePower', 
  item : {circles : circles , power:power , key:key}  }) 
}
 
//have object of continuous lingering effects, continuously check if units are affected by id
//gets circles -> give oppobent circles, what to decrease, how mych
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function changeProperty(unit , property , change){
  unit[property] = change

}

async function changePropertyEndTurn(unit , property , change){
  let prevProp = unit[property]
  changeProperty(unit , property , change)
  untilEndTurn(()=>{changeProperty(unit , property , prevProp) , unit ,'units'})

}
 

//-endtur

async function untilEndTurn(func , unit, type = 'units'){//dont ad to abilitieslist, do somekind of visual to show which one is resolving
//amake changes to unit -> when end turn -> undo changes by running the needed function from endTurn object
//run change function on unit, add reverse function to endTurn object
 
let id = unit.id || -1
let existingFunctions = endTurnFunctions.current[type][id]

if(existingFunctions ===  (null ||undefined)){

  endTurnFunctions.current[type] = {...endTurnFunctions.current[type] , [unit.id]: [func]}

}
else{
  endTurnFunctions.current[type] = {...endTurnFunctions.current[type] , [unit.id]: [...existingFunctions , func]}
}


 

 }

 async function untilEndBattle(func , unit, type = 'units'){//dont ad to abilitieslist, do somekind of visual to show which one is resolving
    //amake changes to unit -> when end turn -> undo changes by running the needed function from endTurn object
    //run change function on unit, add reverse function to endTurn object
 
  
    let id = unit.id
    let existingFunctions = endBattleFunctions.current[type][id]
 
    if(existingFunctions ===  (null ||undefined)){
      
      endBattleFunctions.current[type] = {...endBattleFunctions.current[type] , [unit.id]:[func]}
    
    }
    else{
      endBattleFunctions.current[type] = {...endBattleFunctions.current[type] , [unit.id]: [...existingFunctions, func] }
    }
    

 
    
 
}


async function endTurnFunctioner(){
  let userFunctions = endTurnFunctions.current.user
  let unitFunctions = endTurnFunctions.current.units
  let userKeys = Object.keys(userFunctions)
  let unitKeys = Object.keys(unitFunctions)
 
  for(let i =0;i<unitKeys.length; i++){
    let id = parseInt(unitKeys[i])
 
    // let results =   await searchCircles([{cardProperty : 'id', propertyToFind :  id, condition :'='}])
 
    // if(results.length !== 0){  
    //run all endturn functions
    await runEndTurnFunctions(id)
    // }

  }

  endTurnFunctions.current = {user:{} , units:{}}
  setUserCircles({...userCircles})
  setShowMessage(false)
}

async function endBattleFunctioner(){//doesnt account for recalling same id use unit.lingeringEffect for that
  let userFunctions = endBattleFunctions.current.user
  let unitFunctions = endBattleFunctions.current.units
  let userKeys = Object.keys(userFunctions)
  let unitKeys = Object.keys(unitFunctions)
 
  for(let i =0;i<unitKeys.length; i++){
    let id = parseInt(unitKeys[i])
 
    let results =   await searchCircles([{cardProperty : 'id', propertyToFind :  id, condition :'='}])
 
    if(results.length !== 0){  
    //run all endturn functions
    await runEndBattleFunctions(id)
    }
    
  }

  endBattleFunctions.current = {user:{} , units:{}}
  setUserCircles({...userCircles})
  setShowMessage(false)
}


async function runEndTurnFunctions(id){
let array = endTurnFunctions.current.units[id]
 
  for(let j =0; j<array.length;j++){
    await array[j]()
  }
}
async function runEndBattleFunctions(id){
  let array = endBattleFunctions.current.units[id]
 
    for(let j =0; j<array.length;j++){
      await array[j]()

    }
  }
//   click return selected and notselected -> 
async function addPlayerAbility(ability  ,card){ // for abilities belonging to the player , make a library of all player abilities given
playerAbilities.current[card.id] = ability

} //make for endturn and endbattle add remove to endturn/battle functioner

async function revealTopX(lookAmount , propertyArray = basicPropertyArray){
let cards = await lookTopX(lookAmount , propertyArray );
revealIt(cards)
//reveal
return cards
}

async function lookTopX(lookAmount , propertyArray = basicPropertyArray){
  let len = newDeck.MainDeck.length
  if(lookAmount > len){
    lookAmount = len
  }
  let slicedArray = newDeck.MainDeck.splice( len - lookAmount , len);
  return slicedArray
//   let results = await searchZones(slicedArray , propertyArray)
// setAbilityZone(slicedArray)
// setConfirm(true)
// setShowAbilityZone(true)
// await waitForElement('abilityZone') && await waitForElement('confirm')
// let confirmFunction
// document.getElementById(`confirm`).addEventListener('click', confirmFunction = (()=>{
 
  

//     document.getElementById(`confirm`).removeEventListener("click", confirmFunction)
 

// }))

return results
}

function newCount(zone, oldCount){ // takes in array from ability zone, searches for blue border and subtracts place value by 1 adn adds newcount
  let newCount = 1
  let abilityzone = Array.from(document.getElementById(`abilityZone`).children)
  for (let i =  zone.length -1; i >= 0; i--){
     
    if(abilityzone[i].style.border === blueBorder){
      if(zone[i].place >= oldCount){
         zone[i].place --
         
      }

     newCount++
    }
  }

  return newCount
}
async function rearrangeTopX(amount){
let tempZone = await lookTopX(amount, undefined)
 
let newZone = await rearrange(tempZone)
await addToZone(newZone, newDeck.MainDeck, newZone, 'deck' , false)
}


async function rearrangeTopXBotDeckRest(lookAmount , clickAmount){
let peek = await lookTopX(lookAmount)
  let cards = await clickAbilityZone(peek , clickAmount)

await addToZone(cards.selected, newDeck.MainDeck, cards.selected, 'deck' , false)
await addToZone(cards.notSelected, newDeck.MainDeck, cards.notSelected, 'deck' , true)
}

async function rearrange(zone){ //place no.1 goes ontop 
  //onclick set place to 1, 2, 3 and use that for reordering
  if(zone.length === 0){return}
  let addHand
  let confirmFunction
  let amount ,clickedAmount
  await getAbilityZone(zone)

  let count = 1
  let orginalPlace = zone[0].place
  let newZone = []

  await waitForElement('confirm') && await waitForElement('abilityZone')

  // make sure you do not add eventlistener twice
  await new Promise(resolve => document.getElementById(`abilityZone`) .addEventListener("click", addHand = (()=>{
   
    let index = Array.from(document.getElementById(`abilityZone`).children).indexOf(event.target.closest('.card'))
    let card = zone[index] 

    if(!event.target.closest('.card')){return}
    
    if(event.target.closest('.card').style.border === blueBorder ){
      highlight(event.target.closest('.card') , transparentBorder)
      count--
      count = newCount(zone, card.place)
      card.place =  orginalPlace
     }
      else if (event.target.closest('.card').style.border !== blueBorder )
      {
      highlight(event.target.closest('.card') , blueBorder  )
        card.place = count
        count++
     
      }

      setMainDeck([...MainDeck])
  }) ,  document.getElementById(`confirm`).addEventListener('click', confirmFunction = (()=>{

  if( count > zone.length){ //dont confirm if count !-=== szonelenbgth
    newZone = zone.sort((a , b)=> {if(a.place < b.place) {return -1}})

    document.getElementById(`abilityZone`) .removeEventListener("click", addHand)
    document.getElementById(`confirm`).removeEventListener("click", confirmFunction)

    resolve()
  }
  
  else{ timedDisplay('click all cards' , clickedAmount)}//add custom message
  //comeback
  })))
  
  )
  return newZone
}

async function lookTopXAdd(zoneToAdd, lookAmount, clickAmount , propertyArray){
  let look = await lookTopX(lookAmount ,  propertyArray)
  let results = await clickAbilityZone(look ,clickAmount, propertyArray)
  revealIt(results.selected)
  await addToZone(results.selected, zoneToAdd,  results.selected)
 
  return results.notSelected

}
async function lookTopXAddBotDeckRestAnyOrder(zoneToAdd, lookAmount, clickAmount , propertyArray){
 let rest = await lookTopXAdd(zoneToAdd, lookAmount, clickAmount , propertyArray)
rest = await rearrange(rest)
await putBotDeck(rest)

}

async function lookTopXAddShuffleRest(zoneToAdd, lookAmount, clickAmount , propertyArray){
  let look = await lookTopXAdd( zoneToAdd, lookAmount , clickAmount , propertyArray)
  await addToDeck(look, look)
  await shuffleDeck()

}
//make botdeck

async function callFromTopX(lookAmount, callAmount , propertyArray,circles,  mustBeOpen = false,func = (card)=>{card} ){
  let look = await lookTopX(lookAmount , propertyArray)
  let results = await clickAbilityZone(look ,callAmount, propertyArray)
  await callFromAbilityZone(results.selected , callAmount, results.selected, circles ,mustBeOpen ,func, 'deck' )
 return results.notSelected

}

async function callFromTopXShuffleRest(lookAmount, callAmount , propertyArray,circles,  mustBeOpen = false,func = (card)=>{card} ){
  let theRest =  await callFromTopX(lookAmount, callAmount , propertyArray,circles,  mustBeOpen, func)
  addToZone(theRest, newDeck.MainDeck, theRest)
  await shuffleDeck()
 
} 

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//promises

async function shuffleTheRest(arr){
  let tempDeck = arr
  for (let i = 0; i < tempDeck.length; i++) {
    // picks the random number between 0 and length of the deck
    let shuffle = Math.floor(Math.random() * (tempDeck.length));
    
    //swap the current with a random position
    [ tempDeck[i], tempDeck[shuffle] ] = [ tempDeck[shuffle], tempDeck[i] ];
    shuffle = Math.floor(Math.random() * (tempDeck.length));
    [ tempDeck[i], tempDeck[shuffle] ] = [ tempDeck[shuffle], tempDeck[i] ];
    shuffle = Math.floor(Math.random() * (tempDeck.length));
    [ tempDeck[i], tempDeck[shuffle] ] = [ tempDeck[shuffle], tempDeck[i] ];
  }
return tempDeck

}

async function inAnyOrder(arr, top = true){//calls rearrange and llook

}

async function topOrBottom(zone , clickAmount , inAnyOrder = false , propertyArray){
  let putTop = false
  let remaining = await toTopDeck(zone, clickAmount)
  //if in any order, rearrange remaining
  if(inAnyOrder){
    remaining = await rearrange(remaining)
  }
  if(remaining.length === 0){
    putTop = true
  }
  await addToZone(remaining, newDeck.MainDeck, remaining, 'deck' , true)
  return putTop
}
async function lookTopPutTopOrBottom(amount = 1, inAnyOrder = false ,propertyArray = basicPropertyArray){
  let zone = await lookTopX(amount)

 return await topOrBottom(zone, 1, inAnyOrder, propertyArray)

}

async function revealTopDeck(amount){
  let zone = await lookTopX(amount, 0)
  await reveal(zone)

}

function closeAbilityZone(){
  setShowAbilityZone(false)
}

async function getAbilityZone(zoneToSearch , propertyArray= basicPropertyArray , amount ){ //do addtozone next  dorest => eg call 2 from top 4 put rest on bottom
  let results = []
    turnState.current['zone'] = zoneToSearch
    results = await searchZones(zoneToSearch , propertyArray)  
    for(let i =0;i<results.length;i++){
 
      searchCardAbilities(results[i])
    }
  //addeventListener

  let viewArray = results 

  setAbilityZone(viewArray)
  setShowAbilityZone(true)
 
await waitForElement('abilityZone')
//do border clear
 
let element = document.getElementById('abilityZone')
let array = Array.from(element.children)
array.forEach((elements)=>{elements.style.border = '0.3rem solid transparent' })

//make button for reveal top to show other cards
setConfirm(true)
//addeventlister to class zone

return results 
}

async function clickAbilityZone(zoneToSearch ,  amount , propertyArray,  upTo = true ,clickedProperty = ''){
  let confirmFunction 
  let viewArray = await  getAbilityZone(zoneToSearch , propertyArray , amount )
  if((!yourCard(turnState.current.card) || upTo === false )&& doingEffect() ){
    if(viewArray.length < amount){
      amount = viewArray.length
    }
  }
 
  setAbilityZone(viewArray)
  let clickedAmount =0
  let addHand
  await waitForElement('confirm') && await waitForElement('abilityZone')
  // make sure you do not add eventlistener twice
  await new Promise(resolve => document.getElementById(`abilityZone`) .addEventListener("click", addHand = ()=>{
   
    let index = Array.from(document.getElementById(`abilityZone`).children).indexOf(event.target.closest('.card'))
    let card = zoneToSearch[index] 
    if(!card){return}
    if(event.target.closest('.card').style.border === blueBorder ){
      if(clickedProperty){
        
        clickedAmount = clickedAmount - card[clickedProperty]

      }
      else{
        clickedAmount --
      }
      
      highlight(event.target.closest('.card') , transparentBorder)
  
     }
      else if (event.target.closest('.card').style.border !== blueBorder )
      {
      highlight(event.target.closest('.card') , blueBorder  )
      if(clickedProperty){
        clickedAmount = clickedAmount + card[clickedProperty]
      }
      else{
        clickedAmount ++
      }
      if(amount === 1){document.getElementById(`confirm`).click()}
     
      }
  
  } ,  document.getElementById(`confirm`).addEventListener('click', confirmFunction = (()=>{
    if(payingCost() && amount !== clickedAmount){
      display(`Choose ${amount} cards`)
      return
    }
   else  if((!yourCard(turnState.current.card) || upTo === false) && doingEffect() && (clickedAmount !== amount) ) {
      
        display(`Choose ${amount} cards`)
        return
    

    }
  else if( amount >= clickedAmount){
   
    document.getElementById(`abilityZone`) .removeEventListener("click", addHand)
    document.getElementById(`confirm`).removeEventListener("click", confirmFunction)

    resolve()
  }
  
  else{ timedDisplay('Select ' + amount)}//add custom message
  //comeback
  })) 

)
  
  )
  let cards = []

  let notSelectedCards = [...zoneToSearch]
  
  let finalObj = {}
  let temp = Array.from(document.getElementById(`abilityZone`).children) 
  
  for (let i =  viewArray.length -1; i >= 0; i--){  
    if(temp[i].style.border === blueBorder){
      let card =  viewArray[i]
      cards.push(card)
      removeById(notSelectedCards, card.id)
    }

  }
 
  finalObj['selected'] = cards 
  finalObj['notSelected'] =   notSelectedCards 
 
  return finalObj
}

async function turnOrderZoneFaceDown(amount, propertyArray){
let cards = await clickAbilityZone(userZones.orderZone , amount, propertyArray )
let selected = cards.selected
for(let i =0;i<selected.length;i++){
  turnFaceDown(selected[i])
}

}

async function turnOrderZoneFaceUp(amount, propertyArray){
  let cards = await clickAbilityZone(userZones.orderZone , amount, propertyArray )
  let selected = cards.selected
  for(let i =0;i<selected.length;i++){
    turnFaceUp(selected[i])
  }
  
  }

//make callfromabilityzone , 
async function callFromAbilityZone(zone , amount , finalObj , elementsName = 'userCircles', mustBeOpen = false  , fnction = ((card) =>{return card} ) , previousArea = 'hand') {
  display('Select cards to call')
 setAbilityZone(finalObj)
 setShowAbilityZone(true)
  await waitForElement('abilityZone') && await waitForElement('confirm')
let circleElement = document.getElementById(elementsName)
let amountCalled = 0 //if  === amount return and resolve
let zoneClick
let cardToCall
let selectedCard
let callFunction
let confirmFunction 
const existingCircles = {
  userFRRG : userCircles['userFRRG'].unit , 
  userFLRG : userCircles['userFLRG'].unit , 
  userBRRG : userCircles['userBRRG'].unit , 
  userBCRG : userCircles['userBCRG'].unit , 
  userBLRG : userCircles['userBLRG'].unit , 
} 
let unitsCalled = {

}
let array = Array.from(document.getElementById(`abilityZone`).children)

await new Promise(resolve =>{ //check if listener already on
  document.getElementById('confirm').addEventListener('click' ,confirmFunction =  async ()=>{
    //have keys be the order they are clciked give each unit called a clickvalue property and sort them by that
    // set usercirles to existingcircles , loop units called and call over loop and remove from zone
    let unitsCalledValues= Object.values(unitsCalled)

    if(unitsCalledValues.length !== array.length){
      timedDisplay('Call all units')
      return
    }
    document.getElementById('confirm').removeEventListener('click' ,confirmFunction)
    userCircles['userFRRG'].unit = existingCircles.userFRRG
    userCircles['userFLRG'].unit = existingCircles.userFLRG
    userCircles['userBRRG'].unit = existingCircles.userBRRG 
    userCircles['userBCRG'].unit = existingCircles.userBCRG  
    userCircles['userBLRG'].unit = existingCircles.userBLRG  

    
   
    let sortedValues = unitsCalledValues.sort((a, b) => a.index < b.index )

    for (let i = sortedValues.length -1 ; i >= 0; i--){ //keys are zone ids
   
      let th = sortedValues[i]
       //make new function
      //redo call function 
      await removeById(zone ,th.card.id)
      await call(th.card , th.circleId , previousArea ,  fnction )
    
    }
    document.getElementById('abilityZone').removeEventListener('click', callFunction)
    if(zoneClick){
      circleElement.removeEventListener('click' , zoneClick )
    }
    resolve()
  } ,)
  //make search id 
  display('Call To RC')
  document.getElementById('abilityZone').addEventListener('click', callFunction  = async function (){
//on card click if found id(return arrayof circles) existingCircles[array[0].circle]

    if(event.target.closest('.card').style.border === blueBorder ){
 
      highlight(event.target.closest('.card') , transparentBorder)
  
     }
      else if (event.target.closest('.card').style.border !== blueBorder )
      {
      selectedCard  = event.target.closest('.card') 
      highlight(selectedCard , blueBorder  )
       //get the index onclick then splice from ob.ids
      let index = array.indexOf(event.target.closest('.card'))
      cardToCall = finalObj[index]
      let idFound = idSearchCircle(cardToCall.id)
   
      if(idFound.length > 0){
        let existingId =  idFound[0] 
        userCircles[existingId].unit =    existingCircles[existingId]
        setUserCircles({...userCircles})
 
      }

        if(!zoneClick){ // add circle eventlistener
            circleElement.addEventListener('click' , zoneClick =  async ()=>{
                

                let get = await getCircle(event)
                let circleId = get.id
    
                let circle = userCircles[circleId]
                if(!circle){return}
                if(circleId === 'userVG'){
                  timedDisplay('Cant call to VC')
                  return 
                }
                if(mustBeOpen && circle.unit){
                  timedDisplay('RG Must Be Open')
                  return 
                }
                
                highlight(selectedCard , transparentBorder  ) 

                if(cardToCall.cannotBePlacedOn.includes(circleId)){
                  timedDisplay('Cannot be called there')
                  return
                }
                circle.unit =  cardToCall  // on confirm splice 
                circle.unit.circle = circleId
                unitsCalled[cardToCall.id] = {circleId : circleId , card: cardToCall}
                
                setUserCircles({...userCircles})
 
            } , {once:true} )
            zoneClick = null
        }
     
      }

  })

})

}

//get abilityzone -> add


async function addToZone(zoneToRemove , zoneToAdd , finalObj, previousArea , putBottom = false ,state = ''){

if(!zoneToRemove || !finalObj){return}
if(putBottom){
  finalObj = finalObj.reverse()
}
for (let i =finalObj.length -1; i>=0; i--){
  let card = finalObj[i]
  card.state = state || 'put'
  if(putBottom){
    zoneToAdd.unshift(card)
  }
  else{
    zoneToAdd.push(card)
  }
 await removeById(zoneToRemove , card.id)

}

}

async function superiorAdd(zone , zoneToAdd , amount, previousArea ,propertyArray, putBottom  =false, upTo = true){
 
let obj =  await clickAbilityZone( zone, amount , propertyArray, upTo = true)
  //do something for rideDeck
  revealIt(obj.selected)
  await addToZone(zone , zoneToAdd , obj.selected, previousArea , putBottom )
 
   setUserZones({...userZones})
   if(zone === newDeck.MainDeck){//if searchind deck
    await shuffleDeck()
   }
  //  closeAbilityZone()
  return obj.notSelected
}

async function addToDeck(zone, zoneToRemove ){

  let addingToRide = false
  let mainDecks = zone.filter((card)=>card.fromRideDeck === false)
  let rideDecks = zone.filter((card)=> {if(card.fromRideDeck === true){ addingToRide = true ;turnFaceUp(card); return true }})

  addToZone(zoneToRemove, newDeck.MainDeck, mainDecks , 'deck'  ,true)
  addToZone(zoneToRemove, newDeck.RideDeck, rideDecks , 'deck'  ,true)
  if(addingToRide){
    document.getElementById('userRideDeck').style.backgroundImage = `url(${newDeck.RideDeck[0].img})`
  }

}

function putBotDeck(arr){
  addToZone(arr, newDeck.MainDeck, arr , 'deck'  ,true)
}

function putTopDeck(arr){
  addToZone(arr, newDeck.MainDeck, arr , 'deck'  ,false)
}

function putDrop(arr){
  addToZone(arr, userZones.drop , arr , 'deck'  ,false)
}
function putHand(arr){
  addToZone(arr, userZones.hand , arr , 'deck'  ,false)
}
function putSoul(arr){
  addToZone(arr, userZones.soul , arr , 'deck'  ,false)
}
function putRemove(arr){
  addToZone(arr, userZones.removed , arr , 'deck'  ,false)
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//

async function removeById(zone , id){
  if(!zone){return}
  let index = zone.findIndex((card)=>{  return card.id === id ;} )

  if(index > -1 ){  
  zone.splice(index , 1)

}
}

 function idSearchCircle(id){//
let units = Object.values(userCircles)
let returning = []

for(let i  =0 ; i<units.length -1; i++){
if((units[i].unit != null) && units[i].unit.id === id){

  returning.push(units[i].unit.circle)
}
}
return returning

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//call

async function call(card , circleId , previousArea , fnction= (card)=>{}){
  let circle = userCircles[circleId]
  let prevRest = false
let unit = card
if(unit.cardtype.includes('Order')){
  userZones.drop.push(unit)
  await removeById(userZones[previousArea] , unit.id)

  return
}

  if(circle.unit){
    //retire rg
    let dropCard =circle.unit
    if(dropCard.stand === false){
      prevRest = true
    }
    userZones.drop.push(dropCard)

    
    circle.unit = null
  }


  addToYourLog('called' , card, turnState.current.card)
  turnState.current['called'].push({id:card.id , circle:circleId})
  unit.circle = circleId
  turnState.current.event = 'called'
  eventCard.current.called.push(card)
  

    unit['previousArea'] = previousArea
    unit['state'] = 'placed'
    unit['place'] = 'RC'
    unit['canDrive'] = false
    unit.circle = circleId
  if(unit.hasIntercept && onFrontRowRC(unit)){
 
    unit.canIntercept = true
  }
  userCircles[circleId].unit = unit
  if(prevRest){
    stand(unit)
  }
  setUserCircles({...userCircles})
 
   fnction(unit)
 // addToLog('You' , 'called' , card.name , event.current )
 await removeById(userZones[previousArea] , unit.id)
 await searchAbilities()
 resetTurnState()
  }

async function superiorCallFrontRow(zoneToSearch , propertyArray , amount , mustBeOpen , previousArea , fnction){
 await superiorCall(zoneToSearch , propertyArray , amount , 'userFrontRow' , mustBeOpen , previousArea , fnction)
}
async function superiorCallBackRow(zoneToSearch , propertyArray , amount , mustBeOpen , previousArea , fnction){
 await superiorCall(zoneToSearch , propertyArray , amount , 'userBackRow' , mustBeOpen , previousArea , fnction)
}
  //-addeventlistener circles


async function callThisCard(unit ,elementsName = 'userCircles', mustBeOpen , fnction){
let newZone = [unit]
let zoneName = unit.place
let zoneToRemove = userZones[zoneName]
await superiorCall(zoneToRemove , [{cardProperty: 'id', propertyToFind:unit.id, condition:'='}] ,1 , elementsName, mustBeOpen ,unit.place ,fnction)

}

async function superiorCall(zoneToSearch , propertyArray = basicPropertyArray, amount = 1 , elementsName = 'userCircles', mustBeOpen = false, previousArea , fnction = (card)=>{return card} , upTo = true){
    // arrayOfProperties = [{"cardProperty" :  grade , "propertyToFind: 3" , "condition": >}]
 
let obj =  await clickAbilityZone( zoneToSearch, amount, propertyArray , upTo)
 
   await callFromAbilityZone(zoneToSearch , amount , obj.selected , elementsName , mustBeOpen , fnction , previousArea)
 
    .then(async ()=>{
 
 setUserZones({...userZones })
 
 // await searchAbilities()


  })
  if(previousArea !== 'hand'){
    thisTurn.current.calledRearguardOtherHandThisTurn = true
  }
  socket.emit('fightUpdate', { roomId :roomID,  command:'searchAbilities', item :{}}) 
  return obj.notSelected
  }
/////////////

async function nCall(card){

  if(turnState.current.state !== '' || phase !== 'main'){return}
  buttonChanger(false)
  let id = card.id
  setShowMessage(true)
  setMessage('Select a card to call')
 
  let index
  let circle
  turnState.current.state = 'normalCall' 
 
    if(card.tempGrade > userCircles.userVG.unit.tempGrade){
      timedDisplay("You cannot normal call a card with a grade higher than your vanguard")
      setPopup(false)
      resetTurnState()

      
      return;
      }
      else if(card.cardtype.includes('Order')){
        timedDisplay("You cannot call Orders")
        setPopup(false)
        resetTurnState()
      
        return
        }
        else{
          let overdressCheck = await checkOverDress(card) 

          if(overdressCheck === true){
            
             
            setPopupWord('overDress')
            setPopup(true)
      
            await waitPlayerInput()
        
          }

          const elements = document.getElementById('userCircles');
          display('Select a circle to call to')
          await new Promise(resolve => elements.addEventListener("click", ( Listeners.current.callCircle =async ()=>{
            
            circle = await getCircle(event)
  
            id = circle.id

            if(userCircles[id] === (null||undefined)){
              setShowMessage(false)
              resetTurnState()
              return
            }
 
         if(id === "userVG"){timedDisplay('Cannot call to VG  ');
          resetTurnState()
          return;}
           await call(card, id , 'hand')
     
         
        setShowMessage(false)
        buttonChanger(true)
        resolve()
         }) , {once:true})
         
         );
        
        
        }
 
 
      await waitAbilities()
await continuousFunctioner()
resetTurnState()
}




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ride

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//abilities

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//costs

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//cardabilities

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//turn


async function unitPlacedRG(e){//change properties for canattack can boost etc for when a unit is placed
  let circle = await getCircle(e)
  let id = circle.id
  let unit = userCircles[circle.id].unit
  if(unit.skill === " Boost"){

   unit['canBoost'] = true
   
  }
  
  if(id.includes('F')){
    unit['canAttack'] = true
  }
  else{
    unit['canAttack'] = false
  }
 
  if(unit.skill === " Intercept"){
    unit['canBoost'] = false
    unit['canIntercept'] = true
  }
  unit['previousArea'] = 'hand'
  unit['state'] = 'placed'
  unit['place'] = 'RC'
  unit['canBeBoosted'] = true
  unit['canDrive'] = false
  unit['circle'] = id
 


}





async function shuffleDeck(){
  let tempDeck = newDeck.MainDeck
  for (let i = 0; i < tempDeck.length; i++) {
    // picks the random number between 0 and length of the deck
    let shuffle = Math.floor(Math.random() * (tempDeck.length));
    
    //swap the current with a random position
    [ tempDeck[i], tempDeck[shuffle] ] = [ tempDeck[shuffle], tempDeck[i] ];
    shuffle = Math.floor(Math.random() * (tempDeck.length));
    [ tempDeck[i], tempDeck[shuffle] ] = [ tempDeck[shuffle], tempDeck[i] ];
    shuffle = Math.floor(Math.random() * (tempDeck.length));
    [ tempDeck[i], tempDeck[shuffle] ] = [ tempDeck[shuffle], tempDeck[i] ];
  }
  
 
}
function updateCurrentBattle(property , newVal){
  currentBattle.current[property] = newVal

  socket.emit('fightUpdate', { roomId :roomID,  command:'updateCurrentBattle', item :{
    currentBattle : currentBattle.current
  }})

}
async function battle(attackingUnit, boostingUnit, defendingUnits , ){
  // setTurnState('startOfBattle') do after battle object
  // //do currentBattle changes
  // await searchAbilities()
  // await waitAbilities()
  currentBattle.current.attackingUnit = attackingUnit 
  rest(attackingUnit)
  playerObjects.current.attacksThisTurn ++;
  if(boostingUnit != null ){
    await boostUnit(boostingUnit , attackingUnit  )
}
playerObjects.current.turnState = 'battle'
attackingUnit.state = 'attacks'
  let newDefendingUnits = {}
  let attackingCircle = currentBattle.current.attackingUnit.circle
  for(let i =0; i<defendingUnits.length;i++){
    let defendingCircle = defendingUnits[i].circle
    let defendingPower = defendingUnits[i].tempPower
 
    newDefendingUnits[defendingCircle] = {circleId : defendingCircle , guardians:[] , shieldValue:0 , unitPower : defendingPower}
  }

 
  
  currentBattle.current.defendingUnits = newDefendingUnits 
 
  setShowInfo(true)
 


  //keep track of all boosting units

continuousFunctioner()
  await searchAbilities()
  await waitAbilities()

  unitPower(attackingUnit.tempPower ,defendingUnits[0].tempPower )
  setUserCircles({...userCircles})
  if(!userCircles[attackingCircle].unit){return}
  socket.emit('fightUpdate', { roomId :roomID,  command:'attack', 
  item : {currentBattle:currentBattle.current}  }) //reply updates currentbattle defendingunits

  await waitPlayerInput()
  if(currentBattle.current.attackingUnit.canDrive){
    attackingUnit.state = 'driveCheck'

   await driveCheck(currentBattle.current.attackingUnit.tempDrive)
  }

if(userCircles[attackingCircle].unit)
  if(userCircles[attackingCircle].unit.id === currentBattle.current.attackingUnit.id)
  {await damageCalc() }
 // await waitPlayerInput() //check for on hit before continuing

  await endOfBattle()

} 

async function damageCalc(){// do proper wait for removing triggers in damage chjecka nd drivecheck
let defending = currentBattle.current.defendingUnits
let attacking = currentBattle.current.attackingUnit
attacking.state = 'attackDidNotHit'
//do drivecheck
playerObjects.current.turnState = 'damageCalc'
let defendingArray = Object.values(defending)
let hitUnits = []

for(let i = 0; i< defendingArray.length ; i++){
  let defendingunit = defendingArray[i]
  let circlename = defendingunit.circleId.replace('user' , 'opponent')
 
  let uni = currentOpponentCircles.current[circlename].unit
  //doesnt do new power values 
  let sum = defendingunit.unitPower + defendingunit.shieldValue
  unitPower(attacking.tempPower , sum)
  await timedDisplay()
  
if((attacking.tempPower >= sum )&& uni.canBeHit){

  hitUnits.push(defendingunit.circleId)
  attacking.state = 'attackHit'
 
}
}

// await searchAbilities()
// await waitAbilities()
//do something for 'when this units attack hit'
socket.emit('fightUpdate', { roomId :roomID,  command:'damageCalc', 
item : {hitUnits: hitUnits , attackingCrit: attacking.tempCrit }  })
await waitPlayerInput()

for(let i = 0; i< hitUnits.length ; i++){
  attacking.state = 'attackHit'
  playerObjects.current.turnState = 'damageCalc'

  await searchAbilities()

}
await waitAbilities()

}

async function battleCleanup(idArray , attackingCrit){
  //
  for (let i = 0; i<idArray.length; i++){
    userCircles[idArray[i]].unit.state = 'hit'
 
  }
  await searchAbilities()
  await waitAbilities()


  for(let i = 0; i< idArray.length; i++){
    let id = idArray[i]
    let unit = userCircles[id].unit
    //if state === hit retire/damagecheck 


      if(unit.place === 'VC'){
        await damageCheck(attackingCrit)
      }
      else if(unit.place === 'RC'){
        await retireByBattle(unit.circle)
      }

  }

  unhighlightOpponentCircles()
unhighlightUserCircles()
  socket.emit('fightUpdate', { roomId :roomID,  command:'stopWait', 
  item : { }  })
}

async function boostUnit(boostingUnit , boostedUnit  ){
boostingUnit.state = 'boosts'
//cont
boostingUnit.boosting = true
boostedUnit.isBoosted = true
currentBattle.current.boostingUnits.push(boostingUnit) 
let oldBoostPower = boostingUnit.tempPower 
let boostingCircle = boostingUnit.circle 
rest(boostingUnit)

boostedUnit.tempPower = boostedUnit.tempPower + boostingUnit.tempPower

let boostId = boostingUnit.id + 'boost'

let newBoost =  {
  
  funct : function() {
 
  let boostingCircle = this.boostingUnit.circle 

  if(this.oldBoostPower !== this.boostingUnit.tempPower){
  let differece = this.boostingUnit.tempPower - this.oldBoostPower
  this.boostedUnit.tempPower = this.boostedUnit.tempPower + differece
  this.oldBoostPower = this.boostingUnit.tempPower
}
if(userCircles[boostingCircle].unit === null){

  
  this.boostedUnit.tempPower = this.boostedUnit.tempPower - this.boostingUnit.tempPower
  this.boostedUnit.isBoosted = false
  
}
} , 
removeFunct : function(){
    
  this.boostedUnit.tempPower = this.boostedUnit.tempPower - this.boostingUnit.tempPower
  this.boostedUnit.isBoosted = false
  
},
oldBoostPower : boostingUnit.tempPower ,
boostedUnit : boostedUnit,
boostingUnit : boostingUnit
}
 
//end of battle clear all of these
currentBattle.current.boostingIds.push(newBoost) 
}

async function endPhase(){
  //set powers to original

}


async function turn(){
await standDraw()
await ridePhase()
await mainPhase()
await battlePhase()
await endPhase()


}


function draw(amount = 1){

 for(let i = 0;i<amount;i++){
  let card =  newDeck.MainDeck.pop()
  addToYourLog( 'draw' , card , undefined)
  card.previousArea = "deck"
  card.place = 'hand'
  userZones.hand.push(card)

 }
    setUserZones({...userZones})
}


async function heal(){
  if(!((userZones.damage.length >= currentOpponentZones.current.damage.length) && userZones.damage.length > 0)){
    return
  }

  let index = 0
  let healListener
  let card ; 
  if(userZones.damage === 0){return}
  
  setAbilityZone(userZones.damage)
  setConfirm(true)
  setShowAbilityZone(true)
  await waitForElement('confirm') && await waitForElement('abilityZone')


  await new Promise(resolve => document.getElementById('abilityZone').addEventListener("click",  healListener =  async (e)=>{//decrese counterblasrts

    index = Array.from(document.getElementById(`abilityZone`).children).indexOf(e.target.closest('.card')) 
    //clicked card
    card = userZones.damage[index]
    if(card){
      resolve()
    }

    
    }) ,
    ).then(()=>{//if facedown turn faceup
      let newCard = userZones.damage.splice(index , 1)[0]
      document.getElementById('abilityZone').removeEventListener("click",  healListener)
      newCard.previousArea = "damage"
      newCard.place = 'drop'
      if(newCard.state === 'faceup'){

      }
     else if(newCard.faceup === false){
      turnFaceUp(newCard)
      }
      userZones.drop.push(newCard)
    
    })
closeAbilityZone()
    setUserZones({...userZones})
}
//-waits
// wait your abilities, wait opponent abilities, wait opponent input, wait start game

async function waitForElement(elem){
  return await new Promise((resolve)=>{
   turnState.current['interval'] = setInterval(()=>{
    if(document.getElementById(elem)){
  
        clearInterval(turnState.current['interval'])
      resolve()
    }
    })

  })
}

async function waitAbilities(){//do a wait for waitabilities and one for player wait
 if(abilitiesList.current.length >0){
   return await new Promise(resolve => document.getElementById('abilityStack').addEventListener("click", (()=>{
     resetEventCard()
    resolve();
  }) , {once:true}));
 }


} 

async function waitOpponentAbilities(){//attach onclick to element wait until element is clicked
  //check if should waitdo after resolve ability 
  if(opponentAbilitiesList.current.length <0 && abilitiesList.current.length === 0 && playerTurn)
 
   return await new Promise(resolve => document.getElementById('opponentAbilityWait').addEventListener("click", (()=>{
 
        resolve();
      }) , {once:true}));

}

async function waitPlayerInput(){ 
  socket.emit('fightUpdate', { roomId :roomID,  command:'opponentWaiting',  })
  return await new Promise(resolve => document.getElementById('wait').addEventListener("click", (()=>{
 
    resolve();
  }) , {once:true}));

}

//change .rearguard, .vanguard to .unit
async function triggerHandler(card, driveCheck){
  //make rerender on trigger
 
  if(!card.triggereffect ){
 
    return
  }
let triggerType = card.triggerType 

let triggerPower =  card.triggerPower //multiply for hexaorb

let power 
let trigger 
const elements = document.querySelectorAll( "#" +`userCircles`)[0];

if(triggerType !== 'Front'){


  display('Give Power')
await new Promise(resolve => elements.addEventListener("click",  power = async (e)=>{
 
 
  let circle = await getCircle(e)
 
  if(userCircles[circle.id].unit !== null){
 
    increasePowerEndTurn(userCircles[circle.id].unit , triggerPower)
 
   
   

  resolve()
  }

} , )

);  
 
}
if(power){
  document.getElementById('userCircles').removeEventListener('click' , power)
}
 
if(triggerType === 'Critical'){
  

  let triggerCrit = card.triggerCrit

  display('Give Crit')

 await new Promise(resolve => elements.addEventListener("click", trigger = async (e)=>{

  let circle = await getCircle(e)
  if(userCircles[circle.id].unit !== null){
       
      increaseCritEndTurn(userCircles[circle.id].unit , triggerCrit)
  resolve()
  }

} ,   )

);  


}
else if(triggerType === 'Draw'){ 

 draw()
}

else if(triggerType === 'Front'){//handle for when front indcreases backrow aswell
  let inFront = false
//this will increase userUnit Power even if attackingUnit is in the backrow
  const frontrow = document.querySelectorAll( "#" +`userFrontRow`)[0];
  for(let i = 0; i< frontrow.children.length; i++){

 
 
    if(userCircles[frontrow.children[i].id].unit){
 
        increasePowerEndTurn(userCircles[frontrow.children[i].id].unit , triggerPower)
        

    }


 
  }

  


 
}

else if(triggerType === 'Heal'){


 if(userZones.damage.length >= currentOpponentZones.current.damage.length && userZones.damage.length > 0){
  display('Can Heal')
  await heal();

 }

}



else if(triggerType === 'Over'){ 

 draw( )
 //handle removing of over
 
 
  if(driveCheck){
 
    await resolveAbility(card.additionalEffect, card)
  }
 
  await removeById(userZones.trigger, card.id)
 putRemove([card])
}

//remove eventlisteners

if(currentBattle.current.attackingUnit){
  setUserUnitPower(currentBattle.current.attackingUnit.tempPower)
}

if(trigger){
  document.getElementById('userCircles').removeEventListener('click' , trigger)
}
setShowMessage(false)
}

//find  a way to get playerTurn
async function driveCheck(drive){
  playerObjects.current.turnState = 'driveCheck'
  currentBattle.current.attackingUnit.state = 'driveCheck'


  
  for(let i=0;i<drive;i++){
  

    let card = newDeck.MainDeck.pop()
    card.previousArea = "deck"
  card.place = 'trigger'
  card.state = 'revealedForDriveCheck'
    
  currentBattle.current.revealedUnits.push(card)
    userZones.trigger.push(card)
 

    turnState.current.state = 'driveCheck' // + i   comeback

   // await  continuousFunctioner()
setUserZones({...userZones})
 currentBattle.current.attackingUnit.state = 'driveCheck'
await searchAbilities()
await waitAbilities()

turnState.current.state = '' 
//perhaps add a wait check here, for abilities

if(card.triggereffect != ''  ) {
 
  await triggerHandler(card , true)

}

await new Promise( (resolve)=>{
  setTimeout(async () => {
  
    if(userZones.trigger[0] != (null ||undefined)  ){
      userZones.hand.push(userZones.trigger.pop())
      setUserZones({...userZones})
    }

    resolve()
  }, 300)
} 

 )

   drive = currentBattle.current.attackingUnit.tempDrive

  }
 

}

async function damageCheck(crit){
  
 
  for(let i=0;i<crit;i++){
    let card = newDeck.MainDeck.pop()

    card.previousArea = "deck"
    card.place = 'trigger'
    userZones.trigger.push(card)
 
    setUserZones({...userZones})
    
await searchAbilities()
  await waitAbilities()
 

 if(card.triggereffect != ''  ){
   await triggerHandler(card, false)

 }

 card.previousArea = "trigger"
 card.place = 'damage'
 
//come back
await new Promise((resolve)=>{
   setTimeout(async () => {
  
    if(userZones.trigger[0] != (null ||undefined)  ){
      userZones.damage.push(userZones.trigger.pop())
      setUserZones({...userZones})
    }

  resolve()
  }, 500)
} 
 )

 
  }
  
 
}

async function dealDamage(amount = 1){
  socket.emit('fightUpdate', { roomId :roomID,  command:'damageCalc', 
    item : {hitUnits: ['userVG'] , attackingCrit: amount }  })
    await waitPlayerInput()
}

async function noGuard(){

  socket.emit('fightUpdate', { roomId :roomID,  command:'guardians', item : {guardians:userCircles.userGC.guardians,
   units: {   opponentUnitPower : opponentUnitPower.current , userUnitPower: userUnitPower.current }}})
}
 // if nextTime remove reduceCB and nextTime from player, do this from cb and sb functions. make a function for this

async function counterBlastHandler(amount, propertyArray){

  let damage = userZones.damage
  let confirmFunction 
  
  let cb 
  let clickedAmount =0
  let newDamage = await searchZones(damage ,  propertyArray)
  setAbilityZone(newDamage)
  setShowAbilityZone(true)
setConfirm(true)
//addeventlister to class zone
await waitForElement('confirm') && await waitForElement('abilityZone')


await new Promise(resolve => document.getElementById(`abilityZone`) .addEventListener("click", cb = (()=>{
 
  let index = Array.from(document.getElementById(`abilityZone`).children).indexOf(event.target.closest('.card'))

  if(event.target.closest('.card').style.border === blueBorder && damage[index].faceup === false){
    clickedAmount --
    highlight(event.target.closest('.card') , transparentBorder)

   }
    else if (event.target.closest('.card').style.border !== blueBorder &&  damage[index].faceup === true)
    {
    highlight(event.target.closest('.card') , blueBorder  )
    clickedAmount ++

    }
    else if (event.target.closest('.card').style.border === blueBorder &&  damage[index].faceup === true)
      {
        clickedAmount --
        highlight(event.target.closest('.card') , transparentBorder)
  
      }

}) ,  document.getElementById(`confirm`).addEventListener('click', confirmFunction = (()=>{
if( amount == clickedAmount){

  resolve()
}
else{
  
  timedDisplay('click more cb')
}
//comeback
})))

).then(()=>{
  // set hand as useref to allow new cards to be guardesd with
  document.getElementById(`abilityZone`) .removeEventListener("click", cb)
 
  document.getElementById(`confirm`).removeEventListener("click", confirmFunction)
  let temp = Array.from(document.getElementById(`abilityZone`).children)
  for (let i =  damage.length -1; i >= 0; i--){
 
    if(temp[i].style.border === blueBorder){

   
      turnFaceDown(damage[i])

      
    }
 
}
setUserZones({...userZones })

// setUserZones({...userZones , damage:temp})
})

}

 

async function counterChargeHandler(amount){
  let damage = userZones.damage
  let confirmFunction 
 
  let cc 
  let clickedAmount =0
  setAbilityZone(userZones.damage)
  setShowAbilityZone(true)
setConfirm(true)
//addeventlister to class zone
await waitForElement('confirm') && await waitForElement('abilityZone')

await new Promise(resolve => document.getElementById(`abilityZone`) .addEventListener("click", cc = (()=>{
 
  var index = Array.from(document.getElementById(`abilityZone`).children).indexOf(event.target.closest('.card'))

  if(event.target.closest('.card').style.border === blueBorder && damage[index].faceup === true){
    clickedAmount --
    highlight(event.target.closest('.card') , transparentBorder)
  
   }
    else if (event.target.closest('.card').style.border !== blueBorder &&  damage[index].faceup === false)
    {
    highlight(event.target.closest('.card') , blueBorder  )
    clickedAmount ++
 }

}) ,  document.getElementById(`confirm`).addEventListener('click', confirmFunction = (()=>{
if( amount >= clickedAmount){

  resolve()
}
else{display('click more cc')}
//comeback
})))

).then(()=>{
  // set hand as useref to allow new cards to be guardesd with
  document.getElementById(`abilityZone`) .removeEventListener("click", cc)
 
  document.getElementById(`confirm`).removeEventListener("click", confirmFunction)
  let temp = Array.from(document.getElementById(`abilityZone`).children)
  for (let i =  damage.length -1; i >= 0; i--){
 
    if(temp[i].style.border === blueBorder){

      turnFaceUp(damage[i])

      
    }
 
}
setUserZones({...userZones })

// setUserZones({...userZones , damage:temp})
})

}

async function soulChargeHandler(){
  let soul = userZones.soul

//addeventlister to class zone
let card = newDeck.MainDeck.pop()
soul.push(card)
addToYourLog('soulCharge' , card , turnState.current.card)

setUserZones({...userZones})
thisTurn.current.soulCharged = true
turnState.current.event = 'soulCharge'

}

async function soulBlastHandler(amount, propertyArray= basicPropertyArray ){
  let soul = userZones.soul
  let confirmFunction 

  let sb
  let clickedAmount =0
  let newSoul = await searchZones(soul , propertyArray )
  setAbilityZone(newSoul)
  setShowAbilityZone(true)
setConfirm(true)
//addeventlister to class zone

await waitForElement('confirm') && await waitForElement('abilityZone')



await new Promise(resolve => document.getElementById(`abilityZone`) .addEventListener("click", sb = ()=>{
 
  var index = Array.from(document.getElementById(`abilityZone`).children).indexOf(event.target.closest('.card'))

  if(event.target.closest('.card').style.border === blueBorder ){
    clickedAmount --
    highlight(event.target.closest('.card') , transparentBorder)

   }
    else if (event.target.closest('.card').style.border !== blueBorder )
    {
    highlight(event.target.closest('.card') , blueBorder  )
    clickedAmount ++
  }

} , document.getElementById(`confirm`).addEventListener('click', confirmFunction = ()=>{
  if( amount === clickedAmount){

    resolve()
  }
  else{timedDisplay('click more sb')}
  //comeback
  }
  
  ))

).then(()=>{
  // set hand as useref to allow new cards to be guardesd with
  document.getElementById(`abilityZone`) .removeEventListener("click", sb)
 
  document.getElementById(`confirm`).removeEventListener("click", confirmFunction)
  let temp = Array.from(document.getElementById(`abilityZone`).children)
  for (let i =  newSoul.length -1; i >= 0; i--){
 
    if(temp[i].style.border === blueBorder){

       let card = newSoul[i]

      card.state = 'soulBlasted'
      removeById(soul , card.id)
      userZones.drop.push(card)

    }
 
}
setUserZones({...userZones })

})

}
async function counterBlast(amount, propertyArray = basicPropertyArray){
//showzone
//confirm amount to counterblast then pass to counterblasthandler
  
  let tempAmount = amount
 
  
if (amount <= 0 || tempAmount <= 0){
 
  return
}

  await counterBlastHandler(tempAmount, propertyArray)
 


}
async function counterCharge(amount){
 
 if(amount < 0 || userZones.damage.length === userZones.damage.filter((card)=>card.faceup ===true).length ){
  amount = 0
  return
 }
await counterChargeHandler(amount)
 
thisTurn.current.counterCharged = true
}

 function energyCharge(amount){
//make playerobjects value for having energy generator
 
  playerObjects.current['energy'] = playerObjects.current['energy'] + amount
  if(playerObjects.current['energy'] > playerObjects.current['maxEnergy'] ){
    playerObjects.current['energy'] = playerObjects.current['maxEnergy'] 
  }
 
}
 function energyBlast(amount){
  //make playerobjects value for having energy generator
  if(playerObjects.current.energy){
    playerObjects.current['energy'] = playerObjects.current['energy'] - amount
  }
  
  }

async function soulCharge(amount){//round to deck number if sc3 amd deck 1
 
  if(amount >= newDeck.MainDeck.length){
    amount = newDeck.MainDeck.length
  }
 for(let i = 0; i<amount; i++){
  await soulChargeHandler(amount)
 }

 thisTurn.current.soulCharged = true

}
//maybe put soul as parameter, make a global function removeFromZone(zone , amount , reson)
async function soulBlast(amount , propertyArray = basicPropertyArray){

if (amount <= 0){
  return
}

    
await soulBlastHandler(amount, propertyArray )
 
if( amount >=4){
  thisTurn.current.soulBlast4OrMoreThisTurn = true
}


}

async function soulBlastDifferentGrade(amount, propertyArray= basicPropertyArray ){
  let soul = userZones.soul
  let confirmFunction 

  let sb
  let clickedAmount =0
  let newSoul = await searchZones(soul , propertyArray )
  let clickedGrades = {}
  setAbilityZone(newSoul)
  setShowAbilityZone(true)
setConfirm(true)
//addeventlister to class zone

await waitForElement('confirm') && await waitForElement('abilityZone')



await new Promise(resolve => document.getElementById(`abilityZone`) .addEventListener("click", sb = ()=>{
 
  let index = Array.from(document.getElementById(`abilityZone`).children).indexOf(event.target.closest('.card'))

  if(event.target.closest('.card').style.border === blueBorder ){

    clickedAmount --
    highlight(event.target.closest('.card') , transparentBorder)
      let unit = newSoul[index]
      if(clickedGrades[unit.tempGrade] !== (undefined || null)){
        delete clickedGrades[unit.tempGrade]
      }
   }
    else if (event.target.closest('.card').style.border !== blueBorder )
    {
      let unit = newSoul[index]

      if(clickedGrades[unit.tempGrade] === (undefined)){
      
        highlight(event.target.closest('.card') , blueBorder  )
        clickedAmount ++
        clickedGrades[unit.tempGrade] = unit.tempGrade
      }
      else{
        timedDisplay("Already have that grade")
        return

      }

  }

} , document.getElementById(`confirm`).addEventListener('click', confirmFunction = ()=>{
  if( amount === clickedAmount){
    let obj = Object.keys(clickedGrades)
   
    if(amount === obj.length)
    resolve()
  }
  else{timedDisplay('click more sb')}
  //comeback
  }
  
  ))

).then(()=>{
  // set hand as useref to allow new cards to be guardesd with
  document.getElementById(`abilityZone`) .removeEventListener("click", sb)
 
  document.getElementById(`confirm`).removeEventListener("click", confirmFunction)
  let temp = Array.from(document.getElementById(`abilityZone`).children)
  for (let i =  newSoul.length -1; i >= 0; i--){
 
    if(temp[i].style.border === blueBorder){

       let card = newSoul[i]

      card.state = 'soulBlasted'
      removeById(soul , card.id)
      userZones.drop.push(card)

    }
 
}
setUserZones({...userZones })

})

}

 

function intercept(unit){
  let circle = unit.circle
  unit.state = 'intercepts'
  unit.place = 'GC'
  
  userCircles.userGC.guardians.push(unit)
  userCircles[circle].unit = null
}


async function endOfBattle(){
//setState = endofbattle
playerObjects.current.turnState = 'endOfBattle' //prevent attack event isteners hile doing bility
turnState.current.state = 'endOfBattle'
turnState.current.event = 'endOfBattle'
setShowInfo(false)

let boostingIds = currentBattle.current.boostingIds
let attackingIntervals = currentBattle.current.attackingIntervals

setUserUnitPower(0)
setOpponentUnitPower(0)


for(let i = 0;i<boostingIds.length;i++){
 boostingIds[i].removeFunct()
}


await endBattleFunctioner() //add to abilitylist

await searchAbilities()
await waitAbilities()





socket.emit('fightUpdate', { roomId :roomID,  command:'endOfBattle', item :{}})

//remove battle eventlistner

let defendingKeys = Object.keys(currentBattle.current.defendingUnits)
let battleUnits = [currentBattle.current.attackingUnit.circle , 
  ...defendingKeys
]
unhighlightOpponentCircles()
unhighlightUserCircles()
//reset currentbattle
currentBattle.current = {
  "attackingUnit" : null, 
  "defendingUnits" : null,
  "boostingUnits" : [],
  "boostingIds":[],
  "attackingUnitType" : null,
  "defendingUnitType" : null, //object where {circle.id: card.unittype}
  "guardRestrict" : false,
  "restrictFunction" :  null , 
  'revealedUnits' : []
}

playerObjects.current.attacking = false
turnState.current.state = 'battle'


let remainingStand = await searchCircles(standUnits())
if(remainingStand.length > 0){
  document.getElementById('userCircles').addEventListener('click', Listeners.current.battleCircle)
}

}




async function unhighlightCurrentBattle(arr){
  //attackingunit
   let attackImg = await getUnitImg(arr[0])

  attackImg.style.border = null
for(let i =1; i<arr.length; i++){ //defendingunits
  let circleId = arr[i].replace('user' , 'opponent')

 
  let img = await getUnitImg(circleId)
  img.style.border = null
 
}
}

async function endTurn(){//do trigger power
  //unlock if canUnlock
  playerObjects.current.turnState = 'endOfTurn'

  setPhase('end')
  playerObjects.current.phase = 'end'
  await endTurnFunctioner() //add to abilitylist

  await searchAbilities()
  await waitAbilities()
  setPlayerTurn(false)
  playerObjects.current.yourTurn = false
   playerObjects.current.turnState = ''
  await searchAbilities()
  await waitAbilities()
  setPopup(false)
  playerObjects.current.attacksThisTurn = 0
  playerObjects.current.ordersPlayedAmount = 0

  turnCount.current++;
  let thisTurns = Object.keys(thisTurn.current)
  thisTurns.forEach((key)=>{
    thisTurn.current[key] = false
  })
  socket.emit('fightUpdate', { roomId :roomID,  command:'updateTurn', item :{turnCount: turnCount.current}})
}

function highlight(element , style){
 
element.style.border = style

}

async function rest(unit){//pass event
 // do getelementid
 if(!unit){return}
 let circle = unit.circle
 //do check if rotate= 90
 

 if(circle == (null || undefined)){return}
 let img = await getUnitImg(circle)

rotateImg(img , 'rotate(90deg)')


socket.emit('fightUpdate', { roomId :roomID,  command:'updateUnit', item : {circle : circle , orientation: 'rotate(90deg)'}})

if(unit !== null){

if(circle.includes('F') || circle.includes('VG')){

unit['canAttack'] = false
unit['canBeBoosted'] = false

}

if(unit.skill == " Boost"   ){
 unit['canBoost'] = false
}
unit.stand = false
} 

 setUserCircles({...userCircles})

   // userCircles[element.id].rearguard['state'] = 'rest'
//rotate90

//fix checks, fix sending rest, send circle id and rest on opponent side

}

async function standAllStandPhase(){
  let circles = Object.values(userCircles)
  let ids = Object.keys(userCircles)
  
  for (let i = 0; i<circles.length -1;i++){
    let unit = circles[i].unit
    if( unit!== null){
      if(unit.standInStand === true){
        stand(unit)
      }
      
    }
        
 

  }

}

function rotateImg(img , rotation){

  img.style.transform = rotation;
}

async function stand(unit){ //take in unit as well
  if(!unit){return}
  let circle = unit.circle
  //do check if rotate= 90
  

  if(circle == (null || undefined)){return}
  if(turnState.current.ability.text){
    turnState.current['stand'] = true
  }

  let img = await getUnitImg(circle)

 rotateImg(img , 'rotate(0deg)')

 socket.emit('fightUpdate', { roomId :roomID,  command:'updateUnit', item : {circle : circle , orientation: 'rotate(0deg)'}})

 
if(unit !== null){

if(circle.includes('F') || circle.includes('VG')){
 
 unit['canAttack'] = true
 unit['canBeBoosted'] = true
}

if(unit.skill == " Boost"   ){
  unit['canBoost'] = true
}
unit.stand = true
} 

  setUserCircles({...userCircles})
 
  }
async function switchWithinRow(){
  await new Promise(resolve =>{
    document.getElementById('userCircles').addEventListener('click' , async  ()=>{
   let circle = await getCircle(event)
   let img = await getUnitImg(circle.id)
   if(!img){return}
   highlight(img , blueBorder)
      let circles = {
        'userBCRG' : ['userBLRG' , 'userBRRG'], 
        'userBLRG' : ['userBCRG' , 'userFLRG','userBRRG'], 
        'userBRRG' : ['userFRRG' , 'userBCRG','userBLRG'], 
        'userFRRG' : ['userBRRG','userFLRG'], 
        'userFLRG' : ['userBLRG','userFRRG'], 
      }
      let otherCircles = circles[circle.id]
      
      let switchFunc = async ()=>{
        let otherCircle = await getCircle(event)
        
        switchRG(circle.id, otherCircle.id)
        for(let i =0;i<otherCircles.length;i++){
          document.getElementById(otherCircles[i]).removeEventListener('click' , switchFunc)
        }
        if(img){
          highlight(img , null)
        }
        
      }
      
      for(let i =0;i<otherCircles.length;i++){
        document.getElementById(otherCircles[i]).addEventListener('click' , switchFunc)
      }




    }, {once:true})    
      })
}

 

async function mainPhaseSwitch(){
//click unit -> get other  unit -> do switch rg
//make frontrowplace and backrow place
//change canattack to canattack from backrow-> in attackstep if canattack from backrow can attakc = true
//do hasintervept and canintercept
//make tutorial that shows tips based on turnstate
await new Promise(resolve =>{
  document.getElementById('userCircles').addEventListener('click' , async  ()=>{
 let circle = await getCircle(event)
    if (circle.id ===  'userVG' || circle.id === 'userBCRG'){
      return
    }
    let otherCircle

    let otherId
    if(circle.id.includes('F')){
       otherId = circle.id.replace('F' , 'B')
      otherCircle = userCircles[otherId]
    }
    else{
       otherId = circle.id.replace('B' , 'F')
      otherCircle = userCircles[otherId]
    }
    let firstCircle = userCircles[circle.id]
    
    switchRG(circle.id, otherId)
  }, {once:true})    
    })
}

async function switchRG(id1, id2){
let circle1 = userCircles[id1]
let circle2 = userCircles[id2]
let unit1 = circle1.unit
let unit2 = circle2.unit
let temp = circle1.unit

if(unit1){
 if (unit1.cannotBeMovedTo.includes(id2)) {
  timedDisplay(unit1.name + ' Cannot be Moved to there')
  return
 }
}
if(unit2){
  if (unit2.cannotBeMovedTo.includes(id1)) {
   timedDisplay(unit2.name +' Cannot be Moved to there')
   return
  }
 }
circle1.unit = circle2.unit
 

circle2.unit = temp
 
if(unit1){
   unit1.circle = id2

}
if(unit2){
  unit2.circle = id1

}
setUserCircles({...userCircles})
}


async function getBoostCircle(unit){//highlight booasing units -> if unit.boosting and highlighted do boostfunction on unit and attakcingunit

let attackingCircle  = unit.circle 
let boostingCircle 
let boostingListener
if(attackingCircle === 'userVG'){ //add additional accel rg here
  boostingCircle = 'userBCRG'
}
else{
  boostingCircle = attackingCircle.replace('F' , 'B')
}
 
let otherUnit = userCircles[boostingCircle].unit

document.getElementById(boostingCircle).addEventListener('click' , boostingListener = async function (){
  //do getunit
  let circle =  await getCircle(event)
  if(!otherUnit||  !otherUnit.canBoost){
    return
  }
 
  highlight( await getUnitImg(circle.id), redBorder)
} , {once:true})
let obj = {
  circle: boostingCircle ,
  listener : boostingListener
}
return  obj
 
}
async function attackStep(unit ){
  unit.state = 'beforeAttack'
  //maybe searchabilities here
  let defendingUnits = []
  //do battle logic, increase number of battles this turn
  let attacking = (async ()=>{return await getAttackFunction(unit)})// highlight units to arrack
   //rest unit  do check on number of targets
   //defedingunita
   let oppCircles = await searchCircles(basicPropertyArray , 'opponent')

   if(unit.cannotAttack[0] === oppCircles[0]){
    timedDisplay('No Attack Targets');
    playerObjects.current.attacking = false
    return []
   }
   await new Promise(async (resolve) =>{
    await attacking()

    resolve()
   }).then(async()=>{ //add highlighted units to defendingunits

    let opponentFrontRow = document.getElementById('opponentFrontRow')
    let opponentBackRow = document.getElementById('opponentBackRow')
    //stands all units
    for(let i = 0; i<opponentFrontRow.children.length; i++){

      let circleId = opponentFrontRow.children[i].id
      
      let circle = opponentFrontRow.children[i]
 

      if(circle.children[0] !== (null|| undefined)){//check if unit on circle
        //check if highlighted
        let img = await getUnitImg(circle.id)
  
        if(img.style.border === redBorder){//check if unit on circle
          //check if highlighted
            defendingUnits.push(currentOpponentCircles.current[circleId].unit)
        }
      }


    }
 
    for(let i = 0; i<opponentBackRow.children.length; i++){
 
      let circleId = opponentBackRow.children[i].id
      let circle = opponentBackRow.children[i]
 
      if(circle.children[0] !== (null|| undefined)){//check if unit on circle
        //check if highlighted
        let img = await getUnitImg(circle.id)
 
        if(img.style.border === redBorder){//check if unit on circle
          //check if highlighted
            defendingUnits.push(currentOpponentCircles.current[circleId].unit)
        }
      }

    }

   })
   //if highlighted push to defendingunits
    //set attackingunit state = beforeAttack, searchabilities
   

  //set attackingunit state to attacks do ability check
   return defendingUnits
  }
  
    
  // async function guardStep(defendingUnits, isAttacking, guardRestrict = false){
  async function guardStep(isAttacking = false){
  //await guardians
  if(isAttacking){
    //send defendingunits and wait
    //check guard restrict
    socket.emit('fightUpdate', { roomId :roomID,  command:'guardStep', item : defendingUnits
     })

  }
  else{

    //alter currentBattle
    
    let defending = Object.values(currentBattle.current.defendingUnits)
    let boosting = currentBattle.current.boostingUnits
    setShowInfo(true)
    let oppCircle = currentBattle.current.attackingUnit.circle.replace('user' , 'opponent')
    let attacking = currentBattle.current.attackingUnit

    let img = await getUnitImg(oppCircle)
    highlight(img , redBorder)
  
   // rest(attacking)
    for(let i =0;i<defending.length;i++){
      let circle = defending[i].circleId
      let unit = userCircles[circle].unit
      unit.state = 'attacked'
      unit['beingAttacked'] = true
      let img = await getUnitImg(circle)
      highlight(img , redBorder)

    }
    for(let i =0;i<boosting.length;i++){
      let circle = boosting[i].circle.replace('user' , 'opponent')
      let unit = currentOpponentCircles.current[circle]
      let img = await getUnitImg(circle)
      highlight(img , redBorder)

    }
await searchAbilities()
await waitAbilities()

    await newGuard()
    //setPopup(true )
  }


  //check if attacking or defending
  }
  async function canGuardHandler(unit){//change if guard restrict
 
  //do unit.guardians
  let restrictFunc = (arr)=>{return true}
  let additional 
  if(currentBattle.current.guardRestrict){
    restrictFunc = getGuardRestrict(currentBattle.current.guardRestrict)
    additional = currentBattle.current.guardRestrictAdditional  
  }
  let guardianArray = unit.guardians
  let fromHand = guardianArray.filter((card)=>card.previousArea === 'hand')

  let canGuard = await restrictFunc(fromHand, additional)
  return canGuard
  } 
 async function canGuard(defendingArray ){
  let count = 0
 
  for(let i = 0; i<defendingArray.length; i++){
      let check = await canGuardHandler(defendingArray[i])
      if(check === true){count ++}
  }
  if(count === defendingArray.length){return true}
  return false
 }

async function lastGuard(defendingArray){//set interbal fir guardians
 
  for(let i = 0; i<defendingArray.length; i++){
    let guardians = defendingArray[i].guardians
    for(let j = 0; j<guardians.length; j++){
     let card = guardians[j]
     if (card.place === 'hand' ){
      card.state = 'placed'
     }
     card.place = 'GC'

     userCircles.userGC.guardians.push(card)



     //do reset unit after damage step
  
  }
  let circle = defendingArray[i].circleId

  let unit = userCircles[circle].unit

  defendingArray[i].unitPower = unit.tempPower
}


await searchAbilities()
await waitAbilities()
 

//send do damage step
//incase of new shield values do this again
for(let i = 0; i<defendingArray.length; i++){
  let guardians = defendingArray[i].guardians
  let shieldValue = defendingArray[i].shieldValue
  shieldValue = 0
  for(let j = 0; j<guardians.length; j++){
   let card = guardians[j]
 
   shieldValue += card.tempShield
   //do reset unit after damage step

}

setUserCircles({...userCircles})
}




}

  async function newGuard(){
       //defendingunits=  {circleid:{id : '' , guardains:[]} , circleid:{id : '' , guardains:[]}}
       let defendingUnits = currentBattle.current.defendingUnits

       
       let defendingArray = Object.values(defendingUnits)
       let circleArray = Object.keys(defendingUnits)
       let defaultUnit = defendingArray[0]
       unitPower( defaultUnit.unitPower, currentBattle.current.attackingUnit.tempPower)
    let intercepting
       let circleListener 
       let handListener 
       let zoneListener 
       let confirmListener 

       let currentCircle = circleArray[0] //onclick circle change this
       setConfirm(true)
       setShowZone(true)

       setZone(defaultUnit.guardians)
       //await for zone to show
       document.getElementById(`userCircles`) .addEventListener('click' , intercepting = async (event)=>{
        //highlight and add highlighted
        let circle = await getCircle(event)
        if(circle.id === 'userVG'){return}
        let img = await getUnitImg(circle.id)
        let card = userCircles[circle.id].unit
           if( userCircles[circle.id].unit )  
  
          
           if(img.style.border === redBorder){  return}
            if( card.canIntercept &&card.canInterceptCheck ){
              
                  
              defendingUnits[currentCircle].guardians.push(card)
              let cardShield = card.tempShield
              defendingUnits[currentCircle].shieldValue += cardShield
              card.state = 'intercepts' 
                card.place = 'GC'
 
              setUserUnitPower(defendingUnits[currentCircle].unitPower + defendingUnits[currentCircle].shieldValue)
 
                  //click on card put in showzone, in showzone on lcick if prevarea not hand put back on circle
               userCircles[circle.id].unit = null
              setUserCircles({...userCircles})
                }
            
                })



       await new Promise(resolve =>{
        setTimeout(()=>{
          if(document.getElementById('zoneExpand') && document.getElementById('confirm')){
            //addevent listener then resolce
            document.getElementById('zoneExpand').addEventListener('click',Listeners.current.zoneGuardListener = function(){
              if(event.target.closest('.card') ){//click on image
                let index = Array.from(document.getElementById(`zoneCards`).children).indexOf(event.target.closest('.card'))
 
                let card = defendingUnits[currentCircle].guardians[index]
 
              if(card.place !== 'GC'){return}
              card = defendingUnits[currentCircle].guardians.splice(index, 1)[0]
                if(!card.circle){
                userZones.hand.push(card)
                let cardShield = card.tempShield
                defendingUnits[currentCircle].shieldValue -= cardShield
 
                card.state = ''
                card.place = 'hand'
}
                 else{

                    userCircles[card.circle].unit = card
                    let cardShield = card.tempShield
                    defendingUnits[currentCircle].shieldValue -= cardShield
                    card.state = ''
                    card.place = 'RG'
}
setUserUnitPower(defendingUnits[currentCircle].unitPower + defendingUnits[currentCircle].shieldValue)
setZone(defendingUnits[currentCircle].guardians)
setZoneName('user GC')
setUserCircles({...userCircles})
              } 
            })

            document.getElementById('userHand').addEventListener('click', handListener = ()=>{//check if not an order
              if(event.target.closest('.card') ){//click on image
//array.from 
                let index = Array.from(document.getElementById(`userHand`).children).indexOf(event.target.closest('.card'))
                let card = userZones.hand.splice(index, 1)[0]
 
                defendingUnits[currentCircle].guardians.push(card)
                let cardShield = card.tempShield
                defendingUnits[currentCircle].shieldValue += cardShield
                card.state = 'placed' //what if card has gc -> grade + 1 for guard restrict
                card.place = 'GC'
                
                setUserUnitPower(defendingUnits[currentCircle].unitPower + defendingUnits[currentCircle].shieldValue)
                //add it to guardians
                //do shield add
              } 
            })
            document.getElementById('confirm').addEventListener('click' , confirmListener = async ()=>{
              let confirmation = await canGuard(defendingArray) // change guardrestrict
              if (confirmation === true) {
               //let all abiliries activate. make all gc units on placed
               document.getElementById('userHand').removeEventListener('click' , handListener)
               document.getElementById('userCircles').removeEventListener('click' , intercepting)
               if(document.getElementById('zoneExpand')){document.getElementById('zoneExpand').removeEventListener('click' , Listeners.current.zoneGuardListener);Listeners.current.zoneGuardListener = null}
               document.getElementById('confirm').removeEventListener('click' , confirmListener)
               for(let i = 0;i<defendingArray.length; i++){
                  let id = document.getElementById(circleArray[i])
                  id.removeEventListener('click' , circleListener)
              }


               await lastGuard(defendingArray)
                // opponentsends this
               socket.emit('fightUpdate', { roomId :roomID,  command:'guardians', //add show increase in unit power circles so attacking player can see which cards are guarding wich
                item :{defendingUnits : defendingUnits , units: {   opponentUnitPower : opponentUnitPower.current  , userUnitPower: userUnitPower.current }  } })


              //await somefuard -> set state. add all units tp gc, await abilitiessearchimgieofmn;ag
              //handle intercepts
              //semd guardianms
              setShowZone(false)
            }
            else{
              timedDisplay('Cannot Guard')//use guardrestrict message
              // document.getElementById('confirm').addEventListener('click' , confirmListener, {once:true})
            }
          } )
            resolve()
          }
        })
       })
       for(let i = 0;i<defendingArray.length; i++){//set show zone to tempguardians
          //alternative addeventlistener to userCircles and check onclick if border === red
            let id = document.getElementById(circleArray[i])
            id.addEventListener('click' , circleListener = ()=>{//do confirm onclick check if all tempguard are allowed
            //set tempguardians = id.guardians
            //make new array of tempguardian elements       
            //do if click on circle or card
            let circleId
            if(event.target.closest('.unit')){
              circleId = event.target.closest('.unit').parentNode.id
            } 
            else{
              circleId = event.target.id
            }   
   
            currentCircle = circleId
            setShowZone(true)
            setZone(defendingUnits[currentCircle].guardians)
            setZoneName('user GC')
            setUserUnitPower(defendingUnits[currentCircle].unitPower + defendingUnits[currentCircle].shieldValue)

            })
       }

  }


//make custom attack functions for each unit here
async function normalAttack(){

  let opponentUnits  = document.getElementById('opponentFrontRow')

  let target
  
  //only resolve promise if unit.canbeattacked if no unit can be attacked resolve before selection
  await new Promise(resolve => opponentUnits.addEventListener('click' , target = async ()=>{
    
    let unit = await getOpponentUnit(event)

    let circle = await getCircle(event)
    let img = await getUnitImg(circle.id)
    if(unit !== (null || undefined)){
      if(unit.canBeAttacked === true){
        //push to defending units 
          //highlight unit
 
          highlight(img , redBorder)
          opponentUnits.removeEventListener('click' , target )
        resolve()
      }
      
    }


  })   //if onclick unit.canbeattacked remove eventlistener then return

   )

 
}
async function waitElementId(id){
  return   await new Promise(resolve =>{
    setTimeout(()=>{
      if(document.getElementById(id)){resolve()}
    })
  })
}

async function allUnitsAttack(){

  let opponentUnits  = document.getElementById('opponentCircles')

  let target
  
  //only resolve promise if unit.canbeattacked if no unit can be attacked resolve before selection
  await new Promise(resolve => opponentUnits.addEventListener('click' , target = async ()=>{
    
    let unit = await getOpponentUnit(event)

    let circle = await getCircle(event)
    let img = await getUnitImg(circle.id)
    if(unit !== (null || undefined)){
      if(unit.canBeAttacked === true){
        //push to defending units 
          //highlight unit
          opponentUnits.removeEventListener('click' , target )
          highlight(img , redBorder)
        resolve()
      }
      
    }


  })   //if onclick unit.canbeattacked remove eventlistener then return

   )

 
}




async function testAttack(){//vanquisher for vanaquisher dont let target vg
  
  let opponentUnits  =document.getElementById('opponentCircles')
  let amount  = 2
  let count = 0
  setConfirm(true)
  let target
  let confirmFunc
  //only resolve promise if unit.canbeattacked if no unit can be attacked resolve before selection
  await waitElementId('confirm')
  highlight(document.getElementById('opponentVG').children[0], redBorder)

  await new Promise(resolve => {
    document.getElementById('confirm').addEventListener('click', confirmFunc = ()=>{
      if(count <=amount){
        document.getElementById('confirm').removeEventListener('click', confirmFunc)
        opponentUnits.removeEventListener('click', target)

        resolve()
      }
     else{timedDisplay('Only attack 2 other units')}
    
    })
    
    
    opponentUnits.addEventListener('click' , target = async ()=>{
    let circle = await getCircle(event)
    let unit = opponentCircles[circle.id].unit
    
    //highlight vg 
    
    if(unit !== (null || undefined)){

      if(unit.canBeAttacked === true && unit.place !== 'VC'){ 

          //highlight unit
          let cardImage = circle.children[0]
     
          //if hightlighted, dehighlight else highlight
          if(cardImage.style.border === redBorder){
            highlight(cardImage , transparentBorder)
            count --
          }
          else{
            highlight(cardImage , redBorder)
            count ++
          }
        
      }
      
    }


})}   //if onclick unit.canbeattacked remove eventlistener then return

   )
}


async function attackFrontrow(){
  let opponentUnits  = document.getElementById('opponentFrontRow')
  let oppUnits = ['opponentFRRG' , 'opponentVG' , 'opponentFLRG']
  let target
  await new Promise(resolve => opponentUnits.addEventListener('click' , target = async ()=>{
    
    
    for(let i =0;i<oppUnits.length; i++)  {  
      let circle = oppUnits[i] 
      let unit = opponentCircles[oppUnits[i]].unit
     
   
    if(unit != (null || undefined)){
      

      let img = await getUnitImg(circle)
      if(unit.canBeAttacked === true){
        //push to defending units 
          //highlight unit
          opponentUnits.removeEventListener('click' , target )
 resolve()
          highlight(img , '0.3rem red solid')
       
      }
      
    }
}

  } , {once:true})   //if onclick unit.canbeattacked remove eventlistener then return

   )

 
}
async function attackColumn(){
  
  let opponentUnits  =document.getElementById('opponentCircles')
  setConfirm(true)
  let target
  let confirmFunc
 
  await waitElementId('confirm')
 

  await new Promise(resolve => {
    document.getElementById('confirm').addEventListener('click', confirmFunc = ()=>{
      if(1){
        document.getElementById('confirm').removeEventListener('click', confirmFunc)
        opponentUnits.removeEventListener('click', target)
        
        resolve()
      }
     else{timedDisplay('Only attack 3 units')}
    
    })
    
    
    opponentUnits.addEventListener('click' , target = async ()=>{
    let circle = await getCircle(event)
    let unit = opponentCircles[circle.id].unit
    let otherUnit
    let otherCircleId
    if(circle.id === 'opponentVG'){
      otherCircleId = 'opponentBCRG'
      otherUnit = opponentCircles['opponentBCRG'].unit

    }
    else if(circle.id === 'opponentBCRG'){
      otherCircleId = 'opponentVG'
      otherUnit = opponentCircles['opponentVG'].unit
  
    }
    else if(circle.id.includes('F')){
      let id = circle.id
       otherCircleId = id.replace('F', 'B')
   
    }
    else if(circle.id.includes('B')){
      let id = circle.id
    otherCircleId = id.replace('B', 'F')
      otherUnit = opponentCircles[otherCircleId].unit

    }

    if(unit !== (null || undefined)){
      //get other unit here and test both, if true highlight
      if(unit.canBeAttacked === true ){ 

          //highlight unit
          let cardImage = await getUnitImg(circle.id)

          //if hightlighted, dehighlight else highlight
          if(cardImage.style.border === redBorder){
            highlight(cardImage , transparentBorder)
 
          }
          else{
            highlight(cardImage , redBorder)
 
          }
        
      }
      
    }

    if(otherUnit !== (null || undefined)){
      //get other unit here and test both, if true highlight
      if(otherUnit.canBeAttacked === true ){ 

          //highlight unit
          let cardImage = await getUnitImg(otherCircleId)

          //if hightlighted, dehighlight else highlight
          if(cardImage.style.border === redBorder){
            highlight(cardImage , transparentBorder)
 
          }
          else{
            highlight(cardImage , redBorder)
 
          }
        
      }
      
    }
    document.getElementById('confirm').click()

})}   //if onclick unit.canbeattacked remove eventlistener then return

   )
}
async function attack3Units(){//vanquisher for vanaquisher dont let target vg
  
  let opponentUnits  =document.getElementById('opponentCircles')
  let amount  = 3
  let count = 0
  setConfirm(true)
  let target
  let confirmFunc
  //only resolve promise if unit.canbeattacked if no unit can be attacked resolve before selection
  await waitElementId('confirm')
 

  await new Promise(resolve => {
    document.getElementById('confirm').addEventListener('click', confirmFunc = ()=>{
      if(count <=amount){
        document.getElementById('confirm').removeEventListener('click', confirmFunc)
        opponentUnits.removeEventListener('click', target)

        resolve()
      }
     else{timedDisplay('Only attack 3 units')}
    
    })
    
    
    opponentUnits.addEventListener('click' , target = async ()=>{
    let circle = await getCircle(event)
    let unit = opponentCircles[circle.id].unit

    //highlight vg 
    
    if(unit !== (null || undefined)){

      if(unit.canBeAttacked === true ){ 

          //highlight unit
          let cardImage = await getUnitImg(circle.id)

          //if hightlighted, dehighlight else highlight
          if(cardImage.style.border === redBorder){
            highlight(cardImage , transparentBorder)
            count --
          }
          else{
            highlight(cardImage , redBorder)
            count ++
          }
        
      }
      
    }


})

}   //if onclick unit.canbeattacked remove eventlistener then return

   )
}


async function getAttackFunction(unit){

  //getunit
  //attack function returns an array of all defending units ids or circle ids
  let attackFunction = (async ()=>{await normalAttack()}) //normal attack , select 1 unit to attack
  unit.state = 'wouldAttack'
  if(unit.attackFunction !== null){
    attackFunction = unit.attackFunction 
    //do custom attack else do normal attack
  }
  return await attackFunction()
}

//break up attack and guartd to execute abilities

async function retireGC(){
 
  let card = userCircles.userGC.guardians.pop()

  let tempDrop =  userZones
  tempDrop.drop = [...tempDrop.drop , card]
 
   
  setUserZones(tempDrop)

await searchAbilities()
}

 

async function personaRide(){
  let frontRow =    Array.from(document.getElementById('userFrontRow').children)
  playerObjects.current.personaRide = true
 
await allOfYourUnits('persona' , frontrowUnits() , (card)=>{increasePower(card, 10000)}, (card)=>{increasePower(card, -10000)} )
 untilEndTurn(()=>{
 
  removeAllOfYourUnits('persona')
 } , userCircles.userVG.unit)


  draw()
//add remove function to endOfTurn
}

async function ride(cardToRide){
  let vg = userCircles.userVG.unit
  vg.state = 'rodeUpon'
  vg.place = 'soul'
  vg.circle = ''
  userZones.soul.push(vg) //addToSoul function

userCircles.userVG.unit = cardToRide
userCircles.userVG.unit.state = 'placed'
userCircles.userVG.unit.circle = 'userVG'
userCircles.userVG.unit.place = 'VC'
thisTurn.current['rode'] = true
stand(cardToRide)
console.log(userCircles.userVG.unit.state, userCircles.userVG.unit.name, turnState.current.event)
}

async function superiorRide(zone , propertyArray , func = (card)=>{}){
  display('Select a card to ride')
let toRide = await clickAbilityZone(zone ,1,  propertyArray,false)
let cardToRide = toRide.selected[0]

ride(cardToRide);
await removeById(zone, cardToRide.id)

func(cardToRide)


}
async function revolDress(){
   turnState.current.event = 'revolDress'
  await superiorRide(userZones.hand ,  nameIncludesX('RevolForm') , (card)=>{stand(card); increaseDriveEndTurn(card, -2)})

}
async function rideFromHand(){//do or propertyarray cjecl in array
  //extract grater than or equal to vanguard grade
  let previousVG = userCircles.userVG.unit
  let  unitsOnly = await searchZones(userZones.hand , unit())
  let propArr = orPropertyArray([[{cardProperty:'grade', propertyToFind: previousVG.grade + 1 , condition:'=' }] , [{cardProperty:'grade', propertyToFind: previousVG.grade , condition:'='}]])
 let card = await clickAbilityZone(unitsOnly, 1,propArr, false)
//click ability zone getcaard idecard removeby cardid 
if(card.selected.length === 0){return}
let cardToRide = card.selected[0]
turnState.current.event = 'normalRide'
ride(cardToRide)
await removeById(userZones.hand ,cardToRide.id)

    if(previousVG.name  === cardToRide.name && previousVG.specialicon === 'Persona Ride' && cardToRide.specialicon === 'Persona Ride'){
      await personaRide()
    }
    closeAbilityZone()
 //else

continuousFunctioner()
setShowAbilityZone(false)
setUserCircles({...userCircles})
for(let i = 0; i< newDeck.RideDeck.length; i++){
  await searchCardAbilities(newDeck.RideDeck[i])
 
}
 
await searchAbilities()
await waitAbilities()
closeAbilityZone()
}

async  function rideFromRideDeck(){
 
  if(newDeck.RideDeck.length === 0 || newDeck.RideDeck[newDeck.RideDeck.length-1] == null){timedDisplay('no more ride deck'); return}
  await discard(1)
  // let cardToDiscard = await new Promise(resolve => document.getElementById(`userHand`) .addEventListener("click", resolve));
  closeAbilityZone()
  // let card = userZones.hand.splice(Array.from(document.getElementById(`userHand`)).indexOf(event.target.closest('.card')) , 1)[0]
  // userZones.drop.push(card)
 
  userCircles  [`user` + "VG"].unit['state'] = 'rodeUpon'
 userZones.soul.push(userCircles[`user` + "VG"].unit)

 
  userCircles  [`user` + "VG"].unit = newDeck.RideDeck.pop( ) 
 userCircles  [`user` + "VG"].unit['state'] = 'placed'
 userCircles  [`user` + "VG"].unit['place'] = 'VC'
 userCircles  [`user` + "VG"].unit['circle'] = 'userVG'
  //setUserZones({...userZones})
  setPopup(false)
//
setUserCircles({...userCircles})
continuousFunctioner()
for(let i = 0; i< newDeck.RideDeck.length; i++){

  await searchCardAbilities(newDeck.RideDeck[i])
 
}
 
//   setPhase('main')

await searchAbilities()
await waitAbilities()
//change to main from field
// document.getElementById('wait').click()

 }




async function discard(amount, propertyArray = basicPropertyArray, upTo = false , clickedProperty = '', ){ 
  display('Discard ' + amount)
  let obj =  await clickAbilityZone( userZones.hand, amount , propertyArray, upTo, clickedProperty) //make discardbvalue 
  //do something for rideDeck
  await addToZone(userZones.hand , userZones.drop , obj.selected, 'hand' , false,'discarded' )

   setUserZones({...userZones})

  return obj.notSelected 


} 

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//- search zones 
//search zone length
async function searchZones(zone , propertyArray = basicPropertyArray){
  if(!zone){return []} 
  let newArr = []

  let check = searchUnit
  if(propertyArray[0].or){
    check = searchUnitOr
  }

  for(let j = 0; j<zone.length; j++){
    let card = zone[j]
    if(check(card , propertyArray)){
      newArr.push(card)
    }
    
  }
  return newArr

}

async  function searchZonesHandler(zoneToSearch , cardProperty, propertyToFind, condition ){
let tempArray = []
let idArray = []

 
 
for(let i = 0; i<zoneToSearch.length ; i++){
  if(searchOperators[condition](zoneToSearch[i][cardProperty] , propertyToFind) == true){
 
    tempArray.push(zoneToSearch[i])//push object containing card an cardindex
    idArray.push(i)
  }

}

let final = {
  cards : tempArray , 
  ids : idArray
}
 

return   final
//perhaps add index to card properties
//for multiple properties run once then check if newArray != [], if not run for next property
}

async function findHowManyCards(zone , propertyArray = basicPropertyArray, propertyValue = ''){
 
  let results = await searchZones(zone , propertyArray )
  //come back and redo for regarded units
  let value = 0
 
  for(let i = 0; i<results.length; i++){
    if(results[i].altValue){
      value += results[i][results[i].altValue]
   
    }
    else value ++
    
  }


  return value
}


//helper fucntions
async function buttonChanger(buttonState){
  let  buttons = document.getElementById('turn-buttons').querySelectorAll('button');

 
    buttons.forEach((button) => {
  
    button.disabled =  !buttonState;

    //either true or false
  });

}

//make a function to addeventlistener
//do turn state, if searching rightclick toggles between zoneExpand and field
async function getUserUnit(e){// rg parameter rg = false , function paramater, before return eg (()=>{if userVG alert, return})
  
  //get unit from event .target
  let circle = await getCircle(e)
 

let unit = userCircles[circle.id].unit
  return unit

}

async function getOpponentUnit(e){// rg parameter rg = false , function paramater, before return eg (()=>{if userVG alert, return})
  
  //get unit from event .target
  let circle = await getCircle(e)
 

let unit = opponentCircles[circle.id].unit
  return unit

}

async function getCircle(e){//return dicument circle
let circle 
  
if(e.target.closest('.card') ){ //if clicking on img
 
  circle =  e.target.closest('.card').parentNode

}
else{//if clicking on circle
  circle =  e.target

}

return circle
}


async function getUnitImg(circle){
 let ele =  document.querySelector( `#${circle} .unit`)
 
  let img  = ele.children[0]
  
  return img 
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//battle functions
async function onHit( func = async ()=>{return }) {
//when currentBattle.current.unitsUnit.length > 0 ; 
let unitsHit = currentBattle.current.unitsHit
for(let i = 0;i<unitsHit.length; i++){
  await func()
}

}

async function attackHit(){

  if( currentBattle.current.unitsHit.length > 0){
    return true
  }
  return false

}

 

async function guardRestrictEndBattle(unit , key, additional = {}){
let guardRestrict = getGuardRestrict(key, additional)
currentBattle.current.guardRestrict = key
currentBattle.current['guardRestrictAdditional'] = additional
untilEndBattle(removeGuardRestrict , unit , 'user')
}

async function guardRestrictEndTurn(unit , key, additional = {}){
  let guardRestrict = getGuardRestrict(key, additional)
  currentBattle.current.guardRestrict = key
  currentBattle.current['guardRestrictAdditional'] = additional
  untilEndTurn(removeGuardRestrict , unit , 'user')
}

 function getGuardRestrict(key, additional = {}){
 let restricts = {
  'twoOrMore' : function (arr){
    if(arr.length <2){return false}
    return true
  },
  'threeOrMore' : function (arr){
    if(arr.length <3){return false}
    return true
  },
  'noSentinels' : function(arr){
    let cards = arr.filter((card)=> card.sentinel === true)
    if(cards.length !== 0){return false }
    return true
  },
  'withoutSentinel3Grades' : function (arr){//come back

  },
  'grade1orGreater' : function (arr){
    let cards = arr.filter((card)=> card.tempGrade <1)
    if(cards.length !== 0){return false }
    return true
  },
  'noNormalUnits' : function (arr){
    let cards = arr.filter((card)=> card.cardtype === 'Normal Unit')
    if(cards.length !== 0){return false }
    return true
  },
  'noTriggerUnits' : function (arr){
    let cards = arr.filter((card)=> card.cardtype !== 'Trigger Unit')
    if(cards.length !== 0){return false }
    return true
  },
  'cannotCall' : function (arr){
    if(arr.length < 0){return false}
    return true
  },
  'withoutChosenGrade' : function (arr, additional= {}){
    let cards = []
 
    for(let i =0;i<arr.length; i++){
      let grade = arr[i].tempGrade
      if(additional[grade]){
        cards.push(arr[i])
      }
    }
    if(cards.length !== 0){return false }
    return true
  }
 } 


return restricts[key]

}

async function removeGuardRestrict(){
currentBattle.current.guardRestrict = null
}

function giveTripleDrive(unit){
//give skill tripledriv e and boost and intercept
//unit.drive = 3
let tempDriveIncrease = 3 - unit.drive
unit.tempDrive += tempDriveIncrease
}
function giveTripleDriveEndTurn(unit){
 giveTripleDrive(unit)
  untilEndTurn((unit)=>{
  unit.tempDrive = unit.drive 
  }
  , unit, undefined)
}

function giveBoostEndTurn(unit){
  giveBoost(unit)
  untilEndTurn(()=>{removeBoost(unit)} , unit)
}

function giveBoost(unit){
  unit.canBoost = true
}

function removeBoost(unit){
  unit.canBoost = false
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//propertyarray functions
function newPropertyArray(arr){
  let newArr = [].concat(...arr) 


  return newArr
 
}
function orPropertyArray(arr){
  let newProp = newPropertyArray(arr)
  newProp[0]['or']= true
  return newProp
}
function otherRearguard(unit){
  return  [{"cardProperty" :  'place' , "propertyToFind": 'RC' , "condition": '='} , {"cardProperty" :  'id' , "propertyToFind": unit.id , "condition": '!='}]
 }
function rearguard(){
  return  [{"cardProperty" :  'place' , "propertyToFind": 'RC' , "condition": '='}]
 }
 function vanguard(){
  return  [{"cardProperty" :  'place' , "propertyToFind": 'VC' , "condition": '='}]
 }
 function frontrowRearguards(){
  return  [{"cardProperty" :  'circle' , "propertyToFind": 'F' , "condition": 'includes'} , {"cardProperty" :  'place' , "propertyToFind": 'RC' , "condition": '='}]
 }
 function frontrowUnits(){
  return  [{"cardProperty" :  'circle' , "propertyToFind": 'userFRRG userVG userFLRG' , "condition": 'or'} ,]
 }
 function backrowRearguards(){
  return  [{"cardProperty" :  'circle' , "propertyToFind": 'B' , "condition": 'includes'} , {"cardProperty" :  'place' , "propertyToFind": 'RC' , "condition": '='}]
 }
 function unit(){
  return  [{"cardProperty" :  'cardtype' , "propertyToFind": 'Unit' , "condition": 'includes'} ]
 }
 function normalUnit(){
  return  [{"cardProperty" :  'cardtype' , "propertyToFind": 'Normal Unit' , "condition": 'includes'} ]
 }
 function triggerUnit(){
  return  [{"cardProperty" :  'cardtype' , "propertyToFind": 'Trigger Unit' , "condition": 'includes'} ]
 }
 function name(name){
  return  [{"cardProperty" :  'name' , "propertyToFind": name , "condition": '='} ]
 }
 function idIsX(id){
  return  [{"cardProperty" :  'id' , "propertyToFind": id , "condition": '='} ]
 }
 function grade0(){
  return  [{"cardProperty" :  'grade' , "propertyToFind": 0 , "condition": '='} ]
 }
 function grade0OrGreater(){
  return  [{"cardProperty" :  'grade' , "propertyToFind": 0 , "condition": '>='} ]
 }
 
 function grade1(){
  return  [{"cardProperty" :  'grade' , "propertyToFind": 1 , "condition": '='} ]
 }
 function grade1OrLess(){
  return  [{"cardProperty" :  'grade' , "propertyToFind": 1 , "condition": '<='} ]
 }

 function grade1OrGreater(){
  return  [{"cardProperty" :  'grade' , "propertyToFind": 2 , "condition": '>='} ]
 }
 function grade2(){
  return  [{"cardProperty" :  'grade' , "propertyToFind": 2 , "condition": '='} ]
 }
 function grade2OrLess(){
  return  [{"cardProperty" :  'grade' , "propertyToFind": 2 , "condition": '<='} ]
 }
 function grade2OrGreater(){
  return  [{"cardProperty" :  'grade' , "propertyToFind": 2 , "condition": '>='} ]
 }
 function grade3(){
  return  [{"cardProperty" :  'grade' , "propertyToFind": 3 , "condition": '='} ]
 }
  function grade3Rearguards(){
  return  [{"cardProperty" :  'grade' , "propertyToFind": 3 , "condition": '='} ,{"cardProperty" :  'place' , "propertyToFind": 'RC' , "condition": '='}]
 }
 function grade3OrLess(){
  return  [{"cardProperty" :  'grade' , "propertyToFind": 3 , "condition": '<='} ]
 }
 function orders(){
  return  [{"cardProperty" :  'cardtype' , "propertyToFind": 'Order' , "condition": 'includes'} ]
 }
 function units(){
  return  [{"cardProperty" :  'cardtype' , "propertyToFind": 'Unit' , "condition": 'includes'} ]
 }
 function sentinel(){
  return  [{"cardProperty" :  'sentinel' , "propertyToFind": true , "condition": '='} ]
 }
 function normalOrder(){
  return  [{"cardProperty" :  'cardtype' , "propertyToFind": 'Normal Order' , "condition": 'includes'} ]
 }
 function setOrder(){
  return  [{"cardProperty" :  'cardtype' , "propertyToFind": 'Set Order' , "condition": 'includes'} ]
 }
  function gem(){
  return  [{"cardProperty" :  'cardtype' , "propertyToFind": 'Gem' , "condition": 'includes'} ]
 }
  function isOverDress(){
  return  [{"cardProperty" :  'isOverDress' , "propertyToFind": true , "condition": '='} ]
 }
 function meteorite(){
  return  [{"cardProperty" :  'cardtype' , "propertyToFind": 'Meteorite' , "condition": 'includes'} ]
 }
 function arms(){
  return  [{"cardProperty" :  'cardtype' , "propertyToFind": 'Arm' , "condition": 'includes'} ]
 }
 function armed(){
  return  [{"cardProperty" :  'arms' , "propertyToFind": undefined , "condition": '!='} ]
 }
 function world(){
  return  [{"cardProperty" :  'cardtype' , "propertyToFind": 'World' , "condition": 'includes'} ]
 }
 function shadowArmy(){
  return  [  {"cardProperty": "name", "propertyToFind": "Shadow Army", "condition": "="}, ]
 }
 function imprisoned(){
  return  [{"cardProperty" :  'imprisoned' , "propertyToFind": true , "condition": '='} ]
 }
 function earnescorrect(){
  return  [  {"cardProperty": "name", "propertyToFind": "Earnescorrect", "condition": "includes"}, ]
 }
 function earnescorrectRG(){
  return  [  {"cardProperty": "name", "propertyToFind": "Earnescorrect", "condition": "includes"}, {"cardProperty" :  'place' , "propertyToFind": 'RC' , "condition": '='}]
 }
 function amidamaru(){
  return  [  {"cardProperty": "name", "propertyToFind": "Amidamaru", "condition": "includes"}, ]
 }
 function amidamaruRG(){
  return  [  {"cardProperty": "name", "propertyToFind": "Amidamaru", "condition": "includes"}, {"cardProperty" :  'place' , "propertyToFind": 'RC' , "condition": '='}]
 }
 function blaster(){
  return  [  {"cardProperty": "name", "propertyToFind": "Blaster", "condition": "includes"},]
 }
 function blasterRG(){
  return  [  {"cardProperty": "name", "propertyToFind": "Blaster", "condition": "includes"}, {"cardProperty" :  'place' , "propertyToFind": 'RC' , "condition": '='}]
 }
 function hasOverDressAbility(){
   return  [{"cardProperty" :  'hasOverDress' , "propertyToFind": true , "condition": '='} ]
 }
 function searchId(id){
  return  [{"cardProperty" :  'id' , "propertyToFind": id , "condition": '='} ]
 }
 function  nameIncludesX(x){
  return [{"cardProperty" :  'name' , "propertyToFind": x, "condition":  'includes'}]
 }
 function  nameIsX(x){
  return [{"cardProperty" :  'name' , "propertyToFind": x, "condition":  '='}]
 }
 function vanguardGradeOrLower(){
  return  ()=>[{"cardProperty" :  'grade' , "propertyToFind": userCircles.userVG.unit.tempGrade, "condition": '<='} ] //come back
 }
 function facedown(){
   return [{"cardProperty" :  'faceup' , "propertyToFind": false , "condition": '='} ]
 }
 function faceup(){
  return [{"cardProperty" :  'faceup' , "propertyToFind": true , "condition": '='} ]
}

 function nameXOrY(x,y){
  return [{"cardProperty" :  'name' , "propertyToFind": x + ' or ' + y, "condition": 'or'} ]
 }
 
function beingAttacked(){
  return [{"cardProperty" :  'state' , "propertyToFind": 'attacked', "condition": '='} ]
}
function notBeingAttacked(){
  return [{"cardProperty" :  'state' , "propertyToFind": 'attacked', "condition": '='} ]
}
function attacking(){
  return [{"cardProperty" :  'state' , "propertyToFind": 'attacking', "condition": '='} ]
}
function standUnits(){
  return [{"cardProperty" :  'stand' , "propertyToFind": true, "condition": '='} ]
}
function restUnits(){
  return [{"cardProperty" :  'stand' , "propertyToFind": false, "condition": '='} ]
}
function hasBoost(){
  return [{"cardProperty" :  'hasBoost' , "propertyToFind": true, "condition": '='} ]
}
function sameColumn(unit){ //come back change to otherUnitsa,e col
let unitCircle = unit.circle
let allCircles = {
  'userVG':'userBCRG',
    'userFRRG':'userBRRG',
      'userBRRG':'userFRRG',
        'userFLRG':'userBLRG',
          'userBLRG':'userFLRG',
            'userBCRG':'userVG'
}

return [{"cardProperty" :  'circle' , "propertyToFind": allCircles[unitCircle], "condition": '='} ]
}

function inFrontOfThisUnit(unit){
  let unitCircle = unit.circle
let allCircles = {
      'userBRRG':'userFRRG',
          'userBLRG':'userFLRG',
            'userBCRG':'userVG'
}

return [{"cardProperty" :  'circle' , "propertyToFind": allCircles[unitCircle], "condition": '='} ]
}

 function getYourColumn(unit){// come back for additional rg in vprem
  let circle = unit.circle
  if (circle ===  'userVG' || circle === 'userBCRG'){
    return [{"cardProperty" :  'circle' , "propertyToFind": 'userVG'  + ' or ' + 'userBCRG', "condition": 'or'} ]
  }
  let otherCircle


  if(circle.includes('F')){
    otherCircle = circle.replace('F' , 'B')

  }
  else{
    otherCircle = circle.replace('B' , 'F')
  
  }
  return  [{"cardProperty" :  'circle' , "propertyToFind": circle + ' or ' + otherCircle, "condition": 'or'} ]
  
 }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//turnstate functions
function isInAbility(){
return turnState.current.inAbility

}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//condition functions
function duringYourTurn(){
  return playerObjects.current.yourTurn  
 
}
function duringBattlePhase(){
  if(  playerObjects.current.phase ===  'battle'){
    return true
    }
    return false
}
function atEndOfBattle(){
if(playerObjects.current.turnState === 'endOfBattle'){
return true
}
return false
}
function atEndOfTurn(){
  if(playerObjects.current.turnState === 'endOfTurn'){
  return true
  }
  return false
  }
function whenYourUnitIsAttacked(propertyArray){
  if(!currentBattle.current.attackingUnit){
    return false
  }
let defending = Object.values(currentBattle.current.defendingUnits)
 
for(let i =0; i<defending.length; i++){
  let unit = userCircles[defending[i].circleId].unit
  
  let isUnit = searchUnit(unit , propertyArray)
  
  if(isUnit && unit.state === 'attacked'){
    return true
  }
return false
}

}
function whenThisUnitAttacks(unit){
  if(unit.state === 'attacks'  ){
    return true
  }
  return false
}
function whenThisUnitAttacksOnVC(unit){
  if(unit.state === 'attacks' && onVC(unit) ){
    return true
  }
  return false
}
function whenThisUnitAttacksOnRC(unit){
  if(unit.state === 'attacks' && onRC(unit) ){
    return true
  }
  return false
}
function whenThisUnitBoosts(unit){
  if(unit.state === 'boosts'  ){
    return true
  }
  return false
}
function whenThisUnitAttacksAVanguard(unit){
 
  if(playerObjects.current.turnState === 'battle' &&  unit.state === 'attacks' && 
    attackedAVanguard()
  ){
    return true
  }
  return false
}

function whenThisUnitAttacksWhileBoosted(unit){
  if(playerObjects.current.turnState === 'battle' && unit.state === 'attacks' && unit.isBoosted === true ){
    return true
  }
  return false
}
function whenThisUnitAttackWhileBoostedHits(unit){
  
  if(playerObjects.current.turnState === 'damageCalc' && unit.state === 'attackHit' && unit.isBoosted === true ){
    return true
  }
  return false
}
function whenTheAttackThisUnitBoostedHits(unit){
  
  if(playerObjects.current.turnState === 'damageCalc' && currentBattle.current.attackingUnit.state === 'attackHit' && unit.boosting === true ){
    return true
  }
  return false
}
 
function attackedAVanguard(){
  let check = Object.keys(currentBattle.current.defendingUnits)
  
  if(check.length === 1 && check[0] === 'userVG'){
    return true
  }
  else if(check.length > 1 ){
    for(let i = 0; i<check.length; i++){
      if(check[i] === 'userVG'){
        return true
      }
    }
 
  }
  return false
}
function attackedARearguard(){
  let check = Object.keys(currentBattle.current.defendingUnits)
  if(check.length === 1 && check[0] !== 'userVG'){
    return true
  }
  else if(check.length > 1 ){
    for(let i = 0; i<check.length; i++){
      if(check[i].includes('RG'))
      {
        return true
      }
    }

  }
  return false
}
function whenTheAttackThisUnitBoostedHitsAVanguard(unit){
  
  if(whenTheAttackThisUnitBoostedHits(unit) && attackedAVanguard()){
    return true
  }
  return false
}
function whenThisUnitsAttackHits(unit){//attack declare , send circles being attacked, guardstep , damageclac, search if units were hit
   
  if(playerObjects.current.turnState === 'damageCalc' && unit.state === 'attackHit'  ){
    return true
  }
  return false
}
function whenThisUnitsAttackHitsOnRC(unit){//attack declare , send circles being attacked, guardstep , damageclac, search if units were hit
   
  if(playerObjects.current.turnState === 'damageCalc' && unit.state === 'attackHit'&& onRC(unit)){
    return true
  }
  return false
}
function whenThisUnitsAttackHitsOnVC(unit){//attack declare , send circles being attacked, guardstep , damageclac, search if units were hit
   
  if(playerObjects.current.turnState === 'damageCalc' && unit.state === 'attackHit' && onVC(unit) ){
    return true
  }
  return false
}
function whenThisUnitsAttackHitsAVanguard(unit){//attack declare , send circles being attacked, guardstep , damageclac, search if units were hit
   
  if(playerObjects.current.turnState === 'damageCalc' && unit.state === 'attackHit' ){
    let arr = Object.keys(currentBattle.current.defendingUnits)
    for(let i = 0; i<arr.length; i++){
      if(arr[i] === 'userVG')
      {
        return true
      }
    }

  }
  return false
}
function whenYourOtherUnitsAttackHits(unit){//attack declare , send circles being attacked, guardstep , damageclac, search if units were hit
  let otherUnit = currentBattle.current.attackingUnit
  if(currentBattle.current.attackingUnit)
  if(playerObjects.current.turnState === 'damageCalc' && otherUnit.state === 'attackHit' && otherUnit.id !== unit.id ){
    return true
  }
  return false
}
function whenYourVanguardsAttacks(unit){//attack declare , send circles being attacked, guardstep , damageclac, search if units were hit
  let otherUnit = currentBattle.current.attackingUnit
  if(playerObjects.current.turnState === 'battle' && otherUnit.state === 'attacks' && otherUnit.circle === 'userVG' ){
    return true
  }
  return false
}
function whenYourVanguardsAttackHits(unit){//attack declare , send circles being attacked, guardstep , damageclac, search if units were hit
  let otherUnit = currentBattle.current.attackingUnit
  if(playerObjects.current.turnState === 'damageCalc' && otherUnit.state === 'attackHit' && otherUnit.circle === 'userVG' ){
    return true
  }
  return false
}
function isAttacking(){
  if(playerObjects.current.attacking === true){
    return true
  }
  return false
} 
function isAttackingUnit(unit){
  if(currentBattle.current.attackingUnit && currentBattle.current.attackingUnit.id === unit.id){
    return true
  }
  return false
}
 
function endOfBattleThisUnitAttacked(unit){
  if( playerObjects.current.turnState === 'endOfBattle' && unit.id === currentBattle.current.attackingUnit.id ){//maybe do a state history for the turn
    return true
  }
  return false
}
function endOfBattleThisUnitAttackedOnRC(unit){
  if(  endOfBattleThisUnitAttacked(unit) && onRC(unit) ){ 
    return true
  }
  return false
}
function endOfBattleThisUnitAttackedOnVC(unit){
  if(  endOfBattleThisUnitAttacked(unit) && onVC(unit) ){ 
    return true
  }
  return false
}
function endOfBattleThisUnitAttackedAVanguardOnRC(unit){
  if(  endOfBattleThisUnitAttacked(unit) && onRC(unit)){ 
    let arr = Object.keys(currentBattle.current.defendingUnits)
    for(let i =0;i<arr.length; i++){
      if(arr[i] === 'userVG') {
        return true
      } 
    }

  }
  return false
}
function endOfBattleThisUnitAttackedWhileBoosted(unit){
  if(playerObjects.current.turnState === 'endOfBattle' && unit.id === currentBattle.current.attackingUnit.id  && unit.isBoosted === true)// make thisubit boosted  functiohn
    {//maybe do a state history for the turn
    return true
  }
  return false
}



function endOfBattleThisUnitBoosted(unit){
  if(atEndOfBattle() && unit.boosting === true ){
   
    return true
  }
  return false
}
function duringTheBattleThisUnitAttacked(unit){
  if( playerObjects.current.turnState === 'battle' &&currentBattle.current.attackingUnit && unit.id === currentBattle.current.attackingUnit.id  ){//maybe do a state history for the turn
    return true
  }
  return false
}
function duringTheBattleThisUnitBoosted(unit){
  if( playerObjects.current.turnState === 'battle' && unit.boosting === true){//maybe do a state history for the turn
    return true
  }
  return false
}
function duringTheBattleThisUnitAttackedARearguard(unit){
  if(playerObjects.current.turnState=== 'battle' &&currentBattle.current.attackingUnit && unit.id === currentBattle.current.attackingUnit.id && attackedARearguard() ){//maybe do a state history for the turn
    return true
  }
  return false
}
function attackHitARearguard(){ //change to hit a rearguard
  let check = currentBattle.current.unitsHit
  if(check.length === 1 && check[0] !== 'userVG'){
    return true
  }
  else if(check.length > 1){
    return true
  }
  return false
}
function whenThisUnitIsBoosted(unit){
  if(unit.isBoosted === true ){//maybe do a state history for the turn
    let boosting = currentBattle.current.boostingUnits
    for(let i = 0; i<boosting.length; i++){
      if(boosting[i].state === 'boosts'){
        return true
      }
    }
  }
  return false
}
function ifThisUnitIsBoostedBy(unit , name){
  if(unit.isBoosted === true ){ //do something for boosting event, dont make it
    let boosting = currentBattle.current.boostingUnits
    for(let i = 0; i<boosting.length; i++){
      if(name === boosting[i].name && boosting[i].state === 'boosts'){
        return true
      }
    }
 
  }
  return false
}
function ifThisUnitIsBoostedByInItsName(unit , string){
  if(unit.isBoosted === true ){  
    let boosting = currentBattle.current.boostingUnits
    for(let i = 0; i<boosting.length; i++){
      if( boosting[i].name.includes(string) && boosting[i].state === 'boosts'){
        return true
      }
    }
 
  }
  return false
}

function ifThisUnitBoosts(unit , name){
  if(unit.state === 'boosts' ){ 
    let boosting = currentBattle.current.boostingUnits
    for(let i = 0; i<boosting.length; i++){
      if(name === boosting[i].name){
        return true
      }
    }
    return true
  }
  return false
}
function whenThisUnitBoostsAVanguard(unit){
  if(playerObjects.current.attacking && (currentBattle.current.attackingUnit.id === userCircles.userVG.unit.id) && unit.boosting === true){
    return true
  }
  return false
}

function whenThisUnitBoostsARearguard(unit){
  if(playerObjects.current.attacking && (currentBattle.current.attackingUnit.place === 'RC') && unit.boosting === true){
    return true
  }
  return false
}
 
function whenYourOtherUnitAttacks(unit){
//check if different id
if(playerObjects.current.attacking  && currentBattle.current.attackingUnit.id !== unit.id && currentBattle.current.attackingUnit.state === 'attacks'){//maybe do a state history for the turn
  return true
}
return false

}
function whenYourOtherRearguardAttacks(unit){
  //check if different id
  if(playerObjects.current.attacking 
      &&currentBattle.current.attackingUnit.state === 'attacks'
    && currentBattle.current.attackingUnit.id !== unit.id &&currentBattle.current.attackingUnit.place === 'RC'  ){
    return true
  }
  return false
  
  }
  function whenYourOtherRearguardAttacksAVanguard(unit){
    //check if different id
    if(playerObjects.current.attacking  && currentBattle.current.attackingUnit.id !== unit.id
      &&currentBattle.current.attackingUnit.state === 'attacks'
      &&currentBattle.current.attackingUnit.place === 'RC' 
      && attackedAVanguard()
     ){
      return true
    }
    return false
    
    }
function whenPlaced(unit , circle = 'RC'){
  //check if different id
  if(unit.place ===  circle && unit.state === 'placed' ) {
    return true
  }
  return false

}
function whenPlacedByRiding(unit , name){
  //check if different id
  let len = userZones.soul.length
  if(len <=0){return false}
 
  if(userZones.soul[len-1].name ===  name && unit.state === 'placed' && unit.place === 'VC' ) {
    return true
  }
  return false

}
async function whenYourRearguardIsPlaced(unit, propertyArray){

  if(  await searchEventCard(unit, 'called',propertyArray )){
    return true
  }
  return false
}
async function whenYourRearguardIsReturnedToHand(unit, propertyArray){
  if(   await searchEventCard(unit, 'bounced' ,propertyArray)){
    return true
  }
  return false
}
async function whenYourOtherRearguardIsPlaced(unit , propertyArray){

 
  let arr = await searchCircles(newPropertyArray([[{ cardProperty:'state' , propertyToFind: 'placed', condition:'=' },
  { cardProperty:'place' , propertyToFind: 'RC', condition:'=' },
  { cardProperty:'id' , propertyToFind: unit.id, condition:'!=' },
  ] , propertyArray]))

  if(arr.length !== 0){
  return true
  }
 

 
  return false
}

function whenYourVanguardIsPlaced(){
  //check if different id
  let vg = ()=>userCircles.userVG.unit
 
  if(vg().state === 'placed'){
  return true
  }
  return false
}
function whenYourVanguardIsAttacked(){
  //check if different id
  let vg = userCircles.userVG.unit
  if(vg.state === 'attacked'){
  return true
  }
  return false
}
function putIntoSoulFromRC(unit){
  if(unit.place === 'soul' && unit.previousArea === 'RC'){
    return true
  }
  return false
}
function whenPlacedOnRCOtherThanFrom(unit , previousArea){
  if(unit.place === 'RC' && unit.state === 'placed' && unit.previousArea !== previousArea){
    return true
  }
  return false
}

function whenPlacedOnRCFrom(unit , previousArea){
  if(unit.place === 'RC' && unit.state === 'placed' && unit.previousArea === previousArea){
    return true
  }
  return false
}

function whenPlacedOnRC(unit){

  if(unit.place === 'RC' && unit.state === 'placed'){
    return true
  }
  return false
}

function onRC(unit){
  if(unit.place === 'RC'  ) {
    return true
  }
  return false
}

function whenPlacedOnVC(unit){

  if(unit.place === 'VC' && unit.state === 'placed'){
    return true
  }
  return false
}

function onVC(unit){
  if(unit.place === 'VC'  ) {
    return true
  }
  return false
 
}
function onVCRC(unit){
  if(onRC(unit) || onVC(unit)) {
    return true
  }
  return false
 
}
function onRCGC(unit){
  if(onRC(unit) || onGC(unit)) {
    return true
  }
  return false
 
}
function whenPlacedOnGC(unit){

  if(unit.place === 'GC' && unit.state === 'placed'){
    return true
  }
  return false
}

function whenPutOnGC(unit){

  if(unit.place === 'GC' && unit.state === 'placed'){
    return true
  }
  return false
}

function whenRetiredFromGC(unit){
  if(unit.place === 'drop' && unit.state === 'retired' && unit.previousArea === 'GC'){
    return true
  }
  return false
}

function whenThisUnitIntercepts(unit){
  if(unit.state === 'intercepts' && unit.place === 'GC'){
    return true
  }
  return false
}
function onGC(unit){
  if(unit.place === 'GC'  ) {
    return true
  }
  return false
 
}
function onBackRowRC(unit){
  if(unit.circle.includes('B')) {
    return true
  }
  return false
 
}
function onFrontRowRC(unit){
  if(unit.circle.includes('F')  ) {
    return true
  }
  return false
 
}

function ifSameColumn(unit1, unit2){

if(unit1.circle[6] === unit2.circle[6]){
  return true
}
  return false
}

function inHand(unit){
  if(unit.place === 'hand'  ) {
    return true
  }
  return false
 
}

function inSoul(unit){
  if(unit.place === 'soul'  ) {
    return true
  }
  return false
 
}

function inDrop(unit){
  if(unit.place === 'drop'  ) {
    return true
  }
  return false
 
}

function inBind(unit){
  if(unit.place === 'bind'  ) {
    return true
  }
  return false
 
}


function whenThisCardIsBound(unit){
  if(unit.state === 'bound'  ) {
    return true
  }
  return false
 
}
async function ifOrderZoneHasASetOrder(){
let oZone = await searchZones(userZones.orderZone , [{
  cardProperty : 'cardtype', propertyToFind:'Set Order' , condition:'includes'
}])
if(oZone.length > 0){
  return true
}
return false
}
function inOrderZone(unit){
  if(unit.place === 'orderZone'){
    return true
  }
return false
}
async function ifOrderZoneHasOnlyWorlds(){
  let oZone = await searchZones(userZones.orderZone , [{
    cardProperty : 'cardtype', propertyToFind:'World' , condition:'!includes'
  }])
  if(oZone.length === 0){
    return false
  }
  return true
  }
function whenThisCardIsPutIntoOrderZone(unit){
  if(unit.state === 'putInto'  && unit.place === 'orderZone') {
    return true
  }
  return false
 
}
 
 
function personaRodeThisTurn(){
if (playerObjects.current.personaRide === true){
  return true
}
return false

}
 
function ifYourSoulHas5OrMore(){
  if(userZones.soul.length >= 5){
    return true
  }
return false
}
function ifYourSoulHas10OrMore(){
  if(userZones.soul.length >= 10){
    return true
  }
return false
}
function ifYourSoulHas(name){
  if( 1){ // searchzones for name
    return true
  }
return false
}
function ifYourSoulHas4OrMoreDifferentGrades(){
  if( 1){ // searchzones for name
    return true
  }
return false
}
async function ifDamageZoneHasNoFaceup(){
  let search= await searchZones(userZones.damage , [{cardProperty:'faceup' , propertyToFind:true , condition:'='}])
  if(search.length > 0){  
    return false
  }
return true
}

function ifDamageZoneHas4OrMore(){

  if(userZones.damage.length > 3){  
    return true
  }
return false
}

//stride paycost -> uservg[heart] = uservg.unit -> uservg.unit = stridedcard strided card.temppower temppower + heart.originalpower
function whenOpponentsRearguardIsRetired(){
  let event = latestEvent()
  if(turnState.current.event === 'retire' && !yourCard(event.opponentCard)){
    
 
    return true
  }
  return false

}
 function whenOpponentsRearguardIsRetiredDuringYourMainPhase(){//come back
 if(playerObjects.current.phase !== 'main'){return}
  if(whenOpponentsRearguardIsRetired()){
    return true
  }
return false

}
function whenRidingFrom(unit , name){
  
  let len = userZones.soul.length
  if(unit.state === 'placed' && unit.place === 'VC' && userZones.soul[len-1].name === name  ){
    return true
  }
  return false
}
function whenRodeUpon(unit){
  if(unit.state === 'rodeUpon'  ){
    return true
  }
  return false
}
function whenRodeUponIfSecond(unit){
  if(unit.state === 'rodeUpon' && turnCount.current === 2 ){
    return true
  }
  return false
}
function whenRodeUponBy(unit , name){
  if(unit.state === 'rodeUpon' && userCircles.userVG.unit.name === name ){ //do namecompare
    return true
  }
return false
}
function whenRodeUponByIncludes(unit , name){
  if(unit.state === 'rodeUpon' && userCircles.userVG.unit.name.includes(name) ){ //do namecompare
    return true
  }
return false
}
function whenWouldBeRodeUpon(unit){
  if(unit.state === 'rodeUpon' && turnState.current.state === 'rodeUpon' ){ //do tunrstate
    return true
  }
return false
}




function playedOrderThisTurn(name){
  if(playerObjects.current.ordersPlayed[name]){
    return true
  }
  return false
  }
  function playedAnOrderThisTurn(){
    if(playerObjects.current.ordersPlayed.length > 0){
      return true
    }
    return false
  }
  function whenThisCardIsDiscarded(unit){
    if(unit.state === 'discarded'){
      return true
    }
    return false
  }
  function ifYouPlayedAnOrderThisTurn(){
    let played =playerObjects.current.ordersPlayedAmount
    if(played >0){
      return true
    }
    return false
    }

function whenThisUnitIsArmed(unit){
  if(unit.state === 'armed'){
    return true
  }
  return false
}

function ifThisUnitIsArmed2OrMore(unit){

  if(unit.arms ){
    let leftArms = Object.keys(unit.arms.left)
    let  rightArms = Object.keys(unit.arms.right)
    if(leftArms.length - rightArms.length ===0){
      return true
    }

  }
  return false
}

function ifYourVanguardIsArmed() {
  if(userCircles.userVG.unit.arms && userCircles.userVG.unit.arms.left ||userCircles.userVG.unit.arms.right){
    return true
  }
  return false
}
function ifYourVanguardIsArmed2OrMore(){

  if(userCircles.userVG.unit.arms &&userCircles.userVG.unit.arms.left && userCircles.userVG.unit.arms.right){
    return true
  }
  return false
}
function whenUnitArmedWithThisCardAttacks(card){
let unit = theUnitArmedWithThisCard(card)
if(unit.state === 'attacks'){
  return true
}
return false
}

function whenUnitArmedWithThisCardIsAttacked(card){
  let unit = theUnitArmedWithThisCard(card)
  if(unit.state === 'attacked'){
    return true
  }
  return false
  }

function theUnitArmedWithThisCard(card){
  let unit = userCircles[card.unitArmed].unit

  return unit
}
function placedByRevolDress(unit){
  if(unit.state === 'placed' && turnState.current.event === 'revolDress'){
    return true
  }
  return false
}
function yourVanguardIsPlacedByRevolDress(){
  if(userCircles.userVG.unit.state === 'placed' && turnState.current.event === 'revolDress'){
    return true
  }
  return false
}
 
function ifOverDress(unit){
return unit.isOverDress
}



async function haveAnOverdressUnit(){

let zone = await searchCircles([
  {
    "cardProperty": "isOverDress",
    "propertyToFind": true,
    "condition": "="
  }
])
if(zone.length > 0){
  return true
}
return false
}

async function ifYouHave3OrMoreGrade3(){
  let arr = await searchCircles([
    {
      "cardProperty": "grade",
      "propertyToFind": 3,
      "condition": "="
    }
  ])
  if(arr.length >=3){return true}
  return false
}
function whenSung(order){
  if(order.state === 'sung'){ 
    return true
  }
return false
}

function duringAlchemagic(){
  if(turnState.current.event === 'Alchemagic'){ 
    return true
  }
return false
}

async function ifThisCardIsPutInto(card, zoneName){

if(card.state === 'put' && card.place === zoneName){ 
  return true
}
return false
}

// function ifYouPlayedAnOrderThisTurn(){
//   if(playerObjects.current.ordersPlayed.length !== 0){ 
//     return true
//   }
// return false
// }

function ifYourWorldIsDarkNight(){

  if(playerObjects.current.world === 'Dark Night'){
    return true
  }
  return false
}
function ifYourWorldIsAbyssalDarkNight(){
if(playerObjects.current.world === 'Abyssal Dark Night'){
  return true
}
return false
}
async function ifAWorldIsPutIntoOrderzone(){
let temp = await searchZones(userZones.orderZone, [{cardProperty:'state' , propertyToFind:'put' , condition:'='}
  ,{cardProperty:'cardtype' , propertyToFind:'World' , condition:'includes'}
])
if(temp.length>0){
  return true
}
return false
}
function finalRush(){
return playerObjects.current.finalRush
}
function finalRushOnRC(unit){
  if(onRC(unit) && finalRush()){
 
    return true
  }
return false
}
function finalBurst(){
  return playerObjects.current.finalBurst
}
 function whenYourDriveCheckReveals( propertyArray){
 if(userZones.trigger.length === 0){return false}
  
  if(turnState.current.state === 'driveCheck' && searchUnit(userZones.trigger[0] , propertyArray)){
 
    return true
  }
return false
}
async function whenYourDriveCheckRevealsATrigger(){
  whenYourDriveCheckReveals(triggerUnit())
}
async function endOfBattleYourDriveCheckRevealed(propertyArray){

  if(playerObjects.current.turnState === 'endOfBattle'){
    let searched = await searchZones(currentBattle.current.revealedUnits, propertyArray)

    if(searched.length > 0){return true}
  }
  return false
}

function whenYourDamageCheckReveals(thing , propertyArray){
  if(turnState.current.state === 'damageCheck' && userZones.trigger[0] === thing){
    return true
  }
return false
}
function whenYouPlay(propertyArray){
 // let result = async (propertyArray) => searchUnit(eventCard.current , propertyArray)
  if(turnState.current.state !== 'Order'){
    return false
  }
 let result = searchUnit(turnState.current.card , propertyArray) 

  if(result){
    return true
  }
  return false
}
 
function isOnBackrow(unit){
  if(unit.circle.includes('B')){
    return true
  }
return false
}
function isOnFrontrow(unit){
  if(unit.circle === 'userVG' || unit.circle.includes('F')){
    return true
  }
return false
}



function ifPutIntoZoneFrom(unit , zone , previousArea){
  if(unit.place === zone && unit.previousArea === previousArea){
    return true
  }
return false
}
function unitCompare(unit , propertyArray){//name problem, 
  for(let i = 0;i <propertyArray.length ; i++){
    let property = propertyArray[i].cardProperty

  }
return true
}
 //choose a X unit , stadn grade3 or whatever
 // onchoose -> add influence property card choosed
function ifYourVanguardIs( name){
  //make a separate card  img database
  if(userCircles.userVG.unit.name === name){
    return true
  }
return false
}
function ifYourVanguardIsGrade3orGreater(){
  //make a separate card  img database
  if(userCircles.userVG.unit.tempGrade >= 3){
    return true
  }
return false
}
function ifYourOpponentsVanguardIsGrade3orGreater(){
  //make a separate card  img database
  if(opponentCircles.opponentVG.unit.tempGrade >= 3){
    return true
  }
return false
}

function ifYourVanguardHasXInItsName(unit , X){
  //make a separate card  img database
  if(userCircles.userVG.unit.name.includes(X)){
    return true
  }
return false

}

async function ifYouHaveAUnitWithInItsCardName(x){
 
  let arr = await searchCircles(nameIncludesX(x) )
  if(arr.length > 0 ){
    return true
  }
return false

}

function duringVanguardAbility(){
  if(turnState.current.card && isInAbility() && turnState.current.card.place === 'VC'){
    return true
  }
return false
}

//for cost -> setTurnState to {cost: unitPaying : tunrState: soulBlast}
// do ability -> setTurnState to {ability:ability , card : card} -> chooseFunction ->set unit.state = 'chosen'
async function thisUnitIsChosenByUnitAbility(){
  if( unit.state === 'chosen'){
    return true
  }
  return false
}
 function thisUnitIsChosenByVanguardAbility(unit){
  if(turnState.current.card.circle === 'userVG' && unit.state === 'chosen'){
    return true
  }
  return false
}

////////////////////////////////////////////////////////////////////////////////////////
//event functions
const  latestEvent = () => turnLog.current[turnLog.current.length  -1]
function whenARearguardIsRetired(){
  let checking = latestEvent()

  if(checking.action.includes('retire')){ //includes retired by battle or call
    return true
  }
  return false
}
function whenYourRearguardIsRetired(){
  let checking = latestEvent()
  let dropTop = userZones.drop[userZones.drop.length  -1].id
  if(checking.action === 'retire' && checking.opponentCard.id === dropTop){
    return true
  }
  return false
}
function whenYourOpponentsRearguardIsRetired(){
  let checking = latestEvent()
  let dropTop = userZones.drop[userZones.drop.length  -1].id
  if(checking.action === 'retire' && checking.opponentCard.id !== dropTop){
    return true
  }
  return false
}

//////////////////////////////////////////////////////////////////////////////////////////
//cost conditions

function retiredForCost(unit){

  if(unit.state === 'retired' && turnState.current.state === 'payingCost'){
    return true
  }
  return false
}

////////////////////////////////////////////////////////////////////////
//cost functions
async function dropThisCard(card){//put this card in the drop, soul or whatever
  await thisCard(userZones.drop , card)
}

async function soulThisCard(card){//put this card in the drop, soul or whatever

  await thisCard(userZones.soul , card)
}
async function bindThisCard(card){//put this card in the drop, soul or whatever
  await thisCard(userZones.bind , card)
}
async function thisCard(zoneToMoveTo , card){
  let zoneToRemove = card.place
  //make a collection of functions to set states and shit, eg bind, 
  await addToZone(userZones[zoneToRemove], zoneToMoveTo, [card])
  setUserZones({...userZones})
}

async function standThisUnit(unit){
 addToYourLog('effectStand' , unit , turnState.current.card)
 if(!unit.stand){playerObjects.current.unitsStoodThisTurn[unit.id] = {name:unit.name, circle:unit.circle}}
  stand(unit)
}
async function restThisUnit(unit){
 
  rest(unit)
}
 
async function retireThisUnit(unit){
 
  retire(unit)
}

async function soulThisUnit(unit){
 
  soul(unit)
}
async function soulOtherRearguards(amount , propertyArray =   [  {
  "cardProperty": "id",
  "propertyToFind": turnState.current.card.id,
  "condition": "!="
},
{
  "cardProperty": "place",
  "propertyToFind": 'RC',
  "condition": "="
}
]){
await chooseUnits(amount , propertyArray , (unit)=>{
  soulThisUnit(unit)
})
}

async function bindThisUnit(unit){
 
  bind(unit)
}

function counterBlastObject(amount = 1, filter = basicPropertyArray){ 
  return {"counterBlast": {
      "amount": amount,
      "filter": filter
    },
    "costEffect": async function (unit){await counterBlast(this.counterBlast.amount);}}
}
function soulBlastObject(amount =1, filter = basicPropertyArray){
  return {"soul": {
    "amount": amount,
    "filter": filter
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount);}}
}
function anotherUnitObject(amount , filter = basicPropertyArray){
  return {"soul": {
    "amount": amount,
    "filter": filter
  },
  "costEffect": async function (unit){await soulBlast(this.soul.amount);}}
}

async function reveal(amount , zone , propertyArray = basicPropertyArray, upTo = true){
//get cards to reveal -> send array to opp and continue
let cards = await clickAbilityZone(zone , amount, propertyArray, upTo)//change
//do reveal thing
//separate reveal and revealcards
return cards.selected
}
function revealIt(arr){
  socket.emit('fightUpdate', { roomId :roomID,  command:'reveal', item :{arr : arr}}) 
}
//do cost checker for circles
////////////////////////////////////////////////////////////////////////
async function yourImprisoned(){//call from callimprisoned
return await searchZones(currentOpponentZones.current.orderZone ,[

  {
    "cardProperty": "imprisoned",
    "propertyToFind": true,
    "condition": "="
  }
] )
}
async function yourImprisonedAmount(){ // get imprisoned
  let a = await yourImprisoned() 
  return a.length
}
async function opponentImprisoned(){ 
  return await searchZones(userZones.orderZone ,[

    {
      "cardProperty": "imprisoned",
      "propertyToFind": true,
      "condition": "="
    }
  ] )
}
async function opponentImprisonedAmount(){ // get imprisoned
  let a = await opponentImprisoned() 
  return a.length
}

async function rearguardCheck(propertyArray){
return await searchCircles(propertyArray) //have a separate property and something to updateit
}
async function unitAmountCheck(amount , propertyArray=  basicPropertyArray){
let rgs = await searchCircles(propertyArray)

if(rgs.length > amount){return true}
return false
}
async function rearguardAmountCheck(amount , propertyArray=  [

    {
      "cardProperty": "place",
      "propertyToFind": "RC",
      "condition": "="
    }
]){
let rgs = await rearguardCheck(propertyArray)

if(rgs.length > amount){return true}
return false
}
async function opponentRearguardCheck(propertyArray){
  return await searchCircles(propertyArray , 'opponent') //have a separate property and something to updateit
  }
async function opponentRGAmountLessThan(amount , propertyArray=  [

  {
    "cardProperty": "place",
    "propertyToFind": "RC",
    "condition": "="
  }
]){
let rgs = await opponentRearguardCheck(propertyArray)
if(rgs.length > amount){return false}
return true
}
async function opponentOpenRC(){
         let oppUnits = await searchCircles(rearguard() , 'opponent')
        let openRG = 5 - oppUnits.length
        return openRG
 }
async function openRC(){
//come back
let rgs = await searchCircles(rearguard())
  let openRG = 5 - rgs.length
        return openRG
}


function ifThisCardIsDiscarded(unit){
  if(unit.state === 'discarded'){return true}
  return false
}


function opponentRearguardWasRetiredThisTurn(){
  if(playerObjects.current.opponentRearguardsRetired === true){return true}
  return false
}



async function untilEndOfOpponentsTurn(func , reverseFunc){
  //get turnCount, when turnCount === turnCOunt + 2, do reverse function
}

async function increaseOrderAmount(){//have a different function to set the amount to paly
  playerObjects.current.ordersToPlay ++
}
/////////////////////////////////////////////////////////////////
//check functions
function getZoneLength(zone){
return zone.length
}
function searchZoneLength(amount , zone, propertyArray){
  if(!zone){return false}
 let r =  async (zone , propertyArray)=>{return await searchZones(zone , propertyArray)}
   let final = r(zone , propertyArray)
   if(final.length < amount){
    return false
   }
   return true
  }
///////////////////////////////////////////////////////////////
//phase check
 function phaseCheck(currentPhase){

  if(  playerObjects.current.phase === currentPhase){
    return true
  }
  return false
 }
 function subPhaseCheck(currentSubPhase){
  if(turnState.current.event === currentSubPhase){
    return true
  }
  return false
 }
 function beginningOfTurn(){
  return subPhaseCheck('beginningOfTurn')
}
function endOfTurn(){
  return subPhaseCheck('endOfTurn')
}
function endOfOpponentsTurn(){
  if(opponentObjects.current.turnState ==='endOfTurn')
    return true
  return  false
}
 function beginningOfStand(){
  return subPhaseCheck('beginningOfStand')
}
function endOfStand(){
  return subPhaseCheck('endOfStand')
}

function beginningOfRide(){
  return subPhaseCheck('beginningOfRide')
}
function endOfRide(){
  return subPhaseCheck('endOfRide')
}

function beginningOfMain(){
  return subPhaseCheck('beginningOfMain')
}
function endOfMain(){
  return subPhaseCheck('endOfMain')
}
function beginningOfBattle(){
  return subPhaseCheck('beginningOfBattle')
}
//function endOfBattle(){
  //return subPhaseCheck('endOfBattle')
//}


//store "thisturn" events
function whiteWings(){
  return playerObjects.current.whiteWings
}
function blackWings(){
  return playerObjects.current.blackWings
}

//whitewings amd blackwimds
//have proerty in playerobjects to control when to search
async function searchWhiteWing(){
  let bind = userZones.bind
  for(let i = 0; i<bind.length; i++){
    if((bind[i].tempGrade / 2) === 1){
      return false
    }
  }
return true
}
async function searchBlackWing(){

  let bind = userZones.bind
  for(let i = 0; i<bind.length; i++){
    if((bind[i].tempGrade / 2) === 0){
      return false
    }
  }
return true
}

//////////////////////////////////////////////////////////////
 

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function searchUnitOr(unit , propertyArray = basicPropertyArray){
  let final = false
  if(!unit || !propertyArray){return false}

  for(let i = 0; i<propertyArray.length ; i++){
    let cardProperty = propertyArray[i].cardProperty
    let propertyToFind = propertyArray[i].propertyToFind
    let condition = propertyArray[i].condition
    if( searchOperators[condition](unit[cardProperty] , propertyToFind)){
    final = true
 
    }

  }
      return final
}


function searchUnit(unit , propertyArray = basicPropertyArray){
  if(!unit || !propertyArray){return false}
  if(propertyArray[0].or === true){ 
    return searchUnitOr(unit , propertyArray)
  }
  for(let i = 0; i<propertyArray.length ; i++){
    let cardProperty = propertyArray[i].cardProperty
    let propertyToFind = propertyArray[i].propertyToFind
    let condition = propertyArray[i].condition
    if(!searchOperators[condition](unit[cardProperty] , propertyToFind)){
    
      return false
    }

  }
      return true
}

async function searchCircles(propertyArray = basicPropertyArray, playername = 'user' , or = false){
 
  if(!propertyArray){return []}
  let player = userCircles
  if(playername === 'opponent'){
    player = currentOpponentCircles.current
  }
  let circles = Object.values(player) 

  let tempArray = []
  let check = searchUnit
if(propertyArray[0].or === true){ 
  check = searchUnitOr
}


  for(let i = 0; i<circles.length ; i++){
 
if(circles[i].unit !== (null || undefined)){
 
if(check(circles[i].unit , propertyArray)){
  
  tempArray.push(circles[i].unit.circle)
}
}

  
  }

  return tempArray 

  }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//newcard functions
const tokens = {
  'Shadow Army' :   {
    "name": "Shadow Army",
    "grade": 1,
    "text": "(This represents a Shadow Army token, and cannot be put in a deck)",
    "skill": " Boost",
    "power": 15000,
    "critical": 1,
    "shield": 0,
    "img": "/images/D-BT01-T01.png",
    "nation": "Brandt Gate",
    "clan": "",
    "race": "Shadow Army",
    "set": "D Booster Set 01: Genesis of the Five Greats",
    "setNo": "D-BT01-T01",
    "cardtype": "Normal Unit",
    "flavor": "",
    "format": "Standard",
    "sleeve": "",
    "triggereffect": "",
    "kana": "シャドーアーミー",
    "phonetic": "Shadōāmī"
  },
}

async function makeToken(tokenName){
  let token = await makeUnit(tokens[tokenName] , playerObjects.current.latestCardId++ )

  return token

}

async function callToken(tokenName , amount , elements = 'userCircles', mustBeOpen = false){
//put circle in tempzone then do zone to circle
let tempArray  = []
for (let i = 0;i < amount ; i++){
let unit = await makeToken(tokenName)
tempArray.push(unit)

}
setAbilityZone(tempArray)
setShowAbilityZone(true)
setConfirm(true)
 await waitForElement('abilityZone') && await waitForElement('confirm')
await callFromAbilityZone(tempArray , amount, tempArray,elements ,mustBeOpen)
}

async function removeRG(unit){

let circle = unit.circle
  if (unit.cardtype === 'Token Unit'){
    userCircles[circle].unit = null
    return null
}
unit = await resetUnit(unit)
unit.previousArea = 'RC'

userCircles[circle].unit = null

return unit
}

async function placeSetOrder(order){
  userZones.orderZone.push(order)
  order.state = 'placed'
  order.place = 'orderZone'
  order.previousArea = 'hand'//or orderarea

}
async function removeSetOrder(){
  
}

//card funcions

//make elements object -> elments[frontend] = document.getELementbyid(frontend)

//do makeunit when recieving card in prison

async function retireByBattle(circle){
  let card = userCircles[circle].unit
 
  card.state = 'retiredByBattle'

  //check abilities then reset unit
  userZones.drop.push(card)
 userCircles[circle].unit = null
  setUserCircles({...userCircles})
}

async function botDeckRG(unit){
  let circle = unit.circle
  userCircles[circle].unit = null
  //check abilities then reset unit
  newDeck.MainDeck.shift(unit)



}

async function topDeckRG(unit){

  let circle = unit.circle
  userCircles[circle].unit = null
  //check abilities then reset unit
  newDeck.MainDeck.push(unit)
 


}

async function choice(arr){//take in array of obj and put in popup
  /*
  choice1{
    text:'',
    efffect: func
  }
  */
}

//circletozone
//cost = boolean if using for cost or effect
//do rest and stand for oppuntis

//make function for ridedeck cost change
async function retireYourUnit(unit){
let circle =  unit.circle
unit.state = 'retired'//for retired by battle or retired by effect check current ability or turnstate
unit.place = 'drop'
unit.previousArea = 'RC'
userZones.drop.push(unit)
userCircles[circle].unit =null
setUserZones({...userZones})
}

////////////////////////////////////////////////////////////////////////
//opponent functions

async function opponentRemove(arr , command){

  let options = {
    'retire' : opponentRetire,
    'bind' : opponentBind,
    'bounce' : opponentBounce,
    'damage' : opponentDamage,
    'soul' : opponentSoul,
    'order' : opponentOrder,
    'topDeck' : opponentTopDeck,
    'botDeck' : opponentBotDeck,
    'imprison' : imprisonUnit,
  }
let func = options[command]

opponentRemoveHandler(arr , func)
setUserCircles({...userCircles})
await searchAbilities()
await waitAbilities()

}


 

async function removeOpponentUnits(circles , func, ){
  socket.emit('fightUpdate', { roomId :roomID,  command:'removeUnits', item :{circles : circles , func : func}}) //do for zones
 await waitPlayerInput()
}

async function doOpponentUnits(circles=[] , func='', amount=0){
  socket.emit('fightUpdate', { roomId :roomID,  command:'doUnits', item :{circles : circles , func : func , amount:amount}}) //do for zones

}

async function opponentRemoveHandler(arr , func){
 
  for(let i = 0; i<arr.length;i++){
    let circle = arr[i]
  //popup for or more costs
    await func(circle)
  }

}

async function retireOpponentRearguards(amount, propertyArray = [          {
  "cardProperty": "place",
  "propertyToFind": "RC",
  "condition": "="
}]){
//choose -> return circles, send circles, do imprisonunit on circles
let circles = await chooseOpponentUnits(amount, propertyArray)
await removeOpponentUnits(circles , 'retire')
}
async function botDeckOpponentRearguards(amount, propertyArray = [{
  "cardProperty": "place",
  "propertyToFind": "RC",
  "condition": "="
}]){
//choose -> return circles, send circles, do imprisonunit on circles
let circles = await chooseOpponentUnits(amount, propertyArray)
await removeOpponentUnits(circles , 'botDeck')
}
//do propertyarray functinos eg return place = rc

async function imprisonOpponentRearguards(amount, propertyArray = [          {
  "cardProperty": "place",
  "propertyToFind": "RC",
  "condition": "="
}]){
//choose -> return circles, send circles, do imprisonunit on circles
let circles = await chooseOpponentUnits(amount, propertyArray)
await removeOpponentUnits(circles , 'imprison')
}

async function removeOpponentCards(zoneToRemove, key , cards){


socket.emit('fightUpdate',  { roomId :roomID,  command:'removeOpponentCards', item :{zone:zoneToRemove , key:key, cards : cards}})
}

async function moveOpponentCards(zoneIn , zoneToMoveTo , cards) {
  socket.emit('fightUpdate', { roomId :roomID,  command:'moveOpponentCards', 
    item : { cards:cards , moveFrom: zoneIn , moveTo:zoneToMoveTo}  }) 
}

async function imprisonOpponentCards(zone ,amount, propertyArray = basicPropertyArray){
//clickabilityzone opp zone , get card ids ans send to opp, opp does addyourorderzone
let imprisonZone = currentOpponentZones.current[zone]
let toImprison = await clickAbilityZone(imprisonZone , amount, propertyArray)

await removeOpponentCards(zone, 'imprison' , toImprison.selected)
}
async function imprisonUnit(circle){//socket calls these
  if(opponentObjects.current.hasPrison === false){return} //opponent doesnt have prison
let unit = userCircles[circle].unit
unit.state = 'imprisoned' 
unit['imprisoned'] = true 
unit['previousArea'] = 'prison' 
imprisonCard(unit)
userCircles[circle].unit = null

}
async function imprisonCard(card){// run on the person getting imprisoned
  if(opponentObjects.current.hasPrison === false){return}
  card.state = 'imprisoned' 
  card['imprisoned'] = true 
  card['previousArea'] = 'prison' 
  let zone = userZones[card.place]
  removeById(zone , card.id)
  currentOpponentZones.current.orderZone.push(card)
  socket.emit('fightUpdate',  { roomId :roomID,  command:'updateOpponentZone', item :{zone:'orderZone' , array: currentOpponentZones.current.orderZone}})

}
async function callYourImprisoned(amount){
  let zone = await yourImprisoned()
  await superiorCall(currentOpponentZones.current.orderZone , [
    {cardProperty : 'imprisoned' , propertyToFind:true , condition:'='}
  ] , amount, undefined , false, 'prison')
  //send signal to remove by id cards
  socket.emit('fightUpdate',  { roomId :roomID,  command:'updateOpponentZone', item :{zone:'orderZone' , array: opponentZones.orderZone}})
}


async function addAbility(card , ability){//use fiter to remove ability save ability name in effect, alternative method is to delete by abilityX = null, which would keep the abilities length to add new ones
let keys = Object.keys(card.abilities)
if(keys.length === 0){
  card.abilities['ability1'] = ability

   return 'ability1'}
let newKey = keys[keys.length -1]
newKey = newKey.replace('ability' , '')
newKey = parseInt(newKey)
newKey ++;
newKey = 'ability' + newKey


card.abilities['newKey'] = ability
return newKey
}
async function removeAbility(card , abilityName){//use fiter to remove ability
  if(card.abilities[abilityName].type === 'CONT' && card.abilities[abilityName].isOn){
    card.abilities[abilityName].off(card)
  }
delete card.abilities[abilityName]
}

async function addAbilityEndTurn(card , ability){
let name = await addAbility(card , ability)
untilEndTurn(()=>{
  removeAbility(card , name)
}, card) 
}

async function costChecker(cost,card){ //in resolveability do this, if false return pass cost object parameter
  
  if(cost == null){return true}
  //make array of cost and compare each value with playerobjects value tp check if cost can be paid
  let keys = Object.keys(cost)
  let canPay = true
  //make abilities give a footnote , increasepower - > unit.powerIncrease

  for(let i =0; i<keys.length -1; i++){
 
    let prop = keys[i]

    if(prop === 'altCost'){
 
      return canPay || await costChecker(cost[prop], card)
    }


    let findZone = await playerResources.current[prop](card , cost[prop].zone) 
   
    let zoneL = await findHowManyCards(findZone, cost[prop].filter )//first het all viable cards then check duscard/retire value
 
    if(cost[prop].amount >  zoneL ){
      canPay = false
      return false
      
    }
  }


  return canPay
  //let position = stand/rest for units

}

async function performAll(arr , compareTo){ // [{effect : func() , value : 0 , compare : '=' }]

  //arrayofpro
  for(let i = 0; i<arr.length ; i++){
    let condition = arr[i].condition 

    
    if(searchOperators[condition](arr[i]['value'] , compareTo) == true){
      //do effect
     
      await arr[i].effect() //instead do resolveability(effect)

    }
  
  }

}
async function youGet(ability){
  addAbility(playerObjects.current.abilities , ability)
  giveCONTAbility
}
async function youMay(args, effect = (args)=>{
  
}){//do popup yes/no if no return different from choose
//popup
setPopupWord('youMay')
setPopup(true)
//setCurrentAbility({...currentAbility , 'array' : arr})
//await waitPlayerInput()
if(costPaid.current){
  await effect(args)
}

}

async function chooseOneOfTheFollowing(arr){ // [{text : '' , effect : async()=>{}}]
let prevCostPaid = costPaid.current
costPaid.current = arr
setPopupWord('choose')
setPopup(true)
await waitPlayerInput()

await costPaid.current.effect()

costPaid.current = prevCostPaid
}

async function lookTopDeck(amount){
  let temp = newDeck.MainDeck.splice(0, amount);
  setAbilityZone(temp)
  setShowAbilityZone(true)
 //do confirm better
return temp
}
async function revealToOpponent(arr){//in call function make a flag to do if(card.previousArea !== hand)set playerobecjt notcalled from hand = true

}
  //have diff functions for retire front, back , allcircles
  //make get fuctions to get no. of units

//on playorder check if order type is prison if it is change plauerobject.hasprison

async function callImprioned(){//change what popup uses
  //change to callimprisoned
  setPopup(true)
//callYourImprisoned
currentAbility.text = 'Call from Prison \n\ SB1 to call 1, CB1 to call 2'
  await chooseOneOfTheFollowing([
{    text:'Call 1' , effect:async ()=>{
      let temp = {
        cost: {soul: {amount:1} , costEffect:async (unit)=>{await soulBlast(1)}} , 
       effect:async (unit)=>{  await callFromPrison(1)}  
      }

      await resolveNewAbility(userCircles.userVG.unit , temp.cost , temp.effect)
 
    }
  },
  {    text:'Call 2' , effect:async ()=>{

    let temp = {
      cost: {counterBlast:{amount:1}  , costEffect:async (unit)=>{await counterBlast(1)}} , 
    effect:async (unit)=>{  await callFromPrison(2)}  
    }
      await resolveNewAbility(userCircles.userVG.unit , temp.cost , temp.effect)
  }
}])


}

async function callFromPrison(amount, propertyArray = basicPropertyArray){

await superiorCall(currentOpponentZones.current.orderZone , await newPropertyArray([imprisoned() , propertyArray])  , amount ,undefined , undefined,'prison' )
socket.emit('fightUpdate',  { roomId :roomID,  command:'updateOpponentZone', item :{zone:'orderZone' , array: currentOpponentZones.current.orderZone}})
}


//////////////////////////////////////////////////////////////////////////
//order functions


/*
bavsargra{ do sonething for rendering, eg change what to render in a variable
  arms :{
    left:{

    }
    right:{

    }
  }
}

ordereffect:{//under effects
  'deityArms' : {
    'postion': left or right,
    'vanguardName : 'bavsarga
    unitArmed : null -> settouserVG
  }
do abilities here like set order
}

finish arms 
change backend url
dp doall


*/

async function removeArm(position){

}
//search arms for abilities
async function armsHandler(order , position){
  order['unitArmed'] = 'userVG'
  if(!userCircles.userVG.unit.arms){
    userCircles.userVG.unit['arms'] = {left:{} , right:{}}
  }

 
 
 if(userCircles.userVG.unit['arms'][position].place){
  //remove arm
  userZones.drop.push(userCircles.userVG.unit['arms'][position])
 }
 //add new arm
 userCircles.userVG.unit['arms'][position] = order
 
 order['place'] = 'VC'
 order['state'] = 'armed'
setUserCircles({...userCircles})
}

async function arm(order){
  //check name
 
 if(!order.orderEffects.deityArms ){
return
 }
 
  let armsName = order.orderEffects.deityArms.vanguardName 
  let position = order.orderEffects.deityArms.position
  if(compareName(armsName , userCircles.userVG.unit.name)){

    await armsHandler(order , position)
  }

}

async function alchemagic(firstOrder , secondOrder){//abilitylistonclick do declareAbility(); send card and ability text to opp and display them
let newFirst = {...firstOrder}
let newSecond = {...secondOrder}
let newOrder = {
  cardtype: "Normal Order",
  orderEffects: {cost:  {},effect:{effect:()=>{}}},
 
ids:{
  //put both ids
}
}
turnState.current.event = 'Alchemagic'
// let firstCosts = Object.keys(newFirst.orderEffects.cost)
// let secondCosts = Object.keys(newSecond.orderEffects.cost)
 
 //costeffect is still using firstorder this.counterblast
newOrder.orderEffects.cost.costEffect = async function () {
  //  await firstOrder.orderEffects.cost.costEffect.apply(this) ;
  //  await secondOrder.orderEffects.cost.costEffect.apply(this)
  if(firstOrder.orderEffects.cost){
    await firstOrder.orderEffects.cost.costEffect() ;
  }
  if(secondOrder.orderEffects.cost){
    await secondOrder.orderEffects.cost.costEffect()
  }

  }//fix make costcheck takeoutawait, do puase before check, use loop without await 

 
 newOrder.orderEffects.effect.effect = async function ()  {
  await firstOrder.orderEffects.effect.effect() ;
   await secondOrder.orderEffects.effect.effect()
  }
 
 return newOrder
}


//get second order from zorga cont ability 


// click playorder, do checkalchemagic, show abilityzone with second order array
async function checkAlchemagic(firstOrder){

  if (playerObjects.current.canAlchemagic === false ){
    return firstOrder
  }
  //turnState.current.event = 'Alchemagic' 

 let secondOrder =  await getSecondOrder.current()
 
  if(secondOrder===null){
    return firstOrder
  }
  
  return await alchemagic(firstOrder , secondOrder)


}

function compareName(name , comparingName){
  if(name === comparingName){
    return true
  }
return false
}

async function makeOpponent(card, additional = {}){
//sendcardname then wait
 
 socket.emit('fightUpdate',  { roomId :roomID,  command:'doOpponent', item :{card:card, additional:additional}})

 await waitPlayerInput()

 //setUserZones({...userZones})
 //abilitiesList.current.splice(0 , 1)
}

async function doOpponentEffect(card, additional){//get effect from opponentEffects object, us eplayerobjects for stuff like imprison, do something in turnstate for selecting by opp ability

  if(oppEffects[card.name]){
 
  abilitiesList.current.push({ability: oppEffects[card.name] , card:card, img:card.img, })
  setUserCircles({...userCircles})
}
//send confirmation on complete, wait

await waitAbilities()

 socket.emit('fightUpdate',  { roomId :roomID,  command:'stopWait', item :{}})//unwait stopWait
}
 
//cost functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////effect functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//do 2 functions on called unit, normal state, place one and optional increase power etc one  
async function callFromDrop( amount, propertyArray = basicPropertyArray , elementsName = 'userCircles', mustBeOpen = false, fnction = ((card)=>{return card})){
 
 
 
    return   await superiorCall(userZones.drop , propertyArray , amount , elementsName , mustBeOpen , 'drop' , fnction)

}

async function callFromBind( amount, propertyArray = basicPropertyArray , elementsName = 'userCircles', mustBeOpen = false, fnction = ((card)=>{return card})){
 
  
    return   await superiorCall(userZones.bind , propertyArray , amount , elementsName , mustBeOpen , 'bind' , fnction)

} 
async function callFromSoul( amount, propertyArray = basicPropertyArray , elementsName = 'userCircles', mustBeOpen = false, fnction = ((card)=>{return card})){
 
 
    return   await superiorCall(userZones.soul , propertyArray , amount , elementsName , mustBeOpen , 'soul' , fnction)

}

async function callFromHand( amount, propertyArray = basicPropertyArray , elementsName = 'userCircles', mustBeOpen = false, fnction = ((card)=>{return card})){
 
 
return   await superiorCall(userZones.hand , propertyArray , amount , elementsName , mustBeOpen , 'hand' , fnction)
 

}

async function callFromDamage( amount, propertyArray = basicPropertyArray , elementsName = 'userCircles', mustBeOpen = false, fnction = ((card)=>{return card})){
 
  

    return   await superiorCall(userZones.damage , propertyArray , amount , elementsName , mustBeOpen , 'hand' , fnction)

}

async function callFromDeck( amount, propertyArray = basicPropertyArray , elementsName = 'userCircles', mustBeOpen = false, fnction = ((card)=>{return card})){
 
 
    return   await superiorCall(newDeck.MainDeck , propertyArray , amount , elementsName , mustBeOpen , 'hand' , fnction)

}

async function callFromOrder( amount, propertyArray = basicPropertyArray , elementsName = 'userCircles', mustBeOpen = false, fnction = ((card)=>{return card})){
 
 
  // if(cost === true && playerObjects.current.rearguardNum < amount){  
  //   //alert cant pay cost
  //   alert('cant pay cost')
  //   return;}

    return   await superiorCall(userZones.orderZone , propertyArray , amount , elementsName , mustBeOpen , 'hand' , fnction)

}

async function callFromTrigger( amount, propertyArray = basicPropertyArray , elementsName = 'userCircles', mustBeOpen = false, fnction = ((card)=>{return card})){

    return   await superiorCall(userZones.trigger , propertyArray , amount , elementsName , mustBeOpen , 'trigger' , fnction)

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


async function toTopDeck(zone ,amount , propertyArray = basicPropertyArray, previousArea= 'hand' ){
 
    return await superiorAdd(zone , newDeck.MainDeck , amount, previousArea , propertyArray )
    
}
async function dropToTopDeck(amount , propertyArray = basicPropertyArray, ){
  return toTopDeck(userZones.drop, amount, propertyArray, 'drop')
}
async function toBotDeck(zone ,amount , propertyArray = basicPropertyArray, previousArea= 'hand' ){
 
    return await superiorAdd(zone , newDeck.MainDeck , amount, previousArea , propertyArray , true)
    
}

async function dropToBotDeck(amount , propertyArray = basicPropertyArray, ){
  return toBotDeck(userZones.drop, amount, propertyArray, 'drop')
}
async function handToBotDeck(amount , propertyArray = basicPropertyArray, ){
  return toBotDeck(userZones.hand, amount, propertyArray, 'hand')
}
async function toDrop(zone ,amount , propertyArray = basicPropertyArray, previousArea= 'hand' ){
 
    return await superiorAdd(zone , userZones.drop , amount, previousArea , propertyArray )

}

async function orderToDrop(amount , propertyArray){
 
  return await toDrop(userZones.orderZone ,amount , propertyArray,'orderZone' )
}
async function bindToDrop(amount , propertyArray){
 
  return await toDrop(userZones.bind ,amount , propertyArray,'bind' )
}
///////////////////////////////////
async function toSoul(zone ,amount , propertyArray = basicPropertyArray, previousArea= 'hand' ){
 
    return await superiorAdd(zone , userZones.soul , amount, previousArea , propertyArray )

}
async function handToSoul(amount , propertyArray){
  return await toSoul(userZones.hand ,amount , propertyArray,  'hand' )
}
async function dropToSoul(amount , propertyArray){
  return await toSoul(userZones.drop ,amount , propertyArray, 'drop' )
}

////////////////////////////////////
async function toBind(zone ,amount , propertyArray = basicPropertyArray, previousArea= 'hand' ){


    return await superiorAdd(zone , userZones.bind , amount, previousArea , propertyArray )
}

async function dropToBind(amount , propertyArray){
 return await toBind(userZones.drop ,amount , propertyArray,'drop' )
}

async function toDamage(zone ,amount , propertyArray = basicPropertyArray, previousArea= 'hand' ){
 

    return await superiorAdd(zone , userZones.damage , amount, previousArea , propertyArray )

}
async function toOrder(zone ,amount , propertyArray = basicPropertyArray, previousArea= 'hand' ){


    return await superiorAdd(zone , userZones.orderZone , amount, previousArea , propertyArray )

}
async function handToOrder(amount , propertyArray){
  return toOrder(userZones.hand ,amount , propertyArray ,'hand' )
}
async function deckToOrder(amount , propertyArray){
  return toOrder(newDeck.MainDeck ,amount , propertyArray ,'deck' )
}

/////////////////////////////////////
async function toHand(zone ,amount , propertyArray = basicPropertyArray, previousArea= 'hand' ){


    return await superiorAdd(zone , userZones.hand , amount, previousArea , propertyArray )

}
async function bindToHand(amount , propertyArray){
  return toHand(userZones.bind ,amount , propertyArray ,'bind' )
 }
async function dropToHand(amount , propertyArray){
 return toHand(userZones.drop ,amount , propertyArray ,'drop' )
}
async function deckToHand(amount , propertyArray){
  return toHand(newDeck.MainDeck ,amount , propertyArray , 'deck' )
}
async function soulToHand(amount , propertyArray){
  return toHand(userZones.soul ,amount , propertyArray , 'soul' )
}
////////////////////////////////////////
async function toRemoved(zone ,amount , propertyArray = basicPropertyArray, previousArea= 'hand' ){

    return await superiorAdd(zone , userZones.removed , amount, previousArea , propertyArray )

}

async function mill(amount){//zone changes that dont need user input
   let len = newDeck.MainDeck.length
  
    let temp = newDeck.MainDeck.splice( len - amount , len-1)
    userZones.drop.push(...temp)
}
async function bindTop(amount){//zone changes that dont need user input
  let len = newDeck.MainDeck.length -1
  let temp = newDeck.MainDeck.splice( len , amount)
  userZones.bind.push(...temp)
}
 

  //for cards that increasepower based on zoneamounts , when changing value , check new number of amountinzone , then add tot tempower and subtract previous
function joinZones(zone1 , zone2){
 
  return   zone1.concat(zone2)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// async function retireRG(amount, element,cost){//check if cost, if cost cant be paid return
 

//in resetfield have an object that does various functions for cards that continuously change properties
//make getunitinrfont, get column , get row

async function unhighlightUserCircles(){
  let units= Object.values(userCircles)
  for(let i =0 ; i<units.length; i++)   { 
    let unit = units[i].unit

    if(unit){
      unit['beingAttacked'] = false
      let img = await getUnitImg(unit.circle)
      highlight(img , null)
    }

 }
}
async function unhighlightOpponentCircles(){
  let units= Object.values(currentOpponentCircles.current)
  for(let i =0 ; i<units.length; i++)   { 
    let unit = units[i].unit
    if(unit){
      let circleId = unit.circle.replace('user' , 'opponent')
      let img = await getUnitImg(circleId)
      highlight(img , null)
    }

 }
}
async function choose(amount , zone , propertyArray , func =(card)=>{}, upTo = true){//choose from zone and do function on it

let selected = await clickAbilityZone(zone , amount ,propertyArray, upTo)

for(let i =0 ; i<selected.length; i++)   { 
 //if doesnt work 

func(selected[i])
}
}
async function chooseUnits(amount , propertyArray = basicPropertyArray, func = (unit)=>{} , player = userCircles , upTo = false, clickedProperty= ''){
  display('Choose ' + amount + ' Units')
  if(amount === 1 && propertyArray === vanguard()){
    func(userCircles.userVG.unit)
    return
  }
 
  let units = await chooseUnitsHandler(amount , propertyArray ,undefined, clickedProperty, upTo,)
 
  for(let i =0 ; i<units.length; i++)   { 
    let unit = player[units[i]].unit
    
func(unit)
    let img = await getUnitImg(units[i])
    highlight(img , null)
 }

//  closeAbilityZone()

return units
}
async function clickCircles(amount , circles = 'userCircles' , mustBeOpen = false , rgOnly = false){
setConfirm(true)
display(`Choose ${amount} circle(s) `)
await waitForElement('confirm')
 
let units = []
let confirmFunc
let circleFunc
await new Promise(resolve=>{
  document.getElementById('confirm').addEventListener('click', confirmFunc = ()=>{
    if(1){
      document.getElementById('confirm').removeEventListener('click', confirmFunc)
      document.getElementById(circles).removeEventListener('click', circleFunc)

      resolve()
    }
   else{timedDisplay('Select circles')}
  
  })



  document.getElementById(circles).addEventListener('click' , circleFunc = async (e)=>{
    let circle = await getCircle(e)


    if(mustBeOpen && circle.children[0]){return}
    if(rgOnly && circle.id === 'userVG'){return}
 
    if(circle.style.border === redBorder){
      highlight(circle , null)
 
    }
    else if(circle.style.border !== redBorder){
      highlight(circle , redBorder)
      if(amount === 1){
        document.getElementById('confirm').click()
      }
    }
    
  })



})
let allCircles
if(circles.includes('opponent')){
  allCircles = Object.keys(currentOpponentCircles.current)
}
else{
  allCircles = Object.keys(userCircles)
}
for(let i =0;i<allCircles.length;i++){
  let check = document.getElementById(allCircles[i])
  if(check.style.border === redBorder){
    highlight(check , null)
    units.push(check.id)
  }


}
 
return units
}
 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function retireYourRearguards(amount , propertyArray = basicPropertyArray ,func = (unit)=>{retire(unit)} ,upTo = false){
 
  let beforeCircles = await searchCircles(rearguard())
  let newProp = await newPropertyArray([rearguard() , propertyArray])
  let clicked = ''

  if(payingCost()){
    clicked = 'retireValue'
  }
 
  await chooseUnits(amount , newProp, func , undefined, upTo, clicked)
  
  let afterCircles = await searchCircles(rearguard())
  if(beforeCircles.length !== afterCircles.length){
    thisTurn.current.yourRearguardWasRetiredThisTurn = true
  }
}
async function soulYourRearguards(amount , propertyArray = basicPropertyArray , func = (unit)=>{soul(unit)} ){
  let newProp = await newPropertyArray([rearguard() , propertyArray])
  await chooseUnits(amount , newProp, func , userCircles)
}
async function bindYourRearguards(amount , propertyArray = basicPropertyArray, func  = (unit)=>{bind(unit)}){
  let newProp = await newPropertyArray([rearguard() , propertyArray])
  await chooseUnits(amount , newProp, func , userCircles)
}
async function bounceYourRearguards(amount , propertyArray = basicPropertyArray ,func = (unit)=>{bounce(unit)} ){
  let newProp = await newPropertyArray([rearguard() , propertyArray])
  await chooseUnits(amount , newProp, func  , userCircles)
}
async function increaseUnitsPowerEndTurn(amount ,  power , propertyArray ,func= (unit)=>{increasePowerEndTurn(unit,  power)}  ){
  await chooseUnits(amount , propertyArray, func , userCircles)
}
async function increaseUnitsPowerEndBattle(amount , power ,  propertyArray , func = (unit)=>{increasePowerEndBattle(unit,  power)} ){
  await chooseUnits(amount , propertyArray, func , userCircles)
}
async function restYourRearguards(amount , propertyArray = basicPropertyArray, func  = (unit)=>{rest(unit)}){
  let newProp = await newPropertyArray([rearguard() , propertyArray])
  await chooseUnits(amount , newProp, func , userCircles)
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function changeOpponentUnits(amount , propertyArray = basicPropertyArray , func = ''){
  let circles = await chooseOpponentUnits(1, propertyArray,)

  doOpponentUnits(circles , func)
}
async function chooseOpponentUnits(amount , propertyArray = basicPropertyArray, func = (unit)=>{} , player = opponentCircles,upTo = false){
//get circles to search -> on confirm get array of circles clicked ->return array
display('Choose ' + amount + ' Opponent Unit(s)')

 let circles = await chooseUnitsHandler(amount , propertyArray , 'opponent','',upTo = false)

for(let i =0 ; i<circles.length; i++)   { 
  let oppCircle = circles[i].replace('user' , 'opponent')
  let img = await getUnitImg(oppCircle)
  highlight(img , null)
}
 
return circles
}
async function chooseUnitsHandler(amount , propertyArray , player= 'user', clickedProperty = '',upTo = false){
  //search circles for units with propertyarray and do clickcircles on them
 
let circles = await searchCircles(propertyArray , player)
 
if(circles.length === 0){return []}
if((circles.length < amount) && doingEffect() && upTo === false){
amount = circles.length
}

if(player === 'opponent'){
 circles =  circles.map((circle)=>{return circle.replace('user' , 'opponent')})
}

      let arr = []
      // let element = document.getElementById('userCircles')
      let element = ''
      let clickedAmount = 0
      let add = (async ()=>{
        // // var index = Array.from(element.children).indexOf(event.target.closest('.card'))
    
        let circle = await getCircle(event)
        // if(rgOnly && circle.id === 'userVG'){return}
       
        let img = await getUnitImg(circle.id)
        if(img.style.border === blueBorder ){
          if(clickedProperty){
            let card = userCircles[circle.id].unit
            clickedAmount = clickedAmount - card[clickedProperty]
 
          }
          else{
            clickedAmount --
          }
          
         
          highlight(img, transparentBorder)
    
         }
          else if (img.style.border !== blueBorder )
          {
          highlight(img , blueBorder  )
          if(clickedProperty){
            let card = userCircles[circle.id].unit
            clickedAmount = clickedAmount + card[clickedProperty]
 
          }
          else{
            clickedAmount ++
          }
          
         
    
          }
      
      }) 
      let confirmFunction
     setConfirm(true)

     await waitForElement('confirm')  

      await new Promise(resolve =>
      
        {        

          for(let i =0; i<circles.length; i++)    { 
     element = document.getElementById(circles[i])

    element.addEventListener("click", add ,  document.getElementById(`confirm`).addEventListener('click', confirmFunction = (()=>{
      if(payingCost()){
        /**
         * when payingcost mmust be ===
         * when doing upto amount - clickabilityzone
         * when doing as much as posible if amountavailable < amount, amount = amountavailable chooseunit
         */
        
      }
      if(upTo === true && amount >= clickedAmount){
        resolve()
      }
      if( amount === clickedAmount){
     
        resolve()
      }
      else{
        timedDisplay(`Select ${amount} units`)
      }
      //comeback
      } ) ) )
      }}
      )


       for(let i =0 ; i<circles.length; i++)   { 
        let tempElement = document.getElementById(circles[i])
        tempElement.removeEventListener("click", add)
     }
      document.getElementById(`confirm`).removeEventListener("click", confirmFunction)
      let keys = Object.keys(userCircles)
         circles = Object.values(userCircles)
      if(player === 'opponent'){
        keys = Object.keys(currentOpponentCircles.current)
        circles = Object.values(currentOpponentCircles.current)
      }
        for(let i =0;i<circles.length -1;i++){

            if(circles[i].unit){
             
              
              let img = await getUnitImg(keys[i])
         
              if(img.style.border === blueBorder ) {
      
                let circle = circles[i].unit.circle
                arr.push(circle)
    
           // await func(circles[i].unit)
             }
            }
    
        }
    
  
      
      return arr
}

async function chooseAnyPlayersUnits(amount , propertyArray = rearguard() ,clickedProperty = ''){
  
let circles = await searchCircles(propertyArray , 'user')
let opponentCircles = await searchCircles(propertyArray , 'opponent')

if(circles.length === 0 && opponentCircles.length === 0){return {user:[], opponent:[]}}
opponentCircles =  opponentCircles.map((circle)=>{return circle.replace('user' , 'opponent')})
 

      let userArr = []
      let oppArr = []
      // let element = document.getElementById('userCircles')
      let element = ''
      let clickedAmount = 0
      let add = (async ()=>{
        // // var index = Array.from(element.children).indexOf(event.target.closest('.card'))
        let circle = await getCircle(event)
        let img = await getUnitImg(circle.id)
        if(img.style.border === blueBorder ){
          if(clickedProperty){
            clickedAmount = clickedAmount - card[clickedProperty]
          }
          else{
            clickedAmount --
          }
          highlight(img, transparentBorder)
    
         }
          else if (img.style.border !== blueBorder )
          {
          highlight(img , blueBorder  )
          if(clickedProperty){
            clickedAmount = clickedAmount + card[clickedProperty]
          }
          else{
            clickedAmount ++
          }
          }
      
      }) 
      let confirmFunction
     setConfirm(true)

     await waitForElement('confirm')  

      await new Promise(resolve =>
      
        {        

          for(let i =0; i<circles.length; i++)    { 
     element = document.getElementById(circles[i])

    element.addEventListener("click", add ,  document.getElementById(`confirm`).addEventListener('click', confirmFunction = (()=>{
      if( amount >= clickedAmount){
     
        resolve()
      }
      else{timedDisplay('click less circles')}
      //comeback
      } ) ) )
      }


      for(let i =0; i<opponentCircles.length; i++)    { 
        element = document.getElementById(opponentCircles[i])
   
       element.addEventListener("click", add ,  document.getElementById(`confirm`).addEventListener('click', confirmFunction = (()=>{
         if( amount >= clickedAmount){
        
           resolve()
         }
         else{timedDisplay('click less circles')}
         //comeback
         } ) ) )
         }
    
    
    
    }
      )
 
       for(let i =0 ; i<circles.length; i++)   { 
        let tempElement = document.getElementById(circles[i])
        tempElement.removeEventListener("click", add)
     }
     for(let i =0 ; i<opponentCircles.length; i++)   { 
      let tempElement = document.getElementById(opponentCircles[i])
      tempElement.removeEventListener("click", add)
   }
      document.getElementById(`confirm`).removeEventListener("click", confirmFunction)
      let keys = Object.keys(userCircles)
         let tempUserCircles = Object.values(userCircles)
 
        let oppKeys = Object.keys(currentOpponentCircles.current)
        let tempOppCircles = Object.values(currentOpponentCircles.current)
 
        for(let i =0;i<tempUserCircles.length -1;i++){

            if(tempUserCircles[i].unit){

              let img = await getUnitImg(keys[i])
         
              if(img.style.border === blueBorder ) {
      
                let circle = tempUserCircles[i].unit.circle
                userArr.push(circle)
                img.style.border = transparentBorder
             }
            }
        }

        for(let i =0;i<tempOppCircles.length -1;i++){

          if(tempOppCircles[i].unit){

            let img = await getUnitImg(oppKeys[i])
       
            if(img.style.border === blueBorder ) {
    
              let circle = tempOppCircles[i].unit.circle
              
              oppArr.push(circle)
              img.style.border = null
           }
          }
      }
  
      
 


return {
  user : userArr,
  opponent: oppArr
}
}

async function retireAnyPlayersRearguards(amount , propertyArray = rearguard() ){
  let circles = await chooseAnyPlayersUnits(amount , propertyArray = rearguard())
  let user = circles.user
  let opponent = circles.opponent

  for(let i =0;i<user.length;i++){

    retire(userCircles[user[i]] .unit)
  }

  await removeOpponentUnits(opponent , 'retire')


}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function getUnitInFront( unit){ 
  let circle = unit.circle
  if(circle.includes('F')){return}
  if(circle === 'userBCRG'){return userCircles['userVG'].unit}
  let frontCircle = circle.replace('B'  , 'F')

  return userCircles[frontCircle].unit
}

async function getUnitBehind( unit){ 
  let circle = unit.circle
  if(circle.includes('B')){return}
  if(circle === 'userVG'){return userCircles['userBCRG'].unit}
  let frontCircle = circle.replace('F'  , 'B')

  return userCircles[frontCircle].unit
}
async function getUserColumn(){ //returns the circleids of the column of the given unit
  //replace userF(R)RG with  L to get opponentcol
  let circle = await clickCircles(1)
  let userCol = await getColumn(circle[0])
  //
  return userCol.user
  }
//func maunphase swap
async function getOpponentColumn(){ //returns the circleids of the column of the given unit
//replace userF(R)RG with  L to get opponentcol
let circle = await clickCircles(1 , 'opponentCircles')
let oppCol = await getColumn(circle[0].replace('opponent' , 'user'))

return oppCol.opponent
}
async function getColumn(circle){
//give each circle a column key
let key = ''
if (circle === 'userVG'){key = 'C'}
else{
  key = circle[5]
}
 return columns.current[key]
}
//
const columns = useRef({ //for accel make addcircle funcion that edits this
  'L': {'user':['userBLRG' ,'userFLRG' ] ,
        'opponent' : ['userBRRG' ,'userFRRG' ] ,
        },
  'C': {'user':['userBCRG', 'userVG'] ,
        'opponent' : ['userBCRG', 'userVG']
        },
  'R': {'user':['userBRRG', 'userFRRG'] ,
        'opponent' :['userBLRG', 'userFLRG'] ,
        },

})
async function getOtherUnitInColumn(unit){//returns other unit in column

let col = await getColumn(unit.circle)
let otherCircle = col.filter(circle =>{ circle !== unit.circle})

return userCircles[otherCircle].unit

}

//do not use for circle removal

async function doAllUnits(propertyArray , func = (card)=>{}){
  let array = await searchCircles(propertyArray)
  for(let i =0; i<array.length; i++){
    let unit = userCircles[array[i]].unit
    func(unit)
}
}
async function doAllOpponentUnits(propertyArray = rearguard() , func = ''){
  let array = await searchCircles(propertyArray , 'opponent')
 
await removeOpponentUnits(array , func, )

}
async function retireAllOpponentsRearguards(propertyArray){
  doAllOpponentUnits(propertyArray , 'retire')
}
 async function standAll(propertyArray){
  return await doAllUnits(propertyArray , (unit)=>{standThisUnit(unit)})
 }
async function increaseAllUnitsPowerEndTurn(propertyArray, amount){
  return await doAllUnits(propertyArray , (unit)=>{increasePowerEndTurn(unit , amount)})
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function retire(unit ){
 
  unit.state = 'retired'//for retired by battle or retired by effect check current ability or turnstate
  unit.place = 'drop'
  unit.previousArea = 'RC'
  userZones.drop.push(unit)
  turnState.current.event = 'retired'
    eventCard.current.retired.push(unit)
  let  circle = unit.circle 
  userCircles[circle].unit =null
  setUserZones({...userZones})
  let otherUnit = currentOpponentCircles.current.opponentVG

  if(turnState.current.card){
    otherUnit = turnState.current.card
  }
  
  if(yourCard(otherUnit)){
    addToYourLog('retire' , unit, otherUnit)

  }
  else{
    //tell opponent to addto their log
    socket.emit('fightUpdate', { roomId :roomID,  command:'sendEvents', item :{action:'retire' , opponentCard:unit, card:otherUnit}})
  }
}
async function opponentRetire(circle){

  let unit = userCircles[circle].unit
 
  if(!unit || unit.place === 'VC'){return}
 
      if(unit.opponentRetire){
 
      await retire(unit)
    }
}
async function bind(unit ){
 
  unit.state = 'bound'//for retired by battle or retired by effect check current ability or turnstate
  unit.place = 'bind'
  unit.previousArea = 'RC'
  userZones.bind.push(unit)
    eventCard.current.bound.push(unit)
  let  circle = unit.circle 
  userCircles[circle].unit =null
  setUserZones({...userZones})
}
async function opponentBind(circle){

  let unit = userCircles[circle].unit
  if(!unit || unit.place === 'VC'){return}
  await bind(unit)
 
}
async function damage(unit ){
 
  unit.state = 'retired'//for retired by battle or retired by effect check current ability or turnstate
  unit.place = 'damage'
  unit.previousArea = 'RC'
  userZones.damage.push(unit)
  let  circle = unit.circle 
  userCircles[circle].unit =null
  setUserZones({...userZones})
}
async function opponentDamage(circle){
    let unit = userCircles[circle].unit
    if(!unit || unit.place === 'VC'){return}
      await damage(unit)

}
async function soul(unit ){
  unit.state = 'putIntoSoul'//for retired by battle or retired by effect check current ability or turnstate
  unit.place = 'soul'
  unit.previousArea = 'RC'
  userZones.soul.push(unit)
    turnState.current.event = 'souled'
    eventCard.current.souled.push(unit)
  let  circle = unit.circle 
  userCircles[circle].unit =null
  setUserZones({...userZones})
}

async function opponentSoul(circle){

  let unit = userCircles[circle].unit
  if(!unit || unit.place === 'VC'){return}
  await soul(unit)
 
}
async function order(unit ){
 
  unit.state = 'order'//for retired by battle or retired by effect check current ability or turnstate
  unit.place = 'order'
  unit.previousArea = 'RC'
  userZones.order.push(unit)
  let  circle = unit.circle 
  userCircles[circle].unit =null
  setUserZones({...userZones})
}
async function opponentOrder(circle){

    let unit = userCircles[circle].unit
    if(!unit || unit.place === 'VC'){return}
      await order(unit)

}
async function bounce(unit ){//comeback
 
  unit.state = 'bounced'//for retired by battle or retired by effect check current ability or turnstate
  unit.place = 'hand'
  unit.previousArea = 'RC'
  userZones.hand.push(unit)
  turnState.current.event = 'bounced'
  eventCard.current.bounced.push(unit)
  let  circle = unit.circle 
  userCircles[circle].unit =null
await searchAbilities()

}
async function opponentBounce(circle){

  let unit = userCircles[circle].unit
  if(!unit || unit.place === 'VC'){return}
  await bounce(unit)
}
async function topDeckUnit(unit ){
 
  unit.state = 'retired'//for retired by battle or retired by effect check current ability or turnstate
  unit.place = 'deck'
  unit.previousArea = 'RC'
  newDeck.MainDeck.push(unit)
  let  circle = unit.circle 
  userCircles[circle].unit =null
  setUserZones({...userZones})
}
async function opponentTopDeck(circle){
  
    let unit = userCircles[circle].unit
    if(!unit || unit.place === 'VC'){return}
      await topDeckUnit(unit)
 
 
}
async function botDeckUnit(unit ){
 
  unit.state = 'retired'//for retired by battle or retired by effect check current ability or turnstate
  unit.place = 'drop'
  unit.previousArea = 'RC'
  newDeck.MainDeck.unshift(unit)
  let  circle = unit.circle 
  userCircles[circle].unit =null
  setUserZones({...userZones})
}
async function opponentBotDeck(circle){
 
    let unit = userCircles[circle].unit
    if(!unit || unit.place === 'VC'){return}
      await botDeckUnit( unit)
 
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//searchzones
//functions return true or false
async function nameSearch(zone , name){

}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
 



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ability functions , overdress alchemagic so on

async function perfectGuard(amount  = 1 , propertyArray = basicPropertyArray){

  await chooseUnits(amount , propertyArray , (card)=>{card.canBeHit = false

    // untilEndBattle(()=>{card.canBeHit = true}  , card , )

  })

}

function finalRushEndTurn(unit){
 
  playerObjects.current.finalRush = true
  addToYourLog('finalRush' , undefined , unit)
  untilEndTurn(()=>{
    playerObjects.current.finalRush = false
  },
  unit , 'units')
}


async function makeOriginalDress(originalsUnits){
  //change cardtype to originalDress,
  let newUnits = []
  for (let i = 0;i<originalsUnits.length;i++){
    let card = originalsUnits[i]
    //resetunit
    card.cardtype = 'originalDress'
    let circle = card.circle
    userCircles[circle].unit = null
    newUnits.push(card)
  }
  //return array and add to unit.originalDress

  return newUnits
}

async function hasOverDress(unit){
 
  if(unit.hasOverDress){
    return true
  }
 
return false
}
//search circles function with function parameter
async function searchCirclesOverDress(){
  let circles = Object.values(userCircles)
  let results = []
  for(let o = 0;o<circles.length;o++){
    if(circles.unit != (null|| undefined)){
      if(hasOverDress(circles.unit)){
        results.push(circles.unit)
      }
    }
  }
  return results
}

async function superiorOverDress(overdressUnit ,  originalDress){
  let circle = originalDress.circle
  doOverDress(overdressUnit ,  originalDress)
  removeById(userZones[overdressUnit.place ] , overdressUnit.id )
  await call(overdressUnit , circle , overdressUnit.place , (unit)=>{stand(unit)})
  
}

async function doOverDress(overdressUnit ,  originalDress){//make leave field function 
  //check if has originals dress
  overdressUnit['isOverDress'] = true
  let original = []

  if(Array.isArray(originalDress.originalDress) ){
    original = [...originalDress.originalDress]
    original.push(originalDress)
  }
  else{
    original.push(originalDress)
  }
 
  let newOriginal = await makeOriginalDress(original)

  overdressUnit['originalDress'] = newOriginal

}

async function overDress(overDressUnit){//check if unit can overdress with onclick unit if cant return and do overdress popup
  //click oberdress in hand -> search for originaldress unit on rc -> if true prompt for overdress -> on overdress click wait for orignialdress click
  //->do overdress on it ,move original to originaldress property 

  //search for rc unit

 let search = await chooseUnits(1,overDressUnit.dressMaterial , async(unit)=>{
  let circle = unit.circle
  await doOverDress(overDressUnit , unit)
 } )
 document.getElementById('wait').click()
}

async function checkOverDress(overDressUnit){//come back
  if(!overDressUnit.hasOverDress){return false}
  let circleUnits = Object.values(userCircles)
  let material = overDressUnit.dressMaterial
  material = newPropertyArray(material , rearguard())


  if(material === (null || undefined)){return false}
  let circles = await searchCircles(material , undefined , true)
  if(circles.length > 0){
    return true
  }
  return false
}

async function sing(order){
  let abilities = Object.values(order.abilities)

let ability = abilities[abilities.length -1]
  
  
  await resolveAbility(ability, order)
  
  turnFaceDown(order)
}

async function singOrder(amount , propertyArray =[
  {"cardProperty" :  'cardtype' , "propertyToFind": 'Song' , "condition": 'includes'},
  {"cardProperty" :  'faceup' , "propertyToFind": true , "condition": '='},

]){//basicproper
  
  let orders = await clickAbilityZone(userZones.orderZone, amount , propertyArray, false)
  let selected = orders.selected
  if(selected.length === 0){return}
  for (let i =0;i<selected.length;i++){
    await sing(selected[i])
  }
}

function makeWorld(world){
playerObjects.current.world = world

}




















//make getFaceDown
//select order -> set state to sung -> do resolveability(song) -> turn facedown
//////////////////////////////////////////////////////////////////////////////////
// faceup/down functions

function turnFaceDown(card){
  if(!card.faceup){return}
  let temp = card.img
  card.img = card.back
  card.back = temp
  card.faceup = false
}

function turnFaceUp(card){
  if(card.faceup){return}
  let temp = card.img
  card.img = card.back
  card.back = temp
  card.faceup = true
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//-order
async function setOrderHandle(order){
  let oldPlace = order.place
order.state = 'putInto'
order.place = 'orderZone'

addToZone(userZones[oldPlace] , userZones.orderZone,  [order] )

}


async function orderCheckHandler(order){
  //fix
  if(order.canBePlayed === true){
    return true;
  }

  if(order.cardtype.includes('Blitz Order') && playerTurn){
    return false
  }
  else if((order.cardtype.includes('Set Order')||order.cardtype.includes('Normal Order')) && playerTurn === false){
    return false
  }
  if( order.place === 'hand' && await order.orderEffects.condition() && order.tempGrade <= userCircles.userVG.unit.tempGrade ){
    
    let canPay =false
  
if(order.orderEffects.cost === null){return true}
      let playerAbilities =  playerFunctions.current[turnState.current.event]
      if(playerAbilities){ 
        let newOrder = {...order.orderEffects}

      for(let i =0; i<playerAbilities.length ; i++){
      
       playerAbilities[i].effect(newOrder)
     }

     canPay = await costChecker(newOrder.cost, order);
      }
      else{
        canPay = await costChecker(order.orderEffects.cost, order);
      }
 
    if(canPay === true){
      return true
    }

  }
  else{order.canBePlayed = false
  return false}
}

async function orderCheck(){
  //loop through all zones and check if order condition is true , then set order.canbeplayed = true
  let tempArray = []
  let zones =  Object.values(userZones) 
  if(playerObjects.current.canAlchemagic){
    turnState.current.event = 'Alchemagic'
  }
  for(let i =0; i<zones.length ; i++){
   let tempZone = zones[i]
   
   for(let i =0; i<tempZone.length ; i++){

   let tempCard = tempZone[i]
  
   if(tempCard != (null || undefined) && tempCard.cardtype.includes('Order')){
    
    let check = await orderCheckHandler(tempCard)
    
    if(check === true){
          tempArray.push(tempCard)
    }

   }
   }
  }
  return tempArray
}
async function play(order){

  return  await resolveAbility(order.orderEffects , order)
}
async function playOrder(){
  if(playerObjects.current.ordersToPlay === playerObjects.current.ordersPlayedAmount){
    timedDisplay('Cannot play anymore orders this tuen')
    return;
  }
//do a separate chekc for if order can be played

  //leep track of ordersplayed
  let order
  turnState.current.event = 'orderCheck'
  let tempArray = await orderCheck()
  if(tempArray.length === 0){
    timedDisplay('No Orders to play')
    return
  }
  let playOrder
  let confirmFunction

  setAbilityZone(tempArray)
  setShowAbilityZone(true)
 
//addeventlister to class zone
 await waitForElement('abilityZone')
// await new Promise( (resolve)=>{


await new Promise(resolve => document.getElementById(`abilityZone`) .addEventListener("click", playOrder = (async()=>{
   document.getElementById(`confirm`) .addEventListener("click", confirmFunction = ()=>{  closeAbilityZone();resolve()})
  let index = Array.from(document.getElementById(`abilityZone`).children).indexOf(event.target.closest('.card'))
  //pushintouserorderarea
 
  order = tempArray[index]
  if(!order){
    document.getElementById(`confirm`).click()
    return
  }
  document.getElementById(`confirm`) .removeEventListener("click", confirmFunction)
  turnState.current.state === 'Order'
  //handle
  if(order.cardtype.includes('Normal Order')){
   order = await checkAlchemagic(order)
  }
  // eventCard.current = order

  //change tunrstate
  //hendrina and headhunter check

  await searchAbilities()
  await waitAbilities()
  
  setCurrentAbility(order.orderEffects) ;

  let paid =  await play(order)

    let orderPlace = order.place
  


  await searchAbilities()
  await waitAbilities()
  if(paid === true) {


  if(order.cardtype.includes('Normal Order') || order.cardtype.includes('Blitz Order')){

   if(order.cardtype.includes('Arms')){
     
      arm(order)
  
    }
  else{
    putDrop([order])
  }
  await removeById(userZones[orderPlace] , order.id)
  }
  else if(order.cardtype.includes('Set Order')){
 
    setOrderHandle(order)
  }
playerObjects.current.ordersPlayedAmount ++ 
  }
  //another function to set all blitz orders to cant be played
  
  closeAbilityZone()
  resolve()

}) , {once:true} )

).then(()=>{
  // set hand as useref to allow new cards to be guardesd with
 //document.getElementById(`abilityZone`) .removeEventListener("click", playOrder)


 
 
})
await searchAbilities()
await waitAbilities()
await searchAbilities()
 setUserZones({...userZones})
 }  



//-act ability
async function actAbilityCheck(){
//do actAbilityCheckCircles, set lookingForAct = true
await actAbilityCheckCircles()
if(showZone){
  await actAbilityCheckZone(zone)
}

}

async function actAbilityCheckCircles(){

  let circlesAbility =  Object.values(userCircles) 
  let actListener
     if(!document.getElementById('userCircles'))
{return}  
  for(let i =0; i<circlesAbility.length ; i++){
   let tempCard = circlesAbility[i].unit
 
   if(tempCard != (null || undefined)){
 
       if(tempCard.abilities != (null || undefined)){
               let tempCardAbilities = Object.values(tempCard.abilities)
               let circle = tempCard.circle
               let img =  await getUnitImg(circle)
      
     if(playerObjects.current.phase !== 'main' && img.style.border === orangeBorder){
      highlight(img, null) 
 
      document.getElementById(circle).removeEventListener("click" ,Listeners.current.actListener )
 
     }
  else if(playerObjects.current.phase === 'main'){
   for(let j =1; j<=tempCardAbilities.length  ; j++){
     let index = 'ability' + j

      if(tempCard.abilities[index].type === 'ACT'  && !check1Turn(index, tempCard) && await tempCard.abilities[index].condition(tempCard) ){
         //highlight and add eventlistener
 
         highlight(img, orangeBorder) 
         
        document.getElementById(circle).addEventListener("click" , (Listeners.current.actListener = async (e) =>{
          //if currently resolving return
          if(isInAbility()){return}
          let newCircle = await getCircle(e)

 

            setActAbility(userCircles[newCircle.id].unit)
          setCurrentAbility(tempCard.abilities[index])
          setPopupWord('')
          setPopup(true)
          
          await new Promise(resolve => document.getElementById('ability-wait').addEventListener("click", (()=>{

            setActAbility(null)
            resolve();
            //do for zones , disable buttons do confirm
            } ) , {once:true})
            
            );

        }))
      
   }
 
   }
 //save list of abilities that can be activated and send them to opup
}


   }
 
  }
}

}

async function actAbilityCheckZone(zone){
  //go to game and add check to zone expand, if lookingForAct === true check zone foraa act abilities

  let actListener
  for(let i =0; i<zone.length ; i++){
   let tempCard = zone[i]
   if(!document.getElementById('zoneCards'))
{return}  
    let elementArray = Array.from( document.getElementById('zoneCards').children)
 
   if(tempCard != (null || undefined)){
 
    let ele = elementArray[i]
 
       if(tempCard.abilities != (null || undefined)){
               let tempCardAbilities = Object.values(tempCard.abilities)
 
   for(let j =1; j<=tempCardAbilities.length  ; j++){
     let index = 'ability' + j  
 
 if(!tempCard.abilities[index].condition){return}
      if(await tempCard.abilities[index].condition(tempCard) && tempCard.abilities[index].type === 'ACT'){
         //highlight and add eventlistener
 
        let circle = elementArray[i]
        let ele = elementArray[i]
 
        highlight(ele , orangeBorder)
        ele.addEventListener("click" , actListener = async (e)=>{
          let newCircle = await getCircle(e)
          if(isInAbility()){return}
          if(phase=== 'main'){          
          setActAbility(zone[i])
          setCurrentAbility(tempCard.abilities[index])
          setPopupWord('')
          setPopup(true)
          setShowZone(false)
          highlight(ele , transparentBorder)
          await new Promise(resolve => document.getElementById('ability-wait').addEventListener("click", (()=>{

            setActAbility(null)
            resolve();
            //do for zones , disable buttons do confirm
            } ) , {once:true})
            
            );
          //await click 
 
         //get card id
          //event.target.closest('.card') for highlighting
          //setactcard = event.target
        }
        })
       
 
  
 
   }
 
   }
 
   }
 
  }
}

}
//-cont ability
async function contAbilityCheck(ability , card){

   let condition = await ability.condition(card) 

  if(condition && ability.isOn === false){
    turnState.current.card = card
    ability.on(card )
    ability.isOn = true

  }
  else if(condition === false && ability.isOn === true){
   
    ability.off(card )
   ability.isOn = false
  }

  return ability
}


// -auto ability
const resolveAbility = async (ability , card, index) =>{
  //check for h and s 1/turn
  //perhaps add confirm.click() to onContextMenu for accessibility
  let check 
  let oncePerTurn = ability['1/Turn']
  let usedOncePerTurn = ability['Used1/Turn']
  if(oncePerTurn && usedOncePerTurn){
    timedDisplay('Used ' + card.name + "'s ability this turn")
    if(index > -1){
      abilitiesList.current.splice( index , 1);
      setMainDeck([...MainDeck])
    }
    if(abilitiesList.current.length === 0 &&  document.getElementById("abilityStack")){

      document.getElementById("abilityStack").click()
   
    }
    return
  }
  display(ability.text)
  turnState.current.inAbility =  true
  turnState.current.card = card
  turnState.current.ability = ability
  if(ability.cost){
    try{

      check = await costChecker(ability.cost, card)
    }
    catch{
      display('Problem with checking the cost of ' + card.name)
    }
}
costPaid.current = true
  if(ability.cost && check === false){
    timedDisplay('Cannot pay cost')
 
    if(index > -1){
 
      abilitiesList.current.splice( index , 1);
      setMainDeck([...MainDeck])
    }
 
    resetTurnState()
    return
  }
 
  let type = card.cardtype
  turnState.current.state =  'Ability' 
  turnState.current.card = card
  turnState.current.ability = ability

  let prevPhase = phase
  if(ability.cost && check === true){
      setPause(true)
  setPopup( true)
  const cost = document.getElementById('ability-wait')
  await new Promise(resolve => cost.addEventListener("click", (()=>{

    resolve();
    
    } ) , {once:true})
    
    );
  }

 
if(costPaid.current === true){
 // costPaid.current = true
 //socket.emit('fightUpdate', { roomId :roomID,  command:'resolveAbility', item :{turnState: turnState.current}})
      if(ability.cost !=  null  ){
                try{
                  turnState.current.state ='payingCost'
 
                  await ability.cost.costEffect(card)
                  await searchAbilities()
                }
                catch{
                  display('Problem with the cost of ' + card.name)
                }
      }

}

if(costPaid.current === true){//only pass card, other parameters will be global
  //resolve 
//if card.target === slef pass self 

try{
  turnState.current.state = 'doingEffect'
 
  await ability.effect.effect(card)
  setShowMessage(false)
  closeAbilityZone()
 if(oncePerTurn === true){
  
  ability['Used1/Turn'] = true
  untilEndTurn(()=>{
    ability['Used1/Turn']  = false
  },
  card , 'units')
}
}
catch{
  display('Problem with the effect of ' + card.name)
}


}

setShowMessage(false)
closeAbilityZone()

//setPhase(prevPhase)
if(index > -1){
  abilitiesList.current.splice( index , 1);

}

if(type.includes('Order') ){
    
  resetTurnState()
  return costPaid.current
}


setMainDeck([...MainDeck])

  await searchAbilities()
await waitOpponentAbilities()
 
costPaid.current = false 
  if(abilitiesList.current.length === 0 &&  document.getElementById("abilityStack")){
    setUserCircles({...userCircles})
    document.getElementById("abilityStack").click()
 
  }
 
  resetTurnState()

}

async function checkings(){
  //wings
if(userZones.orderZone.length > 0){
  let worldNum = await searchZones(userZones.orderZone , world())
  let prisonNum = await searchZones(userZones.orderZone , [{"cardProperty" :  'cardtype' , "propertyToFind": 'Prison' , "condition": 'includes'} ])
    if(worldNum.length === 1 && worldNum.length === userZones.orderZone.length){
  makeWorld('Dark Night')
  }
  else if(worldNum.length > 1 && worldNum.length === userZones.orderZone.length){
    makeWorld('Abyssal Dark Night')
  }
  else if( worldNum.length !== userZones.orderZone.length){
    makeWorld('')
  }  
  if(prisonNum.length >0&& prisonNum.length === userZones.orderZone.length){
    playerObjects.current.hasPrison = true
  }
  }
  
  if(userZones.bind.length > 0){
  
  if(playerObjects.current.checkBlackWings){
    let wing = true
    for(let i = 0;i<userZones.bind.length;i++){
  
      if(userZones.bind[i].tempGrade % 2 === 1){//if odd
        wing = false
      }
    }
    playerObjects.current.blackWings = wing
  
  }
  if(playerObjects.current.checkWhiteWings){
    let wing = true
    for(let i = 0;i<userZones.bind.length;i++){
  
      if(userZones.bind[i].tempGrade % 2 === 0){//if even
        wing = false
      }
    }
    playerObjects.current.whiteWings = wing
  
  }
  }
 
}

async function resetField(){
  //separate stand/rest from state
 
 playerObjects.current.turnState = ''
 turnState.current.event = ''

 opponentTurnState.current.event = ''
 let circlesAbility =  Object.values(userCircles) 


 for(let i =0; i<circlesAbility.length ; i++){
  let tempCard = circlesAbility[i].unit
 
  if(tempCard != (null || undefined)){
// reset state
    tempCard.state = ''
  }

 }
//zones
 let zonesAbility =  Object.values(userZones) 
 let names = Object.keys(userZones) 



 for(let i =0; i<zonesAbility.length ; i++){
  let tempZone = zonesAbility[i]

  for(let j =0; j<tempZone.length ; j++){

  let tempCard = tempZone[j]

  if(tempCard != (null || undefined)){
    // reset state
 
          tempCard.place = names[i]
          if(tempCard.imprisoned){
            tempCard.place = 'prison'
          }
          tempCard.state = ''
          tempCard.previousArea = tempCard.place
 
  }

  }
 }

 let tempZone = userCircles.userGC.guardians
 for(let i =0; i<tempZone.length ; i++){

 let tempCard = tempZone[i]

  if(tempCard != (null || undefined)){
    // reset state
           
          tempCard.place = 'GC'
          tempCard.state = ''
 

  }
 }
 
 setMainDeck([...MainDeck])
}

async function resetUnit(card){
  let prev = card.place
  let newCard = await makeUnit(card , card.id)

  //remove end turn and endbattle for card.id
  newCard.previousArea = prev //do for newplace
  return newCard
}


function makeAbility(unit, type= 'AUTO' , condition = async (un)=>true){
 
const abilityConstructors = {
  AUTO :     {
    "condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false},
    "cost":  {
        "draw": {
            "amount": 1,
            "filter": [{"cardProperty" :  'clan' , "propertyToFind": '' , "condition": '='}]
        },
        'costEffect': async function (unit){draw(this.draw.amount)}
    },
    "effect": {
        "draw": {
            "amount": 1,
            "filter": [{"cardProperty" :  'clan' , "propertyToFind": '' , "condition": '='}]
        },
        'effect': async function (unit){draw(this.draw.amount)}
    },
 "text": "[AUTO](RC):When this unit attacks, COST [Soul Blast (2)],"  + 
 "and this unit gets [Power]+15000 until end of that battle. At the end of that battle, put this unit on the top of your deck.",
"type": "AUTO", 
"1/Turn": false, 
"Used1/Turn": false,
"H1/Turn": false, 
"permanent": true ,

},

CONT :{
    "condition": async function (unit){ if(whenRodeUpon(unit)){return true} return false}, 
     "on": async function (unit){ },
     "off" : async function (unit){ },
     "isOn": false,
     "text": "[CONT](VC/RC):During the battle this unit attacked, this unit gets [Power]+2000.",
     "type": "CONT",
     "permanent" : true
},
ACT : {
   "condition":async function (unit){ }, 
   "cost":{
    "discard" : {
      'amount' : 1,
      'filter' : [{"cardProperty" :  'clan' , "propertyToFind": '' , "condition": '='}]
    } ,
    'costEffect': async function (unit){ },
  }
, 
"effect": {
    "draw": {
        "amount": 1,
        "filter": [{"cardProperty" :  'clan' , "propertyToFind": '' , "condition": '='}]
    },
    'effect': async function (unit){draw(this.draw.amount)}
},
   "text": "[ACT](VC)1/Turn:COST [Discard a card from your hand], choose a grade 0 card from your drop, and call it to (RC).",
   "1/Turn": false,
   "Used1/Turn": false,
   "H1/Turn": false, 
   "type": "ACT", 
   "permanent": true ,
   "costPaid" : false
}
}
let newAbility = abilityConstructors[type]
newAbility['condition'] = async function(un){
if(await condition(un)){return true}return false}

return newAbility
}
function playerFunctionsAbility(unit , effect = async ()=>{}){
  let newAbi = makeAbility(unit , 'AUTO' , ()=>1 )
  newAbi.cost = null
  newAbi.effect['effect'] = effect

  return newAbi
}
function giveAUTOAbility(unit ,condition,  cost , effect){
  let newAbility = makeAbility(unit,'AUTO' , condition)
  newAbility.cost = cost
  newAbility.effect['effect'] = effect

  let abilities = Object.keys(unit.abilities)
  let newName = 'ability'+ (abilities.length +1)
  unit.abilities[newName] = newAbility
  return newName 
}
function giveAUTOAbilityEndTurn(unit ,condition,  cost , effect){
  let abilityId = giveAUTOAbility(unit ,condition,  cost , effect)
  untilEndTurn(()=>{

    removeAbility(unit , abilityId)
  } , unit)


}
function giveCONTAbility(unit ,condition,  onEffect , offEffect){
let newAbility = makeAbility(unit,'CONT' , condition)
newAbility.on = onEffect
newAbility.off = offEffect

let abilities = Object.keys(unit.abilities)
let newName = 'ability'+ (abilities.length +1)
unit.abilities[newName] = newAbility
return newName
}
function giveCONTAbilityEndTurn(unit ,condition,  onEffect , offEffect){
  let abilityId = giveCONTAbility(unit ,condition,  onEffect , offEffect)
  untilEndTurn(()=>{
    removeAbility(unit , abilityId)
  }, unit)


}
async function resolveNewAbility(unit, cost, effect){
  let newAbility = makeAbility(unit)
  newAbility.cost = {...cost}
  newAbility.effect.effect = effect

 resolveAbility(newAbility, unit) 
}
async function addPlayerFunction(turnState , effect , card){
 let item = {effect:effect , card:card , img:card.img, }
  if(playerFunctions.current[turnState]){
    playerFunctions.current[turnState].push(item)
  }
  else{
    playerFunctions.current[turnState] = [item]
  }
}

///////////////////////////////////
//continuouszonechecker(){
/**
 
*/ 

// }
 
async function addContinuousValue(id,zone , amount,  propertyArray = basicPropertyArray, unit, property){
let object = {zone:zone , amount:amount , propertyArray:propertyArray, prevValue: 0, unit:unit, property:property }
continuousValues.current[id] = object
//get new way to do ids
}
async function removeContinuousValue(id){//- unit[cardproperty] - prevValue
  let object = continuousValues.current[id]
  let prop = object.property
  let unit = object.unit
  unit[prop] = unit[prop] - (object.prevValue * object.amount)
  delete continuousValues.current[id]
}
async function addContinuousPowerGain(id,unit , zone , amount,  propertyArray = basicPropertyArray,  ){
  addContinuousValue(id,zone , amount,  propertyArray = basicPropertyArray, unit, 'tempPower')
//do hh zone on zone, if answer !== prevzoneamount update value

}
async function continuousValuesFunctioner(value){
let zone = value.zone
let propertyArray= value.propertyArray
let searchedZone = await searchZones(zone , propertyArray)
let newValue = searchedZone.length
//if zone the same length do nothing , if different update

if(newValue !== value.prevValue){
 

  let property = value.property
  let newAmount = newValue * value.amount 
  value.unit[property] -= value.prevValue
  value.unit[property]  += newAmount
  value.prevValue = newAmount
}

}




 function allOfYourUnits(id, propertyArray = basicPropertyArray, func= (unit)=>{} , removeFunc = (unit)=>{}, ){
//add property to continuous

continuous.current[id] = {
  
    func: func,
    propertyArray : propertyArray,
    removeFunc :removeFunc, 
    id:id
}
setUserCircles({...userCircles})
}
async function yourOpponentCannotInterceptUntilEndTurn(id, unit,  propertyArray){
  yourOpponentCannotIntercept(id, propertyArray)
  untilEndTurn(()=>{removeAllOfYourOpponentsUnits(id )} , unit)
}
 
async function yourOpponentCannotIntercept(id, propertyArray){
 
  allOfYourOpponentsUnits(id, propertyArray , 'cannotIntercept'    )
}
async function yourOpponentCannotBoost(id, propertyArray){
 
  allOfYourOpponentsUnits(id, propertyArray , 'cannotBoost'    )
}
async function decreaseOpponentUnitsPower(id, value, propertyArray){
  allOfYourOpponentsUnits(id, propertyArray , 'increasePower'  , value , )
}

async function allOfYourOpponentsUnits(id, propertyArray = basicPropertyArray , func = ''  , value = 0 , ){
  //rmemove property to continuous
  socket.emit('fightUpdate',  { roomId :roomID,  command:'allOfYourOpponentsUnits', item :{propertyArray :propertyArray ,func: func, value : value, id:id  }})

  }
  async function removeAllOfYourOpponentsUnits(id ){
    //rmemove property to continuous
    socket.emit('fightUpdate',  { roomId :roomID,  command:'allOfYourOpponentsUnits', item :{func: 'remove',  id:id  }})
  
   }

async function removeAllOfYourUnits(  id){
  let current = continuous.current[id]
  if(!current){return}
  let propertyArray = current.propertyArray
  let removeFunc = current.removeFunc

  let units = Object.values(userCircles)
  for(let i = 0; i< units.length ; i++){
    let unit = units[i].unit
    if(unit){
    if(searchUnit(unit , propertyArray) && unit.continuousEffect[id]){
        removeFunc(unit)
        unit.continuousEffect[id] = null
      }

    }
  }
  delete continuous.current[id]
}
  async function continuousAllYourUnits(propertyArray , func = (card)=>{}, removeFunc = (card)=>{} , id ){
    let units = Object.values(userCircles)
    for(let i = 0; i< units.length ; i++){
      let unit = units[i].unit
      if(unit){
 
        if(searchUnit(unit , propertyArray) && !unit.continuousEffect[id]){
          func(unit)
          unit.continuousEffect[id] = {}//make function for this
        }
        if(!searchUnit(unit , propertyArray) &&  unit.continuousEffect[id]){
          removeFunc(unit)
          unit.continuousEffect[id] = null //make function for this
        }
      }
    }
     units = userCircles.userGC.guardians
    for(let i = 0; i< units.length ; i++){
      let unit = units[i] 
        if(searchUnit(unit , propertyArray) && !unit.continuousEffect[id]){
          func(unit)
          unit.continuousEffect[id] = {}//make function for this
        }
        if(!searchUnit(unit , propertyArray) &&  unit.continuousEffect[id]){
          removeFunc(unit)
          unit.continuousEffect[id] = null //make function for this
        }
 
    }
  }
  function boostFunctioner(){
    if(currentBattle.current.boostingIds.length === 0){return}
  let boostingIds = currentBattle.current.boostingIds
  for(let i =0;i<boostingIds.length; i++){
 
    boostingIds[i].funct()
  }
  }
async function continuousFunctioner(){
 await  boostFunctioner()
let continuouses = Object.values(continuous.current)
let keys = Object.keys(continuous.current)
//loop trough continuous and searchunit on each unit , do the same as continuousCondition on each unit, 
for(let i =0; i<continuouses.length ; i++){
  let current = continuouses[i]

  await continuousAllYourUnits(current.propertyArray , current.func, current.removeFunc , current.id)

}//collection of listeners for eden, they get continuoulst rested and iff true change unit reference
 
let conditionalContinuouses = Object.values(conditionalContinuous.current)
let conditionalContinuousesKeys = Object.keys(conditionalContinuous.current)
//for eden
for(let i =0; i<conditionalContinuouses.length ; i++){
  let current = conditionalContinuouses[i]
 
  await contAbilityCheck(current, current.unit)
}
let continuousVs = Object.values(continuousValues.current)
let continuousKs = Object.keys(continuousValues.current)
//for eden
for(let i =0; i<continuousVs.length ; i++){
  let current = continuousVs[i]
 
 await continuousValuesFunctioner(current)
 

}

await checkings()

setMainDeck([...MainDeck])
}
 
//to give unique ids  have number the increases everytime you add to continuous 
 

function makeConditionalContinuous( abilityId, unit, condition = async ()=>{}, onEffect =  ()=>{}, offEffect =  ()=>{}){
  let newCont = makeAbility(unit,'CONT' , condition)

newCont.on = onEffect
newCont.off = offEffect
newCont['unit'] = unit
conditionalContinuous.current[abilityId] = newCont

}

function removeConditionalContinuous(id){

let current = conditionalContinuous.current[id]
if(current.isOn)  current.off(current.unit)
current.isOn = false
delete conditionalContinuous.current[id]

}

function check1Turn(index ,card){
  let ability = card.abilities[index]
  let name = card.name //originalname


  if(ability['1/Turn'] ===true && ability['used1/Turn'] === true){
    return true
  }
 else if(usedHPTs.current[card.name]){
  return true 
 }

return false
}

async function searchCardAbilities(tempCard){
  if(!tempCard.abilities){return}
  let tempCardAbilities = Object.values(tempCard.abilities)
 
  for(let j =0; j< tempCardAbilities.length  ; j++){
 
    let index = 'ability' + (j+1)

    
      if(tempCard.abilities[index].condition !== (null || undefined)&& !check1Turn(index, tempCard)  ){ 
        let condition =await  tempCard.abilities[index].condition(tempCard ) 
 
       if(condition === true && tempCard.abilities[index].type === 'AUTO'){

        abilitiesList.current.push({ability: tempCard.abilities[index] , img:tempCard.img , card : tempCard})
 

      }
      else if(tempCard.abilities[index].type === 'CONT'){//cjeck if cont ability.isOm
        tempCard.abilities[index] = await contAbilityCheck(tempCard.abilities[index] , tempCard)
 
      }
 }

  }
if(tempCard.arms != undefined){
  if(tempCard.arms.right.abilities !=  undefined ){
    await searchCardAbilities(tempCard.arms.right)
  }
  if(tempCard.arms.left.abilities != undefined ){
    await searchCardAbilities(tempCard.arms.left)
  }
}

}

async function searchAbilities(){
  // if conditoin === true, && ability ! inside abilitiesList
  //if ability stacks , add to abilitylist
  //set condition to false at end of resolveability
  //
  await searchCardAbilities(playerObjects.current.abilities)


 let circlesAbility =  Object.values(userCircles) 

 for(let i =0; i<circlesAbility.length -1; i++){
  let tempCard = circlesAbility[i].unit
 
  if(tempCard != (null || undefined)){

      if(tempCard.abilities != (null || undefined)){
        await searchCardAbilities(tempCard)
      }

  }
 
 }
//zones
 let zonesAbility =  Object.values(userZones) 
 for(let i =0; i<zonesAbility.length ; i++){
  let tempZone = zonesAbility[i]
  for(let i =0; i<tempZone.length ; i++){

  let tempCard = tempZone[i]

  if(tempCard != (null || undefined)){

    if(tempCard.abilities != (null || undefined)){
      await searchCardAbilities(tempCard)
    }

}

  }
 }


  let tempZone = userCircles.userGC.guardians
  for(let i =0; i<tempZone.length ; i++){

  let tempCard = tempZone[i]

  if(tempCard != (null || undefined)){

      if(tempCard.abilities != (null || undefined)){
        await searchCardAbilities(tempCard)
      }

  }
  }


 //send opponentabilities
socket.emit('fightUpdate',  { roomId :roomID,  command:'updateAbilities', item :abilitiesList.current})
 //come back
 //plyerwait

 await actAbilityCheck()
 await resetField() 

}

// =====================================================================================================================

// -abilitygetter

 

useEffect(()=>{//socket info

// if(socket._callbacks['$updateTurn']){console.log('haslisteners');return}
// socket.emit('message' , `from room ${roomID}`)
socket.on('surrender', (data)=>{
  setPopupWord('surrendered')
  setPopup(true)
})
socket.on('updateTurn', (data)=>{
  endTurnFunctioner()

  turnCount.current = data.item.turnCount
  setPlayerTurn(true)
  playerObjects.current.yourTurn = true
  setPhase('stand')
  playerObjects.current.phase = 'stand'
})
socket.on('searchAbilities' , async (data)=>{
//  await searchAbilities()
})
socket.on('updateAbilities', (data)=>{
  opponentAbilitiesList.current = data.item
  //wait for opponent
})
socket.on('resolveAbility', (data)=>{
  // turnState.current = data.item.turnState
  //wait for opponent
})

socket.on('doOpponent' , async (data)=>{
turnState.current['opponent'] = data.item.additional 
  await doOpponentEffect(data.item.card)
 
})
//do at end of searchabilites
//if abilitylist empty and opponent abilitylist !empty pass priority, if both lists are empty adn !playerTurn stop playerwait

socket.on('card',(data)=>{
  setViewCard(data.card)
})
socket.on('attack' , (data)=>{

  currentBattle.current = data.item.currentBattle
  currentBattle.current.boostingIds = []
  //rest attacking and highlight defending

 guardStep()
})
socket.on('guardStep' , (data)=>{
          defendingUnits = data.item
          //change


          // console.log(document.getElementById(data.item.styles.opponentUnitStyle))
          // highlight(document.getElementById(data.item.styles.opponentUnitStyle).children[0], redBorder)
          // highlight(document.getElementById(data.item.styles.unitStyle).children[0] , redBorder)

          //guard prompt, highlight attacking units
})
//needs to wait and go on signal
//conn.on
socket.on('guardians' , (data)=>{

  currentBattle.current.defendingUnits = data.item.defendingUnits
  setUserUnitPower(data.item.units.opponentUnitPower)
  setOpponentUnitPower(data.item.units.userUnitPower )
 
          document.getElementById('wait').click();
})
socket.on('damageCalc' , async (data)=>{
  let array = data.item.hitUnits
  let crit = data.item.attackingCrit
 
  //do battle cleanup -> retire hit reathguards and damagecheck
  await battleCleanup(array , crit)
})

socket.on('endOfBattle' , async (data)=>{
  turnState.current.state = 'endOfBattle' 
          //retire guardians
 
          if(userCircles.userGC.guardians.length !== 0){
            let length = userCircles.userGC.guardians.length
          for(let i = 0; i< length; i++){
 
            retireGC()
 
          }
 
          userCircles.userGC.guardians = []
          //rerender

        }

        playerObjects.current.turnState = 'endOfBattle'
      await  continuousFunctioner()

        setUserUnitPower(0)
        setOpponentUnitPower(0 )
        await endBattleFunctioner()
        
        await searchAbilities()
        await waitAbilities()

        //reset currentbattle
        currentBattle.current = {
          "attackingUnit" : null, 
          "defendingUnits" : null,
          "boostingUnits" : [],
          "boostingIds":[],
          "attackingUnitType" : null,
          "defendingUnitType" : null, //object where {circle.id: card.unittype}
          "guardRestrict" : false,
          "restrictFunction" :  null , 
          revealedUnits : []
        }
        

})
//do messaging between players fix all state
socket.on('opponentWaiting' , ()=>{
  opponentWaiting.current =  true 
})
socket.on('stopWait',async  (data)=>{
 
 document.getElementById('wait').click()
})

socket.on('takeDamage' ,async (data)=>{
  await damageCheck(data.item.crit)
})

socket.on('reveal' , (data)=>{

  timedDisplay('Opponent Revealed')
  if(data.item.arr.length > 0)
  setZone(data.item.arr)
  setShowZone(true)

})

socket.on('abilities' , (data)=>{//send ability list

})


socket.on('updateCards',async (data)=>{
  let zones = data.item.zones
  let circles = data.item.circles

  
  let tempCircles = 
  {
    [`opponent` + "VG"]   :  circles.userVG , 
    [`opponent` + "FLRG"] : circles.userFLRG  ,
    [`opponent` + "BLRG"] :  circles.userBLRG ,
    [`opponent` + "BCRG"] : circles.userBCRG ,
    [`opponent` + "BRRG"] :  circles.userBRRG ,
    [`opponent` + "FRRG"] :  circles.userFRRG ,
    [`opponent` + "GC"] :  circles.userGC 
   }

   opponentTurnState.current = data.item.turnState
   currentOpponentCircles.current = tempCircles
  currentOpponentZones.current = {...zones, hand:[]}

  opponentObjects.current = data.item.opponentObjects
  opponentCircles = currentOpponentCircles.current
  opponentZones = currentOpponentZones.current
  setOpponentHand(zones.hand.length)
  setOpponentDeck(data.item.deck)
  oppDeck.current['RideDeck'] = data.item.ride
//await searchAbilities()  
   setMainDeck([...MainDeck])

})

socket.on('updateUnit', async (data)=>{
  let circle = data.item.circle
  circle = circle.replace('user' , 'opponent')

  let img = await getUnitImg(circle)
  let orein = data.item.orientation

  rotateImg(img , orein)
})

socket.on('changePower' , async (data)=>{
 
let units = data.item.circles
let keys = {
  'powerEndTurn' : increasePowerEndTurn,
  'powerEndBattle' : increasePowerEndBattle,
  'critEndTurn' : increaseCritEndTurn,
  'critEndBattle' : increaseCritEndBattle,
  'driveEndTurn' : increaseDriveEndTurn,
  'driveEndBattle' : increaseDriveEndBattle,
}
for(let i =0 ; i<units.length; i++)   { 
  let unit = userCircles[units[i]].unit
  
  keys[data.item.key](unit , data.item.power)

}
})

socket.on('updatePlayerObjects' , (data)=>{
  opponentObjects.current = data.item.objects
 
} )
socket.on('updateCurrentBattle' , async (data)=>{
  currentBattle.current = data.item.currentBattle

  setUserCircles({...userCircles})
})
socket.on('updateOpponentZone' , (data)=>{
  let zoneName=  data.item.zone 
 let zone = data.item.array 
 
 userZones[zoneName] = zone

setUserZones({...userZones})
})

socket.on('allOfYourOpponentsUnits' , (data)=>{
  let values = data.item
  const keys = {
    'increasePower' : ()=>allOfYourUnits(values.id , values.propertyArray , (unit)=>{ increasePower(unit , values.value) } , 
                      (unit)=>{ increasePower(unit , -values.value) }),

    'increaseCrit' : ()=>allOfYourUnits(values.id , values.propertyArray , (unit)=>{ increaseCrit(unit , values.value) } , 
                      (unit)=>{ increasePower(unit , -values.value) }),

    'remove' :  removeAllOfYourOpponentsUnits ,
    'cannotIntercept' : ()=>allOfYourUnits(values.id , values.propertyArray , (unit)=>{unit.canIntercept = false; ;unit.canInterceptCheck = false;  } , 
                      (unit)=>{ unit.canIntercept = true ;unit.canInterceptCheck = true}),
    'cannotBoost' : ()=>allOfYourUnits(values.id , values.propertyArray , (unit)=>{unit.canBoost = false; ;unit.canBoostCheck = false;  } , 
    (unit)=>{ unit.canBoost = true ;unit.canBoostCheck = true}),
    'cannotAttack' : ()=>allOfYourUnits(values.id , values.propertyArray , (unit)=>{ unit.cannotAttack = [values.value] } , 
                      (unit)=>{ unit.cannotAttack = []}),                 
  }






  if(values.func === 'remove'){
    removeAllOfYourUnits(values.id)
    return
  }

    let func = keys[values.func]
 
    func()
})
socket.on('doUnits' , async (data)=>{
  let keys = {
    'increasePowerEndTurn': (unit)=>{increasePowerEndTurn(unit , data.item.amount)},
    'rest' : rest,
    'cannotStandNextStand' : function (unit) {
      unit.standInStand = false ;
      makeConditionalContinuous( -1 , unit , function (unit){if(
        playerObjects.current.phase === 'ride'
      ){
        unit.standInStand = true ;
        removeConditionalContinuous(-1)
      }
    
    })
    }
  }
let func = keys[data.item.func]
let units = data.item.circles

for(let i =0 ; i<units.length; i++)   { 
  let unit = userCircles[units[i]].unit
if(unit)
func(unit)

}

setUserCircles({...userCircles})
})

socket.on('swapOpponentRG' , async (data)=>{
  switchRG(data.item.circleFrom , data.item.circleTo)
})

socket.on('removeUnits' , async (data)=>{

  let circles = data.item.circles
  let func = data.item.func

 await opponentRemove(circles , func)
 setUserCircles({...userCircles})
 await new Promise((resolve)=>{setTimeout(()=>{resolve()} , 50)})
 socket.emit('fightUpdate', { roomId :roomID,  command:'stopWait', 
  item : { }  })
})

socket.on('removeOpponentCards' , async (data)=>{
  let cards = data.item.cards
  let zone = userZones[data.item.zone]
  let allKeys = {
    'imprison' : currentOpponentZones.current.orderZone,
    'bind' : userZones.bind,
  }
  let zoneToAdd = allKeys[data.item.key]
  await addToZone(zone , zoneToAdd , cards)
  if(data.item.key === 'imprison'){
    socket.emit('fightUpdate',  { roomId :roomID,  command:'updateOpponentZone', item :{zone:'orderZone' , array: currentOpponentZones.current.orderZone}})
  }

  setUserZones({...userZones})
})
socket.on('moveOpponentCards' , async (data)=>{
  let allKeys = {
    'opponentImprisoned' :await yourImprisoned(),
  }
  let moveTo = data.item.moveTo
  let moveFrom = data.item.moveFrom
  let moveToZone
  let moveFromZone
  if(allKeys[moveTo]){
    moveToZone = allKeys[moveTo]
  }
  else{
    moveToZone = userZones[moveTo]
  }
  if(allKeys[moveFrom]){
    moveFromZone = allKeys[moveFrom]
  }
  else{
    moveFromZone = userZones[moveFrom]
  }

  await addToZone(moveFromZone , moveToZone , data.item.cards)

  if(data.item.moveFrom === 'opponentImprisoned'){
    socket.emit('fightUpdate',  { roomId :roomID,  command:'updateOpponentZone', item :{zone:'orderZone' , array: moveFromZone}})
  }

  setUserZones({...userZones})
})

socket.on('sendEvents' , async (data)=>{

addToYourLog(data.item.action , data.item.opponentCard , data.item.card)
//await searchAbilities()
})

socket.on('updateLogs' ,(data)=>{
  if(data.item.action === 'draw'){
    data.item.opponentCard.name = ''
  }
  addOpponentLog(data.item.action, data.item.opponentCard, data.item.card, data.item.power)
})
socket.on('opponentRPS' , (data)=>{
  opponentChoice = data.item.oppChoice
})
socket.on('youWin' , async (data)=>{
  await youWin()
})
} , [])
 useEffect(()=>{
  // //do button control and whatnot here
  //wait for signal from resolve ability to click
  if(abilitiesList.current.length === 0 &&  document.getElementById("abilityStack")){

    document.getElementById("abilityStack").click()
 
  }

  if(abilitiesList.current.length === 0 &&  document.getElementById("ability-wait")){

    // document.getElementById("ability-wait").click()
    let  buttons = document.getElementById('turn-buttons').querySelectorAll('button');

    // Disable each button
      buttons.forEach((button) => {
      button.disabled = false;
    });
  }
  else if(abilitiesList.current.length !== 0 && document.querySelectorAll('button')){
    // Get all button elements on the page
 let  buttons = document.getElementById('turn-buttons').querySelectorAll('button');

// Disable each button
  buttons.forEach((button) => {
  button.disabled = true;
});

  }
 }, )

 // send waitforabilities signal

//win con
useEffect(()=>{
  if(userCircles.userVG.unit === (null||undefined)){
    //ride from soul
    if(userZones.soul.length === 0){
      //send lose signal
      youLose()
    }

  }

} , [userCircles.userVG.unit])

useEffect(()=>{
  //change 6 to damage limit variable
  if(userZones.damage.length === playerObjects.current.damageToLose){
    //ride from soul
    
    youLose()
  }

} , [userZones.damage.length])

useEffect(()=>{

  if(newDeck.MainDeck.length === 0){
//if !turnstate.ability
youLose()

  }

} , [newDeck.MainDeck.length])

useEffect(()=>{
  // if(!playerTurn && document.getElementById('turn-buttons').querySelectorAll('button')){
  //   let  buttons = document.getElementById('turn-buttons').querySelectorAll('button');

  //   // Disable each button
  //     buttons.forEach((button) => {
  //     button.hidden = true;
  //   });
  // }
  // else{
  //   let  buttons = document.getElementById('turn-buttons').querySelectorAll('button');

  //   // Disable each button
  //     buttons.forEach((button) => {
  //     button.hidden = false;
  //   });
  // }

  if(phase === 'stand' && playerTurn){
    //player turn rearguards stand
    standDraw()
 



  }
  else if(phase === 'ride' && playerTurn){
 

    ridePhase()

  }
  else if(phase === 'main' && playerTurn){

 
    mainPhase()
  }

  else if(phase === 'battle' && playerTurn){
    //use !playerturn fpr guard step
    
  }
  else if(phase === 'end' && playerTurn){
    //unlock
 

    //conn.send  
  }

 // setPlayerTurn(!playerTurn)'
 // unlock if locked, set omegalock -> lock
} , [phase, playerTurn])

//useeffect for abilities, if abilities.lenght !== 0 e.prevent default on all except stack. stack onclick pay cost prompt


  useEffect(  ()=>{
    
    const fetchData = async () => {
      try {
        let newRide = []
        let newMain = []
        let idStart = 1
        if(opponentData.player === 'player2'){
          idStart = 101
        }
        let generator = makeUnit(makeEnergyGenerator(), idStart -1)
        generator['fromRideDeck'] = true
        generator['newCard'] = true
        generator['place'] = 'rideDeck'
        newRide.push(generator)//energy

        for(let i = 0; i<newDeck.RideDeck.length;i++){
          let unit = makeUnit(newDeck.RideDeck[i] ,idStart)
          unit['fromRideDeck'] = true
          unit['newCard'] = true
          unit['place'] = 'rideDeck'
          unit['back'] = activeDeck.Sleeves.RideDeck || unit['back']
         // turnFaceDown(unit)
          newRide.push(unit)
          idStart++
        }
        for(let i = 0; i<MainDeck.length;i++){
 
          let unit = await makeUnit(MainDeck[i] , idStart)
              unit['fromRideDeck'] = false
              unit['newCard'] = true
              unit['back'] = activeDeck.Sleeves.MainDeck || unit['back']
              newMain.push(unit)
 
          idStart++
        }
        playerObjects.current.latestCardId = idStart
        newDeck  = {...newDeck , MainDeck : newMain , RideDeck : newRide}
        tempDeck.current = newDeck

         if(newDeck.RideDeck.length !== 0){
            userCircles.userVG.unit = newDeck.RideDeck.pop()
         }
        
          userCircles.userVG.unit.circle = 'userVG'
          userCircles.userVG.unit.place = 'VC'
 
          opponentCircles.opponentVG.unit = await makeUnit(opponentData.FirstVanguard , 100)
     
          opponentCircles.opponentVG.unit.circle = 'userVG'
 
        
        await new Promise(resolve =>{
          let inter = setInterval(()=>{
 
            if(currentOpponentCircles.current.opponentVG.unit && document.getElementById(currentOpponentCircles.current.opponentVG.unit.circle.replace('user', 'opponent'))){
          
                clearInterval(inter)
                resolve()
            }
            })
          } , 1000) 
        
        setPlayerTurn(opponentData.turn)
        playerObjects.current.yourTurn = opponentData.turn
      } catch (error) {
        console.error('Error fetching peer IDs:', error);
      }
    };

    fetchData();

  
  }, [])

 

  useEffect (()=>{
 
      continuousFunctioner().then(()=>{
        let ride = newDeck.RideDeck.filter(card=>card.faceup === true)
        socket.emit('fightUpdate', { roomId :roomID,  command:'updateCards', item :{circles:userCircles , zones:userZones, deck:newDeck.MainDeck.length ,ride : ride, turnState : turnState.current, opponentObjects: playerObjects.current}})
 
      })

} , [userCircles , userZones])
 
  useEffect (()=>{
 
    socket.emit('fightUpdate', { roomId :roomID,  command:'updatePlayerObjects', item :{objects:playerObjects.current}})
      } ,[playerObjects.current ])

useEffect(()=>{//scroll horizontal
  if(document.getElementById('userHand')){
  document.getElementById('userHand').addEventListener('wheel' , (e)=>{

  
    e.preventDefault()

    if(e.deltaY > 0){
       document.getElementById('userHand').scrollLeft = document.getElementById('userHand').scrollLeft + 50
    }
    else{
      document.getElementById('userHand').scrollLeft = document.getElementById('userHand').scrollLeft - 50
    }
 
  } , {passive:false })
}


 //make new promise, when promise resolves setPhase stnad
},[loading])


useEffect(()=>{

  if(showZone === true && phase === 'main'){

    actAbilityCheckZone(zone)
    }
    if(showZone === true && zoneName !== 'user GC'){
      document.getElementById('zoneExpand').removeEventListener('click',Listeners.current.zoneGuardListener)
    }
  if(showZone === true && Listeners.current.zoneGuardListener && zoneName === 'user GC'){
    document.getElementById('zoneExpand').addEventListener('click',Listeners.current.zoneGuardListener)
  }
} , [showZone, zoneName])

useEffect(()=>{
  if(document.getElementById('zoneExpand')){
  document.getElementById('zoneExpand').addEventListener('wheel' , (e)=>{

  
    e.preventDefault()

    if(e.deltaY > 0){
       document.getElementById('zoneExpand').scrollLeft = document.getElementById('zoneExpand').scrollLeft + 75
    }
    else{
      document.getElementById('zoneExpand').scrollLeft = document.getElementById('zoneExpand').scrollLeft - 75
    }
     
  } , {passive:false })
}

  if(document.getElementById('abilityZone')){
    document.getElementById('abilityZone').addEventListener('wheel' , (e)=>{

  
      e.preventDefault()
  
      if(e.deltaY > 0){
         document.getElementById('abilityZone').scrollLeft = document.getElementById('abilityZone').scrollLeft + 50
      }
      else{
        document.getElementById('abilityZone').scrollLeft = document.getElementById('abilityZone').scrollLeft - 50
      }
       
    } , {passive:false })
  
  }
} , [
  document.getElementById('zoneExpand') , 
  document.getElementById('abilityZone')
])


useEffect(()=>{
 
if(abilitiesList.current.length === 0 && document.getElementById('opponentAbilityWait')){

  //send signal to stop waitopponentabilities

}

},[abilitiesList.current.length])

useEffect(()=>{
  let element = document.getElementById('abilityZone')
  if(element){
    let array = Array.from(element.children)
    array.forEach((ele)=>{highlight(ele, transparentBorder)})
  }
} , [abilityZone , abilityZone.length])

useEffect(()=>{ // load all images
  
  setLoading(false)
  
  },[])

  
  useEffect(()=>{
    setTimeout(()=>{
      gameStart().then(async ()=>{ 
        //await waitPlayer()
 
      })
      }, 1000)
  } , [])

  {if(loading) {
    return (
      <div>
        Loading make loading comopoenet
      </div>
  
    )
  }
  
  }



    return (
      <div className='fields' id={'main'} onContextMenu={(()=>{if(actAbility !== null){setPopup(false)}
    setShowZone(false)
    
    })
      
      }>  
 
          <div id={"viewCard"}>
          <div className='cardView'><div className='cardImg' >{
viewCard.img != (undefined|| null)?<img className='cardImg' src = {viewCard.img} />:<></>
          }</div>
      <div className='cardName'>{viewCard.name}</div>    
      <div className='cardFlavor'>{viewCard.flavor}</div>
      <div className='cardText'>{viewCard.text}</div></div>
  
   
          </div>


          {showMessage && <Message message = {message}  />}
          <div id='fields'>
            
                      <div id={"opponent"} className='player' >
                <div className='scrollContainer'>
            <div className='hand' id={`opponentHand`}>

          {Array.from(Array(opponentHand)).map((card , i) =>{return <div onMouseEnter={(()=>{})} className='card' key = {i} ><img key ={i}src = {'/images/Alice.png'} /> </div> })}
    
      </div> 
      </div>
      <div id ={'opponentField'}>


 { <Game setCurrentPage = {setCurrentPage} person={`opponent`} sleeves= {opponentData.Sleeves} playmat = {opponentData.Playmat}
  user = {'opponent'} circles = {opponentCircles} decks = {oppDeck.current}setViewCard = {setViewCard}
  zones = {opponentZones}
  zone = {zone} setZone = {setZone}
  showZone = {showZone}  setShowZone = {setShowZone}
  popup = {popup} setPopup = {setPopup}
  draw = {draw}
  turnState = {turnState.current}
  setZoneName={setZoneName}
  RideDeck = {oppDeck.current['RideDeck']}
  /> } 

          </div>

     </div>

     { popup &&<Popup type = {popupWord} setPopupWord={setPopupWord} message = {"Select an RG circle"} phase = {phase} setPhase={setPhase} setSubphase={setSubphase}
       circles = {userCircles}   zones = {userZones} rideFromHand  = {rideFromHand} rideFromRideDeck = {playerObjects.current.rideFromRideDeck}  noGuard = {noGuard}
       standDraw = {standDraw} currentAbility = {currentAbility} setCurrentAbility = {setCurrentAbility} costPaid = {costPaid}  
        waitAbilities = {waitAbilities}  pause = {pause} setPause = {setPause} actAbility = {actAbility} resolveAbility = {resolveAbility}
        overDress = {overDress} index = {index} setPopup={setPopup}  returnHome = {returnHome} rematch ={rematch} surrender={surrender}
        turnState= {turnState.current}
       />}
 
           {showZone && <ZoneExpand zone = {zone} setShowZone={setShowZone} setViewCard = {setViewCard} zoneName = {zoneName} />}
           {    showAbilityZone && <AbilityZone abilityZone = {abilityZone} setShowAbilityZone={setShowAbilityZone} setViewCard = {setViewCard}/>
          }
  <div id={"user"} className='player'>
 <div   id={'userField'}  >
  <Game setCurrentPage = {setCurrentPage} person={`user`}  sleeves= {activeDeck.Sleeves} playmat = {activeDeck.Playmat}
  circles = {userCircles}   
  
 user = {user} RideDeck = {newDeck.RideDeck} setViewCard = {setViewCard}
  zones = {userZones}   MainDeck = {newDeck.MainDeck} setMainDeck= {setMainDeck}  
  showZone = {showZone} setShowZone = {setShowZone}  zone = {zone} setZone = {setZone}
  popup = {popup} setPopup = {setPopup}
  draw = {draw}
  turnState = {turnState.current}
  setZoneName={setZoneName}
  />
 </div>

   <div className='scrollContainer' id={'userScrollContainer'}   >
            <div className='hand' id={`userHand`}   onScroll ={ ((e) => {
               
 
              


  })}    >  

          {userZones.hand.map((card , i) =>{return <div onMouseEnter={(()=>{setViewCard(userZones.hand[i])})} className='card' key = {i} onClick={(async ()=>{
            await nCall(card)
            
            setIndex(card); console.log(card) })}><img key ={i}src = {card.img} /> </div> })}
    
      </div> 
</div>
  </div>
 
          </div>
  
  <div id={'game-info'} >
    <div className='playerInfo' >


        <div>
        {opponentData.displayname}
        <br></br>
        Hand: {opponentHand}
        <br></br>
        Deck: {opponentDeck}
        <br></br>
        Energy: {opponentObjects.current.energy}
        <br></br>
        Damage: {currentOpponentZones.current.damage.length}
        <br></br>
        Soul: {currentOpponentZones.current.soul.length}
        <br></br>
        Drop:{currentOpponentZones.current.drop.length}
        <br></br>
        Bind:{currentOpponentZones.current.bind.length}
        <br></br>
        </div>


        <div>
        <div className='removed-zone zone' id={`opponentRemovedZone`} onClick={(()=>{setShowZone(true) ; setZone(currentOpponentZones.current.removed); setZoneName( "opponent REMOVED") })} >
        <div className='card'>{currentOpponentZones.current.removed[currentOpponentZones.current.removed.length-1] === undefined ? <></> :<img src = {currentOpponentZones.current.removed[currentOpponentZones.current.removed.length-1].img} onMouseEnter={(()=>{setViewCard(currentOpponentZones.current.removed[currentOpponentZones.current.removed.length-1])})}/>} 
        </div>
        </div>
        </div>


    </div>
    <div className = 'abilitiesList'> {opponentAbilitiesList.current.map((item , i) => <img src = {item.img} onMouseEnter={(()=>{
      setViewCard(item.card)
      display(item.ability.text)
    })} key={i}></img>)}</div> 
    


    <div className='turn-info'>{ <Info userUnitPower = {userUnitPower.current} opponentUnitPower = {opponentUnitPower.current}/>}
<div id='turn'>{phase.toUpperCase() + ' PHASE'}</div>
<div id='current-player'>
{playerTurn?'Your Turn '
:'Opponents Turn '}
Turn No. {turnCount.current}
</div>

<div id='turn-buttons'>
<button onClick={(()=>{
    turnState.current['prevWord'] = popupWord
    setPopupWord('surrender')
    setPopup(true)
   //setCurrentPage('home');
 
   
   })}> Surrender</button>
  {/* {phase === 'main' && playerTurn ? <button onClick={(async ()=>{
    try{ if(turnState.current !=='normalCall'){    
       await nCall()
     }
     
    }
     catch{
      timedDisplay('Problem with normal call')
     }
     })}> Call</button> : <></>} */}
  {phase === 'main' && playerTurn ? <button id={'toBattle'}  onClick={(()=>{if(turnCount.current !== 1){setPhase('battle')
  playerObjects.current.phase = 'battle'
  battlePhase()
  }})}> Battle</button> : <></>}
  {phase === 'main' && playerTurn ? <button onClick={(()=>{playerObjects.current.mainPhaseSwitch()})}> Switch</button> : <></>}
  <button onClick={(()=>{
    playOrder()
    })}> Play Order</button>

  {phase === 'main' && playerTurn && opponentObjects.current.hasPrison === true ? <button onClick={(async ()=>{await callImprioned();})}> Call Imprisoned</button> : <></>}

  {<button onClick={(()=>{ setShowLog(!showLog)})} >Show Log</button>}

  {<button id={'endTurn'} onClick={( async ()=>{
     if(playerObjects.current.attacking){return}
    
    document.getElementById('userHand').removeEventListener('click' , Listeners.current.callHand)

      document.getElementById('userCircles').removeEventListener('click' , Listeners.current.callCircle)


        document.getElementById('userCircles').removeEventListener('click' , Listeners.current.battleCircle)
  
    if(playerTurn) {
     
      await endTurn()
   } 

    })}> End</button>}
 
 <button onClick={(async ()=>{  

console.log(phase , userCircles , userZones,  playerObjects , opponentCircles ,opponentZones, opponentObjects , turnState , opponentTurnState)
//finalRushEndTurn(userCircles.userVG.unit)
//await abilities['Piercing Bullet of Dust Storm, Maynard'].ability1.effect.effect(userCircles.userVG.unit)
await dealDamage(2)
//await resolveAbility(abilities['Drilling Angel'].ability1 , userZones.hand[0])
})}>
Test
  </button>
 {/*   <button onClick={(async()=>{  

console.log(continuous.current , conditionalContinuous ,   currentBattle.current, turnState , playerObjects , endTurnFunctions) 
await newDeck.MainDeck.shift() 
//removeAllOfYourUnits( opponentCircles.opponentVG.unit.id)
//await callFromHand(undefined , 2 ,   'userCircles' , false ,  undefined  )
 // setGameRunning(!gameRunning)
 
// await imprisonOpponentRearguards(1)

})}>
ability'
  </button>
   */}
  </div>      
   </div>
   <div id={'ability-wait'}></div>
   <div id={'wait'}></div>
   <div id={'opponentAbilityWait'}></div>
   <div id={'abilityStack'}></div>




<div className = 'abilitiesList'> 
    {abilitiesList.current.map((item , i) => <img src = {item.img} key={i} 
     onMouseEnter={(()=>{
      setViewCard(item.card)
      timedDisplay(item.ability.text)
    })}
    
    onClick={(async ()=>{
      if(isInAbility() ){
        timedDisplay('Resolve Current Ability First')
        return
      }
      if(!duringYourTurn() ){
        if(yourCard(item.card)&& opponentAbilitiesList.current.length > 0){
          timedDisplay('Opponent has priority')
          return
        }
        setCurrentAbility(item.ability) ; await resolveAbility(item.ability , item.card , i); 
      }

      else{
      setCurrentAbility(item.ability) ; await resolveAbility(item.ability , item.card , i); 
      }

      
      })}></img>)} 
</div>

  <button id='confirm' onClick={(()=>{
        // setConfirm(false)

      //make another ocmponent to display damage difference and whether the attack hit
  })}> Confirm </button>

{<button onClick={(()=>{ 

    if(showZone){
      setShowZone(false)
    }
    else if(turnState.current.zone){
      setZone(turnState.current.zone)
      setShowZone(true)
    }


  })} >Show All</button>}
      <div className='playerInfo' >
      <div>

        {user.displayname}
        <br></br>
        Hand: {userZones.hand.length}
        <br></br>
        Deck: {newDeck.MainDeck.length}
        <br></br>
        Energy: {playerObjects.current.energy}
        <br></br>
        Damage: {userZones.damage.length}
        <br></br>
        Soul: {userZones.soul.length}
        <br></br>
        Drop:{userZones.drop.length}
        <br></br>
        Bind:{userZones.bind.length}
        <br></br>
      </div>

      <div>
      <div className='removed-zone zone' id={`userRemovedZone`} onClick={(()=>{setShowZone(true) ; setZone(userZones.removed); setZoneName( "user REMOVED") })} >
        <div className='card'>{userZones.removed[userZones.removed.length-1] === undefined ? <></> :<img src = {userZones.removed[userZones.removed.length-1].img} onMouseEnter={(()=>{setViewCard(userZones.removed[userZones.removed.length-1])})}/>} 
        </div>
        </div>
      </div>

      </div>

  </div>
{showLog && <div id='log'> 
  {turnLog.current.map((event, i)=>{
  //log is just strings and have events be stored separately
 // return(<div> {action.message}</div>)
return <div className={event.player + ' logMessage'} key = {i} >  {event.text + '\n\n' } </div>
              })}</div>}

      </div>
  

    )

  }

