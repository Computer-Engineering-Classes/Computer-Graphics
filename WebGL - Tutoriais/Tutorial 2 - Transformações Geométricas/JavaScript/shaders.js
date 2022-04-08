
var vertexShaderCode = [    
    "precision mediump float;",
    "attribute vec3 vertexPosition;",   
    "attribute vec3 vertexColor;",   
    "varying vec3 fragColor;",
    // Matriz de 4 x 4 que indica quais as transformações
    // que devem ser feitas a cada um dos vértices
    "uniform mat4 transformationsMatrix;",
    "void main() {",   
    "   fragColor = vertexColor;",
    "   gl_Position = vec4(vertexPosition, 1.0) * transformationsMatrix;",
    "}"
].join("\n");

var fragmentShaderCode = [
    "precision mediump float;",
    "varying vec3 fragColor;",
    "void main() {", 
    "   gl_FragColor = vec4(fragColor, 1.0);",
    "}"
].join("\n");