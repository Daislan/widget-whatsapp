(function () {
  const config = window.WidgetWhatsConfig || {};
  const fields = config.fields || [];
  const entity = config.entity || 'people';
  const deal = config.deal === true;
  const clientId = config.clientId || null;

  if (!clientId) {
    console.warn("Widget WhatsApp: clientId não está definido.");
  }

  const createInput = (field) => {
    const wrapper = document.createElement('div');

    const label = document.createElement('label');
    label.textContent = field.label;
    label.style.display = 'block';
    label.style.marginBottom = '4px';

    const input = document.createElement('input');
    input.name = field.name;
    input.type = field.type;
    input.required = field.required;
    input.style.width = '100%';
    input.style.padding = '8px';
    input.style.border = '1px solid #ccc';
    input.style.borderRadius = '8px';
    input.style.marginBottom = '10px';

    if (field.name === 'whatsapp') {
      input.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 11);
        const ddd = val.substring(0, 2);
        const parte1 = val.substring(2, 7);
        const parte2 = val.substring(7, 11);
        let formatted = '+55 ';
        if (val.length > 2) formatted += `(${ddd}) `;
        if (val.length > 7) formatted += `${parte1}-${parte2}`;
        else if (parte1) formatted += parte1;
        input.value = formatted.trim();
      });
    }

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    return wrapper;
  };

  const createForm = (shadowRoot, popover) => {
    const form = document.createElement('form');

    const message = document.createElement('p');
    message.textContent = 'Olá! Preencha os dados para atendimento via WhatsApp:';
    form.appendChild(message);

    fields.forEach(field => {
      form.appendChild(createInput(field));
    });

    const button = document.createElement('button');
    button.textContent = 'Enviar';
    button.type = 'submit';
    button.style.background = '#25D366';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.padding = '10px 20px';
    button.style.borderRadius = '8px';
    button.style.cursor = 'pointer';

    form.appendChild(button);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {};
      fields.forEach(f => {
        const value = form.querySelector(`[name=${f.name}]`)?.value;
        data[f.name] = value;
      });

      const payload2 = {
        ...data,
        clientId: clientId,
        entity: entity,
        "teste": "123"
      };

      fetch('https://wn8n.agendor.com.br/webhook/widget-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload2),
      })
        .then(() => {
          form.innerHTML = '<p>testando o bug.</p>';
        })
        .catch(() => {
          alert('Erro ao enviar. Tente novamente.');
        });
    });

    popover.appendChild(form);
  };

  const createWidget = () => {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';

    const shadow = container.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      .popover {
        background: white;
        border: 1px solid #ddd;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        padding: 16px;
        width: 280px;
        font-family: Arial, sans-serif;
        display: none;
      }
      .button {
        background: #25D366;
        border: none;
        padding: 14px;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      }
      .button img {
        width: 24px;
        height: 24px;
      }
    `;

    shadow.appendChild(style);

    const wrapper = document.createElement('div');

    const popover = document.createElement('div');
    popover.className = 'popover';
    wrapper.appendChild(popover);

    const button = document.createElement('button');
    button.className = 'button';
    button.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />';
    button.addEventListener('click', () => {
      popover.style.display = popover.style.display === 'none' ? 'block' : 'none';
    });
    wrapper.appendChild(button);

    shadow.appendChild(wrapper);
    document.body.appendChild(container);

    createForm(shadow, popover);
  };

  document.addEventListener('DOMContentLoaded', createWidget);
})();
