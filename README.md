# 🎁 Amigo Secreto

Aplicação web para sortear o amigo secreto da sua turma — rápida, justa e divertida. Desenvolvida com **HTML, CSS e JavaScript puro**, sem dependências, como solução do desafio de lógica de programação da Alura / Oracle Next Education.

## ✨ Funcionalidades

- **Adicionar participantes** pelo botão ou pela tecla `Enter`
- **Validação**: impede nomes vazios, com caracteres inválidos ou duplicados (ignora maiúsculas/minúsculas)
- **Remover** participantes individualmente ou limpar a lista inteira
- **Sorteio simples**: sorteia um nome da lista (requisito original do desafio)
- **Sorteio completo de pares** 🔄: cada pessoa tira exatamente uma outra, e **ninguém tira a si mesmo** (algoritmo de ciclo embaralhado)
- **Revelação individual**: cada participante clica em "Revelar" para ver apenas o seu par
- **Envio por WhatsApp**: gera uma mensagem pronta para cada participante
- **Copiar resultado** para a área de transferência
- **Lista salva** no navegador (`localStorage`) — não se perde ao recarregar
- **Tema claro/escuro** 🌙 com preferência salva
- **Animação de sorteio e confete** 🎉 (respeita `prefers-reduced-motion`)
- **Aleatoriedade criptográfica** com `crypto.getRandomValues` + Fisher–Yates
- **Responsivo e acessível**: labels, `aria-live`, foco visível

## 🚀 Como usar

1. Clone o repositório:
   ```bash
   git clone https://github.com/<seu-usuario>/amigosecreto.git
   ```
2. Abra o arquivo `index.html` no navegador — não precisa instalar nada.

Ou publique gratuitamente pelo **GitHub Pages**: *Settings → Pages → Branch: main → Save*.

## 🧠 Como funciona o sorteio de pares

A lista é embaralhada com Fisher–Yates e cada pessoa presenteia a próxima da lista (a última presenteia a primeira). Isso forma um único ciclo, garantindo que:

- todos dão e recebem exatamente um presente;
- ninguém tira a si mesmo;
- não existem "grupinhos" fechados.

## 🛠️ Tecnologias

- HTML5 semântico
- CSS3 (variáveis, flexbox, animações, tema escuro)
- JavaScript (ES6+)

## 📄 Licença

Distribuído sob a licença MIT. Veja [LICENSE](LICENSE).
