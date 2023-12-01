/*import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'), 
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
renderer.render(scene, camera);


const renderScene = new RenderPass(scene,camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
//const material = new THREE.MeshStandardMaterial( {color: 0xFF6347});
const material = new THREE.MeshNormalMaterial( {color: 0xFF6347});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus)

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);

function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff})
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star)
}
Array(200).fill().forEach(addStar)

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

function animate(){
  requestAnimationFrame(animate);
  torus.rotation.x+=0.01;
  torus.rotation.y+=0.005;
  torus.rotation.z+=0.01;
  controls.update();
  renderer.render(scene, camera);
}
animate()
*/
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

import starsTexture from './img/stars.jpg';
import sunTexture from './img/sun.jpg';


import earthTexture from './img/earth.jpg';

import jupiterTexture from './img/jupiter.jpg';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-90, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
]);

const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

function createPlanete(size, texture, position, ring) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    scene.add(obj);
    mesh.position.x = position;
    return {mesh, obj}
}


const earth = createPlanete(6, earthTexture, 62);
const jupiter = createPlanete(12, jupiterTexture, 100);


var pointLight = new THREE.PointLight(0xFFFFFF, 1000, 250, 1.5);
scene.add(pointLight);

function animate() {
    //Self-rotation
    sun.rotateY(0.004);
    
    
    earth.mesh.rotateY(0.02);
    
    jupiter.mesh.rotateY(0.04);
    

    //Around-sun-rotation
    
    earth.obj.rotateY(0.01);
    
    jupiter.obj.rotateY(0.002);

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

/*import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import starsTexture from './img/stars.jpg';
import sunTexture from './img/sun.jpg';
import earthTexture from './img/earth.jpg';
import jupiterTexture from './img/jupiter.jpg';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-90, 140, 140);
orbit.update();

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
]);

const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

function createPlanete(size, material, position) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mesh = new THREE.Mesh(geo, material);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    scene.add(obj);
    mesh.position.x = position;
    return { mesh, obj };
}
textureLoader.load(earthTexture, (texture) => {
  console.log('Earth texture loaded successfully:', texture);
}, undefined, (error) => {
  console.error('Error loading Earth texture:', error);
});
const earthMat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(earthTexture),
    emissiveMap: textureLoader.load(earthTexture),
    emissive: new THREE.Color(0x00ff00),
    emissiveIntensity: 0.2,
});

const jupiterMat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(jupiterTexture),
    emissiveMap: textureLoader.load(jupiterTexture),
    emissive: new THREE.Color(0xff9900),
    emissiveIntensity: 0.7,
});

const earth = createPlanete(6, earthMat, 62);
const jupiter = createPlanete(12, jupiterMat, 100);

const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass();
composer.addPass(bloomPass);

function animate() {
    sun.rotateY(0.004);
    earth.mesh.rotateY(0.02);
    jupiter.mesh.rotateY(0.04);
    earth.obj.rotateY(0.01);
    jupiter.obj.rotateY(0.002);
    composer.render();
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

*/