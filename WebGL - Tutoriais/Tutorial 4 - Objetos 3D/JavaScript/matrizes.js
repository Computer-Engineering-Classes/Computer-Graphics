/**
 * 
 * @param {float} x Valor para translação no eixo do X
 * @param {float} y Valor para translação no eixo do Y
 * @param {float} z Valor para translção no eixo do Y
 * @returns {float[][]} 2D array com a matriz de translação pedida
 */
function CriarMatrizTranslacao(x, y, z) {
    return [
        [1, 0, 0, x],
        [0, 1, 0, y],
        [0, 0, 1, z],
        [0, 0, 0, 1]
    ];
}
/**
 * 
 * @param {float} x Valor para escala no eixo do X
 * @param {float} y Valor para escala no eixo do Y
 * @param {float} z Valor para escala no eixo do Z
 * @returns {float[][]} 2D array com a matriz de escala pedida
 */
function CriarMatrizEscala(x, y, z) {
    return [
        [x, 0, 0, 0],
        [0, y, 0, 0],
        [0, 0, z, 0],
        [0, 0, 0, 1]
    ];
}
/**
 * 
 * @param {float} angulo ângulo em graus para rodar no eixo do X
 * @returns 2D array com a matriz de rotação sobre o eixo do X
 */
function CriarMatrizRotacaoX(angulo) {
    var rad = angulo * Math.PI / 180;
    return [
        [1, 0, 0, 0],
        [0, Math.cos(rad), -Math.sin(rad), 0],
        [0, Math.sin(rad), Math.cos(rad), 0],
        [0, 0, 0, 1]
    ];
}
/**
 * 
 * @param {float} angulo ângulo em graus para rodar no eixo do Y
 * @returns {float[][]} 2D array com a matriz de rotação sobre o eixo do Y
 */
function CriarMatrizRotacaoY(angulo) {
    var rad = angulo * Math.PI / 180;
    return [
        [Math.cos(rad), 0, Math.sin(rad), 0],
        [0, 1, 0, 0],
        [-Math.sin(rad), 0, Math.cos(rad), 0],
        [0, 0, 0, 1]
    ];
}
/**
 * 
 * @param {float} angulo ângulo em graus para rodar no eixo do Z
 * @returns {float[][]} 2D array com a matriz de rotação sobre o eixo do Z
 */
function CriarMatrizRotacaoZ(angulo) {
    var rad = angulo * Math.PI / 180;
    return [
        [Math.cos(rad), -Math.sin(rad), 0, 0],
        [Math.sin(rad), Math.cos(rad), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
}