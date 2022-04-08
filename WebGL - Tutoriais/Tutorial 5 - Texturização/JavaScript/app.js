
var canvas = document.createElement("canvas");

canvas.width = window.innerWidth - 15;
canvas.height = window.innerHeight - 45;

var gl = canvas.getContext("webgl");

var vertexShader = gl.createShader(gl.VERTEX_SHADER);
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

var program = gl.createProgram();

var gpuArrayBuffer = gl.createBuffer();

// Guardar na memória da GPU a textura a ser utilizada
var boxTexture = gl.createTexture();

// Localização das variáveis
var finalMatrixLocation;
var visualizationMatrixLocation;
var projectionMatrixLocation;
var viewportMatrixLocation;

var anguloRotacao = 0;
var vertexPosition = [];
var vertexIndex = [];
var gpuIndexBuffer = gl.createBuffer();

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

    finalMatrix = math.multiply(CriarMatrizTranslacao(0, -0.5, 0), finalMatrix);
    finalMatrix = math.multiply(CriarMatrizEscala(0.25, 0.25, 0.25), finalMatrix);
    finalMatrix = math.multiply(CriarMatrizRotacaoY(anguloRotacao), finalMatrix);

    finalMatrix = math.multiply(CriarMatrizTranslacao(0, 0, 1), finalMatrix);

    finalMatrix = [].concat(...finalMatrix);
    var visualizationMatrix = [].concat(...MatrizDeVisualizacao([1, 0, 0], [0, 1, 0], [0, 0, 1], [0, 0, 0]));
    var projectionMatrix = [].concat(...MatrizPerspetiva(10, 4, 3, 0.1, 100));
    var viewportMatrix = [].concat(...MatrizViewport(-1, 1, -1, 1));

    gl.uniformMatrix4fv(finalMatrixLocation, false, finalMatrix);
    gl.uniformMatrix4fv(visualizationMatrixLocation, false, visualizationMatrix);
    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
    gl.uniformMatrix4fv(viewportMatrixLocation, false, viewportMatrix);

    gl.drawElements(
        gl.TRIANGLES,
        vertexIndex.length,
        gl.UNSIGNED_SHORT,
        0
    )
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    anguloRotacao++;

    requestAnimationFrame(loop);
}

function PrepareTriangleData() {
    // Desafio 2
    vertexPosition = [
        // Frente
        0, 0, 0, 0, .5,
        0, 1, 0, 0, 0,
        1, 1, 0, .5, 0,
        1, 0, 0, .5, .5,
        // Direita
        1, 0, 0, .5, .5,
        1, 1, 0, .5, 0,
        1, 1, 1, 1, 0,
        1, 0, 1, 1, .5,
        // Trás
        1, 0, 1, 0, 1,
        1, 1, 1, 0, .5,
        0, 1, 1, .5, .5,
        0, 0, 1, .5, 1,
        // Esquerda
        0, 0, 1, .5, 1,
        0, 1, 1, .5, .5,
        0, 1, 0, 1, .5,
        0, 0, 0, 1, 1,
        // Cima
        0, 1, 0, 0, 0,
        0, 1, 1, 0, 1,
        1, 1, 1, 1, 1,
        1, 1, 0, 1, 0,
        // Baixo
        1, 0, 0, 0, 0,
        1, 0, 1, 0, 1,
        0, 0, 1, 0, 1,
        0, 0, 0, 0, 0
    ];
    vertexIndex = [
        // Frente
        0, 2, 1,
        0, 3, 2,
        // Direita
        4, 6, 5,
        4, 7, 6,
        // Trás
        8, 10, 9,
        8, 11, 10,
        // Esquerda
        12, 14, 13,
        12, 15, 14,
        // Cima
        16, 18, 17,
        16, 19, 18,
        // Baixo
        20, 22, 21,
        20, 23, 22
    ]
    gl.bindBuffer(gl.ARRAY_BUFFER, gpuArrayBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertexPosition),
        gl.STATIC_DRAW
    );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gpuIndexBuffer);
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(vertexIndex),
        gl.STATIC_DRAW
    )
    // Bind à textura
    gl.bindTexture(gl.TEXTURE_2D, boxTexture);
    // Rasterização
    // Clamp à borda do eixo do U e do V
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // Como escalar a textura, ao diminuir e aumentar
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // Passar a imagem, através do id
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        document.getElementById("boxImage")
    );
}

function SendDataToShaders() {
    var vertexPositionAttrLoc = gl.getAttribLocation(program, "vertexPosition");
    var texCoordAttrLoc = gl.getAttribLocation(program, "texCoords");

    gl.vertexAttribPointer(
        vertexPositionAttrLoc,
        3,
        gl.FLOAT,
        false,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    gl.vertexAttribPointer(
        texCoordAttrLoc,
        2,
        gl.FLOAT,
        false,
        5 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT
    )

    gl.enableVertexAttribArray(vertexPositionAttrLoc);
    gl.enableVertexAttribArray(texCoordAttrLoc);

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

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

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