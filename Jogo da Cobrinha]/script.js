const canvas = document.getElementById('jogoCanvas');
const ctx = canvas.getContext('2d');
const pontuacaoElemento = document.getElementById('pontuacao');
const fimJogoElemento = document.getElementById('fimJogo');
const mensagemInicialElemento = document.getElementById('mensagemInicial');
const pontuacaoFinalElemento = document.getElementById('pontuacaoFinal');

const tamanhoGrade = 15;
const quantidadeBlocos = canvas.width / tamanhoGrade;

let cobrinha = [{x: 10, y: 10}];
let comida = {x: 15, y: 15};
let dx = 0;
let dy = 0;
let pontuacao = 0;
let jogoRodando = false;
let jogoIniciado = false;
let cicloJogo;

function desenharJogo() {
    ctx.fillStyle = '#96b400ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenha comida
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(comida.x * tamanhoGrade, comida.y * tamanhoGrade, tamanhoGrade - 1, tamanhoGrade - 1);

    // Desenha cobrinha
    ctx.fillStyle = '#1a1a1a';
    cobrinha.forEach(segmento => {
        ctx.fillRect(segmento.x * tamanhoGrade, segmento.y * tamanhoGrade, tamanhoGrade - 1, tamanhoGrade - 1);
    });
}

function moverCobrinha() {
    if (!jogoRodando) return;

    const cabeca = {x: cobrinha[0].x + dx, y: cobrinha[0].y + dy};

    if (cabeca.x < 0 || cabeca.x >= quantidadeBlocos || cabeca.y < 0 || cabeca.y >= quantidadeBlocos) {
        encerrarJogo();
        return;
    }

    if (cobrinha.some(seg => seg.x === cabeca.x && seg.y === cabeca.y)) {
        encerrarJogo();
        return;
    }

    cobrinha.unshift(cabeca);

    if (cabeca.x === comida.x && cabeca.y === comida.y) {
        pontuacao++;
        pontuacaoElemento.textContent = pontuacao;
        gerarComida();
    } else {
        cobrinha.pop();
    }

    desenharJogo();
}

function gerarComida() {
    let novaComida;
    do {
        novaComida = {
            x: Math.floor(Math.random() * quantidadeBlocos),
            y: Math.floor(Math.random() * quantidadeBlocos)
        };
    } while (cobrinha.some(seg => seg.x === novaComida.x && seg.y === novaComida.y));
    
    comida = novaComida;
}

function encerrarJogo() {
    jogoRodando = false;
    clearInterval(cicloJogo);

    pontuacaoFinalElemento.textContent = pontuacao;
    fimJogoElemento.style.display = 'block';
}

function iniciarJogo() {
    cobrinha = [{x: 10, y: 10}];
    dx = 0;
    dy = 0;
    pontuacao = 0;
    pontuacaoElemento.textContent = pontuacao;
    jogoRodando = true;
    jogoIniciado = true;
    fimJogoElemento.style.display = 'none';
    mensagemInicialElemento.style.display = 'none';

    gerarComida();
    desenharJogo();

    clearInterval(cicloJogo);
    cicloJogo = setInterval(moverCobrinha, 250);
}

document.addEventListener('keydown', (e) => {
    if (!jogoIniciado && e.key.startsWith('Arrow')) {
        iniciarJogo();
    }

    if (e.key === ' ' && !jogoRodando && jogoIniciado) {
        e.preventDefault();
        iniciarJogo();
    }

    if (!jogoRodando) return;

    switch(e.key) {
        case 'ArrowUp':
            if (dy === 0) { dx = 0; dy = -1; }
            e.preventDefault();
            break;
        case 'ArrowDown':
            if (dy === 0) { dx = 0; dy = 1; }
            e.preventDefault();
            break;
        case 'ArrowLeft':
            if (dx === 0) { dx = -1; dy = 0; }
            e.preventDefault();
            break;
        case 'ArrowRight':
            if (dx === 0) { dx = 1; dy = 0; }
            e.preventDefault();
            break;
    }
});

desenharJogo();
