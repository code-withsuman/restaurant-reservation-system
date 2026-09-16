const User = require("../models/User");
const Table = require("../models/Table");
const { Customer, MenuItem } = require("../models/misc");

async function seedDatabase() {
  try {
    // 1. Seed Admin Account
    const adminExists = await User.findOne({ email: "admin@desidelighthotels.com" });
    if (!adminExists) {
      await User.create({
        name: "Admin User",
        email: "admin@desidelighthotels.com",
        phone: "9000000001",
        password: "admin123",
        role: "admin",
      });
      console.log("✅ Seeded Admin Account: admin@desidelighthotels.com");
    }

    // 2. Seed 5 Staff Accounts
    const staffAccounts = [
      { name: "Staff Member", email: "staff@desidelighthotels.com", phone: "9000000002", password: "staff123", role: "staff" },
      { name: "Rajesh Kumar", email: "rajesh@desidelighthotels.com", phone: "9000000004", password: "staff123", role: "staff" },
      { name: "Sunita Sharma", email: "sunita@desidelighthotels.com", phone: "9000000005", password: "staff123", role: "staff" },
      { name: "Amitabh Sen", email: "amitabh@desidelighthotels.com", phone: "9000000006", password: "staff123", role: "staff" },
      { name: "Pooja Mukherjee", email: "pooja@desidelighthotels.com", phone: "9000000007", password: "staff123", role: "staff" },
    ];

    for (const staff of staffAccounts) {
      const exists = await User.findOne({ email: staff.email });
      if (!exists) {
        await User.create(staff);
      }
    }
    console.log("✅ Seeded 5 Staff Member Accounts into MongoDB");

    // 3. Seed 10 Customer Accounts & Customer Profiles
    const customersData = [
      { name: "Asha Rao", email: "asha@example.com", phone: "9000000003", password: "customer123", address: "Haldia, WB", visits: 5 },
      { name: "Rohan Mehta", email: "rohan@example.com", phone: "9123456780", password: "customer123", address: "Kolkata, WB", visits: 3 },
      { name: "Priya Nair", email: "priya@example.com", phone: "9988776655", password: "customer123", address: "Digha, WB", visits: 8 },
      { name: "Siddharth Roy", email: "siddharth@example.com", phone: "9876543210", password: "customer123", address: "Howrah, WB", visits: 4 },
      { name: "Ananya Banerjee", email: "ananya@example.com", phone: "9876543211", password: "customer123", address: "Salt Lake, Kolkata", visits: 6 },
      { name: "Debabrata Ghosh", email: "debabrata@example.com", phone: "9876543212", password: "customer123", address: "Siliguri, WB", visits: 2 },
      { name: "Sampa Dutta", email: "sampa@example.com", phone: "9876543213", password: "customer123", address: "Asansol, WB", visits: 7 },
      { name: "Sourav Ganguly", email: "sourav@example.com", phone: "9876543214", password: "customer123", address: "Ballygunge, Kolkata", visits: 10 },
      { name: "Mitali Bose", email: "mitali@example.com", phone: "9876543215", password: "customer123", address: "Park Street, Kolkata", visits: 1 },
      { name: "Arindam Chakraborty", email: "arindam@example.com", phone: "9876543216", password: "customer123", address: "New Town, Kolkata", visits: 5 },
    ];

    for (const cust of customersData) {
      let u = await User.findOne({ email: cust.email });
      if (!u) {
        u = await User.create({
          name: cust.name,
          email: cust.email,
          phone: cust.phone,
          password: cust.password,
          role: "customer",
        });
      }

      const cExists = await Customer.findOne({ phone: cust.phone });
      if (!cExists) {
        await Customer.create({
          name: cust.name,
          phone: cust.phone,
          email: cust.email,
          address: cust.address,
          visits: cust.visits,
          user: u._id,
        });
      }
    }
    console.log("✅ Seeded 10 Customer Accounts & Profiles into MongoDB");

    // 4. Seed 10 Floor Tables (All Available)
    const tableCount = await Table.countDocuments();
    if (tableCount === 0) {
      await Table.create([
        { number: 1, capacity: 2, status: "Available", location: "Window" },
        { number: 2, capacity: 2, status: "Available", location: "Window" },
        { number: 3, capacity: 4, status: "Available", location: "Main Hall" },
        { number: 4, capacity: 4, status: "Available", location: "Main Hall" },
        { number: 5, capacity: 4, status: "Available", location: "Main Hall" },
        { number: 6, capacity: 6, status: "Available", location: "Main Hall" },
        { number: 7, capacity: 6, status: "Available", location: "Patio" },
        { number: 8, capacity: 8, status: "Available", location: "Private Room" },
        { number: 9, capacity: 8, status: "Available", location: "Private Room" },
        { number: 10, capacity: 12, status: "Available", location: "VIP Lounge" },
      ]);
      console.log("✅ Seeded 10 Tables into MongoDB");
    }

    // 5. Seed Menu Items with Authentic High-Quality Food Photos (27 Items)
    const menuItemsData = [
      // Starters (6 items)
      {
        name: "Mochar Chop",
        category: "Starters",
        price: 140,
        description: "Banana flower croquettes with Bengali spices.",
        image: "/images/menu/mochar_chop.jpg",
      },
      {
        name: "Fish Kabiraji",
        category: "Starters",
        price: 220,
        description: "Crispy fried Bhetki fillet in fluffy egg nest.",
        image: "/images/menu/fish_kabiraji.jpg",
      },
      {
        name: "Chicken Cutlet",
        category: "Starters",
        price: 180,
        description: "Minced spiced chicken cutlet with mustard dip.",
        image: "/images/menu/chicken_cutlet.jpg",
      },
      {
        name: "Paneer Tikka",
        category: "Starters",
        price: 190,
        description: "Char-grilled marinated cottage cheese cubes.",
        image: "/images/menu/paneer_tikka.jpg",
      },
      {
        name: "Gondhoraj Chicken Fry",
        category: "Starters",
        price: 240,
        description: "Crisp boneless chicken strips infused with Gondhoraj lime & green chili.",
        image: "/images/menu/gondhoraj_chicken.jpg",
      },
      {
        name: "Posto Bora",
        category: "Starters",
        price: 160,
        description: "Crispy golden shallow-fried poppy seed patties with green chili.",
        image: "/images/menu/posto_bora.jpg",
      },

      // Main Course (11 items)
      {
        name: "Kosha Mangsho",
        category: "Main Course",
        price: 340,
        description: "Slow-cooked authentic Bengali mutton curry.",
        image: "/images/menu/kosha_mangsho.jpg",
      },
      {
        name: "Steamed Bhetki Paturi",
        category: "Main Course",
        price: 390,
        description: "Bhetki fish wrapped in banana leaf with mustard.",
        image: "/images/menu/bhetki_paturi.jpg",
      },
      {
        name: "Shorshe Ilish",
        category: "Main Course",
        price: 450,
        description: "Hilsa fish in rich mustard and green chilli sauce.",
        image: "/images/menu/shorshe_ilish.jpg",
      },
      {
        name: "Chingri Malai Curry",
        category: "Main Course",
        price: 420,
        description: "Prawns simmered in spiced coconut milk gravy.",
        image: "/images/menu/chingri_malai_curry.jpg",
      },
      {
        name: "Basanti Pulao",
        category: "Main Course",
        price: 180,
        description: "Fragrant sweet saffron rice with cashews & raisins.",
        image: "/images/menu/basanti_pulao.jpg",
      },
      {
        name: "Luchi & Cholar Dal",
        category: "Main Course",
        price: 160,
        description: "Fluffy fried bread served with coconut chana dal.",
        image: "/images/menu/luchi_cholar_dal.jpg",
      },
      {
        name: "Kolkata Mutton Biryani",
        category: "Main Course",
        price: 460,
        description: "Royal fragrant basmati rice with spiced mutton, golden potato & egg.",
        image: "/images/menu/kolkata_biryani.jpg",
      },
      {
        name: "Daab Chingri",
        category: "Main Course",
        price: 480,
        description: "Jumbo tiger prawns slow-cooked inside a tender green coconut shell.",
        image: "/images/menu/daab_chingri.jpg",
      },
      {
        name: "Dhokar Dalna",
        category: "Main Course",
        price: 220,
        description: "Spiced chana dal lentil cakes in rich cumin ginger tomato gravy.",
        image: "/images/menu/dhokar_dalna.jpg",
      },
      {
        name: "Murgir Jhol",
        category: "Main Course",
        price: 310,
        description: "Homestyle Bengali chicken curry with tender potato wedges.",
        image: "/images/menu/murgir_jhol.jpg",
      },
      {
        name: "Koraishutir Kochuri & Alur Dom",
        category: "Main Course",
        price: 190,
        description: "Green pea stuffed flaky fried puris with spiced dum aloo.",
        image: "/images/menu/koraishutir_kochuri.jpg",
      },

      // Desserts (6 items)
      {
        name: "Mishti Doi",
        category: "Desserts",
        price: 90,
        description: "Traditional sweet caramelised yoghurt in earthen pot.",
        image: "/images/menu/mishti_doi.jpg",
      },
      {
        name: "Rosogolla (2 pcs)",
        category: "Desserts",
        price: 70,
        description: "Spongy cottage cheese balls in cardamom syrup.",
        image: "/images/menu/rosogolla.jpg",
      },
      {
        name: "Baked Sandesh",
        category: "Desserts",
        price: 110,
        description: "Oven-baked sweet cottage cheese delight with saffron.",
        image: "/images/menu/baked_sandesh.jpg",
      },
      {
        name: "Chhanar Payesh",
        category: "Desserts",
        price: 130,
        description: "Delicate cottage cheese beads in saffron cardamom milk reduction.",
        image: "/images/menu/chhanar_payesh.jpg",
      },
      {
        name: "Langcha",
        category: "Desserts",
        price: 90,
        description: "Fried oblong sweet cheese dumplings soaked in warm cardamom syrup.",
        image: "/images/menu/langcha.jpg",
      },
      {
        name: "Patishapta",
        category: "Desserts",
        price: 120,
        description: "Thin crepes rolled with fresh coconut, khoya and jaggery filling.",
        image: "/images/menu/patishapta.jpg",
      },

      // Beverages (4 items)
      {
        name: "Aam Panna",
        category: "Beverages",
        price: 80,
        description: "Refreshing roasted raw mango summer cooler.",
        image: "/images/menu/aam_panna.jpg",
      },
      {
        name: "Lemon Iced Tea",
        category: "Beverages",
        price: 110,
        description: "House-brewed black tea with lemon mint.",
        image: "/images/menu/lemon_iced_tea.jpg",
      },
      {
        name: "Gondhoraj Ghol",
        category: "Beverages",
        price: 90,
        description: "Bengali spiced buttermilk infused with Gondhoraj lime & roasted cumin.",
        image: "/images/menu/gondhoraj_ghol.jpg",
      },
      {
        name: "Masala Chai with Kulhad",
        category: "Beverages",
        price: 60,
        description: "Fragrant spiced milk tea brewed with cardamom, ginger in clay cup.",
        image: "/images/menu/masala_chai.jpg",
      },
    ];

    for (const m of menuItemsData) {
      const existing = await MenuItem.findOne({ name: m.name });
      if (!existing) {
        await MenuItem.create(m);
      } else {
        existing.category = m.category;
        existing.price = m.price;
        existing.description = m.description;
        existing.image = m.image;
        await existing.save();
      }
    }
    console.log("✅ Seeded & Verified 27 Menu Items with Exact Images into MongoDB");

  } catch (err) {
    console.error("Error seeding MongoDB database:", err.message);
  }
}

module.exports = seedDatabase;
