import * as THREE from 'three';

// Chamar a função Start
document.addEventListener('DOMContentLoaded', Start);

// Baseado em cenas e câmaras
// Cada cena contém objetos que lhe pertencem
// Criar cena, câmara e renderer em WebGL
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
var renderer = new THREE.WebGLRenderer();

// Indicar o tamanho da janela de visualização do renderer
renderer.setSize(window.innerWidth - 15, window.innerHeight - 15);

// Adicionar o renderer ao corpo do documento
document.body.appendChild(renderer.domElement);

// No Three.js existem diferentes primitivas, i.e., 'Box', 'Plane'
// Para criar um objeto, é preciso uma geometria e um material
// Ou seja, os vértices de cada ponto (geometria) e o material que o objeto usará
// No caso de um cubo, é necessário o comprimento, altura e profundidade
var geometry = new THREE.BoxGeometry(1, 1, 1);
// Material básico, de cor vermelha (em hex)
var material = new THREE.MeshBasicMaterial({ color: 'orange' });
// Criar o cubo
var cube = new THREE.Mesh(geometry, material);

// Rotação a aplicar ao cubo
var cubeCoordRotation;
// Direção de movimento da câmara
var cameraWalk = { x: 0, y: 0, z: 0 };
// Velocidade de movimentação
var cameraSpeed = 0.05;

// Evento disparado sempre que o rato se mova
document.addEventListener('mousemove', ev => {
    // A posição do rato é 0..tamanho do ecrã em píxeis
    // Converter em escala de -1 a 1
    var x = ev.clientX / window.innerWidth * 2 - 1;
    var y = ev.clientY / window.innerHeight * 2 - 1;
    // Adicionar a rotação
    cubeCoordRotation = {
        x: x,
        y: y
    };
});
// Evento disparado sempre que uma tecla for pressionada (sem largar)
document.addEventListener('keydown', ev => {
    var coords = {
        x: 0,
        y: 0,
        z: 0,
    };
    // De acordo com a tecla pressionada, ajusta as coordenadas
    if (ev.key == 'w')
        coords.z -= cameraSpeed;
    if (ev.key == 'a')
        coords.x -= cameraSpeed;
    if (ev.key == 's')
        coords.z += cameraSpeed;
    if (ev.key == 'd')
        coords.x += cameraSpeed;
    // Mover a câmara
    cameraWalk = coords;
});
// Evento disparado sempre que uma tecla for largada
document.addEventListener('keyup', ev => {
    var coords = {
        x: 0,
        y: 0,
        z: 0,
    };
    // De acordo com a tecla levantada, ajusta as coordenadas
    if (ev.key == 'w')
        coords.z += cameraSpeed;
    if (ev.key == 'a')
        coords.x += cameraSpeed;
    if (ev.key == 's')
        coords.z -= cameraSpeed;
    if (ev.key == 'd')
        coords.x -= cameraSpeed;
    // Mover a câmara
    cameraWalk = coords;
});

// Responsável por configurar a cena da 1.ª renderização
function Start() {
    // Adicionar o cubo à cena
    scene.add(cube);
    // Colocar a câmara a 6u. no eixo do Z, a partir do centro do mundo
    camera.position.z = 6;
    // Solictiar ao browser que se pretende criar uma animação
    requestAnimationFrame(update);
}

// Função chamada em cada frame
function update() {
    // Mudar a rotação do cubo no eixo de acordo com a posição do rato
    if (cubeCoordRotation != null) {
        cube.rotation.x += cubeCoordRotation.y * 0.1;
        cube.rotation.y += cubeCoordRotation.x * 0.1;
    }
    // Mudar a posição da câmara de acordo com a tecla premida
    if (cameraWalk != null) {
        camera.position.x += cameraWalk.x;
        camera.position.z += cameraWalk.z;
    }
    // Reset da variável
    cameraWalk = { x: 0, y: 0, z: 0 };
    // Renderizar a cena
    renderer.render(scene, camera);
    // Animação
    requestAnimationFrame(update);
}