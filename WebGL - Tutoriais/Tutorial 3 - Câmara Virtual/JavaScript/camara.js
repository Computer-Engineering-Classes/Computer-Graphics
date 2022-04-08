/**
 * Função que devolve a matriz de visualização
 * @param {float[]} rightVector Array direita da câmara
 * @param {float[]} upVector Array cima da câmara
 * @param {float[]} forwardVector Array frente da câmara
 * @param {float[]} centerPoint Array com a posição da câmara em "world coordinates"
 * @returns {float[][]}
 */
function MatrizDeVisualizacao(rightVector, upVector, forwardVector, centerPoint) {
    return [
        [rightVector[0], rightVector[1], rightVector[2], -math.multiply(rightVector, centerPoint)],
        [upVector[0], upVector[1], upVector[2], -math.multiply(upVector, centerPoint)],
        [forwardVector[0], forwardVector[1], forwardVector[2], -math.multiply(forwardVector, centerPoint)],
        [0, 0, 0, 1]
    ];
}
/**
 * Função que devolve a matriz de projeção ortográfica
 * @param {float} width Comprimento da câmara que deve ser renderizada
 * @param {float} height Altura da câmara que deve ser renderizada
 * @param {float} nearPlane Plano de corte anterior da câmara
 * @param {float} farPlane Plano de corte posterior da câmara
 * @returns {float[][]}
 */
function MatrizOrtografica(width, height, nearPlane, farPlane) {
    var matrizOrtografica = [
        [1 / width, 0, 0, 0],
        [0, 1 / height, 0, 0],
        [0, 0, 1 / (farPlane / 2 - nearPlane), -nearPlane / (farPlane / 2 - nearPlane)],
        [0, 0, 0, 1]
    ];
    return math.multiply(matrizOrtografica, CriarMatrizTranslacao(0, 0, -(nearPlane + farPlane / 2)));
}
/**
 * Função que devolve a matriz de projeção em perspetiva
 * @param {float} distance Distância do centro que a imagem deve ser renderizada
 * @param {float} width Comprimento da câmara que deve ser renderizada
 * @param {float} height Altura da câmara que deve ser renderizada
 * @param {float} nearPlane Plano de corte anterior da câmara
 * @param {float} farPlane Plano de corte posterior da câmara
 * @returns {float[][]}
 */
function MatrizPerspetiva(distance, width, height, nearPlane, farPlane) {
    return [
        [distance / width, 0, 0, 0],
        [0, distance / height, 0, 0],
        [0, 0, farPlane / (farPlane - nearPlane), -nearPlane * farPlane / (farPlane - nearPlane)],
        [0, 0, 1, 0]
    ];
}
/**
 * Função que devolve a matriz de viewport
 * @param {float} minX Valor mínimo do volume canónico no eixo do X
 * @param {float} maxX Valor máximo do volume canónico no eixo do X
 * @param {float} minY Valor mínimo do volume canónico no eixo do Y
 * @param {float} maxY Valor máximo do volume canónico no eixo do Y
 * @returns {float[][]}
 */
function MatrizViewport(minX, maxX, minY, maxY) {
    return [
        [(maxX - minX) / 2, 0, 0, (maxX + minX) / 2],
        [0, (maxY - minY) / 2, 0, (maxY + minY) / 2],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
}