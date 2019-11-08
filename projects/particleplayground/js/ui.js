// GUI 
function drawUI() {
    //draw a graphical user interface using the dat.gui library
    var gui = new dat.GUI();

    //set up the Particles folder, and the options with their values and names
    var f1 = gui.addFolder('Particles');
    f1.add(window, 'maxParticles').min(0).max(500).step(2).name('Maximum Amount');

    //set up the Fields folder, and the options with their values and names
    var f2 = gui.addFolder('Field')
    f2.add(window, 'Gconst').min(-10).max(10).step(.05).name('Force');

    //set up the Emitter folder, and the options with their values and names
    var f3 = gui.addFolder('Emitter');
    f3.add(window, 'emissionRate').min(0).max(50).step(1).name('Emission Rate');
    f3.add(window, 'SPREAD_VALUE').min(0).max(1).step(0.01).name('Spread Angle')



    //sets up the statistic box in the left top of the canvas.
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    stats.setMode(0);
    document.body.appendChild(stats.domElement);

}
