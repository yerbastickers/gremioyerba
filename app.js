
const produtos=[
  {nome:'Yerba Redondo',preco:5.00,imagem:'Imagens/yerba redondo.png'},
  {nome:'Libertadores',preco:5.00,imagem:'Imagens/LIBERTADORES.png'},
  {nome:'Plata y Miedo',preco:5.00,imagem:'Imagens/plata y miedo.png'},
  {nome:'Prancheta 1',preco:5.00,imagem:'Imagens/Prancheta 1.png'},
  {nome:'Prancheta 2',preco:5.00,imagem:'Imagens/Prancheta 2.png'},
  {nome:'Prancheta 3',preco:5.00,imagem:'Imagens/Prancheta 3.png'},
  {nome:'Prancheta 4',preco:5.00,imagem:'Imagens/Prancheta 4.png'}
];

const grid=document.querySelector('.grid');
const cartItemsContainer=document.querySelector('.cart-items');
const cartEmpty=document.querySelector('.cart-empty');
const cartTotal=document.querySelector('.cart-total');
const orderForm=document.getElementById('orderForm');
const orderDetailsField=document.getElementById('orderDetailsField');
const customerNameInput=document.getElementById('customerName');
const customerCPFInput=document.getElementById('customerCPF');
const deliveryTypeSelect=document.getElementById('deliveryType');
const addressBox=document.getElementById('addressBox');
const customerCEPInput=document.getElementById('customerCEP');
const customerStreetInput=document.getElementById('customerStreet');
const customerNumberInput=document.getElementById('customerNumber');
const customerComplementInput=document.getElementById('customerComplement');
const customerNeighborhoodInput=document.getElementById('customerNeighborhood');
const customerCityInput=document.getElementById('customerCity');
const customerStateInput=document.getElementById('customerState');
const customerPhoneInput=document.getElementById('customerPhone');
const customerEmailInput=document.getElementById('customerEmail');
const PIX_KEY='05324755001';
let cart=[];

function renderCart(){
  cartItemsContainer.innerHTML='';
  if(cart.length===0){
    cartEmpty.style.display='block';
    cartTotal.textContent='';
    return;
  }

  cartEmpty.style.display='none';
  let total=0;

  cart.forEach(item=>{
    const line=document.createElement('div');
    line.className='cart-item';
    const subtotal=item.preco*item.quantidade;
    total += subtotal;
    line.innerHTML=`
      <div class="item-details">
        <strong>${item.nome}</strong>
        <div class="item-quantity">
          <button class="quantity-btn" data-action="decrease" data-name="${item.nome}">-</button>
          <span>${item.quantidade}</span>
          <button class="quantity-btn" data-action="increase" data-name="${item.nome}">+</button>
        </div>
      </div>
      <div class="item-price"><strong>R$ ${subtotal.toFixed(2)}</strong></div>
    `;
    cartItemsContainer.appendChild(line);
  });

  cartTotal.textContent=`Total: R$ ${total.toFixed(2)} | PIX: ${PIX_KEY}`;
}

function addToCart(index){
  const produto=produtos[index];
  const existing=cart.find(item=>item.nome===produto.nome);
  if(existing){
    existing.quantidade += 1;
  } else {
    cart.push({nome:produto.nome,preco:produto.preco,quantidade:1});
  }
  renderCart();
}

function updateQuantity(nome, delta){
  const item=cart.find(i=>i.nome===nome);
  if(!item) return;
  item.quantidade += delta;
  if(item.quantidade <= 0){
    cart = cart.filter(i=>i.nome !== nome);
  }
  renderCart();
}

function clearCart(){
  cart = [];
  renderCart();
}

produtos.forEach((p,index)=>{
  const el=document.createElement('div');
  el.className='card';
  el.innerHTML=`<div class="product-image"><img src="${p.imagem}" alt="${p.nome}"><span class="watermark">VISUALIZAÇÃO</span></div><h3>${p.nome}</h3><p>R$ ${p.preco.toFixed(2)}</p><button class="add-button" data-index="${index}">Adicionar</button>`;
  grid.appendChild(el);
});

grid.addEventListener('click', event => {
  if(event.target.matches('.add-button')){
    addToCart(Number(event.target.dataset.index));
  }
});

