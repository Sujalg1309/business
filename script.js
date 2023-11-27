// Global game state
let gameState = {
    money: 20000,
    fuel: 50,
    currentCity: "New York",
    bankBalance: 10000,
    loanBalance: 0,
    staffCost: 500,
    taxesDue: 100,

};
   // Simulated data structure to track the products.
let products = {
    smartphone: { quantity: 0, purchased: 0 },
    laptop: { quantity: 0, purchased: 0 },
    jeans: { quantity: 0, purchased: 0 },
    shirt: { quantity: 0, purchased: 0 },
    bread: { quantity: 0, purchased: 0 },
    milk: { quantity: 0, purchased: 0 },
    Fuel: { quantity: 0, purchased: 0 }
}
// Prices for each product in each city
const cityPrices = {
    "New York": {
        smartphone: 10000,
        laptop: 15000,
        jeans: 500,
        shirt: 300,
        bread: 30,
        milk: 20,
        Fuel: 50
    },
    "Los Angeles": {
        smartphone: 95000,
        laptop: 140000,
        jeans: 6000,
        shirt: 3500,
        bread: 80,
        milk: 40,
        Fuel: 100
    },
    "San Francisco": {
        smartphone: 1000,
        laptop: 1550,
        jeans: 650,
        shirt: 400,
        bread: 50,
        milk: 50,
        Fuel: 20
    }
};
function saveState() {
    localStorage.setItem('gameState', JSON.stringify(gameState));
}
function loadState() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        gameState = JSON.parse(savedState);
    }
}
function resetGame() {
    localStorage.removeItem('gameState');
    location.reload(); // this will reload the page and start fresh
}

function updateDisplay() {
    for (let product in products) {
        // Check if the element exists before updating
        const quantityElement = document.getElementById(`${product}-quantity`);
        const purchasedElement = document.getElementById(`${product}-purchased`);
        
        if (quantityElement && purchasedElement) {
            // Update the quantity display
            quantityElement.innerText = products[product].quantity;
            // Update the purchased display
            purchasedElement.innerText = `Bought: ${products[product].purchased}`;
        }
    }

    // Check if the elements exist before updating
    const moneyElement = document.getElementById('money');
    const fuelElement = document.getElementById('fuel');
    const currentCityElement = document.getElementById('current-city');
    const bankBalanceElement = document.getElementById('bankBalance');
    const loanDisplayElement = document.getElementById('loan-display');
    const staffDisplayElement = document.getElementById('staff-cost');
    const taxesDisplayElement = document.getElementById('taxes-due');


    if (moneyElement && fuelElement && currentCityElement && bankBalanceElement && loanDisplayElement && staffDisplayElement && taxesDisplayElement) {
        moneyElement.innerText = `$ ${gameState.money}`;
        fuelElement.innerText = `${gameState.fuel} L`;
        currentCityElement.innerText = gameState.currentCity;
        bankBalanceElement.innerText = `Balance: $${gameState.bankBalance}`;
        loanDisplayElement.innerText = `$${gameState.loanBalance}`;
        staffDisplayElement.innerText = `$${gameState.staffCost}`;
        taxesDisplayElement.innerText = `$${gameState.taxesDue}`;
    }

    // Update the prices for each product
    for (let product in products) {
        const priceElement = document.getElementById(`${product}-price`);
        if (priceElement) {
            priceElement.innerText = getCurrentCityPrices(product);
        }
    }
}



function getCurrentCityPrices(product) {
    return cityPrices[gameState.currentCity][product];
}
function increment(product) {
    if (products[product]) {
        products[product].quantity += 1;
        saveState();
        updateDisplay();
    }
}

function decrement(product) {
    if (products[product] && products[product].quantity > 0) {
        products[product].quantity -= 1;
        saveState();
        updateDisplay();
    }
}

function buy(product) {
    if (products[product] && products[product].quantity > 0) {
        let totalPrice = products[product].quantity * getCurrentCityPrices(product);
        
        if(gameState.money >= totalPrice) {
            products[product].purchased += products[product].quantity;
            gameState.money -= totalPrice;  // deducting the total price from user's money
            products[product].quantity = 0;
            saveState();
            updateDisplay();
        } else {
            alert(`You don't have enough money to buy ${product}!`);
        }
    } else {
        alert("You need to have at least 1 in quantity to buy!");
    }
}

function sell(product) {
    if (products[product] && products[product].purchased > 0) {
        let sellingPrice = getCurrentCityPrices(product);
        
        products[product].purchased -= 1;
        gameState.money += sellingPrice; // adding the product's price to user's money for the sold item
        saveState();
        updateDisplay();
    } else {
        alert("You don't have any to sell!");
    }
}

function getCurrentCityPrices(product) {
    return cityPrices[gameState.currentCity][product];
}

