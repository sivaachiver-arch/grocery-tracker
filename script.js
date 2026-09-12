const addItemButton = document.getElementById("addItem");
const itemName = document.getElementById("itemName");
const category = document.getElementById("category");
const quantity = document.getElementById("quantity");
const price = document.getElementById("price");
const shoppingList = document.getElementById("shoppingList");
const clearAllButton = document.getElementById("clearAll");
const searchInput = document.getElementById("searchInput");
const totalAmount = document.getElementById("totalAmount");
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

    totalAmount.textContent = total;
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
searchInput.addEventListener("input", function() {

    const searchText = searchInput.value.toLowerCase();
    const items = shoppingList.querySelectorAll("p");

    items.forEach(function(item) {

        const itemText = item.querySelector(".itemText").textContent.toLowerCase();

        if (itemText.includes(searchText)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }

    });

});
function saveItems() {
    localStorage.setItem("groceryItems", shoppingList.innerHTML);
}
function loadItems() {
    const savedItems = localStorage.getItem("groceryItems");

    if (savedItems) {
        shoppingList.innerHTML = savedItems;

        const items = shoppingList.querySelectorAll("p");

        items.forEach(function(item) {

            const editButton = item.querySelector("button:nth-of-type(1)");
            const deleteButton = item.querySelector("button:nth-of-type(2)");

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
    shoppingList.innerHTML = "";
    localStorage.removeItem("groceryItems");
    totalAmount.textContent = "0";
});
