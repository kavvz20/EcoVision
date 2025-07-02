// Sample data for plastic waste products
const products = [
    {
        id: 1,
        type: 'PET',
        name: 'Clear PET Bottles',
        description: 'Clean, sorted PET bottles ready for recycling',
        price: 15,
        quantity: 500,
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 2,
        type: 'HDPE',
        name: 'HDPE Containers',
        description: 'Mixed color HDPE containers, cleaned and baled',
        price: 12,
        quantity: 300,
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 3,
        type: 'PP',
        name: 'Polypropylene Bags',
        description: 'Used PP bags in good condition for recycling',
        price: 10,
        quantity: 800,
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 4,
        type: 'LDPE',
        name: 'LDPE Film Scrap',
        description: 'Clean LDPE film scrap from packaging',
        price: 8,
        quantity: 400,
        location: 'Chennai',
        image: 'https://images.unsplash.com/photo-1560393464-5c69a73c5778?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 5,
        type: 'PS',
        name: 'Polystyrene Packaging',
        description: 'PS foam packaging material for recycling',
        price: 7,
        quantity: 200,
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1581235720764-46dae20b1a56?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 6,
        type: 'PVC',
        name: 'PVC Pipes Scrap',
        description: 'Clean PVC pipe cuttings, sorted by color',
        price: 9,
        quantity: 350,
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1581094794329-c811e29e21a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
];

// Cart and user data
let cart = [];
let currentUser = null;
const individualLimit = 100; // kg
const businessLimit = 1000; // kg

// DOM Elements
const productsContainer = document.getElementById('productsContainer');
const plasticTypeFilter = document.getElementById('plasticTypeFilter');
const locationFilter = document.getElementById('locationFilter');
const sortFilter = document.getElementById('sortFilter');
const loginBtn = document.getElementById('loginBtn');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const cartModal = document.getElementById('cartModal');
const closeButtons = document.querySelectorAll('.close');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegister = document.getElementById('showRegister');
const cartItems = document.getElementById('cartItems');
const totalQuantity = document.getElementById('totalQuantity');
const totalPrice = document.getElementById('totalPrice');
const checkoutBtn = document.getElementById('checkoutBtn');
const contactForm = document.getElementById('contactForm');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    
    // Check if user is logged in from localStorage
    if(localStorage.getItem('currentUser')) {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
        updateUIForLoggedInUser();
    }
    
    // Check for cart in localStorage
    if(localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        updateCartCount();
    }
});

// Event Listeners
plasticTypeFilter.addEventListener('change', filterProducts);
locationFilter.addEventListener('change', filterProducts);
sortFilter.addEventListener('change', filterProducts);

loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.classList.add('active');
});

cartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if(cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    renderCart();
    cartModal.classList.add('active');
});

closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        loginModal.classList.remove('active');
        registerModal.classList.remove('active');
        cartModal.classList.remove('active');
    });
});

showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.classList.remove('active');
    registerModal.classList.add('active');
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if(user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        loginModal.classList.remove('active');
        loginForm.reset();
        updateUIForLoggedInUser();
        alert(`Welcome back, ${user.name}!`);
    } else {
        alert('Invalid email or password');
    }
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;
    const type = document.getElementById('regType').value;
    
    // Create user object
    const user = {
        name,
        email,
        phone,
        password,
        type
    };
    
    // Save to localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    if(users.some(u => u.email === email)) {
        alert('Email already registered');
        return;
    }
    
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Log the user in
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Reset form and close modal
    registerForm.reset();
    registerModal.classList.remove('active');
    updateUIForLoggedInUser();
    
    alert(`Registration successful! Welcome, ${name}`);
});

checkoutBtn.addEventListener('click', () => {
    if(!currentUser) {
        loginModal.classList.add('active');
        cartModal.classList.remove('active');
        return;
    }
    
    // Check quantity limit based on user type
    const limit = currentUser.type === 'individual' ? individualLimit : businessLimit;
    const totalKg = cart.reduce((total, item) => total + item.quantity, 0);
    
    if(totalKg > limit) {
        alert(`You cannot purchase more than ${limit}kg at a time as a ${currentUser.type}. Please reduce your quantity.`);
        return;
    }
    
    // In a real app, this would process payment
    alert(`Order placed successfully!\nTotal: ₹${calculateTotalPrice()}\nThank you for your purchase!`);
    
    // Clear cart
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
    cartModal.classList.remove('active');
});

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;
    
    // In a real app, this would send to a server
    alert(`Thank you for your message, ${name}! We'll contact you soon at ${email}.`);
    contactForm.reset();
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if(e.target === loginModal) {
        loginModal.classList.remove('active');
    }
    if(e.target === registerModal) {
        registerModal.classList.remove('active');
    }
    if(e.target === cartModal) {
        cartModal.classList.remove('active');
    }
});

