/**
 * Menu data model — the single source of truth shared by the interactive
 * menu, the ordering flow, and (later) the kitchen dashboard.
 *
 * Transcribed from the restaurant's official 7-page menu. Every item here is
 * orderable for pickup. Images live at /public/menu/<id>.jpg; until a real
 * photo exists, <DishImage> shows a graceful placeholder.
 */

export type Category =
  | 'soups'
  | 'appetizers'
  | 'street-food'
  | 'chicken'
  | 'lamb'
  | 'beef'
  | 'seafood'
  | 'vegetarian'
  | 'chinese'
  | 'tandoori'
  | 'biryani'
  | 'thali'
  | 'breads'
  | 'desserts'
  | 'drinks'
  | 'extras'
  | 'combos';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  /** Price in CAD. */
  price: number;
  category: Category;
  image: string;
  /** Heat level 0–3 (0 = none). */
  spice?: 0 | 1 | 2 | 3;
  vegetarian?: boolean;
  /** Chef's signature — featured on the homepage. */
  signature?: boolean;
}

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'chicken', label: 'Chicken' },
  { id: 'lamb', label: 'Lamb & Goat' },
  { id: 'beef', label: 'Beef' },
  { id: 'seafood', label: 'Seafood' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'tandoori', label: 'Tandoori' },
  { id: 'biryani', label: 'Biryani & Rice' },
  { id: 'chinese', label: 'Indo-Chinese' },
  { id: 'appetizers', label: 'Appetizers' },
  { id: 'street-food', label: 'Street Food' },
  { id: 'soups', label: 'Soups' },
  { id: 'thali', label: 'Thali' },
  { id: 'breads', label: 'Breads' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'drinks', label: 'Drinks' },
  { id: 'extras', label: 'Extras' },
  { id: 'combos', label: 'Combos' },
];

const i = (
  id: string,
  name: string,
  price: number,
  category: Category,
  description: string,
  opts: { spice?: 0 | 1 | 2 | 3; vegetarian?: boolean; signature?: boolean } = {}
): MenuItem => ({ id, name, price, category, description, image: `/menu/${id}.jpg`, ...opts });

