// Inventory Management - LocalStorage Implementation

// Default demo inventory data
const defaultInventory = [
  {
    id: 1,
    product_name: "آلو",
    farmer_name: "احمد علی",
    farmer_phone: "0300-1234567",
    quantity: 100,
    price_per_kg: 40,
    quality: "اعلیٰ",
    warehouse: "لاہور",
    status: "available",
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    product_name: "گندم",
    farmer_name: "محمد حسین",
    farmer_phone: "0312-7654321",
    quantity: 200,
    price_per_kg: 60,
    quality: "درمیانہ",
    warehouse: "فیصل آباد",
    status: "available",
    created_at: "2024-01-14T14:20:00Z",
  },
  {
    id: 3,
    product_name: "ٹماٹر",
    farmer_name: "فاطمہ بی بی",
    farmer_phone: "0333-9876543",
    quantity: 50,
    price_per_kg: 80,
    quality: "عام",
    warehouse: "ملتان",
    status: "sold",
    created_at: "2024-01-13T09:15:00Z",
  },
  {
    id: 4,
    product_name: "چاول",
    farmer_name: "ظفر اقبال",
    farmer_phone: "0345-1122334",
    quantity: 150,
    price_per_kg: 120,
    quality: "اعلیٰ",
    warehouse: "لاہور",
    status: "available",
    created_at: "2024-01-12T16:45:00Z",
  },
];

// Initialize inventory data
function initializeInventory() {
  if (!localStorage.getItem("demoInventory")) {
    localStorage.setItem("demoInventory", JSON.stringify(defaultInventory));
    console.log("📦 Inventory initialized with demo data");
  }
}

// Add new produce to localStorage
async function addProduce(produceData) {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        const existingData = JSON.parse(
          localStorage.getItem("demoInventory") || "[]"
        );
        const newItem = {
          ...produceData,
          id: Date.now(),
          created_at: new Date().toISOString(),
          status: "available",
        };

        existingData.unshift(newItem);
        localStorage.setItem("demoInventory", JSON.stringify(existingData));

        // Also add to transactions
        addTransaction({
          type: "addition",
          product_name: produceData.product_name,
          farmer_name: produceData.farmer_name,
          quantity: produceData.quantity,
          price_per_kg: produceData.price_per_kg,
          total_price: 0,
          date: new Date().toISOString(),
          note: "نیا سامان شامل",
        });

        console.log("✅ New produce added:", newItem);
        resolve([newItem]);
      }, 1000);
    } catch (error) {
      reject(error);
    }
  });
}

// Get inventory from localStorage with optional filters
async function getInventory(filters = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        let data = JSON.parse(localStorage.getItem("demoInventory") || "[]");

        // If no data, use default
        if (data.length === 0) {
          data = defaultInventory;
          localStorage.setItem("demoInventory", JSON.stringify(data));
        }

        // Apply filters
        if (filters.status && filters.status !== "") {
          data = data.filter((item) => item.status === filters.status);
        }
        if (filters.product_name && filters.product_name !== "") {
          data = data.filter(
            (item) => item.product_name === filters.product_name
          );
        }
        if (filters.warehouse && filters.warehouse !== "") {
          data = data.filter((item) => item.warehouse === filters.warehouse);
        }
        if (filters.search && filters.search !== "") {
          const searchTerm = filters.search.toLowerCase();
          data = data.filter(
            (item) =>
              item.farmer_name.toLowerCase().includes(searchTerm) ||
              item.product_name.toLowerCase().includes(searchTerm) ||
              item.warehouse.toLowerCase().includes(searchTerm)
          );
        }

        // Sort by creation date (newest first)
        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        resolve(data);
      } catch (error) {
        console.error("Error getting inventory:", error);
        resolve(defaultInventory);
      }
    }, 500);
  });
}

