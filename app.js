
const produtos=[
{nome:'Sticker Geral',preco:19.90},
{nome:'Sticker Arquibancada',preco:24.90},
{nome:'Sticker Cultura',preco:14.90},
{nome:'Sticker Retro',preco:29.90},
{nome:'Sticker Coleção',preco:34.90}
];

const grid=document.querySelector('.grid');
produtos.forEach(p=>{
 const el=document.createElement('div');
 el.className='card';
 el.innerHTML=`<h3>${p.nome}</h3><p>R$ ${p.preco}</p><button>Adicionar</button>`;
 grid.appendChild(el);
});
