# 4Content — site (pronto para hospedar)

Site institucional da 4Content: página principal + 4 páginas de serviço.

## Sobre estes arquivos
Estes arquivos JÁ SÃO o site final — não são um protótipo para recriar. São páginas HTML autocontidas (formato "Design Component") que rodam direto no navegador: cada `.dc.html` carrega React e o runtime `support.js` via CDN/script local e se renderiza sozinho, sem build step, sem Node, sem bundler.

**Instrução para o Claude Code: publique estes arquivos como estão (site estático). Não reescreva, não converta para outro framework, não "recrie" — apenas hospede.**

## Estrutura
```
4Content.dc.html        → Home
Campanhas.dc.html        → Página de serviço: Campanhas
Series.dc.html           → Página de serviço: Séries Documentais
Media-Day.dc.html        → Página de serviço: Media Day
Real-Time.dc.html        → Página de serviço: Real Time
support.js               → Runtime do Design Component (não editar)
image-slot.js            → Componente de imagem drag-and-drop usado nas páginas
assets/                  → Logos da 4Content e de marcas/clientes (PNG)
185.mp4, hero-*.mp4      → Vídeos de fundo do hero da home
```

Todos os links entre páginas são relativos (`href="Campanhas.dc.html"` etc.) e todos os assets são referenciados com caminho relativo (`assets/logo-white.png`, `./image-slot.js`, `./185.mp4` etc.) — então a pasta pode ser publicada como está, sem ajustar caminhos, DESDE QUE todos os arquivos fiquem juntos, preservando esta estrutura de pastas.

## Como hospedar no GitHub Pages (sugestão)
1. Criar um repositório novo no GitHub e enviar todo o conteúdo desta pasta para a raiz do repositório (ou para uma branch `gh-pages` / pasta `docs/`, conforme preferir).
2. Ativar GitHub Pages nas configurações do repositório, apontando para a branch/pasta onde os arquivos foram enviados.
3. Definir `4Content.dc.html` como página inicial — como GitHub Pages exige um `index.html`, a forma mais simples é duplicar/renomear uma cópia de `4Content.dc.html` para `index.html` (mantendo o arquivo original também, caso haja links diretos para `4Content.dc.html`).
4. Nenhum passo de build é necessário — é publicação de arquivos estáticos.

## Observações
- Os vídeos (`.mp4`) são relativamente grandes; confirmar que o provedor de hospedagem aceita o tamanho total do repositório (GitHub tem limite de 100MB por arquivo e recomenda repositórios enxutos — considerar Git LFS se os vídeos crescerem).
- As imagens trocáveis pelo usuário (via `image-slot.js`) salvam a escolha no `localStorage` do navegador de quem edita — isso é um recurso de edição local, não um CMS. Para produção definitiva, o ideal é fixar as imagens finais diretamente no atributo `src` de cada `<image-slot>` (ver exemplos já feitos em `4Content.dc.html`, como `home-svc-series`) para que todo visitante veja a mesma imagem.
- Cor de destaque do site: dourado `#D5C29E`, fixo (não há mais seletor de tema).
