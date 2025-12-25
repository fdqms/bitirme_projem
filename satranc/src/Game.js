import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as THREE from 'three';
import { Vector2 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { doMove } from './store/actions/notationAction';
import { api, stream } from './Api';

import './Game.css';


let scene, camera, renderer, controls, board, mouse, raycaster, selectedPiece = null, circle;
let enPassant = false;
let blackEnPassant, whiteEnPassant;
let orderColor = false, mate = false;
let checkPieces = [];

let darkQueen, darkRook, darkBishop, darkKnight, lightQueen, lightRook, lightBishop, lightKnight;

let pr, prPawn, prActive = false;

const Game = ({ gameId, myColor, setParentOrder, setWhiteTime, setBlackTime }) => {

  const mount = useRef();

  const dispatch = useDispatch();

  const onClick = (width, height) => event => {

    const rect = event.target.getBoundingClientRect(); // scroll ettiğimizde nesnelere yine tıklanılabilmesi için

    mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
    mouse.y = - ((event.clientY - rect.top) / height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    let intersects;

    if (selectedPiece != null && gameId !== 0) {
      intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length === 0) {
        intersects = raycaster.intersectObjects(board.children);
      }
      if (intersects.length > 0) {

        const targetSquare = intersects[0].object;

        if (myColor === orderColor) {
          const checkMove = move(targetSquare);

          if (checkMove) {

            let notationFrom, notationTo;

            const targetPiece = scene.children.find((piece) => piece.position.x === targetSquare.position.x && piece.position.z === targetSquare.position.z && typeof piece.userData.type !== 'undefined');

            if (targetPiece == null) {
              if (selectedPiece.userData.type === 'P') {
                notationFrom = '';
              } else {
                notationFrom = selectedPiece.userData.type;
              }
              notationTo = board.children.find(square => targetSquare.position.x === square.position.x && targetSquare.position.z === square.position.z).userData.name;
            } else {
              if (selectedPiece.userData.type === 'P') {
                notationFrom = board.children.find(square => selectedPiece.position.x === square.position.x && selectedPiece.position.z === square.position.z).userData.name;
              } else {
                notationFrom = selectedPiece.userData.type;
              }
              notationTo = 'x' + board.children.find(square => targetPiece.position.x === square.position.x && targetPiece.position.z === square.position.z).userData.name;
            }


            const oldX = selectedPiece.position.x;
            const oldZ = selectedPiece.position.z;

            if (targetPiece == null) {
              const a = selectedPiece.position.z;

              const difKing = selectedPiece.position.x - targetSquare.position.x;

              selectedPiece.position.set(targetSquare.position.x, selectedPiece.position.y, targetSquare.position.z);
              if (check(false)) {
                selectedPiece.position.set(oldX, selectedPiece.position.y, oldZ);
              } else {
                if (selectedPiece.userData.type === 'P') {
                  if (selectedPiece.userData.color && selectedPiece.position.z === 0) {
                    promotion(selectedPiece);
                    prActive = true;
                  } else if (!selectedPiece.userData.color && selectedPiece.position.z === 7) {
                    promotion(selectedPiece);
                    prActive = true;
                  }
                }
                if (orderColor) {
                  dispatch(doMove({ black: notationFrom + notationTo }));
                } else {
                  dispatch(doMove({ white: notationFrom + notationTo }));
                }

                if (selectedPiece.userData.type === 'K' || selectedPiece.userData.type === 'R') {
                  selectedPiece.userData.didMove = true;
                }


                api.move(oldX, oldZ, targetSquare.position.x, targetSquare.position.z, gameId).then(val => {
                  console.log(val.getBRemTime());
                  if (val.getSuccessful()) {
                    orderColor = !orderColor;
                    setParentOrder(orderColor);
                    setBlackTime(parseInt(val.getBRemTime()));
                    setWhiteTime(parseInt(val.getWRemTime()));
                  }
                });


              }

              if (selectedPiece.position.z === (a - 2) && selectedPiece.userData.name === 'darkpawn') {
                blackEnPassant = selectedPiece;
              } else if (selectedPiece.position.z === (a + 2) && selectedPiece.userData.name === 'lightpawn') {
                whiteEnPassant = selectedPiece;
              } else {
                if (selectedPiece.userData.type === 'K') {
                  if (difKing === 2) {
                    const tmpRok = scene.children.find(piece => {
                      const a = piece.position.x === 0;
                      const b = selectedPiece.position.z === piece.position.z;
                      const c = piece.userData.type === 'R';
                      return a && b && c;
                    });
                    tmpRok.position.set(2, tmpRok.position.y, tmpRok.position.z);
                  } else if (difKing === -2) {
                    const tmpRok = scene.children.find(piece => {
                      const a = piece.position.x === 7;
                      const b = selectedPiece.position.z === piece.position.z;
                      const c = piece.userData.type === 'R';
                      return a && b && c;
                    });
                    tmpRok.position.set(4, tmpRok.position.y, tmpRok.position.z);
                  }
                }
                blackEnPassant = null;
                whiteEnPassant = null;
              }
              if (enPassant) {
                const epPiece = scene.children.find((piece) => {
                  const a = piece.position.x === targetSquare.position.x && piece.position.z === (targetSquare.position.z - 1) && selectedPiece.userData.color === false;
                  const b = piece.position.x === targetSquare.position.x && piece.position.z === (targetSquare.position.z + 1) && selectedPiece.userData.color === true;
                  const c = selectedPiece.userData.color !== piece.userData.color;
                  const d = typeof piece.userData.type !== 'undefined'; // siyah çift oynadığı vakit tahtanın konumu 0,0 olduğu için kaleyi hareket ettirdiğinde tahtayı siliyor
                  return (a || b) && c && d;
                });
                scene.remove(epPiece);
              }
              enPassant = false;
            } else {
              if (targetPiece.userData.color !== selectedPiece.userData.color) {
                selectedPiece.position.set(targetSquare.position.x, selectedPiece.position.y, targetSquare.position.z);
                scene.remove(targetPiece);
                if (check(false)) {
                  selectedPiece.position.set(oldX, selectedPiece.position.y, oldZ);
                  scene.add(targetPiece);
                } else {
                  if (selectedPiece.userData.type === 'P') {
                    if (selectedPiece.userData.color && selectedPiece.position.z === 0) {
                      promotion(selectedPiece);
                      prActive = true;
                    } else if (!selectedPiece.userData.color && selectedPiece.position.z === 7) {
                      promotion(selectedPiece);
                      prActive = true;
                    }
                  }
                  if (orderColor) {
                    dispatch(doMove({ black: notationFrom + notationTo }));
                  } else {
                    dispatch(doMove({ white: notationFrom + notationTo }));
                  }
                  if (selectedPiece.userData.type === 'K' || selectedPiece.userData.type === 'R') {
                    selectedPiece.userData.didMove = true;
                  }

                  api.move(oldX, oldZ, targetSquare.position.x, targetSquare.position.z, gameId).then(val => {
                    console.log(val);
                    if (val.getSuccessful()) {
                      orderColor = !orderColor;
                      setParentOrder(orderColor);
                      setBlackTime(parseInt(val.getBRemTime()));
                      setWhiteTime(parseInt(val.getWRemTime()));
                    }
                  });
                }
              }
            }

            checkMate();
          }
          resetColor();

          selectedPiece = null;
        }
      }
    } else {
      intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length > 0 && !mate) {

        selectedPiece = intersects[0].object;

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

            let pieceType;
            switch (selectedPiece.userData.type.toLowerCase()) {
              case 'n':
                pieceType = 2;
                break;
              case 'b':
                pieceType = 3;
                break;
              case 'r':
                pieceType = 4;
                break;
              case 'q':
                pieceType = 5;
                break;
              default:
                return;
            }
            
            api.promotion(prPawn.position.x, prPawn.position.z, pieceType, gameId);

            scene.add(selectedPiece);
            scene.remove(prPawn);
            scene.remove(pr);
            selectedPiece = null;
            pr = null;
            prActive = false;
            // taş dönüşümü sunucuya eklenecek
          }
        } else {
          if (selectedPiece.userData.color === orderColor && myColor === orderColor) {
            color();
          } else {
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

    document.getElementsByClassName('Board')[0].appendChild(renderer.domElement);

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

      const darkPawn = gltf.scene.children.find((piece) => piece.name === 'darkpawn');
      darkRook = gltf.scene.children.find((piece) => piece.name === 'darkrook');
      darkKnight = gltf.scene.children.find((piece) => piece.name === 'darkknight');
      darkBishop = gltf.scene.children.find((piece) => piece.name === 'darkbishop');
      darkQueen = gltf.scene.children.find((piece) => piece.name === 'darkqueen');
      const darkKing = gltf.scene.children.find((piece) => piece.name === 'darkking');
      const lightPawn = gltf.scene.children.find((piece) => piece.name === 'lightpawn');
      lightRook = gltf.scene.children.find((piece) => piece.name === 'lightrook');
      lightKnight = gltf.scene.children.find((piece) => piece.name === 'lightknight');
      lightBishop = gltf.scene.children.find((piece) => piece.name === 'lightbishop');
      lightQueen = gltf.scene.children.find((piece) => piece.name === 'lightqueen');
      const lightKing = gltf.scene.children.find((piece) => piece.name === 'lightking');

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

      lLeftRock.userData.direction = false;
      lLeftRock.userData.didMove = false;
      lRightRock.userData.direction = true;
      lRightRock.userData.didMove = false;

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


    stream.on('data', (data) => {

      if (gameId === data.getGameId()) {

        let piece;

        console.log(data.getPieceType());

        if (data.getPieceType() > 0) {
          switch (data.getPieceType()) {
            case 2:
              piece = darkKnight.clone();
              piece.userData.type = 'N';
              break;
            case 3:
              piece = darkBishop.clone();
              piece.userData.type = 'B';
              break;
            case 4:
              piece = darkRook.clone();
              piece.userData.type = 'R';
              break;
            case 5:
              piece = darkQueen.clone();
              piece.userData.type = 'Q';
              break;
            default:
              return;
          }
          if (data.getY() === 0) {
            piece.material = new THREE.MeshStandardMaterial({ color: 0x222222 });
          } else {
            piece.material = new THREE.MeshStandardMaterial({ color: 0xAAAAAA });
          }

          const pawn = scene.children.find(p => p.position.x === data.getX() && p.position.z === data.getY() && typeof p.userData.type != 'undefined');
          piece.userData.color = pawn.userData.color;
          piece.userData.promotion = false;
          piece.material.needsUpdate = false;
          piece.position.set(data.getX(), pawn.position.y, data.getY())
          scene.remove(pawn);
          scene.add(piece);
        } else {
          const selectedPiece = scene.children.find(piece => piece.position.x === data.getX() && piece.position.z === data.getY());
          const targetPiece = scene.children.find(piece => piece.position.x === data.getX2() && piece.position.z === data.getY2());

          let notationFrom, notationTo;

          if (targetPiece == null) {
            if (selectedPiece.userData.type === 'P') {
              notationFrom = '';
            } else {
              notationFrom = selectedPiece.userData.type;
            }
            notationTo = board.children.find(square => data.getX2() === square.position.x && data.getY2() === square.position.z).userData.name;
          } else {
            if (selectedPiece.userData.type === 'P') {
              notationFrom = board.children.find(square => selectedPiece.position.x === square.position.x && selectedPiece.position.z === square.position.z).userData.name;
            } else {
              notationFrom = selectedPiece.userData.type;
            }
            notationTo = 'x' + board.children.find(square => targetPiece.position.x === square.position.x && targetPiece.position.z === square.position.z).userData.name;
          }

          if (orderColor) {
            dispatch(doMove({ black: notationFrom + notationTo }));
          } else {
            dispatch(doMove({ white: notationFrom + notationTo }));
          }

          if (targetPiece != null) {
            scene.remove(targetPiece);
          }

          if (selectedPiece != null) {
            selectedPiece.position.set(data.getX2(), selectedPiece.position.y, data.getY2());

            orderColor = !orderColor;
            setParentOrder(orderColor);
          }

          setBlackTime(parseInt(data.getBRemTime()));
          setWhiteTime(parseInt(data.getWRemTime()));
        }


      }
    });

  }, []);

  return (
    <div className="Board" ref={mount} />
  )
}

function animate() {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
}

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
}

