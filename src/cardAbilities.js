


var abilities = {  
      "Tranquil Affection, Elivira":{
    "ability1":{
      "condition": 
 function (card, userCircles, userZones) { console.log('willista' );if (card.place === 'RC') {  return true;} return false;}, 
     "cost": null,
     "effect": function ( ){console.log('elivira activated'); 
          draw( ); 
   },
     "text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
     "1/Turn": false, 
     "type": "ACT", 
     "category": "ridden",
     "permanent": true ,
     "costPaid" : false
   },
   "ability2":{
    "condition": 
function (card, userCircles, userZones) { console.log('willista' );if (card.place === 'RC') {  return true;} return false;}, 
   "cost": null,
   "effect": function ( ){console.log('elivira activated'); 
        draw( ); 
 },
   "text": "[AUTO]:When this unit is rode upon, if you went second, draw a wevgwervgcard.",
   "1/Turn": false, 
   "type": "ACT", 
   "category": "ridden",
   "permanent": true ,
   "costPaid" : false
 }
  },
    "Throbbing Search, Loronerol":{
      "ability1":{
        "condition": 
        function (card, userCircles, userZones) {console.log(card);if(card.state == 'rodeUpon'){return true}; return false;} , 
       "cost": null,
       "effect": async function (card, userCircles, userZones) {//searchZones
        let zoneToSearch =  userZones.hand.concat(newDeck.MainDeck)  //hand + deck
        console.log(zoneToSearch)
        let index 
         let viewArray
        let arrayOfProperties = [{"cardProperty" : "cardtype" , "propertyToFind" : "Song" , "condition" : 'includes' } , {"cardProperty" : "grade" , "propertyToFind" : 1 , "condition" : '=' }]
         let results = zoneToSearch
         for(let j = 0; j<arrayOfProperties.length; j++){
           let element = arrayOfProperties[j]
          console.log(results)
           results = searchZones(results , element["cardProperty"] , element["propertyToFind"] , element["condition"])  
           viewArray = results.map((object) => {return object.card})
           results = viewArray
           console.log(results)

         }
         console.log(Array.isArray(results))
         //addeventListener
         let confirmFunction 
        
         let addHand
         let clickedAmount =0
          
         console.log(viewArray)
         setAbilityZone(viewArray)
         setShowAbilityZone(true)
       setConfirm(true)
       //addeventlister to class zone
       await new Promise( (resolve)=>{
         setTimeout(async () => {
           if(document.getElementById(`abilityZone`)  && document.getElementById(`confirm`) ){
             console.log('reached addhand')
             resolve()
           }
         }, 500)
       })
       
       await new Promise(resolve => document.getElementById(`abilityZone`) .addEventListener("click", addHand = (()=>{
         console.log(event.target.closest('.card').children[0].src)
         var index = Array.from(document.getElementById(`abilityZone`).children).indexOf(event.target.closest('.card'))
         
         if(event.target.closest('.card').style.border == '0.4rem solid blue' ){
           clickedAmount --
           highlight(event.target.closest('.card') , '0.3rem solid transparent')
           console.log('deselect' , viewArray[index], clickedAmount)   
          }
           else if (event.target.closest('.card').style.border != '0.4rem solid blue' )
           {
           highlight(event.target.closest('.card') , '0.4rem solid blue'  )
           clickedAmount ++
             console.log('select' , viewArray[index] , clickedAmount , 1)}
       
       }) ,  document.getElementById(`confirm`).addEventListener('click', confirmFunction = (()=>{
       if( 1 >= clickedAmount){
         console.log('sb fulfilled')
         resolve()
       }
       else{alert('click more sb')}
       //comeback
       })))
       
       ).then(()=>{
         // set hand as useref to allow new cards to be guardesd with
         document.getElementById(`abilityZone`) .removeEventListener("click", addHand)
        
         document.getElementById(`confirm`).removeEventListener("click", confirmFunction)
         let temp = Array.from(document.getElementById(`abilityZone`).children)
         for (let i =  viewArray.length -1; i >= 0; i--){
           console.log(temp[i].children[0].src)
           if(temp[i].style.border == '0.4rem solid blue'){
             //subtract from counterblasts
             console.log('afterthen' , results[i])
            if(results[i].place === 'hand'){
              let card =  userZones.hand.splice(results[i].index , 1)[0]
              userZones.orderZone.push(card)
              draw()
            }
            if(results[i].place === 'deck'){
              let card =  newDeck.MainDeck.splice((results[i].index  - userZones.hand.length), 1)[0]
              userZones.orderZone.push(card)
            }
       
        
       
           }
        
       }
       
       setUserZones({...userZones })
       setShowAbilityZone(false)
       // setUserZones({...userZones , damage:temp})
       })
       
       
      
      
        } ,
      
        "text": "[AUTO]:When this unit is rode upon, search your deck or hand for up to one grade 1 Song card, reveal it and put it into your Order Zone, and if you searched your deck, shuffle your deck. If you put it from hand, draw a card",
       "1/Turn": false, 
       "type": "AUTO", 
       "category": "rodeUpon",
       "permanent": true 
       
      },
      
    },
    "Sunrise Egg":{
       "ability1":{
       "condition": 
  function (card, userCircles, userZones) { console.log('willista' );if (card.state == 'rodeUpon') {  return true;} return false;}, 
      "cost": null,
      "effect": function ( ){console.log('adiblity activated'); 
 draw( ); 
    },
      "text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
      "1/Turn": false, 
      "type": "AUTO", 
      "category": "ridden",
      "permanent": true ,
      "costPaid" : false
    }
  
},
    "To Deliver a Song, Loronerol":{
        "ability1":{
          "condition": 
      function (card, userCircles, userZones) { console.log('willista' );if (card.state == 'rodeUpon') {  return true;} return false;}, 
          "cost": null,
          "effect": function ( ){console.log('adiblity activated'); 
     draw( ); 
        },
          "text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
          "1/Turn": false, 
          "type": "AUTO", 
          "category": "ridden",
          "permanent": true ,
          "costPaid" : false
        }
      
    },
    
    //---
    "Negligent Carelessness, Likkris":{
      "ability1":{
        "condition": 
        function (card, userCircles, userZones) {console.log(eventCard.current);if(eventCard.current.state == 'placed' && card.place === 'RC'){return true}; return false;} , 
       "cost":  null,
       "effect": async function (card, userCircles, userZones) { 
  
        card.tempPower += 5000
      } ,
       "text": "[AUTO](RC):When another rearguard is placed, this unit gets power +5000.",
       "1/Turn": false, 
       "type": "AUTO", 
       "category": "rodeUpon",
       "permanent": true 
       
      },
    },

    "Astesice, Kairi":{
    //"[AUTO](VC):When this unit attacks, COST [Soul Blast (1)], choose up to two of your rear-guards, and return them to your hand.
    //\n[AUTO](VC):At the end of the battle this unit attacked, if you persona rode this turn, choose up to two cards from your hand, 
    //and call them to (RC) in different rows.",

    "ability1":{
      "condition": 
      function (card, userCircles, userZones) {console.log(card);if(card.state == 'attacks'){return true}; return false;} , 
     "cost":  (async ()=>{await soulBlast(1)}),
     "effect": async function (card, userCircles, userZones) { 

      circleToZone(userZones.hand , 2)
    } ,
     "text": "[AUTO](VC):When this unit attacks, choose one of your rear-guards, and you may return it to hand.",
     "1/Turn": false, 
     "type": "AUTO", 
     "category": "rodeUpon",
     "permanent": true 
     
    },
    "ability2":{
      "condition": 
      function (card, userCircles, userZones) {console.log(card , playerObjects.current.turnState , playerObjects , 'kairi');if(card.state == 'unitAttacked' && playerObjects.current.turnState === 'endOfBattle' && playerObjects.current.personaRide === true){return true}; return false;} , 
     "cost":  null,
     "effect": async function (card, userCircles, userZones) { 
      //display text call to frontrow
      console.log(userCircles , userZones)
      await superiorCall(userZones.hand , [{"cardProperty" : "cardtype" , "propertyToFind" : ' Unit' , "condition" : 'includes' }] , 1 , document.getElementById('userFrontRow') , false , 'hand' , ((card)=>{}))
      //diplay text, call to backrow
      await superiorCall(userZones.hand , [{"cardProperty" : "cardtype" , "propertyToFind" : ' Unit' , "condition" : 'includes' }] , 1 , document.getElementById('userBackRow') , false , 'hand' , ((card)=>{}))
   
    } ,
     "text": "[AUTO](VC):At the end of the battle this unit attacked, if you persona rode this turn, choose up to two cards from your hand, and call them to (RC) in different rows",
     "1/Turn": false, 
     "type": "AUTO", 
     "category": "endOfBattle",
     "permanent": true 
      }
    },"Astesice, Kiyora":{
    //"[AUTO](VC):When this unit attacks, choose one of your rear-guards, and you may return it to hand.
    //\n[CONT](RC):During the battle this unit is boosted, this unit gets [Power]+5000.",
    "ability1":{
      "condition": 
      function (card, userCircles, userZones) {console.log(card);if(card.state == 'attacks'){return true}; return false;} , 
     "cost": null,
     "effect": async function (card, userCircles, userZones) { 

      circleToZone(userZones.hand , 1)
    } ,
     "text": "[AUTO](VC):When this unit attacks, choose one of your rear-guards, and you may return it to hand.",
     "1/Turn": false, 
     "type": "AUTO", 
     "category": "rodeUpon",
     "permanent": true 
     
    },
    "ability2":{
      "condition": function (card ){//use battle object
        if((playerObjects.current.turnState === 'battle' && card.place === 'RC' )){ return true} return false},
      "on": function(card , userCircles , userZones){card.tempPower += 5000},
      "off" : function(card , userCircles , userZones){card.tempPower -= 5000},
      "isOn": false,
      "text" : "[CONT](RC):During the battle this unit is boosted, this unit gets [Power]+5000.",
      "type": "CONT",
      "permanent" : true
    }
  },
    "Astesice, Nanami":{
      //[AUTO]:When this unit is placed on (VC), you may choose a grade 1 or less card from your drop, and call it to (RC) as [Rest].
      //\n[AUTO]:When this unit is placed on (RC), this unit gets [Power]+2000 until end of turn.
      "ability1":{
        "condition": 
        function (card, userCircles, userZones) {console.log(card);if(card.place == 'VC' && card.state === 'placed'){return true}; return false;} , 
       "cost": null,
       "effect": async function (card, userCircles, userZones) {   
         await superiorCall(userZones.drop , [{"cardProperty" : "grade" , "propertyToFind" : 1 , "condition" : '<=' }] , 1 , document.getElementById('userCircles') , false, 'drop' , ((card)=>{card.tempPower += 5}))
      } ,
       "text": "[AUTO]:When this unit is placed on (VC), you may choose a grade 1 or less card from your drop, and call it to (RC) as [Rest]",
       "1/Turn": false, 
       "type": "AUTO", 
       "category": "placed",
       "permanent": true 
       
      },
      "ability2":{
        "condition":     function (card, userCircles, userZones) {console.log(card);if(card.place == 'RC' && card.state === 'placed'){return true}; return false;} ,
        "cost": null,
        "effect": async function (card, userCircles, userZones) { card.tempPower += 2000 } ,
        "text" : "[AUTO]:When this unit is placed on (RC), this unit gets [Power]+2000 until end of turn.",
        "type": "CONT",
        "permanent" : true
      }
    
    },
    "Rondo of Eventide Moon, Feltyrosa":{
      //"[AUTO](VC):When your drive check reveals a <Ghost> normal unit, you may call that unit to an open front row (RC).
      // Then, if you called, COST [Counter Blast (1)],this unit gets drive +1 until end of that battle.
      // (During this battle, increase the drive of this unit by one. Even if this is the last drive check
      // of the battle, you will still perform an additional drive check)"

      "ability1":{
        "condition": //change how abilities are checked, felty3 ability is not being checked
        function (card, userCircles, userZones) {let unit = userZones.trigger[0]; console.log('inside felty3'); if(unit ==(null || undefined)){return false}else if(unit.race === 'Ghost' ){return true}; return false;} , 
       "cost": null,//if userZones.trigger.length === 0 let newAbility = {cost :cb1 , effect : card.tempDrive +1 ; call driveCheck}
       "effect": async function (card, userCircles, userZones) { 
        //comback
        console.log('inside felty3 effect')
        await superiorCall(userZones.trigger , [{"cardProperty" : "race" , "propertyToFind" : "Ghost" , "condition" : '=' }] , 1 , document.getElementById('userFrontRow') , true, 'trigger')
      } ,
       "text":"[AUTO](VC):When your drive check reveals a <Ghost> normal unit, you may call that unit to an open front row (RC).Then, if you called, COST [Counter Blast (1)],this unit gets drive +1 until end of that battle.(During this battle, increase the drive of this unit by one. Even if this is the last drive check of the battle, you will still perform an additional drive check)",
       "1/Turn": false, 
       "type": "AUTO", 
       "category": "rodeUpon",
       "permanent": true 
       
      }


    },
    "Talent of Enjoyment, Feltyrosa":{

      "ability1":{
        "condition": 
        function (card, userCircles, userZones) {console.log(card);if(card.state == 'rodeUpon'){return true}; return false;} , 
       "cost": (async ()=>{
        console.log('feltyhand' ,userZones.hand )
        await moveToZone(userZones.hand , [{"cardProperty" : "race" , "propertyToFind" : "Ghost" , "condition" : '=' }] , newDeck.MainDeck ,  1, 'mainDeckTop' , 'hand' )
        //comeback
       }),
       "effect": async function (card, userCircles, userZones) { addToHand(userZones.drop , [{"cardProperty" : "race" , "propertyToFind" : "Ghost" , "condition" : '=' }] , 1)} ,
       "text": "[AUTO]:When this unit is rode upon, COST [reveal a <Ghost> normal unit from hand, and put it on the top of your deck], choose a <Ghost> from your drop, and put it into your hand.",
       "1/Turn": false, 
       "type": "AUTO", 
       "category": "rodeUpon",
       "permanent": true 
       
      },
      "ability2":{
        "condition": function (card ){let rgNum = searchCircles( "race" , "Ghost" , '=' ) ; console.log('felty' , card , rgNum , playerObjects.current.turn , userCircles);  if((card.place === 'VC'|| card.place === 'RC') && (rgNum.length >=3 && playerTurn)){ return true} return false},
        "on": function(card , userCircles , userZones){card.tempPower += 5000},
        "off" : function(card , userCircles , userZones){card.tempPower -= 5000},
        "isOn": false,
        "text" : "[CONT](VC/RC):During your turn, if you have three or more <Ghost> on your (RC), this unit gets [Power]+5000.",
        "type": "CONT",
        "permanent" : true
      }
    },
    "Beautiful Day Off, Feltyrosa" :{
      //"[AUTO]:When this unit is rode upon, COST [Soul Blast (1)], choose up to one <Ghost> in your drop, and put it into your hand.
      //\n[CONT](VC/RC):During your turn, if you have a <Ghost> on your (RC), this unit gets [Power]+2000.",
      "ability1":{
        "condition": 
        function (card, userCircles, userZones) {console.log(card);if(card.state == 'rodeUpon'){return true}; return false;} , 
       "cost": (async ()=>{await soulBlast(1)}),
       "effect": async function (card, userCircles, userZones) { addToHand(userZones.drop , [{"cardProperty" : "race" , "propertyToFind" : "Ghost" , "condition" : '=' }] , 1)} ,
       "text": "[AUTO]:When this unit is rode upon, COST [Soul Blast (1)], choose up to one <Ghost> in your drop, and put it into your hand.",
       "1/Turn": false, 
       "type": "AUTO", 
       "category": "rodeUpon",
       "permanent": true 
       
      },
      "ability2":{
        "condition": function (card ){let rgNum = searchCircles( "race" , "Ghost" , '=' ) ; console.log('felty' , card , rgNum , playerObjects.current.turn , userCircles);  if((card.place === 'VC'|| card.place === 'RC') && (rgNum.length >=1 && playerTurn)){ return true} return false},
        "on": function(card , userCircles , userZones){card.tempPower += 2000},
        "off" : function(card , userCircles , userZones){card.tempPower -= 2000},
        "isOn": false,
        "text" : "[CONT](VC/RC):During your turn, if you have a <Ghost> on your (RC), this unit gets [Power]+2000.",
        "type": "CONT",
        "permanent" : true
      }
       
    
    },
    "Dependable Senior, Aries" : {

      "ability1":{
        "condition": function (card, userCircles, userZones){ if(card.place === 'GC' && playerObjects.current.openRGNum >= 3){ return true} return false},
        "on": function(card , userCircles , userZones){card.tempShield += 10000},
        "off" : function(card , userCircles , userZones){card.tempShield -= 10000},
        "isOn": false,
        "type": "CONT",
        "permanent" : true
      }
    },
    "Slight Slump?, Apelle":{
      "ability1":{
      "condition": 
      function (card, userCircles, userZones) {if(card.state == 'placed' && card.place == 'RC'){return true}; return false;} , 
     "cost": async function (){counterBlast(1)},
     "effect": async function (card, userCircles, userZones) { card.tempPower += 10000 ;} ,
     "text": "[AUTO]:When this unit is placed on (RC), COST [Counter Blast (1)], and this unit gets [Power]+10000 until end of turn.",
     "1/Turn": false, 
     "type": "AUTO", 
     "category": "placed",
     "permanent": true 
     
    }
    }
    ,
    "Earnest Wish, Hanael":{
    "ability1":{
      "condition": 
      function (card, userCircles, userZones) {console.log(card);if(card.state == 'placed' && card.place == 'GC'){return true}; return false;} , 
     "cost": "",
     "effect": (async ()=>{console.log('PG');
     await new Promise(resolve => document.getElementById('userCircles').addEventListener("click", (()=>{
  
      let temp;
   //only resolve if correct target
      if(event.target.closest('.card') ){
        console.log(event.target.closest('.card').parentNode)
        temp =  event.target.closest('.card').parentNode
      }
      else{
        temp =  event.target
      }
   
      if(userCircles[temp.id].unit ){
  
        userCircles[temp.id].unit.canBeHit = false

        console.log('cantbehit')
        highlight(temp.children[0].closest('.card') , '0.4rem solid pink')
        peerCon.current.send({name:'circles', data:userCircles})
        resolve()
      }
   
     else{alert('Invalid Selection'); return;}

   

   }), {once:true} ));
    }),
     "text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
     "1/Turn": false, 
     "type": "AUTO", 
     "category": "placed",
     "permanent": true 
     
    }  
    },



      "Admired Dear Sister, Feltyrosa" : {
        "ability1":{
          "condition": 
           "(()=>{if(card.state == 'ridden'){return true}})", 
          "cost": "",
          "effect": (()=>{draw( )}),
          "text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
          "1/Turn": false, 
          "type": "AUTO", 
          "category": "ridden",
          "permanent": true 
          
        }
      },
      "Brilliance in the Ore, Wilista" : {
        "ability1":{
          "condition": 
      function (card, userCircles, userZones) { console.log('willista' );if (card.state == 'rodeUpon') {  return true;} return false;}, 
          "cost": null,
          "effect": function ( ){console.log('adiblity activated'); 
     draw( ); 
        },
          "text": "[AUTO]:When this unit is rode upon, if you went second, draw a card.",
          "1/Turn": false, 
          "type": "AUTO", 
          "category": "ridden",
          "permanent": true ,
          "costPaid" : false
          
        }
      }
    }

    const orderEffects=  {
        "Truehearted Ruby":{
          "condition": (()=>{return true}),
          "cost":async function(){await counterBlast(1)},
          "effect":async function (){ 
            console.log('ruby effect')
          },
          "text":  "Play this with COST [Counter Blast (1)]!\nDraw two cards, choose a card from your hand, and discard it. Put this card into your soul.",
          "permanent": true 
        }
      }
 export default {abilities , orderEffects  }
 