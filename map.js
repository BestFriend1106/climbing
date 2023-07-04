import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import gsap from "gsap";
import map_img from "./images/map.png";
import tips_img from "./images/tips.png";
import video_file from "./images/loading.ogg"
import gif_file from "./images/loading.gif"

const container = document.getElementById('canvas-container')


const renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );

// const video = document.createElement('video');
// var source = document.createElement('source');
// source.src = video_file;
// source.type = 'video/ogg';
// video.preload = 'load';
// video.autoplay = true;
// video.controls = false;
// video.crossOrigin = 'anonymous';
// // video.loop = true;
// video.muted = true;
// video.play();

// video.appendChild(source)
// container.appendChild(video);
// video.addEventListener('ended', onLoad)


container.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.physicallyCorrectLights = true; // this option is to load light embed on glb file.
// renderer.autoClearDepth = false
renderer.setClearColor('#121212')
// renderer.toneMapping = THREE.ACESFilmicToneMapping; 
// renderer.toneMappingExposure = 1;

const scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 0;
camera.position.y = 0;   
camera.position.z = 1000;
camera.lookAt(0,0,0)

// to select interested object in scene
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

var vFOV = THREE.MathUtils.degToRad( camera.fov ); // convert vertical fov to radians
var height = 2 * Math.tan( vFOV / 2 ) * 1000; // visible height
var width = height * camera.aspect;           // visible width
// var width = window.innerWidth, height = window.innerHeight;

const gif = document.createElement('img')
gif.src = gif_file;
gif.style.width = '250px';
gif.style.height = '250px';
container.appendChild(gif)
setTimeout(onLoad, 3000)

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(map_img);
texture.colorSpace = THREE.SRGBColorSpace;
// scene.background = texture
// texture.encoding = THREE.sRGBEncoding; // this option is to render image's origine color 
const material = new THREE.MeshBasicMaterial( { map: texture, transparent:true, side: THREE.FrontSide } );
material.map.minFilter = THREE.LinearFilter;
const geometry = new THREE.PlaneGeometry(width, height, 32, 32);
const plane = new THREE.Mesh(geometry, material);
plane.scale.setScalar(1.1);
plane.position.set(0, 0, 1);
plane.userData.name = "map";
global.plane = plane;
scene.add(plane)

//tips
const tips_t = new THREE.TextureLoader().load(tips_img);
tips_t.encoding = THREE.sRGBEncoding;
const tips_m = new THREE.MeshBasicMaterial( { map: tips_t, transparent:true, side: THREE.DoubleSide } );
const tips_g = new THREE.PlaneGeometry(5, 5);

const tips =  new THREE.Mesh(tips_g, tips_m);
const tips1 =  new THREE.Mesh(tips_g, tips_m);
const tips2 =  new THREE.Mesh(tips_g, tips_m);
const tips3 =  new THREE.Mesh(tips_g, tips_m);
const tips4 =  new THREE.Mesh(tips_g, tips_m);
const tips5 =  new THREE.Mesh(tips_g, tips_m);
tips.position.x = 4;
tips.position.y = -4;
tips1.position.x = 22;
tips1.position.y = 9;
tips2.position.x = 1;
tips2.position.y = 22;
tips3.position.x = -5;
tips3.position.y = 8;
tips4.position.x = -40;
tips4.position.y = 19;
tips5.position.x = 33;
tips5.position.y = 23;
tips.position.z = tips1.position.z = tips2.position.z = tips3.position.z = tips4.position.z = tips5.position.z = 5;

const orbitControls = new OrbitControls(camera, renderer.domElement);

// orbitControls.minPolarAngle = Math.PI * 0.05;
// orbitControls.maxPolarAngle = Math.PI * 0.95;
// orbitControls.rotateSpeed = -0.25;
// orbitControls.dampingFactor = 0.1;
orbitControls.enableRotate = false;
orbitControls.enableZoom = true;
orbitControls.enableDamping = true;
orbitControls.screenSpacePanning = true;
// orbitControls.minDistance = 0;
orbitControls.maxDistance = 100;

document.body.style.cursor = 'grab'
window.addEventListener('mousemove', onPointerMove, false);
window.addEventListener( 'mousedown', onPointerDown, false);
window.addEventListener('resize', onResize, false);