function movablePawn(from, to) {

  let a, c, d, e;

  if (from.userData.color === false) {
    const tmpPieces = scene.children.filter(piece => {
      const a = piece.userData.color !== from.userData.color;
      const b = Math.abs(piece.position.x - from.position.x) === 1;
      const c = piece.userData.color === true;
      const d = (piece.position.z - 1) === from.position.z;
      return a && b && c && d;
    });

    const tmpPiece = scene.children.find(piece => {
      return piece.position.x === from.position.x && piece.position.z === (from.position.z + 1) && typeof piece.userData.type !== 'undefined';
    });

    a = false;

    if (to.position.z === 3 && from.position.z === 1) {

      const doubleJump = scene.children.find(piece => {
        return piece.position.x === from.position.x && piece.position.z === (from.position.z + 2);
      });

      if (!doubleJump) {
        a = to.position.x === from.position.x;
      }
    }

    c = false;
    d = to.position.z === (from.position.z + 1) && to.position.x === from.position.x;

    if (tmpPiece) {
      a = false;
      d = false;
    }

    for (let i = 0; i < tmpPieces.length; i++) {
      if (tmpPieces[i].position.z === to.position.z && tmpPieces[i].position.x === to.position.x) {
        return true;
      }
    }

    e = false;

    if (blackEnPassant) {
      e = blackEnPassant.position.z === from.position.z && Math.abs(from.position.x - blackEnPassant.position.x) === 1;
      e &= to.position.x === blackEnPassant.position.x && to.position.z === 5;
      enPassant = true;
    }

  } else if (from.userData.color === true) {
    const tmpPieces = scene.children.filter(piece => {
      const a = piece.userData.color !== from.userData.color;
      const b = Math.abs(piece.position.x - from.position.x) === 1;
      const c = piece.userData.color === false;
      const d = (piece.position.z + 1) === from.position.z;
      return a && b && c && d;
    });

    const tmpPiece = scene.children.find(piece => {
      return piece.position.x === from.position.x && piece.position.z === (from.position.z - 1) && typeof piece.userData.type != 'undefined';
    });

    a = false;

    if (from.position.z === 6 && to.position.z === 4) {

      const doubleJump = scene.children.find(piece => {
        return piece.position.x === from.position.x && piece.position.z === (from.position.z - 2);
      });

      if (!doubleJump) {
        a = to.position.x === from.position.x;
      }

    }

    c = false;
    d = to.position.z === (from.position.z - 1) && to.position.x === from.position.x;

    if (tmpPiece) {
      a = false;
      d = false;
    }

    for (let i = 0; i < tmpPieces.length; i++) {
      if (tmpPieces[i].position.z === to.position.z && tmpPieces[i].position.x === to.position.x) {
        return true;
      }
    }

    e = false;

    if (whiteEnPassant) {
      e = whiteEnPassant.position.z === from.position.z && Math.abs(from.position.x - whiteEnPassant.position.x) === 1;
      e &= to.position.x === whiteEnPassant.position.x && to.position.z === 2;
      enPassant = true;
    }

  }
  return a || c || d || e;
}

