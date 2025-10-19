const canvas = document.getElementById('jogoCanvas');
const ctx = canvas.getContext('2d');
const pontuacaoElemento = document.getElementById('pontuacao');
const fimJogoElemento = document.getElementById('fimJogo');
const mensagemInicialElemento = document.getElementById('mensagemInicial');
const pontuacaoFinalElemento = document.getElementById('pontuacaoFinal');
const botaoMais = document.getElementById('aumentarVelocidade');
const botaoMenos = document.getElementById('diminuirVelocidade');
const velocidadeElemento = document.getElementById('velocidadeAtual');

// ⚙️ CONFIGURAÇÕES
const tamanhoGrade = 30;
const quantidadeBlocos = canvas.width / tamanhoGrade;

let cobrinha = [{x: 10, y: 10}];
let comida = {x: 15, y: 15};
let dx = 0;
let dy = 0;
let pontuacao = 0;
let jogoRodando = false;
let jogoIniciado = false;
let cicloJogo;

// velocidade (nível)
let nivelVelocidade = 1;
let velocidade = 250; // ms entre movimentos

// 🎨 DESENHAR JOGO + OLHOS
function desenharJogo() {
    ctx.fillStyle = '#96b400ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 🍎 comida
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(comida.x * tamanhoGrade, comida.y * tamanhoGrade, tamanhoGrade - 2, tamanhoGrade - 2);

    // 🐍 corpo
    cobrinha.forEach((segmento, index) => {
        ctx.fillStyle = index === 0 ? '#000000' : '#1a1a1a';
        ctx.fillRect(segmento.x * tamanhoGrade, segmento.y * tamanhoGrade, tamanhoGrade - 2, tamanhoGrade - 2);

        // 👀 olhos (somente na cabeça)
        if (index === 0) {
            desenharOlhos(segmento.x, segmento.y);
        }
    });
}

// 👀 função dos olhos
function desenharOlhos(x, y) {
    const olhoTam = 4;
    let posicoes = [];

    if (dx === 1 && dy === 0) { // direita
        posicoes = [
            { x: x * tamanhoGrade + 20, y: y * tamanhoGrade + 6 },
            { x: x * tamanhoGrade + 20, y: y * tamanhoGrade + 18 }
        ];
    } else if (dx === -1 && dy === 0) { // esquerda
        posicoes = [
            { x: x * tamanhoGrade + 6, y: y * tamanhoGrade + 6 },
            { x: x * tamanhoGrade + 6, y: y * tamanhoGrade + 18 }
        ];
    } else if (dx === 0 && dy === -1) { // cima
        posicoes = [
            { x: x * tamanhoGrade + 6, y: y * tamanhoGrade + 6 },
            { x: x * tamanhoGrade + 18, y: y * tamanhoGrade + 6 }
        ];
    } else if (dx === 0 && dy === 1) { // baixo
        posicoes = [
            { x: x * tamanhoGrade + 6, y: y * tamanhoGrade + 20 },
            { x: x * tamanhoGrade + 18, y: y * tamanhoGrade + 20 }
        ];
    }

    ctx.fillStyle = '#ffffff';
    posicoes.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, olhoTam, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });

    // pupilas
    ctx.fillStyle = '#000000';
    posicoes.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}

// 🚶 MOVIMENTO
function moverCobrinha() {
    if (!jogoRodando) return;

    const cabeca = {x: cobrinha[0].x + dx, y: cobrinha[0].y + dy};

    // colisões
    if (cabeca.x < 0 || cabeca.x >= quantidadeBlocos || cabeca.y < 0 || cabeca.y >= quantidadeBlocos) {
        encerrarJogo();
        return;
    }

    if (cobrinha.some(seg => seg.x === cabeca.x && seg.y === cabeca.y)) {
        encerrarJogo();
        return;
    }

    cobrinha.unshift(cabeca);

    // 🍎 comer
    if (cabeca.x === comida.x && cabeca.y === comida.y) {
        pontuacao++;
        pontuacaoElemento.textContent = pontuacao;
        gerarComida();
    } else {
        cobrinha.pop();
    }

    desenharJogo();
}

// 🍏 GERAR COMIDA
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

// 🛑 FIM
function encerrarJogo() {
    jogoRodando = false;
    clearInterval(cicloJogo);
    pontuacaoFinalElemento.textContent = pontuacao;
    fimJogoElemento.style.display = 'block';
}

// ▶️ INÍCIO
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
    cicloJogo = setInterval(moverCobrinha, velocidade);
}

// ⌨️ CONTROLES
document.addEventListener('keydown', (e) => {
    if (!jogoIniciado && e.key.startsWith('Arrow')) iniciarJogo();

    if (e.key === ' ' && !jogoRodando && jogoIniciado) {
        e.preventDefault();
        iniciarJogo();
    }

    if (!jogoRodando) return;

    switch(e.key) {
        case 'ArrowUp': if (dy === 0) { dx = 0; dy = -1; } break;
        case 'ArrowDown': if (dy === 0) { dx = 0; dy = 1; } break;
        case 'ArrowLeft': if (dx === 0) { dx = -1; dy = 0; } break;
        case 'ArrowRight': if (dx === 0) { dx = 1; dy = 0; } break;
    }
});

// ⚙️ VELOCIDADE
botaoMais.addEventListener('click', () => {
    if (nivelVelocidade < 10) {
        nivelVelocidade++;
        velocidade = Math.max(50, 300 - (nivelVelocidade - 1) * 25);
        atualizarVelocidade();
    }
});

botaoMenos.addEventListener('click', () => {
    if (nivelVelocidade > 1) {
        nivelVelocidade--;
        velocidade = Math.min(300, 300 - (nivelVelocidade - 1) * 25);
        atualizarVelocidade();
    }
});

function atualizarVelocidade() {
    velocidadeElemento.textContent = nivelVelocidade;
    if (jogoRodando) {
        clearInterval(cicloJogo);
        cicloJogo = setInterval(moverCobrinha, velocidade);
    }
}

desenharJogo();


