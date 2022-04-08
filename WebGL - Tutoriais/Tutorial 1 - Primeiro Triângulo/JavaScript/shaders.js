// Código correspondente ao vertex shader
var vertexShaderCode = [
    // indica qual a precisão do tipo float
    "precision mediump float;",
    // Variável read-only do tipo vec3 que indicará a posição de um vértice
    "attribute vec3 vertexPosition;",
    // Variável read-only do tipo vec3 que indicará a cor de um vértice
    "attribute vec3 vertexColor;",
    // Variável que serve de interface entre o vertex shader e o fragment shader
    "varying vec3 fragColor;",
    // Função main
    "void main() {",
    // Dizemos ao fragment shader qual a cor do vértice
    "   fragColor = vertexColor;",
    // gl_Position é um variável própria do shader que indica a posição do vértice
    // Esta variável é do tipo vec4 e a variável vertexPosition é do tipo vec3
    // Por esta razão temos que colocar 1.0 como último elemento
    "   gl_Position = vec4(vertexPosition, 1.0);",
    "}"
].join("\n");

// Código correspondente ao fragment shader
var fragmentShaderCode = [
    // indica qual a precisão do tipo float
    "precision mediump float;",
    // Variável que serve de interface entre o vertex shader e o fragment shader
    "varying vec3 fragColor;",
    // Função main
    "void main() {",
    // gl_FragColor é uma variável própria do Shader que indica qual a cor do vértice
    // Esta variável é do tipo vec4 e a variável fragColor é do tipo vec3
    // Por esta razão temos que colocar 1.0 como último elemento
    "   gl_FragColor = vec4(fragColor, 1.0);",
    "}"
].join("\n");