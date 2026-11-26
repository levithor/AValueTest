import {products} from './products.js';
import {cart, calculateCartTotals, calculateChange} from './cart.js';

// Render each product in a way that doesnt suck and without using HTML
const productList = document.getElementById('product-list');
products.forEach(product => {
    const productItem = document.createElement('li');
    productItem.className = 'product-item';
    productItem.dataset.productId = product.id;

    const name = document.createElement('h2');
    name.className = 'product-name';
    name.textContent = product.name;

    const description = document.createElement('p');
    description.className = 'product-description';
    description.textContent = product.description;

    const price = document.createElement('span');
    price.className = 'product-price';
    price.dataset.price = product.price;
    price.textContent = `฿${product.price.toFixed(2)}`;

    const quantityLabel = document.createElement('label');
    quantityLabel.htmlFor = `product-${product.id}-quantity`;
    quantityLabel.textContent = ' Quantity ';

    const quantityInput = document.createElement('input');
    quantityInput.id = `product-${product.id}-quantity`;
    quantityInput.className = 'quantity-input';
    quantityInput.type = 'number';
    quantityInput.min = '1';
    quantityInput.step = '1';
    quantityInput.value = '1';

    const addButton = document.createElement('button');
    addButton.className = 'add-to-cart';
    addButton.textContent = 'Add to Cart';

    const stock = document.createElement('p');
    stock.className = 'product-stock';
    stock.dataset.stock = product.stock;
    stock.textContent = `Stock: ${product.stock}`;

    productItem.append( name, 
                        description, 
                        price, 
                        quantityLabel, 
                        quantityInput, 
                        addButton, 
                        stock );
    productList.appendChild(productItem);
});

// Cart functionality (stored as objects in an array)

