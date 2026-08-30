# Robô de Lata (título provisório)

Metroidvania 2D mobile sobre um robô de lata que se torna humano, parte por parte — e os sentidos do jogador evoluem junto: o olho liga a tela, a orelha liga o som, o tato é a vibração do celular.

**Jogar:** após ativar o GitHub Pages (abaixo), o jogo fica em `https://SEU-USUARIO.github.io/robo-de-lata/`

Design completo em [`docs/GDD.md`](docs/GDD.md). Contexto para o Claude Code em [`CLAUDE.md`](CLAUDE.md).

## Rodar localmente

```bash
python3 -m http.server
# abrir http://localhost:8000
```

(Precisa de servidor por causa do carregamento dos JSONs de idioma.)

## Subir para o GitHub

```bash
cd robo-de-lata
git init
git add .
git commit -m "Protótipo do início: prólogo às cegas, olho, orelha, puzzle sonoro"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/robo-de-lata.git
git push -u origin main
```

## Ativar o GitHub Pages (jogo publicado a cada push)

No repositório: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save.**
Em ~1 minuto o jogo fica no ar; todo push atualiza automaticamente.

## Desenvolver pelo celular (Claude Code)

1. Abra o app do Claude no celular → aba **Code** (ou `claude.ai/code` no navegador).
2. Conecte sua conta GitHub e selecione o repositório `robo-de-lata`.
3. Descreva a tarefa ("aumenta o tempo do texto da 1ª Lei", "cria a sala 4 com wall jump") — o Claude Code roda na nuvem, lê o `CLAUDE.md`/GDD e abre um PR.
4. Revise o PR, faça merge → o Pages publica → teste na URL do jogo, no próprio celular.