function movableKnight(from, to) {

  const a = (from.position.z === to.position.z + 2) && (from.position.x === to.position.x + 1);
  const b = (from.position.z === to.position.z + 2) && (from.position.x === to.position.x - 1);
  const c = (from.position.z === to.position.z + 1) && (from.position.x === to.position.x + 2);
  const d = (from.position.z === to.position.z - 1) && (from.position.x === to.position.x + 2);
  const e = (from.position.z === to.position.z - 2) && (from.position.x === to.position.x + 1);
  const f = (from.position.z === to.position.z - 2) && (from.position.x === to.position.x - 1);
  const g = (from.position.z === to.position.z + 1) && (from.position.x === to.position.x - 2);
  const h = (from.position.z === to.position.z - 1) && (from.position.x === to.position.x - 2);
  const i = (from.position.z === to.position.z) && (from.position.x === to.position.x);

  const tmpPieces = scene.children.filter(piece => {

    const a = (from.position.z === piece.position.z + 2) && (from.position.x === piece.position.x + 1);
    const b = (from.position.z === piece.position.z + 2) && (from.position.x === piece.position.x - 1);
    const c = (from.position.z === piece.position.z + 1) && (from.position.x === piece.position.x + 2);
    const d = (from.position.z === piece.position.z - 1) && (from.position.x === piece.position.x + 2);
    const e = (from.position.z === piece.position.z - 2) && (from.position.x === piece.position.x + 1);
    const f = (from.position.z === piece.position.z - 2) && (from.position.x === piece.position.x - 1);
    const g = (from.position.z === piece.position.z + 1) && (from.position.x === piece.position.x - 2);
    const h = (from.position.z === piece.position.z - 1) && (from.position.x === piece.position.x - 2);
    const i = from.userData.color === piece.userData.color;

    return (a || b || c || d || e || f || g || h) && i;
  });

  let j = false;

  for (let i = 0; i < tmpPieces.length; i++) {
    if (tmpPieces[i].position.z === to.position.z && tmpPieces[i].position.x === to.position.x) {
      j = true;
      break;
    }
  }

  return (a || b || c || d || e || f || g || h) ^ (j || i);
}

