
var canvas = document.createElement("canvas");

canvas.width = window.innerWidth - 15;
canvas.height = window.innerHeight - 45;

var gl = canvas.getContext("webgl");

var vertexShader = gl.createShader(gl.VERTEX_SHADER);
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

var program = gl.createProgram();

var gpuArrayBuffer = gl.createBuffer();

// Localização das variáveis
var finalMatrixLocation;

var visualizationMatrixLocation;
var projectionMatrixLocation;
var viewportMatrixLocation;

var anguloRotacao = 0;

function loop() {
    canvas.width = window.innerWidth - 15;
    canvas.height = window.innerHeight - 45;
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.useProgram(program);

    gl.clearColor(0.65, 0.65, 0.65, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    var finalMatrix = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];

    finalMatrix = math.multiply(CriarMatrizTranslacao(0.5, 0.5, 0), finalMatrix);
    finalMatrix = math.multiply(CriarMatrizEscala(0.25, 0.25, 0.25), finalMatrix);
    finalMatrix = math.multiply(CriarMatrizRotacaoY(anguloRotacao), finalMatrix);

    // 1. Aplica uma operação de escala, fazendo que o triângulo fique com 75% do tamanho do triângulo original
    finalMatrix = math.multiply(CriarMatrizEscala(3, 3, 3), finalMatrix);
    // 2. Aplica uma translação ao triângulo de forma a que ele fique a rodar posicionado do lado inferior direito
    finalMatrix = math.multiply(CriarMatrizRotacaoZ(anguloRotacao), finalMatrix);
    // 3. Faz com que o triângulo rode em dois eixos sem que saia do canvas
    finalMatrix = math.multiply(CriarMatrizTranslacao(1.5, -0.8, 5), finalMatrix);

    // Translação para poder alterar a posição do objeto no eixo do Z
    finalMatrix = math.multiply(CriarMatrizTranslacao(0, 0, 1), finalMatrix);

    finalMatrix = [].concat(...finalMatrix);
    var visualizationMatrix = [].concat(...MatrizDeVisualizacao([1, 0, 0], [0, 1, 0], [0, 0, 1], [0, 0, 0]));
    var projectionMatrix = [].concat(...MatrizPerspetiva(10, 4, 3, 0.1, 100));
    var viewportMatrix = [].concat(...MatrizViewport(-1, 1, -1, 1));

    gl.uniformMatrix4fv(finalMatrixLocation, false, finalMatrix);
    // Passar o array 1D relativo à matriz de visualização para o vertexShader
    gl.uniformMatrix4fv(visualizationMatrixLocation, false, visualizationMatrix);
    // Passar o array 1D relativo à matriz de projeção para o vertexShader
    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
    // Passar o array 1D relativo à matriz de viewport para o vertexShader
    gl.uniformMatrix4fv(viewportMatrixLocation, false, viewportMatrix);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    anguloRotacao++;

    requestAnimationFrame(loop);
}

function PrepareTriangleData() {

    var triangleArray = [
        -0.5, -0.5, 0.0, 1.0, 0.0, 0.0,
        0.5, -0.5, 0.0, 0.0, 1.0, 0.0,
        0.0, 0.5, 0.0, 0.0, 0.0, 1.0,
    ];
    gl.bindBuffer(gl.ARRAY_BUFFER, gpuArrayBuffer);

    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(triangleArray),
        gl.STATIC_DRAW
    );
}

function SendDataToShaders() {
    var vertexPositionAttrLoc = gl.getAttribLocation(program, "vertexPosition");
    var vertexColorAttrLoc = gl.getAttribLocation(program, "vertexColor");

    gl.vertexAttribPointer(
        vertexPositionAttrLoc,
        3,
        gl.FLOAT,
        false,
        6 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    gl.vertexAttribPointer(
        vertexColorAttrLoc,
        3,
        gl.FLOAT,
        false,
        6 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT
    )

    gl.enableVertexAttribArray(vertexPositionAttrLoc);
    gl.enableVertexAttribArray(vertexColorAttrLoc);

    finalMatrixLocation = gl.getUniformLocation(program, "transformationsMatrix");

    visualizationMatrixLocation = gl.getUniformLocation(program, "visualizationMatrix");
    projectionMatrixLocation = gl.getUniformLocation(program, "projectionMatrix");
    viewportMatrixLocation = gl.getUniformLocation(program, "viewportMatrix");
}

function PrepareProgram() {
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("ERRO :: A ligação do programa lançou uma exceção!",
            gl.getProgramInfoLog(program));
    }

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error("ERRO :: A validação do programa lançou uma exceção!",
            gl.getProgramInfoLog(program));
    }

    gl.useProgram(program);
}

function PrepareShaders() {
    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.shaderSource(fragmentShader, fragmentShaderCode);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("ERRO :: A compilação do vertex shader lançou uma exceção!",
            gl.getShaderInfoLog(vertexShader));
    }
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("ERRO :: A compilação do fragment shader lançou uma exceção!",
            gl.getShaderInfoLog(fragmentShader));
    }
}

function PrepareCanvas() {
    gl.clearColor(0.65, 0.65, 0.65, 1.0);

    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    document.body.appendChild(canvas);

    canvas.insertAdjacentText("afterend", "O canvas encontra-se acima deste texto!");
}

function Start() {
    PrepareCanvas();
    PrepareShaders();
    PrepareProgram();
    PrepareTriangleData();
    SendDataToShaders();
    loop();
}