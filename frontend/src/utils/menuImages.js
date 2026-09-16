/**
 * menuImages.js — Exact authentic photos for all Desi Delight menu items
 * Uses local bundled high-definition images located in /images/menu/
 */

export const EXACT_MENU_IMAGES = {
  // Starters
  "Mochar Chop": "/images/menu/mochar_chop.jpg",
  "Fish Kabiraji": "/images/menu/fish_kabiraji.jpg",
  "Chicken Cutlet": "/images/menu/chicken_cutlet.jpg",
  "Paneer Tikka": "/images/menu/paneer_tikka.jpg",
  "Gondhoraj Chicken Fry": "/images/menu/gondhoraj_chicken.jpg",
  "Gondhoraj Chicken": "/images/menu/gondhoraj_chicken.jpg",
  "Posto Bora": "/images/menu/posto_bora.jpg",

  // Main Course
  "Kosha Mangsho": "/images/menu/kosha_mangsho.jpg",
  "Steamed Bhetki Paturi": "/images/menu/bhetki_paturi.jpg",
  "Bhetki Paturi": "/images/menu/bhetki_paturi.jpg",
  "Shorshe Ilish": "/images/menu/shorshe_ilish.jpg",
  "Chingri Malai Curry": "/images/menu/chingri_malai_curry.jpg",
  "Basanti Pulao": "/images/menu/basanti_pulao.jpg",
  "Luchi & Cholar Dal": "/images/menu/luchi_cholar_dal.jpg",
  "Kolkata Mutton Biryani": "/images/menu/kolkata_biryani.jpg",
  "Kolkata Biryani": "/images/menu/kolkata_biryani.jpg",
  "Daab Chingri": "/images/menu/daab_chingri.jpg",
  "Dhokar Dalna": "/images/menu/dhokar_dalna.jpg",
  "Murgir Jhol": "/images/menu/murgir_jhol.jpg",
  "Bengali Chicken Curry": "/images/menu/murgir_jhol.jpg",
  "Koraishutir Kochuri & Alur Dom": "/images/menu/koraishutir_kochuri.jpg",
  "Koraishutir Kochuri": "/images/menu/koraishutir_kochuri.jpg",

  // Desserts
  "Mishti Doi": "/images/menu/mishti_doi.jpg",
  "Rosogolla (2 pcs)": "/images/menu/rosogolla.jpg",
  "Rosogolla": "/images/menu/rosogolla.jpg",
  "Rasgulla": "/images/menu/rosogolla.jpg",
  "Baked Sandesh": "/images/menu/baked_sandesh.jpg",
  "Chhanar Payesh": "/images/menu/chhanar_payesh.jpg",
  "Langcha": "/images/menu/langcha.jpg",
  "Patishapta": "/images/menu/patishapta.jpg",

  // Beverages
  "Aam Panna": "/images/menu/aam_panna.jpg",
  "Lemon Iced Tea": "/images/menu/lemon_iced_tea.jpg",
  "Gondhoraj Ghol": "/images/menu/gondhoraj_ghol.jpg",
  "Masala Chai with Kulhad": "/images/menu/masala_chai.jpg",
  "Masala Chai": "/images/menu/masala_chai.jpg",
};

export function getMenuItemImage(item) {
  // If item has a specific custom image URL that starts with /images/menu/
  if (item?.image && typeof item.image === "string" && item.image.trim().length > 3) {
    if (item.image.includes("unsplash.com") && item.name && EXACT_MENU_IMAGES[item.name]) {
      return EXACT_MENU_IMAGES[item.name];
    }
    return item.image.trim();
  }

  // Exact name match
  if (item?.name && EXACT_MENU_IMAGES[item.name]) {
    return EXACT_MENU_IMAGES[item.name];
  }

  const name = (item?.name || "").toLowerCase().trim();

  // Keyword check
  if (name.includes("biryani")) return "/images/menu/kolkata_biryani.jpg";
  if (name.includes("daab") && name.includes("chingri")) return "/images/menu/daab_chingri.jpg";
  if (name.includes("dhokar") || name.includes("dalna")) return "/images/menu/dhokar_dalna.jpg";
  if (name.includes("murgir") || (name.includes("chicken") && name.includes("curry"))) return "/images/menu/murgir_jhol.jpg";
  if (name.includes("kochuri") || name.includes("koraishuti") || name.includes("alur dom")) return "/images/menu/koraishutir_kochuri.jpg";
  if (name.includes("gondhoraj") && name.includes("chicken")) return "/images/menu/gondhoraj_chicken.jpg";
  if (name.includes("gondhoraj") && (name.includes("ghol") || name.includes("buttermilk"))) return "/images/menu/gondhoraj_ghol.jpg";
  if (name.includes("posto") || name.includes("bora")) return "/images/menu/posto_bora.jpg";
  if (name.includes("payesh") || name.includes("chhana")) return "/images/menu/chhanar_payesh.jpg";
  if (name.includes("langcha")) return "/images/menu/langcha.jpg";
  if (name.includes("patishapta") || name.includes("pitha")) return "/images/menu/patishapta.jpg";
  if (name.includes("chai") || name.includes("tea") || name.includes("kulhad")) return name.includes("iced") ? "/images/menu/lemon_iced_tea.jpg" : "/images/menu/masala_chai.jpg";

  if (name.includes("ilish") || name.includes("shorshe")) return "/images/menu/shorshe_ilish.jpg";
  if (name.includes("paturi") || name.includes("bhetki")) return "/images/menu/bhetki_paturi.jpg";
  if (name.includes("kabiraji")) return "/images/menu/fish_kabiraji.jpg";
  if (name.includes("mocha") || name.includes("chop")) return "/images/menu/mochar_chop.jpg";
  if (name.includes("cutlet") || name.includes("chicken cutlet")) return "/images/menu/chicken_cutlet.jpg";
  if (name.includes("tikka") || name.includes("paneer")) return "/images/menu/paneer_tikka.jpg";
  if (name.includes("mangsho") || name.includes("mutton") || name.includes("kosha")) return "/images/menu/kosha_mangsho.jpg";
  if (name.includes("chingri") || name.includes("malai") || name.includes("prawn")) return "/images/menu/chingri_malai_curry.jpg";
  if (name.includes("pulao") || name.includes("basanti") || name.includes("rice")) return "/images/menu/basanti_pulao.jpg";
  if (name.includes("luchi") || name.includes("puri") || name.includes("cholar dal")) return "/images/menu/luchi_cholar_dal.jpg";
  if (name.includes("doi") || name.includes("mishti doi") || name.includes("curd")) return "/images/menu/mishti_doi.jpg";
  if (name.includes("rosogolla") || name.includes("rasgulla")) return "/images/menu/rosogolla.jpg";
  if (name.includes("sandesh") || name.includes("sondesh")) return "/images/menu/baked_sandesh.jpg";
  if (name.includes("panna") || name.includes("aam")) return "/images/menu/aam_panna.jpg";

  // Category fallbacks
  const category = (item?.category || "").toLowerCase();
  if (category.includes("starter")) return "/images/menu/chicken_cutlet.jpg";
  if (category.includes("main")) return "/images/menu/kosha_mangsho.jpg";
  if (category.includes("dessert")) return "/images/menu/mishti_doi.jpg";
  if (category.includes("beverage") || category.includes("drink")) return "/images/menu/aam_panna.jpg";

  return "/images/menu/basanti_pulao.jpg";
}