// Update inventory item
async function updateInventoryItem(itemId, updates) {
  return new Promise((resolve, reject) => {
    try {
      const data = JSON.parse(localStorage.getItem("demoInventory") || "[]");
      const itemIndex = data.findIndex((item) => item.id == itemId);

      if (itemIndex === -1) {
        reject(new Error("Item not found"));
        return;
      }

      // Update the item
      data[itemIndex] = { ...data[itemIndex], ...updates };
      localStorage.setItem("demoInventory", JSON.stringify(data));

      // If marking as sold, add transaction
      if (updates.status === "sold") {
        const item = data[itemIndex];
        addTransaction({
          type: "sale",
          product_name: item.product_name,
          farmer_name: item.farmer_name,
          quantity: item.quantity,
          price_per_kg: item.price_per_kg,
          total_price: item.quantity * item.price_per_kg,
          date: new Date().toISOString(),
          note: "سامان فروخت",
        });
      }

      console.log("✅ Inventory item updated:", data[itemIndex]);
      resolve(data[itemIndex]);
    } catch (error) {
      reject(error);
    }
  });
}

// Delete inventory item
async function deleteInventoryItem(itemId) {
  return new Promise((resolve, reject) => {
    try {
      const data = JSON.parse(localStorage.getItem("demoInventory") || "[]");
      const filteredData = data.filter((item) => item.id != itemId);

      if (filteredData.length === data.length) {
        reject(new Error("Item not found"));
        return;
      }

      localStorage.setItem("demoInventory", JSON.stringify(filteredData));
      console.log("✅ Inventory item deleted:", itemId);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

// Add transaction record
function addTransaction(transactionData) {
  try {
    const transactions = JSON.parse(
      localStorage.getItem("demoTransactions") || "[]"
    );
    const newTransaction = {
      ...transactionData,
      id: Date.now(),
    };

    transactions.unshift(newTransaction);
    localStorage.setItem("demoTransactions", JSON.stringify(transactions));

    console.log("✅ Transaction added:", newTransaction);
  } catch (error) {
    console.error("Error adding transaction:", error);
  }
}

// Get status badge HTML
function getStatusBadge(status) {
  const statusConfig = {
    available: { class: "bg-success", text: "فروخت کے لیے" },
    sold: { class: "bg-primary", text: "فروخت ہو چکا" },
    spoiled: { class: "bg-danger", text: "خراب" },
  };

  const config = statusConfig[status] || {
    class: "bg-secondary",
    text: status,
  };
  return `<span class="badge ${config.class}">${config.text}</span>`;
}

// Get quality badge HTML
function getQualityBadge(quality) {
  const qualityConfig = {
    اعلیٰ: { class: "bg-success", text: "اعلیٰ" },
    درمیانہ: { class: "bg-warning", text: "درمیانہ" },
    عام: { class: "bg-secondary", text: "عام" },
  };

  const config = qualityConfig[quality] || {
    class: "bg-secondary",
    text: quality,
  };
  return `<span class="badge ${config.class}">${config.text}</span>`;
}

// Format date for display
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("ur-PK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    return dateString;
  }
}

// Load inventory table on inventory.html page
function loadInventoryTable() {
  const inventoryTable = document.getElementById("inventoryTable");
  if (!inventoryTable) return;

  getInventory().then((data) => {
    if (data.length === 0) {
      inventoryTable.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-4">
                        <i class="fas fa-box-open fa-2x text-muted mb-2"></i>
                        <p class="text-muted">کوئی سامان دستیاب نہیں</p>
                    </td>
                </tr>
            `;
      return;
    }

    inventoryTable.innerHTML = data
      .map(
        (item) => `
            <tr>
                <td>
                    <strong>${item.product_name}</strong>
                    <br><small class="text-muted">${formatDate(
                      item.created_at
                    )}</small>
                </td>
                <td>
                    <div>${item.farmer_name}</div>
                    <small class="text-muted">${item.farmer_phone}</small>
                </td>
                <td>
                    <strong>${item.quantity} کلو</strong>
                </td>
                <td>
                    <strong>${item.price_per_kg} روپے</strong>
                    <br><small class="text-muted">فی کلو</small>
                </td>
                <td>${getQualityBadge(item.quality)}</td>
                <td>${item.warehouse}</td>
                <td>${getStatusBadge(item.status)}</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="viewItem(${
                          item.id
                        })">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-warning" onclick="editItem(${
                          item.id
                        })">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="deleteItem(${
                          item.id
                        })">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `
      )
      .join("");

    // Update record count
    const totalRecords = document.getElementById("totalRecords");
    if (totalRecords) {
      totalRecords.textContent = data.length;
    }
  });
}

