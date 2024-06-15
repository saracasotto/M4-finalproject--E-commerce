const apiUrl = 'https://striveschool-api.herokuapp.com/api/product/';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjY4OGIxZDhmYzBmMzAwMTU1ZTViNTYiLCJpYXQiOjE3MTgxMzM1NTcsImV4cCI6MTcxOTM0MzE1N30.OkUzPN5awKorvvbomefJBC0UThVDSweOe6IygWMrez0';

//Async function to fetch details of a single product
async function getProduct(id) {
    try {
        const response = await fetch(`${apiUrl}${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Errore durante il recupero del prodotto');
        }
        return await response.json();
    } catch (error) {
        console.error('Errore nel recupero del prodotto:', error);
        // Gestione dell'errore, ad esempio mostrando un messaggio all'utente
    }
}

//Function for product display
function displayProduct(product) {
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-image').src = product.imageUrl;
    document.getElementById('product-image').alt = product.name;
    document.getElementById('product-price').textContent = `${product.price}$`;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-brand').textContent = product.brand; // Aggiungi il brand
    document.getElementById('product-id').textContent = product._id;
}

//Function to obtain the ID from the URL
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function showLoadingOverlay() {
    document.getElementById('loading-overlay').style.visibility = 'visible';
}

function hideLoadingOverlay() {
    setTimeout(() => {
        document.getElementById('loading-overlay').style.visibility = 'hidden';
    }, 500); // mezzo secondo
}

//Function to add the product to cart
function addToCart(product) {
    const cartItems = document.getElementById('cart-items');
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item', 'my-2');
    cartItem.innerHTML = `
        <div class="d-flex align-items-start justify-content-around">
            <img src="${product.imageUrl}" alt="${product.name}" class="img-thumbnail" style="width: 80px;">
            <div class="ms-3">
                <h5>${product.name}</h5>
                <p>${product.price}$</p>
            </div>
            <button class="btn remove-from-cart"><i class="bi bi-trash"></i></button>
        </div>
    `;
    cartItems.appendChild(cartItem);

        // Aggiungi l'event listener per il bottone di rimozione
        cartItem.querySelector('.remove-from-cart').addEventListener('click', () => {
            cartItem.remove();
        });
    
    const cartOffcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));
    cartOffcanvas.show();
}

window.onload = async () => {
    const productId = getProductIdFromUrl();
    if (productId) {
        showLoadingOverlay();
        const product = await getProduct(productId);
        displayProduct(product);
        document.getElementById('add-to-cart-button').addEventListener('click', () => addToCart(product));
    }
    hideLoadingOverlay();
};
