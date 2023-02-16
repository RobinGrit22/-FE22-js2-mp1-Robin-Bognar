const btnName = document.getElementById('nameBtn');
const showName = document.getElementById('showUserName');
let inputName = document.getElementById('name');

const userInfo = {
    name: '',
    score: 0
}; 
const baseUrl = `https://js2mini1-default-rtdb.europe-west1.firebasedatabase.app/highscores.json`

const userChoiceShow = document.getElementById('leftPickPosition')
const compChoiceShow = document.getElementById('rightPickPosition')
const leftCardPick = document.querySelectorAll('div.userPick')
const rightCardPick = document.querySelectorAll('div.compPick')
const compScoreShow = document.getElementById('comp-points')
const restult = document.getElementById('result')
const resultRestart = document.getElementById('result-restart')
const userScoreShow = document.getElementById('user-points')
let userPick
let compPick
let userScore = 0
let compScore = 0
let lowestScore = ''


btnName.addEventListener('click', function(e){
    e.preventDefault();
    showName.innerText = 'Välkommen' + ' ' + inputName.value
    userInfo.name = inputName.value
    updateDatabase()
})
displayTopFiveHighscores()

leftCardPick.forEach(leftCardPick => leftCardPick.addEventListener('click', (e) =>{
    e.preventDefault();
    userPick = e.target.id
    userChoiceShow.innerText = userPick
    addComputerChoise()
    result()
    sortScores()
}))
   
function addComputerChoise(){
    const randomNumber = Math.floor(Math.random() * leftCardPick.length) +1
    
    if(randomNumber === 1){
        compPick = 'ROCK'
        
    }
    if(randomNumber === 2){
        compPick = 'PAPER'
        
    }
    if(randomNumber === 3){
        compPick = 'SCISSOR'
       
    }
    compChoiceShow.innerHTML = compPick
}     


function result(){
    if(compPick === userPick){
     restult.innerText = 'DRAW!'
     restult.style.color = 'orange'
     resultRestart.innerText = 'Draw, play again'
     resultRestart.style.color = 'orange'
    }
    else if(compPick === 'ROCK' && userPick === 'PAPER' || compPick === 'PAPER' && userPick === 'SCISSOR' || compPick === 'SCISSOR' && userPick === 'ROCK'){
        restult.innerText = 'YOU WIN!'
        restult.style.color = 'green'
        resultRestart.innerText = 'You won, play again'
        resultRestart.style.color = 'green'
        userInfo.score = userScore
        userScore++
        userScoreShow.innerText = `${userScore}`
        console.log(userScore)
        updateDatabase(userInfo)
        
    }
    else if(compPick === 'ROCK' && userPick === 'SCISSOR' || compPick === 'PAPER' && userPick === 'ROCK' || compPick === 'SCISSOR' && userPick === 'PAPER'){
        restult.innerText = 'YOU LOSE!'
        restult.style.color = 'red'
        compScoreShow.innerText = (compScore++)+1
        resultRestart.innerText = 'YOU LOST THE GAME! GAME RESTARTED'
        resultRestart.style.color = 'red'
        compScore = 0
        userScore = 0
        compScoreShow.innerText = '0'
        userScoreShow.innerText = '0'
        // setTimeout(() =>{
        //     location.reload()
        // },2000) 
    }
}


//--------------------------------------- firebase
// Hämta data från databasen
async function getHighScores() {
    const response = await fetch(baseUrl);
    const highScores = await response.json();
    return highScores;
}


// Sortera highscores från högsta till lägsta
async function sortScores() {
    const highscores = await getHighScores();
    const highscoreArr = Object.entries(highscores);

    const sortedHighscores = highscoreArr.sort(
        (a, b) => b[1].score - a[1].score
    );
    
    lowestScore = sortedHighscores[sortedHighscores.length - 1][0];
    lowestScoreValue = sortedHighscores[sortedHighscores.length - 1][1];
    
    const resultArr = sortedHighscores.map((sortedHighscore) => sortedHighscore[1]);
    // console.log(resultArr);
    displayTopFiveHighscores()
    return resultArr;
}


async function displayTopFiveHighscores() {
    const highScores = await sortScores();
    const highscoreList = document.querySelector('ol');
    
    highScores.slice(0, 5).forEach((element) => {
        const nameAndScore = document.createElement('li');
        nameAndScore.innerText = `${element.name} : ${element.score}`;
        highscoreList.append(nameAndScore);
    });

    
    const additionalScores = highscoreList.querySelectorAll('li')[5];
    if (additionalScores) {
        additionalScores.remove();
    }
    
    
    highscoreList.innerHTML = '';
    
    
    highScores.slice(0, 5).forEach((element) => {
        const nameAndScore = document.createElement('li');
        nameAndScore.innerText = `${element.name} : ${element.score}`;
        highscoreList.append(nameAndScore);
    });
}


async function updateDatabase() {
     const highscores = await getHighScores();

    let userName = inputName.value
    console.log(highscores[userName]);
    highscores[userName] = {
    name: userName,
    score: userScore
    };

    const init = {
      method: "PUT",
      body: JSON.stringify(highscores),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };

    const response = await fetch(baseUrl, init);
}



    





