var canvas, ctx
const start = {
    init() {
        canvas = document.getElementsByTagName('canvas')[0]
        ctx = canvas.getContext('2d')

        canvas.width = this.width = window.innerWidth
        canvas.height = this.height = window.innerHeight

        window.addEventListener("mousemove", this.getColor, false)
        window.addEventListener("mousedown", this.getPosition, false)

        ctx.font = "30px Raleway";
        ctx.fillText("Circles", canvas.width / 4, canvas.height / 2)
        ctx.fillText("Squares", canvas.width * 3 / 4, canvas.height / 2)

    },

    getColor(event) {
        if (event.x < canvas.width / 2) {
            ctx.fillStyle = "rgba(202, 241, 237, 0.01)"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            if (!app.c && !app.s) {
                ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
                ctx.fillText("Circles", canvas.width / 4, canvas.height / 2)
            }
        } else if (event.x > canvas.width / 2) {
            ctx.fillStyle = "rgba(241, 227, 202, 0.01)"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            if (!app.c && !app.s) {
                ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
                ctx.fillText("Squares", canvas.width * 3 / 4, canvas.height / 2)
            }
        }
    },

    getPosition(event) {
        this.x = event.x;
        this.y = event.y;

        this.x -= canvas.offsetLeft;
        this.y -= canvas.offsetTop;

        if (this.x < canvas.width / 2) {
            app.c = true;
            app.s = false;
            app.init()
        } else {
            app.s = true;
            app.c = false;
            app.init()
        }

    }
}
window.onload = () => start.init()