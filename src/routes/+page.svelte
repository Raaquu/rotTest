<script> import {
    CircleBufferGeometry,
    MeshStandardMaterial,
    CylinderBufferGeometry,
    QuadraticBezierCurve3,
    QuadraticBezierCurve,
    Vector3,
    Color,
    MeshBasicMaterial,
    TubeBufferGeometry,
    Path,
	AxesHelper,
	GridHelper,
	CylinderGeometry,
	LineBasicMaterial
  } from "three";
  import {
    Canvas,
    LineSegments,
    Line,
    DirectionalLight,
    HemisphereLight,
    Mesh,
    OrbitControls,
    PerspectiveCamera,
	Object3DInstance,
    Object3D
  } from "@threlte/core";

  import {j1} from "../rotation.js"

</script>

<div>
<Canvas>

    <PerspectiveCamera position={{ x: 0, y: 5, z: 100 }} lookAt={{x: 0, y: 0, z: 0}}>
        <OrbitControls 
        enableZoom={true}/>
    </PerspectiveCamera>

    <DirectionalLight
        shadow
        color={'#EDBD9C'}
        position={{ x: -15, y: 45, z: 20 }}
    />

    <HemisphereLight
        skyColor={0x4c8eac}
        groundColor={0xac844c}
        intensity={0.6}
    />

    <Object3DInstance object = {new AxesHelper(100)} />

    <Object3DInstance  
    object={new GridHelper(100, 100, 0x444444, 0x555555)}
    />
    
    <Object3DInstance
    object={j1}
    
    />

    <!-- <Object3DInstance
    object={link}
    
    /> -->
 

    <!-- <Line
    geometry = {geometryL2}
    material = {new LineBasicMaterial({color : 'blue'})}
    /> -->
    <!-- <Mesh
    geometry = {Cylinder1}
    material={new MeshStandardMaterial({
        color: new Color('blue')
    })}
    position = {anchor} /> -->


</Canvas>
</div>

<style>
	div {
	  position: fixed;
	  top: 0;
	  left: 0;
	  width: 100%;
	  height: 100%;
	}
</style>
