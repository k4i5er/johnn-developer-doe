// Canvas setup
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const startButton = document.querySelector('button')
const startScreen = document.querySelector('#start-screen')
const game = document.querySelector('#game')

// Setup global variables
let cardClicked
let interval = 0
let boost = 0
let fails = 0

// Setup data structures
const cardsFlipped = {
  firstCardIndex: null,
  secondCardIndex: null
}
const knowledgeBase = [{
    level: 1,
    concept: './img/c1.png',
    definition: './img/d1.png'
  },
  {
    level: 1,
    concept: './img/c2.png',
    definition: './img/d2.png'
  },
  {
    level: 1,
    concept: './img/c3.png',
    definition: './img/d3.png'
  },
  {
    level: 1,
    concept: './img/c4.png',
    definition: './img/d4.png'
  },
  {
    level: 1,
    concept: './img/c5.png',
    definition: './img/d5.png'
  },
  {
    level: 1,
    concept: './img/c6.png',
    definition: './img/d6.png'
  }
]

// Classes
class Cards {
  constructor(x, y, width, height, index, text, back) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.index = index
    this.cover = new Image
    this.cover.src = back
    this.isCovered = true
    this.frontText = new Image
    this.frontText.src = text
  }

  draw() {
    if (this.isCovered) {
      this.cover.addEventListener('load', e => {
        ctx.drawImage(this.cover, this.x, this.y, this.width, this.height)
      })
      ctx.drawImage(this.cover, this.x, this.y, this.width, this.height)
    } else if (this.isCovered === false) {
      this.frontText.addEventListener('load', e => {
        ctx.drawImage(this.frontText, this.x, this.y, this.width, this.height);
      })
      ctx.drawImage(this.frontText, this.x, this.y, this.width, this.height);
    }
  }

  flip() {
    if (this.isCovered) {
      this.isCovered = false
    } else {
      this.isCovered = true
    }
    this.draw()
  }
}

class CardBoard {
  constructor(cards, width, height) {
    this.cards = cards
    this.width = width
    this.height = height
    this.cardMatrix = []
    this.x = 10
    this.y = 10
  }

  draw() {
    for (let i = 0; i < this.cards; i++) {
      this.cardMatrix[i].draw()
    }
  }

