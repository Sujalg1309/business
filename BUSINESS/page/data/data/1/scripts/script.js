const notifications = document.querySelector(".notifications"),
buttons = document.querySelectorAll(".buttons .btn");

let toastDetails = {
    timer: 5000,
    success: {
        icon: 'fa-circle-check',
        text: 'success',
    },
    error: {
        icon: 'fa-circle-xmark',
        text: '',
    },
    warning: {
        icon: 'fa-circle-exclamation',
        text: '',
    },
    info: {
        icon: 'fa-circle-info',
        text: '',
    }
}

const removeToast = (toast) => {
    toast.classList.add("hide");
    if(toast.timeoutId) clearTimeout(toast.timeoutId); // Clearing the timeout for the toast
    setTimeout(() => toast.remove(), 500); // Removing the toast after 500ms
}

const createToast = (id,text) => {

    const icon = toastDetails[id].icon;
    const toast = document.createElement("li"); // Creating a new 'li' element for the toast
    toast.className = `toast ${id}`; // Setting the classes for the toast
    // Setting the inner HTML for the toast
    toast.innerHTML = `<div class="column">
                         <i class="fa-solid ${icon}"></i>
                         <span>${text}</span>
                      </div>
                      <i class="fa-solid fa-xmark" onclick="removeToast(this.parentElement)"></i>`;
    notifications.appendChild(toast); // Append the toast to the notification ul
    // Setting a timeout to remove the toast after the specified duration
    toast.timeoutId = setTimeout(() => removeToast(toast), toastDetails.timer);
}

// Adding a click event listener to each button to create a toast when clicked
buttons.forEach(btn => {
    btn.addEventListener("click", () => createToast(btn.id));
});



let gameState = {
    money: 20000,
    fuel: 50,
    currentCity: "New York",
    currentCityImage: "BUSINESS/page/data/data/1/media/New Yerk.jpg",
    bankBalance: 10000,
    loanBalance: 0,
    staffCost: 500,
    taxesDue: 100,
    products: {
        smartphone: { quantity: 0, purchased: 0 },
        laptop: { quantity: 0, purchased: 0 },
        jeans: { quantity: 0, purchased: 0 },
        shirt: { quantity: 0, purchased: 0 },
        bread: { quantity: 0, purchased: 0 },
        milk: { quantity: 0, purchased: 0 },
        Fuel: { quantity: 0, purchased: 0 },
        Staff: { quantity: 0, purchased: 0 },
        Taxes: { quantity: 0, purchased: 0 }
    }
};

const cityPrices = {
    "New York": { smartphone: 10000, laptop: 15000, jeans: 500, shirt: 300, bread: 30, milk: 20, Fuel: 50, Staff: 100, Taxes: 200 },
    "Los Angeles": { smartphone: 95000, laptop: 140000, jeans: 6000, shirt: 3500, bread: 80, milk: 40, Fuel: 100, Staff: 300, Taxes: 400 },
    "San Francisco": { smartphone: 1000, laptop: 1550, jeans: 650, shirt: 400, bread: 50, milk: 50, Fuel: 20, Staff: 200, Taxes: 300 },
};

const cityprices = {
    "New York": { fuelCost: 10, Staff: 100, Taxes: 200 },
    "los Angeles": { fuelCost: 40, Staff: 300, Taxes: 400 },
    "San Francisco": { fuelCost: 25, Staff: 200, Taxes: 300 }
}

