import './style.css'
import * as THREE from 'three';

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, innerWidth/ innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

const geometry = new THREE.PlaneGeometry(7, 7, 10, 10)
const material = new THREE.MeshPhongMaterial({ color: 0xff0000, side: THREE.DoubleSide })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
camera.position.z = 5

const { array } = mesh.geometry.attributes.position
for (let i = 0; i < array.length; i++) {
  const element = array[i];
}

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, 0, 1)
scene.add(light)

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  // mesh.rotation.x += 0.02
}
animate()

// console.log(scene)
// console.log(camera)
// console.log(renderer)