export const MENU: MenuItem[] = [
  // ── Soups ───────────────────────────────────────────────────
  i('lentil-soup', 'Lentil Soup', 4.99, 'soups', 'Comforting yellow-lentil soup tempered with cumin and ginger.', { vegetarian: true, spice: 1 }),
  i('mulligatawny-soup', 'Mulligatawny Soup', 4.99, 'soups', 'Spiced lentil-and-vegetable soup with a gentle South Indian warmth.', { vegetarian: true, spice: 1 }),
  i('chicken-soup', 'Chicken Soup', 5.99, 'soups', 'Clear, fragrant chicken broth with herbs and spices.', { spice: 1 }),

  // ── Appetizers ──────────────────────────────────────────────
  i('vegetable-samosa', 'Vegetable Samosa (2 pcs)', 3.99, 'appetizers', 'Crisp pastry filled with spiced potato and peas.', { vegetarian: true, spice: 1, signature: true }),
  i('samosa-chaat', 'Samosa Chaat', 6.99, 'appetizers', 'Crushed samosa topped with chickpeas, yogurt, chutneys and spices.', { vegetarian: true, spice: 2 }),
  i('chaat-papri', 'Chaat Papri', 6.99, 'appetizers', 'Crisp wafers layered with chickpeas, yogurt and tangy chutneys.', { vegetarian: true, spice: 2 }),
  i('aloo-tikki', 'Aloo Tikki (2 pcs)', 3.99, 'appetizers', 'Golden pan-fried potato patties, crisp outside, soft within.', { vegetarian: true, spice: 1 }),
  i('aloo-tikki-chaat', 'Aloo Tikki Chaat', 7.99, 'appetizers', 'Potato patties topped with chickpeas, yogurt and chutneys.', { vegetarian: true, spice: 2 }),
  i('chicken-pakora', 'Chicken Pakora', 8.99, 'appetizers', 'Chicken fritters in spiced gram-flour batter, fried gold.', { spice: 2 }),
  i('fish-pakora', 'Fish Pakora', 9.99, 'appetizers', 'Carom-spiced gram-flour battered fish, fried crisp.', { spice: 2 }),
  i('veggie-pakora', 'Veggie Pakora (6 pcs)', 4.99, 'appetizers', 'Mixed vegetable fritters in a crisp spiced batter.', { vegetarian: true, spice: 1 }),
  i('paneer-pakora', 'Paneer Pakora', 9.99, 'appetizers', 'Cottage-cheese fritters in a light, crisp batter.', { vegetarian: true, spice: 1 }),
  i('onion-bhaji', 'Onion Bhaji (6 pcs)', 5.99, 'appetizers', 'Crisp onion fritters spiced with chilli and coriander.', { vegetarian: true, spice: 2 }),
  i('spring-roll', 'Spring Roll (5 pcs)', 6.99, 'appetizers', 'Crisp rolls stuffed with seasoned vegetables.', { vegetarian: true, spice: 1 }),
  i('bhel-puri', 'Bhel Puri', 7.99, 'appetizers', 'Puffed rice tossed with chutneys, onion and crunch.', { vegetarian: true, spice: 2 }),
  i('french-fries', 'French Fries', 4.99, 'appetizers', 'Classic crisp golden fries.', { vegetarian: true }),
  i('soya-malai-chaap', 'Soya Malai Chaap', 12.99, 'appetizers', 'Creamy marinated soya chaap, char-grilled and tender.', { vegetarian: true, spice: 2 }),
  i('shrimp-pakora', 'Shrimp Pakora (6 pcs)', 11.99, 'appetizers', 'Plump shrimp in a spiced gram-flour batter, fried crisp.', { spice: 2 }),
  i('fish-pakora-1kg', 'Fish Pakora — 1 kg', 22.0, 'appetizers', 'A full kilo of crisp Amritsari-style fish pakora to share.', { spice: 2 }),
  i('paneer-pakora-1kg', 'Paneer Pakora — 1 kg', 22.0, 'appetizers', 'A full kilo of crisp paneer pakora — perfect for a crowd.', { vegetarian: true, spice: 1 }),

  // ── Street Food & Rolls ─────────────────────────────────────
  i('chicken-kebab-roll', 'Chicken Kebab Roll', 10.99, 'street-food', 'Spiced chicken kebab wrapped in a soft paratha.', { spice: 2 }),
  i('chole-bhatura', 'Chole Bhatura', 9.99, 'street-food', 'Spiced chickpea curry with fluffy deep-fried bhatura.', { vegetarian: true, spice: 2, signature: true }),
  i('pani-puri', 'Pani Puri', 6.99, 'street-food', 'Crisp hollow puris with spiced tamarind-mint water.', { vegetarian: true, spice: 2 }),
  i('dahi-puri', 'Dahi Puri', 8.99, 'street-food', 'Crisp puris filled with potato, yogurt and chutneys.', { vegetarian: true, spice: 1 }),
  i('chicken-naan-roll', 'Chicken Naan Roll', 8.99, 'street-food', 'Tandoori chicken rolled in warm naan with chutney.', { spice: 2 }),
  i('veg-naan-roll', 'Veg Naan Roll', 7.99, 'street-food', 'Spiced vegetables wrapped in warm naan.', { vegetarian: true, spice: 1 }),

  // ── Chicken ─────────────────────────────────────────────────
  i('butter-chicken', 'Butter Chicken', 19.99, 'chicken', 'Tandoor-roasted chicken in a silken tomato-fenugreek butter gravy.', { spice: 1, signature: true }),
  i('chicken-curry', 'Chicken Curry', 13.99, 'chicken', 'Home-style Punjabi chicken curry, slow-cooked with whole spices.', { spice: 2 }),
  i('chicken-tikka-masala', 'Chicken Tikka Masala', 12.99, 'chicken', 'Char-grilled tikka in a spiced, cream-finished onion masala.', { spice: 2 }),
  i('chicken-vindaloo', 'Chicken Vindaloo', 12.99, 'chicken', 'Fiery Goan-style curry with vinegar and red chilli.', { spice: 3 }),
  i('chicken-karahi', 'Chicken Karahi', 12.99, 'chicken', 'Wok-tossed chicken with peppers, tomato and ginger.', { spice: 2 }),
  i('chicken-saag', 'Chicken Saag', 13.99, 'chicken', 'Chicken simmered in a silky spiced spinach gravy.', { spice: 2 }),
  i('chicken-korma', 'Chicken Korma', 13.99, 'chicken', 'Mild, nut-thickened korma scented with cardamom.', { spice: 1 }),
  i('chicken-daal', 'Chicken Daal', 13.99, 'chicken', 'Chicken cooked with lentils and warming spices.', { spice: 2 }),
  i('chicken-madras', 'Chicken Madras', 12.99, 'chicken', 'Bold South Indian curry with coconut and red chilli.', { spice: 3 }),
  i('south-indian-chicken', 'South Indian Chicken', 11.99, 'chicken', 'Coconut-and-curry-leaf chicken from the south.', { spice: 2 }),
  i('coconut-chicken-curry', 'Coconut Chicken Curry', 13.99, 'chicken', 'Chicken in a mellow coconut-milk curry.', { spice: 2 }),
  i('chicken-jalfrezi', 'Chicken Jalfrezi', 12.99, 'chicken', 'Stir-fried chicken with peppers, onion and green chilli.', { spice: 2 }),
  i('chicken-mango', 'Chicken Mango', 13.99, 'chicken', 'Chicken in a sweet-savoury mango-kissed sauce.', { spice: 1 }),
  i('chicken-mughlai', 'Chicken Mughlai', 13.99, 'chicken', 'Rich, royal Mughal-style chicken in creamy nut gravy.', { spice: 1 }),
  i('chicken-kabab-masala', 'Chicken Kabab Masala', 13.99, 'chicken', 'Grilled chicken kebab folded into a spiced masala.', { spice: 2 }),
  i('chicken-pasanda', 'Chicken Pasanda', 17.99, 'chicken', 'Chicken in a luxurious almond-and-cream pasanda gravy.', { spice: 1 }),
  i('chicken-do-pyaja', 'Chicken Do Pyaja', 15.99, 'chicken', 'Chicken cooked twice with sweet caramelised onions.', { spice: 2 }),

  // ── Lamb & Goat ─────────────────────────────────────────────
  i('coconut-lamb-curry', 'Coconut Lamb Curry', 13.99, 'lamb', 'Tender lamb in a fragrant coconut-milk curry.', { spice: 2 }),
  i('lamb-vindaloo', 'Lamb Vindaloo', 13.99, 'lamb', 'Fiery vinegar-and-chilli lamb curry, Goan style.', { spice: 3 }),
  i('lamb-saag', 'Lamb Saag', 13.99, 'lamb', 'Lamb braised in a silky spiced spinach gravy.', { spice: 2 }),
  i('lamb-madras', 'Lamb Madras', 13.99, 'lamb', 'Bold coconut-and-chilli South Indian lamb curry.', { spice: 3 }),
  i('lamb-chili', 'Lamb Chili', 13.99, 'lamb', 'Lamb tossed with peppers, onion and green chilli.', { spice: 3 }),
  i('lamb-jalfrezi', 'Lamb Jalfrezi', 13.99, 'lamb', 'Stir-fried lamb with peppers and spices.', { spice: 2 }),
  i('lamb-achari', 'Lamb Achari', 13.99, 'lamb', 'Lamb in a tangy pickling-spice gravy.', { spice: 2 }),
  i('south-indian-mutton', 'South Indian Mutton', 13.99, 'lamb', 'Bone-in mutton in a peppery curry-leaf gravy.', { spice: 3 }),
  i('lamb-karahi', 'Lamb Karahi', 13.99, 'lamb', 'Wok-tossed lamb with tomato, ginger and peppers.', { spice: 2 }),
  i('lamb-kabab-masala', 'Lamb Kabab Masala', 13.99, 'lamb', 'Grilled lamb kebab in a rich spiced masala.', { spice: 2 }),
  i('lamb-pasanda', 'Lamb Pasanda', 16.99, 'lamb', 'Lamb in a luxurious almond-cream pasanda gravy.', { spice: 1 }),
  i('lamb-chettinad', 'Lamb Chettinad', 16.99, 'lamb', 'Peppery, aromatic Chettinad lamb from Tamil Nadu.', { spice: 3 }),
  i('lamb-do-pyaja', 'Lamb Do Pyaja', 16.99, 'lamb', 'Lamb cooked twice with sweet caramelised onions.', { spice: 2 }),
  i('lamb-bangalori', 'Lamb Bangalori Pal', 13.99, 'lamb', 'Bangalore-style lamb in a spiced regional gravy.', { spice: 2 }),
  i('goat-curry', 'Goat Curry', 16.99, 'lamb', 'Bone-in goat slow-cooked in a robust home-style curry.', { spice: 2, signature: true }),
  i('goat-korma', 'Goat Korma', 16.99, 'lamb', 'Goat in a mellow, nut-thickened korma.', { spice: 1 }),

  // ── Beef ────────────────────────────────────────────────────
  i('beef-curry', 'Beef Curry', 13.99, 'beef', 'Tender beef slow-cooked in a robust Punjabi curry.', { spice: 2 }),
  i('beef-vindaloo', 'Beef Vindaloo', 13.99, 'beef', 'Fiery vinegar-and-chilli beef curry.', { spice: 3 }),
  i('beef-tikka-masala', 'Beef Tikka Masala', 13.99, 'beef', 'Grilled beef in a spiced, cream-finished masala.', { spice: 2 }),
  i('beef-korma', 'Beef Korma', 13.99, 'beef', 'Beef in a mild, nut-thickened korma.', { spice: 1 }),
  i('beef-kabab-masala', 'Beef Kabab Masala', 13.99, 'beef', 'Grilled beef kebab in a rich spiced masala.', { spice: 2 }),
  i('beef-pasanda', 'Beef Pasanda', 16.99, 'beef', 'Beef in a luxurious almond-cream pasanda gravy.', { spice: 1 }),
  i('beef-chettinad', 'Beef Chettinad', 15.99, 'beef', 'Peppery, aromatic Chettinad-style beef.', { spice: 3 }),
  i('beef-do-pyaja', 'Beef Do Pyaja', 15.99, 'beef', 'Beef cooked twice with sweet caramelised onions.', { spice: 2 }),
  i('beef-bangalori', 'Beef Bangalori Pal', 13.99, 'beef', 'Bangalore-style beef in a spiced regional gravy.', { spice: 2 }),

  // ── Seafood ─────────────────────────────────────────────────
  i('shrimp-curry', 'Shrimp Curry', 13.99, 'seafood', 'Shrimp in a coriander-rich onion-tomato curry.', { spice: 2 }),
  i('shrimp-saag', 'Shrimp Saag', 13.99, 'seafood', 'Shrimp simmered in a silky spiced spinach gravy.', { spice: 2 }),
  i('shrimp-korma', 'Shrimp Korma', 16.99, 'seafood', 'Shrimp in a mellow, nut-thickened korma.', { spice: 1 }),
  i('shrimp-masala', 'Shrimp Masala', 13.99, 'seafood', 'Shrimp in a spiced onion-tomato masala.', { spice: 2 }),
  i('shrimp-karahi', 'Shrimp Karahi', 13.99, 'seafood', 'Wok-tossed shrimp with peppers and ginger.', { spice: 2 }),
  i('shrimp-vindaloo', 'Shrimp Vindaloo', 13.99, 'seafood', 'Fiery vinegar-and-chilli shrimp curry.', { spice: 3 }),
  i('fish-curry', 'Fish Curry', 13.99, 'seafood', 'Fish fillets in a coriander-rich onion-tomato curry.', { spice: 2 }),
  i('fish-saag', 'Fish Saag', 13.99, 'seafood', 'Fish in a silky spiced spinach gravy.', { spice: 2 }),
  i('fish-tikka-masala', 'Fish Tikka Masala', 13.99, 'seafood', 'Grilled fish in a spiced, cream-finished masala.', { spice: 2 }),

  // ── Vegetarian ──────────────────────────────────────────────
  i('palak-paneer', 'Palak Paneer', 11.99, 'vegetarian', 'Cottage cheese in a silky spiced spinach gravy.', { vegetarian: true, spice: 1, signature: true }),
  i('paneer-kadai', 'Paneer Kadai', 11.99, 'vegetarian', 'Paneer wok-tossed with peppers, tomato and spices.', { vegetarian: true, spice: 2 }),
  i('paneer-tikka-masala', 'Paneer Tikka Masala', 12.99, 'vegetarian', 'Char-grilled paneer in a spiced, creamy masala.', { vegetarian: true, spice: 2 }),
  i('paneer-makhani', 'Paneer Makhani', 11.99, 'vegetarian', 'Paneer in a buttery tomato-fenugreek gravy.', { vegetarian: true, spice: 1 }),
  i('mattar-paneer', 'Mattar Paneer', 11.99, 'vegetarian', 'Paneer and sweet peas in a spiced onion-tomato gravy.', { vegetarian: true, spice: 1 }),
  i('paneer-korma', 'Paneer Korma', 11.99, 'vegetarian', 'Paneer in a mild, nut-thickened korma.', { vegetarian: true, spice: 1 }),
  i('shahi-paneer', 'Shahi Paneer', 11.99, 'vegetarian', 'Royal cashew-and-saffron gravy cradling soft paneer.', { vegetarian: true, spice: 1 }),
  i('daal-tarka', 'Daal Tarka', 11.99, 'vegetarian', 'Yellow lentils tempered with garlic, ginger and spices.', { vegetarian: true, spice: 1 }),
  i('daal-makhani', 'Daal Makhani', 11.99, 'vegetarian', 'Black lentils simmered overnight with butter and cream.', { vegetarian: true, spice: 1, signature: true }),
  i('mixed-vegetables', 'Mixed Vegetables', 11.99, 'vegetarian', 'Seasonal vegetables in a spiced onion-tomato gravy.', { vegetarian: true, spice: 1 }),
  i('malai-kofta', 'Malai Kofta', 11.99, 'vegetarian', 'Paneer-and-potato dumplings in a velvety cream sauce.', { vegetarian: true, spice: 1 }),
  i('aloo-palak', 'Aloo Palak', 10.99, 'vegetarian', 'Potatoes in a silky spiced spinach gravy.', { vegetarian: true, spice: 1 }),
  i('aloo-gobi', 'Aloo Gobi', 11.99, 'vegetarian', 'Potatoes and cauliflower sautéed with herbs and spices.', { vegetarian: true, spice: 1 }),
  i('aloo-mattar', 'Aloo Mattar', 10.99, 'vegetarian', 'Potatoes and peas in a spiced onion-tomato gravy.', { vegetarian: true, spice: 1 }),
  i('shahi-navratan-korma', 'Shahi Navratan Korma', 11.99, 'vegetarian', 'Nine vegetables in a creamy, lightly sweet korma.', { vegetarian: true, spice: 1 }),
  i('bhindi-masala', 'Bhindi Masala', 11.99, 'vegetarian', 'Okra sautéed with onion, tomato and aromatic spices.', { vegetarian: true, spice: 2 }),
  i('sarson-da-saag', 'Sarson Da Saag', 9.99, 'vegetarian', 'Slow-cooked mustard greens finished with white butter.', { vegetarian: true, spice: 1, signature: true }),
  i('vegetable-korma', 'Vegetable Korma', 11.99, 'vegetarian', 'Mixed vegetables in a creamy cashew korma.', { vegetarian: true, spice: 1 }),
  i('soya-chaap-masala', 'Soya Chaap Masala', 11.99, 'vegetarian', 'Soya chaap in a rich onion-tomato masala.', { vegetarian: true, spice: 2 }),
  i('paneer-pasanda', 'Paneer Pasanda', 16.99, 'vegetarian', 'Stuffed paneer in a luxurious almond-cream gravy.', { vegetarian: true, spice: 1 }),

  // ── Indo-Chinese ────────────────────────────────────────────
  i('chili-chicken', 'Chili Chicken', 13.99, 'chinese', 'Crisp chicken tossed in a spicy chilli-garlic sauce.', { spice: 3 }),
  i('chili-paneer', 'Chili Paneer', 13.99, 'chinese', 'Crisp paneer tossed in a spicy chilli-soy sauce.', { vegetarian: true, spice: 3 }),
  i('chicken-manchurian', 'Chicken Manchurian', 12.99, 'chinese', 'Chicken balls in a spicy garlic-ginger sauce.', { spice: 2 }),
  i('veg-manchurian', 'Veg Manchurian', 13.99, 'chinese', 'Vegetable balls in a spicy garlic-ginger sauce.', { vegetarian: true, spice: 2 }),
  i('chicken-65', 'Chicken 65', 12.99, 'chinese', 'Spicy deep-fried South Indian chicken with curry leaves.', { spice: 3 }),
  i('chicken-fried-rice', 'Chicken Fried Rice', 12.99, 'chinese', 'Wok-fried rice with chicken, egg and vegetables.', { spice: 1 }),
  i('egg-fried-rice', 'Egg Fried Rice', 12.99, 'chinese', 'Wok-fried rice with egg and vegetables.', { spice: 1 }),
  i('veg-fried-rice', 'Veg Fried Rice', 12.99, 'chinese', 'Wok-fried rice with mixed vegetables.', { vegetarian: true, spice: 1 }),
  i('veg-noodles', 'Veg Noodles', 11.99, 'chinese', 'Stir-fried noodles with mixed vegetables.', { vegetarian: true, spice: 1 }),

  // ── Tandoori ────────────────────────────────────────────────
  i('chicken-seekh-kebab', 'Chicken Seekh Kebab (5)', 12.99, 'tandoori', 'Spiced minced-chicken skewers seared in the clay oven.', { spice: 2 }),
  i('lamb-seekh-kebab', 'Lamb Seekh Kebab (5)', 13.99, 'tandoori', 'Spiced minced-lamb skewers seared in the clay oven.', { spice: 2 }),
  i('achar-paneer-tandoori', 'Achar Paneer Tandoori', 11.99, 'tandoori', 'Pickle-spiced paneer char-grilled in the tandoor.', { vegetarian: true, spice: 2 }),
  i('half-chicken-tandoori', 'Half Tandoori Chicken', 11.99, 'tandoori', 'Half chicken marinated overnight and clay-oven seared.', { spice: 2 }),
  i('whole-tandoori-chicken', 'Whole Tandoori Chicken', 22.99, 'tandoori', 'Whole bone-in chicken lacquered red and tandoor-fired.', { spice: 2, signature: true }),
  i('tandoori-shrimp', 'Tandoori Shrimp', 16.99, 'tandoori', 'Tiger shrimp in saffron-yogurt marinade, clay-oven seared.', { spice: 2 }),
  i('fish-tikka', 'Fish Tikka', 15.99, 'tandoori', 'Marinated fish char-grilled in the tandoor.', { spice: 2 }),
  i('chicken-tikka', 'Chicken Tikka', 14.99, 'tandoori', 'Boneless chicken in yogurt-and-spice marinade, char-grilled.', { spice: 2 }),
  i('hariyali-tikka', 'Hariyali Tikka', 15.99, 'tandoori', 'Chicken in a fresh mint-and-coriander marinade.', { spice: 2 }),

  // ── Biryani & Rice ──────────────────────────────────────────
  i('chicken-biryani-bone', 'Dum Biryani Chicken (bone-in)', 12.99, 'biryani', 'Bone-in chicken layered with saffron basmati, slow-dum-cooked.', { spice: 2 }),
  i('chicken-biryani', 'Chicken Biryani', 12.99, 'biryani', 'Fragrant saffron basmati layered with spiced chicken.', { spice: 2, signature: true }),
  i('lamb-biryani', 'Lamb Biryani', 13.99, 'biryani', 'Saffron basmati layered with tender spiced lamb.', { spice: 2 }),
  i('shrimp-biryani', 'Shrimp Biryani', 13.99, 'biryani', 'Saffron basmati layered with spiced shrimp.', { spice: 2 }),
  i('goat-biryani', 'Goat Biryani', 13.99, 'biryani', 'Saffron basmati layered with bone-in goat.', { spice: 2 }),
  i('beef-biryani', 'Beef Biryani', 13.99, 'biryani', 'Saffron basmati layered with spiced beef.', { spice: 2 }),
  i('veg-biryani', 'Vegetable Biryani', 12.99, 'biryani', 'Saffron basmati layered with spiced seasonal vegetables.', { vegetarian: true, spice: 2 }),
  i('rice', 'Steamed Rice', 4.99, 'biryani', 'Fluffy steamed basmati rice.', { vegetarian: true }),
  i('pulao-rice', 'Pulao Rice', 4.99, 'biryani', 'Basmati rice gently spiced with whole aromatics.', { vegetarian: true }),
  i('veg-pulao', 'Vegetable Pulao', 8.99, 'biryani', 'Basmati pulao with peas and seasonal vegetables.', { vegetarian: true, spice: 1 }),

  // ── Thali ───────────────────────────────────────────────────
  i('veggie-thali', 'Vegetarian Thali', 11.99, 'thali', 'A complete platter: curry, daal, rice, naan, dessert and sides.', { vegetarian: true, spice: 1 }),
  i('non-veg-thali', 'Non-Veg Thali', 12.99, 'thali', 'A complete platter with a meat curry, rice, naan and sides.', { spice: 2 }),
  i('lamb-thali', 'Lamb Thali', 19.99, 'thali', 'A generous lamb feast with rice, naan, dessert and sides.', { spice: 2 }),

  // ── Breads ──────────────────────────────────────────────────
  i('butter-naan', 'Butter Naan', 1.99, 'breads', 'Soft tandoor-baked naan brushed with butter.', { vegetarian: true }),
  i('garlic-naan', 'Garlic Naan', 2.99, 'breads', 'Naan studded with garlic and fresh coriander.', { vegetarian: true }),
  i('aloo-naan', 'Aloo Naan', 3.99, 'breads', 'Naan stuffed with spiced mashed potato.', { vegetarian: true }),
  i('paneer-cheese-naan', 'Paneer Cheese Naan', 4.99, 'breads', 'Naan stuffed with paneer and melted cheese.', { vegetarian: true }),
  i('keema-naan', 'Keema Naan', 4.99, 'breads', 'Naan stuffed with spiced minced meat.', { spice: 1 }),
  i('chicken-naan', 'Chicken Naan', 4.99, 'breads', 'Naan stuffed with spiced chicken.', { spice: 1 }),
  i('onion-cheese-naan', 'Onion Cheese Naan', 7.99, 'breads', 'Naan filled with onion and melted cheese.', { vegetarian: true }),
  i('lacha-paratha', 'Lacha Paratha', 2.99, 'breads', 'Flaky, layered whole-wheat griddle bread.', { vegetarian: true }),
  i('ogeenu-kulcha', 'Onion Kulcha', 3.99, 'breads', 'Soft leavened bread stuffed with spiced onion.', { vegetarian: true }),
  i('tandoori-roti', 'Tandoori Roti', 2.99, 'breads', 'Whole-wheat flatbread baked in the clay oven.', { vegetarian: true }),
  i('amritsari-kulcha-1', 'Amritsari Kulcha (1 pc)', 8.99, 'breads', 'Amritsar-style crisp stuffed kulcha.', { vegetarian: true }),
  i('amritsari-kulcha-2', 'Amritsari Kulcha (2 pc)', 9.99, 'breads', 'A pair of Amritsar-style crisp stuffed kulchas.', { vegetarian: true }),
  i('paneer-prantha', 'Paneer Paratha', 3.99, 'breads', 'Whole-wheat paratha stuffed with spiced paneer.', { vegetarian: true }),
  i('aloo-prantha-tandoori', 'Aloo Paratha', 3.99, 'breads', 'Tandoor paratha stuffed with spiced potato.', { vegetarian: true }),
  i('bathura', 'Bathura', 1.99, 'breads', 'Fluffy deep-fried leavened bread.', { vegetarian: true }),

  // ── Desserts ────────────────────────────────────────────────
  i('gulab-jamun', 'Gulab Jamun', 3.99, 'desserts', 'Warm milk dumplings soaked in rose-cardamom syrup.', { vegetarian: true, signature: true }),
  i('rasmalai', 'Rasmalai', 3.99, 'desserts', 'Soft cheese discs in saffron-cardamom milk with pistachio.', { vegetarian: true }),
  i('kheer', 'Kheer', 3.99, 'desserts', 'Slow-cooked rice pudding with cardamom and nuts.', { vegetarian: true }),

  // ── Drinks ──────────────────────────────────────────────────
  i('mango-lassi', 'Mango Lassi', 3.99, 'drinks', 'Alphonso mango whipped with thick yogurt and cardamom.', { vegetarian: true, signature: true }),
  i('sweet-lassi', 'Sweet Lassi', 3.99, 'drinks', 'Classic sweet churned yogurt drink.', { vegetarian: true }),
  i('salty-lassi', 'Salty Lassi', 3.99, 'drinks', 'Savoury churned yogurt drink with a hint of cumin.', { vegetarian: true }),
  i('mango-shake', 'Mango Shake', 4.5, 'drinks', 'Thick, creamy mango milkshake.', { vegetarian: true }),
  i('rose-milk', 'Rose Milk', 1.99, 'drinks', 'Chilled milk scented with rose.', { vegetarian: true }),
  i('masala-tea', 'Masala Chai', 2.99, 'drinks', 'Assam tea brewed with milk, ginger and garam masala.', { vegetarian: true }),
  i('soft-drink', 'Soft Drink', 1.99, 'drinks', 'Chilled canned soft drink.', { vegetarian: true }),
  i('water', 'Bottled Water', 1.99, 'drinks', 'Bottled spring water.', { vegetarian: true }),

  // ── Extras ──────────────────────────────────────────────────
  i('salad', 'Garden Salad', 6.0, 'extras', 'Fresh crisp salad with onion, tomato and lemon.', { vegetarian: true }),
  i('raita', 'Raita', 4.0, 'extras', 'Cooling spiced yogurt with cucumber.', { vegetarian: true }),
  i('butter-sauce', 'Butter Sauce (side)', 3.0, 'extras', 'A side of rich makhani butter sauce.', { vegetarian: true }),
  i('yogurt', 'Yogurt', 2.0, 'extras', 'A side of plain fresh yogurt.', { vegetarian: true }),
  i('mango-chutney', 'Mango Chutney', 1.99, 'extras', 'Sweet-tangy mango chutney.', { vegetarian: true }),
  i('mix-pickle', 'Mixed Pickle', 1.49, 'extras', 'Tangy, spicy Indian mixed pickle.', { vegetarian: true }),
  i('side-rice', 'Side Rice', 1.99, 'extras', 'A small side of steamed rice.', { vegetarian: true }),

  // ── Combos ──────────────────────────────────────────────────
  i('combo-a', 'Combo A (1 person)', 24.99, 'combos', 'Onion bhaji, lamb curry, rice, papadum, dessert and drink.', { spice: 2 }),
  i('combo-b', 'Combo B (1 person)', 32.99, 'combos', 'Chicken kabab, butter chicken, rice, papadum, dessert and drink.', { spice: 2 }),
  i('combo-c', 'Combo C (1 person)', 23.99, 'combos', 'Samosa, chicken tikka masala, rice, papadum, dessert and drink.', { spice: 2 }),
  i('combo-d-veggie', 'Combo D Veggie (1 person)', 22.99, 'combos', 'Vegetable pakora, malai kofta, rice, papadum, dessert and drink.', { vegetarian: true, spice: 1 }),
  i('combo-aa', 'Combo AA (2 people)', 56.99, 'combos', 'Bhaji, seekh kabab, tandoori chicken, lamb curry, rice, sides for two.', { spice: 2 }),
  i('combo-bb-veggie', 'Combo BB Veggie (2 people)', 52.99, 'combos', 'Pakora, paneer, malai kofta, naan or rice, sides for two.', { vegetarian: true, spice: 1 }),
  i('combo-cc', 'Combo CC (2 people)', 59.99, 'combos', 'Samosa, seekh kabab, chicken tikka masala, lamb bhuna, palak paneer for two.', { spice: 2 }),
  i('combo-dd-veggie', 'Combo DD Veggie (2 people)', 39.99, 'combos', 'Pakora, bhaji, malai kofta, tarka daal, rice, sides for two.', { vegetarian: true, spice: 1 }),
  i('family-deal', 'Family Deal (6 people)', 120.0, 'combos', '6 samosas, butter chicken, chicken tandoori, chana masala, mixed veg, 3 rice, 6 naan and dessert.', { spice: 2, signature: true }),
];

/** Signature dishes featured on the homepage. */
export const SIGNATURES = MENU.filter((m) => m.signature);

export function itemsByCategory(category: Category) {
  return MENU.filter((m) => m.category === category);
}

export function getItem(id: string) {
  return MENU.find((m) => m.id === id);
}
