import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

document.addEventListener('DOMContentLoaded', Start);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
var renderer = new THREE.WebGLRenderer();

// Objeto importado
var importedObject = new THREE.Group();

// Controlador de animações
var animationMixer;

// Relógio da aplicação
var clock = new THREE.Clock();

// Importador de ficheiros FBX
var loader = new FBXLoader();

// Função para importar objetos FBX
loader.load('./Objetos/Samba Dancing.fbx', object => {
    // Inicializar o mixer
    animationMixer = new THREE.AnimationMixer(object);

    // object.animations é um array com todas as suas animações
    // Criar ação de animação, tendo em conta a animação pretendida
    var action = animationMixer.clipAction(object.animations[0]);
    action.play();

    // object.traverse é uma função que percorre todos os seus filhos
    // O 1.º e único parâmetro é uma função que será chamada para cada filho
    object.traverse(child => {
        if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    // Adicionar o objeto à cena
    scene.add(object);

    // Ajustar a escala do objeto, dada a sua dimensão
    object.scale.x = 0.01;
    object.scale.y = 0.01;
    object.scale.z = 0.01;
    // Mudar a sua posição, para não se sobrepor ao cubo
    object.position.x = 3;

    // Guardar o objeto
    importedObject = object;
})

renderer.setSize(window.innerWidth - 15, window.innerHeight - 15);

document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshStandardMaterial({ color: 'orange' });
var cube = new THREE.Mesh(geometry, material);

var cubeCoordRotation;
var cameraWalk = { x: 0, y: 0, z: 0 };
var cameraSpeed = 0.05;
// Desafio 1 - Dançarino
var dancerWalk = { x: 0, y: 0, z: 0 };
var dancerSpeed = 0.1;
// Desafio 1 - Boneco de neve
var snowman = new THREE.Group();

document.addEventListener('mousemove', ev => {
    var x = ev.clientX / window.innerWidth * 2 - 1;
    var y = ev.clientY / window.innerHeight * 2 - 1;
    cubeCoordRotation = {
        x: x,
        y: y
    };
});

document.addEventListener('keydown', ev => {
    var coords = {
        x: 0,
        y: 0,
        z: 0,
    };
    if (ev.key == 'w')
        // coords.z -= cameraSpeed;
        coords.z -= dancerSpeed;
    if (ev.key == 'a')
        // coords.x -= cameraSpeed;
        coords.x -= dancerSpeed;
    if (ev.key == 's')
        // coords.z += cameraSpeed;
        coords.z += dancerSpeed;
    if (ev.key == 'd')
        // coords.x += cameraSpeed;
        coords.x += dancerSpeed;
    // cameraWalk = coords;
    dancerWalk = coords;
});

document.addEventListener('keyup', ev => {
    var coords = {
        x: 0,
        y: 0,
        z: 0,
    };
    if (ev.key == 'w')
        // coords.z += cameraSpeed;
        coords.z += dancerSpeed;
    if (ev.key == 'a')
        // coords.x += cameraSpeed;
        coords.x += dancerSpeed;
    if (ev.key == 's')
        // coords.z -= cameraSpeed;
        coords.z -= dancerSpeed;
    if (ev.key == 'd')
        // coords.x -= cameraSpeed;
        coords.x -= dancerSpeed;
    // cameraWalk = coords;
    dancerWalk = coords;
});

// Desafio 2 - Cubo aleatório
document.addEventListener('keypress', ev => {
    if (ev.key == ' ') {
        var color = Math.random() * 0xffffff;
        var material = new THREE.MeshStandardMaterial({ color: color });
        var cube = new THREE.Mesh(geometry, material);
        var x = THREE.MathUtils.randFloat(-15, 15);
        var y = THREE.MathUtils.randFloat(-15, 15);
        var z = THREE.MathUtils.randFloat(-15, 15);
        cube.position.set(x, y, z);
        scene.add(cube);
    }
});

function Start() {
    scene.add(cube);

    // Desafio 1 - Boneco de neve  
    var geometry = new THREE.SphereGeometry(10, 50, 50);
    var material = new THREE.MeshStandardMaterial({ color: "white", });
    var big_ball = new THREE.Mesh(geometry, material);

    geometry = new THREE.SphereGeometry(7, 50, 50);
    var small_ball = new THREE.Mesh(geometry, material);
    small_ball.position.y += 14;

    geometry = new THREE.SphereGeometry(2, 20, 20);
    material = new THREE.MeshStandardMaterial({ color: "black" });
    var left_eye = new THREE.Mesh(geometry, material);
    left_eye.position.x -= 2;
    left_eye.position.y += 15;
    left_eye.position.z += 4.8;

    var right_eye = new THREE.Mesh(geometry, material);
    right_eye.position.x += 2;
    right_eye.position.y += 15;
    right_eye.position.z += 4.8;

    geometry = new THREE.RingGeometry(1, 2, 20, 20, Math.PI, Math.PI);
    material = new THREE.MeshStandardMaterial({ color: 'red' });
    var mouth = new THREE.Mesh(geometry, material);
    mouth.position.y += 13;
    mouth.position.z += 7;

    var head = new THREE.Group();
    head.add(small_ball, left_eye, right_eye, mouth);
    snowman.add(head, big_ball);

    snowman.position.x -= 4;
    snowman.scale.set(0.15, 0.15, 0.15);
    scene.add(snowman);

    // Criar foco de luz branca e intensidade normal
    var light = new THREE.SpotLight('white', 1);
    // Mudar posição da luz para ficar 5u. acima da câmara
    light.position.y = 5;
    light.position.z = 10;

    // Apontar a luz ao cubo
    light.lookAt(cube.position);
    // Adicionar a luz à cena
    scene.add(light);

    camera.position.z = 10;

    requestAnimationFrame(update);
}

function update() {
    if (cubeCoordRotation != null) {
        cube.rotation.x += cubeCoordRotation.y * 0.1;
        cube.rotation.y += cubeCoordRotation.x * 0.1;
    }
    // if (cameraWalk != null) {
    //     camera.position.x += cameraWalk.x;
    //     camera.position.z += cameraWalk.z;
    // }
    // Desafio 1
    if (dancerWalk != null) {
        importedObject.position.x += dancerWalk.x;
        importedObject.position.z += dancerWalk.z;
    }
    if (animationMixer != null) {
        animationMixer.update(clock.getDelta());
    }
    // cameraWalk = { x: 0, y: 0, z: 0 };
    dancerWalk = { x: 0, y: 0, z: 0 };

    renderer.render(scene, camera);

    requestAnimationFrame(update);
}