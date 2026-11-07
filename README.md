# Brasa Burger — site demonstrativo

Site responsivo para hamburgueria artesanal, inspirado na referência enviada.

## Arquivos
- `index.html` — estrutura e estilos do site.
- `script.js` — cardápio, filtros, carrinho, cálculo de valores e finalização via WhatsApp.

## Como visualizar
Abra `index.html` no navegador. Para testar em desenvolvimento, também pode usar a extensão Live Server do VS Code.

## Personalização antes de publicar
1. Abra `script.js`.
2. Altere `WHATSAPP_NUMBER` para o número da loja com código do país e DDD, somente números. Exemplo: `5582999999999`.
3. Ajuste `DELIVERY_FEE` para a taxa de entrega (em reais).
4. Edite nomes, descrições, preços e fotos no array `products`.
5. Atualize textos de endereço, horários e informações de contato no `index.html`.

As imagens são fotografias hospedadas no Unsplash e precisam de internet para carregar. Confirme os direitos/licenças e mantenha atribuição quando aplicável antes de usar comercialmente.

## Publicar no GitHub Pages
1. Crie um repositório no GitHub.
2. Envie `index.html`, `script.js` e este `README.md` para a raiz do repositório.
3. Acesse **Settings → Pages**.
4. Em **Build and deployment**, selecione **Deploy from a branch**, escolha `main` e `/ (root)`, depois salve.

## Observação
O projeto é uma demonstração front-end. Não possui painel administrativo, banco de dados, gestão real de pedidos, cálculo automático por bairro ou integração com pagamento. O botão de finalização abre uma mensagem pronta no WhatsApp após configurar o número da loja.
