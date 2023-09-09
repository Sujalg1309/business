// Global game state
let gameState = {
    money: 20000,
    fuel: 50,
    currentCity: "New York",
    bankBalance: 10000,
    loanBalance: 0,
    staffCost: 0,
    taxesDue: 0,

};
   // Simulated data structure to track the products.
let products = {
    jeans: { quantity: 0, purchased: 0 },
    shirt: { quantity: 0, purchased: 0 },
    bread: { quantity: 0, purchased: 0 },
    milk: { quantity: 0, purchased: 0 },
}
// Prices for each product in each city
const cityPrices = {
    "New York": {
        smartphone: 1000,
        laptop: 1500,
        jeans: 50,
        shirt: 30,
        bread: 3,
        milk: 2
    },
    "Los Angeles": {
        smartphone: 950,
        laptop: 1400,
        jeans: 60,
        shirt: 35,
        bread: 4,
        milk: 3
    },
    "San Francisco": {
        smartphone: 1050,
        laptop: 1550,
        jeans: 65,
        shirt: 40,
        bread: 5,
        milk: 4
    }
};

function updateDisplay() {
    for (let product in products) {
        // Update the quantity display
        document.getElementById(`${product}-quantity`).innerText = products[product].quantity;
        // Update the purchased display
        document.getElementById(`${product}-purchased`).innerText = `Bought: ${products[product].purchased}`;
    }
    document.getElementById('money').innerText = `$${gameState.money}`;
    document.getElementById('fuel').innerText = `${gameState.fuel} L`;
    document.getElementById('current-city').innerText = gameState.currentCity;
    document.getElementById('bankBalance').innerText = `Balance: $${gameState.bankBalance}`;
    document.getElementById('loan-display').innerText = `$${gameState.loanBalance}`; // Update the loan display
    document.getElementById('jeans-price').innerText = getCurrentCityPrices('jeans');
    document.getElementById('shirt-price').innerText = getCurrentCityPrices('shirt');
    document.getElementById('bread-price').innerText = getCurrentCityPrices('bread');
    document.getElementById('milk-price').innerText = getCurrentCityPrices('milk');

}


function getCurrentCityPrices(product) {
    return cityPrices[gameState.currentCity][product];
}
function increment(product) {
    if (products[product]) {
        products[product].quantity += 1;
        updateDisplay();
    }
}

function decrement(product) {
    if (products[product] && products[product].quantity > 0) {
        products[product].quantity -= 1;
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



function changeCity(cityName) {
    const cities = {
        "New York": { fuelCost: 0, imgSrc: "New york.png" },
        "Los Angeles": { fuelCost: 10, imgSrc: "ls.jpg" },
        "San Francisco": { fuelCost: 15, imgSrc: "sf.jpg" }
    };
    
    const fuelCost = cities[cityName].fuelCost;
    if (gameState.fuel >= fuelCost) {
        gameState.fuel -= fuelCost;
        gameState.currentCity = cityName;
        document.getElementById('city-image').src = cities[cityName].imgSrc;
        document.getElementById('city-name').innerText = cityName;
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
    updateDisplay();
    showWelcomeModal();
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