function movableBishop(from, to) {
  const tmpPiece = scene.children.find((piece) => {
    const x = (piece.position.z - piece.position.x) === (from.position.z - from.position.x);
    const y = (piece.position.z + piece.position.x) === (from.position.x + from.position.z);

    const a = (from.position.z > piece.position.z && from.position.x > piece.position.x) && (piece.position.z > to.position.z && to.position.x < piece.position.x);
    const b = (from.position.z < piece.position.z && from.position.x < piece.position.x) && (to.position.z > piece.position.z && to.position.x > piece.position.x);
    const c = (from.position.z < piece.position.z && from.position.x > piece.position.x) && (to.position.z > piece.position.z && to.position.x < piece.position.x);
    const d = (from.position.z > piece.position.z && from.position.x < piece.position.x) && (to.position.z < piece.position.z && to.position.x > piece.position.x);;
    const e = to.position.x === piece.position.x && to.position.z === piece.position.z && from.userData.color === piece.userData.color;
    const f = typeof piece.userData.type !== 'undefined'; // tahtanın konumu 0, 0 olduğundan yemesini engellemek için
    return f && ((x && (a || b)) || (y && (c || d)) || e);
  });

  if (tmpPiece) {
    return false;
  }

  const a = (to.position.z - to.position.x) === (from.position.z - from.position.x);
  const b = (to.position.z + to.position.x) === (from.position.z + from.position.x);
  const c = (from.position.x === to.position.x && from.position.z === to.position.z);
  return (a || b) ^ c;
}

