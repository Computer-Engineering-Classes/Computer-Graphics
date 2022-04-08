
var vertexShaderCode = [
    "precision mediump float;",
    "attribute vec3 vertexPosition;",
    "attribute vec3 vertexColor;",
    "varying vec3 fragColor;",
    "uniform mat4 transformationsMatrix;",
    "uniform mat4 visualizationMatrix;", // Matriz de visualização
    "uniform mat4 projectionMatrix;", // Matriz de projeção
    "uniform mat4 viewportMatrix;", // Matriz de viewport
    "void main() {",
    "   fragColor = vertexColor;",
    "   gl_Position = vec4(vertexPosition, 1.0) * transformationsMatrix * visualizationMatrix * projectionMatrix * viewportMatrix;",
    "}"
].join("\n");

var fragmentShaderCode = [
    "precision mediump float;",
    "varying vec3 fragColor;",
    "void main() {",
    "   gl_FragColor = vec4(fragColor, 1.0);",
    "}"
].join("\n");