import React, { useEffect, useRef } from 'react';
// import { useDispatch } from 'react-redux';
import * as THREE from 'three';
import { Vector2 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { doMove } from './store/actions/notationAction';
import SatrancAi from './satranc.mjs';

import './Game.css';


let scene, camera, renderer, controls, board, mouse, raycaster, selectedPiece = null, circle;
let orderColor = false, mate = false;

let darkPawn, darkKing, darkQueen, darkRook, darkBishop, darkKnight, lightPawn, lightKing, lightQueen, lightRook, lightBishop, lightKnight;

let pr, prPawn, prActive = false;

let doMove, aiMove;

let wasmLoading = false;

SatrancAi({
  noInitialRun: true,
  noExitRuntime: true
}).then((Module) => {
  doMove = Module.cwrap("doMove", "string", ["number", "number", "number", "number"]);
  aiMove = Module.cwrap("aiMove", "string", []);
  wasmLoading = true;
});

function AiGame() {

  const mount = useRef();

  // const dispatch = useDispatch();

  const onClick = (width, height) => event => { // asenkron hale getirilecek

    const rect = event.target.getBoundingClientRect(); // scroll ettiğimizde nesnelere yine tıklanılabilmesi için

    mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
    mouse.y = - ((event.clientY - rect.top) / height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    let intersects;

    if (selectedPiece != null) {
      intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length === 0) {
        intersects = raycaster.intersectObjects(board.children);
      }
      if (intersects.length > 0) {

        const targetSquare = intersects[0].object;

        let moveResult = doMove(selectedPiece.position.x, selectedPiece.position.z, targetSquare.position.x, targetSquare.position.z);

        if (moveResult !== "") {

          let piece;

          scene.children = scene.children.filter(piece => typeof piece.userData.type === 'undefined' || piece.userData.type === 'light');

          for (let j = 0; j < 8; j++) {
            for (let i = 0; i < 8; i++) {
              switch (moveResult[i + 8 * j]) {
                case '0':
                  continue;
                case 'p':
                  piece = darkPawn.clone(true);
                  piece.userData.color = true;
                  piece.userData.type = 'p';
                  piece.position.set(i, 0.348, j);
                  break;
                case 'P':
                  piece = lightPawn.clone(true);
                  piece.userData.color = false;
                  piece.userData.type = 'P';
                  piece.position.set(i, 0.348, j);
                  break;
                case 'n':
                  piece = darkKnight.clone(true);
                  piece.userData.color = true;
                  piece.userData.type = 'n';
                  piece.position.set(i, 0.398, j);
                  break;
                case 'N':
                  piece = lightKnight.clone(true);
                  piece.userData.color = false;
                  piece.userData.type = 'N';
                  piece.position.set(i, 0.398, j);
                  break;
                case 'b':
                  piece = darkBishop.clone(true);
                  piece.userData.color = true;
                  piece.userData.type = 'b';
                  piece.position.set(i, 0.43015, j);
                  break;
                case 'B':
                  piece = lightBishop.clone(true);
                  piece.userData.color = false;
                  piece.userData.type = 'B';
                  piece.position.set(i, 0.43015, j);
                  break;
                case 'r':
                  piece = darkRook.clone(true);
                  piece.userData.color = true;
                  piece.userData.type = 'r';
                  piece.position.set(i, 0.4485, j);
                  break;
                case 'R':
                  piece = lightRook.clone(true);
                  piece.userData.color = false;
                  piece.userData.type = 'R';
                  piece.position.set(i, 0.4485, j);
                  break;
                case 'q':
                  piece = darkQueen.clone(true);
                  piece.userData.color = true;
                  piece.userData.type = 'q';
                  piece.position.set(i, 0.498, j);
                  break;
                case 'Q':
                  piece = lightQueen.clone(true);
                  piece.userData.color = false;
                  piece.userData.type = 'Q';
                  piece.position.set(i, 0.498, j);
                  break;
                case 'k':
                  piece = darkKing.clone(true);
                  piece.userData.color = true;
                  piece.userData.type = 'k';
                  piece.position.set(i, 0.560, j);
                  break;
                case 'K':
                  piece = lightKing.clone(true);
                  piece.userData.color = false;
                  piece.userData.type = 'K';
                  piece.position.set(i, 0.560, j);
                  break;
                default:
                  break;
              }
              scene.add(piece);
            }
          }

          moveResult = aiMove();
          
          scene.children = scene.children.filter(piece => typeof piece.userData.type === 'undefined' || piece.userData.type === 'light');
          
          for (let j = 0; j < 8; j++) {
            for (let i = 0; i < 8; i++) {
              switch (moveResult[i + 8 * j]) {
                case '0':
                  continue;
                case 'p':
                  piece = darkPawn.clone(true);
                  piece.userData.color = true;
                  piece.userData.type = 'p';
                  piece.position.set(i, 0.348, j);
                  break;
                case 'P':
                  piece = lightPawn.clone(true);
                  piece.userData.color = false;
                  piece.userData.type = 'P';
                  piece.position.set(i, 0.348, j);
                  break;
                case 'n':
                  piece = darkKnight.clone(true);
                  piece.userData.color = true;
                  piece.userData.type = 'n';
                  piece.position.set(i, 0.398, j);
                  break;
                case 'N':
                  piece = lightKnight.clone(true);
                  piece.userData.color = false;
                  piece.userData.type = 'N';
                  piece.position.set(i, 0.398, j);
                  break;
                case 'b':
                  piece = darkBishop.clone(true);
                  piece.userData.color = true;
                  piece.userData.type = 'b';
                  piece.position.set(i, 0.43015, j);
                  break;
                case 'B':
                  piece = lightBishop.clone(true);
                  piece.userData.color = false;
                  piece.userData.type = 'B';
                  piece.position.set(i, 0.43015, j);
                  break;
                case 'r':
                  piece = darkRook.clone(true);
                  piece.userData.color = true;
                  piece.userData.type = 'r';
                  piece.position.set(i, 0.4485, j);
                  break;
                case 'R':
                  piece = lightRook.clone(true);
                  piece.userData.color = false;
                  piece.userData.type = 'R';
                  piece.position.set(i, 0.4485, j);
                  break;
                case 'q':
                  piece = darkQueen.clone(true);
                  piece.userData.color = true;
                  piece.userData.type = 'q';
                  piece.position.set(i, 0.498, j);
                  break;
                case 'Q':
                  piece = lightQueen.clone(true);
                  piece.userData.color = false;
                  piece.userData.type = 'Q';
                  piece.position.set(i, 0.498, j);
                  break;
                case 'k':
                  piece = darkKing.clone(true);
                  piece.userData.color = true;
                  piece.userData.type = 'k';
                  piece.position.set(i, 0.560, j);
                  break;
                case 'K':
                  piece = lightKing.clone(true);
                  piece.userData.color = false;
                  piece.userData.type = 'K';
                  piece.position.set(i, 0.560, j);
                  break;
                default:
                  break;
              }
              scene.add(piece);
            }
          }
        }

        selectedPiece.position.set(selectedPiece.position.x, selectedPiece.position.y-0.5, selectedPiece.position.z);
        selectedPiece = null;
      }
    } else {
      intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length > 0 && !mate) {

        selectedPiece = intersects[0].object;
        selectedPiece.position.set(selectedPiece.position.x, selectedPiece.position.y+0.5, selectedPiece.position.z);

        if (prActive) {

          if (selectedPiece != null && typeof selectedPiece.userData.promotion != 'undefined' && selectedPiece.userData.promotion) {
            selectedPiece.position.set(prPawn.position.x, selectedPiece.position.y - 1.548, prPawn.position.z);
            selectedPiece.material.opacity = 1;
            if (selectedPiece.userData.color) {
              selectedPiece.material.color.setHex(0x222222);
            } else {
              selectedPiece.material.color.setHex(0xAAAAAA);
            }
            selectedPiece.userData.promotion = false;
            selectedPiece.material.transparent = false;
            selectedPiece.material.needsUpdate = false;

            scene.add(selectedPiece);
            scene.remove(prPawn);
            scene.remove(pr);
            selectedPiece = null;
            pr = null;
            prActive = false;
          }
        } else {
          if (selectedPiece.userData.color !== orderColor) {
            selectedPiece.position.set(selectedPiece.position.x, selectedPiece.position.y-0.5, selectedPiece.position.z);
            selectedPiece = null;
          }
        }
      }
    }


  };

  const onWindowResize = (width, height) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  useEffect(() => {

    const width = mount.current.clientWidth; // window.innerWidth
    const height = mount.current.clientHeight;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const light = new THREE.PointLight(0xffffff, 2, 200);
    light.position.set(9, 10, 4.5);
    light.userData.type = 'light';
    scene.add(light);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 1);

    if (!wasmLoading) {
      document.getElementsByClassName('Board')[0].appendChild(renderer.domElement);
    }

    camera.position.y = 4;
    camera.position.z = 4;

    controls = new OrbitControls(camera, renderer.domElement);

    controls.target.set(4.5, 0, 4.5);

    controls.enablePan = true; // hareket için
    controls.maxPolarAngle = Math.PI / 2;

    controls.enableDamping = true;

    mouse = new Vector2();
    raycaster = new THREE.Raycaster();

    const square = new THREE.BoxGeometry(1, 0.1, 1);
    const lightSquare = new THREE.MeshBasicMaterial({ color: 0xB58763 }); // 0xE0C4AF
    const darkSquare = new THREE.MeshBasicMaterial({ color: 0xF0DAB5 }); // 0x6A4236

    board = new THREE.Group();

    const circleGeo = new THREE.CircleGeometry(0.25, 360);
    const circleMaterial = new THREE.MeshBasicMaterial({ color: 0x82976a });
    circle = new THREE.Mesh(circleGeo, circleMaterial);
    circle.rotation.set(Math.PI / 2, Math.PI, 0);

    for (let x = 0; x < 8; x++) {
      for (let z = 0; z < 8; z++) {
        let cube;
        if (z % 2 === 0) {
          cube = new THREE.Mesh(square, x % 2 === 0 ? darkSquare.clone(true) : lightSquare.clone(true));
        } else {
          cube = new THREE.Mesh(square, x % 2 === 0 ? lightSquare.clone(true) : darkSquare.clone(true));
        }
        cube.userData.name = String.fromCharCode(97 + 7 - x) + (z + 1); // notasyon için
        cube.position.set(x, -0.05, z);
        board.add(cube);
      }
    }

    const darkPiece = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const lightPiece = new THREE.MeshStandardMaterial({ color: 0xAAAAAA });

    const loader = new GLTFLoader();

    loader.load('../models/model.glb', function (gltf) {

      darkPawn = gltf.scene.children.find((piece) => piece.name === 'darkpawn');
      darkRook = gltf.scene.children.find((piece) => piece.name === 'darkrook');
      darkKnight = gltf.scene.children.find((piece) => piece.name === 'darkknight');
      darkBishop = gltf.scene.children.find((piece) => piece.name === 'darkbishop');
      darkQueen = gltf.scene.children.find((piece) => piece.name === 'darkqueen');
      darkKing = gltf.scene.children.find((piece) => piece.name === 'darkking');
      lightPawn = gltf.scene.children.find((piece) => piece.name === 'lightpawn');
      lightRook = gltf.scene.children.find((piece) => piece.name === 'lightrook');
      lightKnight = gltf.scene.children.find((piece) => piece.name === 'lightknight');
      lightBishop = gltf.scene.children.find((piece) => piece.name === 'lightbishop');
      lightQueen = gltf.scene.children.find((piece) => piece.name === 'lightqueen');
      lightKing = gltf.scene.children.find((piece) => piece.name === 'lightking');

      darkPawn.material = darkPiece;
      darkRook.material = darkPiece;
      darkKnight.material = darkPiece;
      darkBishop.material = darkPiece;
      darkQueen.material = darkPiece;
      darkKing.material = darkPiece;
      lightPawn.material = lightPiece;
      lightKnight.material = lightPiece;
      lightRook.material = lightPiece;
      lightBishop.material = lightPiece;
      lightQueen.material = lightPiece;
      lightKing.material = lightPiece;

      darkPawn.scale.set(darkPawn.scale.x * 0.5, darkPawn.scale.y * 0.5, darkPawn.scale.z * 0.5);
      darkRook.scale.set(darkRook.scale.x * 0.5, darkRook.scale.y * 0.5, darkRook.scale.z * 0.5);
      darkKnight.scale.set(darkKnight.scale.x * 0.5, darkKnight.scale.y * 0.5, darkKnight.scale.z * 0.5);
      darkBishop.scale.set(darkBishop.scale.x * 0.5, darkBishop.scale.y * 0.5, darkBishop.scale.z * 0.5);
      darkQueen.scale.set(darkQueen.scale.x * 0.5, darkQueen.scale.y * 0.5, darkQueen.scale.z * 0.5);
      darkKing.scale.set(darkKing.scale.x * 0.5, darkKing.scale.y * 0.5, darkKing.scale.z * 0.5);

      lightPawn.scale.set(lightPawn.scale.x * 0.5, lightPawn.scale.y * 0.5, lightPawn.scale.z * 0.5);
      lightRook.scale.set(lightRook.scale.x * 0.5, lightRook.scale.y * 0.5, lightRook.scale.z * 0.5);
      lightKnight.scale.set(lightKnight.scale.x * 0.5, lightKnight.scale.y * 0.5, lightKnight.scale.z * 0.5);
      lightBishop.scale.set(lightBishop.scale.x * 0.5, lightBishop.scale.y * 0.5, lightBishop.scale.z * 0.5);
      lightQueen.scale.set(lightQueen.scale.x * 0.5, lightQueen.scale.y * 0.5, lightQueen.scale.z * 0.5);
      lightKing.scale.set(lightKing.scale.x * 0.5, lightKing.scale.y * 0.5, lightKing.scale.z * 0.5);

      let dp, lp;
      for (let i = 0; i < 8; i++) {
        dp = darkPawn.clone(true);
        lp = lightPawn.clone(true);
        lp.position.set(i, 0.348, 1);
        lp.userData.color = false;
        lp.userData.type = 'P';
        dp.position.set(i, 0.348, 6);
        dp.userData.color = true;
        dp.userData.type = 'P';

        scene.add(dp);
        scene.add(lp);
      }

      const dLeftRock = darkRook.clone(true);
      const dRightRock = darkRook.clone(true);
      const dLeftKnight = darkKnight.clone(true);
      const dRightKnight = darkKnight.clone(true);
      const dLeftBishop = darkBishop.clone(true);
      const dRightBishop = darkBishop.clone(true);
      const dQueen = darkQueen.clone(true);
      const dKing = darkKing.clone(true);

      const lLeftRock = lightRook.clone(true);
      const lRightRock = lightRook.clone(true);
      const lLeftKnight = lightKnight.clone(true);
      const lRightKnight = lightKnight.clone(true);
      const lLeftBishop = lightBishop.clone(true);
      const lRightBishop = lightBishop.clone(true);
      const lQueen = lightQueen.clone(true);
      const lKing = lightKing.clone(true);

      dLeftRock.userData.color = true;
      dRightRock.userData.color = true;
      dLeftKnight.userData.color = true;
      dRightKnight.userData.color = true;
      dLeftBishop.userData.color = true;
      dRightBishop.userData.color = true;
      dQueen.userData.color = true;
      dKing.userData.color = true;

      dLeftRock.userData.type = 'R';
      dRightRock.userData.type = 'R';
      dLeftKnight.userData.type = 'N';
      dRightKnight.userData.type = 'N';
      dLeftBishop.userData.type = 'B';
      dRightBishop.userData.type = 'B';
      dQueen.userData.type = 'Q';
      dKing.userData.type = 'K';

      dLeftRock.userData.direction = true;
      dLeftRock.userData.didMove = false; // sadece rok için
      dRightRock.userData.direction = false;
      dRightRock.userData.didMove = false;

      lLeftRock.userData.color = false;
      lRightRock.userData.color = false;
      lLeftKnight.userData.color = false;
      lRightKnight.userData.color = false;
      lLeftBishop.userData.color = false;
      lRightBishop.userData.color = false;
      lQueen.userData.color = false;
      lKing.userData.color = false;
      lKing.userData.didMove = false;

      lLeftRock.userData.type = 'R';
      lRightRock.userData.type = 'R';
      lLeftKnight.userData.type = 'N';
      lRightKnight.userData.type = 'N';
      lLeftBishop.userData.type = 'B';
      lRightBishop.userData.type = 'B';
      lQueen.userData.type = 'Q';
      lKing.userData.type = 'K';

      dLeftRock.position.set(0, 0.4485, 7);
      dRightRock.position.set(7, 0.4485, 7);
      dLeftKnight.position.set(1, 0.398, 7);
      dRightKnight.position.set(6, 0.398, 7);
      dLeftBishop.position.set(2, 0.43015, 7);
      dRightBishop.position.set(5, 0.43015, 7);
      dQueen.position.set(4, 0.498, 7);
      dKing.position.set(3, 0.560, 7);

      lLeftRock.position.set(7, 0.4485, 0);
      lRightRock.position.set(0, 0.4485, 0);
      lLeftKnight.position.set(6, 0.398, 0);
      lRightKnight.position.set(1, 0.398, 0);
      lLeftBishop.position.set(5, 0.43015, 0);
      lRightBishop.position.set(2, 0.43015, 0);
      lQueen.position.set(4, 0.498, 0);
      lKing.position.set(3, 0.560, 0);

      scene.add(dLeftRock);
      scene.add(dRightRock);
      scene.add(dLeftKnight);
      scene.add(dRightKnight);
      scene.add(dLeftBishop);
      scene.add(dRightBishop);
      scene.add(dQueen);
      scene.add(dKing);

      scene.add(lLeftRock);
      scene.add(lRightRock);
      scene.add(lLeftKnight);
      scene.add(lRightKnight);
      scene.add(lLeftBishop);
      scene.add(lRightBishop);
      scene.add(lQueen);
      scene.add(lKing);

    }, undefined, function (error) {
      console.error(error);
    });

    scene.add(board);

    window.requestAnimationFrame(animate);
    window.addEventListener('resize', onWindowResize(width, height));
    window.addEventListener('click', onClick(width, height));

  }, []);

  if (wasmLoading) {
    return (
      <div ref={mount} >
        <p>Yapay zeka yukleniyor</p>
      </div>
    )
  }

  return (
    <div className="Board" ref={mount} />
  )
}