function updateCartDisplay() { 
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const subtotal = document.getElementById('subtotal');
    const discount = document.getElementById('discount');
    const total = document.getElementById('total-price');

    // Clear cart display
    cartItems.innerHTML = '';
    let totalItems = 0;
    const totals = calculateCartTotals(cart);

    // Display each item in the cart
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ฿${item.price.toFixed(2)} x ${item.quantity}`;
        // Remove Item button
        const removeButton = document.createElement('button');
        removeButton.className = 'remove-from-cart';
        removeButton.type = 'button';
        removeButton.dataset.cartIndex = index;
        removeButton.textContent = 'Remove';

        li.appendChild(removeButton);
        cartItems.appendChild(li);

        totalItems += item.quantity;
    });

    // Update cart count
    cartCount.textContent = totalItems;

    // Update subtotal

    subtotal.textContent = `฿${totals.subtotal.toFixed(2)}`;
    discount.textContent = `฿${totals.discount.toFixed(2)}`;


    // Apply a 10% discount if the total value is greater than ฿500
    /* if (totalValue > 500) {
        discount.textContent = `฿${(totalValue * 0.1).toFixed(2)}`;
        totalValue -= totalValue * 0.1;
    } else {
        discount.textContent = '฿0.00';
    } */
    total.textContent = `฿${totals.total.toFixed(2)}`;
}

function searchProducts(searchTerm) {
    const query = searchTerm.trim().toLowerCase();
    const inStockOnly = document.getElementById('in-stock').checked;
    const sortByPriceLow = document.getElementById('sort-by-price-low').checked;
    const sortByPriceHigh = document.getElementById('sort-by-price-high').checked;

    const productItems = productList.querySelectorAll('.product-item');
    // filter: keep only product cards that match the search and stock options.
    const matchingItems = Array.from(productItems).filter(productItem => {
        const productName = productItem.querySelector('.product-name').textContent.toLowerCase();
        const productId = productItem.dataset.productId.toLowerCase();
        const productStock = Number(productItem.querySelector('.product-stock').dataset.stock);
        const matchesSearch = productName.includes(query) || productId.includes(query);
        const matchesStock = !inStockOnly || productStock > 0;

        return matchesSearch && matchesStock;
    });

    // map: apply the visible/hidden state to every product card.
    Array.from(productItems).map(productItem => {
        productItem.hidden = !matchingItems.includes(productItem);
    });

    // Sorting algorithm
    if (sortByPriceLow || sortByPriceHigh) { // Called by both options
        const sortedItems = [];
        for (let i = 0; i < productItems.length; i++) {
            sortedItems.push(productItems[i]); // Move everything to the temporary array
        }

        for (let i = 1; i < sortedItems.length; i++) {
            const currentItem = sortedItems[i]; // Store the current item to be sorted
            const currentPrice = Number(currentItem.querySelector('.product-price').dataset.price); // Retrieve the price and convert to number format
            let j = i - 1;

            while (
                j >= 0 && // Compare 'product-price' of current sorted item against original
                Number(sortedItems[j].querySelector('.product-price').dataset.price) > currentPrice
            ) {
                sortedItems[j + 1] = sortedItems[j]; // Move the sorted item up in the line
                j--;
            }

            sortedItems[j + 1] = currentItem;
        }
        // Just going to reverse the previous loop to achieve high to low sorting
        if (sortByPriceHigh) {
            sortedItems.reverse();
        }
        // Update original array
        for (let i = 0; i < sortedItems.length; i++) {
            productList.appendChild(sortedItems[i]);
        }
    } else {
        for (let i = 0; i < products.length; i++) {
            const productItem = productList.querySelector(`[data-product-id="${products[i].id}"]`);
            productList.appendChild(productItem);
        }
    }
}

function updateProductDisplay(product) {
    const productItem = productList.querySelector(`[data-product-id="${product.id}"]`);
    const stockDisplay = productItem.querySelector('.product-stock');
    const quantityInput = productItem.querySelector('.quantity-input');
    const addButton = productItem.querySelector('.add-to-cart');

    stockDisplay.dataset.stock = product.stock;
    stockDisplay.textContent = `Stock: ${product.stock}`;
    quantityInput.max = product.stock;
    addButton.disabled = product.stock === 0;
    searchProducts(document.getElementById('product-search').value);
}

productList.addEventListener('click', (event) => {
    if (!event.target.classList.contains('add-to-cart')) {
        return;
    }

    const productItem = event.target.closest('.product-item');
    const product = products.find(item => item.id === Number(productItem.dataset.productId));
    const quantityInput = productItem.querySelector('.quantity-input');
    const quantity = Number(quantityInput.value);
    const cartItem = cart.find(item => item.id === product.id);


    if (!Number.isInteger(quantity) || quantity <= 0) {
        alert('Please enter a valid quantity (a whole number greater than 0).');
        return;
    }

    if (quantity > product.stock) {
        alert('Not enough product in stock');
        return;
    }

    product.stock -= quantity;
    // Combines cart quanitites
    if (cartItem) {
        cartItem.quantity += quantity;
    } else {
        cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity
    });
    }
    updateCartDisplay();
    updateProductDisplay(product);
});

document.getElementById('product-search').addEventListener('input', event => {
    searchProducts(event.target.value);
});

document.getElementById('in-stock').addEventListener('change', () => {
    searchProducts(document.getElementById('product-search').value);
});
// These checkboxes for sorting should cancel each other out
document.getElementById('sort-by-price-low').addEventListener('change', () => {
    if (document.getElementById('sort-by-price-low').checked) {
        document.getElementById('sort-by-price-high').checked = false;
    }
    searchProducts(document.getElementById('product-search').value);
});

document.getElementById('sort-by-price-high').addEventListener('change', () => {
    if (document.getElementById('sort-by-price-high').checked) {
        document.getElementById('sort-by-price-low').checked = false;
    }
    searchProducts(document.getElementById('product-search').value);
});

document.getElementById('cart-items').addEventListener('click', event => {
    const removeButton = event.target.closest('.remove-from-cart');
    if (!removeButton) {
        return;
    }

    const cartIndex = Number(removeButton.dataset.cartIndex);
    if (!Number.isInteger(cartIndex) || cartIndex < 0 || cartIndex >= cart.length) {
        return;
    }

    const item = cart[cartIndex];
    // Finds original product in original array to restore stock
    const product = products.find(product => product.id === item.id);
    if (!product) {
        console.error(`Cannot restore stock: product ${item.id} was not found.`);
        return;
    }
    // Remove item from cart array
    cart.splice(cartIndex, 1);
    product.stock += item.quantity;
    updateCartDisplay();
    updateProductDisplay(product);
});

document.getElementById('calculate-change').addEventListener('click', () => {
    const paymentAmountInput = document.getElementById('payment-amount');
    const changeAmount = document.getElementById('change-amount');
    const paymentMessage = document.getElementById('payment-message');
    const paymentAmount = parseFloat(paymentAmountInput.value);
    // Check if the cart is empty prior to checking the payment amount
    if (cart.length === 0) {
        paymentMessage.textContent = 'Your cart is empty. Please add items to the cart before making a payment.';
        changeAmount.textContent = '฿0.00';
        return;
    }

    if (paymentAmountInput.value.trim() === '' || isNaN(paymentAmount) || paymentAmount < 0) {
        paymentMessage.textContent = 'Please enter a valid payment amount (greater than or equal to 0).';
        changeAmount.textContent = '฿0.00';
        return;
    }

    const total = calculateCartTotals(cart).total;
    const change = calculateChange(paymentAmount, total);
    if (change < 0) {
        paymentMessage.textContent = 'Insufficient payment. Please provide enough money to cover the total.';
        changeAmount.textContent = '฿0.00';
    } else {
        paymentMessage.textContent = '';
        changeAmount.textContent = `฿${change.toFixed(2)}`;
    }
});