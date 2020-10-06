let blackjackGame = {
    'you': { 'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0 },
    'aman': { 'scoreSpan': '#aman-blackjack-result', 'div': '#aman-box', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [1, 11] },
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'trunOver': false,
};


const YOU = blackjackGame['you'];
const Aman = blackjackGame['aman'];

const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3');
const lostSound = new Audio('static/sounds/aww.mp3');


document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);

function blackjackHit() {
    if (blackjackGame['isStand'] === false) {
        let card = randomCard();
        console.log(card);
        showCard(YOU, card);
        updateScore(YOU, card);
        console.log(YOU['score']);
        showScore(YOU);

    }


}


function showCard(activePlayer, card) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `static/images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }

}



function blackjackDeal() {



    if (blackjackGame['isStand'] === true) {
        blackjackGame['isStand'] = false;
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let amanImages = document.querySelector('#aman-box').querySelectorAll('img');
        console.log(yourImages);

        for (i = 0; i < yourImages.length; i++) {
            yourImages[i].remove();
        }
        for (i = 0; i < amanImages.length; i++) {
            amanImages[i].remove();
        }
        YOU['score'] = 0;
        Aman['score'] = 0;
        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#your-blackjack-result').style.color = 'white';
        document.querySelector('#aman-blackjack-result').textContent = 0;
        document.querySelector('#aman-blackjack-result').style.color = 'white';

        hitSound.play();
        blackjackGame['trunOver'] = true;
    }


}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];

}

function updateScore(activePlayer, card) {
    if (card === 'A') {
        if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21) {
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        } else {
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }

    } else {
        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }

}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'MAX OUT!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
        document.querySelector(activePlayer['scoreSpan']).style.color = 'white';
    }

}

function dealerLogic() {

    blackjackGame['isStand'] = true;
    let card = randomCard();
    console.log(card);
    showCard(Aman, card);
    updateScore(Aman, card);
    console.log(Aman['score']);
    showScore(Aman);
    showResult();

    if (Aman['score'] > 15) {
        blackjackGame['trunOver'] = true;
        showResult(computeWinner());
    }


}


function computeWinner() {
    let winner;


    if (YOU['score'] <= 21) {
        if (YOU['score'] > Aman['score'] || Aman['score'] > 21) {
            console.log("YOU win");
            blackjackGame['wins']++;
            winner = YOU;
        } else if (YOU['score'] < Aman['score'] || Aman['score'] <= 21) {
            console.log("Aman win");
            blackjackGame['losses']++;
            winner = Aman;
        } else if (YOU['score'] === Aman['score']) {
            console.log("Draw");
            blackjackGame['draws']++;
            // winner = Aman;
        }

    } else if (Aman['score'] <= 21 && YOU['score'] > 21) {
        console.log("Aman win");
        blackjackGame['losses']++;
        winner = Aman;
    } else if (Aman['score'] > 21 && YOU['score'] > 21) {
        console.log("Draw");
        blackjackGame['draws']++;
        // winner = Aman;
    }

    console.log("winner is ", winner);
    console.log(blackjackGame);
    return winner;
}


function showResult(winner) {
    let message, messageColor;
    if (winner === YOU) {
        document.querySelector('#wins').textContent = blackjackGame['wins'];
        message = "You Win";
        messageColor = 'green';
        winSound.play();
    } else if (winner === Aman) {
        document.querySelector('#losses').textContent = blackjackGame['losses'];
        message = "You Lost";
        messageColor = 'red';
        lostSound.play();
    } else {
        document.querySelector('#draws').textContent = blackjackGame['draws'];
        message = "Result Draw";
        messageColor = 'black';
    }

    document.querySelector('#blackJack_result').textContent = message;
    document.querySelector('#blackJack_result').style.color = messageColor;

}