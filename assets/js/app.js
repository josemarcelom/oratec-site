const btn = document.querySelector('.mobile-toggle');
const menu = document.querySelector('.menu');
if (btn && menu) {
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
}

const form = document.querySelector('#contact-form');
if (form) {
  const status = document.querySelector('#form-status');
  const submit = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    submit.disabled = true;
    status.textContent = 'Enviando mensagem…';
    status.className = 'form-status';
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Falha no envio');
      form.reset();
      status.textContent = 'Mensagem enviada. Retornaremos pelo e-mail informado.';
      status.classList.add('success');
    } catch {
      status.textContent = 'Não foi possível enviar agora. Escreva para contato@oratec.com.br ou use o WhatsApp.';
      status.classList.add('error');
    } finally {
      submit.disabled = false;
    }
  });
}
