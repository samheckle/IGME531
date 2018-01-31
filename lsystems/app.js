const rules = {
    F: 'FF-[-F+F+F]+[+F-F-F]',
    //B: 'ABA'
}

const axiom = 'F'

let output = axiom

let numGenerations = 5

let deg = 22.5;
let rad = deg * Math.PI / 180


var canvas = document.getElementsByTagName('canvas')[0]
var ctx = canvas.getContext('2d')

this.canvas.width = this.height = window.innerWidth
this.canvas.height = this.width = window.innerHeight

var turtle = Turtle.create(ctx, canvas.width / 2, canvas.height)

for (let i = 0; i < numGenerations; i++) {
    let newOutput = ''
    for (let char of output) {
        if (char == 'F') {
            turtle.move(10)
            newOutput = output.replace(/F/g, rules['F'])
        } else if (char == '-') {
            turtle.rotate(rad)
        } else if (char == '+') {
            turtle.rotate(-rad)
        } else if (char == '[') {
            turtle.push();
        } else if (char == ']') {
            turtle.pop();
        }
        // if (char == 'F')
        //     newOutput = output.replace(/F/g, rules['F'])
    }
    output = newOutput
}

// for (let char of output) {
//     if (char == 'F') {
//         turtle.move(10)
//     } else if (char == '-') {
//         turtle.rotate(rad)
//     } else if (char == '+') {
//         turtle.rotate(-rad)
//     } else if (char == '[') {
//         turtle.push();
//     } else if (char == ']') {
//         turtle.pop();
//     }
// }