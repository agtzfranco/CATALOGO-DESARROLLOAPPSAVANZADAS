// ===== DATOS DE PRODUCTOS =====
const products = [
  {
    id: 1,
    title: "CINTURÓN",
    price: 200.00,
    category: "accesorios",
    description: "Tus outfits no estarán completos sin este cinturón. Cinturón con hebilla metálica ajustable a cualquier talla. Longitud de 124 cm.",
    features: [
      "Cuero vegano sintético",
      "Balas metálicas",
      "Hebilla doble ajustable",
      "Acabado en acero inoxidable",
      "Ajustable a tallas más chicas"
    ],
    image: "",
    hasVariants: false
  },
  {
    id: 2,
    title: "CAMISA",
    price: 499.00,
    category: "playeras",
    description: "Playera calidad premium, manga corta color negra, elaborada con algodón peinado pesado nacional de 250 gr, con gráfico impreso por la parte delantera y trasera.",
    features: [
      "Premium t-shirt",
      "Color: Negro",
      "100% Algodón peinado pesado",
      "Cuello de canalé",
      "Corte holgado",
      "Tacto suave",
      "Hecho en México"
    ],
    image: "",
    hasVariants: true
  },
  {
    id: 3,
    title: "PLAYERA",
    price: 399.00,
    category: "playeras",
    description: "Playera de manga corta en color negra, elaborada con algodón peinado de 190 gr. con gráfico impreso en serigrafía por la parte delantera. Corte ajustado y corto.",
    features: [
      "Color: Negro",
      "100% Algodón peinado",
      "Cuello de canalé",
      "Corte ajustado",
      "Tacto suave",
      "Hecho en México"
    ],
    image: "",
    hasVariants: true
  },
  {
    id: 4,
    title: "PANTALON",
    price: 150.00,
    originalPrice: 399.00,
    category: "vestidos",
    onSale: true,
    description: "Vestido estilo Peter Pan manga corta, elaborado en French terry en tono negro, con gráfico impreso en la parte delantera, cierre ajustable por la parte trasera.",
    features: [
      "95% Algodón 5% Elastano",
      "Corte unisex",
      "Cierre ajustable trasero",
      "Gráfico impreso delantero",
      "Hecho en México"
    ],
    image: "",
    hasVariants: true
  }
];

// ===== ESTADO =====
let cart = [];
let currentCurrency = 'MXN';
const exchangeRate = { MXN: 1, USD: 0.058 };

// ===== ELEMENTOS DEL DOM =====
const productsGrid = document.getElementById('productsGrid');
const cartCount = document.getElementById('cartCount');
const cartBtn = document.getElementById('cartBtn');
const quickViewModal = document.getElementById('quickViewModal');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const sortSelect = document.getElementById('sort');
const categorySelect = document.getElementById('category');
const currencySelect = document.getElementById('currency');

// ===== FUNCIONES =====

// Formatear precio según moneda
function formatPrice(price) {
  const converted = price * exchangeRate[currentCurrency];
  return new Intl.NumberFormat(currentCurrency === 'MXN' ? 'es-MX' : 'en-US', {
    style: 'currency',
    currency: currentCurrency,
    minimumFractionDigits: 2
  }).format(converted);
}

// Renderizar productos
function renderProducts(productsToRender) {
  productsGrid.innerHTML = '';
  
  productsToRender.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.category = product.category;
    
    const saleBadge = product.onSale 
      ? `<span class="sale-badge">¡Oferta!</span>` 
      : '';
    
    const priceHTML = product.onSale
      ? `<span class="original">${formatPrice(product.originalPrice)}</span> ${formatPrice(product.price)}`
      : `${formatPrice(product.price)}`;
    
    const actionButton = product.hasVariants
      ? `<button class="btn btn-secondary" onclick="openQuickView(${product.id})">Seleccionar opciones</button>`
      : `<button class="btn btn-primary" onclick="addToCart(${product.id})">Añadir al carrito</button>`;
    
    card.innerHTML = `
      ${saleBadge}
      <div class="product-image">${product.image}</div>
      <div class="product-info">
        <h3 class="product-title">${product.title}</h3>
        <p class="product-price">${priceHTML}</p>
        <p class="product-description">${product.description}</p>
        <ul class="product-features">
          ${product.features.slice(0, 3).map(f => `<li>${f}</li>`).join('')}
        </ul>
        <div class="product-actions">
          ${actionButton}
          <button class="btn btn-secondary" onclick="openQuickView(${product.id})">
            <i class="fas fa-eye"></i> Quick View
          </button>
        </div>
      </div>
    `;
    
    productsGrid.appendChild(card);
  });
}

// Abrir modal Quick View
function openQuickView(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  const priceHTML = product.onSale
    ? `<span class="original">${formatPrice(product.originalPrice)}</span> ${formatPrice(product.price)}`
    : `${formatPrice(product.price)}`;
  
  modalBody.innerHTML = `
    <div class="modal-image">${product.image}</div>
    <div class="modal-details">
      <h2>${product.title}</h2>
      <p class="modal-price">${priceHTML}</p>
      <p class="modal-description">${product.description}</p>
      <p><strong>ALL FASHION IS UNISEX</strong></p>
      <ul class="modal-features">
        ${product.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
      <div class="modal-actions">
        ${product.hasVariants
          ? `<button class="btn btn-secondary" onclick="alert('Selecciona tus opciones en la página del producto')">Seleccionar opciones</button>`
          : `<button class="btn btn-primary" onclick="addToCart(${product.id}); closeModal();">Añadir al carrito</button>`
        }
        <button class="btn btn-secondary" onclick="closeModal()">Continuar</button>
      </div>
    </div>
  `;
  
  quickViewModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Cerrar modal
function closeModal() {
  quickViewModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Añadir al carrito
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  updateCartCount();
  showToast(`✅ ${product.title} añadido al carrito`);
}

// Actualizar contador del carrito
function updateCartCount() {
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = total;
}

// Mostrar notificación toast
function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Filtrar y ordenar productos
function filterAndSortProducts() {
  let filtered = [...products];
  
  // Filtro por categoría
  const category = categorySelect.value;
  if (category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }
  
  // Ordenamiento
  const sortBy = sortSelect.value;
  switch(sortBy) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }
  
  renderProducts(filtered);
}

// ===== EVENTOS =====

// Cerrar modal al hacer clic fuera o en la X
modalClose.addEventListener('click', closeModal);
quickViewModal.addEventListener('click', (e) => {
  if (e.target === quickViewModal) closeModal();
});

// Filtros y ordenamiento
sortSelect.addEventListener('change', filterAndSortProducts);
categorySelect.addEventListener('change', filterAndSortProducts);

// Cambio de moneda
currencySelect.addEventListener('change', (e) => {
  currentCurrency = e.target.value;
  renderProducts(products); // Re-renderizar con nuevos precios
  showToast(`💱 Moneda cambiada a ${currentCurrency}`);
});

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
  renderProducts(products);
  updateCartCount();
});

// Hacer funciones globales para los onclick en HTML
window.openQuickView = openQuickView;
window.closeModal = closeModal;

window.addToCart = addToCart;
