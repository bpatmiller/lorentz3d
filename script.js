"use strict";

// gui data
var data = function() {
  this.a = 28;
  this.b = -6;
  this.c = 2.67;
  this.d = 0;
  data.x = 0.855;
  data.y = 0.072;
  data.z = 0.406;
  this.points = 50;
  this.attractor = attractors[0];
  this.respawn = false;
  this.trace = false;
}

var point = function() {
  this.x = Math.random()*40 - 20;
  this.y = Math.random()*40 - 20;
  this.z = Math.random()*40 - 20;

}

var center = { center:function(){
  centerF();
}}

var centerF = function() {
  var cx=0,cy=0,cz=0;
  for(let j=0;j<points;j++) {
    cx+=pointsArray[j].x;
    cy+=pointsArray[j].y;
    cz+=pointsArray[j].z;
  }
  mouseControl.target = new THREE.Vector3(cx/points,cy/points,cz/points);
  camera.lookAt(new THREE.Vector3(cx/points,cy/points,cz/points));
  //console.log(cx/points + ' ' + cy/points + ' ' + cz/points);
}

var attractors = ['lorentz','rossler','hadley'];

// load gui
var data = new data();
var gui = new dat.GUI();

var ctrlA = gui.add(data,'a',-20,50,0.01);
var ctrlB = gui.add(data,'b',-20,20,0.01);
var ctrlC = gui.add(data,'c',-10,10,0.01);
var ctrlD = gui.add(data,'d',-10,10,0.01);
var ctrlPoints = gui.add(data,'points',1,500,1);
var ctrlAttractor = gui.add(data,'attractor',attractors);
var ctrlCenter = gui.add(center,'center');
var ctrlRespawn = gui.add(data,'respawn');
var ctrlTrace = gui.add(data,'trace');
var ctrlAutoR;
var controls = [ctrlA,ctrlB,ctrlC,ctrlD,ctrlPoints];

ctrlD.domElement.style.visibility = 'hidden';

function updateDisplay() {
    for (let i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
    }
    for (let f in gui.__folders) {
        updateDisplay(gui__folders[f]);
    }
}

var changeHandler = function(clearGeom) {
  a = data.a;
  b = data.b;
  c = data.c;
  d = data.d;
  points=data.points

  while(scene.children.length > 0){ 
    scene.remove(scene.children[0]); 
  }

  updateDisplay();
  genPoints();
  initGeometry();
}

ctrlTrace.onChange(function() {
  if(data.trace) {
    length = 2000;
  } else {
    length = 20;
  }
  changeHandler();
})

ctrlAttractor.onChange(function() {
  switch(data.attractor) {
    case attractors[0]:
      data.a = 28;
      data.b = -6;
      data.c = 2.67;
      ctrlA.domElement.style.visibility = 'visible';
      ctrlB.domElement.style.visibility = 'visible';
      ctrlC.domElement.style.visibility = 'visible';
      ctrlD.domElement.style.visibility = 'hidden';
      data.trace = false;
      length = 20;
      colorSpeed=20;
      colorShift=0;
      mouseControl.target = new THREE.Vector3(0,2,20);
      camera.lookAt(new THREE.Vector3(0,2,20));
      break;
    case attractors[1]:
      data.a = 0.2;
      data.b = 0.2;
      data.c = 5.7;
      ctrlA.domElement.style.visibility = 'visible';
      ctrlB.domElement.style.visibility = 'visible';
      ctrlC.domElement.style.visibility = 'visible';
      ctrlD.domElement.style.visibility = 'hidden';
      data.trace = false;
      length = 20;
      colorSpeed=20;
      colorShift=0;
      mouseControl.target = new THREE.Vector3(0,0,0);
      camera.lookAt(new THREE.Vector3(0,0,0));
      break;
    case attractors[2]:
      data.a = 0.2;
      data.b = 4;
      data.c = 8;
      data.d = 1;
      ctrlA.domElement.style.visibility = 'visible';
      ctrlB.domElement.style.visibility = 'visible';
      ctrlC.domElement.style.visibility = 'visible';
      ctrlD.domElement.style.visibility = 'visible';
      data.trace = true;
      length = 2000;
      colorSpeed=2;
      colorShift=.85;
      mouseControl.target = new THREE.Vector3(.9,.5,.5);
      camera.lookAt(new THREE.Vector3(.9,.5,.5));
      break;
    default:
      console.log("default");
  }
  changeHandler();
})

