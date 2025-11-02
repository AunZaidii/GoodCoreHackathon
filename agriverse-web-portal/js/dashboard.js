// Demo Dashboard - LocalStorage only

document.addEventListener("DOMContentLoaded", function () {
  loadDashboardData();
  updateUserInfo();
  startDemoUpdates();
  setupEventListeners();
});

// Load dashboard data from localStorage
function loadDashboardData() {
  try {
    const inventory = JSON.parse(localStorage.getItem("demoInventory") || "[]");
    const transactions = JSON.parse(
      localStorage.getItem("demoTransactions") || "[]"
    );

    // Calculate stats
    const totalItems = inventory.length;
    const soldItems = inventory.filter((item) => item.status === "sold").length;
    const spoiledItems = inventory.filter(
      (item) => item.status === "spoiled"
    ).length;

    const totalRevenue = transactions.reduce((sum, transaction) => {
      return sum + (transaction.total_price || 0);
    }, 0);

    const stats = {
      totalItems: totalItems,
      soldItems: soldItems,
      spoiledItems: spoiledItems,
      totalRevenue: totalRevenue,
    };

    updateDashboardUI(stats);
    updateRecentActivities(transactions);
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    // Load default demo data if error
    loadDefaultDemoData();
  }
}

// Update UI with data
function updateDashboardUI(data) {
  if (document.getElementById("totalItems")) {
    document.getElementById("totalItems").textContent = data.totalItems;
  }
  if (document.getElementById("soldItems")) {
    document.getElementById("soldItems").textContent = data.soldItems;
  }
  if (document.getElementById("spoiledItems")) {
    document.getElementById("spoiledItems").textContent = data.spoiledItems;
  }
  if (document.getElementById("totalRevenue")) {
    document.getElementById("totalRevenue").textContent =
      data.totalRevenue.toLocaleString() + " روپے";
  }
}

// Update recent activities
function updateRecentActivities(transactions) {
  const activitiesContainer = document.getElementById("recentActivities");
  if (!activitiesContainer) return;

  // Get recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5);

  if (recentTransactions.length === 0) {
    activitiesContainer.innerHTML = `
            <div class="list-group-item text-center text-muted">
                <i class="fas fa-info-circle me-2"></i>
                ابھی تک کوئی سرگرمی نہیں
            </div>
        `;
    return;
  }

  activitiesContainer.innerHTML = recentTransactions
    .map(
      (transaction) => `
        <div class="list-group-item d-flex justify-content-between align-items-center">
            <div>
                <i class="fas ${
                  transaction.type === "sale"
                    ? "fa-shopping-cart text-success"
                    : "fa-box text-primary"
                } me-2"></i>
                <strong>${transaction.product_name}</strong> - ${
        transaction.quantity
      } کلو
                <br>
                <small class="text-muted">${
                  transaction.farmer_name
                } • ${formatDate(transaction.date)}</small>
            </div>
            <span class="badge bg-success">${
              transaction.total_price
            } روپے</span>
        </div>
    `
    )
    .join("");
}

// Update user info in header
function updateUserInfo() {
  const user = getCurrentUser();
  if (user) {
    const userNameElement = document.getElementById("userName");
    const userEmailElement = document.getElementById("userEmail");

    if (userNameElement) {
      userNameElement.textContent = user.name || "ڈیمو مینیجر";
    }
    if (userEmailElement) {
      userEmailElement.textContent = user.warehouse || "لاہور گودام";
    }
  }
}

// Format date for display
function formatDate(dateString) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("ur-PK", options);
}

// Simulate real-time updates
function startDemoUpdates() {
  // Update stats every 30 seconds
  setInterval(() => {
    console.log("🔄 Updating dashboard data...");
    loadDashboardData();
  }, 30000);
}

// Setup event listeners
function setupEventListeners() {
  // Quick action buttons are handled via HTML links
  console.log(" Dashboard event listeners setup");
}

// Load default demo data if no data exists
function loadDefaultDemoData() {
  console.log("📦 Loading default demo data...");

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
      created_at: new Date().toISOString(),
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
      created_at: new Date().toISOString(),
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
      created_at: new Date().toISOString(),
    },
  ];

  const defaultTransactions = [
    {
      id: 1,
      type: "sale",
      product_name: "ٹماٹر",
      farmer_name: "فاطمہ بی بی",
      quantity: 50,
      price_per_kg: 80,
      total_price: 4000,
      date: new Date().toISOString(),
      buyer: "سبزی منڈی",
    },
    {
      id: 2,
      type: "addition",
      product_name: "آلو",
      farmer_name: "احمد علی",
      quantity: 100,
      price_per_kg: 40,
      total_price: 0,
      date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      note: "نیا سامان شامل",
    },
  ];

  localStorage.setItem("demoInventory", JSON.stringify(defaultInventory));
  localStorage.setItem("demoTransactions", JSON.stringify(defaultTransactions));

  console.log(" Default demo data loaded");
  loadDashboardData();
}

// Export functions for use in other files --> (if needed)
window.dashboard = {
  loadDashboardData,
  updateDashboardUI,
  updateUserInfo,
};
