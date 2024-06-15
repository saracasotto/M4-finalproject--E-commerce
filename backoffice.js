
const apiUrl = 'https://striveschool-api.herokuapp.com/api/product/';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjY4OGIxZDhmYzBmMzAwMTU1ZTViNTYiLCJpYXQiOjE3MTgxMzM1NTcsImV4cCI6MTcxOTM0MzE1N30.OkUzPN5awKorvvbomefJBC0UThVDSweOe6IygWMrez0';

//Async function to fetch all products
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
        console.log('Prodotti recuperati:', products); // Log dei prodotti recuperati
        return products;
    } catch (error) {
        console.error('Errore nel recupero dei prodotti:', error);
    }
}

//Function to display existing products in the back office
function displayExistingProducts(products) {
    const existingProductsList = document.getElementById('existing-products');
    if (!existingProductsList) return;

    existingProductsList.innerHTML = '';

    products.forEach(product => {
        const productItem = `
                <div class="card shadow-sm backoffice-card" data-product-id="${product._id}">
                    <div class="card-img-top-container">
                        <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
                        <div class="card-buttons">
                            <button class="btn btn-primary edit-product-btn">&#128393</button>
                            <button class="btn btn-danger delete">&#10006</button>
                        </div>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text d-none">${product.description}</p>
                        <p class="card-text">${product.brand}</p>
                        <p class="card-text d-none">${product.price}€</p>
                    </div>
                </div>`;

        existingProductsList.insertAdjacentHTML('beforeend', productItem);
    });

    function setupSearchFunctionality() {
        const searchInput = document.getElementById('search-input');

        searchInput.addEventListener('input', () => {
            const searchText = searchInput.value.trim().toLowerCase();

            existingProductsList.querySelectorAll('.card').forEach(card => {
                const productId = card.getAttribute('data-product-id').toLowerCase();
                const productName = card.querySelector('.card-title').textContent.trim().toLowerCase();
                const productBrand = card.querySelector('.card-text:nth-of-type(2)').textContent.trim().toLowerCase();

                if (productId.includes(searchText) || productName.includes(searchText) || productBrand.includes(searchText)) {
                    card.style.display = ''; // Mostra la carta
                } else {
                    card.style.display = 'none'; // Nascondi carta
                }
            });
        });
    }

    setupSearchFunctionality();
}


//Async function to add a product using the POST method
async function addProduct(event) {
    event.preventDefault();

    // Verifica se tutti i campi obbligatori sono stati compilati correttamente
    const form = document.getElementById('product-form');
    if (!form.checkValidity()) {
        // Se ci sono campi mancanti, mostra un messaggio all'utente
        form.reportValidity();
        return;
    }

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const brand = document.getElementById('brand').value;
    const imageUrl = document.getElementById('imageUrl').value;
    const price = document.getElementById('price').value;

    const product = {
        name,
        description,
        brand,
        imageUrl,
        price
    };

    try {
        let response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });
        if (response.ok) {
            // Mostra l'alert di Bootstrap
            const alertSuccess = document.getElementById('alert-success');
            alertSuccess.classList.remove('d-none');
            alertSuccess.classList.add('show');

            // Nascondi l'alert dopo un certo tempo (opzionale)
            setTimeout(() => {
                alertSuccess.classList.remove('show');
                alertSuccess.classList.add('d-none');
            }, 2000);

            form.reset();

            // Aggiorna la lista dei prodotti
            getProducts().then(products => {
                displayExistingProducts(products);
            });
        }
    } catch (error) {
        console.error('Error', error);
    }
}

window.onload = () => {
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', addProduct);
    }

    if (document.getElementById('existing-products')) {
        getProducts().then(products => {
            displayExistingProducts(products);
        });
    }

    //Add event listener for click on delete buttons
    document.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete')) {
            const card = event.target.closest('.card');
            const productId = card.dataset.productId;

            //Show confirmation modal
            const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'), {});
            confirmDeleteModal.show();

            
            const confirmDeleteButton = document.getElementById('confirmDeleteButton');
            confirmDeleteButton.addEventListener('click', async () => {
                try {
                    const response = await fetch(apiUrl + productId, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        confirmDeleteModal.hide();

                        //Show confirmation alert
                        const alertSuccess = document.getElementById('alert-success');
                        alertSuccess.classList.remove('d-none');
                        alertSuccess.classList.add('show');

                        //Hide after 2 secs
                        setTimeout(() => {
                            alertSuccess.classList.remove('show');
                            alertSuccess.classList.add('d-none');
                        }, 2000);

                        card.remove();
                        location.reload();
                    } else {
                        console.error('Errore durante la cancellazione del prodotto:', response.statusText);
                    }
                } catch (error) {
                    console.error('Errore durante la richiesta DELETE:', error);
                }
            });
        }
    });


    //Add event listener for click on edit buttons
    document.addEventListener('click', async (event) => {
        if (event.target.classList.contains('edit-product-btn')) {
            const card = event.target.closest('.card');
            const productName = card.querySelector('.card-title').textContent.trim();
            const productDescription = card.querySelector('.card-text:first-of-type').textContent.trim();
            const productBrand = card.querySelector('.card-text:nth-of-type(2)').textContent.trim();
            const productPrice = parseFloat(card.querySelector('.card-text:last-of-type').textContent.replace('€', ''));
            const productImageUrl = card.querySelector('.card-img-top').src;

            document.getElementById('edit-imageUrl').value = productImageUrl;
            document.getElementById('edit-name').value = productName;
            document.getElementById('edit-description').value = productDescription;
            document.getElementById('edit-brand').value = productBrand;
            document.getElementById('edit-price').value = productPrice;


            //Show edit modal
            const editProductModal = new bootstrap.Modal(document.getElementById('editProductModal'), {});
            editProductModal.show();
        
            const confirmEditButton = document.getElementById('confirmEditButton');
            confirmEditButton.addEventListener('click', async () => {
                const updatedProduct = {
                    name: document.getElementById('edit-name').value,
                    description: document.getElementById('edit-description').value,
                    brand: document.getElementById('edit-brand').value,
                    imageUrl: document.getElementById('edit-imageUrl').value,
                    price: parseFloat(document.getElementById('edit-price').value)
                };
                const productId = card.getAttribute('data-product-id');
                const apiUrl = `https://striveschool-api.herokuapp.com/api/product/${productId}`;
                const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjY4OGIxZDhmYzBmMzAwMTU1ZTViNTYiLCJpYXQiOjE3MTgxMzM1NTcsImV4cCI6MTcxOTM0MzE1N30.OkUzPN5awKorvvbomefJBC0UThVDSweOe6IygWMrez0';

                try {
                    const response = await fetch(apiUrl, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedProduct)
                    });

                    if (response.ok) {
                        //Hide edit modal
                        const editProductModal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
                        editProductModal.hide();

                        //Show confirmation alert
                        const alertSuccess = document.getElementById('alert-success');
                        alertSuccess.classList.remove('d-none');
                        alertSuccess.classList.add('show');

                        setTimeout(() => {
                            alertSuccess.classList.remove('show');
                            alertSuccess.classList.add('d-none');
                        }, 2000);

                        getProducts().then(products => {
                            displayExistingProducts(products);
                        });
                    } else {
                        console.error('Errore durante la modifica del prodotto:', response.statusText);
                    }
                } catch (error) {
                    console.error('Errore durante la richiesta PUT:', error);
                }
            });
        }
    });

};