function saveState() { localStorage.setItem('gameState', JSON.stringify(gameState)); }
function loadState() { const savedState = localStorage.getItem('gameState'); if (savedState) { gameState = JSON.parse(savedState); } }
function resetGame() { localStorage.removeItem('gameState'); location.reload(); }
function updateDisplay() {
    for (let product in gameState.products) {
        const quantityElement = document.getElementById(`${product}-quantity`);
        const purchasedElement = document.getElementById(`${product}-purchased`);
        if (quantityElement && purchasedElement) {
            quantityElement.innerText = gameState.products[product].quantity;
            purchasedElement.innerText = `Bought: ${gameState.products[product].purchased}`;
        }
    }
    const moneyElement = document.getElementById('money');
    const fuelElement = document.getElementById('fuel');
    const fuelPriceElement = document.getElementById('Fuel-price');
    const currentCityElement = document.getElementById('current-city');
    const currentCityImageElement = document.getElementById('city-image');
    const bankBalanceElement = document.getElementById('bankBalance');
    const loanDisplayElement = document.getElementById('loan-display');
    const staffDisplayElement = document.getElementById('staff-cost');
    const taxesDisplayElement = document.getElementById('taxes-due');
    
    if (moneyElement && fuelElement && fuelPriceElement && currentCityElement && currentCityImageElement && bankBalanceElement && loanDisplayElement && staffDisplayElement && taxesDisplayElement) {
        moneyElement.innerText = `$ ${gameState.money}`;
        fuelElement.innerText = `${gameState.fuel} L`;
        const fuelPrice = getCurrentCityPrices('Fuel');
        fuelPriceElement.innerText = fuelPrice;
        currentCityElement.innerText = gameState.currentCity;
        document.getElementById('city-name').innerText = gameState.currentCity;
        currentCityImageElement.src = gameState.currentCityImage;
        bankBalanceElement.innerText = `Balance: $${gameState.bankBalance}`;
        loanDisplayElement.innerText = `$${gameState.loanBalance}`;
        staffDisplayElement.innerText = `$${gameState.staffCost}`;
        taxesDisplayElement.innerText = `$${gameState.taxesDue}`;
    }
    
    for (let product in gameState.products) {
        const priceElement = document.getElementById(`${product}-price`);
        if (priceElement) {
            const price = getCurrentCityPrices(product);
            console.log(`Updating ${product} price: $${price}`);
            priceElement.innerText = price;
        }
    }
    
    for (let citys in cityprices) {
        const price = document.getElementById(citys);
        if (price) {
            price.innerText = getCurrentCityprices(citys); 
        }
    }
}
function getCurrentCityprices(citys) { return cityprices[gameState.currentCity][citys]}
function getCurrentCityPrices(product) { return cityPrices[gameState.currentCity][product]; }

function increment(product) { if (gameState.products[product]) { gameState.products[product].quantity += 1; saveState(); updateDisplay(); } }

function decrement(product) { if (gameState.products[product] && gameState.products[product].quantity > 0) { gameState.products[product].quantity -= 1; saveState(); updateDisplay(); } }





function buy(product) {
    if (gameState.products[product] && gameState.products[product].quantity > 0) {
        let totalPrice = gameState.products[product].quantity * getCurrentCityPrices(product);
        if (gameState.money >= totalPrice) {
            gameState.products[product].purchased += gameState.products[product].quantity;
            gameState.money -= totalPrice;
            let quantityBought = gameState.products[product].quantity;
            gameState.products[product].quantity = 0;
            saveState();
            updateDisplay();

            createToast('success', `successfully buy ${quantityBought} ${product}`);
        } else {
            createToast('error', 'Not enough money to make the purchase!');
    }} else {
        createToast('warning', 'You need to have at least 1 in quantity to buy!');
    }
    }

function sell(product) {
    if (gameState.products[product] && gameState.products[product].quantity > 0) {
    if (gameState.products[product] && gameState.products[product].purchased >= 0) {
        let sellingPrice = getCurrentCityPrices(product) * gameState.products[product].quantity;
        gameState.products[product].purchased -= gameState.products[product].quantity;
        gameState.money += sellingPrice;
        let quantitysold = gameState.products[product].quantity; 
        gameState.products[product].quantity = 0;
        saveState();
        updateDisplay();

        createToast('success', `successfully sell ${quantitysold} ${product}`);
         } else { createToast('error', "You don't have any to sell!"); }
        } else { createToast('warning', 'You need to have at least 1 in quantity to sell!'); }
}
function deposit() {
    const bankingAmount = document.getElementById('bankingAmount');
    const amount = parseInt(bankingAmount.value);

    if (amount > 0) {
        if (gameState.money >= amount) {
            gameState.money -= amount;
            gameState.bankBalance += amount;
            bankingAmount.value = "";
            saveState();
            updateDisplay();
            createToast('success', 'Deposit successful');
        } else {
            createToast('error', 'Not enough money to deposit');
        }
    } else {
        createToast('error', 'Enter a valid deposit amount');
    }
}


