// A primeira coisa que é necessária é um elemento HTML do tipo canvas
var canvas = document.createElement("canvas");

// Em 1o lugar temos que especificar qual o tamanho do canvas
// O tamanho do canvas vai ser do tamanho da janela (window)
canvas.width = window.innerWidth - 15;
canvas.height = window.innerHeight - 45;

// Para podermos trabalhar sobre WebGL, é necessário termos a biblioteca gráfica
var gl = canvas.getContext("webgl");

// Criar o vertex shader. Este shader é chamado por cada vértice do objeto
// de modo a indicar qual a posição do vértice
var vertexShader = gl.createShader(gl.VERTEX_SHADER);

// Criar o fragment shader. Este shader é chamado por cada píxel do objeto
// de modo a dar cor ao objeto
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

// Criar o programa que utilizará os shaders
var program = gl.createProgram();

// Criar um buffer que está localizado na GPU para receber
// os pontos que os shaders irão utilizar
var gpuArrayBuffer = gl.createBuffer();

// Função responsável por criar e guardar a posição XYZ e cor RGB de cada um dos vértices do triângulo
// Esta função é também responsável por copiar essa mesma informação para um buffer que se encontra na GPU
function PrepareTriangleData() {
    // Variável que guardará os pontos de cada vértice (XYZ) bem como a cor de cada um deles (RGB)
    // Nesta variável, cada vértice é constituído por 6 elementos
    // A área do canvas vai de -1 a 1, tanto em altura como em largura, com centro no meio do canvas
    // O código RGB tem valores compreendidos entre 0.0 e 1.0
    var triangleArray = [
        //X     Y     Z     R     G     B                       3
        -0.5, -0.5,  0.0,  1.0,  0.0,  0.0, // Vértice 1 -->   / \
         0.5, -0.5,  0.0,  0.0,  1.0,  0.0, // Vértice 2 -->  /   \
         0.0,  0.5,  0.0,  0.0,  0.0,  1.0, // Vértice 3 --> 1-----2
    ];

    // Indicar à GPU que o buffer é do tipo ARRAY_BUFFER
    gl.bindBuffer(gl.ARRAY_BUFFER, gpuArrayBuffer);

    // Copiar o array que acabámos de criar para o buffer que está localizado na GPU
    gl.bufferData(gl.ARRAY_BUFFER,
        // Dados que pretendemos passar para o buffer
        // Importante saber que a CPU utiliza dados float64, mas a GPU apenas trabalha com float32
        // O JavaScript permite-nos converter float64 para float32
        new Float32Array(triangleArray),
        // Este param indica que os dados passados não serão alterados na GPU
        gl.STATIC_DRAW
        );
}

// Função responsável por atribuir a informação presente no buffer ao vertex shader
function SendDataToShaders() {
    // A primeira coisa a fazer é obter a posição de cada uma das variáveis do shader
    var vertexPositionAttrLoc = gl.getAttribLocation(program, "vertexPosition");
    var vertexColorAttrLoc = gl.getAttribLocation(program, "vertexColor");
    
    // Esta função utiliza o último "binded" buffer, neste caso o gpuArrayBuffer
    // Assim, vai buscar a informação a este e insere-a no vertex shader
    gl.vertexAttribPointer(
        // Localização da variável na qual pretendemos inserir info
        vertexPositionAttrLoc,
        // N.º de elementos que serão usados pela variável, neste caso 3s vec3 (XYZ)
        3,
        // Qual o tipo de objetos que estão no buffer
        gl.FLOAT,
        // Os dados estão (ou não) normalizados
        false,
        // Tamanho dos objetos que constituem cada ponto do triângulo, em bytes
        6 * Float32Array.BYTES_PER_ELEMENT,
        // N.º de bytes a ignorar
        0
    );
    // Definir a variável vertexColor
    gl.vertexAttribPointer(
        vertexColorAttrLoc,
        3,
        gl.FLOAT,
        false,
        6 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT
    )

    // Ativar os atributos que serão utilizados
    gl.enableVertexAttribArray(vertexPositionAttrLoc);
    gl.enableVertexAttribArray(vertexColorAttrLoc);

    // Indicar que será utilizado o programa
    gl.useProgram(program);

    // Indicar à GPU que pode desenhar
    gl.drawArrays(
        gl.TRIANGLES, // Tipo de objetos que se pretende desenhar
        0,            // 1.º elemento a ser desenhado
        3,            // N.º de elementos a desenhar
    );
}

// Função responsável por preparar o programa que irá correr sobre a GPU
function PrepareProgram() {
    // Depois de criar e compilar os shaders, é necessário dizer ao programa para os utilizar
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // Após atribuir os shaders, é necessário dizer à GPU que terminou
    // a configuração do programa. É boa prática verificar se existe algum erro no mesmo
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("ERRO :: A ligação do programa lançou uma exceção!",
                        gl.getProgramInfoLog(program));
    }

    // É boa prática verificar se o programa foi conectado corretamente, e se pode ser utilizado
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error("ERRO :: A validação do programa lançou uma exceção!",
                        gl.getProgramInfoLog(program));
    }

    // Por fim, é necessário indicar que se pretende utilizar este programa
    gl.useProgram(program);
}

// Função responsável por preparar os shaders
function PrepareShaders() {
    // Atribui o código que está no ficheiro "shaders.js" ao vertexShader
    gl.shaderSource(vertexShader, vertexShaderCode);

    // Atribui a código que está no ficheiro "shaders.js" ao fragmentShader
    gl.shaderSource(fragmentShader, fragmentShaderCode);

    // Compila o shader passado por parâmetro
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    // Depois da compilação, é necessário verificar se ocorreu algum erro durante a compilação
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("ERRO :: A compilação do vertex shader lançou uma exceção!",
                        gl.getShaderInfoLog(vertexShader));
    }
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("ERRO :: A compilação do fragment shader lançou uma exceção!",
                        gl.getShaderInfoLog(fragmentShader));
    }
}

// Função responsável por preparar o canvas
function PrepareCanvas() {
    // Indica qual a cor de fundo
    gl.clearColor(0.65, 0.65, 0.65, 1.0);

    // Limpa os buffers de profundidade e de cor para aplicar a cor acima atribuída
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    // Adiciona o canvas ao body do documento
    document.body.appendChild(canvas);

    // Depois do canvas, adicionar um pequeno texto
    // A indicar que o canvas se encontra acima do texto
    canvas.insertAdjacentText("afterend", "O canvas encontra-se acima deste texto!");
}

// Função chamada quando a página web é carregada na totalidade
function Start() {
    PrepareCanvas();
    PrepareShaders();
    PrepareProgram();
    PrepareTriangleData();
    SendDataToShaders();
}