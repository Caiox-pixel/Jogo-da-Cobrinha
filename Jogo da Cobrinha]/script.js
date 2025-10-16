const canvas = document.getElementById('jogoCanvas');
const ctx = canvas.getContext('2d');
const pontuacaoElemento = document.getElementById('pontuacao');
const fimJogoElemento = document.getElementById('fimJogo');
const mensagemInicialElemento = document.getElementById('mensagemInicial');
const pontuacaoFinalElemento = document.getElementById('pontuacaoFinal');
const botaoMais = document.getElementById('aumentarVelocidade');
const botaoMenos = document.getElementById('diminuirVelocidade');

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
let velocidade = 250;

function desenharJogo() {
    ctx.fillStyle = '#96b400ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 🍎 comida
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(comida.x * tamanhoGrade, comida.y * tamanhoGrade, tamanhoGrade - 1, tamanhoGrade - 1);

    // 🐍 corpo
    cobrinha.forEach((segmento, index) => {
        if (index === 0) {
            // Cabeça
            ctx.fillStyle = '#000000';
            ctx.fillRect(segmento.x * tamanhoGrade, segmento.y * tamanhoGrade, tamanhoGrade - 1, tamanhoGrade - 1);

            // 👀 olhos
            ctx.fillStyle = '#ffffff';
            let olhoTamanho = 3;
            let offset = 3;
            if (dx === 1) { // indo para direita
                ctx.fillRect(segmento.x * tamanhoGrade + 10, segmento.y * tamanhoGrade + 3, olhoTamanho, olhoTamanho);
                ctx.fillRect(segmento.x * tamanhoGrade + 10, segmento.y * tamanhoGrade + 9, olhoTamanho, olhoTamanho);
            } else if (dx === -1) { // esquerda
                ctx.fillRect(segmento.x * tamanhoGrade + 2, segmento.y * tamanhoGrade + 3, olhoTamanho, olhoTamanho);
                ctx.fillRect(segmento.x * tamanhoGrade + 2, segmento.y * tamanhoGrade + 9, olhoTamanho, olhoTamanho);
            } else if (dy === -1) { // cima
                ctx.fillRect(segmento.x * tamanhoGrade + 3, segmento.y * tamanhoGrade + 2, olhoTamanho, olhoTamanho);
                ctx.fillRect(segmento.x * tamanhoGrade + 9, segmento.y * tamanhoGrade + 2, olhoTamanho, olhoTamanho);
            } else if (dy === 1) { // baixo
                ctx.fillRect(segmento.x * tamanhoGrade + 3, segmento.y * tamanhoGrade + 10, olhoTamanho, olhoTamanho);
                ctx.fillRect(segmento.x * tamanhoGrade + 9, segmento.y * tamanhoGrade + 10, olhoTamanho, olhoTamanho);
            }
        } else {
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(segmento.x * tamanhoGrade, segmento.y * tamanhoGrade, tamanhoGrade - 1, tamanhoGrade - 1);
        }
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
    cicloJogo = setInterval(moverCobrinha, velocidade);
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

// ⚙️ Controles de velocidade
botaoMais.addEventListener('click', () => {
    if (velocidade > 50) velocidade -= 25;
    reiniciarVelocidade();
});

botaoMenos.addEventListener('click', () => {
    if (velocidade < 500) velocidade += 25;
    reiniciarVelocidade();
});

function reiniciarVelocidade() {
    if (jogoRodando) {
        clearInterval(cicloJogo);
        cicloJogo = setInterval(moverCobrinha, velocidade);
    }
}

desenharJogo();
