const PRODUCTS = new Set(['Zedaka', 'Ficha Flow', 'Outro']);
const TOPICS = new Set(['Comercial', 'Financeiro', 'Dúvidas', 'Sugestões/Críticas']);
const json = (payload, status) => new Response(JSON.stringify(payload), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
});

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'Origem inválida.' }, 403);
  if (Number(request.headers.get('Content-Length') || 0) > 12000) return json({ error: 'Mensagem muito longa.' }, 413);

  let fields;
  try {
    fields = await request.formData();
  } catch {
    return json({ error: 'Formulário inválido.' }, 400);
  }
  const value = (key) => String(fields.get(key) || '').trim();
  if (value('website')) return json({ ok: true }, 200);

  const name = value('name');
  const email = value('email');
  const phone = value('phone');
  const product = value('product');
  const topic = value('topic');
  const message = value('message');
  if (!name || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
      phone.length > 30 || !PRODUCTS.has(product) || !TOPICS.has(topic) ||
      message.length < 10 || message.length > 5000) {
    return json({ error: 'Confira os campos e tente novamente.' }, 400);
  }
  if (!env.RESEND_API_KEY) return json({ error: 'Envio ainda não configurado.' }, 503);

  const body = [
    'Nova mensagem pelo site ORATEC', '',
    `Nome: ${name}`, `E-mail: ${email}`, `Telefone: ${phone || 'Não informado'}`,
    `Produto: ${product}`, `Assunto: ${topic}`, '', 'Mensagem:', message
  ].join('\n');
  try {
    const delivery = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'ORATEC <site@oratec.com.br>',
        to: ['contato@oratec.com.br'],
        reply_to: email,
        subject: `[ORATEC] ${topic} — ${product}`,
        text: body
      })
    });
    if (!delivery.ok) return json({ error: 'Falha no envio. Use o e-mail ou WhatsApp.' }, 502);
    return json({ ok: true }, 200);
  } catch {
    return json({ error: 'Falha no envio. Use o e-mail ou WhatsApp.' }, 502);
  }
}
