// Demo Configuration - Completely standalone
console.log(" Running AgriVerse Warehouse Portal in DEMO MODE");
console.log(" No Supabase connection needed");
console.log(" All data stored in browser localStorage");
console.log(" Fully functional UI/UX");

// Mock Supabase object to prevent errors
window.supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signInWithPassword: () =>
      Promise.resolve({ data: { user: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
  },
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: [], error: null }),
    update: () => Promise.resolve({ data: [], error: null }),
    delete: () => Promise.resolve({ error: null }),
  }),
};

// Initialize demo data if not exists
document.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.getItem("demoInventory")) {
    const demoData = [
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
        created_at: "2024-01-15",
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
        created_at: "2024-01-14",
      },
    ];
    localStorage.setItem("demoInventory", JSON.stringify(demoData));
    console.log("📦 Demo inventory data initialized");
  }
});