function movableRook(from, to) {
  const tmpPiece = scene.children.find((piece) => {
    const a = (to.position.z === piece.position.z) && (to.position.x > piece.position.x && piece.position.x > from.position.x);
    const b = (to.position.z === piece.position.z) && (to.position.x < piece.position.x && piece.position.x < from.position.x);
    const c = (to.position.x === piece.position.x) && (to.position.z > piece.position.z && piece.position.z > from.position.z);
    const d = (to.position.x === piece.position.x) && (to.position.z < piece.position.z && piece.position.z < from.position.z);
    const e = to.position.x === piece.position.x && to.position.z === piece.position.z && from.userData.color === piece.userData.color;
    const f = typeof piece.userData.type !== 'undefined';
    return (a || b || c || d || e) && f;
  });

  if (tmpPiece) {
    return false;
  }

  const a = (to.position.z === from.position.z) || (to.position.x === from.position.x);
  const b = (to.position.x === from.position.x) && (to.position.z === from.position.z);

  return a ^ b;
}

function checkRok(sp) {
  return !scene.children.some(piece => {
    if (piece.userData.color !== sp.userData.color) {
      let a;
      switch (piece.userData.type) {
        case 'P':
          a = movablePawn(piece, sp);
          break;
        case 'N':
          a = movableKnight(piece, sp);
          break;
        case 'B':
          a = movableBishop(piece, sp);
          break;
        case 'R':
          a = movableRook(piece, sp);
          break;
        case 'Q':
          a = movableBishop(piece, sp) || movableRook(piece, sp);
          break;
        default:
      }
      return a;
    } else {
      return false;
    }
  });
}

