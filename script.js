const addItemButton = document.getElementById("addItem");
const itemName = document.getElementById("itemName");
const category = document.getElementById("category");
const quantity = document.getElementById("quantity");
const price = document.getElementById("price");
const shoppingList = document.getElementById("shoppingList");
const clearAllButton = document.getElementById("clearAll");
const purchaseStatus = document.getElementById("purchaseStatus");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const totalAmount = document.getElementById("totalAmount");
const totalItems = document.getElementById("totalItems");
const totalQuantity = document.getElementById("totalQuantity");
const dashboardTotal = document.getElementById("dashboardTotal");
let editingItem = null;
function updateTotal() {
    let total = 0;

    const items = shoppingList.querySelectorAll(".itemText");

    items.forEach(function(item) {
        const text = item.textContent;

        const pricePart = text.split("₹")[1];
        const cost = parseFloat(pricePart);

        if (!isNaN(cost)) {
            total += cost;
        }
    });

    totalItems.textContent = items.length;

    let quantityTotal = 0;

    items.forEach(function(item) {
        const text = item.textContent;

        const quantityPart = text.split("Qty: ")[1].split(" | ")[0];
        const quantityValue = parseFloat(quantityPart);

        if (!isNaN(quantityValue)) {
            quantityTotal += quantityValue;
        }
    });

    totalQuantity.textContent = quantityTotal;
    totalAmount.textContent = total;
    dashboardTotal.textContent = total;

}
    addItemButton.addEventListener("click", function() {

    const name = itemName.value;
    const cat = category.value;
    const qty = quantity.value;
    const cost = price.value;

    if (name === "" || cat === "" || qty === "" || cost === "") {
        alert("Please fill all fields!");
        return;
    }

    if (editingItem !== null) {
        editingItem.querySelector(".itemText").textContent =
            name + " | " + cat + " | Qty: " + qty + " | ₹" + cost;
         updateTotal();
         saveItems();

        editingItem = null;
        addItemButton.textContent = "Add Item";

    } else {

        const item = document.createElement("p");
        const statusButton = document.createElement("button");
        statusButton.className = "status-button";
        statusButton.textContent = "Purchased";

        statusButton.addEventListener("click", function() {
    if (statusButton.textContent === "Purchased") {
        statusButton.textContent = "Pending";
        statusButton.classList.add("pending");
    } else {
        statusButton.textContent = "Purchased";
        statusButton.classList.remove("pending");
    }

    saveItems();
});

        const itemText = document.createElement("span");
        itemText.className = "itemText";
        itemText.textContent =
            name + " | " + cat + " | Qty: " + qty + " | ₹" + cost;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function() {
            itemName.value = name;
            category.value = cat;
            quantity.value = qty;
            price.value = cost;

            editingItem = item;
            addItemButton.textContent = "Update Item";
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
    item.remove();
    updateTotal();
    saveItems();
});

        item.appendChild(itemText);
        item.appendChild(statusButton);
        item.appendChild(editButton);
        item.appendChild(deleteButton);

        shoppingList.appendChild(item);
        updateTotal();
        saveItems();
    }

    itemName.value = "";
    category.value = "";
    quantity.value = "";
    price.value = "";
});
function filterItems() {

    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const items = shoppingList.querySelectorAll("p");
    items.forEach(function(item) {

        const itemText = item.querySelector(".itemText").textContent;

        const matchesSearch = itemText.toLowerCase().includes(searchText);

        const parts = itemText.split(" | ");
        const itemCategory = parts[1];

        const matchesCategory =
            selectedCategory === "all" ||
            itemCategory.toLowerCase() === selectedCategory.toLowerCase();

        if (matchesSearch && matchesCategory) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }

    });
}

searchInput.addEventListener("input", filterItems);

categoryFilter.addEventListener("change", filterItems);
function saveItems() {
    localStorage.setItem("groceryItems", shoppingList.innerHTML);
}
function loadItems() {
    const savedItems = localStorage.getItem("groceryItems");

    if (savedItems) {
        shoppingList.innerHTML = savedItems;

        const items = shoppingList.querySelectorAll("p");

        items.forEach(function(item) {

            const statusButton = item.querySelector("button:nth-of-type(1)");
            const editButton = item.querySelector("button:nth-of-type(2)");
            const deleteButton = item.querySelector("button:nth-of-type(3)");
            if (statusButton.textContent === "Pending") {
            statusButton.classList.add("pending");
}
            statusButton.addEventListener("click", function() {
    if (statusButton.textContent === "Purchased") {
        statusButton.textContent = "Pending";
    } else {
        statusButton.textContent = "Purchased";
    }

    saveItems();
});

            editButton.addEventListener("click", function() {
                const text = item.querySelector(".itemText").textContent;

                const parts = text.split(" | ");

                itemName.value = parts[0];
                category.value = parts[1];
                quantity.value = parts[2].replace("Qty: ", "");
                price.value = parts[3].replace("₹", "");

                editingItem = item;
                addItemButton.textContent = "Update Item";
            });

            deleteButton.addEventListener("click", function() {
                item.remove();
                updateTotal();
                saveItems();
            });

        });

        updateTotal();
    }
}

loadItems();
clearAllButton.addEventListener("click", function() {

    const confirmClear = confirm("Are you sure you want to clear all items?");

    if (confirmClear) {
        shoppingList.innerHTML = "";
        localStorage.removeItem("groceryItems");
        totalAmount.textContent = "0";
        totalItems.textContent = "0";
        totalQuantity.textContent = "0";
        dashboardTotal.textContent = "0";
    }

});
