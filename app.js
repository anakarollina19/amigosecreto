// Amigo Secreto — lógica principal
// Recursos: validação, lista persistente, sorteio simples e sorteio completo de pares
// (sem ninguém tirar a si mesmo), revelação individual, compartilhamento e tema escuro.

const STORAGE_KEY = 'amigo-secreto:amigos';
const THEME_KEY = 'amigo-secreto:tema';

let amigos = carregarAmigos();
let pares = [];

const $ = (id) => document.getElementById(id);

function carregarAmigos() {
    try {
        const salvos = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(salvos) ? salvos : [];
    } catch {
        return [];
    }
}

function salvarAmigos() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(amigos));
    } catch {
        // armazenamento indisponível (modo privado); a lista continua em memória
    }
}

function normalizar(nome) {
    return nome.trim().replace(/\s+/g, ' ');
}

function mostrarMensagem(texto, tipo = 'erro') {
    const msg = $('mensagem');
    msg.textContent = texto;
    msg.className = `message message--${tipo}`;
    clearTimeout(mostrarMensagem.timer);
    mostrarMensagem.timer = setTimeout(() => {
        msg.textContent = '';
        msg.className = 'message';
    }, 3500);
}

function adicionarAmigo() {
    const input = $('amigo');
    const nome = normalizar(input.value);

    if (!nome) {
        mostrarMensagem('Por favor, insira um nome.');
    } else if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(nome)) {
        mostrarMensagem('Use apenas letras no nome.');
    } else if (amigos.some((a) => a.toLowerCase() === nome.toLowerCase())) {
        mostrarMensagem(`"${nome}" já está na lista.`);
    } else {
        amigos.push(nome);
        salvarAmigos();
        limparResultado();
        atualizarLista();
    }

    input.value = '';
    input.focus();
}

function removerAmigo(indice) {
    amigos.splice(indice, 1);
    salvarAmigos();
    limparResultado();
    atualizarLista();
}

function limparLista() {
    if (!amigos.length || !confirm('Remover todos os nomes da lista?')) return;
    amigos = [];
    salvarAmigos();
    limparResultado();
    atualizarLista();
}

function atualizarLista() {
    const lista = $('listaAmigos');
    lista.innerHTML = '';

    amigos.forEach((nome, i) => {
        const li = document.createElement('li');
        li.className = 'name-chip';
        li.textContent = nome;

        const remover = document.createElement('button');
        remover.className = 'chip-remove';
        remover.setAttribute('aria-label', `Remover ${nome}`);
        remover.textContent = '×';
        remover.onclick = () => removerAmigo(i);

        li.appendChild(remover);
        lista.appendChild(li);
    });

    $('contador').textContent = amigos.length
        ? `${amigos.length} participante${amigos.length > 1 ? 's' : ''}`
        : 'Nenhum participante ainda';
    $('btnSortearPares').disabled = amigos.length < 3;
    $('btnLimpar').hidden = !amigos.length;
}

function limparResultado() {
    pares = [];
    $('resultado').innerHTML = '';
    $('acoesResultado').hidden = true;
}

// Embaralhamento Fisher–Yates com gerador criptográfico
function aleatorio(max) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % max;
}

function embaralhar(lista) {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = aleatorio(i + 1);
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

// Sorteio simples (requisito original do desafio): escolhe um nome
function sortearAmigo() {
    if (!amigos.length) {
        mostrarMensagem('Adicione pelo menos um nome antes de sortear.');
        return;
    }
    limparResultado();
    const sorteado = amigos[aleatorio(amigos.length)];
    animarSorteio(() => {
        $('resultado').innerHTML = `<li class="result-highlight">🎉 O amigo secreto sorteado é: <strong></strong></li>`;
        $('resultado').querySelector('strong').textContent = sorteado;
        soltarConfete();
    });
}

// Sorteio completo: um ciclo embaralhado garante que ninguém tire a si mesmo
// e que todos deem e recebam exatamente um presente.
function sortearPares() {
    if (amigos.length < 3) {
        mostrarMensagem('São necessários pelo menos 3 participantes.');
        return;
    }
    limparResultado();
    const ordem = embaralhar(amigos);
    pares = ordem.map((nome, i) => ({ de: nome, para: ordem[(i + 1) % ordem.length] }));

    animarSorteio(() => {
        const resultado = $('resultado');
        pares.forEach(({ de, para }) => {
            const li = document.createElement('li');
            li.className = 'pair';

            const quem = document.createElement('span');
            quem.textContent = de;

            const revelar = document.createElement('button');
            revelar.className = 'button-reveal';
            revelar.textContent = '👀 Revelar';
            revelar.onclick = () => {
                const visivel = revelar.dataset.visivel === 'true';
                revelar.dataset.visivel = String(!visivel);
                revelar.textContent = visivel ? '👀 Revelar' : `🎁 ${para}`;
            };

            li.append(quem, revelar);
            resultado.appendChild(li);
        });
        $('acoesResultado').hidden = false;
        soltarConfete();
    });
}

function animarSorteio(aoTerminar) {
    const resultado = $('resultado');
    let passos = 12;
    const intervalo = setInterval(() => {
        resultado.innerHTML = `<li class="result-rolling"></li>`;
        resultado.firstChild.textContent = `🎲 ${amigos[aleatorio(amigos.length)]}`;
        if (--passos === 0) {
            clearInterval(intervalo);
            resultado.innerHTML = '';
            aoTerminar();
        }
    }, 70);
}

function compartilharWhatsApp(de, para) {
    const texto = `Olá, ${de}! 🎁 Seu amigo secreto é: ${para}. Não conte para ninguém! 🤫`;
    return `https://wa.me/?text=${encodeURIComponent(texto)}`;
}

function copiarResultado() {
    const texto = pares.map(({ de, para }) => `${de} → ${para}`).join('\n');
    navigator.clipboard.writeText(texto)
        .then(() => mostrarMensagem('Resultado copiado!', 'sucesso'))
        .catch(() => mostrarMensagem('Não foi possível copiar.'));
}

function abrirMensagens() {
    const resultado = $('resultado');
    resultado.querySelectorAll('.pair').forEach((li, i) => {
        if (li.querySelector('.button-share')) return;
        const link = document.createElement('a');
        link.className = 'button-share';
        link.href = compartilharWhatsApp(pares[i].de, pares[i].para);
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = 'WhatsApp';
        li.appendChild(link);
    });
}

function soltarConfete() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cores = ['#fe652b', '#4B69FD', '#05DF05', '#FFD23F', '#FF5DA2'];
    for (let i = 0; i < 80; i++) {
        const c = document.createElement('span');
        c.className = 'confetti';
        c.style.left = `${Math.random() * 100}vw`;
        c.style.background = cores[i % cores.length];
        c.style.animationDelay = `${Math.random() * 0.6}s`;
        c.style.animationDuration = `${2 + Math.random() * 1.5}s`;
        document.body.appendChild(c);
        c.addEventListener('animationend', () => c.remove());
    }
}

function alternarTema() {
    const escuro = document.documentElement.dataset.theme !== 'dark';
    document.documentElement.dataset.theme = escuro ? 'dark' : 'light';
    $('btnTema').textContent = escuro ? '☀️' : '🌙';
    try { localStorage.setItem(THEME_KEY, escuro ? 'dark' : 'light'); } catch {}
}

function iniciar() {
    let tema = null;
    try { tema = localStorage.getItem(THEME_KEY); } catch {}
    if (tema === 'dark') alternarTema();

    $('amigo').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') adicionarAmigo();
    });
    atualizarLista();
}

iniciar();
