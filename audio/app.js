const rules = {
    F: 'FF-[-F+F+F]+[+F-F-F]'
}

const axiom = 'F'

let output = axiom

let numGenerations = 4

let deg = 22.5;
let rad = deg * Math.PI / 180


var canvas = document.getElementsByTagName('canvas')[0]
var ctx = canvas.getContext('2d')

this.canvas.width = this.height = window.innerWidth
this.canvas.height = this.width = window.innerHeight

var turtle = Turtle.create(ctx, canvas.width / 2, canvas.height)
turtle.color = "green"
for (let i = 0; i < numGenerations; i++) {
    let newOutput = ''
    for (let char of output) {
        if (char == 'F')
            newOutput = output.replace(/F/g, rules['F'])
    }
    output = newOutput
}

for (let char of output) {
    if (char == 'F') {
        turtle.move(10)
    } else if (char == '-') {
        turtle.rotate(rad)
    } else if (char == '+') {
        turtle.rotate(-rad)
    } else if (char == '[') {
        turtle.push();
    } else if (char == ']') {
        turtle.pop();
    }
}