function movableKing(sp, square) {

  const a = Math.abs(square.position.z - sp.position.z) <= 1 && Math.abs(square.position.x - sp.position.x) <= 1;
  const c = square.position.z === sp.position.z;
  let b = c && square.position.x === sp.position.x;

  const tmpPieces = scene.children.filter(piece => {
    const a = piece.position.z === square.position.z && piece.position.x === square.position.x;
    const b = Math.abs(piece.position.x - sp.position.x) <= 1 && Math.abs(piece.position.z - sp.position.z) <= 1;
    const c = piece.userData.color === sp.userData.color;
    return (a && b && c);
  });

  for (let i = 0; i < tmpPieces.length; i++) {
    if (tmpPieces[i].position.z === square.position.z && tmpPieces[i].position.x === square.position.x) {
      b |= true;
      break;
    }
  }

  const d = c && !sp.userData.didMove;
  let f = false;

  if (d && !check(false)) {
    const rbp = scene.children.find(piece => {
      const a = piece.position.z === sp.position.z;
      const b = piece.position.x > 0 && piece.position.x < sp.position.x;
      return a && b;
    });

    const rok1 = scene.children.find(piece => {
      const a = piece.userData.didMove === false;
      const b = piece.userData.direction === true && piece.position.x === 0;
      const c = piece.userData.type === 'R';
      const d = piece.userData.color === sp.userData.color;

      return a && b && c && d;
    });

    sp.position.set(1, sp.position.y, sp.position.z);

    const cr = checkRok(sp);

    if (!rbp && rok1 && cr) {
      f = (square.position.x === 1);
    }

    const rbp2 = scene.children.find(piece => {
      const a = piece.position.z === sp.position.z;
      const b = piece.position.x < 7 && piece.position.x > sp.position.x;
      return a && b;
    });

    const rok2 = scene.children.find(piece => {
      const a = piece.userData.didMove === false;
      const b = piece.userData.direction === false && piece.position.x === 7;
      const c = piece.userData.type === 'R';
      const d = piece.userData.color === sp.userData.color;

      return a && b && c && d;
    });

    sp.position.set(5, sp.position.y, sp.position.z);

    const cr2 = checkRok(sp);

    if (!rbp2 && rok2 && cr2) {
      f = (square.position.x === 5);
    }

    sp.position.set(3, sp.position.y, sp.position.z);
  }

  const x = sp.position.x;
  const z = sp.position.z;

  if (f) {
    return true;
  }

  if (a ^ b) {
    const piece = scene.children.find(piece => square.position.x === piece.position.x && square.position.z === piece.position.z && typeof piece.userData.type != 'undefined');
    if (piece) {
      sp.position.set(square.position.x, sp.position.y, square.position.z);
      scene.remove(piece);
      if (check(false)) {
        scene.add(piece);
        sp.position.set(x, sp.position.y, z);
        return false;
      } else {
        scene.add(piece);
        sp.position.set(x, sp.position.y, z);
        return true;
      }
    } else {
      sp.position.set(square.position.x, sp.position.y, square.position.z);
      if (check(false)) {
        sp.position.set(x, sp.position.y, z);
        return false;
      } else {
        sp.position.set(x, sp.position.y, z);
        return true;
      }
    }
  }

  return false;
}

function movableCheckKing() {

  const king = scene.children.find(piece => piece.userData.color === orderColor && piece.userData.type === 'K');

  return board.children.some(square => square.geometry.type === "BoxGeometry" && movableKing(king, square));
}

function addCheckPiece(x, y, z, color) {
  let tmpObject = new THREE.Object3D();
  tmpObject.position.set(x, y, z);
  tmpObject.userData.color = color; // color
  checkPieces.push(tmpObject);
}