function deposit() {
    const amount = parseInt(document.getElementById('bankingAmount').value);
    if (gameState.money >= amount && amount > 0) {
        gameState.money -= amount;
        gameState.bankBalance += amount;
        saveState();
        updateDisplay();
    } else {
        alert("Not enough money or invalid amount.");
    }
}
function withdraw() {
    const amount = parseInt(document.getElementById('bankingAmount').value);
    if (gameState.bankBalance >= amount && amount > 0) {
        gameState.bankBalance -= amount;
        gameState.money += amount;
        saveState();
        updateDisplay();
    } else {
        alert("Not enough balance or invalid amount.");
    }
}

function borrow() {
    const amount = parseInt(document.getElementById('loanAmount').value);
    if (amount > 0) {
        if (gameState.loanBalance === 0) {
            gameState.loanBalance += amount;
            gameState.money += amount;
            saveState();
            updateDisplay();
        } else {
            alert("You already have an outstanding loan.");
        }
    } else {
        alert("Invalid loan amount.");
    }
}
function payment() {
    const amount = parseInt(document.getElementById('loanAmount').value);
    if (amount > 0) {
        if (gameState.loanBalance > 0) {
            if (gameState.money >= amount) {
                gameState.loanBalance -= amount;
                gameState.money -= amount;
                saveState();
                updateDisplay();
            } else {
                alert("Not enough money to make the payment.");
            }
        } else {
            alert("You don't have an outstanding loan.");
        }
    } else {
        alert("Invalid payment amount.");
    }
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
            fuelAmountInput.value = ""; // Clear the input field
            saveState();
            updateDisplay();
        } else {
            alert(`You don't have enough money to buy Fuel!`);
        }
    } else {
        alert("Enter a valid quantity to buy Fuel!");
    }
}

function payStaff() {
    // Assuming staff cost is deducted from the money
    if (gameState.money >= gameState.staffCost) {
        gameState.money -= gameState.staffCost;
        saveState();
        updateDisplay();
    } else {
        alert("Not enough money to pay staff!");
    }
}

function payTaxes() {
    if (gameState.money >= gameState.taxesDue) {
        gameState.money -= gameState.taxesDue;
        gameState.taxesDue = 0;  // Reset taxes due after payment
        saveState();
        updateDisplay();
    } else {
        alert("Not enough money to pay taxes!");
    }
}


function changeCity(cityName) {
    const cities = {
        "New York": { fuelCost: 0, staffModifier: 1.5, taxesModifier: 1.2, imgSrc: "New York.jpg" },
        "Los Angeles": { fuelCost: 10, staffModifier: 1.8, taxesModifier: 1.3, imgSrc: "ls.jpg" },
        "San Francisco": { fuelCost: 15, staffModifier: 1.2, taxesModifier: 1.1, imgSrc: "sf.jpg" }
    };

    const fuelCost = cities[cityName].fuelCost;
    if (gameState.fuel >= fuelCost) {
        gameState.fuel -= fuelCost;
        gameState.currentCity = cityName;

        // Update staff cost and taxes based on city modifiers
        gameState.staffCost = Math.round(gameState.staffCost * cities[cityName].staffModifier);
        gameState.taxesDue = Math.round(gameState.taxesDue * cities[cityName].taxesModifier);

        document.getElementById('city-image').src = cities[cityName].imgSrc;
        document.getElementById('city-name').innerText = cityName;
        saveState();
        updateDisplay();
    } else {
        alert(`Not enough fuel to travel to ${cityName}.`);
    }
}


function showSectionById(sectionId) {
    const sections = document.querySelectorAll('#Products, #home, #travel');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    const sectionToShow = document.getElementById(sectionId);
    if (sectionToShow) {
        sectionToShow.style.display = 'block';
    }
}

// Navigation
document.querySelectorAll(".navbar a").forEach(link => {
    link.addEventListener("click", function(event) {
        event.preventDefault();
        const target = this.getAttribute("data-target");
        showSectionById(target);
    });
});

// Initialize Game
document.addEventListener("DOMContentLoaded", function() {
    loadState();
    updateDisplay();
});
// Function to show/hide the offline indicator
function updateOnlineStatus() {
    const offlineIndicator = document.getElementById('offlineIndicator');
    if (!navigator.onLine) {
        offlineIndicator.style.display = 'block';
    } else {
        offlineIndicator.style.display = 'none';
    }
}

// Event listeners for online and offline events
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Initial check
updateOnlineStatus();
// Check the screen width to decide whether to show the desktop error
function checkScreenWidth() {
    const desktopError = document.getElementById('desktopError');
    if (window.innerWidth > 768) {
        desktopError.style.display = 'block';
    } else {
        desktopError.style.display = 'none';
    }
}

// Initial check
checkScreenWidth();

// Add an event listener to handle window resizing
window.addEventListener('resize', checkScreenWidth);
