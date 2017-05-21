"use strict";

// gui data
var data = function() {
  this.c = 28;
  this.t = -6;
  this.b = 2.67;
  this.points = 50;
}

var point = function() {
  this.x = Math.random()*40 - 20;
  this.y = Math.random()*40 - 20;
  this.z = Math.random()*40 - 20;
}

// load gui
var data = new data();
var gui = new dat.GUI();

var ctrlC = gui.add(data,'c',-20,50);
var ctrlT = gui.add(data,'t',-20,20);
var ctrlB = gui.add(data,'b',-10,10);
var ctrlPoints = gui.add(data,'points',1,500,1);

var controls = [ctrlC,ctrlT,ctrlB,ctrlPoints];

for (var i = 0; i < controls.length; i++) {
  controls[i].onChange(function() {
    c = data.c;
    t = data.t;
    b = data.b;
    points = data.points;

    while(scene.children.length > 0){ 
      scene.remove(scene.children[0]); 
    }

    genPoints();
    initGeometry();
  });
}

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

//define vars
var dt = .015,
c = data.c,t = data.t,b=data.b,
scale = 14,
x0,y0,z0,x1, y1, z1,
pointsArray, points=data.points, i=0,
step=2,length=20,
anim;

var camera,scene,renderer,mouseControl,line,lineArray;

var initGeometry = function() {
  // create an array of lines each with its own initialized geometry
  lineArray = [];
  for(let i=0;i<data.points;i++) {
    let geometry = new THREE.Geometry();
    let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    for(let j=0;j<length;j++) {
      geometry.vertices.push(new THREE.Vector3(pointsArray[i].x,pointsArray[i].y,pointsArray[i].z));
    }
    lineArray.push(new THREE.Line(geometry,material));
    lineArray[i].geometry.dynamic = 'true';
    scene.add(lineArray[i]);
  }
}

var init = function() {
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  camera.position.set(0, 0, 80);
  camera.lookAt(0,2,20);

  scene = new THREE.Scene();
  //scene.fog = new THREE.Fog( 0x333333, 50,1000 );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  
  initGeometry();

  mouseControl = new THREE.OrbitControls( camera, renderer.domElement );
  mouseControl.addEventListener( 'change', render );
  mouseControl.target = new THREE.Vector3(0,2,20);
  mouseControl.enableZoom = true;
}

var genPoints = function() {
  pointsArray = [];
  for(let i=0;i<data.points;i++) {
    pointsArray.push(new point());
  }
}

var render = function() {
  renderer.render( scene, camera );
}

var update = function(k) {
  // import vals from the kth point
  x0 = pointsArray[k].x;
  y0 = pointsArray[k].y;
  z0 = pointsArray[k].z;

  // remove divergent points
  if( isNaN(x0) || isNaN(y0) || isNaN(z0) ) {
    // pls re-impliment this to work for lineArray
    pointsArray.splice(k,1);
    scene.remove(lineArray[k]);
    lineArray.splice(k,1);
    points--;
    return;
  }  

  // make a few new ones
  for(let j=0;j<step;j++) {

    x1 = x0 + dt*t*(x0-y0);
    y1 = y0 + dt*((-x0*z0+t)+(c*x0)-y0);
    z1 = z0 + dt*((x0*y0)-b*z0);

    x0 = x1;
    y0 = y1;
    z0 = z1;

    lineArray[k].geometry.vertices.shift();
    lineArray[k].geometry.vertices[length-1] = new THREE.Vector3(x0,y0,z0);
  }

  lineArray[k].geometry.verticesNeedUpdate=true;
  var diff = Math.abs(x0-pointsArray[k].x)+Math.abs(y0-pointsArray[k].y)+Math.abs(z0-pointsArray[k].z);
  lineArray[k].material.color.setHSL(diff/20,.5,.5);
    i++
  // delete the trailing tip  
  while(scene.children.length > 10*data.points){ 
      scene.remove(scene.children[0]); 
  }

  // import vals from the kth point
  pointsArray[k].x = x0;
  pointsArray[k].y = y0;
  pointsArray[k].z = z0;
}

var animate = function() {
  anim = requestAnimationFrame(animate);
  for(let k=0;k<points;k++) {
    update(k);
  }
  if(i>10000) i=length;
  render();
}

genPoints();
init();
anim = requestAnimationFrame(animate);