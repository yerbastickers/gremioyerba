
const produtos=[
  {nome:'Pack ',preco:20.00,imagem:'Imagens/Pack .png',destaque:true,unidades:4},
  {nome:'Bob Marley',preco:5.00,imagem:'Imagens/Bob Marley.png'},
  {nome:'Grêmio Yerba Cerveza',preco:5.00,imagem:'Imagens/Grêmio Yerba Cerveza.png'},
  {nome:'Legalicen',preco:5.00,imagem:'Imagens/Legalicen.png'},
  {nome:'Libertadores',preco:5.00,imagem:'Imagens/Libertadores.png'},
  {nome:'MF Doom (1)',preco:5.00,imagem:'Imagens/MF Doom (1).png'},
  {nome:'Plata y Miedo',preco:5.00,imagem:'Imagens/Plata y Miedo.png'},
  {nome:'Smile',preco:5.00,imagem:'Imagens/Smile.png'},
  {nome:'Yerba redondo',preco:5.00,imagem:'Imagens/Yerba redondo.png'},
  {nome:'Yerba Trapo',preco:5.00,imagem:'Imagens/Yerba Trapo.png'},
  {nome:'Yerbaboys Gothic',preco:5.00,imagem:'Imagens/Yerbaboys Gothic.png'},
  {nome:'Yerbaboys TAG',preco:5.00,imagem:'Imagens/Yerbaboys TAG.png'}
];

const grid=document.querySelector('.grid');
const cartItemsContainer=document.querySelector('.cart-items');
const cartEmpty=document.querySelector('.cart-empty');
const cartTotal=document.querySelector('.cart-total');
const cartCount=document.getElementById('cartCount');
const headerCart=document.querySelector('.header-cart');
const emptyCartButton=document.querySelector('.empty-cart-button');
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
const PIX_KEY='d5b05951-6d8a-423d-8c5a-2a335f5b3f53';
const CART_STORAGE_KEY='gremio-yerba-cart';
const currencyFormatter=new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' });
let cart=loadCart();

function formatCurrency(value){
  return currencyFormatter.format(value);
}

function loadCart(){
  try {
    const savedCart=JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
    if(!Array.isArray(savedCart)) return [];

    return savedCart.map(savedItem=>{
      const product=produtos.find(item=>item.nome===savedItem.nome);
      if(!product) return null;
      return { ...product, quantidade:Math.max(1, Number(savedItem.quantidade) || 1) };
    }).filter(Boolean);
  } catch {
    return [];
  }
}

function saveCart(){
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart.map(item=>({ nome:item.nome, quantidade:item.quantidade }))));
  } catch {
    // O carrinho continua funcionando quando o navegador bloqueia armazenamento local.
  }
}

function renderCart(){
  cartItemsContainer.innerHTML='';
  const itemCount=cart.reduce((total, item)=>total+item.quantidade, 0);

  if(cartCount){
    cartCount.textContent=itemCount;
    cartCount.setAttribute('aria-label', `${itemCount} ${itemCount===1 ? 'item' : 'itens'} no carrinho`);
  }
  if(headerCart) headerCart.classList.toggle('has-items', itemCount > 0);
  if(emptyCartButton) emptyCartButton.disabled=itemCount===0;

  if(cart.length===0){
    cartEmpty.hidden=false;
    cartTotal.innerHTML=`
      <div class="cart-total-row"><span>Subtotal</span><span>${formatCurrency(0)}</span></div>
      <div class="cart-total-row cart-total-final"><span>Total</span><strong>${formatCurrency(0)}</strong></div>
    `;
    return;
  }

  cartEmpty.hidden=true;
  let total=0;

  cart.forEach(item=>{
    const line=document.createElement('div');
    line.className='cart-item';
    const subtotal=item.preco*item.quantidade;
    total += subtotal;
    line.innerHTML=`
      <img class="cart-item-image" src="${item.imagem}" alt="${item.nome}">
      <div class="item-details">
        <strong>${item.nome}</strong>
        <span class="item-unit-price">${formatCurrency(item.preco)} cada</span>
        <div class="item-quantity">
          <button type="button" class="quantity-btn" data-action="decrease" data-name="${item.nome}" aria-label="Diminuir quantidade de ${item.nome}">−</button>
          <span aria-label="Quantidade">${item.quantidade}</span>
          <button type="button" class="quantity-btn" data-action="increase" data-name="${item.nome}" aria-label="Aumentar quantidade de ${item.nome}">+</button>
        </div>
      </div>
      <div class="item-price">
        <strong>${formatCurrency(subtotal)}</strong>
        <button type="button" class="remove-item-button" data-name="${item.nome}">Remover</button>
      </div>
    `;
    cartItemsContainer.appendChild(line);
  });

  cartTotal.innerHTML=`
    <div class="cart-total-row"><span>Itens (${itemCount})</span><span>${formatCurrency(total)}</span></div>
    <div class="cart-total-row"><span>Entrega</span><span>Calculada após o CEP</span></div>
    <div class="cart-total-row cart-total-final"><span>Total dos produtos</span><strong>${formatCurrency(total)}</strong></div>
  `;
}

function addToCart(index){
  const produto=produtos[index];
  const existing=cart.find(item=>item.nome===produto.nome);
  if(existing){
    existing.quantidade += 1;
  } else {
    cart.push({ ...produto, quantidade:1 });
  }
  saveCart();
  renderCart();
}

function updateQuantity(nome, delta){
  const item=cart.find(i=>i.nome===nome);
  if(!item) return;
  item.quantidade += delta;
  if(item.quantidade <= 0){
    cart = cart.filter(i=>i.nome !== nome);
  }
  saveCart();
  renderCart();
}

function removeFromCart(nome){
  cart=cart.filter(item=>item.nome !== nome);
  saveCart();
  renderCart();
}

function clearCart(){
  cart = [];
  saveCart();
  renderCart();
}

produtos.forEach((p,index)=>{
  const el=document.createElement('div');
  el.className=`card${p.destaque ? ' card-featured' : ''}`;
  el.dataset.reveal='';
  el.style.setProperty('--reveal-delay', `${index * 90}ms`);
  const destaqueTag=p.destaque ? '<span class="featured-tag">Destaque</span>' : '';
  const unidadesInfo=p.unidades ? `<span class="unidades-info">${p.unidades} stickers</span>` : '';
  el.innerHTML=`${destaqueTag}<div class="product-image"><img src="${p.imagem}" alt="${p.nome}"><span class="watermark">Visualização</span></div><h3>${p.nome}</h3>${unidadesInfo}<p>R$ ${p.preco.toFixed(2)}</p><button class="add-button" data-index="${index}">Adicionar</button>`;
  grid.appendChild(el);
});

function initScrollReveal(){
  const elements=document.querySelectorAll('[data-reveal]');
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if(reducedMotion || !('IntersectionObserver' in window)){
    elements.forEach(element=>element.classList.add('is-revealed'));
    return;
  }

  const observer=new IntersectionObserver((entries, currentObserver)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-revealed');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -32px' });

  elements.forEach(element=>{
    element.classList.add('scroll-reveal');
    observer.observe(element);
  });
}

initScrollReveal();

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
  if(event.target.matches('.remove-item-button')){
    removeFromCart(event.target.dataset.name);
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
