/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

CHALLENGES AFTER

1. A player looses his ENTIRE score when he rolls two 6's in a row. After that its the next players turn

2. Add an input field to the HTML where players can set the winning score

3. add another dice to the game, the player looses current score if any of them are 1, and they lose their ENTIRE score when they roll double 6's or a total score of 6 twice in a row.


*/


// Keep it clean and create all the variables in one shot then define them.
var scores, roundScore, activePlayer, dice, dice2, gamePlaying, lastRoll, winningScore, totalRoll

function init(){
    scores = [0, 0]
    roundScore = 0
    activePlayer = 0
    lastRoll = 0
    rollCount = 0
    totalRoll = 0
    winningScore = prompt("What would you like the winning score to be?")
    gamePlaying = true
    document.getElementById("score-0").textContent = "0"
    document.getElementById("score-1").textContent = "0"
    document.getElementById("current-0").textContent = "0"
    document.getElementById("current-1").textContent = "0"
    document.querySelector(".dice").style.display = "none"
    document.querySelector(".dice2").style.display = "none"
    document.getElementById("name-0").textContent = "Player 1"
    document.getElementById("name-1").textContent = "Player 2"
    //ALWAYS REMOVE THEM ALL TO MAKE SURE THEY ARE GONE THEN ADD WHAT IS NECCESARRY 
    document.querySelector(".player-0-panel").classList.remove("winner")
    document.querySelector(".player-1-panel").classList.remove("winner")
    document.querySelector(".player-0-panel").classList.remove("active")
    document.querySelector(".player-1-panel").classList.remove("active")
    document.querySelector(".player-0-panel").classList.add("active")
    document.querySelector(".btn-roll").style.display = "block"
    document.querySelector(".btn-hold").style.display = "block"
}

// run init function
init()
console.log(winningScore)
//scores = [0, 0]
//roundScore = 0
//activePlayer = 0

// Alert and tell the rules
alert(`First one to ${winningScore} Wins, roll to add to temp score, hold to keep the temp score, roll a 1 and lose temp score, or either 2 6's or total 12 to lose global score`)

/* random generates a decimal number between 0 & 1, multiplying it by 6 turns it into a random decimal number between 0 & 5, using the floor method truncates the decimal, and adding the one gives you a randome number between 1 & 6 */

//dice = Math.floor(Math.random() * 6) + 1 USED LATER

/* find the html ID for the item you would like to select and then use the text content method to make the change to whatever random number was rolled. Because active player goes from 0 to 1 we can let the chosen current be whatever the active player is. SETTER */

//document.querySelector("#current-" + activePlayer).textContent = dice 

// Undefined, 0, null or "" are coerced to false, great for checking if an iput has a value or not.

/* USING textContent, when only dealing with text, when any changes to HTML is needed then use the .innerHTML method instead as shown below. HTML HAS TO BE A STRING! */

//document.querySelector("#current-" + activePlayer).innerHTML = `<em>${dice}</em>`

// set the startup die image display to none and all scores to 0
//document.querySelector(".dice").style.display = "none"
//document.getElementById("score-0").textContent = "0"
//document.getElementById("score-1").textContent = "0"
//document.getElementById("current-0").textContent = "0"
//document.getElementById("current-1").textContent = "0"

/* when we use the assignment at the end of a query it is refferred to as a SETTER because we are changing the value, if we use the assignment before the query it is considered a GETTER because we are getting the information and storing it in the variable. */

// quick query of score and save in var x. GETTER
//var x = document.querySelector("#score-0").textContent
//console.log(x)

// create a function to be called when the roll button is clicked
//function btn(){
//    // Do something here
//}
//document.querySelector(".btn-roll").addEventListener("click", btn())

// set up the roll dice button (see that the btn doesnt have () because we want the event listener to call that function for us)

// anonymous function writing a function right then and there
document.querySelector(".btn-roll").addEventListener("click", function(){
    if(gamePlaying){
        if (rollCount > 0){
            lastRoll = dice + dice2
        } 
        // 1. Random number
        dice = Math.floor(Math.random() * 6) + 1
        dice2 = Math.floor(Math.random() * 6) + 1
        totalRoll = dice + dice2

        console.log(lastRoll, dice, dice2, totalRoll)
        // 2. Display the result
        var diceDOM = document.querySelector(".dice") // create a reusible variable for the dice query selector
        diceDOM.style.display = "block"
        diceDOM.src = "dice-" + dice + ".png"
        
        var diceDOM2 = document.querySelector(".dice2") // create a reusible variable for the dice query selector
        diceDOM2.style.display = "block"
        diceDOM2.src = "dice-" + dice2 + ".png"
        
        // increment rollCount
        rollCount++

    // 3. Update the round score IF the rolled number was not a 1
    if (dice !== 1 && dice2 !== 1){
        if ((lastRoll === 6 && totalRoll === 6) || totalRoll === 12){
            //Zero out global score
            document.getElementById("score-" + activePlayer).textContent = "0"
            document.getElementById("score-" + activePlayer).textContent = "0"
            scores[activePlayer] = 0
            // next player is now actve
            nextPlayer()
        } else {
            //Add score
            roundScore += totalRoll
            document.querySelector("#current-" + activePlayer).textContent = roundScore
        }
    } else {
        //Next player if rolled 1 & zeros out the current points and die
        nextPlayer()
    }
    }
})

// Created Next Player function to keep DRY
function nextPlayer(){
        // switches active player and resets all current points & die
        activePlayer === 0 ? activePlayer = 1 : activePlayer = 0
        document.getElementById("current-0").textContent = "0"
        document.getElementById("current-1").textContent = "0"
        roundScore = 0
        rollCount = 0
        dice = 0
        lastRoll = 0
        dice2 = 0
        totalRoll = 0
        document.querySelector(".player-0-panel").classList.toggle("active")
        document.querySelector(".player-1-panel").classList.toggle("active")
        document.querySelector(".dice").style.display = "none"
        document.querySelector(".dice2").style.display = "none"
}

document.querySelector(".btn-hold").addEventListener("click", function(){
    if(gamePlaying){
        // add the local points to the global points, switch active player and reset all local points
        scores[activePlayer] += roundScore
        
        // by using the trick below, it prevents you from having to check what player is active!!!!
        document.getElementById("score-" + activePlayer).textContent = scores[activePlayer]
        
        // check if player won the game
        if(scores[activePlayer] >= winningScore){
            // change the name to winner
            document.querySelector("#name-" + activePlayer).textContent = "WINNER!"
            document.querySelector(".player-" + activePlayer + "-panel").classList.toggle("winner")
            document.querySelector(".player-" + activePlayer + "-panel").classList.remove("active")
            // disable dice, roll button and hold button
            
            document.querySelector(".dice").style.display = "none"
            document.querySelector(".dice2").style.display = "none"
            document.querySelector(".btn-roll").style.display = "none"
            document.querySelector(".btn-hold").style.display = "none"
            
            gamePlaying = false
        } else {
            nextPlayer()
        }
    }
})

document.querySelector(".btn-new").addEventListener("click", init)