  drawIterations() {
    ctx.beginPath()
    ctx.font = 'bold 30px Courier'
    ctx.fillStyle = 'white'
    ctx.fillText('1st', 850, 105)
    ctx.fillText('Iteration', 850, 135)

    ctx.arc(820, 110, 20, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#f00';
    ctx.fill()
    ctx.lineWidth = 4
    ctx.strokeStyle = '#030'
    ctx.stroke()

    ctx.fillStyle = 'white'
    ctx.fillText('2nd', 850, 255)
    ctx.fillText('Iteration', 850, 285)

    ctx.moveTo(840, 260)
    ctx.arc(820, 260, 20, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#f00';
    ctx.fill()
    ctx.lineWidth = 4
    ctx.strokeStyle = '#030'
    ctx.stroke()

    ctx.fillStyle = 'white'
    ctx.fillText('3rd', 850, 405)
    ctx.fillText('Iteration', 850, 435)

    ctx.moveTo(840, 410)
    ctx.arc(820, 410, 20, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#f00';
    ctx.fill()
    ctx.lineWidth = 4
    ctx.strokeStyle = '#030'
    ctx.stroke()

    ctx.fillStyle = 'white'
    ctx.fillText('4th', 850, 555)
    ctx.fillText('Iteration', 850, 585)

    ctx.moveTo(840, 560)
    ctx.arc(820, 560, 20, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#f00';
    ctx.fill()
    ctx.lineWidth = 4
    ctx.strokeStyle = '#030'
    ctx.stroke()
    ctx.closePath()
  }

  createCards() {
    let hGap = 0
    let vGap = 0
    const canvasLimit = canvas.width - 400

    switch (this.cards) {
      case 9:
        hGap = 20
        vGap = 20
        break;
      case 16:
        hGap = 15
        vGap = 15
        break;
      case 25:
        hGap = 10
        vGap = 10
        break;
    }
    const randomPairs = getRandomPairs()
    for (let i = 0; i < this.cards; i++) {
      if (this.x + this.width > canvasLimit) {
        this.x = 10
        this.y += this.height + vGap
      }
      const card = new Cards(this.x, this.y, this.width, this.height, i, randomPairs[i], './img/card-back1.jpg')
      this.cardMatrix.push(card)
      this.x += this.width + hGap
    }
  }
}


class Character {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.johnPic = new Image()
    this.johnPic.src = './img/oh.png'
    this.johnBoostMood = new Image()
    this.johnBoostMood.src = './img/yes.png'
    this.johnGeniusMood = new Image()
    this.johnGeniusMood.src = './img/genius.png'
    this.johnReally = new Image()
    this.johnReally.src = './img/really.png'
    this.johnWTF = new Image()
    this.johnWTF.src = './img/gotita.png'
    this.johnPic.addEventListener('load', () => ctx.drawImage(this.johnPic, this.x, this.y, this.width, this.height)) //680, 50, 90, 90))

    // this.johnBoostMood.addEventListener('load', () => ctx.drawImage(this.johnBoostMood, this.x, this.y, this.width, this.height)) //680, 50, 90, 90))

  }

  draw() {
    switch (boost) {
      case 0:
        ctx.drawImage(this.johnPic, this.x, this.y, this.width, this.height)
        break
      case 1:
      case 2:
      case 3:
        ctx.drawImage(this.johnBoostMood, this.x, this.y, this.width, this.height)
        break
      case 4:
        ctx.drawImage(this.johnGeniusMood, this.x - 100, this.y - 500, this.width + 300, this.height + 300)
    }
    // console.log('pic ' + this.johnPic.src)
  }

  drawMissed() {
    switch (fails) {
      case 1:
        ctx.drawImage(this.johnReally, this.x, this.y, this.width, this.height)
        break
      case 2:
        ctx.drawImage(this.johnWTF, this.x, this.y, this.width, this.height)
        fails = 0
        break
    }
  }

  move() {
    for (let i = 0; i < 140; i++) {
      this.y++
    }
  }
}

// Listeners

canvas.addEventListener('click', clickHandler)
startButton.addEventListener('click', startGame)

// Functions

function clickHandler(e) {
  let mouseX = e.pageX - canvas.offsetLeft
  let mouseY = e.pageY - canvas.offsetTop
  for (let i = 0; i < board.cardMatrix.length; i++) {
    let card = board.cardMatrix[i]
    if ((mouseX >= card.x && mouseX <= card.x + card.width) && (mouseY >= card.y && mouseY <= card.y + card.height) && card.isCovered) {
      clickedCard(card)
      // break
    }
  }
}

function clickedCard(card) {
  card.flip()
  if (cardsFlipped.firstCardIndex === null) {
    cardsFlipped.firstCardIndex = card.index
  } else {
    cardsFlipped.secondCardIndex = card.index
    const card1 = board.cardMatrix[cardsFlipped.firstCardIndex]
    const card2 = board.cardMatrix[cardsFlipped.secondCardIndex]
    cardsFlipped.firstCardIndex = null
    cardsFlipped.secondCardIndex = null
    const timeOutId = setTimeout(() => {
      card1.flip()
      card2.flip()
      canvas.addEventListener('click', clickHandler)
    }, 2000)
    canvas.removeEventListener('click', clickHandler)

    if (card1.frontText.src.charAt(card1.frontText.src.length - 5) === card2.frontText.src.charAt(card2.frontText.src.length - 5)) {
      canvas.addEventListener('click', clickHandler)
      clearTimeout(timeOutId)
      boost++
      john.move()
      updateCanvas()
      switch (boost) {
        case 1:
          ctx.beginPath()
          ctx.arc(820, 110, 20, 0, 2 * Math.PI, false);
          ctx.fillStyle = '#3f3';
          ctx.fill()
          ctx.lineWidth = 4
          ctx.strokeStyle = '#030'
          ctx.stroke()
          ctx.closePath()
          break
        case 2:
          ctx.beginPath()
          ctx.moveTo(840, 260)
          ctx.arc(820, 260, 20, 0, 2 * Math.PI, false);
          ctx.fillStyle = '#3f3';
          ctx.fill()
          ctx.lineWidth = 4
          ctx.strokeStyle = '#030'
          ctx.stroke()
          ctx.closePath()
          break
        case 3:
          ctx.beginPath()
          ctx.moveTo(840, 410)
          ctx.arc(820, 410, 20, 0, 2 * Math.PI, false);
          ctx.fillStyle = '#3f3';
          ctx.fill()
          ctx.lineWidth = 4
          ctx.strokeStyle = '#030'
          ctx.stroke()
          ctx.closePath()
          break
        case 4:
          ctx.beginPath()
          ctx.moveTo(840, 560)
          ctx.arc(820, 560, 20, 0, 2 * Math.PI, false);
          ctx.fillStyle = '#f00';
          ctx.fill()
          ctx.lineWidth = 4
          ctx.strokeStyle = '#030'
          ctx.stroke()
          ctx.closePath()
          break
      }
    } else {
      fails++
      ctx.clearRect(john.x, john.y, john.width, john.height)
      john.drawMissed()
    }
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function updateCanvas() {
  clearCanvas()
  board.draw()
  board.drawIterations()
  john.draw()

}

function randomizeAll(min, length) {
  const arr = []
  let i = min
  do {
    const nuevo = Math.floor(min + (Math.random() * length))
    if (arr.indexOf(nuevo) != -1) {
      continue;
    } else {
      arr.push(nuevo)
      i++
    }
  } while (arr.length < length)
  return arr
}

function getRandomPairs() {
  const arrPairs = []
  const randomIndex = randomizeAll(0, 6)
  for (let i = 0; i < randomIndex.length - 1; i++) {
    arrPairs.push(knowledgeBase[randomIndex[i]].concept)
    arrPairs.push(knowledgeBase[randomIndex[i]].definition)
  }
  arrPairs.sort(() => Math.random() - 0.5)
  return arrPairs
}

// Instances & variables

// const board = new CardBoard(25, 114, 128) // 5x5 
// const board = new CardBoard(16, 120, 159) // 4x4
const board = new CardBoard(9, 170, 213) // 3x3 
const john = new Character(650, 50, 120, 120)

function startGame() {
  startScreen.style.display = 'none'
  game.style.display = 'flex'
  board.createCards()
  board.draw()
  board.drawIterations()
  john.draw()
  updateCanvas()
}