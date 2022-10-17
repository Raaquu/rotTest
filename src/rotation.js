// @ts-nocheck
import {

  MeshStandardMaterial,
  CylinderBufferGeometry,
  Vector3,
  Mesh,
  CylinderGeometry,
  Line,
  Quaternion,
  Object3D,
  BufferGeometry,
  LineBasicMaterial
} from "three";
import * as math from 'mathjs'

import nj from "numjs"
import { dotMultiply } from "mathjs";

// for converting an array to object literal because threlte works with objects literals
// instead of arrays. Maybe not needed in final build but good for testing
function entries(arr) {
  
  return new Map([
      ['x', arr[0]],
      ['y', arr[1]],
      ['z', arr[2]]
  ]) 
}

  var jointAxis = [1,4,2]
  var transOffset = 5.15
  var rotOffset = 0
  

  



  // setting the main axis of the cylinder
  var upAxis = new Vector3(jointAxis[0], jointAxis[1], jointAxis[2] ).normalize()
  var quaternion = new Quaternion();

  // geometries and colors for the cylinders
  const geometry = new CylinderBufferGeometry(2,2,2,20);
  const material =  new MeshStandardMaterial({color: 'yellow'})
  const material2 =  new MeshStandardMaterial({color: 'red'})
  const material3 =  new MeshStandardMaterial({color: 'green'})

  // this is the marker for the rotational offset on the cylinder
  // endPoint is vector perpendicular to (0,1,0) with length of radius
  //  = (1,0,0) * radius plus starting point (0,5,0)
  const pointsMarker = [];
  var endPointMarker = new Vector3( 2, 1, 0)

  // starting point is cylinder height /2 * default cylinder axis
  // Default cylinder main axis is (0,1,0) 
  // this is the standard in Three.js

  pointsMarker.push(new Vector3(0,1,0),
              new Vector3(endPointMarker.x, endPointMarker.y, endPointMarker.z)
  )
  var geometryMarker = new BufferGeometry().setFromPoints( pointsMarker)


// premade meshes for the 3dObject to add
  var base_link_pre = new Mesh(geometry,material)
  var term_link_pre = new Mesh(geometry,material2)
  var testCyl_pre = new Mesh(geometry,material2)
 
// a copy of the marker has to be made for the terminal link
  var marker_pre = new Line(geometryMarker, new LineBasicMaterial({ color: 'blue'}))
  var marker_pre_copy = new Line(geometryMarker, new LineBasicMaterial({ color: 'blue'}))
  const pointsMarkerNext = [];


  pointsMarkerNext.push(new Vector3(0,1,0),
        new Vector3(11* endPointMarker.x, endPointMarker.y, endPointMarker.z))

  var a1 = math.dotMultiply([1,1,1], transOffset)
  var n1 = jointAxis
  var a2 = [5,5,5]
  var n2 = [1,1,1]
  var offset = 2

  var geometryMarkerNext = new BufferGeometry().setFromPoints( pointsMarkerNext)

// the terminal link of the joint
  var term_link = new Object3D()
    term_link.add(term_link_pre)
    term_link.add(marker_pre_copy)

  term_link.add(generateLink(a1,a2,n1,n2,offset,transOffset))

    // the new orientation aka the jointaxis
    term_link.up = upAxis

    // translational offset, only for terminal link
    term_link.translateOnAxis(term_link.up, transOffset)

    // orientation of the cylinder has to be the new axis
    term_link.quaternion.setFromUnitVectors(new Vector3(0,1,0), term_link.up )

    // rotational offset, only for terminal link
    term_link.rotateOnAxis(new Vector3(0,1,0), rotOffset)
 

  // the base link of the joint
  var base_link = new Object3D()
    base_link.add(base_link_pre)
    base_link.add(marker_pre)

  // setting orientation of the base link
    base_link.up = upAxis
    base_link.quaternion.setFromUnitVectors(new Vector3(0,1,0), base_link.up )

  // prerequisites 
  const geometry2 = new CylinderBufferGeometry(1,1,dist(term_link.position, base_link.position),20)
  var transCyl_pre = new Mesh(geometry2,material3)

  // the cylinder highlighting the translational offset
  var transCyl = new Object3D()
    transCyl.add(transCyl_pre)

  // orientation
    transCyl.up = upAxis

  // position is the mddle of the translational offset
  // travel along the positive or negative direction of the axis
  // determined by the signum of the transOffset
  
  if (transOffset > 0) {
    transCyl.translateOnAxis(transCyl.up, dist(term_link.position, base_link.position)/2)
  }else {
    transCyl.translateOnAxis(transCyl.up, - dist(term_link.position, base_link.position)/2)
  }
  // for correct orientation
    transCyl.quaternion.setFromUnitVectors(new Vector3(0,1,0), term_link.up )


    // adding all cylinders to a joint together
    export var j1 = new Object3D()

    // translating to anchor
    j1.translateX(1)
    j1.translateY(1)
    j1.translateZ(1)
  
    j1.add(term_link,base_link,transCyl)

 function generateLink(a1,a2,n1,n2,offset, transOffset){
      var l1 = make_unit_line(n1,a1)
      var l2 = make_unit_line(n2,a2)
    
      // var a1 = dotMultiply(a1,transOffset)
      var anchor_middle = (getNearestPoints(l1,l2))
      var pointA = math.add( a1, math.dotMultiply(offset,n1))
      var pointB = math.subtract( a2, math.dotMultiply(offset,n2))
    
      var Link = new Object3D()
      var c1 = generateCylinder(a1, pointA)
      var c2 = generateCylinder(pointA,anchor_middle)
      var c3 = generateCylinder(anchor_middle, pointB)
      var c4 = generateCylinder(pointB, a2)
      Link.add(c1)
      Link.add(c2)
      Link.add(c3)
      Link.add(c4)
    
      return Link;
    
    }

