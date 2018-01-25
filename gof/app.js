! function () {
  'use strict'

  let currentGrid = []
  let nextGrid = []

  let gridSize = 100


  let fpsInterval, startTime, now, then, elapsed;

  const app = {
    canvas: null,
    ctx: null,

    // CHANGE TO LIMIT FRAMERATE
    fps: 10,

    init() {
      this.fpsInterval = 1000 / this.fps;
      this.then = Date.now();
      this.startTime = this.then;
      this.canvas = document.getElementsByTagName('canvas')[0]
      this.ctx = this.canvas.getContext('2d')
      this.draw = this.draw.bind(this)
      this.fullScreenCanvas()

      window.onresize = this.fullScreenCanvas.bind(this)

      requestAnimationFrame(this.draw)

      for (let i = 0; i < gridSize; i++) {
        currentGrid[i] = []
        nextGrid[i] = []
        for (let j = 0; j < gridSize; j++) {
          if (j == 0 || i == 0 || j == gridSize - 1 || i == gridSize - 1) {
            currentGrid[i][j] = 0;
          } else
            currentGrid[i][j] = Math.random() > .8 ? 1 : 0
          nextGrid[i][j] = 0
        }
      }
    },

    fullScreenCanvas() {
      this.canvas.width = this.height = window.innerWidth
      this.canvas.height = this.width = window.innerHeight
    },

    // update your simulation here
    animate() {
      // for each cell....
      //    count number of live neighbors
      //    use game of life rules to det if cell lives / dies
      //    set new cell value in nextGrid 

      // Loop through every spot in our 2D array and check spots neighbors
      for (let x = 1; x < gridSize - 1; x++) {
        for (let y = 1; y < gridSize - 1; y++) {
          // Add up all the states in a 3x3 surrounding grid
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              count += currentGrid[x + i][y + j];
            }
          }
          count -= currentGrid[x][y];
          // Rules of Life
          if ((currentGrid[x][y] == 1) && (count <= 2)) nextGrid[x][y] = 0;
          else if ((currentGrid[x][y] == 1) && (count >= 4)) nextGrid[x][y] = 0;
          else if ((currentGrid[x][y] == 0) && (count >= 3)) nextGrid[x][y] = 1;
          else nextGrid[x][y] = currentGrid[x][y];
        }
      }

      // assign values in nextGrid to curGrid
      let swap = currentGrid
      currentGrid = nextGrid
      nextGrid = swap
    },

    draw() {
      requestAnimationFrame(this.draw)

      this.now = Date.now();
      this.elapsed = this.now - this.then;

      //console.log(this.elapsed);
      //console.log(this.fpsInterval);

      // if enough time has elapsed, draw the next frame

      if (this.elapsed > this.fpsInterval) {
        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        this.then = this.now - (this.elapsed % this.fpsInterval);
        // Put your drawing code here
        this.animate()

        // draw to your canvas here
        this.ctx.fillStyle = '#CCE6F4'
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)


        let cellWidth = this.canvas.width / gridSize
        let cellHeight = this.canvas.height / gridSize
        var count = 0;
        for (let i = 0; i < gridSize; i++) {
          let row = currentGrid[i]
          let yPos = i * cellHeight

          for (let j = 0; j < gridSize; j++) {
            let cell = row[j]

            if (cell === 1) {
              let xPos = j * cellWidth
              if (currentGrid[i][j] == nextGrid[i][j]) {
                this.ctx.fillStyle = '#175676'
                this.ctx.strokeStyle = '#175676'
              } else {
                this.ctx.fillStyle = '#4BA3C3'
                this.ctx.strokeStyle = '#4BA3C3'
              }
              count ++;
              this.ctx.strokeRect(xPos, yPos, cellWidth, cellHeight)
              this.ctx.fillRect(xPos, yPos, cellWidth, cellHeight)
            }
          }
        }
        if(count > gridSize*gridSize / 2.2){
          location.reload();
        }
      
      }
    }
  }

  window.onload = app.init.bind(app)

}()