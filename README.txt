ORATEC Site - estrutura estática para Cloudflare Pages

Arquivos principais:
- /index.html
- /solucoes.html
- /produtos/ficha-flow.html
- /produtos/zedaka.html
- /_privado/identidade.html

Biblioteca oculta:
- Rota: /_privado/identidade.html
- Observação: oculta e com noindex, mas não protegida por senha.

Para publicar no Cloudflare Pages:
1) Crie um projeto em Cloudflare Pages.
2) Envie o conteúdo deste diretório.
3) Defina o domínio oratec.com.br.

Formulário de contato (/api/contact):
- usa Pages Functions e a API Resend; envio para contato@oratec.com.br.
- no Resend, verificar o domínio oratec.com.br e criar uma chave API de envio.
- no projeto Pages, criar RESEND_API_KEY em Settings > Variables and Secrets,
  como segredo criptografado para Production; refazer o deploy após configurar.
- nunca salvar a chave API no GitHub.

Antes de divulgar o site:
- confirmar que contato@oratec.com.br está recebendo mensagens.
- inserir prints reais dos sistemas quando disponíveis.
- se desejar, proteger a rota /_privado/ com Cloudflare Access.
