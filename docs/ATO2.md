# Ato 2 — Carne (aprendizado)

Mentores e aliados; partes de capacidade (braços, mãos, pernas, pulmões, estômago); custo crescente — fome, fôlego, cansaço. Referências: GDD 2.3, 2.1, seção 3 (Undergrounds), seção 4.

**Estrutura escolhida:** não-linearidade **concentrada em bifurcações**, com trechos guiados entre elas — não partes espalhadas em ordem livre. Motivo: o autor decidiu que o jogo conta uma história antes de propor desafio, e ordem totalmente livre dissolve o ritmo das cenas. A avenida do Ato 1 (Pernas ou Boca) é o modelo. Reversível: é tudo dado em `src/world.js` e `src/story.js`.

## Beats

| # | Beat | Função emocional | Estado |
|---|---|---|---|
| 1 | **Chegada** — colunas de pedra, teto baixo, silêncio | O zoom aperta de volta depois da avenida. Ninguém grita aqui — e ele não sabe se isso é melhor | ✅ |
| 2 | **O Bom Ladrão** — fala COM ele, não sobre ele | O terceiro que não corre (depois do Dog e do Detetive) e o primeiro que o trata como alguém. Lição do GDD: parar de fugir | ✅ |
| 3 | **Braços N1** — bielas de um guindaste morto | A lição vira corpo. Custo: *"quem segura pode ser puxado junto. era mais simples quando eu só fugia."* | ✅ |
| 4 | **O portão** — alavanca que exige Braços | Primeira coisa do jogo que **exige** uma parte. A recusa ensina: *"os dedos escorregam. falta braço."* | ✅ |
| 5 | **O Rei do Crime** — pacto e traição | Zona cinzenta moral. O primeiro que quer algo dele em troca | ⬜ |
| 6 | **Mãos N1** — destravar, roubar | O Bom Ladrão é raptado; as mãos vêm da necessidade de tirá-lo de lá | ⬜ |
| 7 | **Bifurcação: o Padre ou o Líder Sindical** | Dois aliados, duas rotas, ordem livre. O que se escolhe primeiro muda quem chega antes na vida dele | ⬜ |
| 8 | **Pulmões N1** — o mar | Custo literal: fôlego finito. A primeira parte que pode matá-lo | ⬜ |
| 9 | **Eden / Parceir@** | Amor entra antes do Coração, para o Coração ter o que quebrar no Ato 3 | ⬜ |

## Cuidados registrados

**O Bom Ladrão é o mentor que vira Líder** (GDD 2.1). Tudo que ele diz no beat 2 precisa aguentar o rapto do beat 6 e a liderança depois. Ele não pode ser simpático demais agora — a confiança do robô nele é o que torna o rapto caro.

**O portão é o modelo de gating do jogo.** Nunca "você precisa do item X": o mundo recusa e o corpo explica. `pullLever()` é o padrão a copiar.

**Custo cresce no Ato 2.** Braços já entregaram o seu ("quem segura pode ser puxado junto"). Pulmões são o salto: fôlego finito é a primeira mecânica que pode matar, e é ela que prepara a fragilidade do Ato 3.
