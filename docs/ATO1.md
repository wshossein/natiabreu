# Ato 1 — Lata (fuga)

Mapa de beats. Decisão do autor: **este jogo conta uma história, não propõe um grande desafio de gameplay.** O level design serve à cena, não o contrário — obstáculo só existe quando significa alguma coisa (o pulo baixo é a perna de lata, não uma prova de habilidade).

Referências: GDD seções 2.3 (três atos), 2.1 (elenco), 3 (mundo vertical), 4 (partes).
Beats implementados vivem em `src/story.js`; cenário em `src/world.js`.

## Como escrever um beat

Entrada em `src/story.js`, nada em `scenes.js`. Gatilho (`at.x`, `needs`, `flag`) mais uma lista de passos: `think`, `say`, `spawn`, `move`, `face`, `exit`, `follow`, `vib`, `wait`. Texto sempre por chave i18n, nos dois dicionários.

A `flag` vai para o save: beat vivido não repete, nem em outra sessão.

## Beats

| # | Beat | Função emocional | Estado |
|---|---|---|---|
| 1 | **Prólogo às cegas** — criação, o empurrão, a morte, o Cérebro | Cumplicidade: o jogador comete sem ver | ✅ |
| 2 | **Olho N1** — metade da tela | O sentido do jogador É o corpo do robô | ✅ |
| 3 | **Orelha N1** — som liga; puzzle do tique-taque | Ouvir é a chave, não a arma | ✅ |
| 4 | **Sem teto** — sai do laboratório; a câmera recua | A escala diz o que o texto não precisa dizer | ✅ |
| 5 | **A cidade vê o monstro** — moradora foge gritando | Frankenstein: chamado de monstro antes de fazer nada. Inverte o prólogo (lá cometeu sem saber; aqui é acusado sem ter feito) | ✅ |
| 6 | **O Dog** — não corre, fica | Primeiro vínculo. Nasce por contraste com o beat 5 — nenhuma linha explica | ✅ |
| 6.5 | **A bifurcação** — dois caminhos saem da avenida | O jogador escolhe. A ordem das partes é dele, não do roteiro (GDD seção 9) | ✅ |
| 9 | **Boca N1** — corneta de gramofone no fundo do beco | Custo entregue: ele ganha voz e a primeira frase não é a que queria — *"eu não queria ter empurrado"*. Planta o twist sem revelar | ✅ |
| — | **Pernas N1** — molas na escada de incêndio | Alcança mais alto e cai de mais alto. O custo é literal | ✅ |
| 7 | **O Detetive** — encontra o laboratório, vê o robô de longe | Planta o perseguidor. Ele PLANTA, nunca revela: a revelação do twist é dele, mas só no fim | ⬜ |
| 8 | **Fuga para baixo** — descida ao Ground; **o Dog conhece o caminho** | O companheiro guia. O robô não sabe onde está; alguém sabe por ele | ⬜ |
| 9 | **Boca N1** — ele pode falar | Custo: a primeira coisa que ele consegue dizer não é a que queria. E o que diz passa a poder ser usado contra ele | ⬜ |
| 10 | **O Sheriff** — antagonista de campo; ameaça o Dog | Planta a perda que virá. Combate não-letal: o robô só se interpõe | ⬜ |
| 11 | **Undergrounds** — a descida; fim do Ato 1 | De fugitivo a alguém com destino | ⬜ |

## Cuidados registrados

**Beat 7 — o Detetive não pode revelar.** Ele é quem junta as peças do twist (GDD 2.2), mas no Ato 1 só persegue. Toda fala dele aqui precisa funcionar duas vezes: inocente na primeira jogada, carregada na releitura.

**Beat 9 — a Boca, implementada.** A primeira frase que sai dele é *"...eu não queria ter empurrado."* — e ele não decidiu dizê-la. Ninguém no jogo sabe o que ele empurrou; o jogador sabe, porque foi ele quem empurrou no prólogo. A fala é de Gepeto, e nem o robô nem o jogador têm como saber disso ainda. Custo do GDD entregue sem exposição.

**Não-linearidade.** A avenida tem dois caminhos e nenhum tranca o outro. As Pernas facilitam a subida de volta do beco; a Boca não ajuda em traversal nenhum. A assimetria é de propósito: quem escolhe a voz primeiro paga em esforço, quem escolhe as molas primeiro paga em atraso narrativo. Nenhuma escolha é errada.

**Prólogo.** A arte do prólogo e do Gepeto foi adiada a pedido, e isso é seguro. O que **não** pode acontecer é virar uma cena separada: o prólogo às cegas e o replay revelador têm de continuar sendo a MESMA cena com camadas ligadas e desligadas (GDD 2.2). Se forem duas, dessincronizam e o twist quebra.

**Ordem das partes.** Não é contrato (GDD seção 9). O que vale é o princípio: o jogador esbarra na situação que pede a parte, a história apresenta o doador, ele vai buscar. Boca antes de Pernas porque o Ato 1 é fuga e perseguição — o que falta a ele é ser compreendido, não ser ágil.
