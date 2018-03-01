window.app = {
    init() {
      // pretty simple...
      this.scene = new THREE.Scene()
  
      // camera is a bit more involved...
      this.camera = new THREE.PerspectiveCamera(
        75,  // FOV 
        window.innerWidth / window.innerHeight, // aspect ratio
        .1,  // near plane
        1000 // far plane
      )
      
      // move camera back
      this.camera.position.z = 2
      
        this.createRenderer()
      this.createLights()
      
      const box = new THREE.BoxGeometry( 1,1,1 )
      const material = new THREE.MeshPhongMaterial({ color:0xffffff })
      this.cube = new THREE.Mesh( box, material )
  
      this.scene.add( this.cube )
      this.render()
      
    },
    
    createRenderer() {
      this.renderer = new THREE.WebGLRenderer()
      this.renderer.setSize( window.innerWidth, window.innerHeight )
  
      // take the THREE.js canvas element and append it to our page
        document.body.appendChild( this.renderer.domElement )
      
      this.render = this.render.bind( this )
      },
    
    createLights() {
      //this.ambient = new THREE.AmbientLight( 0x404040, .15 )
      //this.scene.add( this.ambient )
      
      this.pointLight = new THREE.PointLight( 0x990000 )
      this.pointLight.position.z = 50
      this.scene.add( this.pointLight )
    },
    
    render() {
      window.requestAnimationFrame( this.render )
      
      this.cube.rotation.y += .005
      this.cube.rotation.x += .005    
  
      this.renderer.render( this.scene, this.camera )  
    }
  }
  
  window.onload = ()=> window.app.init()