function onLoad() {
    // video.remove();
    gif.remove();
    gsap.from(camera.position, {
        x: 0,
        y: 0,
        z: 30,
        duration: 2
    });
    scene.add(tips, tips1, tips2, tips3, tips4, tips5)
}

let clickCounter = 1;

function onPointerDown( event ) {
    pointerClicked()
}
function pointerClicked() {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    // if(event.button === 0 ) { //left button is clicked
    //     orbitControls.enablePan = true;
    // }
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    let clickedMesh = intersects[0].object;
    let clickedPosition = intersects[0].point;
    let cameraDirection = new THREE.Vector3(1, 0, 0)
        .applyQuaternion(camera.quaternion)
        .normalize()
        .multiplyScalar(0.00001);
    
    if( intersects.length == 2 ) {
        console.log(intersects[0].object)
    }
    if(clickedMesh.userData.name = 'map') {
        if(clickCounter %2 == 1 ){ 
            if(-66 < clickedPosition.x && clickedPosition.x < -34 && 2 < clickedPosition.y && clickedPosition.y < 16){
                gsap.to(camera.position, {
                    x: -45,
                    y: 9,
                    z: 600,
                    duration: 2,
                    onStart: () => {
                        orbitControls.enabled = false;
                    },
                    onUpdate: () => {
                    let target = camera.position.clone().add(cameraDirection);
                        orbitControls.target = target;
                    },
                    onComplete: () => {
                        orbitControls.enabled = true;
                    },
                });
            }
            else if(-12 < clickedPosition.x && clickedPosition.x < 16 && 7 < clickedPosition.y && clickedPosition.y < 16){
                gsap.to(camera.position, {
                    x: 2,
                    y: 10,
                    z: 600,
                    duration: 2,
                    onStart: () => {
                        orbitControls.enabled = false;
                    },
                    onUpdate: () => {
                    let target = camera.position.clone().add(cameraDirection);
                        orbitControls.target = target;
                    },
                    onComplete: () => {
                        orbitControls.enabled = true;
                    },
                });
            }
            else if(28 < clickedPosition.x && clickedPosition.x < 57 && 5 < clickedPosition.y && clickedPosition.y < 20){
                gsap.to(camera.position, {
                    x: 43,
                    y: 12,
                    z: 600,
                    duration: 2,
                    onStart: () => {
                        orbitControls.enabled = false;
                    },
                    onUpdate: () => {
                    let target = camera.position.clone().add(cameraDirection);
                        orbitControls.target = target;
                    },
                    onComplete: () => {
                        orbitControls.enabled = true;
                    },
                });
            }
            else if(17 < clickedPosition.x && clickedPosition.x < 34 && -12 < clickedPosition.y && clickedPosition.y < 5){
                gsap.to(camera.position, {
                    x: 30,
                    y: -10,
                    z: 600,
                    duration: 2,
                    onStart: () => {
                        orbitControls.enabled = false;
                    },
                    onUpdate: () => {
                    let target = camera.position.clone().add(cameraDirection);
                        orbitControls.target = target;
                    },
                    onComplete: () => {
                        orbitControls.enabled = true;
                    },
                });
            }
            else if(-2 < clickedPosition.x && clickedPosition.x < 18 && -20 < clickedPosition.y && clickedPosition.y < -9){
                gsap.to(camera.position, {
                    x: 8,
                    y: -16,
                    z: 600,
                    duration: 2,
                    onStart: () => {
                        orbitControls.enabled = false;
                    },
                    onUpdate: () => {
                    let target = camera.position.clone().add(cameraDirection);
                        orbitControls.target = target;
                    },
                    onComplete: () => {
                        orbitControls.enabled = true;
                    },
                });
            }
            else if( -20 < clickedPosition.x && clickedPosition.x < 16 && -5 < clickedPosition.y && clickedPosition.y < 5 ){
                gsap.to(camera.position, {
                    x: 1,
                    y: -0.5,
                    z: 600,
                    duration: 2,
                    onStart: () => {
                        orbitControls.enabled = false;
                    },
                    onUpdate: () => {
                    let target = camera.position.clone().add(cameraDirection);
                        orbitControls.target = target;
                    },
                    onComplete: () => {
                        orbitControls.enabled = true;
                    },
                });
            }
            else gsap.to(camera.position, {
                x: 0,
                y: 0,
                z: 1000,
                duration: 2,
                onStart: () => {
                    orbitControls.enabled = false;
                },
                onUpdate: () => {
                let target = camera.position.clone().add(cameraDirection);
                    orbitControls.target = target;
                },
                onComplete: () => {
                    orbitControls.enabled = true;
                },
            });
        }
        if(clickCounter % 2 == 0){
            gsap.to(camera.position, {
                x: 0,
                y: 0,
                z: 1000,
                duration: 2,
                onStart: () => {
                    orbitControls.enabled = false;
                },
                onUpdate: () => {
                let target = camera.position.clone().add(cameraDirection);
                    orbitControls.target = target;
                },
                onComplete: () => {
                    orbitControls.enabled = true;
                },
            });
        }
    }
    clickCounter += 1;
}
function onPointerMove(event) {
    pointerHover();
}
function pointerHover() {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    let clickedMesh = intersects[0].object;
    let clickedPosition = intersects[0].point;
    let cameraDirection = new THREE.Vector3(1, 0, 0)
        .applyQuaternion(camera.quaternion)
        .normalize()
        .multiplyScalar(0.00001);
    if(clickedMesh.userData.name = 'map') {
            if(-66 < clickedPosition.x && clickedPosition.x < -34 && 2 < clickedPosition.y && clickedPosition.y < 16){
                gsap.to(tips4.scale, {x: 2, y: 2, duration: 2})
            }
            else if(-12 < clickedPosition.x && clickedPosition.x < 16 && 7 < clickedPosition.y && clickedPosition.y < 16){
                gsap.to(tips2.scale, {x: 2, y: 2, duration: 2})
            }
            else if(28 < clickedPosition.x && clickedPosition.x < 57 && 5 < clickedPosition.y && clickedPosition.y < 20){
                gsap.to(tips5.scale, {x: 2, y: 2, duration: 2})
            }
            else if(17 < clickedPosition.x && clickedPosition.x < 34 && -12 < clickedPosition.y && clickedPosition.y < 5){
                gsap.to(tips1.scale, {x: 2, y: 2, duration: 2})
            }
            else if(-2 < clickedPosition.x && clickedPosition.x < 18 && -20 < clickedPosition.y && clickedPosition.y < -9){
                gsap.to(tips.scale, {x: 2, y: 2, duration: 2})
            }
            else if( -20 < clickedPosition.x && clickedPosition.x < 16 && -5 < clickedPosition.y && clickedPosition.y < 5 ){
                gsap.to(tips3.scale, {x: 2, y: 2, duration: 2})
            }
            else {
                gsap.to(tips.scale, {x: 1, y: 1, duration: 2})
                gsap.to(tips1.scale, {x: 1, y: 1, duration: 2})
                gsap.to(tips2.scale, {x: 1, y: 1, duration: 2})
                gsap.to(tips3.scale, {x: 1, y: 1, duration: 2})
                gsap.to(tips4.scale, {x: 1, y: 1, duration: 2})
                gsap.to(tips5.scale, {x: 1, y: 1, duration: 2})
            }
            
        }
}

function onResize() {
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    // Call tick again on the next frame
    window.requestAnimationFrame(animate);
    renderer.render( scene, camera );
};
animate();
function tipsVibrate() {
    setTimeout(tipsVibrate, 100)
    gsap.to(tips.position, { duration: 2, x: Math.random() + 4, y: Math.random() - 6 });
    gsap.to(tips1.position, { duration: 2, x: Math.random() + 22, y: Math.random() + 9 });
    gsap.to(tips2.position, { duration: 2, x: Math.random() + 1, y: Math.random() + 22 });
    gsap.to(tips3.position, { duration: 2, x: Math.random() - 5, y: Math.random() + 8 });
    gsap.to(tips4.position, { duration: 2, x: Math.random() - 40, y: Math.random() + 19 });
    gsap.to(tips5.position, { duration: 2, x: Math.random() + 33, y: Math.random() + 23 })
}
tipsVibrate();














    
      
      
      



