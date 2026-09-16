/**
 * db.js — a tiny localStorage-backed mock database.
 *
 * This lets the whole app run and feel real with zero backend.
 * Every "service" file below reads/writes through here, using the
 * same method names an Express + MongoDB backend would expose, so
 * swapping in real axios calls later only touches this file.
 */

const KEY = "ttw_db_v1";

const seed = {
  users: [
    { id: "u1", name: "Admin User", email: "admin@desidelighthotels.com", password: "admin123", phone: "9000000001", role: "admin" },
    { id: "u2", name: "Staff Member", email: "staff@desidelighthotels.com", password: "staff123", phone: "9000000002", role: "staff", designation: "Head Waiter & Floor In-Charge", department: "Service", shift: "Morning (9 AM - 4 PM)", status: "Active" },
    { id: "u4", name: "Bikram Sen", email: "bikram.chef@desidelighthotels.com", password: "staff123", phone: "9830112233", role: "staff", designation: "Executive Head Chef", department: "Kitchen", shift: "Evening (4 PM - 11 PM)", status: "Active" },
    { id: "u5", name: "Priya Sharma", email: "priya.hostess@desidelighthotels.com", password: "staff123", phone: "9830445566", role: "staff", designation: "Lead Hostess & Reception", department: "Front Desk", shift: "Morning (9 AM - 4 PM)", status: "Active" },
    { id: "u6", name: "Rajesh Mondal", email: "rajesh.bar@desidelighthotels.com", password: "staff123", phone: "9830778899", role: "staff", designation: "Senior Bartender & Mixologist", department: "Bar & Beverages", shift: "Evening (4 PM - 11 PM)", status: "Active" },
    { id: "u3", name: "Asha Rao", email: "asha@example.com", password: "customer123", phone: "9000000003", role: "customer" },
  ],
  tables: [
    { id: "t1", number: 1, capacity: 2, status: "Available", location: "Window" },
    { id: "t2", number: 2, capacity: 2, status: "Available", location: "Window" },
    { id: "t3", number: 3, capacity: 4, status: "Available", location: "Main Hall" },
    { id: "t4", number: 4, capacity: 4, status: "Available", location: "Main Hall" },
    { id: "t5", number: 5, capacity: 4, status: "Available", location: "Main Hall" },
    { id: "t6", number: 6, capacity: 6, status: "Available", location: "Main Hall" },
    { id: "t7", number: 7, capacity: 6, status: "Available", location: "Patio" },
    { id: "t8", number: 8, capacity: 8, status: "Available", location: "Private Room" },
    { id: "t9", number: 9, capacity: 8, status: "Available", location: "Private Room" },
    { id: "t10", number: 10, capacity: 12, status: "Available", location: "VIP Lounge" },
  ],
  reservations: [
    { id: "r1", customerName: "Asha Rao", customerId: "u3", phone: "9000000003", tableId: "t3", tableNumber: 3, date: todayStr(), time: "19:30", guests: 4, status: "Confirmed" },
    { id: "r2", customerName: "Rohan Mehta", customerId: null, phone: "9123456780", tableId: "t2", tableNumber: 2, date: todayStr(), time: "13:00", guests: 2, status: "Seated" },
    { id: "r3", customerName: "Priya Nair", customerId: null, phone: "9988776655", tableId: "t8", tableNumber: 8, date: todayStr(), time: "12:30", guests: 3, status: "Seated" },
  ],
  customers: [
    { id: "c1", name: "Asha Rao", phone: "9000000003", email: "asha@example.com", address: "Haldia, WB", visits: 5 },
    { id: "c2", name: "Rohan Mehta", phone: "9123456780", email: "rohan@example.com", address: "Kolkata, WB", visits: 2 },
    { id: "c3", name: "Priya Nair", phone: "9988776655", email: "priya@example.com", address: "Digha, WB", visits: 8 },
  ],
  menu: [
    // Starters (6 items)
    { id: "m1", name: "Mochar Chop", category: "Starters", price: 140, description: "Banana flower croquettes with Bengali spices.", image: "/images/menu/mochar_chop.jpg" },
    { id: "m2", name: "Fish Kabiraji", category: "Starters", price: 220, description: "Crispy fried Bhetki fillet in fluffy egg nest.", image: "/images/menu/fish_kabiraji.jpg" },
    { id: "m3", name: "Chicken Cutlet", category: "Starters", price: 180, description: "Minced spiced chicken cutlet with mustard dip.", image: "/images/menu/chicken_cutlet.jpg" },
    { id: "m4", name: "Paneer Tikka", category: "Starters", price: 190, description: "Char-grilled marinated cottage cheese cubes.", image: "/images/menu/paneer_tikka.jpg" },
    { id: "m16", name: "Gondhoraj Chicken Fry", category: "Starters", price: 240, description: "Crisp boneless chicken strips infused with Gondhoraj lime & green chili.", image: "/images/menu/gondhoraj_chicken.jpg" },
    { id: "m17", name: "Posto Bora", category: "Starters", price: 160, description: "Crispy golden shallow-fried poppy seed patties with green chili.", image: "/images/menu/posto_bora.jpg" },

    // Main Course (11 items)
    { id: "m5", name: "Kosha Mangsho", category: "Main Course", price: 340, description: "Slow-cooked authentic Bengali mutton curry.", image: "/images/menu/kosha_mangsho.jpg" },
    { id: "m6", name: "Steamed Bhetki Paturi", category: "Main Course", price: 390, description: "Bhetki fish wrapped in banana leaf with mustard.", image: "/images/menu/bhetki_paturi.jpg" },
    { id: "m7", name: "Shorshe Ilish", category: "Main Course", price: 450, description: "Hilsa fish in rich mustard and green chilli sauce.", image: "/images/menu/shorshe_ilish.jpg" },
    { id: "m8", name: "Chingri Malai Curry", category: "Main Course", price: 420, description: "Prawns simmered in spiced coconut milk gravy.", image: "/images/menu/chingri_malai_curry.jpg" },
    { id: "m9", name: "Basanti Pulao", category: "Main Course", price: 180, description: "Fragrant sweet saffron rice with cashews & raisins.", image: "/images/menu/basanti_pulao.jpg" },
    { id: "m10", name: "Luchi & Cholar Dal", category: "Main Course", price: 160, description: "Fluffy fried bread served with coconut chana dal.", image: "/images/menu/luchi_cholar_dal.jpg" },
    { id: "m18", name: "Kolkata Mutton Biryani", category: "Main Course", price: 460, description: "Royal fragrant basmati rice with spiced mutton, golden potato & egg.", image: "/images/menu/kolkata_biryani.jpg" },
    { id: "m19", name: "Daab Chingri", category: "Main Course", price: 480, description: "Jumbo tiger prawns slow-cooked inside a tender green coconut shell.", image: "/images/menu/daab_chingri.jpg" },
    { id: "m20", name: "Dhokar Dalna", category: "Main Course", price: 220, description: "Spiced chana dal lentil cakes in rich cumin ginger tomato gravy.", image: "/images/menu/dhokar_dalna.jpg" },
    { id: "m21", name: "Murgir Jhol", category: "Main Course", price: 310, description: "Homestyle Bengali chicken curry with tender potato wedges.", image: "/images/menu/murgir_jhol.jpg" },
    { id: "m22", name: "Koraishutir Kochuri & Alur Dom", category: "Main Course", price: 190, description: "Green pea stuffed flaky fried puris with spiced dum aloo.", image: "/images/menu/koraishutir_kochuri.jpg" },

    // Desserts (6 items)
    { id: "m11", name: "Mishti Doi", category: "Desserts", price: 90, description: "Traditional sweet caramelised yoghurt in earthen pot.", image: "/images/menu/mishti_doi.jpg" },
    { id: "m12", name: "Rosogolla (2 pcs)", category: "Desserts", price: 70, description: "Spongy cottage cheese balls in cardamom syrup.", image: "/images/menu/rosogolla.jpg" },
    { id: "m13", name: "Baked Sandesh", category: "Desserts", price: 110, description: "Oven-baked sweet cottage cheese delight with saffron.", image: "/images/menu/baked_sandesh.jpg" },
    { id: "m23", name: "Chhanar Payesh", category: "Desserts", price: 130, description: "Delicate cottage cheese beads in saffron cardamom milk reduction.", image: "/images/menu/chhanar_payesh.jpg" },
    { id: "m24", name: "Langcha", category: "Desserts", price: 90, description: "Fried oblong sweet cheese dumplings soaked in warm cardamom syrup.", image: "/images/menu/langcha.jpg" },
    { id: "m25", name: "Patishapta", category: "Desserts", price: 120, description: "Thin crepes rolled with fresh coconut, khoya and jaggery filling.", image: "/images/menu/patishapta.jpg" },

    // Beverages (4 items)
    { id: "m14", name: "Aam Panna", category: "Beverages", price: 80, description: "Refreshing roasted raw mango summer cooler.", image: "/images/menu/aam_panna.jpg" },
    { id: "m15", name: "Lemon Iced Tea", category: "Beverages", price: 110, description: "House-brewed black tea with lemon mint.", image: "/images/menu/lemon_iced_tea.jpg" },
    { id: "m26", name: "Gondhoraj Ghol", category: "Beverages", price: 90, description: "Bengali spiced buttermilk infused with Gondhoraj lime & roasted cumin.", image: "/images/menu/gondhoraj_ghol.jpg" },
    { id: "m27", name: "Masala Chai with Kulhad", category: "Beverages", price: 60, description: "Fragrant spiced milk tea brewed with cardamom, ginger in clay cup.", image: "/images/menu/masala_chai.jpg" },
  ],
  orders: [
    { id: "o1", reservationId: "r2", items: [{ menuId: "m6", qty: 1 }, { menuId: "m15", qty: 2 }], status: "Preparing", total: 390 + 110 * 2 },
  ],
  payments: [],
  reviews: [],
  notifications: [],
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function load() {
  const raw = localStorage.getItem(KEY);
  let data;
  if (!raw) {
    data = structuredClone(seed);
    save(data);
    return data;
  } else {
    try {
      data = JSON.parse(raw);
    } catch {
      data = structuredClone(seed);
      save(data);
      return data;
    }
  }

  if (!data.users) data.users = [];
  
  // Ensure all 27 seed menu items exist and have exact images
  let menuUpdated = false;
  if (!Array.isArray(data.menu)) {
    data.menu = structuredClone(seed.menu);
    menuUpdated = true;
  } else {
    // Add any missing items from seed.menu
    seed.menu.forEach((sm) => {
      const exists = data.menu.find((m) => m.name?.toLowerCase() === sm.name.toLowerCase() || m.id === sm.id);
      if (!exists) {
        data.menu.push(structuredClone(sm));
        menuUpdated = true;
      }
    });

    // Update images to exact local images
    data.menu.forEach((m) => {
      const seedItem = seed.menu.find((sm) => sm.name?.toLowerCase() === m.name?.toLowerCase());
      if (seedItem) {
        if (!m.image || m.image.includes("unsplash.com") || m.image !== seedItem.image) {
          m.image = seedItem.image;
          menuUpdated = true;
        }
      }
    });
  }

  if (menuUpdated) {
    save(data);
  }

  // Ensure primary admin account exists for login safeguard
  const adminIdx = data.users.findIndex(
    (u) => u.email?.toLowerCase() === "admin@desidelighthotels.com" || u.phone === "9000000001"
  );
  if (adminIdx === -1) {
    data.users.unshift({
      id: "u1",
      name: "Admin User",
      email: "admin@desidelighthotels.com",
      password: "admin123",
      phone: "9000000001",
      role: "admin",
    });
    save(data);
  }

  // Ensure default staff properties for any existing staff
  let modified = false;
  data.users.forEach((u) => {
    if (u.role === "staff") {
      if (!u.designation) { u.designation = "Staff Member"; modified = true; }
      if (!u.department) { u.department = "Service"; modified = true; }
      if (!u.shift) { u.shift = "Morning (9 AM - 4 PM)"; modified = true; }
      if (!u.status) { u.status = "Active"; modified = true; }
    }
  });

  if (modified) {
    save(data);
  }

  return data;
}

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("db_updated"));
  }
}

function uid(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

// simulate network latency so loading states feel real
function delay(value, ms = 250) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

const db = {
  todayStr,
  uid,
  delay,

  getAll(collection) {
    const data = load();
    return delay(structuredClone(data[collection] || []));
  },

  getOne(collection, id) {
    const data = load();
    const item = (data[collection] || []).find((x) => x.id === id) || null;
    return delay(item ? structuredClone(item) : null);
  },

  insert(collection, item) {
    const data = load();
    const record = { id: uid(collection[0]), ...item };
    data[collection] = [...(data[collection] || []), record];
    save(data);
    return delay(structuredClone(record));
  },

  update(collection, id, patch) {
    const data = load();
    data[collection] = (data[collection] || []).map((x) => (x.id === id ? { ...x, ...patch } : x));
    save(data);
    const updated = data[collection].find((x) => x.id === id);
    return delay(structuredClone(updated));
  },

  remove(collection, id) {
    const data = load();
    data[collection] = (data[collection] || []).filter((x) => x.id !== id);
    save(data);
    return delay(true);
  },

  reset() {
    save(seed);
  },
};

export default db;
