const rules = {
    A: 'ABA',
}

const axiom = 'A'

let output = axiom

let numGenerations = 3

let deg = 22.5;
let rad = deg * Math.PI / 180


var canvas = document.getElementsByTagName('canvas')[0]
var ctx = canvas.getContext('2d')

this.canvas.width = this.height = window.innerWidth
this.canvas.height = this.width = window.innerHeight

var turtle = Turtle.create(ctx, canvas.width / 3, canvas.height / 2)
turtle.rotate(Math.PI / 2)
for (let i = 0; i < numGenerations; i++) {
    for (let char of output) {
        if (char == 'A') {
            turtle.move(100)
        } else {
            turtle.push();
        }
    }
}
let newOutput = ''
for (let char of output) {
    if (char == 'A') {
        newOutput = output.replace(/A/g, rules['A'])
    }
}
output = newOutput