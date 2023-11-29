let gameState = {
    money: 20000,
    fuel: 50,
    currentCity: "New York",
    currentCityImage: "BUSINESS/page/data/data/1/media/New Yerk.jpg",
    bankBalance: 10000,
    loanBalance: 0,
    staffCost: 500,
    taxesDue: 100,
};

let products = {
    smartphone: { quantity: 0, purchased: 0 },
    laptop: { quantity: 0, purchased: 0 },
    jeans: { quantity: 0, purchased: 0 },
    shirt: { quantity: 0, purchased: 0 },
    bread: { quantity: 0, purchased: 0 },
    milk: { quantity: 0, purchased: 0 },
    Fuel: { quantity: 0, purchased: 0 },
};

const cityPrices = {
    "New York": { smartphone: 10000, laptop: 15000, jeans: 500, shirt: 300, bread: 30, milk: 20, Fuel: 50, Staff: 100, Taxes: 200 },
    "Los Angeles": { smartphone: 95000, laptop: 140000, jeans: 6000, shirt: 3500, bread: 80, milk: 40, Fuel: 100, Staff: 300, Taxes: 400 },
    "San Francisco": { smartphone: 1000, laptop: 1550, jeans: 650, shirt: 400, bread: 50, milk: 50, Fuel: 20, Staff: 200, Taxes: 300 },
};

const cityprices = {
    "New York": { fuelCost: 10 },
    "los Angeles": { fuelCost: 40 },
    "San Francisco": { fuelCost: 25}
}

function saveState() { localStorage.setItem('gameState', JSON.stringify(gameState)); }
function loadState() { const savedState = localStorage.getItem('gameState'); if (savedState) { gameState = JSON.parse(savedState); } }
function resetGame() { localStorage.removeItem('gameState'); location.reload(); }
function updateDisplay() {
    for (let product in products) {
        const quantityElement = document.getElementById(`${product}-quantity`);
        const purchasedElement = document.getElementById(`${product}-purchased`);
        if (quantityElement && purchasedElement) {
            quantityElement.innerText = products[product].quantity;
            purchasedElement.innerText = `Bought: ${products[product].purchased}`;
        }
    }
    const moneyElement = document.getElementById('money');
    const fuelElement = document.getElementById('fuel');
    const currentCityElement = document.getElementById('current-city');
    const currentCityImageElement = document.getElementById('city-image');
    const bankBalanceElement = document.getElementById('bankBalance');
    const loanDisplayElement = document.getElementById('loan-display');
    const staffDisplayElement = document.getElementById('staff-cost');
    const taxesDisplayElement = document.getElementById('taxes-due');
    if (moneyElement && fuelElement && currentCityElement && currentCityImageElement && bankBalanceElement && loanDisplayElement && staffDisplayElement && taxesDisplayElement) {
        moneyElement.innerText = `$ ${gameState.money}`;
        fuelElement.innerText = `${gameState.fuel} L`;
        currentCityElement.innerText = gameState.currentCity;
        document.getElementById('city-name').innerText = gameState.currentCity;
        currentCityImageElement.src = gameState.currentCityImage;
        bankBalanceElement.innerText = `Balance: $${gameState.bankBalance}`;
        loanDisplayElement.innerText = `$${gameState.loanBalance}`;
        staffDisplayElement.innerText = `$${gameState.staffCost}`;
        taxesDisplayElement.innerText = `$${gameState.taxesDue}`;
    }
    for (let product in products) {
        const priceElement = document.getElementById(`${product}-price`);
        if (priceElement) {
            priceElement.innerText = getCurrentCityPrices(product);
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

function increment(product) { if (products[product]) { products[product].quantity += 1; saveState(); updateDisplay(); } }

function decrement(product) { if (products[product] && products[product].quantity > 0) { products[product].quantity -= 1; saveState(); updateDisplay(); } }

function buy(product) {
    if (products[product] && products[product].quantity > 0) {
        let totalPrice = products[product].quantity * getCurrentCityPrices(product);
        if (gameState.money >= totalPrice) {
            products[product].purchased += products[product].quantity;
            gameState.money -= totalPrice;
            products[product].quantity = 0;
            saveState();
            updateDisplay();
        } else { alert(`You don't have enough money to buy ${product}!`); }
    } else { alert("You need to have at least 1 in quantity to buy!"); }
}

function sell(product) {
    if (products[product] && products[product].purchased > 0) {
        let sellingPrice = getCurrentCityPrices(product);
        products[product].purchased -= 1;
        gameState.money += sellingPrice;
        saveState();
        updateDisplay();
    } else { alert("You don't have any to sell!"); }
}

function deposit() {
    const bankingAmount = document.getElementById('bankingAmount');
    const amount = parseInt(document.getElementById('bankingAmount').value);
    if (gameState.money >= amount && amount > 0) {
        gameState.money -= amount;
        gameState.bankBalance += amount;
        bankingAmount = "";
        saveState();
        updateDisplay();
    } else { alert("Not enough money or invalid amount."); }
}

function withdraw() {
    const bankingAmount = document.getElementById('bankingAmount');
    const amount = parseInt(document.getElementById('bankingAmount').value);
    if (gameState.bankBalance >= amount && amount > 0) {
        gameState.bankBalance -= amount;
        gameState.money += amount;
        bankingAmount = "";
        saveState();
        updateDisplay();
    } else { alert("Not enough balance or invalid amount."); }
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
        } else { alert("You already have an outstanding loan."); }
    } else { alert("Invalid loan amount."); }
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
            } else { alert("Not enough money to make the payment."); }
        } else { alert("You don't have an outstanding loan."); }
    } else { alert("Invalid payment amount."); }
}

