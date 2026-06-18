// Array penampung data belanjaan
let cart = [];

// Fungsi menambah item ke keranjang
function addToCart(namaProduk, harga) {
    let itemSama = cart.find(item => item.name === namaProduk);
    
    if (itemSama) {
        itemSama.quantity += 1;
    } else {
        cart.push({ name: namaProduk, price: harga, quantity: 1 });
    }
    
    updateCartCount();
}

// Fungsi mengupdate indikator angka merah di logo keranjang
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;
}

// Fungsi membuka pop-up modal rincian checkout
function bukaKeranjang() {
    const modal = document.getElementById('cartModal');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalHargaContainer = document.getElementById('total-harga');

    modal.style.display = 'flex';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #888; padding: 2.5rem 0; font-size: 0.9rem;">Keranjang belanja masih kosong.</p>';
        totalHargaContainer.innerText = '0';
        return;
    }

    cartItemsContainer.innerHTML = '';
    let totalHarga = 0;

    cart.forEach(item => {
        let subTotal = item.price * item.quantity;
        totalHarga += subTotal;

        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <span><strong>${item.name}</strong> (x${item.quantity})</span>
                <span>Rp ${subTotal.toLocaleString('id-ID')}</span>
            </div>
        `;
    });

    totalHargaContainer.innerText = totalHarga.toLocaleString('id-ID');
}

// Fungsi menutup pop-up modal
function tutupKeranjang() {
    document.getElementById('cartModal').style.display = 'none';
}

// Menutup modal otomatis jika area latar belakang hitam diklik
window.onclick = function(event) {
    const modal = document.getElementById('cartModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Fungsi checkout menembak rincian nota belanja ke WhatsApp Admin Kafe
function checkoutPesanan() {
    if (cart.length === 0) {
        alert('Keranjang Anda kosong!');
        return;
    }

    let pesan = "Halo Kopi Senja, saya mau pesan:\n\n";
    let totalHarga = 0;
    
    cart.forEach(item => {
        let subTotal = item.price * item.quantity;
        totalHarga += subTotal;
        pesan += `- ${item.name} (x${item.quantity}) : Rp ${subTotal.toLocaleString('id-ID')}\n`;
    });
    
    pesan += `\n*Total Akhir: Rp ${totalHarga.toLocaleString('id-ID')}*`;
    
    // Silakan ganti nomor WhatsApp tujuan di bawah ini jika diperlukan
    let urlWhatsApp = "https://wa.me/628123456789?text=" + encodeURIComponent(pesan);
    
    window.open(urlWhatsApp, '_blank');
    cart = [];
    updateCartCount();
    tutupKeranjang();
}