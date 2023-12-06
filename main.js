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

  // The rest of your code remains unchanged
  
    // The rest of your code remains unchanged
    const mouse = new THREE.Vector2();
    const hdrTextureURL = new URL('assets/kloofendal_28d_misty_puresky_8k.hdr', import.meta.url);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('#bg'),
    });
  
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(300);
    renderer.render(scene, camera);
  
    const realLoader = new RGBELoader();
    realLoader.load(hdrTextureURL, function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 50, 50),
        new THREE.MeshStandardMaterial({
          roughness: 0,
          metalness: 0.5,
        })
      );
      sphere.scale.set(70,70,70);
      sphere.position.z=10;
      scene.add(sphere);
    });
  
    // Create an instance of DRACOLoader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
   // Set the path to your Draco decoder
  
    // Pass DRACOLoader instance to GLTFLoader
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
  
    const renderScene = new RenderPass(scene, camera);
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    const mixers = [];
  
    function loadModel(modelPath) {
      loader.load(modelPath, function (gltf) {
        const model = gltf.scene;
        model.scale.set(0.1, 0.1, 0.1);
        model.position.set(-20,20,5);
        scene.add(model);
  
        const animations = gltf.animations;
  
        if (animations && animations.length) {
          const mixer = new THREE.AnimationMixer(model);
          const defaultAnimation = mixer.clipAction(animations[0]);
          defaultAnimation.play();
          mixers.push(mixer);
        }
      }, undefined, function (error) {
        console.error(error);
      });
    }
  
    const modelsToLoad = ['assets/Stork.glb', 'assets/IridescentDishWithOlives.glb'];
  
    modelsToLoad.forEach((modelPath) => {
      loadModel(modelPath);
    });
    const ilandLoader = new GLTFLoader();
    ilandLoader.setDRACOLoader(dracoLoader); 
    ilandLoader.load('assets/3d/island.glb',function(gltf){
      const ilandmodel = gltf.scene;
      ilandmodel.scale.set(1,1,1);
      ilandmodel.position.z = -20;
      ilandmodel.rotation.y += 0.005; // Adjust the rotation speed as needed
      scene.add(ilandmodel);
    });
    
    

    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5, 5, 5);
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(pointLight, ambientLight);
    const lightHelper = new THREE.PointLightHelper(pointLight);
    scene.add(lightHelper);
  
    const controls = new OrbitControls(camera, renderer.domElement);
    const main = document.getElementById('main');
    document.addEventListener('scroll', () => {
      moveCamera();
    });
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25; // adjusts how quickly the controls slow down after a user stops interacting
    
    function moveCamera(){
      const t = document.body.getBoundingClientRect().top;
      
      mixers.forEach((mixer) => {
        mixer.rotation+=0.2;

        const opacity = Math.max(0, 1 - t / window.innerHeight);
  scene.traverse((obj) => {
    if (obj.isMesh) {
      obj.material.opacity = opacity;
      obj.material.transparent = true;
    }
  });
      });

      camera.position.z = t * -0.1;
      camera.rotation.y = t * -0.0002;
      camera.position.x = t * -0.0002;

    const targetRotation = new THREE.Vector3(mouse.y, mouse.x, 0);
    camera.rotation.reorder('YXZ');
    camera.rotation.x = targetRotation.x * 5;
    camera.rotation.y = targetRotation.y * 5;

    controls.update();

  // Adjust the position or visibility of the new HTML content
      const newContentOpacity = Math.max(0, 1 - t / window.innerHeight);
      newContent.style.opacity = newContentOpacity;
      newContent.style.transform = `translateY(${t}px)`;
    }  


    document.addEventListener('DOMContentLoaded', function () {
      const newContent = document.getElementById('newContent');
    
      document.addEventListener('scroll', () => {

        // Fade out and move scene
        scene.style.opacity = Math.max(0, 1 - scrollY/500);
        scene.style.transform = `translateY(${scrollY}px)`;
      
        // Fade in new content
        newContent.style.opacity = Math.max(0, (scrollY - 500) / 500);
      
      });
      
    });
    
    

    function animate() {
      requestAnimationFrame(animate);
      mixers.forEach((mixer) => {
        mixer.update(0.01);
      });
      
      renderer.render(scene, camera);
      controls.update();
      composer.render();
      
    }
  
    animate();
  
  