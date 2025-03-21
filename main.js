import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

const mouse = new THREE.Vector2();
const hdrTextureURL = new URL('http://myportfoliobucket2843.s3-website.eu-north-1.amazonaws.com/assets/qwantani_puresky_4k.hdr', import.meta.url);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(300);

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 3;

renderer.render(scene, camera);

const realLoader = new RGBELoader();
realLoader.setDataType(THREE.FloatType); // Ensures float format for HDR textures
realLoader.load(hdrTextureURL, function (texture) {
    console.log('HDR texture loaded successfully:', texture);
    if (!texture) {
        console.error('Failed to load HDR texture.');
        return;
    }
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;

    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 50, 50),
        new THREE.MeshStandardMaterial({
            roughness: 0.2,
            metalness: 0.8,
            emissive: 0x222222,
        })
    );
    sphere.scale.set(70, 70, 70);
    sphere.position.z = 10;
    scene.add(sphere);
}, undefined, function (error) {
    console.error('Error loading HDR texture:', error);
});


const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
const mixers = [];

function enhanceMaterial(model) {
    model.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.2,
                metalness: 0.8,
                emissive: 0x222222,
            });
        }
    });
}

function loadModel(modelPath) {
    loader.load(modelPath, function (gltf) {
        const model = gltf.scene;
        if (!model) {
            console.error(`Model not found in ${modelPath}`);
            return;
        }
        enhanceMaterial(model);
        model.scale.set(0.1, 0.1, 0.1);
        model.position.set(-20, 20, 5);
        scene.add(model);

        const animations = gltf.animations;
        if (animations && animations.length) {
            const mixer = new THREE.AnimationMixer(model);
            const defaultAnimation = mixer.clipAction(animations[0]);
            defaultAnimation.play();
            mixers.push(mixer);
        }
    }, undefined, function (error) {
        console.error(`Failed to load model at ${modelPath}:`, error);
    });
}

const modelsToLoad = ['http://myportfoliobucket2843.s3-website.eu-north-1.amazonaws.com/assets/Stork.glb', 'http://myportfoliobucket2843.s3-website.eu-north-1.amazonaws.com/assets/IridescentDishWithOlives.glb'];
modelsToLoad.forEach((modelPath) => {
    console.log('Loading model:', modelPath);
    loadModel(modelPath);
});

const ilandLoader = new GLTFLoader();
ilandLoader.setDRACOLoader(dracoLoader);
ilandLoader.load('http://myportfoliobucket2843.s3-website.eu-north-1.amazonaws.com/assets/3d/island.glb?v=123', function (gltf) {
    const ilandmodel = gltf.scene;
    if (!ilandmodel) {
        console.error('Failed to load island model.');
        return;
    }
    enhanceMaterial(ilandmodel);
    ilandmodel.scale.set(1, 1, 1);
    ilandmodel.position.z = -20;
    scene.add(ilandmodel);
});

const pointLight = new THREE.PointLight(0xffffff, 5);
pointLight.position.set(50, 50, 50);
pointLight.intensity = 2;  // ✅ Corrected placement

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
ambientLight.intensity = 1;  // ✅ Corrected placement
scene.add(pointLight, ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(10, 20, 10);
directionalLight.intensity = 0.5;  // ✅ Corrected placement
scene.add(directionalLight);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    mixers.forEach((mixer) => mixer.update(0.01));

    camera.position.z = t * -0.1;
    camera.rotation.y = t * -0.0002;
    camera.position.x = t * -0.0002;

    controls.update();
}

document.addEventListener('scroll', moveCamera);

document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('scroll', () => {
        scene.traverse((child) => {
            if (child.isMesh) {
                child.position.y = scrollY * 0.01;
            }
        });
    });
});

function animate() {
    requestAnimationFrame(animate);
    mixers.forEach((mixer) => mixer.update(0.01));
    renderer.render(scene, camera);
    controls.update();
    composer.render();
}

animate();
