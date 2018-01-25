/*
For this project I experimented a lot with color and changing the basic rule set to include four as an
attribute for overpopulation. I originally had tried to implement taking a screenshot of the final version of
the game and importing that into a gallery page, but I couldn't get it to work without running my own server
(which is problematic on banjo). So, I messed around with the rules. 

I ended up implementing some of the things mentioned in the wikipedia article, such as high life with 23/34 instead
of regular 23/3. 

I tweeked the original starting of the game of life so now it looks pretty dope and it refreshes once finished.

I also played around with the framerate, and implemented a feature where you can change it. Not within the webpage 
itself, but in the code. 
*/

! function () {
  'use strict'

  let currentGrid = []
  let nextGrid = []

  let gridSize = 500


  let fpsInterval, startTime, now, then, elapsed;

  const app = {
    canvas: null,
    ctx: null,

    // CHANGE TO LIMIT FRAMERATE
    fps: 60,

    init() {
      
      
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
          } 
          // CHANGE FROM RANDOMIZED GRID TO A VERY COOL ONE
          else if(i == j || gridSize-i == j){
            currentGrid[i][j] =1;
          } else{
            currentGrid[i][j] =0;
          }
          // else
          //   currentGrid[i][j] = Math.random() > .8 ? 1 : 0
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
          if ((currentGrid[x][y] == 1) && (count < 2 )) nextGrid[x][y] = 0;
          else if ((currentGrid[x][y] == 1) && (count > 3)) nextGrid[x][y] = 0;
          //else if ((currentGrid[x][y] == 0) && (count > 4)) nextGrid[x][y] = 0;
          else if ((currentGrid[x][y] == 0) && (count ==3 )) nextGrid[x][y] = 1;
          else if ((count ==4 )) nextGrid[x][y] = 1;
          else nextGrid[x][y] = currentGrid[x][y];
        }
      }

      // assign values in nextGrid to curGrid
      let swap = currentGrid
      currentGrid = nextGrid
      nextGrid = swap
    },

    draw() {
      this.fps = document.getElementById("slider").value;
      this.fpsInterval = 1000 / this.fps;
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
              count++;
              this.ctx.strokeRect(xPos, yPos, cellWidth, cellHeight)
              this.ctx.fillRect(xPos, yPos, cellWidth, cellHeight)
            }
          }
        }
        if (count > gridSize * gridSize / 5) {
          location.reload();
        }
      }
    }
  }

  window.onload = app.init.bind(app)

}()