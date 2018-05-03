// import our three.js reference
const THREE = require('three')
const Orbit = require('three-orbit-controls')(THREE)
const PP = require('postprocessing')

// creating branch object with default values
var Branch = {
    growDirection: new THREE.Vector3(),
    position: new THREE.Vector3(),
    growCount: 0
}

// setting algorithm values
const grow_distance = 100 // d
const max_distance = 20 // di
const min_distance = 1 // dk

const app = {
    init() {
        this.done = false
        this.i = 19;
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(
            75, // FOV 
            window.innerWidth / window.innerHeight, // aspect ratio
            .1, // near plane
            10000 // far plane
        )

        this.camera.position.z = 30

        // set up scene with skybox and lights
        this.createRenderer()
        this.createLights()
        this.createEffects()
        this.createSkybox()

        // create general box object and material
        const box = new THREE.BoxGeometry(1, 1, 1)
        this.trunkMat = new THREE.MeshPhongMaterial({
            color: 0x663300
        })

        // create grass plane
        var geometry = new THREE.PlaneGeometry(100, 100);
        var material = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('images/grass.jpg')
        })
        var plane = new THREE.Mesh(geometry, material);
        plane.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI * 3 / 2)
        plane.position.y = -20
        this.scene.add(plane);

        // arrays holding all objects in scene
        this.leaves = [] // holds all the leaves and will continue until there are none left
        this.showLeaves = [] // copy array of the leaves so they can be displayed
        this.trunk = [] // holds the original trunk and resulting branches that will be added during animation
        this.branch = [] // holds branch objects that take calculation from leaves

        // populate leaves array
        for (var i = 0; i < 100; i++) {
            this.leaves.push(new THREE.Mesh(box, material))
            this.leaves[i].position.set((Math.random() * 30) - 15, Math.random() * 15, (Math.random() * 30) - 15)
            this.showLeaves.push(this.leaves[i])
            this.scene.add(this.leaves[i])
        }

        // populate tree array
        for (var i = 0; i < 20; i++) {
            this.trunk.push(new THREE.Mesh(box, this.trunkMat))
            this.trunk[i].position.set(0, -1 * i, 0)
            this.trunk[i].name = i;
            this.scene.add(this.trunk[i])
        }

        // shhhhhhhhhhhhhhhhhhhhhh
        var hack1 = new THREE.Mesh(box, this.trunkMat)
        hack1.position.set(0, 0, 0)
        this.scene.add(hack1)

        var hack2 = new THREE.Mesh(box, this.trunkMat)
        hack2.position.set(0, 1, 0)
        this.scene.add(hack2)

        // set up gui
        var gui = function () {
            this.camera = "move camera with the mouse!"
            this.show_leaves = true
        }
        this.guiProp = new gui()
        var gui = new dat.GUI()
        gui.add(this.guiProp, 'camera')
        gui.add(this.guiProp, 'show_leaves')

        // update the controls based on changed camera location
        this.control.update()

        // runs the method until all the leaves have been hit
        while (!this.done) {
            this.findClosest()
        }

        // create render call
        this.render()
    },

    // finds the closest leaf object and adds the resulting branch to the branch array
    findClosest() {

        // checks for any resulting leaves
        if (this.leaves.length == 0) this.done = true

        // values to compare against for closest branch and direction
        var closestBranch
        var direction = new THREE.Vector3()
        var closestPos = new THREE.Vector3()

        // running loop through both trunk and leaf arrays
        for (var i = 0; i < this.leaves.length; i++) {

            var leafRemoved = false     // checks to see if leaf has already been removed

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
                // if leaf is within max 
                else if (distance <= max_distance) {
                    if (closestBranch == undefined) {
                        closestBranch = this.trunk[j]
                    } else if (closestPos.subVectors(this.leaves[i].position, closestBranch.position).length() > distance) {
                        closestBranch = this.trunk[j]
                    }
                }
            }
        }

        // checks to see if there is a closest branch and will add that to the branch array
        if (!leafRemoved && closestBranch != undefined) {
            direction = direction.normalize()
            var newBranch = Branch
            newBranch.growDirection = newBranch.growDirection.add(direction)
            newBranch.growCount += 1
            newBranch.position = closestBranch.position
            this.branch.push(newBranch)
        }

        this.growTree()
    },

    // calculates the distance from the new branch to position of new object in scene
    growTree() {

        for (var i = 0; i < this.branch.length; i++) {

            // checks to see as long as the branch can grow
            if (this.branch[i].growCount > 0) {

                // normalize direction so it is always touching the closest branch
                var avgDir = this.branch[i].growDirection.divideScalar(this.branch[i].growCount)
                avgDir = avgDir.normalize()
                var newPos = this.branch[i].position.add(avgDir)

                // create new mesh and add it to the trunk array
                var newGeo = new THREE.BoxGeometry(1, 1, 1)
                var newObj = new THREE.Mesh(newGeo, this.trunkMat)
                newObj.position.set(newPos.x, newPos.y, newPos.z)
                this.trunk.push(newObj)
            }
        }

        // reset the branch array
        this.branch.length = 0;
    },

    createEffects() {
        this.composer = new PP.EffectComposer(this.renderer)
        this.renderPass = new PP.RenderPass(this.scene, this.camera)
        this.renderPass.renderToScreen = true
        this.composer.addPass(this.renderPass)
    },

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(this.renderer.domElement)

        // implemented controls
        this.control = new Orbit(this.camera);
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

    createSkybox() {
        var materialArray = [];
        materialArray.push(new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('images/xpos.png')
        }));
        materialArray.push(new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('images/xneg.png')
        }));
        materialArray.push(new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('images/ypos.png')
        }));
        materialArray.push(new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('images/yneg.png')
        }));
        materialArray.push(new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('images/zpos.png')
        }));
        materialArray.push(new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('images/zneg.png')
        }));
        for (var i = 0; i < 6; i++)
            materialArray[i].side = THREE.BackSide
        var skyboxMaterial = new THREE.MeshFaceMaterial(materialArray)
        var skyboxGeom = new THREE.CubeGeometry(5000, 5000, 5000, 1, 1, 1);
        var skybox = new THREE.Mesh(skyboxGeom, skyboxMaterial);
        this.scene.add(skybox);
    },

    render() {
        window.requestAnimationFrame(this.render)
        
        // animate the trunk
        if (this.i >= 19 && this.i < this.trunk.length) {
            this.scene.add(this.trunk[this.i])
            this.i++
        }

        // checks to show leaves or not
        if (this.guiProp.show_leaves) {
            for (var i = 0; i < this.showLeaves.length; i++) {
                this.scene.add(this.showLeaves[i])
                this.showLeaves[i].rotation.y += .005
                this.showLeaves[i].rotation.x += .005
            }

        } else {
            for (var i = 0; i < this.showLeaves.length; i++) {
                this.scene.remove(this.showLeaves[i])
            }
        }

        this.control.update();
        this.composer.render(this.scene, this.camera)
    }
}

window.onload = () => app.init()