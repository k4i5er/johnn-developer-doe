// Canvas setup
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

// Classes
class Cards {
  constructor(x, y, width, height, pattern) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.pattern = pattern
  }

  draw(covered = false) {
    ctx.rect(this.x, this.y, this.width, this.height)
    ctx.fillStyle = 'black'
    ctx.fill()
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
      const card = new Cards(this.x, this.y, this.width, this.height)
      card.draw()
      this.cardMatrix.push(card)
      this.x += this.width + hGap
    }
  }

}

// Functions

// Instances & variables
// const cards = new Cards(10, 10, 100, 140)
// cards.draw()

const board = new CardBoard(25, 114, 128) // 5x5 
// const board = new CardBoard(16, 120, 159) // 4x4
// const board = new CardBoard(9, 170, 213) // 3x3 
board.draw()