function generateCylinder(a,b){
  var distance = distArr(a,b)
  const material =  new MeshStandardMaterial({color: 'gray'})
  const cylinder = new CylinderGeometry(0.5,0.5,distance,20)
  const stickAxis = new Vector3(b[0]- a[0], b[1]- a[1], b[2]- a[2]).normalize()
  const quaternion = new Quaternion()
  const cylinderStandardUp = new Vector3(0,1,0)
  quaternion.setFromUnitVectors(cylinderStandardUp, stickAxis)
  cylinder.applyQuaternion(quaternion)

  cylinder.translate((b[0] + a[0])/2, (b[1] + a[1])/2, (b[2] + a[2])/2)

  return new Mesh(cylinder, material)

}

function distArr(a,b){ 
  return Number(math.sqrt( math.pow((a[0]-b[0]), 2) + math.pow((a[1]-b[1]), 2) + math.pow((a[2]-b[2]), 2)).toFixed(3));
}
// get rounded distance of two points
function dist(a,b){ 
 return Number(math.sqrt( math.pow((a.x-b.x), 2) + math.pow((a.y-b.y), 2) + math.pow((a.z-b.z), 2)).toFixed(3));

}

function getNearestPoints(line1, line2){
  var n_a = line1.slice([0,3]).tolist()
  var m_a = line1.slice([3,6]).tolist()
  var n_b = line2.slice([0,3]).tolist()
  var m_b = line2.slice([3,6]).tolist()

  var a_a = math.cross(n_a, m_a)
  var a_b = math.cross(n_b, m_b)

  var d_ab = math.subtract(a_b,a_a)

  var upTerm1 = math.dot(math.cross(math.cross(n_b,n_a), n_b), d_ab)
  var upTerm2 = math.dot(math.cross(math.cross(n_a,n_b), n_a), d_ab)
  var downTerm = math.norm(math.cross(n_a, n_b)) * math.norm(math.cross(n_a, n_b))

  var line1_p = math.add(a_a, math.dotMultiply(math.divide(upTerm1, downTerm) , n_a))
  var line2_p = math.subtract(a_b, math.dotMultiply(math.divide(upTerm2, downTerm), n_b))

  // divide by zero
  if(downTerm == 0){
      var line1_p = a_a
      var line2_p = a_b
  }
  // like strategy of lines ZZ in BBO

  var anchor_middle = math.dotMultiply( 0.5, math.add(line1_p,line2_p))
  return anchor_middle
}
function normalized (some_vec) {

  if(some_vec instanceof nj.NdArray){
      some_vec = some_vec.tolist()
  }

  var copy_some_vec = some_vec

  if(math.norm(some_vec) == 0){
      return nj.zeros(some_vec.length)
  }

  return nj.array(copy_some_vec.map(function(x) { return x * (1/math.norm(some_vec)); }));


}

function make_unit_line(n,anchor){

  // First Making the standard pvec
  // console.log(n)
  var x = normalized(n).tolist()

  // console.log(x)
  var pvec = nj.concatenate(nj.transpose(x),nj.transpose(math.cross(anchor,x)))

  // console.log(pvec)
  return pvec

}