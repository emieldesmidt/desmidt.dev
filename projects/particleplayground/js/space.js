var maxParticles = 600,
    emissionRate = 0,
    SPREAD_VALUE = 0.01,
    Gconst = 1;


init();
animate();

function init() {

    // Scene, Renderer, Camera, Control setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x1a1a1a );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    controls = new THREE.OrbitControls(camera, renderer.domElement);


    // Settings for the materials 
    // Emitter
    emGeometry = new THREE.SphereGeometry(0.3, 20, 20, 0, Math.PI * 2, 0, Math.PI * 2);
    emMaterial = new THREE.MeshBasicMaterial({color: 0x333333})

    // Fields
    fGeometry = new THREE.SphereGeometry(0.9, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
    fMaterial = new THREE.MeshNormalMaterial();




    // Grid
    var helper = new THREE.GridHelper(100, 25, 0x808080, 0x808080);
    helper.position.y = -25;
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    scene.add(helper);
    THREE.fGeometry
    
    // Instantiate particles, emitter, field.
    particles = [];     //TODO preset size to maxParticles
    emitters = [new Emitter(new THREE.Vector3(12, 12, 12), new THREE.Vector3(-0.1, 0, 0.01))];
    fields = [new Field(new THREE.Vector3(), 1000)];
     
    // Draw the UI
    drawUI();
}


// PARTICLE

// The particle framework, all the particles will contain data about it's position, velocity, and acceleration.
function Particle(point, velocity) {

    // Constructor
    this.position = point || new THREE.Vector3();
    this.velocity = velocity || new THREE.Vector3();
    this.acceleration = new THREE.Vector3();

    // The mesh
    partGeometry = new THREE.SphereGeometry(0.06, 3, 3, 0, Math.PI * 2, 0, Math.PI * 2);
    partMaterial =new THREE.MeshBasicMaterial()
    
    this.mesh = new THREE.Mesh(partGeometry, partMaterial);
    scene.add(this.mesh);

    // The move function
    this.move = function () {

        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);

        this.mesh.position.set(
            this.position.getComponent(0), 
            this.position.getComponent(1), 
            this.position.getComponent(2));

        this.mesh.material.color.setRGB( 1 - (this.velocity.length() * 2), this.velocity.length() * 2, 0)
          // Math.abs(this.velocity.length()) / 0.8,
           //Math.abs(this.velocity.length()) / 0.8)

    };

    // let gravity act upon the particle
    this.submitToFields = function (fields) {

        // Initial acceleration of 0
        this.acceleration = new THREE.Vector3();

        // iterate over the fields and apply physics
        for (f in fields) {
            var fPos = fields[f].position.clone();
            var force = Gconst * fields[f].mass / (fPos.distanceToSquared(this.position));
            var dA = fPos.sub(this.position).multiplyScalar(force);

            this.acceleration.add(dA);
        }

        // update our particle's acceleration
        this.acceleration.divideScalar(100000);
    };

}


// FIELDS

// The framework of the field.
function Field(point, mass) {

    // Object constructor
    this.position = point;
    this.mass = mass;


    // The Mesh
    this.mesh = new THREE.Mesh(fGeometry, fMaterial);

    this.positionField = function () {
        this.mesh.position.set(this.position.getComponent(0), this.position.getComponent(1), this.position.getComponent(2));
    }
    this.positionField();

    scene.add(this.mesh);

}





// EMITTER

function Emitter(point, speed) {

    // The constructor
    this.position = point;
    this.velocity = speed;

    // The Mesh
    this.mesh = new THREE.Mesh(emGeometry, emMaterial);

    this.positionEmitter = function () {
        this.mesh.position.set(this.position.getComponent(0), this.position.getComponent(1), this.position.getComponent(2));
    }
    this.positionEmitter();

    scene.add(this.mesh);


    // Emit particles
    this.emit = function () {

        var spread = this.velocity.clone();
        spread.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / Math.random() * SPREAD_VALUE)
        spread.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / Math.random() * SPREAD_VALUE)
        spread.applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / Math.random() * SPREAD_VALUE)

        return new Particle(this.position.clone(), spread);
    }

}





// If possible, emit particles
function addNewParticles() {

    // for each emitter
    for (em in emitters) {
        for (var j = 0; j < emissionRate; j++) {
            particles.push(emitters[em].emit());
        }
    }

}



// Update velocities and accelerations to account for the fields
function updateParticleSystem() {
    for (p in particles) {
        particles[p].submitToFields(fields);
        particles[p].move();
    }
}


// GUI 
function drawUI() {

    document.body.style.overflow = 'hidden';

    //draw a graphical user interface using the dat.gui library
    var gui = new dat.GUI();

    //set up the Particles folder, and the options with their values and names
    var f1 = gui.addFolder('Particles');
    f1.add(window, 'maxParticles').min(0).max(2000).step(2).name('Maximum Amount');

    //set up the Fields folder, and the options with their values and names
    var f2 = gui.addFolder('Field')
    f2.add(window, 'Gconst').min(-10).max(10).step(.05).name('Force');

    //set up the Emitter folder, and the options with their values and names
    var f3 = gui.addFolder('Emitter');
    f3.add(window, 'emissionRate').min(0).max(50).step(1).name('Emission Rate');
    f3.add(window, 'SPREAD_VALUE').min(0).max(1).step(0.01).name('Spread Angle')

    var obj = { burst:function(){ emissionRate = 10 }};

    gui.add(obj,'burst');
    
    //sets up the statistic box in the left top of the canvas.
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    stats.setMode(0);
    document.body.appendChild(stats.domElement);

}


// Core calculation encapsulation
function update() {
    if (particles.length < maxParticles) {
        addNewParticles();
    }
    updateParticleSystem();
    stats.update();
}


// Animation
function animate() {
    update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

