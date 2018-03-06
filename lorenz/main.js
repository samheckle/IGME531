window.app = {
  init() {
    // pretty simple...
    this.scene = new THREE.Scene()

    // camera is a bit more involved...
    this.camera = new THREE.PerspectiveCamera(
      75, // FOV 
      window.innerWidth / window.innerHeight, // aspect ratio
      .1, // near plane
      10000 // far plane
    )

    // move camera back
    this.camera.position.z = 70

    this.createRenderer()
    this.createLights()


    // let x0, y0, z0, x1, y1, z1;
    this.i = 0;
    this.h = .01
    this.a = 10.0
    this.b = 28.0
    this.c = 8.0 / 3.0
    this.x0 = .1
    this.y0 = 0
    this.z0 = 0
    var lorenzGui = function () {
      this.text = "WASD for Camera"
      this.preset1 = function () {
        for (var i = app.scene.children.length - 1; i >= 0; i--) {
          app.scene.remove(app.scene.children[i])
        }
        app.i = 0
        app.h = .008
        app.x0 = .001
        app.y0 = .001
        app.z0 = .001
      }

      this.preset2 = function () {
        for (var i = app.scene.children.length - 1; i >= 0; i--) {
          app.scene.remove(app.scene.children[i])
        }
        app.i =0
        app.h = .01
        app.x0 = .1
        app.y0 = 0
        app.z0 = 0
      }

      this.foggy = function () {
        app.scene.fog = new THREE.Fog(0x000000, 0.015, 70);
      }

      this.reset = function () {
        location.reload();
      }
    };

    this.guiProp = new lorenzGui();
    var gui = new dat.GUI();
    gui.add(this.guiProp, 'text');
    gui.add(this.guiProp, 'preset1');
    gui.add(this.guiProp, 'preset2');
    gui.add(this.guiProp, 'foggy');
    gui.add(this.guiProp, 'reset');

    this.render()

  },

  createLorenz() {

    let geo = new THREE.Geometry();

    this.x1 = this.x0 + this.h * this.a * (this.y0 - this.x0)
    this.y1 = this.y0 + this.h * (this.x0 * (this.b - this.z0) - this.y0)
    this.z1 = this.z0 + this.h * (this.x0 * this.y0 - this.c * this.z0)
    if (this.i > 100) {
      geo.vertices.push(new THREE.Vector3(this.x0, this.y0, this.z0))
      geo.vertices.push(new THREE.Vector3(this.x1, this.y1, this.z1))
    }
    this.i++;
    this.mat = new THREE.LineBasicMaterial({
      color: 0xff00ff
    })
    this.col = new THREE.Color(Math.abs(this.y1) / 10.0, .5, Math.abs(this.x1) / 10.0);
    this.mat.color = this.col;
    this.x0 = this.x1;
    this.y0 = this.y1;
    this.z0 = this.z1;

    this.line = new THREE.Line(geo, this.mat);

    this.scene.add(this.line)
  },

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    // take the THREE.js canvas element and append it to our page
    document.body.appendChild(this.renderer.domElement)

    this.render = this.render.bind(this)
  },

  createLights() {
    // this.ambient = new THREE.AmbientLight(0x404040, .15)
    // this.scene.add(this.ambient)

    this.pointLight = new THREE.PointLight(0xffffff)
    this.pointLight.position.z = 50
    this.scene.add(this.pointLight)


  },

  render() {
    window.requestAnimationFrame(this.render)

    this.createLorenz();

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


    //this.sphere.rotation.y += .005
    //this.sphere.rotation.x += .005

    this.renderer.render(this.scene, this.camera)
  }
}

window.onload = () => window.app.init()