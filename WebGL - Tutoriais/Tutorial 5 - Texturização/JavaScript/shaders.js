
var vertexShaderCode = [
    "precision mediump float;",
    "attribute vec3 vertexPosition;",
    "attribute vec2 texCoords;", // coordenadas UV
    "varying vec2 fragTexCoords;",
    "uniform mat4 transformationsMatrix;",
    "uniform mat4 visualizationMatrix;",
    "uniform mat4 projectionMatrix;",
    "uniform mat4 viewportMatrix;",
    "void main() {",
    "   fragTexCoords = texCoords;",
    "   gl_Position = vec4(vertexPosition, 1.0) * transformationsMatrix * visualizationMatrix * projectionMatrix * viewportMatrix;",
    "}"
].join("\n");

var fragmentShaderCode = [
    "precision mediump float;",
    "varying vec2 fragTexCoords;", // coordenadas UV
    "uniform sampler2D sampler;", // textura
    "void main() {",
    "   gl_FragColor = texture2D(sampler, fragTexCoords);",
    "}"
].join("\n");