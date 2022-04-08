
var canvas = document.createElement("canvas");

canvas.width = window.innerWidth - 15;
canvas.height = window.innerHeight - 45;

var gl = canvas.getContext("webgl");

var vertexShader = gl.createShader(gl.VERTEX_SHADER);
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

var program = gl.createProgram();

var gpuArrayBuffer = gl.createBuffer();

// Variável que guarda a localização da variável "transformationsMatrix" do vertexShader
var finalMatrixLocation;

// Variável que guarda a rotaçãoc que deve ser aplicada ao objeto
var anguloRotacao = 0;

// Função responsável pela animação (no nosso caso rodar ao triângulo)
function loop()
{
    // Resize ao canvas de modo a ajustar-se ao tamanho da página web
    canvas.width = window.innerWidth - 15;
    canvas.height = window.innerHeight - 45;
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.useProgram(program);

    // Limpar os buffers de profundidade e de cor para cada frame
    gl.clearColor(0.65, 0.65, 0.65, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    // Inicialização da variável que guarda a combinação de matrizes
    // que vão ser passadas para o vertexShader
    var finalMatrix = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];

    // Matriz final = Matriz de translação * Matriz final
    // Translação de 0.5 uni no eixo do X, 0.5 uni no eixo do Y e 0.0 uni no eixo do Z
    finalMatrix = math.multiply(CriarMatrizTranslacao(0.5, 0.5, 0), finalMatrix);
    // Matriz final = Matriz de escala * Matriz final
    // Escala o objeto 0.25, 4 vezes menor
    finalMatrix = math.multiply(CriarMatrizEscala(0.25, 0.25, 0.25), finalMatrix);
    // Matriz final = Matriz de rotacao no eixo do Z * Matriz final
    finalMatrix = math.multiply(CriarMatrizRotacaoY(anguloRotacao), finalMatrix);

    var newArray = [].concat(...finalMatrix);
    
    // Enviar o array 1D para o vertexShader
    gl.uniformMatrix4fv(finalMatrixLocation, false, newArray);

    // Desenhar os triângulos
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // Atualizar o ângulo de rotação para cada frame
    anguloRotacao++;

    // Chamar a função para o próximo frame, para criar um loop de animação
    requestAnimationFrame(loop);
}

function PrepareTriangleData() {
  
    var triangleArray = [
        -0.5, -0.5,  0.0,  1.0,  0.0,  0.0, 
         0.5, -0.5,  0.0,  0.0,  1.0,  0.0, 
         0.0,  0.5,  0.0,  0.0,  0.0,  1.0, 
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

    // Guarda a localização da variável "transformationsMatrix" do vertexShader
    finalMatrixLocation = gl.getUniformLocation(program, "transformationsMatrix");
    // GL.useProgram(program);
   
    // GL.drawArrays(
    //     GL.TRIANGLES, 
    //     0,            
    //     3,            
    // );
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
    // Loop de animação
    loop();
}