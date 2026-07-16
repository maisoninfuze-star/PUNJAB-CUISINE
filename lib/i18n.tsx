'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { MenuItem } from './menu';
import { MENU_FR, CATEGORY_LABELS_FR } from './menu-fr';

export type Lang = 'en' | 'fr';

/** Flat UI string dictionary. Keys are dot-namespaced by area. */
const DICT: Record<Lang, Record<string, string>> = {
  en: {
    'nav.experience': 'Experience',
    'nav.menu': 'Menu',
    'nav.story': 'Story',
    'nav.visit': 'Visit',
    'nav.order': 'Order Pickup',

    'hero.eyebrow': 'Est. Amritsar · Plated in Montréal',
    'hero.coords': '45.51° N — 73.57° W',
    'hero.dinner': 'Dinner from 5 PM',
    'hero.l1': 'Authentic',
    'hero.l2': 'Punjabi',
    'hero.l3': 'Cuisine',
    'hero.sub': 'Tandoor-fired, slow-cooked, crafted with passion.',
    'hero.reserve': 'Reserve a Table',
    'hero.order': 'Order Pickup',
    'hero.viewMenu': 'View Menu',
    'hero.scroll': 'Scroll',
    'hero.tagline2': 'Experience Punjab on Every Plate',
    'hero.craftedLive': 'Crafted before your eyes',

    'exp.eyebrow': 'Our Philosophy',
    'exp.h1': 'Every dish',
    'exp.h2': 'begins with',
    'exp.h3': 'fire & patience.',
    'exp.body': 'Long before a plate reaches your table, it is shaped by heat, time and the memory of home. This is slow food — the way Punjab intended it.',
    'exp.p1.title': 'The Living Tandoor',
    'exp.p1.body': 'Naan, kebabs and tikka seared at 480°C in a clay oven fired from dawn — smoke, char and warmth in every bite.',
    'exp.p2.title': 'Spices, Hand Ground',
    'exp.p2.body': 'Whole cumin, coriander and cardamom roasted and ground in-house each morning. Nothing from a jar, ever.',
    'exp.p3.title': 'Punjabi Hospitality',
    'exp.p3.body': 'We cook the way our grandmothers did — generously, patiently, and for people we treat as family.',

    'story.eyebrow': 'Our Story',
    'story.h1': 'From the fields of',
    'story.h2': 'Punjab, to your table.',
    'story.body1': 'Punjabi Cuisine began as a single recipe book carried across an ocean. Three generations later, we still cook with the same copper pots, the same hand-ground masalas, and the same belief: that a meal is an act of love.',
    'story.body2': 'Our chefs train for years before they are trusted with the tandoor. Our curries simmer for hours, never minutes. This is slow food, the way Punjab intended.',
    'story.badge': 'years of family recipes, carried from Amritsar',

    'sig.eyebrow': 'Signatures',
    'sig.h1': "The dishes we’re",
    'sig.h2': 'known for',
    'sig.viewAll': 'View the full menu',

    'manifesto.eyebrow': 'Our belief',
    'manifesto.l1': 'We never rush a curry.',
    'manifesto.l2': 'We let it remember',
    'manifesto.l3': 'where it came from.',
    'manifesto.body': 'Some sauces simmer for six hours. Some breads see the fire for ninety seconds. Each is timed not by a clock, but by memory — the way it was made in a Punjab kitchen, three generations ago.',

    'stats.eyebrow': 'In numbers',
    'stats.years': 'Years',
    'stats.years.note': 'of family recipes carried from Amritsar',
    'stats.tandoor': 'The tandoor',
    'stats.tandoor.note': 'fired from dawn, never resting',
    'stats.dishes': 'Dishes',
    'stats.dishes.note': 'spices ground fresh every morning',
    'stats.rating': 'Guest rating',
    'stats.rating.note': 'across 328 reviews and counting',

    'gallery.eyebrow': 'The table, set',
    'gallery.h1': 'A feast for',
    'gallery.h1accent': 'every sense',
    'gallery.h2': '& excellence in every plate',

    'menu.eyebrow': 'The Menu',
    'menu.h1': 'Browse the kitchen,',
    'menu.h1accent': 'add to your order',
    'menu.sub': 'Every dish is prepared to order. Build your pickup basket and choose a time — pay in-restaurant when you collect.',
    'menu.all': 'All',
    'menu.search': 'Search dishes…',
    'menu.empty': 'No dishes match',
    'menu.quickAdd': 'Quick add',
    'menu.added': 'Added',
    'menu.veg': 'Veg',
    'menu.signature': 'Signature',

    // Menu hub / category / dish pages
    'menu.home': 'Home',
    'menu.breadcrumbMenu': 'Menu',
    'menu.hub.eyebrow': 'The Full Menu',
    'menu.hub.title': 'Every dish,',
    'menu.hub.titleAccent': 'category by category',
    'menu.hub.sub': 'Explore our full kitchen — tandoor classics, slow-cooked curries, street food and more. Tap any category to browse and build your pickup order.',
    'menu.browse': 'Browse by category',
    'menu.dishesWord': 'dishes',
    'menu.explore': 'Explore',
    'menu.viewFull': 'View full menu',
    'menu.allCategories': 'All categories',
    'menu.related': 'You might also like',
    'menu.addToOrder': 'Add to order',
    'menu.qty': 'Quantity',
    'menu.startOrder': 'Start your pickup order',
    'menu.aboutDish': 'About this dish',
    'menu.cat.chicken.desc': 'Butter chicken, tikka masala and slow-cooked Punjabi curries.',
    'menu.cat.lamb.desc': 'Tender lamb and bone-in goat, braised in robust home-style gravies.',
    'menu.cat.beef.desc': 'Slow-cooked beef curries, from mild korma to fiery vindaloo.',
    'menu.cat.seafood.desc': 'Shrimp and fish simmered in coriander-rich coastal curries.',
    'menu.cat.vegetarian.desc': 'Paneer, dal and garden vegetables cooked the Punjabi way.',
    'menu.cat.tandoori.desc': 'Kebabs, tikka and whole birds seared in the clay oven.',
    'menu.cat.biryani.desc': 'Fragrant saffron basmati layered and slow-dum-cooked.',
    'menu.cat.chinese.desc': 'Indo-Chinese favourites — chilli, Manchurian and fried rice.',
    'menu.cat.appetizers.desc': 'Crisp golden pakoras, samosas and chaats to start.',
    'menu.cat.street-food.desc': 'Rolls, puri and chaat — the food of Punjab’s streets.',
    'menu.cat.soups.desc': 'Warming, spiced soups to open the meal.',
    'menu.cat.thali.desc': 'Complete platters with curry, rice, naan and sides.',
    'menu.cat.breads.desc': 'Naan, kulcha and paratha fresh from the tandoor.',
    'menu.cat.desserts.desc': 'Gulab jamun, rasmalai, kheer and more sweet finishes.',
    'menu.cat.drinks.desc': 'Lassis, mango shakes, rose milk and masala chai.',
    'menu.cat.extras.desc': 'Raita, salad, chutneys and sides to round it out.',
    'menu.cat.combos.desc': 'Curated combos and family feasts, ready to share.',
    'menu.cat.pizza.desc': 'Hand-tossed pizzas, poutine, wings and creamy pasta.',

    'reviews.eyebrow': 'Kind Words',
    'reviews.h1': 'Loved by Montréal,',
    'reviews.h1accent': '328 reviews strong',
    'reviews.avg': '4.9 / 5 average',
    'reviews.q1': 'The butter chicken is the best I have had outside of Amritsar. The room glows, the service is warm — this is a special-occasion place that somehow feels like home.',
    'reviews.q2': 'Every detail is considered, from the tandoor smoke to the saffron lassi. You can taste that the spices are ground fresh. Easily the finest Punjabi food in Montréal.',
    'reviews.q3': 'We came for a birthday and left planning our next three visits. The goat curry fell apart at the touch of a fork. Impeccable.',

    'visit.eyebrow': 'Visit Us',
    'visit.h1': 'An evening in',
    'visit.h2': 'Punjab awaits.',
    'visit.body': "Reserve a table for the full experience, or order pickup and bring Punjab home. We can’t wait to host you.",
    'visit.directions': 'Get directions',
    'visit.call': 'Call to Reserve',
    'visit.order': 'Order Pickup',
    'visit.map': 'View on map',

    'footer.eyebrow': "Let’s eat together",
    'footer.reserve1': 'Reserve',
    'footer.reserve2': 'your table',
    'footer.call': 'Call',
    'footer.order': 'Order Pickup',
    'footer.blurb': 'Authentic Punjabi cuisine, crafted with passion in the heart of Montréal.',
    'footer.explore': 'Explore',
    'footer.visit': 'Visit',
    'footer.crafted': 'Crafted in Montréal',

    'order.back': 'Back',
    'order.eyebrow': 'Pickup Order',
    'order.title': 'Your basket',
    'order.empty.title': 'Your basket is empty',
    'order.empty.body': 'Browse the menu and add a few dishes — your pickup basket will appear here.',
    'order.empty.cta': 'Explore the menu',
    'order.notePlaceholder': 'Add a note (e.g. extra spicy, no onion)…',
    'order.details': 'Pickup details',
    'order.name': 'Name',
    'order.phone': 'Phone',
    'order.email': 'Email',
    'order.pickupTime': 'Pickup time',
    'order.chooseTime': 'Choose a time',
    'order.soonest': 'soonest',
    'order.subtotal': 'Subtotal',
    'order.taxes': 'GST + QST (14.975%)',
    'order.total': 'Total',
    'order.place': 'Place pickup order',
    'order.noPay': 'No payment online — pay in-restaurant at pickup.',
    'order.confirmTitle': 'Order received',
    'order.confirmBody': "Thank you. We’ve sent your order to the kitchen.",
    'order.number': 'Order number',
    'order.pickupAt': 'Pickup at',
    'order.confirmNote': 'Live order tracking is coming soon. For now, show your order number at the counter and pay when you collect.',
    'order.home': 'Back to home',
    'order.marketing': 'Email me occasional offers & news from Punjabi Cuisine',
    'order.phoneInvalid': 'Enter a valid 10-digit phone number so we can confirm your order.',

    'account.pageTitle': 'Account',
    'account.title': 'Your account',
    'account.signedInAs': 'Signed in as',
    'account.member': 'Member',
    'account.guest': 'Guest',
    'account.logout': 'Log out',
    'account.haveAccount': 'Have an account? Sign in',
    'account.saveCta': 'Create an account for faster checkout next time',
    'account.orGuest': 'No account needed — you can check out as a guest.',
    'account.email': 'Email',
    'account.password': 'Password',
    'account.passwordHint': 'At least 6 characters',
    'account.name': 'Name',
    'account.phone': 'Phone',
    'account.login': 'Sign in',
    'account.signup': 'Create account',
    'account.toSignup': 'New here? Create an account',
    'account.toLogin': 'Already have an account? Sign in',
    'account.close': 'Close',
    'account.welcome': 'Welcome back',
    'account.err.bad_credentials': 'Wrong email or password.',
    'account.err.email_taken': 'An account with this email already exists — try signing in.',
    'account.err.weak_password': 'Password must be at least 6 characters.',
    'account.err.invalid_email': 'Please enter a valid email address.',
    'account.err.invalid_phone': 'Please enter a valid 10-digit phone number.',
    'account.err.missing_fields': 'Please fill in every field.',
    'account.err.generic': 'Something went wrong. Please try again.',
    'account.orders.title': 'Your orders',
    'account.orders.loading': 'Loading your orders…',
    'account.orders.empty': 'No orders yet — your pickup orders will show up here.',

    'loader.tagline': 'Montréal · Authentic Punjab',

    'nav.catering': 'Reception & Catering',

    'catering.meta.title': 'Reception Hall & Catering | Punjabi Cuisine Dollard-des-Ormeaux',
    'catering.meta.desc': 'Book Punjabi Cuisine for reception hall services and authentic Indian/Punjabi catering in Dollard-des-Ormeaux, Montreal, and the West Island. Perfect for family events, parties, office lunches, and celebrations.',
    'catering.eyebrow': 'Reception Hall & Catering',
    'catering.hero.h1': 'Celebrate Your Special',
    'catering.hero.h1accent': 'Moments',
    'catering.hero.h1end': 'with Authentic Punjabi Flavours',
    'catering.hero.sub': 'From family gatherings to corporate events, Punjabi Cuisine offers delicious catering and a welcoming reception hall experience in Dollard-des-Ormeaux.',
    'catering.hero.cta1': 'Call Now',
    'catering.hero.cta2': 'Request a Quote',

    'catering.hall.eyebrow': 'Reception Hall',
    'catering.hall.h': 'Host Your Private Event',
    'catering.hall.body': 'Host your private events in a warm and welcoming space, perfect for birthdays, family celebrations, small parties, community gatherings, business dinners, and special occasions. Our team can help create a comfortable dining experience with authentic Punjabi dishes and friendly service.',
    'catering.hall.cta': 'Call to Reserve the Hall',

    'catering.service.eyebrow': 'Catering Service',
    'catering.service.h': 'We Come to You',
    'catering.service.body': 'Bring the taste of Punjabi Cuisine to your event with fresh, flavourful catering options. We offer authentic Indian and Punjabi dishes prepared with care for small and large groups.',
    'catering.service.cta': 'Request Catering Quote',

    'catering.form.eyebrow': 'Get in Touch',
    'catering.form.h': 'Request a Hall or Catering Quote',
    'catering.form.name': 'Full Name',
    'catering.form.phone': 'Phone Number',
    'catering.form.email': 'Email Address',
    'catering.form.eventType': 'Event Type',
    'catering.form.eventType.ph': 'e.g. Birthday, Wedding, Corporate dinner…',
    'catering.form.date': 'Event Date',
    'catering.form.guests': 'Number of Guests',
    'catering.form.service': 'Service Needed',
    'catering.form.message': 'Message or Special Requests',
    'catering.form.message.ph': 'Tell us about your event, dietary needs, or any special requests…',
    'catering.form.submit': 'Send Request',
    'catering.form.note': "We'll get back to you within 24 hours.",
    'catering.form.sent': "Request sent — we'll be in touch soon!",

    'catering.cta.eyebrow': 'Planning an event?',
    'catering.cta.h': 'Let Punjabi Cuisine take care of the food.',
    'catering.cta.call': 'Call Now',
    'catering.cta.quote': 'Request a Quote',
  },

  fr: {
    'nav.experience': "L’expérience",
    'nav.menu': 'Menu',
    'nav.story': 'Histoire',
    'nav.visit': 'Nous trouver',
    'nav.order': 'Commander',

    'hero.eyebrow': 'Depuis Amritsar · Dressé à Montréal',
    'hero.coords': '45,51° N — 73,57° O',
    'hero.dinner': 'Souper dès 17 h',
    'hero.l1': 'Authentique',
    'hero.l2': 'Cuisine',
    'hero.l3': 'Punjabi',
    'hero.sub': 'Cuit au tandoor, mijoté lentement, façonné avec passion.',
    'hero.reserve': 'Réserver une table',
    'hero.order': 'Commander',
    'hero.viewMenu': 'Voir le menu',
    'hero.scroll': 'Défiler',
    'hero.tagline2': 'Vivez le Punjab à chaque assiette',
    'hero.craftedLive': 'Préparé sous vos yeux',

    'exp.eyebrow': 'Notre philosophie',
    'exp.h1': 'Chaque plat',
    'exp.h2': 'commence par',
    'exp.h3': 'le feu et la patience.',
    'exp.body': "Bien avant d’arriver à votre table, un plat est façonné par la chaleur, le temps et le souvenir du foyer. C’est de la cuisine lente — comme le Punjab l’a voulue.",
    'exp.p1.title': 'Le tandoor vivant',
    'exp.p1.body': "Naan, kebabs et tikka saisis à 480 °C dans un four d’argile allumé dès l’aube — fumée, braise et chaleur à chaque bouchée.",
    'exp.p2.title': 'Épices moulues à la main',
    'exp.p2.body': 'Cumin, coriandre et cardamome entiers, rôtis et moulus sur place chaque matin. Jamais rien en pot.',
    'exp.p3.title': "L’hospitalité punjabi",
    'exp.p3.body': 'Nous cuisinons comme nos grands-mères — généreusement, patiemment, pour des gens que nous traitons comme la famille.',

    'story.eyebrow': 'Notre histoire',
    'story.h1': 'Des champs du',
    'story.h2': 'Punjab, à votre table.',
    'story.body1': "Punjabi Cuisine a commencé avec un seul cahier de recettes traversant un océan. Trois générations plus tard, nous cuisinons toujours avec les mêmes chaudrons de cuivre, les mêmes masalas moulus à la main, et la même conviction : qu’un repas est un acte d’amour.",
    'story.body2': "Nos chefs se forment des années avant qu’on leur confie le tandoor. Nos caris mijotent des heures, jamais des minutes. C’est de la cuisine lente, comme le Punjab l’a voulue.",
    'story.badge': "ans de recettes familiales, venues d’Amritsar",

    'sig.eyebrow': 'Nos signatures',
    'sig.h1': 'Les plats qui',
    'sig.h2': 'nous distinguent',
    'sig.viewAll': 'Voir le menu complet',

    'manifesto.eyebrow': 'Notre conviction',
    'manifesto.l1': 'On ne presse jamais un cari.',
    'manifesto.l2': 'On le laisse se souvenir',
    'manifesto.l3': "d’où il vient.",
    'manifesto.body': "Certaines sauces mijotent six heures. Certains pains ne voient le feu que quatre-vingt-dix secondes. Chacun est minuté non par l’horloge, mais par la mémoire — comme on le faisait dans une cuisine du Punjab, il y a trois générations.",

    'stats.eyebrow': 'En chiffres',
    'stats.years': 'Ans',
    'stats.years.note': "de recettes familiales venues d’Amritsar",
    'stats.tandoor': 'Le tandoor',
    'stats.tandoor.note': "allumé dès l’aube, sans repos",
    'stats.dishes': 'Plats',
    'stats.dishes.note': 'épices moulues fraîches chaque matin',
    'stats.rating': 'Note des clients',
    'stats.rating.note': 'sur 328 avis et plus',

    'gallery.eyebrow': 'La table, dressée',
    'gallery.h1': 'Un festin pour',
    'gallery.h1accent': 'tous les sens',
    'gallery.h2': "et l’excellence dans chaque assiette",

    'menu.eyebrow': 'Le menu',
    'menu.h1': 'Explorez la cuisine,',
    'menu.h1accent': 'ajoutez à votre commande',
    'menu.sub': 'Chaque plat est préparé à la commande. Composez votre panier pour emporter et choisissez une heure — payez au restaurant à la cueillette.',
    'menu.all': 'Tout',
    'menu.search': 'Rechercher un plat…',
    'menu.empty': 'Aucun plat ne correspond à',
    'menu.quickAdd': 'Ajout rapide',
    'menu.added': 'Ajouté',
    'menu.veg': 'Végé',
    'menu.signature': 'Signature',

    // Pages menu (accueil / catégorie / plat)
    'menu.home': 'Accueil',
    'menu.breadcrumbMenu': 'Menu',
    'menu.hub.eyebrow': 'Le menu complet',
    'menu.hub.title': 'Chaque plat,',
    'menu.hub.titleAccent': 'catégorie par catégorie',
    'menu.hub.sub': 'Explorez toute notre cuisine — classiques du tandoor, caris mijotés, cuisine de rue et plus. Touchez une catégorie pour parcourir et composer votre commande.',
    'menu.browse': 'Parcourir par catégorie',
    'menu.dishesWord': 'plats',
    'menu.explore': 'Explorer',
    'menu.viewFull': 'Voir le menu complet',
    'menu.allCategories': 'Toutes les catégories',
    'menu.related': 'Vous aimerez aussi',
    'menu.addToOrder': 'Ajouter à la commande',
    'menu.qty': 'Quantité',
    'menu.startOrder': 'Commencer votre commande',
    'menu.aboutDish': 'À propos de ce plat',
    'menu.cat.chicken.desc': 'Poulet au beurre, tikka masala et caris punjabi mijotés.',
    'menu.cat.lamb.desc': 'Agneau tendre et chèvre avec os, mijotés à la maison.',
    'menu.cat.beef.desc': 'Caris de bœuf mijotés, du korma doux au vindaloo relevé.',
    'menu.cat.seafood.desc': 'Crevettes et poisson dans des caris côtiers parfumés.',
    'menu.cat.vegetarian.desc': 'Paneer, dal et légumes du jardin cuisinés à la punjabi.',
    'menu.cat.tandoori.desc': 'Kebabs, tikka et volailles saisis au four d’argile.',
    'menu.cat.biryani.desc': 'Basmati safrané parfumé, cuit lentement en dum.',
    'menu.cat.chinese.desc': 'Favoris indo-chinois — chili, Manchurian et riz frit.',
    'menu.cat.appetizers.desc': 'Pakoras dorés, samosas et chaats pour commencer.',
    'menu.cat.street-food.desc': 'Rouleaux, puri et chaat — la cuisine de rue du Punjab.',
    'menu.cat.soups.desc': 'Soupes épicées et réconfortantes pour ouvrir le repas.',
    'menu.cat.thali.desc': 'Assiettes complètes : cari, riz, naan et accompagnements.',
    'menu.cat.breads.desc': 'Naan, kulcha et paratha frais du tandoor.',
    'menu.cat.desserts.desc': 'Gulab jamun, rasmalai, kheer et autres douceurs.',
    'menu.cat.drinks.desc': 'Lassis, laits frappés à la mangue, lait rose et chai masala.',
    'menu.cat.extras.desc': 'Raita, salade, chutneys et accompagnements.',
    'menu.cat.combos.desc': 'Combos et festins familiaux, prêts à partager.',
    'menu.cat.pizza.desc': 'Pizzas maison, poutine, ailes de poulet et pâtes crémeuses.',

    'reviews.eyebrow': 'Vos mots',
    'reviews.h1': 'Aimé de Montréal,',
    'reviews.h1accent': 'fort de 328 avis',
    'reviews.avg': '4,9 / 5 en moyenne',
    'reviews.q1': "Le poulet au beurre est le meilleur que j’ai mangé hors d’Amritsar. La salle rayonne, le service est chaleureux — un endroit pour les grandes occasions qui a pourtant des airs de maison.",
    'reviews.q2': 'Chaque détail est pensé, de la fumée du tandoor au lassi au safran. On goûte que les épices sont moulues fraîches. Sans contredit la meilleure cuisine punjabi de Montréal.',
    'reviews.q3': 'Venus pour un anniversaire, nous sommes repartis en planifiant nos trois prochaines visites. Le cari de chèvre se défaisait à la fourchette. Impeccable.',

    'visit.eyebrow': 'Nous trouver',
    'visit.h1': 'Une soirée au',
    'visit.h2': 'Punjab vous attend.',
    'visit.body': "Réservez une table pour l’expérience complète, ou commandez pour emporter et ramenez le Punjab à la maison. Au plaisir de vous recevoir.",
    'visit.directions': "Obtenir l’itinéraire",
    'visit.call': 'Appeler pour réserver',
    'visit.order': 'Commander',
    'visit.map': 'Voir sur la carte',

    'footer.eyebrow': 'Mangeons ensemble',
    'footer.reserve1': 'Réservez',
    'footer.reserve2': 'votre table',
    'footer.call': 'Appeler',
    'footer.order': 'Commander',
    'footer.blurb': 'Cuisine punjabi authentique, façonnée avec passion au cœur de Montréal.',
    'footer.explore': 'Explorer',
    'footer.visit': 'Nous trouver',
    'footer.crafted': 'Fait à Montréal',

    'order.back': 'Retour',
    'order.eyebrow': 'Commande pour emporter',
    'order.title': 'Votre panier',
    'order.empty.title': 'Votre panier est vide',
    'order.empty.body': 'Parcourez le menu et ajoutez quelques plats — votre panier apparaîtra ici.',
    'order.empty.cta': 'Explorer le menu',
    'order.notePlaceholder': 'Ajouter une note (ex. : très épicé, sans oignon)…',
    'order.details': 'Détails de la cueillette',
    'order.name': 'Nom',
    'order.phone': 'Téléphone',
    'order.email': 'Courriel',
    'order.pickupTime': 'Heure de cueillette',
    'order.chooseTime': 'Choisir une heure',
    'order.soonest': 'au plus tôt',
    'order.subtotal': 'Sous-total',
    'order.taxes': 'TPS + TVQ (14,975 %)',
    'order.total': 'Total',
    'order.place': 'Passer la commande',
    'order.noPay': 'Aucun paiement en ligne — payez au restaurant à la cueillette.',
    'order.confirmTitle': 'Commande reçue',
    'order.confirmBody': 'Merci. Nous avons transmis votre commande à la cuisine.',
    'order.number': 'Numéro de commande',
    'order.pickupAt': 'Cueillette à',
    'order.confirmNote': "Le suivi en temps réel arrive bientôt. Pour l’instant, présentez votre numéro de commande au comptoir et payez à la cueillette.",
    'order.home': "Retour à l’accueil",
    'order.marketing': 'Envoyez-moi à l’occasion offres et nouvelles de Punjabi Cuisine',
    'order.phoneInvalid': 'Entrez un numéro de téléphone valide à 10 chiffres pour confirmer votre commande.',

    'account.pageTitle': 'Compte',
    'account.title': 'Votre compte',
    'account.signedInAs': 'Connecté en tant que',
    'account.member': 'Membre',
    'account.guest': 'Invité',
    'account.logout': 'Déconnexion',
    'account.haveAccount': 'Vous avez un compte ? Connectez-vous',
    'account.saveCta': 'Créez un compte pour une commande plus rapide la prochaine fois',
    'account.orGuest': 'Aucun compte requis — vous pouvez commander en tant qu’invité.',
    'account.email': 'Courriel',
    'account.password': 'Mot de passe',
    'account.passwordHint': 'Au moins 6 caractères',
    'account.name': 'Nom',
    'account.phone': 'Téléphone',
    'account.login': 'Se connecter',
    'account.signup': 'Créer un compte',
    'account.toSignup': 'Nouveau ? Créez un compte',
    'account.toLogin': 'Vous avez déjà un compte ? Connectez-vous',
    'account.close': 'Fermer',
    'account.welcome': 'Bon retour',
    'account.err.bad_credentials': 'Courriel ou mot de passe incorrect.',
    'account.err.email_taken': 'Un compte existe déjà avec ce courriel — essayez de vous connecter.',
    'account.err.weak_password': 'Le mot de passe doit contenir au moins 6 caractères.',
    'account.err.invalid_email': 'Veuillez entrer une adresse courriel valide.',
    'account.err.invalid_phone': 'Veuillez entrer un numéro de téléphone valide à 10 chiffres.',
    'account.err.missing_fields': 'Veuillez remplir tous les champs.',
    'account.err.generic': 'Une erreur est survenue. Veuillez réessayer.',
    'account.orders.title': 'Vos commandes',
    'account.orders.loading': 'Chargement de vos commandes…',
    'account.orders.empty': 'Aucune commande pour l’instant — vos commandes apparaîtront ici.',

    'loader.tagline': 'Montréal · Punjab authentique',

    'nav.catering': 'Salle & Traiteur',

    'catering.meta.title': 'Salle de réception & traiteur | Punjabi Cuisine Dollard-des-Ormeaux',
    'catering.meta.desc': 'Réservez Punjabi Cuisine pour votre salle de réception ou service traiteur authentique à Dollard-des-Ormeaux, Montréal et West Island. Idéal pour événements familiaux, fêtes, dîners corporatifs et célébrations.',
    'catering.eyebrow': 'Salle de réception & traiteur',
    'catering.hero.h1': 'Célébrez vos moments',
    'catering.hero.h1accent': 'inoubliables',
    'catering.hero.h1end': 'avec les saveurs punjabi',
    'catering.hero.sub': "Des réunions familiales aux événements d'entreprise, Punjabi Cuisine offre un service traiteur savoureux et une salle de réception accueillante à Dollard-des-Ormeaux.",
    'catering.hero.cta1': 'Appeler maintenant',
    'catering.hero.cta2': 'Demander un devis',

    'catering.hall.eyebrow': 'Salle de réception',
    'catering.hall.h': 'Votre événement privé',
    'catering.hall.body': "Accueillez vos événements privés dans un espace chaleureux et convivial, idéal pour les anniversaires, les célébrations familiales, les petites fêtes, les rassemblements communautaires, les dîners d'affaires et les occasions spéciales. Notre équipe peut vous aider à créer une expérience gastronomique authentique avec des plats punjabi et un service attentionné.",
    'catering.hall.cta': 'Appeler pour réserver la salle',

    'catering.service.eyebrow': 'Service traiteur',
    'catering.service.h': 'Nous venons à vous',
    'catering.service.body': 'Apportez le goût de Punjabi Cuisine à votre événement avec des options de traiteur fraîches et savoureuses. Nous proposons des plats indiens et punjabi authentiques préparés avec soin pour les petits et grands groupes.',
    'catering.service.cta': 'Demander un devis traiteur',

    'catering.form.eyebrow': 'Contactez-nous',
    'catering.form.h': 'Demandez un devis — salle ou traiteur',
    'catering.form.name': 'Nom complet',
    'catering.form.phone': 'Numéro de téléphone',
    'catering.form.email': 'Adresse courriel',
    'catering.form.eventType': "Type d'événement",
    'catering.form.eventType.ph': 'Ex. : anniversaire, mariage, dîner corporatif…',
    'catering.form.date': "Date de l'événement",
    'catering.form.guests': "Nombre d'invités",
    'catering.form.service': 'Service souhaité',
    'catering.form.message': 'Message ou demandes spéciales',
    'catering.form.message.ph': 'Parlez-nous de votre événement, restrictions alimentaires ou besoins particuliers…',
    'catering.form.submit': 'Envoyer la demande',
    'catering.form.note': 'Nous vous répondrons dans les 24 heures.',
    'catering.form.sent': 'Demande envoyée — nous vous contacterons bientôt !',

    'catering.cta.eyebrow': 'Vous planifiez un événement ?',
    'catering.cta.h': "Laissez Punjabi Cuisine s'occuper de la nourriture.",
    'catering.cta.call': 'Appeler maintenant',
    'catering.cta.quote': 'Demander un devis',
  },
};

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nValue>({
  lang: 'en',
  setLang: () => {},
  toggle: () => {},
  t: (k) => k,
});

export const useI18n = () => useContext(I18nContext);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  // Restore saved choice on mount.
  useEffect(() => {
    const saved = (localStorage.getItem('pc-lang') as Lang) || null;
    const initial = saved ?? (navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en');
    setLangState(initial);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('pc-lang', l); } catch {}
  }, []);

  const toggle = useCallback(() => setLang(lang === 'en' ? 'fr' : 'en'), [lang, setLang]);

  const t = useCallback(
    (key: string) => DICT[lang][key] ?? DICT.en[key] ?? key,
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </I18nContext.Provider>
  );
}

/** Localize a menu item's name/description for the active language. */
export function localizeItem(item: MenuItem, lang: Lang): { name: string; description: string } {
  if (lang === 'fr') {
    const fr = MENU_FR[item.id];
    if (fr) return fr;
  }
  return { name: item.name, description: item.description };
}

/** Localize a category label. */
export function categoryLabel(id: import('./menu').Category, enLabel: string, lang: Lang): string {
  return lang === 'fr' ? CATEGORY_LABELS_FR[id] ?? enLabel : enLabel;
}
