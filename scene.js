import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import gsap from "gsap";

import map_img from "./images/map.png";

const container = document.getElementById('canvas-container')


const renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('#121212');
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 0;
camera.position.y = 0;   
camera.position.z = 100;
camera.lookAt(0,0,0)

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

var vFOV = THREE.MathUtils.degToRad( camera.fov ); // convert vertical fov to radians
var height = 2 * Math.tan( vFOV / 2 ) * 100; // visible height
var width = height * camera.aspect;           // visible width
// var width = window.innerWidth, height = window.innerHeight;
// var grid = new THREE.GridHelper( 20, 20, 0x888888, 0x888888 );
//             grid.position.set( 0, - 1.1, 0 );
//             scene.add( grid );

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(map_img);
texture.colorSpace = THREE.SRGBColorSpace;
// scene.background = texture
const material = new THREE.MeshBasicMaterial( { map: texture, transparent:true, side: THREE.FrontSide } );
material.map.minFilter = THREE.LinearFilter;
const geometry = new THREE.PlaneGeometry(width, height, 32, 32);
const plane = new THREE.Mesh(geometry, material);
plane.scale.setScalar(1.1);
plane.position.set(0, 0, 1);
plane.userData.name = "map";
global.plane = plane;
scene.add(plane)

const orbitControls = new OrbitControls(camera, renderer.domElement);
// orbitControls.minPolarAngle = Math.PI * 0.05;
// orbitControls.maxPolarAngle = Math.PI * 0.95;
// orbitControls.rotateSpeed = -0.25;
// orbitControls.dampingFactor = 0.1;
orbitControls.enableRotate = false;
orbitControls.enableZoom = false;
// orbitControls.enableDamping = true;
orbitControls.enablePan = false;
// orbitControls.screenSpacePanning = true;
orbitControls.minDistance = 10;
orbitControls.maxDistance = 1000;

document.body.style.cursor = 'grab';

window.addEventListener('resize', onResize, false);
window.addEventListener('mousemove', onMouseMove, false);
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

function onMouseMove(event) {
    // mouseY = ( event.clientY - windowHalfX ) / 5;
    // mouseX = ( event.clientX - windowHalfY ) / 5;
    plane.position.y = (event.clientX - windowHalfX) / windowHalfX * 0.2;
    plane.position.x = (event.clientY - windowHalfY) / windowHalfY * 0.2;
}
function onResize() {
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    window.requestAnimationFrame(animate);
    render();
};
animate();
function render() {
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
}












    
      
      
      



