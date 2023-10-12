import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from 'dat.gui';

// Création de la scène
let scene = new THREE.Scene();
scene.background = new THREE.Color('lightblue');

let camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight);
camera.position.z = 3;

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.append(renderer.domElement);

// OrbitControls initialization
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.rotateSpeed = 0.5;

function init() {
	window.addEventListener('resize', onResize, false);
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function onResize() {
	let width = window.innerWidth;
	let height = window.innerHeight;
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
}

// Lights
let ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
scene.add(ambientLight);

let pointLight = new THREE.PointLight(0xFFFF00, 5);
scene.add(pointLight);

// Scene
// Mesh
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
let mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// GUI
const gui = new GUI();

// Add a folder: it is a dropdown button
const cameraPositionFolder = gui.addFolder('Camera');

// It adds inside the folder a modifiable field
// Here it is the z coordinate of the camera.
// 
// Params:
// 1 - An object (camera.position).
// It needs to have different fields which is the case here (x, y, z).
// 2 - The field of the object given in -1-.
// It has to exist in the given object.
//
// For a slider, add two more values :
// 3 - min value
// 4 - max value
// 5 - optional: step (smallest increment possible), default: 0.1
cameraPositionFolder.add(camera.position, 'z', 0, 20);

// You can open the folder by default with: folderName.open();
// Ex: cameraPositionFolder.open();

const meshFolder = gui.addFolder('Mesh');

// You can also add folders inside a folder.
const meshRotationFolder = meshFolder.addFolder('Rotation');
meshRotationFolder.add(mesh.rotation, 'x', 0, Math.PI * 2);
meshRotationFolder.add(mesh.rotation, 'y', 0, Math.PI * 2);
meshRotationFolder.add(mesh.rotation, 'z', 0, Math.PI * 2);

// Create an animation loop
const animate = () => {
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
};

init();
animate();