function withdraw() {
    const bankingAmount = document.getElementById('bankingAmount');
    const amount = parseInt(bankingAmount.value);

    if (amount > 0) {
    if (gameState.bankBalance >= amount) {
            gameState.bankBalance -= amount;
            gameState.money += amount;
            bankingAmount.value = "";
            saveState();
            updateDisplay();
            createToast('success', 'Withdraw successful');
        } else {
            createToast('error', 'Not enough money to withdraw');
        }
    } else {
        createToast('error', "Enter a valid withdraw amount");
    }
}


function borrow() {
    const loanAmount = document.getElementById('loanAmount');
    const amount = parseInt(document.getElementById('loanAmount').value);
    if (amount > 0) {
        if (gameState.loanBalance === 0) {
            gameState.loanBalance += amount;
            gameState.money += amount;
            loanAmount.value = "";
            saveState();
            updateDisplay();
            createToast('success', 'borrow successful');
        } else { createToast('warning',"You already have an outstanding loan."); }
    } else { createToast('error',"Invalid loan amount."); }
}

function payment() {
    const loanAmount = document.getElementById('loanAmount');
    const amount = parseInt(document.getElementById('loanAmount').value);
    if (amount > 0) {
        if (gameState.loanBalance > 0) {
            if (gameState.money >= amount) {
                gameState.loanBalance -= amount;
                gameState.money -= amount;
                loanAmount.value = "";
                saveState();
                updateDisplay();
                createToast('success', 'payment successful');
            } else { createToast('error',"Not enough money to make the payment."); }
        } else { createToast('warning',"You don't have an outstanding loan."); }
    } else { createToast('error',"Invalid payment amount."); }
}
function fbuy() {
    // Get the fuel amount input element
    const fuelAmountInput = document.getElementById('Fuel-Amount');

    // Parse the input value as an integer
    const fuelQuantity = parseInt(fuelAmountInput.value);

    // Check if the entered quantity is greater than 0 and less than 50
    if (fuelQuantity > 0 && fuelQuantity < 51) {
        // Calculate the total price based on the current city fuel prices
        let totalPrice = fuelQuantity * getCurrentCityPrices('Fuel');

        // Check if the player has enough money to make the purchase
        if (gameState.money >= totalPrice) {
            // Update the game state with the purchased fuel
            gameState.products['Fuel'].purchased += fuelQuantity;
            gameState.fuel += fuelQuantity;
            gameState.money -= totalPrice;

            // Get the quantity of fuel bought
            let fuelBought = gameState.products['Fuel'].quantity;

            // Clear the fuel amount input
            fuelAmountInput.value = "";

            // Save the updated game state
            saveState();

            // Update the display to reflect the changes
            updateDisplay();

            // Display a success toast message
            createToast('success', `Successfully bought ${fuelQuantity} liter of fuel.`);
        } else {
            // Display a warning toast if the player doesn't have enough money
            createToast('warning', 'Please enter a quantity less than 50 to buy Fuel.');
        }
    } else {
        // Display a warning toast for invalid quantity
        createToast('warning', "Enter a valid quantity (less than 50) to buy Fuel!");
    }
}