function check(willAdd) {

  const king = scene.children.find(piece => piece.userData.color === orderColor && piece.userData.type === 'K')

  const c = scene.children.filter(piece => {

    let a = false;

    if (piece.userData.color !== orderColor && typeof piece.userData.type != 'undefined') {
      switch (piece.userData.type) {
        case 'P':
          a = movablePawn(piece, king);
          break;
        case 'N':
          a = movableKnight(piece, king);
          break;
        case 'R':
          a = movableRook(piece, king);
          break;
        case 'B':
          a = movableBishop(piece, king);
          break;
        case 'Q':
          a = movableBishop(piece, king) || movableRook(piece, king);
          break;
        default:
          a = false;
      }
    }
    return a;
  });

  if (c.length === 0) {
    return false;
  } else {
    if (willAdd) {
      checkPieces = [];
      c.forEach(piece => {
        switch (piece.userData.type) {
          case 'N':
            addCheckPiece(piece.position.x, piece.position.y, piece.position.z, piece.userData.color);
            break;
          case 'R':
            if (piece.position.x === king.position.x) {
              if (piece.position.z > king.position.z) {
                for (let i = piece.position.z; i > king.position.z; i--) {
                  addCheckPiece(piece.position.x, 0, i, piece.userData.color);
                }
              } else if (piece.position.z < king.position.z) {
                for (let i = piece.position.z; i < king.position.z; i++) {
                  addCheckPiece(piece.position.x, 0, i, piece.userData.color);
                }
              }
            } else if (piece.position.z === king.position.z) {
              if (piece.position.x > king.position.x) {
                for (let i = piece.position.x; i > king.position.x; i--) {
                  addCheckPiece(i, 0, piece.position.z, piece.userData.color);
                }
              } else if (piece.position.x < king.position.x) {
                for (let i = piece.position.x; i < king.position.x; i++) {
                  addCheckPiece(i, 0, piece.position.z, piece.userData.color);
                }
              }
            }
            break;
          case 'B':
            if (king.position.z - king.position.x === piece.position.z - piece.position.x) {
              if (king.position.z < piece.position.z) {
                for (let i = piece.position.z; i > king.position.z; i--) {
                  addCheckPiece(piece.position.x + i - piece.position.z, 0, i, piece.userData.color);
                }
              } else {
                for (let i = piece.position.z; i < king.position.z; i++) {
                  addCheckPiece(piece.position.x + i - piece.position.z, 0, i, piece.userData.color);
                }
              }
            } else if (king.position.z + king.position.x === piece.position.z + piece.position.x) {
              if (king.position.z < piece.position.z) {
                for (let i = piece.position.z; i > king.position.z; i--) {
                  addCheckPiece(piece.position.x + piece.position.z - i, 0, i, piece.userData.color);
                }
              } else {
                for (let i = piece.position.z; i < king.position.z; i++) {
                  addCheckPiece(piece.position.x + piece.position.z - i, 0, i, piece.userData.color);
                }
              }
            }
            break;
          case 'Q':
            if (king.position.z - king.position.x === piece.position.z - piece.position.x) {
              if (king.position.z < piece.position.z) {
                for (let i = piece.position.z; i > king.position.z; i--) {
                  addCheckPiece(piece.position.x + i - piece.position.z, 0, i, piece.userData.color);
                }
              } else {
                for (let i = piece.position.z; i < king.position.z; i++) {
                  addCheckPiece(piece.position.x + i - piece.position.z, 0, i, piece.userData.color);
                }
              }
            } else if (king.position.z + king.position.x === piece.position.z + piece.position.x) {
              if (king.position.z < piece.position.z) {
                for (let i = piece.position.z; i > king.position.z; i--) {
                  addCheckPiece(piece.position.x + piece.position.z - i, 0, i, piece.userData.color);
                }
              } else {
                for (let i = piece.position.z; i < king.position.z; i++) {
                  addCheckPiece(piece.position.x + piece.position.z - i, 0, i, piece.userData.color);
                }
              }
            } else {
              if (king.position.z === piece.position.z) {
                if (king.position.x > piece.position.x) {
                  for (let i = piece.position.x; i < king.position.x; i++) {
                    addCheckPiece(i, 0, piece.position.z);
                  }
                } else if (king.position.x < piece.position.x) {
                  for (let i = piece.position.x; i > king.position.x; i--) {
                    addCheckPiece(i, 0, piece.position.z);
                  }
                }
              } else if (king.position.x === piece.position.x) {
                if (king.position.z > piece.position.z) {
                  for (let i = piece.position.z; i < king.position.z; i++) {
                    addCheckPiece(piece.position.x, 0, i);
                  }
                } else if (king.position.z < piece.position.z) {
                  for (let i = piece.position.z; i > king.position.z; i--) {
                    addCheckPiece(piece.position.x, 0, i);
                  }
                }
              }
            }
            break;
          case 'P':
            addCheckPiece(piece.position.x, 0, piece.position.z, piece.userData.color);
            break;
          default:
            console.log('check err');
            break;
        }
      }
      );
    }
    return true;
  }
}

function doubleCheck(piece, checkPiece) {
  const targetPiece = scene.children.find((p) => p.position.x === checkPiece.position.x && p.position.z === checkPiece.position.z && typeof p.userData.type !== 'undefined');
  const x = piece.position.x;
  const z = piece.position.z;
  piece.position.set(checkPiece.position.x, piece.position.y, checkPiece.position.z);
  if (targetPiece == null) {
    if (check(false)) {
      piece.position.set(x, piece.position.y, z);
    } else {
      piece.position.set(x, piece.position.y, z);
      return true;
    }
  } else {
    scene.remove(targetPiece);
    if (check(false)) {
      piece.position.set(x, piece.position.y, z);
      scene.add(targetPiece);
    } else {
      piece.position.set(x, piece.position.y, z);
      scene.add(targetPiece);
      return true;
    }
  }
  return false;
}

