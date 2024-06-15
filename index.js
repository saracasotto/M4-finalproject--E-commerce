const apiUrl = 'https://striveschool-api.herokuapp.com/api/product/';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjY4OGIxZDhmYzBmMzAwMTU1ZTViNTYiLCJpYXQiOjE3MTgxMzM1NTcsImV4cCI6MTcxOTM0MzE1N30.OkUzPN5awKorvvbomefJBC0UThVDSweOe6IygWMrez0';

let allProducts = []; // Variabile per memorizzare tutti i prodotti

// Funzione asincrona per ottenere tutti i prodotti dal backoffice
async function getProducts() {
    try {
        let response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        let products = await response.json();
        allProducts = products; // Salva i prodotti nella variabile allProducts
        console.log('Products received:', products); // Console log dei prodotti recuperati
        return products;
    } catch (error) {
        console.error('Error:', error); // Log errore 
    }
}

// Funzione per mostrare tutti i prodotti dal backoffice
function displayProducts(products) {
    const productList = document.getElementById('product-list');
    if (!productList) return; // Se l'elemento product-list non esiste, esci dalla funzione
    productList.innerHTML = '';
    products.forEach(product => {
        const productCard = `
            <div class="col-sm-6 col-md-4 col-lg-3">
                <div class="card shadow-sm">
                    <div class="card-img-top-container">
                        <a href="product.html?id=${product._id}" target="_blank">
                            <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
                        </a>
                    </div>
                    <div class="card-body">
                        <a href="product.html?id=${product._id}" target="_blank">
                            <h5 class="card-title">${product.name}</h5>
                        </a>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text">${product.price}$</p>
                    </div>
                </div>
            </div>`;
        productList.insertAdjacentHTML('beforeend', productCard);
    });
}

// Funzione per filtrare i prodotti in base alla ricerca
function filterProducts(searchTerm) {
    const filteredProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    displayProducts(filteredProducts);
}

window.onload = () => {
    if (document.getElementById('product-list')) { // Controllo esistenza elemento HTML
        getProducts().then(products => {
            displayProducts(products);
        });
    }

    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', (event) => {
            const searchTerm = event.target.value;
            filterProducts(searchTerm);
        });
    }
};
