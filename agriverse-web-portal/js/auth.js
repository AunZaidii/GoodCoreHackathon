// Demo Authentication - LocalStorage only

// Check authentication state on page load
document.addEventListener("DOMContentLoaded", function () {
  console.log("🔄 Checking authentication state...");
  checkAuthState();
});

// Check if user is authenticated
function checkAuthState() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const currentPage = window.location.pathname.split("/").pop();

  console.log("🔐 Auth Check:", {
    isLoggedIn: isLoggedIn,
    currentPage: currentPage,
    fullPath: window.location.href,
  });

  if (isLoggedIn === "true") {
    // User IS logged in
    console.log("✅ User is logged in");

    // If on login page, redirect to dashboard
    if (
      currentPage === "index.html" ||
      currentPage === "" ||
      currentPage.includes("index.html")
    ) {
      console.log("🔄 Redirecting from login to dashboard...");
      window.location.href = "dashboard.html";
    } else {
      console.log("✅ User is on correct page:", currentPage);
      // Update user info on the page
      updateUserInfo();
    }
  } else {
    // User is NOT logged in
    console.log("❌ User is not logged in");

    // If NOT on login page, redirect to login
    if (
      currentPage !== "index.html" &&
      currentPage !== "" &&
      !currentPage.includes("index.html")
    ) {
      console.log("🔄 Redirecting to login page...");
      window.location.href = "index.html";
    } else {
      console.log(" User is on login page, no redirect needed");
    }
  }
}

// Login function
document
  .getElementById("loginForm")
  ?.addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log("🚀 Login form submitted");

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const submitBtn = this.querySelector('button[type="submit"]');

    console.log("📧 Login attempt with email:", email);

    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> لاگ ان ہو رہا ہے...';
    submitBtn.disabled = true;

    try {
      // Simulate API call
      console.log("⏳ Simulating login process...");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Store login state in localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem(
        "demoUser",
        JSON.stringify({
          email: email || "demo@agriverse.com",
          name: "ڈیمو مینیجر",
          warehouse: "لاہور گودام",
        })
      );

      // Initialize demo data if not exists
      initializeDemoData();

      console.log("✅ Login successful!");
      console.log("🔄 Redirecting to dashboard...");

      // Force redirect to dashboard
      window.location.href = "dashboard.html";
    } catch (error) {
      console.error("❌ Login error:", error);
      alert("لاگ ان ناکام: براہ کرم دوبارہ کوشش کریں");

      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });

// Logout function
function logout() {
  console.log("🚪 Logging out...");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("demoUser");
  localStorage.removeItem("demoInventory");
  localStorage.removeItem("demoTransactions");
  console.log(" Logout completed, redirecting to login...");
  window.location.href = "index.html";
}

// Get current user
function getCurrentUser() {
  const demoUser = localStorage.getItem("demoUser");
  return demoUser ? JSON.parse(demoUser) : null;
}

// Update user info in UI
function updateUserInfo() {
  const user = getCurrentUser();
  const userNameElement = document.getElementById("userName");
  const userEmailElement = document.getElementById("userEmail");

  if (user && userNameElement) {
    userNameElement.textContent = user.name || "ڈیمو مینیجر";
  }
  if (user && userEmailElement) {
    userEmailElement.textContent = user.warehouse || "لاہور گودام";
  }
}

// Initialize demo data
function initializeDemoData() {
  console.log("📦 Initializing demo data...");

  // Only initialize if data doesn't exist
  if (!localStorage.getItem("demoInventory")) {
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
    ];
    localStorage.setItem("demoInventory", JSON.stringify(defaultInventory));
    console.log(" Demo inventory initialized");
  }

  if (!localStorage.getItem("demoTransactions")) {
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
    ];
    localStorage.setItem(
      "demoTransactions",
      JSON.stringify(defaultTransactions)
    );
    console.log(" Demo transactions initialized");
  }
}

// Debug function to check auth status
function debugAuth() {
  console.log("🔍 Auth Debug Info:", {
    isLoggedIn: localStorage.getItem("isLoggedIn"),
    demoUser: localStorage.getItem("demoUser"),
    currentPage: window.location.pathname,
  });
}

// Make debug function available globally
window.debugAuth = debugAuth;
