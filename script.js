"use strict";

// gui data
var data = function() {
  this.x = 0;
  this.y = 2;
  this.z = 10;
  this.c = 28;
  this.t = -6;
  this.scale = 16;
}

// load gui
var data = new data();
var gui = new dat.GUI();
var ctrlX = gui.add(data,'x',-20,20).listen();
var ctrlY = gui.add(data,'y',-20,20);
var ctrlZ = gui.add(data,'z',-20,20);
var ctrlC = gui.add(data,'c',-20,50);
var ctrlT = gui.add(data,'t',-20,20);
var ctrlScale = gui.add(data,'scale',1,50);

var controls = [ctrlX,ctrlY,ctrlZ,ctrlC,ctrlT,
                ctrlScale];

for (var i = 0; i < controls.length; i++) {
  controls[i].onChange(function() {
    x0 = data.x;
    y0 = data.y;
    z0 = data.z
    c = data.c;
    t = data.t;
    scale = data.scale;
    i = 0;
    while(scene.children.length > 0){ 
      scene.remove(scene.children[0]); 
    }
    cancelAnimationFrame(anim);
    animate();
  });
}

//define vars
var dt = .015,
c = 28,t = -6,b=2.67,
x0 = 0,y0 = 0,z0 = 0,
scale = 14,
x1, y1, z1,
n = 10000,i = 0,
step=10,
anim;

var cx = window.innerwidth/2,
cy = window.innerheight/2;

var camera,scene,renderer,material,geometry;

var init = function() {
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  camera.position.set(0, 0, 0);
  camera.lookAt(new THREE.Vector3(0, 0, 40));

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  geometry = new THREE.Geometry();
}

var render = function() {
  renderer.render( scene, camera );
}

var updateCamera = function() {
  camera.position.set(100*Math.cos(i/1200),0,100*Math.sin(i/1200));
  camera.lookAt(new THREE.Vector3(0,0,0));
}

var update = function() {
  if(i<n) {
    for(let j=0;j<step;j++) {

      x1 = x0 + dt*t*(x0-y0);
      y1 = y0 + dt*((-x0*z0+t)+(c*x0)-y0);
      z1 = z0 + dt*((x0*y0)-z0);
      
      geometry.vertices.push(new THREE.Vector3(x0,y0,z0));

      x0 = x1;
      y0 = y1;
      z0 = z1;

      geometry.vertices.push(new THREE.Vector3(x0,y0,z0));

      i++;
    }

  var line = new THREE.Line(geometry,material);
  scene.add(line);
  
  geometry = new THREE.Geometry();

  } else {
    cancelAnimationFrame(anim);
    //console.log("cancel");
  }
}

var animate = function() {
  anim = requestAnimationFrame(animate);
  update();
  updateCamera();
  render();
}

init();
anim = requestAnimationFrame(animate);