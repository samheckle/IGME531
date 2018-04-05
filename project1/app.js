
    'use strict'

    var numCircle = 100
    var circles = []
    var squares = []
    var canvas, ctx, audio

    var Circle = function (px, py, pr, psp, pysp, pid) {
        this.x = px;
        this.y = py;
        this.r = pr;
        this.r2 = this.r * this.r;
        this.sp = psp;
        this.ysp = pysp;
        this.id = pid;

        //oscC.type = 'square';

        this.update = function () {
            for (var i = this.id + 1; i < numCircle; i++) {
                app.intersect(circles[this.id], circles[i]);
            }
        }

        this.move = function () {
            this.x += this.sp;
            this.y += this.ysp;
            if (this.sp > 0) {
                if (this.x > canvas.width + this.r) {
                    this.x = -this.r;
                }
            } else {
                if (this.x < -this.r) {
                    this.x = canvas.width + this.r;
                }
            }
            if (this.ysp > 0) {
                if (this.y > canvas.height + this.r) {
                    this.y = -this.r;
                }
            } else {
                if (this.y < -this.r) {
                    this.y = canvas.height + this.r;
                }
            }
        }
    }

    var Square = function (x, y, r, xspeed, yspeed, id) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.r2 = this.r * this.r;
        this.sp = xspeed;
        this.ysp = yspeed;
        this.id = id;

        this.update = function () {
            for (var i = this.id + 1; i < numCircle; i++) {
                app.intersect(squares[this.id], squares[i])
            }
        }

        this.move = function () {
            this.x += this.sp
            this.y += this.ysp
            if (this.sp > 0) {
                if (this.x > canvas.width + this.r) {
                    this.x = -this.r
                }
            } else {
                if (this.x < -this.r) {
                    this.x = canvas.width + this.r
                }
            }
            if (this.ysp > 0) {
                if (this.y > canvas.height + this.r) {
                    this.y = -this.r
                }
            } else {
                if (this.y < -this.r) {
                    this.y = canvas.height + this.r
                }
            }


        }
    }
    var Gui = function () {
        this.circles = true
        this.squares = false
        this.reset = function () {
            location.reload()
        }
    };

    const app = {

        c: false,
        s: false,
        init() {

            if(this.guiProp == undefined){
                this.guiProp = new Gui()
                var gui = new dat.GUI()
    
                gui.add(this.guiProp, 'reset')
            }
            

            canvas = document.getElementsByTagName('canvas')[0]
            ctx = canvas.getContext('2d')
            //audio = new AudioContext()
            
            canvas.width = this.width = window.innerWidth
            canvas.height = this.height = window.innerHeight

            for (var i = 0; i < numCircle; i++) {
                var x = Math.random() * this.width;
                var y = Math.random() * this.height;
                var r = (Math.random() * 60) + 10;
                var xspeed = (Math.random() * .25) - .25;
                var yspeed = (Math.random() * .25) - .25;

                if (this.c)
                    circles.push(new Circle(x, y, r, xspeed, yspeed, i))
                else if (this.s)
                    squares.push(new Square(x, y, r, xspeed, yspeed, i))
            }

            this.draw = this.draw.bind(this)

            requestAnimationFrame(this.draw)
        },

        draw() {
            requestAnimationFrame(this.draw)
            if (this.c) {
                for (var i = 0; i < circles.length; i++) {
                    circles[i].update();
                }
                for (var j = 0; j < circles.length; j++) {
                    circles[j].move();
                }
            } else if (this.s) {
                for (var i = 0; i < squares.length; i++) {
                    squares[i].update();
                }
                for (var j = 0; j < squares.length; j++) {
                    squares[j].move();
                }
            }
        },

        intersect(cA, cB) {

            var dx = cA.x - cB.x;
            var dy = cA.y - cB.y;
            var d2 = dx * dx + dy * dy;
            var d = Math.sqrt(d2);

            // var osc = audio.createOscillator()
            // osc.connect(audio.destination)
            // osc.type = 'sine'

            // var rand = Math.random(0,100)

            // if( rand < 10 ){
            //     osc.frequency.setValueAtTime(440, audio.currentTime)
            //     osc.start()
            // }
            
            
            if ((d > cA.r + cB.r) || (d < Math.abs(cA.r - cB.r))) {
                //osc.stop()
                return; // no solution 
            }

            var a = (cA.r2 - cB.r2 + d2) / (2 * d);
            var h = Math.sqrt(cA.r2 - a * a);
            var x2 = cA.x + a * (cB.x - cA.x) / d;
            var y2 = cA.y + a * (cB.y - cA.y) / d;

            var paX = x2 + h * (cB.y - cA.y) / d;
            var paY = y2 - h * (cB.x - cA.x) / d;
            var pbX = x2 - h * (cB.y - cA.y) / d;
            var pbY = y2 + h * (cB.x - cA.x) / d;


            ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.beginPath();
            ctx.moveTo(paX, paY);
            ctx.lineTo(pbX, pbY);
            ctx.stroke();


        }
    }
    //window.onload = () => app.init()