function animate() {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
}

/*
function promotion(pawn) {

  prPawn = pawn;

  let queen, rock, bishop, knight;

  if (pawn.userData.color) {
    queen = darkQueen.clone();
    rock = darkRook.clone();
    bishop = darkBishop.clone();
    knight = darkKnight.clone();

    const dark = new THREE.MeshStandardMaterial({ color: 0x222222 });
    queen.material = dark;
    rock.material = dark;
    bishop.material = dark;
    knight.material = dark;
  } else {
    queen = lightQueen.clone();
    rock = lightRook.clone();
    bishop = lightBishop.clone();
    knight = lightKnight.clone();

    const light = new THREE.MeshStandardMaterial({ color: 0xAAAAAA });

    queen.material = light;
    rock.material = light;
    bishop.material = light;
    knight.material = light;
  }

  queen.userData.color = pawn.userData.color;
  rock.userData.color = pawn.userData.color;
  bishop.userData.color = pawn.userData.color;
  knight.userData.color = pawn.userData.color;

  queen.userData.promotion = true;
  rock.userData.promotion = true;
  bishop.userData.promotion = true;
  knight.userData.promotion = true;

  queen.userData.type = 'Q';
  rock.userData.type = 'R';
  bishop.userData.type = 'B';
  knight.userData.type = 'N';

  rock.userData.direction = false;
  rock.userData.didMove = true;

  queen.material.needsUpdate = true;
  rock.material.needsUpdate = true;
  bishop.material.needsUpdate = true;
  knight.material.needsUpdate = true;

  queen.material.transparent = true;
  rock.material.transparent = true;
  bishop.material.transparent = true;
  knight.material.transparent = true;

  const opacity = 0.3
  queen.material.opacity = opacity;
  rock.material.opacity = opacity;
  bishop.material.opacity = opacity;
  knight.material.opacity = opacity;

  queen.position.set(pawn.position.x - 1.5, pawn.position.y + 1.698, pawn.position.z);
  rock.position.set(pawn.position.x - 0.5, pawn.position.y + 1.6485, pawn.position.z);
  bishop.position.set(pawn.position.x + 0.5, pawn.position.y + 1.63015, pawn.position.z);
  knight.position.set(pawn.position.x + 1.5, pawn.position.y + 1.598, pawn.position.z);

  pr = new THREE.Group();

  pr.add(queen);
  pr.add(rock);
  pr.add(bishop);
  pr.add(knight);

  scene.add(pr);
}*/

export default AiGame;