function fbuy() {
    const fuelAmountInput = document.getElementById('Fuel-Amount');
    const fuelQuantity = parseInt(fuelAmountInput.value);
    if (fuelQuantity > 0) {
        let totalPrice = fuelQuantity * getCurrentCityPrices('Fuel');
        if (gameState.money >= totalPrice) {
            products['Fuel'].purchased += fuelQuantity;
            gameState.fuel += fuelQuantity;
            gameState.money -= totalPrice;
            fuelAmountInput.value = "";
            saveState();
            updateDisplay();
        } else { alert(`You don't have enough money to buy Fuel!`); }
    } else { alert("Enter a valid quantity to buy Fuel!"); }
}

function payStaff() {
    const StaffAmountInput = document.getElementById('staff-Amount');
    const StaffQuantity = parseInt(StaffAmountInput.value);
    let totalPrice = StaffQuantity * getCurrentCityPrices('Staff');
    if (gameState.money >= totalPrice) {
        products['Staff'].purchased += StaffQuantity;
        gameState.staffCost -= StaffQuantity;
        gameState.money -= totalPrice;
        StaffAmountInput.value = "";
        saveState();
        updateDisplay();
    } else { alert(`You don't have enough money to pay Staff!`); }
}

function payTaxes() {
    const TaxesAmountInput = document.getElementById('taxes-Amount');
    const TaxesQuantity = parseInt(TaxesAmountInput.value);
    let totalPrice = TaxesQuantity * getCurrentCityPrices('Taxes');
    if (gameState.money >= totalPrice) {
        products['Taxes'].purchased += StaffQuantity;
        gameState.taxesDue -= TaxesQuantity;
        gameState.money -= totalPrice;
        TaxesAmountInput.value = "";
        saveState();
        updateDisplay();
    } else { alert(`You don't have enough money to pay Taxes!`); }
}

function changeCity(cityName) {
    const cities = {
        "New York": { fuelCost: 10, staffModifier: 1.5, taxesModifier: 1.2, imgSrc: "BUSINESS/page/data/data/1/media/New Yerk.jpg" },
        "Los Angeles": { fuelCost: 40, staffModifier: 1.8, taxesModifier: 1.3, imgSrc: "BUSINESS/page/data/data/1/media/ls.jpg" },
        "San Francisco": { fuelCost: 25, staffModifier: 1.2, taxesModifier: 1.1, imgSrc: "BUSINESS/page/data/data/1/media/sf.jpg" }
    };
    const fuelCost = cities[cityName].fuelCost;
    if (gameState.fuel >= fuelCost) {
        gameState.fuel -= fuelCost;
        gameState.currentCity = cityName;
        gameState.currentCityImage = cities[cityName].imgSrc;
        gameState.staffCost = Math.round(gameState.staffCost * cities[cityName].staffModifier);
        gameState.taxesDue = Math.round(gameState.taxesDue * cities[cityName].taxesModifier);
        document.getElementById('city-image').src = cities[cityName].imgSrc;
        document.getElementById('city-name').innerText = cityName;
        saveState();
        updateDisplay();
    } else { alert(`Not enough fuel to travel to ${cityName}.`); }
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
