// import our three.js reference
const THREE = require('three')
const PP = require('postprocessing')

var Branch = {
    growDirection: new THREE.Vector3(),
    position: new THREE.Vector3(),
    growCount: 0
}

const grow_distance = 100 // d
const max_distance = 20 // di
const min_distance = 1 // dk

const app = {
    init() {
        this.done = false
        this.i = 0;
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(
            75, // FOV 
            window.innerWidth / window.innerHeight, // aspect ratio
            .1, // near plane
            1000 // far plane
        )

        this.camera.position.z = 30

        this.createRenderer()
        this.createLights()
        // make a call for post processing
        this.createEffects()


        const box = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshPhongMaterial({
            color: 0x06600
        })
        this.cube = new THREE.Mesh(box, material)

        this.trunkMat = new THREE.MeshPhongMaterial({
            color: 0x663300
        })

        this.leaves = []
        this.showLeaves = []
        this.trunk = []
        this.branch = []

        for (var i = 0; i < 100; i++) {
            this.leaves.push(new THREE.Mesh(box, material))
            this.leaves[i].position.set((Math.random() * 30) - 15, Math.random() * 15, (Math.random() * 30) - 15)
            this.scene.add(this.leaves[i])
        }

        this.showLeaves = this.leaves
        console.log(this.showLeaves.length)

        for (var i = 0; i < 20; i++) {
            this.trunk.push(new THREE.Mesh(box, this.trunkMat))
            this.trunk[i].position.set(0, -1 * i, 0)
            this.scene.add(this.trunk[i])
        }
        this.trunk.push(new THREE.Mesh(box, this.trunkMat))
        this.trunk[this.trunk.length - 1].position.set(0, 0, 0)
        this.scene.add(this.trunk[this.trunk.length - 1])

        // set up gui
        var gui = function () {
            this.text = "WASD for Camera"
            this.show_leaves = false
        }
        this.guiProp = new gui();
        var gui = new dat.GUI();
        gui.add(this.guiProp, 'text');
        gui.add(this.guiProp, 'show_leaves');

        //this.scene.add(this.cube)
        this.render()
    },

    findClosest() {

        if (this.leaves.length == 0) this.done = true
        var closestDir;
        var closestDist = Number.MAX_VALUE
        var closestBranch;
        var direction = new THREE.Vector3()

        var closestPos = new THREE.Vector3()
        for (var i = 0; i < this.leaves.length; i++) {
            var leafRemoved = false
            for (var j = 0; j < this.trunk.length; j++) {
                direction.subVectors(this.leaves[i].position, this.trunk[j].position)
                var distance = direction.length()

                // leaf is too close / has already been checked
                if (distance <= min_distance) {
                    this.scene.remove(this.leaves[i])
                    this.leaves.splice(i, 1)
                    leafRemoved = true
                    break;
                }
                // leaf is too far away 
                else if (distance <= max_distance) {
                    if (closestBranch == undefined) {
                        closestBranch = this.trunk[j]
                    }
                    var t = closestPos.subVectors(this.leaves[i].position, closestBranch.position).length();
                    if (t > distance) {
                        closestBranch = this.trunk[j]
                    }
                }
            }
        }

        if (!leafRemoved && closestBranch != undefined) {
            direction = direction.normalize()
            var newBranch = Branch
            newBranch.growDirection = newBranch.growDirection.add(direction)
            newBranch.growCount += 1;
            newBranch.position = closestBranch.position
            this.branch.push(newBranch)
            // var geometry = new THREE.Geometry();
            // geometry.vertices.push(closestBranch.position);
            // geometry.vertices.push(dir);
            // var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
            //     color: 0x0000ff
            // }));
            // this.scene.add(line);
        }
        this.growTree()
    },

    growTree() {
        for (var i = 0; i < this.branch.length; i++) {
            if (this.branch[i].growCount > 0) {
                var avgDir = this.branch[i].growDirection.divideScalar(this.branch[i].growCount)
                avgDir = avgDir.normalize()
                var newPos = this.branch[i].position.add(avgDir)
                var newGeo = new THREE.BoxGeometry(1, 1, 1)
                var newObj = new THREE.Mesh(newGeo, this.trunkMat)
                newObj.position.set(newPos.x, newPos.y, newPos.z)
                this.trunk.push(newObj)
                this.scene.add(newObj)
            }
            this.branch[i].growCount = 0;
        }
        this.branch.length = 0;
        this.i++
    },

    createEffects() {
        this.composer = new PP.EffectComposer(this.renderer)
        this.renderPass = new PP.RenderPass(this.scene, this.camera)
        this.renderPass.renderToScreen = true
        this.composer.addPass(this.renderPass)

        // this.glitchPass = new PP.GlitchPass()
        // this.glitchPass.renderToScreen = true
        // this.composer.addPass( this.glitchPass )
    },

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(this.renderer.domElement)
        this.render = this.render.bind(this)
    },

    createLights() {
        var ambientLight = new THREE.AmbientLight(0x000000);
        this.scene.add(ambientLight);

        var lights = [];
        lights[0] = new THREE.PointLight(0xffffff, 1, 0);
        lights[1] = new THREE.PointLight(0xffffff, 1, 0);
        lights[2] = new THREE.PointLight(0xffffff, 1, 0);

        lights[0].position.set(0, 200, 0);
        lights[1].position.set(100, 200, 100);
        lights[2].position.set(-100, -200, -100);

        this.scene.add(lights[0]);
        this.scene.add(lights[1]);
        this.scene.add(lights[2]);
    },

    render() {
        window.requestAnimationFrame(this.render)
        while (!this.done) {
            this.findClosest()
        }

        // if (this.show_leaves) {
        //     for (var i = 0; i < this.showLeaves.length; i++) {
        //         this.scene.add(this.showLeaves[i])
        //     }
        //     for (var i = 0; i < this.showLeaves.length; i++) {
        //         this.showLeaves[i].rotation.y += .005
        //         this.showLeaves[i].rotation.x += .005
        //     }
        //     console.log(this.showLeaves[0])
        // }


        // key press handler
        window.addEventListener("keydown", function (event) {
            if (event.keyCode == 87) {
                app.camera.position.z -= .005;
            } else if (event.keyCode == 83) {
                app.camera.position.z += .005;
            } else if (event.keyCode == 65) {
                app.camera.position.x -= .001;
            } else if (event.keyCode == 68) {
                app.camera.position.x += .001;
            }
        })
        this.composer.render(this.scene, this.camera)
    }
}

window.onload = () => app.init()