// Item action functions
function viewItem(id) {
  alert(`آئٹم ${id} دیکھیں - یہ فیچر ڈیمو میں دستیاب نہیں`);
}

function editItem(id) {
  alert(`آئٹم ${id} میں ترمیم کریں - یہ فیچر ڈیمو میں دستیاب نہیں`);
}

async function deleteItem(id) {
  if (confirm("کیا آپ واقعی اس آئٹم کو حذف کرنا چاہتے ہیں؟")) {
    try {
      await deleteInventoryItem(id);
      loadInventoryTable(); // Refresh the table
      alert("آئٹم کامیابی سے حذف ہو گیا");
    } catch (error) {
      alert("خرابی: " + error.message);
    }
  }
}

// Setup filters on inventory page
function setupInventoryFilters() {
  const filterStatus = document.getElementById("filterStatus");
  const filterProduct = document.getElementById("filterProduct");
  const filterWarehouse = document.getElementById("filterWarehouse");
  const searchInput = document.getElementById("searchInventory");

  if (filterStatus) {
    filterStatus.addEventListener("change", applyFilters);
  }
  if (filterProduct) {
    filterProduct.addEventListener("change", applyFilters);
  }
  if (filterWarehouse) {
    filterWarehouse.addEventListener("change", applyFilters);
  }
  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }
}

// Apply filters to inventory
async function applyFilters() {
  const filters = {
    status: document.getElementById("filterStatus")?.value || "",
    product_name: document.getElementById("filterProduct")?.value || "",
    warehouse: document.getElementById("filterWarehouse")?.value || "",
    search: document.getElementById("searchInventory")?.value || "",
  };

  const data = await getInventory(filters);
  const inventoryTable = document.getElementById("inventoryTable");

  if (data.length === 0) {
    inventoryTable.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4">
                    <i class="fas fa-search fa-2x text-muted mb-2"></i>
                    <p class="text-muted">کوئی ریکارڈ نہیں ملا</p>
                </td>
            </tr>
        `;
  } else {
    inventoryTable.innerHTML = data
      .map(
        (item) => `
            <tr>
                <td>
                    <strong>${item.product_name}</strong>
                    <br><small class="text-muted">${formatDate(
                      item.created_at
                    )}</small>
                </td>
                <td>
                    <div>${item.farmer_name}</div>
                    <small class="text-muted">${item.farmer_phone}</small>
                </td>
                <td>
                    <strong>${item.quantity} کلو</strong>
                </td>
                <td>
                    <strong>${item.price_per_kg} روپے</strong>
                    <br><small class="text-muted">فی کلو</small>
                </td>
                <td>${getQualityBadge(item.quality)}</td>
                <td>${item.warehouse}</td>
                <td>${getStatusBadge(item.status)}</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="viewItem(${
                          item.id
                        })">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-warning" onclick="editItem(${
                          item.id
                        })">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="deleteItem(${
                          item.id
                        })">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `
      )
      .join("");
  }

  // Update record count
  const totalRecords = document.getElementById("totalRecords");
  if (totalRecords) {
    totalRecords.textContent = data.length;
  }
}

// Initialize on load
document.addEventListener("DOMContentLoaded", function () {
  initializeInventory();

  // Load inventory table if on inventory page
  if (window.location.pathname.includes("inventory.html")) {
    loadInventoryTable();
    setupInventoryFilters();
  }
});

// Export functions for use in other files
window.inventory = {
  addProduce,
  getInventory,
  updateInventoryItem,
  deleteInventoryItem,
  getStatusBadge,
  getQualityBadge,
  formatDate,
  loadInventoryTable,
  viewItem,
  editItem,
  deleteItem,
};
