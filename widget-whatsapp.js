(function () {
    const config = window.WidgetWhatsConfig || {};
    const fields = config.fields || [];
    const entity = config.entity || 'people';
    const deal = config.deal === true;
  
    const createInput = (field) => {
      const wrapper = document.createElement('div');
      wrapper.style.marginBottom = '10px';
  
      const label = document.createElement('label');
      label.textContent = field.label;
      label.style.display = 'block';
      label.style.fontSize = '14px';
      label.style.marginBottom = '4px';
  
      const input = document.createElement('input');
      input.name = field.name;
      input.type = field.type;
      input.required = field.required;
      input.style.width = '100%';
      input.style.padding = '8px';
      input.style.border = '1px solid #ccc';
      input.style.borderRadius = '8px';
  
      if (field.name === 'whatsapp') {
        input.addEventListener('input', (e) => {
          let val = e.target.value.replace(/\D/g, '');
          val = val.substring(0, 11);
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
  
    const createForm = () => {
      const form = document.createElement('form');
      form.style.padding = '16px';
  
      const message = document.createElement('p');
      message.textContent = 'Olá! Preencha os dados para que possamos te atender via WhatsApp.';
      message.style.marginBottom = '12px';
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
  
        const payload = {
          ...data,
          entity: entity,
          deal: deal
        };
  
        fetch('https://wn8n.agendor.com.br/webhook/widget-whatsapp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }).then(() => {
          form.innerHTML = '<p>Obrigado! Entraremos em contato em breve.</p>';
        }).catch(() => {
          alert('Erro ao enviar. Tente novamente.');
        });
      });
  
      return form;
    };
  
    const createWidget = () => {
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.bottom = '20px';
      container.style.right = '20px';
      container.style.zIndex = '9999';
  
      const button = document.createElement('button');
      button.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style="width: 24px; height: 24px;">';
      button.style.background = '#25D366';
      button.style.border = 'none';
      button.style.padding = '14px';
      button.style.borderRadius = '50%';
      button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
      button.style.cursor = 'pointer';
  
      const popover = document.createElement('div');
      popover.style.display = 'none';
      popover.style.background = '#fff';
      popover.style.border = '1px solid #ddd';
      popover.style.borderRadius = '12px';
      popover.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      popover.style.padding = '0';
      popover.style.marginBottom = '10px';
      popover.style.width = '280px';
  
      const form = createForm();
      popover.appendChild(form);
  
      button.addEventListener('click', () => {
        popover.style.display = popover.style.display === 'none' ? 'block' : 'none';
      });
  
      container.appendChild(popover);
      container.appendChild(button);
      document.body.appendChild(container);
    };
  
    document.addEventListener('DOMContentLoaded', createWidget);
  })();
  