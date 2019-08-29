// Canvas setup
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

// Setup global variables
let cardClicked
let interval = 0
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
    this.fColor = 'black'
    this.index = index
    this.cover = new Image()
    this.cover.src = back
    this.isCovered = true
    // this.front = text
    // this.textSrc = textSrc
    // this.fontSizeAndName = '24px Courier'
    // this.textX = 0
    // this.textY = 0
    // this.textMaxWidth = 0

    // this.frontText = new Image()
    // this.frontText.src = text

    this.definition = new Image()
    this.definition.src = knowledgeBase[0].definition
    this.concept = new Image()
    this.concept.src = knowledgeBase[0].concept

  }

  draw() {
    // if (this.isCovered) {
    //   ctx.drawImage(this.cover, this.x, this.y, this.width, this.height)
    // } else {
    //   ctx.drawImage(this.frontText, this.x, this.y, this.width, this.height)
    // }
    ctx.beginPath()
    // console.log("Dibujando nuevo rect en " + this.fColor + this.x, this.y, this.width, this.height)
    ctx.fillStyle = this.fColor
    ctx.rect(this.x, this.y, this.width, this.height)
    ctx.fill()
    ctx.closePath()
  }

  setFillColor(color) {
    this.fColor = color
  }

  getFillColor() {
    return this.fColor
  }

  setText(text, textType) {
    this.text = text
    this.textType = textType
    // ctx.beginPath()
    // ctx.fillStyle = 'white'
    // ctx.font = this.fontSizeAndName
    if (this.textType === 'concept') {

      // var imageObj = new Image();
      // imageObj.onload = function () {
      //   context.drawImage(this, 0, 0);
      // };

      // imageObj.src = dataURL;
      // this.concept.src = this.text

      // this.concept.onload = function () {
      ctx.drawImage(this.concept, this.x, this.y, this.width, this.height);
      // };

      console.log("concept")

      // imageObj.src = dataURL;
      // ctx.drawImage(this.concept, this.x, this.y)

      // this.textX = this.x + 1 //(this.x + this.width) / 2
      // this.textY = this.y + 10 //(this.y + this.height) / 2

    } else if (this.textType === 'definition') {
      console.log("definition")
      // this.definition.src = this.text
      ctx.drawImage(this.definition, this.x, this.y, this.width, this.height)
      // this.textX = this.x + 2
      // this.textY = this.y + 2

    }
    // this.textMaxWidth = this.x + 5 + this.width - 5
    // ctx.fillText(text, this.textX, this.textY)
  }

  flip() {
    if (this.getFillColor() === 'black') this.setFillColor('white')
    else if (this.getFillColor() === 'white') this.setFillColor('black')
    // if (this.isCovered) this.isCovered = false
    // else this.isCovered = true
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
    for (let i = 0; i < this.cards; i++) {
      if (this.x + this.width > canvasLimit) {
        this.x = 10
        this.y += this.height + vGap
      }
      const card = new Cards(this.x, this.y, this.width, this.height, i)
      this.cardMatrix.push(card)
      this.x += this.width + hGap
    }
  }
}

// Functions

canvas.addEventListener('click', clickHandler)

function clickHandler(e) {
  e.preventDefault()
  let mouseX = e.pageX - canvas.offsetLeft
  let mouseY = e.pageY - canvas.offsetTop
  // console.log(mouseX, mouseY)
  for (let i = 0; i < board.cardMatrix.length; i++) {
    const card = board.cardMatrix[i]
    if ((mouseX >= card.x && mouseX <= card.x + card.width) && (mouseY >= card.y && mouseY <= card.y + card.height)) {
      // console.log("click!")
      clickedCard(card)
      // break
    }
  }
}

function clickedCard(card, e) {
  card.flip()
  // cardsFlipped++
  // console.log('clickedCard!')
  // updateCanvas()
  if (cardsFlipped.firstCardIndex === null) {
    cardsFlipped.firstCardIndex = card.index
    // console.log("Ya no soy null " + cardsFlipped.firstCardIndex)
    board.cardMatrix[cardsFlipped.firstCardIndex].setText(knowledgeBase[0].definition, 'definition')

  } else {
    cardsFlipped.secondCardIndex = card.index
    board.cardMatrix[cardsFlipped.secondCardIndex].setText(knowledgeBase[0].concept, 'concept')

    const timeOutId = setTimeout(() => {
      board.cardMatrix[cardsFlipped.firstCardIndex].flip()
      board.cardMatrix[cardsFlipped.secondCardIndex].flip()
      cardsFlipped.firstCardIndex = null
      cardsFlipped.secondCardIndex = null
      canvas.addEventListener('click', clickHandler)
    }, 2000)
    // updateCanvas()
    canvas.removeEventListener('click', clickHandler)
  }

}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function updateCanvas() {
  clearCanvas()
  board.draw()
}

// Instances & variables
// const cards = new Cards(10, 10, 100, 140)
// cards.draw()

// const board = new CardBoard(25, 114, 128) // 5x5 
// const board = new CardBoard(16, 120, 159) // 4x4
const board = new CardBoard(9, 170, 213) // 3x3 

board.createCards()
board.draw()
// interval = setInterval(updateCanvas, 1000 / 60)