function checkMate() {
  if (check(true)) {
    const notMate = scene.children.some(piece => {
      if (piece.userData.color !== checkPieces[0].userData.color) {
        let b = false;
        switch (piece.userData.type) {
          case 'P':
            b = checkPieces.some(checkPiece => {
              const a = movablePawn(piece, checkPiece);
              if (a) {
                return doubleCheck(piece, checkPiece);
              }
              return false;
            });
            if (b) {
              return true;
            }
            break;
          case 'N':
            b = checkPieces.some(checkPiece => {
              const a = movableKnight(piece, checkPiece);
              if (a) {
                return doubleCheck(piece, checkPiece);
              }
              return false;
            });
            if (b) {
              return true;
            }
            break;
          case 'B':
            b = checkPieces.some(checkPiece => {
              const a = movableBishop(piece, checkPiece);
              const b = doubleCheck(piece, checkPiece);
              return a && b;
            });
            break;
          case 'R':
            b = checkPieces.some(checkPiece => {
              const a = movableRook(piece, checkPiece);
              if (a) {
                return doubleCheck(piece, checkPiece);
              }
              return false;
            });
            break;
          case 'Q':
            b = checkPieces.some(checkPiece => {
              let b = movableBishop(piece, checkPiece) || movableRook(piece, checkPiece);
              if (b) {
                return doubleCheck(piece, checkPiece);
              }
              return false;
            });
            break;
          case 'K':
            b = movableCheckKing();

            break;
          default:
            return false;
        }
        return b;
      }
      return false;
    });
    if (!notMate) {
      alert('mat');
      mate = true;
    }
  }
}

function resetColor() {
  board.children = board.children.filter(child => child.geometry.type !== "CircleGeometry");
}

function color() {

  let msq;

  switch (selectedPiece.userData.type) {
    case 'P':
      msq = board.children.filter(square => movablePawn(selectedPiece, square));
      break;
    case 'N':
      msq = board.children.filter(square => movableKnight(selectedPiece, square));
      break;
    case 'B':
      msq = board.children.filter(square => movableBishop(selectedPiece, square));
      break;
    case 'R':
      msq = board.children.filter(square => movableRook(selectedPiece, square));
      break;
    case 'Q':
      msq = board.children.filter(square => movableBishop(selectedPiece, square) || movableRook(selectedPiece, square));
      break;
    case 'K':
      msq = board.children.filter(square => movableKing(selectedPiece, square));
      break;
    default:
      msq = [];
  }

  if (check(true)) { // check(false)
    if (selectedPiece.userData.type === 'K') {
      msq = msq.filter(square => checkPieces.every(piece => !(piece.position.x === square.position.x && piece.position.z === square.position.z)));
    } else {
      msq = msq.filter(square => checkPieces.some(piece => piece.position.x === square.position.x && piece.position.z === square.position.z));
    }
  }

  /*
  if (msq.length === 0) {
    selectedPiece = null;
  }
  */

  for (let i = 0; i < msq.length; i++) {
    let c = circle.clone(true);
    c.position.set(msq[i].position.x, 0.01, msq[i].position.z);
    board.add(c);
  }
}

function move(square) {

  if (!(selectedPiece.position.x === square.position.x && selectedPiece.position.z === square.position.z)) {
    let a = false;

    switch (selectedPiece.userData.type) {
      case 'P':
        a = movablePawn(selectedPiece, square);
        break;
      case 'N':
        a = movableKnight(selectedPiece, square);
        break;
      case 'B':
        a = movableBishop(selectedPiece, square);
        break;
      case 'R':
        a = movableRook(selectedPiece, square);
        break;
      case 'Q':
        a = movableBishop(selectedPiece, square) || movableRook(selectedPiece, square);
        break;
      case 'K':
        a = movableKing(selectedPiece, square);
        break;
      default:
        return false;
    }

    let b = false;

    if (check(true)) {
      if (selectedPiece.userData.type === 'K') {
        b = true;
      } else {
        checkPieces.forEach(piece => {
          if (piece.position.x === square.position.x && piece.position.z === square.position.z) {
            b = true;
          }
        });
      }
    } else {
      b = true;
    }

    return a && b;
  }

  return false;
}

export default Game;