for (var i = 0; i < controls.length; i++) {
  controls[i].onChange(function() {
    changeHandler();
  });
}

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

//define vars
var dt=.01,
a=data.a,b=data.b,c=data.c,d=data.d,
x0,y0,z0,x1,y1,z1,
pointsArray,points=data.points,
step=2,length=20,wait=0,colorSpeed=20,colorShift=0,
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

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  
  initGeometry();

  mouseControl = new THREE.OrbitControls( camera, renderer.domElement );
  mouseControl.target = new THREE.Vector3(0,2,20);
  mouseControl.autoRotate = false;
  mouseControl.autoRotateSpeed = 1.0;
  ctrlAutoR = gui.add(mouseControl,'autoRotate');
} 

var genPoints = function() {
  pointsArray = [];
  for(let i=0;i<data.points;i++) {
    pointsArray.push(new point());
  }
}

var update = function(k) {
  // import vals from the kth point
  x0 = pointsArray[k].x;
  y0 = pointsArray[k].y;
  z0 = pointsArray[k].z;

  // remove divergent points
  if( isNaN(x0) || isNaN(y0) || isNaN(z0) || Math.abs(x0)>100 || Math.abs(y0)>100 || Math.abs(z0)>100 ) {
    if(data.respawn) {
      pointsArray[k] = new point();
    } else {
      pointsArray.splice(k,1);
      scene.remove(lineArray[k]);
      lineArray.splice(k,1);
      points--;
    }
    return;
  }  

  for(let j=0;j<step;j++) {
    switch(data.attractor) {
      case attractors[0]:
      x1 = x0 + dt*b*(x0-y0);
      y1 = y0 + dt*((-x0*z0+b)+(a*x0)-y0);
      z1 = z0 + dt*((x0*y0)-c*z0);
      break;
      case attractors[1]:
      x1 = x0 + dt*(-y0-z0);
      y1 = y0 + dt*(x0+a*y0);
      z1 = z0 + dt*(b+z0*(x0-c));
      break;
      case attractors[2]:
      x1 = x0 + dt*(a*c - (Math.pow(y0,2) + Math.pow(z0,2) + a*x0));
      y1 = y0 + dt*( x0*y0 + d - (b*x0*z0 + y0));
      z1 = z0 + dt*( b*x0*y0 + x0*z0 - z0 );
      break;
    }
    x0 = x1;
    y0 = y1;
    z0 = z1;

    lineArray[k].geometry.vertices.shift();
    lineArray[k].geometry.vertices[length-1] = new THREE.Vector3(x0,y0,z0);
  }

  lineArray[k].geometry.verticesNeedUpdate=true;
  var diff = Math.abs(x0-pointsArray[k].x)+Math.abs(y0-pointsArray[k].y)+Math.abs(z0-pointsArray[k].z);
  lineArray[k].material.color.setHSL(colorShift+diff/colorSpeed,.5,.5);

  // import vals from the kth point
  pointsArray[k].x = x0;
  pointsArray[k].y = y0;
  pointsArray[k].z = z0;
}

var render = function() {
  renderer.render( scene, camera );
}

var animate = function() {
  anim = requestAnimationFrame(animate);
  for(let k=0;k<points;k++) {
    update(k);
  }
  // delete the trailing tip  
  while(scene.children.length > length*data.points){ 
      scene.remove(scene.children[0]); 
  }

  if(mouseControl.autoRotate) mouseControl.update();
  // then render
  render();
}

genPoints();
init();
anim = requestAnimationFrame(animate);