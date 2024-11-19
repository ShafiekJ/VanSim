import cards from '../../Backend/cards.json' assert {type:'json'}
import fs from 'fs'
let banlist = {};
//find a way to get current last added card when adding new cards to database
for (let i  = 0; i< cards.length; i ++){
    let card = cards[i]
    banlist[card.name]= 4;
    // const jsonData =   fs.readFile('./cards.json');
    // const cards = JSON.parse(jsonData);
    // cards.cards.push(newCard)
    

}//banlist for standard, do one for each format
console.log(banlist)
fs.writeFileSync('banlist.json', JSON.stringify(banlist, null, 2) );