// Functions
function renderProducts(productsToRender) {
    productsContainer.innerHTML = '';
    
    if(productsToRender.length === 0) {
        productsContainer.innerHTML = '<p class="no-products">No products found matching your criteria.</p>';
        return;
    }
    
    productsToRender.forEach(product => {
        const productEl = document.createElement('div');
        productEl.className = 'product-card';
        productEl.innerHTML = `
            <div class="product-image" style="background-image: url('${product.image}')"></div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p><strong>Type:</strong> ${product.type}</p>
                <p><strong>Location:</strong> ${product.location}</p>
                <p><strong>Available:</strong> ${product.quantity}kg</p>
                <p class="product-price">₹${product.price}/kg</p>
                <div class="product-actions">
                    <div class="quantity-control">
                        <button class="decrement" data-id="${product.id}">-</button>
                        <input type="number" class="quantity" value="1" min="1" max="${product.quantity}" data-id="${product.id}">
                        <button class="increment" data-id="${product.id}">+</button>
                    </div>
                    <button class="btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
        productsContainer.appendChild(productEl);
    });
    
    // Add event listeners to the new buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
    
    document.querySelectorAll('.increment').forEach(btn => {
        btn.addEventListener('click', incrementQuantity);
    });
    
    document.querySelectorAll('.decrement').forEach(btn => {
        btn.addEventListener('click', decrementQuantity);
    });
    
    document.querySelectorAll('.quantity').forEach(input => {
        input.addEventListener('change', updateQuantity);
    });
}

function filterProducts() {
    const type = plasticTypeFilter.value;
    const location = locationFilter.value;
    const sort = sortFilter.value;
    
    let filteredProducts = [...products];
    
    // Filter by type
    if(type !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.type === type);
    }
    
    // Filter by location
    if(location !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.location === location);
    }
    
    // Sort products
    if(sort === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if(sort === 'price-desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if(sort === 'quantity-desc') {
        filteredProducts.sort((a, b) => b.quantity - a.quantity);
    }
    
    renderProducts(filteredProducts);
}

function addToCart(e) {
    if(!currentUser) {
        loginModal.classList.add('active');
        return;
    }
    
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    const quantityInput = e.target.parentElement.querySelector('.quantity');
    const quantity = parseInt(quantityInput.value);
    
    if(quantity > product.quantity) {
        alert(`Only ${product.quantity}kg available`);
        return;
    }
    
    // Check if already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if(existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            type: product.type
        });
    }
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    alert(`${quantity}kg of ${product.name} added to cart!`);
}

function renderCart() {
    cartItems.innerHTML = '';
    
    if(cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        return;
    }
    
    cart.forEach(item => {
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name} (${item.type})</h4>
                <p>₹${item.price}/kg × ${item.quantity}kg = ₹${item.price * item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <button class="remove-item" data-id="${item.id}">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItemEl);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', removeFromCart);
    });
    
    // Update totals
    updateCartTotals();
}

function removeFromCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if(itemIndex !== -1) {
        cart.splice(itemIndex, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
    }
}

function updateCartCount() {
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = itemCount;
}

function updateCartTotals() {
    const totalKg = cart.reduce((total, item) => total + item.quantity, 0);
    const total = calculateTotalPrice();
    
    totalQuantity.textContent = totalKg;
    totalPrice.textContent = total;
}

function calculateTotalPrice() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function incrementQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const quantityInput = e.target.parentElement.querySelector('.quantity');
    const max = parseInt(quantityInput.getAttribute('max'));
    
    let newValue = parseInt(quantityInput.value) + 1;
    if(newValue > max) newValue = max;
    quantityInput.value = newValue;
}

function decrementQuantity(e) {
    const quantityInput = e.target.parentElement.querySelector('.quantity');
    let newValue = parseInt(quantityInput.value) - 1;
    if(newValue < 1) newValue = 1;
    quantityInput.value = newValue;
}

function updateQuantity(e) {
    const max = parseInt(e.target.getAttribute('max'));
    let value = parseInt(e.target.value);
    
    if(isNaN(value) || value < 1) {
        e.target.value = 1;
    } else if(value > max) {
        e.target.value = max;
    }
}

function updateUIForLoggedInUser() {
    loginBtn.textContent = currentUser.name.split(' ')[0];
}