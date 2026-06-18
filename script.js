// ====== DATA KERANJANG GLOBAL ======
let cart = [];

// ==========================================================================
// 1. SISTEM INTERAKTIF FILTER MENU
// ==========================================================================
function filterMenu(category, buttonElement) {
    // 1. Ubah status tombol aktif
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    buttonElement.classList.add('active');

    // 2. Saring kartu menu dengan efek transisi halus
    const menuCards = document.querySelectorAll('.menu-card');
    menuCards.forEach(card => {
        const itemCategory = card.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// ==========================================================================
// 2. SISTEM KERANJANG BELANJA (CART SYSTEM)
// ==========================================================================

// Fungsi tambah menu ke keranjang
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: name, price: price, quantity: 1 });
    }
    
    renderCart();
    triggerFloatingCartAnimation();
    
    // Memicu animasi angka bergerak pada item yang baru ditambah (jika keranjang terbuka)
    setTimeout(() => {
        const qtyElement = document.getElementById(`qty-${name.replace(/\s+/g, '-')}`);
        if (qtyElement) {
            qtyElement.classList.remove('qty-pop');
            void qtyElement.offsetWidth; 
            qtyElement.classList.add('qty-pop');
        }
    }, 50);
}

// Fungsi ubah kuantitas (+ atau -) dengan animasi bergerak
function changeQuantity(name, delta) {
    const item = cart.find(item => item.name === name);
    if (!item) return;
    
    item.quantity += delta;
    
    // Jika jumlahnya 0, hapus dari list keranjang
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.name !== name);
    }
    
    renderCart();
    triggerFloatingCartAnimation();
    
    // Efek gerak balon/pop pada angka yang berubah biar interaktif
    const qtyElement = document.getElementById(`qty-${name.replace(/\s+/g, '-')}`);
    if (qtyElement) {
        qtyElement.classList.remove('qty-pop');
        void qtyElement.offsetWidth; // Reset animasi browser (reflow)
        qtyElement.classList.add('qty-pop');
    }
    
    // Sembunyikan keranjang otomatis di HP jika belanjaan kosong
    if (cart.length === 0) {
        toggleMobileCart(false);
    }
}

// Fungsi render/gambar ulang tampilan isi keranjang
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const floatingCartBadge = document.getElementById('floating-cart-badge');
    const floatingCartTotal = document.getElementById('floating-cart-total');
    const floatingCartBar = document.getElementById('floating-cart-bar');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-text">Keranjang masih kosong.</p>';
        cartTotalPrice.innerText = 'Rp 0';
        floatingCartBadge.innerText = '0';
        floatingCartTotal.innerText = 'Rp 0';
        floatingCartBar.classList.remove('active');
        return;
    }
    
    // Hitung total item & total harga uang
    let totalItems = 0;
    let totalPrice = 0;
    let htmlContent = '';
    
    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
        
        // Buat ID unik bebas spasi untuk elemen angka kuantitas
        const elementId = `qty-${item.name.replace(/\s+/g, '-')}`;
        
        htmlContent += `
            <div class="cart-item-row">
                <div>
                    <strong style="display:block; color:#4e342e;">${item.name}</strong>
                    <span style="color:#bc8f8f; font-size:0.78rem;">Rp ${item.price.toLocaleString('id-ID')}</span>
                </div>
                <div class="cart-item-qty-controls">
                    <button class="btn-qty" onclick="changeQuantity('${item.name}', -1)">-</button>
                    <span class="qty-number" id="${elementId}">${item.quantity}</span>
                    <button class="btn-qty" onclick="changeQuantity('${item.name}', 1)">+</button>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = htmlContent;
    cartTotalPrice.innerText = `Rp ${totalPrice.toLocaleString('id-ID')}`;
    
    // Update data bar melayang (Floating Bar Mobile)
    floatingCartBadge.innerText = totalItems;
    floatingCartTotal.innerText = `Rp ${totalPrice.toLocaleString('id-ID')}`;
    floatingCartBar.classList.add('active');
}

// ==========================================================================
// 3. ANIMASI MIKRO & WINDOW UTILITIES
// ==========================================================================

// Fungsi buka/tutup lembaran keranjang belanja di HP (Bottom Sheet)
function toggleMobileCart(isOpen) {
    const sidebarCart = document.getElementById('sidebar-cart-container');
    if (sidebarCart) {
        if (isOpen && cart.length > 0) {
            sidebarCart.classList.add('active');
            document.body.style.overflow = 'hidden'; // Kunci scroll layar belakang
        } else {
            sidebarCart.classList.remove('active');
            document.body.style.overflow = ''; // Aktifkan scroll kembali
        }
    }
}

// Efek getar balon pada bar bawah saat item bertambah
function triggerFloatingCartAnimation() {
    const floatingCartBar = document.getElementById('floating-cart-bar');
    if (floatingCartBar) {
        floatingCartBar.classList.remove('cart-bump');
        void floatingCartBar.offsetWidth; 
        floatingCartBar.classList.add('cart-bump');
    }
}

// Fungsi kirim pesanan otomatis langsung terformat ke WhatsApp Kasir
function checkoutToWhatsApp() {
    if (cart.length === 0) return;
    
    let nomorWhatsApp = "628123456789"; // GANTI DENGAN NOMOR HP KAFEMU (Awali kode negara 62)
    let teksPesan = "Halo Kopi Senja, saya ingin memesan menu ini melalui Web:\n\n";
    let totalBelanja = 0;
    
    cart.forEach((item, index) => {
        let subTotal = item.price * item.quantity;
        totalBelanja += subTotal;
        teksPesan += `${index + 1}. *${item.name}* (${item.quantity}x) = Rp ${subTotal.toLocaleString('id-ID')}\n`;
    });
    
    teksPesan += `\n💰 *Total Pembayaran: Rp ${totalBelanja.toLocaleString('id-ID')}*\n\n Mohon diproses ya, terima kasih!`;
    
    // Encode teks agar aman dibaca url browser
    let linkWhatsApp = `https://wa.me/${nomorWhatsApp}?text=${encodeURIComponent(teksPesan)}`;
    window.open(linkWhatsApp, '_blank');
}

// Animasi kemunculan elemen saat layar di-scroll (Scroll Animation observer)
document.addEventListener("DOMContentLoaded", function () {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, { threshold: 0.05 });

    animatedElements.forEach(el => observer.observe(el));
});