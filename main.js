import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'

const gui = new dat.GUI()
const world = {
  plane: {
    width: 400,
    height: 400, 
    widthSegments: 50, 
    heightSegments: 50
  }
}

gui.add(world.plane, 'width', 1, 500).onChange(generatePlane)
gui.add(world.plane, 'height', 1, 500).onChange(generatePlane)
gui.add(world.plane, 'widthSegments', 1, 100).onChange(generatePlane)
gui.add(world.plane, 'heightSegments', 1, 100).onChange(generatePlane)

function generatePlane() {
  mesh.geometry.dispose()
  mesh.geometry = new THREE.PlaneGeometry(
    world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments
  )

  //vertice position random
  const { array } = mesh.geometry.attributes.position
  const randomValues = []
  for (let i = 0; i < array.length; i ++) {
    if(i % 3 === 0) { 
      const x = array[i]
      const y = array[i + 1]
      const z = array[i + 2]

      array[i] = x + (Math.random() - 0.5) * 3
      array[i + 1] = y + (Math.random() - 0.5) * 3
      array[i + 2] = z + (Math.random() - 0.5) * 4
    }
    randomValues.push(Math.random() * Math.PI * 2)
  }

  mesh.geometry.attributes.position.randomValues = randomValues
  mesh.geometry.attributes.position.originalPosition = mesh.geometry.attributes.position.array
    

  const colors = []
  for (let i = 0; i < mesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4)
  }

  mesh.geometry.setAttribute('color', new THREE.BufferAttribute(
    new Float32Array(colors), 3)
  )
}

const raycaster = new THREE.Raycaster()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(95, window.innerWidth/ window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

const geometry = new THREE.PlaneGeometry(24, 24, 30, 30)
const material = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide, 
  flatShading: THREE.FlatShading,
  vertexColors: true
 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
generatePlane()
new OrbitControls(camera, renderer.domElement)
camera.position.z = 60


const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, 1, 1)
scene.add(light)

const backLight = new THREE.DirectionalLight(0xffffff, 1)
backLight.position.set(0, 0, -1)
scene.add(light)

const mouse = {
  x: undefined,
  y: undefined
}

let frame = 0

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  raycaster.setFromCamera(mouse, camera)
  frame += 0.01

  const { array, originalPosition, randomValues } = mesh.geometry.attributes.position
  for (let i = 0; i < array.length; i += 3) {
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.005

    // y coordinates
    array[i + 1] = originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.005
  }
  mesh.geometry.attributes.position.needsUpdate = true

  const intersects = raycaster.intersectObject(mesh)

  if(intersects.length > 0) {
    const { color } = intersects[0].object.geometry.attributes

    //vertice 1
    color.setX(intersects[0].face.a, 0.1)
    color.setY(intersects[0].face.a, 0.5)
    color.setZ(intersects[0].face.a, 1)

    //vertice 2
    color.setX(intersects[0].face.b, 0.1)
    color.setY(intersects[0].face.b, 0.5)
    color.setZ(intersects[0].face.b, 1)

    //vertice 3
    color.setX(intersects[0].face.c, 0.1)
    color.setY(intersects[0].face.c, 0.5)
    color.setZ(intersects[0].face.c, 1)

    intersects[0].object.geometry.attributes.color.needsUpdate = true

    const initialColor = {
      r: 0,
      g: .19,
      b: .4
    }

    const hoverColor = {
      r: .1,
      g: .5,
      b: 1
    }

    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      onUpdate: () => {
        //vertice 1
        color.setX(intersects[0].face.a, hoverColor.r)
        color.setY(intersects[0].face.a, hoverColor.g)
        color.setZ(intersects[0].face.a, hoverColor.b)

        //vertice 2
        color.setX(intersects[0].face.b, hoverColor.r)
        color.setY(intersects[0].face.b, hoverColor.g)
        color.setZ(intersects[0].face.b, hoverColor.b)

        //vertice 3
        color.setX(intersects[0].face.c, hoverColor.r)
        color.setY(intersects[0].face.c, hoverColor.g)
        color.setZ(intersects[0].face.c, hoverColor.b)
        color.needsUpdate = true
      }
    })
  }
  // mesh.rotation.x += 0.02
}
animate()



addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = -(event.clientY / innerHeight) * 2 + 1
})

// console.log(scene)
// console.log(camera)
// console.log(renderer)