function payStaff() {
    const StaffAmountInput = document.getElementById('staff-Amount');
    const StaffQuantity = parseInt(StaffAmountInput.value);
    let totalPrice = StaffQuantity * getCurrentCityPrices('Staff');
    if (StaffQuantity > 0 && StaffQuantity < totalPrice) {
        if (gameState.money >= totalPrice) {
            gameState.products['Staff'].purchased -= StaffQuantity; // Corrected this line
            gameState.staffCost -= totalPrice;
            gameState.money -= totalPrice;
            StaffAmountInput.value = "";
            saveState();
            updateDisplay();
        } else { createToast('warning',`You don't have enough money to pay Staff!`); }
    } else { createToast('warning',`Enter a valid quantity to pay Staff`); }
}

function payTaxes() {
    const TaxesAmountInput = document.getElementById('taxes-Amount');
    const TaxesQuantity = parseInt(TaxesAmountInput.value);
    let totalPrice = TaxesQuantity * getCurrentCityPrices('Taxes');
    if (TaxesQuantity > 0 && TaxesQuantity < totalPrice) {
        if (gameState.money >= totalPrice) {
            gameState.products['Taxes'].purchased -= TaxesQuantity; // Corrected this line
            gameState.taxesDue -= totalPrice;
            gameState.money -= totalPrice;
            TaxesAmountInput.value = "";
            saveState();
            updateDisplay();
        } else { createToast('warning',`You don't have enough money to pay Taxes!`); }
    } else { createToast('warning',`Enter a valid quantity to pay Taxes`); }
}

function changeCity(cityName) {
    const cities = {
        "New York": { fuelCost: 10, Staff: 100, Taxes: 200, imgSrc: "BUSINESS/page/data/data/1/media/New Yerk.jpg" },
        "Los Angeles": { fuelCost: 40, Staff: 300, Taxes: 400, imgSrc: "BUSINESS/page/data/data/1/media/ls.jpg" },
        "San Francisco": { fuelCost: 25, Staff: 200, Taxes: 300, imgSrc: "BUSINESS/page/data/data/1/media/sf.jpg" }
    };
    const city = gameState.currentCity;
    const fuelCost = cities[cityName].fuelCost;

    if (cityName !=  city) {
        if (gameState.fuel >= fuelCost) {
            gameState.fuel -= fuelCost;
            gameState.currentCity = cityName;
            gameState.currentCityImage = cities[cityName].imgSrc;
            document.getElementById('city-image').src = cities[cityName].imgSrc;
            document.getElementById('city-name').innerText = cityName;
            saveState();
            updateDisplay();
            
        } else {
            createToast('error',`Not enough fuel to travel to ${cityName}.`);
        }
    } else {
        createToast('warning',`You are already in ${cityName}.`);
    }
}
function updateCityPrice(city, priceElementId) {
    const priceElement = document.querySelector(`.${priceElementId}`);
    if (priceElement) {
        const price = getCurrentCityPrices(city);
        priceElement.innerText = `$${price}`;
    }
}


function showSectionById(sectionId) {
    const sections = document.querySelectorAll('#Products, #home, #travel');
    sections.forEach(section => { section.style.display = 'none'; });
    const sectionToShow = document.getElementById(sectionId);
    if (sectionToShow) { sectionToShow.style.display = 'block'; }
}

document.querySelectorAll(".navbar a").forEach(link => {
    link.addEventListener("click", function (event) {
        event.preventDefault();
        const target = this.getAttribute("data-target");
        showSectionById(target);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    loadState();
    updateDisplay();
});

function checkScreenWidth() {
    const desktopError = document.getElementById('desktopError');
    if (window.innerWidth > 768) { desktopError.style.display = 'block'; }
    else { desktopError.style.display = 'none'; }
}

checkScreenWidth();
window.addEventListener('resize', checkScreenWidth);

// Modify the event listener for navbar links
document.querySelectorAll(".navbar a").forEach(link => {
    link.addEventListener("click", function (event) {
        event.preventDefault();
        const target = this.getAttribute("data-target");
        const targetElement = document.getElementById(target);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});


window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

        let load = loader.classList.add("loader--hidden");

         loader.addEventListener("transitionend", () => {
            document.body.removeChild(loader);
        });
    });