const cartSection=document.querySelector('.cart-section');
cartSection.addEventListener('click', event => {
  if(event.target.matches('.quantity-btn')){
    const action=event.target.dataset.action;
    const nome=event.target.dataset.name;
    updateQuantity(nome, action === 'increase' ? 1 : -1);
  }
  if(event.target.matches('.empty-cart-button')){
    clearCart();
  }
  if(event.target.matches('.close-order-button')){
    closeOrder();
  }
});

function updateAddressVisibility(){
  if (!addressBox || !deliveryTypeSelect) return;
  addressBox.style.display = deliveryTypeSelect.value === 'Envio' ? 'block' : 'none';
}

if (deliveryTypeSelect) {
  deliveryTypeSelect.addEventListener('change', updateAddressVisibility);
}

function closeOrder(){
  if(cart.length === 0){
    alert('O carrinho está vazio. Adicione produtos antes de fechar o pedido.');
    return;
  }

  const customerName = customerNameInput ? customerNameInput.value.trim() : '';
  const customerCPF = customerCPFInput ? customerCPFInput.value.trim() : '';
  const deliveryType = deliveryTypeSelect ? deliveryTypeSelect.value : 'Retirada';
  const customerCEP = customerCEPInput ? customerCEPInput.value.trim() : '';
  const customerStreet = customerStreetInput ? customerStreetInput.value.trim() : '';
  const customerNumber = customerNumberInput ? customerNumberInput.value.trim() : '';
  const customerComplement = customerComplementInput ? customerComplementInput.value.trim() : '';
  const customerNeighborhood = customerNeighborhoodInput ? customerNeighborhoodInput.value.trim() : '';
  const customerCity = customerCityInput ? customerCityInput.value.trim() : '';
  const customerState = customerStateInput ? customerStateInput.value.trim() : '';
  const customerPhone = customerPhoneInput ? customerPhoneInput.value.trim() : '';
  const customerEmail = customerEmailInput ? customerEmailInput.value.trim() : '';

  if(!customerName){
    alert('Preencha seu nome antes de fechar o pedido.');
    return;
  }
  if(!customerCPF){
    alert('Preencha o CPF antes de fechar o pedido.');
    return;
  }
  if(!customerPhone){
    alert('Preencha o telefone/WhatsApp antes de fechar o pedido.');
    return;
  }
  if(!customerEmail){
    alert('Preencha o e-mail antes de fechar o pedido.');
    return;
  }
  if(deliveryType === 'Envio'){
    if(!customerCEP || !customerStreet || !customerNumber || !customerNeighborhood || !customerCity || !customerState){
      alert('Preencha todos os campos de endereço para envio.');
      return;
    }
  }

  const lines = [
    'Pedido fechado',
    '',
    `Seu nome: ${customerName}`,
    `CPF: ${customerCPF}`,
    `Tipo de pedido: ${deliveryType}`,
    `Telefone / WhatsApp: ${customerPhone}`,
    `E-mail: ${customerEmail}`
  ];

  if(deliveryType === 'Envio'){
    lines.push(
      `CEP: ${customerCEP}`,
      `Rua / Avenida: ${customerStreet}`,
      `Número: ${customerNumber}`,
      `Complemento: ${customerComplement || '---'}`,
      `Bairro: ${customerNeighborhood}`,
      `Cidade: ${customerCity}`,
      `Estado: ${customerState}`
    );
  }

  lines.push('', 'Produtos e quantidades:');
  cart.forEach(item => {
    lines.push(`- ${item.nome}: ${item.quantidade}`);
  });

  if (orderDetailsField) {
    orderDetailsField.value = lines.join('\r\n');
  }

  if (orderForm) {
    orderForm.submit();
  }

  const blob = new Blob([lines.join('\r\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'pedido.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

renderCart();

const contactPopupButton = document.getElementById('contactPopupButton');
const contactPopupPanel = document.getElementById('contactPopupPanel');
const contactPopupClose = document.getElementById('contactPopupClose');

if (contactPopupButton && contactPopupPanel && contactPopupClose) {
  contactPopupButton.addEventListener('click', event => {
    event.stopPropagation();
    contactPopupPanel.classList.toggle('open');
  });

  contactPopupClose.addEventListener('click', event => {
    event.stopPropagation();
    contactPopupPanel.classList.remove('open');
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.contact-popup')) {
      contactPopupPanel.classList.remove('open');
    }
  });
}
