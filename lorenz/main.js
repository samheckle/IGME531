window.app = {
  init() {
    // pretty simple...
    this.scene = new THREE.Scene()

    // camera is a bit more involved...
    this.camera = new THREE.PerspectiveCamera(
      75, // FOV 
      window.innerWidth / window.innerHeight, // aspect ratio
      .1, // near plane
      1000 // far plane
    )

    // move camera back
    this.camera.position.z = 70

    this.createRenderer()
    this.createLights()

    // const box = new THREE.BoxGeometry(1, 1, 1)
    // const material = new THREE.MeshPhongMaterial({
    //   color: 0xffffff
    // })
    // this.cube = new THREE.Mesh(box, material)

    // this.scene.add(this.cube)

    // const geo = new THREE.SphereGeometry(1, 5, 5)
    // const mat = new THREE.MeshBasicMaterial({
    //   color: 0xffffff
    // })
    // this.sphere = new THREE.Mesh(geo, mat)

    // this.scene.add(this.sphere)

    // const geo = new THREE.Geometry()
    // geo.vertices.push( new THREE.Vector3(-10,0,0), new THREE.Vector3(0,10,0), new THREE.Vector3(10,0,0))
    // const mat = new THREE.LineBasicMaterial({
    //   color: 0xffffff
    // })
    // this.line = new THREE.Line(geo, mat)

    // this.scene.add(this.line)

    this.createLorenz()
    
    this.render()

  },

  createLorenz(){

    let geo = new THREE.Geometry();

    let x0, y0, z0, x1, y1, z1;
    let h = .01
    let a = 10.0
    let b = 28.0
    let c = 8.0 / 3.0

    x0 = .1
    y0 = 0
    z0 = 0
    for (let i = 0; i < 10000; i++) {
      x1 = x0 + h * a * (y0 - x0)
      y1 = y0 + h * (x0 * (b - z0) - y0)
      z1 = z0 + h * (x0 * y0 - c * z0)
      if (i > 100) {
        geo.vertices.push(new THREE.Vector3(x0,y0,z0))
      }
      x0 = x1
      y0 = y1
      z0 = z1
    }

    const mat = new THREE.LineBasicMaterial({
      color: 0xffff00
    })

    this.line = new THREE.Line(geo, mat);

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
    //this.ambient = new THREE.AmbientLight( 0x404040, .15 )
    //this.scene.add( this.ambient )

    this.pointLight = new THREE.PointLight(0x990000)
    this.pointLight.position.z = 50
    this.scene.add(this.pointLight)
  },

  render() {
    window.requestAnimationFrame(this.render)

    //this.createLorenz();

    //this.sphere.rotation.y += .005
    //this.sphere.rotation.x += .005

    this.renderer.render(this.scene, this.camera)
  }
}

window.onload = () => window.app.init()