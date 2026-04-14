export interface Listing {
  id: number;
  slug: string;
  name: string;
  cat: string;
  catLabel: string;
  region?: string;
  icon: string;
  stars: number;
  price: string;
  badge: string | null;
  desc: string;
  tagline?: string;
  about?: string;
  image?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
  galleryImages?: string[];
  address?: string;
  phone?: string;
  hours?: string;
  cuisine?: string[];
  instagram?: string;
  facebook?: string;
  website?: string;
  tiktok?: string;
  twitterX?: string;
  happyHourDays?: string;
  happyHourDetails?: string;
  highlights?: string[];
  isFeatured?: boolean;
  isSponsored?: boolean;
  googleMapsLink?: string;
  startDatetime?: string;
  admissionType?: string;
  venueType?: string[];
  musicGenres?: string[];
  locatedInListingId?: string;
  logoUrl?: string;
  googlePlaceId?: string;
  googleMapsUrl?: string;
  googleRating?: number;
  googleUserRatingsTotal?: number;
  googleLastSyncedAt?: string;
  orderOnlineUrl?: string;
  reservationUrl?: string;
  affiliateCtaLabel?: string;
  affiliateCtaUrl?: string;
  affiliateProvider?: string;
  affiliateLastUpdated?: string;
  highlight?: string;
  propertyType?: string;
  recomendadoBullets?: string[];
  recomendacionResumen?: string;
  amenities?: string[];
  videoUrl?: string;
  dressCode?: string;
  bestTime?: string;
  popularDishes?: { emoji: string; name: string; description?: string }[];
  trendingTag?: string | null;
  createdAt?: string;
  duration?: string;
  idealFor?: string[];
  experienceType?: string[];
  showExperienceType?: string[];
  experienceLocation?: string;
  foodAvailable?: string;
  bestVisitTime?: string;
  priceFrom?: string;
  priceMin?: number;
  priceMax?: number;
  minimumAge?: string;
  showType?: string;
  usefulInfo?: { icon?: string; text: string }[];
}

export const DEFAULT_LISTINGS: Listing[] = [
  { id:1, slug:'venetian', name:'The Venetian Las Vegas', cat:'hoteles', catLabel:'Hoteles & Casinos', region:'The Strip', icon:'🏛️', stars:5, price:'$$$', badge:'Top Rated', desc:'El hotel más elegante del Strip reimagina la belleza de Venecia con suites de más de 720 pies cuadrados, canales interiores y góndolas reales.', address:'3355 S Las Vegas Blvd', phone:'(702) 414-1000', hours:'Abierto 24 horas', highlights:['Suites de 720 sq ft','Casino de clase mundial','Más de 30 restaurantes','Spa The Canyon Ranch'], about:'The Venetian es uno de los hoteles más icónicos del Strip de Las Vegas. Inspirado en la arquitectura veneciana con canales interiores y góndolas, ofrece suites de lujo que empiezan en 720 pies cuadrados — todas con sala de estar separada.' },
  { id:2, slug:'mandalay-bay', name:'Mandalay Bay', cat:'hoteles', catLabel:'Hoteles & Casinos', region:'The Strip', icon:'🌴', stars:5, price:'$$$', badge:null, desc:'El resort tropical del Strip con la playa de arena más famosa de Las Vegas. Once acres de piscinas, olas artificiales y arena real.', address:'3950 S Las Vegas Blvd', phone:'(702) 632-7777', hours:'Abierto 24 horas', highlights:['Playa privada de arena','Aqua Pool con olas','House of Blues','Michelob Ultra Arena'], about:'Mandalay Bay ofrece una experiencia única con su famosa playa de arena de once acres y piscina con olas artificiales.' },
  { id:3, slug:'mgm-grand', name:'MGM Grand', cat:'hoteles', catLabel:'Hoteles & Casinos', region:'The Strip', icon:'🦁', stars:5, price:'$$$', badge:null, desc:'Uno de los hoteles más grandes del mundo con todo lo que Las Vegas puede ofrecer bajo un mismo techo.', address:'3799 S Las Vegas Blvd', phone:'(702) 891-1111', hours:'Abierto 24 horas', highlights:['Grand Garden Arena','Spa & Health Club','Pool complex de 6.5 acres','Joel Robuchon restaurant'], about:'MGM Grand es uno de los hoteles más grandes del mundo, con un casino enorme y más de 5,000 habitaciones.' },
  { id:4, slug:'south-point', name:'South Point Hotel & Spa', cat:'hoteles', catLabel:'Hoteles & Casinos', region:'South Las Vegas', icon:'🎰', stars:4, price:'$$', badge:null, desc:'El favorito auténtico de los residentes locales, alejado del caos del Strip. Precios accesibles, bowling de 64 pistas.', address:'9777 Las Vegas Blvd S', phone:'(702) 796-7111', hours:'Abierto 24 horas', highlights:['Bowling center 64 pistas','Arena equestre','Spa completo','Cine 16 pantallas'], about:'South Point es el favorito genuino de la comunidad local de Las Vegas.' },
  { id:5, slug:'primal-steakhouse', name:'Primal Steakhouse', cat:'restaurantes', catLabel:'Steakhouse', region:'East Las Vegas', icon:'🥩', stars:5, price:'$$$$', badge:'Destacado', cuisine:['Steakhouse'], instagram:'https://instagram.com/primalsteakhouselv', facebook:'https://facebook.com/primalsteakhouselv', website:'https://primalsteakhouse.com', happyHourDays:'Lunes a Jueves · Toda la noche', happyHourDetails:'• $8 tragos de la casa\n• $10 cocteles de la casa\n• $5 cervezas de barril (16 oz)', desc:'El steakhouse más espectacular de Las Vegas fuera del Strip, donde cada corte USDA Prime se convierte en un evento.', address:'3568 S Maryland Pkwy, Las Vegas, NV 89169', phone:'(702) 262-4900', hours:'Dom–Jue 5pm–10pm, Vie–Sáb 5pm–11pm', highlights:['Cortes USDA Prime','Ambiente espectacular','Selección de vinos','Chef de renombre'], about:'Primal Steakhouse & Supper Club es el steakhouse más único de Las Vegas fuera del Strip.' },
  { id:6, slug:'havana-grill', name:'Havana Grill', cat:'restaurantes', catLabel:'Cocina Cubana', region:'West Las Vegas', icon:'🇨🇺', stars:5, price:'$$', badge:null, desc:'La cocina cubana más auténtica de Las Vegas con recetas familiares que saben a La Habana.', address:'3900 W Flamingo Rd', phone:'(702) 364-0990', hours:'Lun–Dom 11am–10pm', highlights:['Ropa vieja auténtica','Mojitos artesanales','Música en vivo fines de semana','Ambiente familiar'], about:'Havana Grill lleva la auténtica cocina cubana al corazón del oeste de Las Vegas.' },
  { id:7, slug:'el-ausente', name:'El Ausente', cat:'restaurantes', catLabel:'Mariscos', region:'West Las Vegas', icon:'🌊', stars:4, price:'$$', badge:null, desc:'Los mariscos sinaloenses más frescos y auténticos de Las Vegas, preparados como en la costa de México.', address:'5765 W Spring Mountain Rd', phone:'(702) 220-6644', hours:'Lun–Dom 10am–11pm', highlights:['Ceviche de camarón','Micheladas especiales','Caldo de mariscos','Ambiente familiar'], about:'El Ausente es el corazón de la comunidad sinaloense en Las Vegas.' },
  { id:8, slug:'agave-bar', name:'Agave Bar & Grill', cat:'restaurantes', catLabel:'Bar & Cocina', region:'West Las Vegas', icon:'🌵', stars:4, price:'$$', badge:null, desc:'Cocina mexicana fresca y vibrante con terraza exterior junto a la piscina.', address:'3400 S Jones Blvd', phone:'(702) 259-7777', hours:'Lun–Dom 12pm–12am', highlights:['Terraza junto a la piscina','Margaritas artesanales','Tacos de autor','Happy hour diario'], about:'Agave Bar & Grill es el destino perfecto para disfrutar de cocina mexicana fresca en un ambiente relajado.' },
  { id:9, slug:'brasa-roja', name:'Brasa Roja', cat:'restaurantes', catLabel:'Cocina Colombiana', region:'North Las Vegas', icon:'🍗', stars:5, price:'$$', badge:null, desc:'El pollo a la brasa colombiano más auténtico de Las Vegas, marinado con especias secretas.', address:'3101 N Rancho Dr', phone:'(702) 638-0101', hours:'Lun–Dom 11am–10pm', highlights:['Pollo a la brasa auténtico','Arepas caseras','Ají y salsas especiales','Porciones generosas'], about:'Brasa Roja lleva la tradición del pollo asado colombiano a Las Vegas con recetas originales.' },
  { id:10, slug:'cirque-mystere', name:'Cirque du Soleil — Mystère', cat:'shows', catLabel:'Shows & Eventos', region:'The Strip', icon:'🎭', stars:5, price:'$$$', badge:'Must See', desc:'El show más longevo e icónico de Las Vegas lleva más de 25 años dejando sin aliento a cada público.', address:'Treasure Island, 3300 Las Vegas Blvd S', phone:'(702) 894-7722', hours:'Mar–Sáb 7pm y 9:30pm', highlights:['Acrobacias de élite','Producción visual épica','Más de 25 años en escena','Apto para toda la familia'], about:'Mystère es el show más longevo de Las Vegas y uno de los más aclamados del mundo.' },
  { id:11, slug:'absinthe', name:'ABSINTHE', cat:'shows', catLabel:'Shows & Eventos', region:'The Strip', icon:'🎪', stars:5, price:'$$$', badge:null, desc:'El show más irreverente y atrevido de Las Vegas en un teatro circular íntimo dentro de Caesars Palace.', address:'Caesars Palace, 3570 Las Vegas Blvd S', phone:'(800) 745-3000', hours:'Mié–Dom 8pm y 10pm', highlights:['Show para mayores de 18','Acrobacias impresionantes','Comedia irreverente','Teatro circular íntimo'], about:'ABSINTHE es el show más atrevido y auténtico de Las Vegas.' },
  { id:12, slug:'blue-man-group', name:'Blue Man Group', cat:'shows', catLabel:'Shows & Eventos', region:'The Strip', icon:'🥁', stars:4, price:'$$', badge:null, desc:'El show más original y divertido de Las Vegas donde tres hombres azules crean música percusiva.', address:'Luxor Hotel, 3900 Las Vegas Blvd S', phone:'(702) 262-4400', hours:'Lun–Dom 7pm', highlights:['Show familiar','Música percusiva original','Efectos visuales únicos','Interacción con el público'], about:'Blue Man Group es un espectáculo completamente diferente a todo lo que existe en Las Vegas.' },
  { id:13, slug:'omnia', name:'OMNIA Nightclub', cat:'nocturna', catLabel:'Vida Nocturna', region:'The Strip', icon:'💫', stars:5, price:'$$$', badge:'Top Club', desc:'El club más exclusivo y espectacular de Las Vegas dentro de Caesars Palace.', address:'Caesars Palace, 3570 Las Vegas Blvd S', phone:'(702) 785-6200', hours:'Vie–Dom 10:30pm–4am', highlights:['DJs de clase mundial','Chandelier interactivo','Terrace con vista al Strip','VIP tables'], about:'OMNIA en Caesars Palace es consistentemente reconocido como uno de los mejores nightclubs del mundo.' },
  { id:14, slug:'drais', name:"Drai's Beachclub & Nightclub", cat:'nocturna', catLabel:'Vida Nocturna', region:'The Strip', icon:'🏖️', stars:5, price:'$$$', badge:null, desc:'El único club de día y noche en azotea del Strip con piscina real y vistas panorámicas.', address:'The Cromwell, 3595 Las Vegas Blvd S', phone:'(702) 777-3800', hours:'Vier–Dom día y noche', highlights:['Rooftop con piscina','Vistas panorámicas al Strip','Hip-hop y R&B','Afterhours hasta las 6am'], about:"Drai's combina lo mejor del entretenimiento de día y noche en una experiencia rooftop única." },
  { id:15, slug:'jose-cuervo', name:'Jose Cuervo Tequilería', cat:'nocturna', catLabel:'Vida Nocturna', region:'The Strip', icon:'🍹', stars:4, price:'$$', badge:null, desc:'La cantina latina más auténtica del Strip con más de 250 tequilas y mezcales premium.', address:'3200 Las Vegas Blvd S', phone:'(702) 693-8300', hours:'Lun–Dom 6pm–2am', highlights:['250+ tequilas y mezcales','Música en vivo','Margaritas artesanales','Ambiente latino'], about:'La Jose Cuervo Tequilería es el corazón latino del Strip.' },
  { id:16, slug:'chapos', name:"Chapó's Bar & Lounge", cat:'nocturna', catLabel:'Vida Nocturna', region:'West Las Vegas', icon:'🎺', stars:4, price:'$$', badge:null, desc:'El lounge latino más querido de Las Vegas fuera del Strip, donde la banda toca cumbias y norteñas.', address:'4850 W Flamingo Rd', phone:'(702) 876-2100', hours:'Mié–Dom 8pm–3am', highlights:['Bandas en vivo','Cumbias y norteñas','Sin cover miércoles','Cocina mexicana'], about:"Chapó's es el punto de encuentro más auténtico de la comunidad latina en Las Vegas." },
  { id:17, slug:'bellagio', name:'Bellagio Las Vegas', cat:'hoteles', catLabel:'Hoteles & Casinos', region:'The Strip', icon:'⛲', stars:5, price:'$$$$', badge:'Icónico', desc:'El hotel más fotografiado del mundo y símbolo eterno de Las Vegas.', address:'3600 S Las Vegas Blvd', phone:'(702) 693-7111', hours:'Abierto 24 horas', highlights:['Fuentes danzantes gratuitas','Galería de arte','Restaurantes Michelin','Spa de lujo'], about:'El Bellagio es el hotel más icónico de Las Vegas y uno de los más reconocibles del mundo.' },
  { id:18, slug:'wynn', name:'Wynn Las Vegas', cat:'hoteles', catLabel:'Hoteles & Casinos', region:'The Strip', icon:'🌸', stars:5, price:'$$$$', badge:null, desc:'El resort más galardonado de Las Vegas, donde cada detalle ha sido diseñado con obsesiva atención a la calidad.', address:'3131 Las Vegas Blvd S', phone:'(702) 770-7000', hours:'Abierto 24 horas', highlights:['Resort más premiado de Vegas','Casino íntimo y refinado','Piscinas con cabañas','Restaurantes de autor'], about:'Wynn Las Vegas ha ganado más premios Forbes Five-Star que cualquier otro resort en el mundo.' },
  { id:19, slug:'javieres', name:"Javier's", cat:'restaurantes', catLabel:'Cocina Mexicana Premium', region:'The Strip', icon:'🌺', stars:5, price:'$$$', badge:'Destacado', cuisine:['Mexicana de Autor'], desc:'La cocina mexicana más sofisticada y elegante del Strip dentro del ARIA Resort.', address:'ARIA Resort, 3730 Las Vegas Blvd S', phone:'(702) 590-8880', hours:'Dom–Jue 5pm–11pm, Vie–Sáb 5pm–12am', highlights:['Cocina mexicana de autor','Interior diseñado en México','Margaritas premium','Ambiente de celebración'], about:"Javier's en el ARIA es el restaurante mexicano más elegante de Las Vegas." },
  { id:20, slug:'hussongs-cantina', name:"Hussong's Cantina", cat:'restaurantes', catLabel:'Cantina Mexicana', region:'The Strip', icon:'🎸', stars:4, price:'$$', badge:null, cuisine:['Mexicana'], desc:'La cantina mexicana más auténtica del Strip con raíces en la legendaria Hussong\'s de Ensenada.', address:'Mandalay Bay, 3950 Las Vegas Blvd S', phone:'(702) 632-9333', hours:'Lun–Dom 11am–2am', highlights:['Historia de la margarita original','Guacamole en mesa','Ambiente festivo auténtico','Abierto hasta las 2am'], about:"Hussong's Cantina en Mandalay Bay es la extensión de la cantina más famosa de Baja California." },
  { id:21, slug:'lindo-michoacan', name:'Lindo Michoacán', cat:'restaurantes', catLabel:'Cocina Mexicana Tradicional', region:'East Las Vegas', icon:'🌽', stars:5, price:'$$', badge:'Institución', cuisine:['Mexicana Regional'], desc:'La institución mexicana más querida de Las Vegas, abierta desde 1990.', address:'2655 E Desert Inn Rd', phone:'(702) 735-6828', hours:'Lun–Dom 11am–10pm', highlights:['Abierto desde 1990','Mole negro auténtico','Chiles en nogada','Favorito de la comunidad local'], about:'Lindo Michoacán es la institución mexicana más antigua y querida de Las Vegas.' },
  { id:22, slug:'tacos-el-gordo', name:'Tacos El Gordo', cat:'restaurantes', catLabel:'Tacos Tijuana', region:'The Strip', icon:'🌮', stars:5, price:'$', badge:'Favorito Local', cuisine:['Tacos de Tijuana'], desc:'Los tacos de Tijuana más auténticos del mundo, a pasos del Strip.', address:'3049 Las Vegas Blvd S', phone:'(702) 759-6744', hours:'Lun–Dom 10am–4am', highlights:['Trompo de adobada auténtico','Tortillas hechas a mano','Abierto hasta las 4am','Precios de taquería'], about:'Tacos El Gordo es el taco más famoso y auténtico del Strip.' },
  { id:23, slug:'oscar-steakhouse', name:"Oscar's Steakhouse", cat:'restaurantes', catLabel:'Steakhouse', region:'Downtown', icon:'🎩', stars:4, price:'$$$', badge:null, cuisine:['Steakhouse'], desc:'El steakhouse más histórico y con más carácter de Las Vegas, dentro de la cúpula del Plaza Hotel.', address:'Plaza Hotel, 1 Main St', phone:'(702) 386-7227', hours:'Mar–Dom 5pm–10pm', highlights:['Vista panorámica de Fremont','Fundado por el exalcalde','Cúpula del Plaza Hotel','Martinis legendarios'], about:"Oscar's Steakhouse es una de las experiencias gastronómicas más únicas de Las Vegas." },
  { id:24, slug:'grand-canyon-tour', name:'Grand Canyon South Rim Tours', cat:'atracciones', catLabel:'Excursión', region:'Excursión', icon:'🏜️', stars:5, price:'$$$', badge:'Must Do', desc:'La excursión más espectacular desde Las Vegas — el Gran Cañón del Colorado.', address:'Salidas desde el Strip', phone:'Ver opciones', hours:'Salidas diarias 6am–7am', highlights:['Guías en español disponibles','Opción en helicóptero','Skywalk de cristal','Almuerzo incluido en tours premium'], about:'El Gran Cañón del Colorado es la excursión más popular y espectacular desde Las Vegas.' },
  { id:25, slug:'helicopter-tours-vegas', name:'Helicóptero sobre Las Vegas', cat:'atracciones', catLabel:'Tour en Helicóptero', region:'The Strip', icon:'🚁', stars:5, price:'$$$$', badge:null, desc:'La forma más espectacular de ver Las Vegas desde el aire.', address:'Múltiples helipuertos en el Strip', phone:'Ver operadores', hours:'Tours diurnos y nocturnos', highlights:['Strip de noche desde el aire','Tours de 12–15 minutos','Paquetes para parejas','Champán incluido en premium'], about:'Ver Las Vegas desde un helicóptero de noche es una de las experiencias más únicas.' },
  { id:26, slug:'fremont-street', name:'Fremont Street Experience', cat:'atracciones', catLabel:'Experiencia Gratuita', region:'Downtown', icon:'💡', stars:4, price:'$', badge:'Gratis', desc:'El espectáculo de luz y sonido más grande del mundo en el corazón histórico de Las Vegas.', address:'Fremont St, Downtown Las Vegas', phone:'(702) 678-5777', hours:'Espectáculos 6pm–2am', highlights:['Espectáculo de LEDs gratuito','Zipline sobre la multitud','Bandas en vivo','Casinos desde $5'], about:'Fremont Street Experience es el corazón histórico de Las Vegas.' },
  { id:27, slug:'hoover-dam', name:'Presa Hoover Dam', cat:'atracciones', catLabel:'Atracción Histórica', region:'Excursión', icon:'🏗️', stars:4, price:'$$', badge:null, desc:'Una de las obras de ingeniería más impresionantes del siglo XX, a solo 40 minutos de Las Vegas.', address:'A 40 min de Las Vegas', phone:'(702) 494-2517', hours:'8am–4:30pm todos los días', highlights:['A 40 min del Strip','Tours del interior','Vista del Lake Mead','Frontera NV–AZ'], about:'La Presa Hoover es una de las maravillas de la ingeniería moderna.' },
  { id:28, slug:'mob-museum', name:'The Mob Museum', cat:'atracciones', catLabel:'Museo', region:'Downtown', icon:'🕵️', stars:4, price:'$$', badge:null, desc:'El museo más entretenido y único de Las Vegas, dedicado a la historia de la mafia americana.', address:'300 Stewart Ave, Downtown', phone:'(702) 229-2734', hours:'Lun–Dom 9am–9pm', highlights:['Historia real de la mafia','Sala de juicio de Al Capone','Speakeasy en el sótano','Exposiciones interactivas'], about:'The Mob Museum es uno de los museos más fascinantes de Estados Unidos.' },
  { id:29, slug:'penn-teller', name:'Penn & Teller', cat:'shows', catLabel:'Shows & Eventos', region:'The Strip', icon:'🎩', stars:5, price:'$$$', badge:null, desc:'El dúo de magia más famoso del mundo con residencia permanente en el Rio Las Vegas.', address:'Rio All-Suite Hotel, 3700 W Flamingo Rd', phone:'(702) 777-7776', hours:'Mié–Dom 9pm', highlights:['40 años de trayectoria','Magia de nivel mundial','Comedia inteligente','Meet & greet después del show'], about:'Penn & Teller son el dúo de magia más longevo y respetado de Las Vegas.' },
  { id:30, slug:'david-copperfield', name:'David Copperfield', cat:'shows', catLabel:'Shows & Eventos', region:'The Strip', icon:'✨', stars:5, price:'$$$', badge:null, desc:'El mago más famoso de la historia con residencia permanente en el MGM Grand.', address:'MGM Grand, 3799 Las Vegas Blvd S', phone:'(702) 891-7777', hours:'Vie–Mar 7pm y 9:30pm', highlights:['El mago más famoso del mundo','Ilusiones a gran escala','Récord Guinness de taquilla','Producción sin igual'], about:'David Copperfield es reconocido como el mago más exitoso en la historia del entretenimiento.' },
  { id:31, slug:'xs-nightclub', name:'XS Nightclub', cat:'nocturna', catLabel:'Vida Nocturna', region:'The Strip', icon:'🌙', stars:5, price:'$$$$', badge:null, desc:'El nightclub más rentable del mundo según Forbes, dentro del Wynn Las Vegas.', address:'Encore at Wynn, 3131 Las Vegas Blvd S', phone:'(702) 770-0097', hours:'Vie–Lun 10:30pm–4am', highlights:['Club más rentable del mundo Forbes','Piscina en la pista de baile','DJs Diplo y DJ Snake','Terraza exterior'], about:'XS en el Encore at Wynn ha sido clasificado como el nightclub más rentable del mundo por Forbes.' },
  { id:32, slug:'qua-baths-spa', name:'Qua Baths & Spa', cat:'atracciones', catLabel:'Spa de Lujo', region:'The Strip', icon:'🛁', stars:5, price:'$$$', badge:null, desc:'El spa más icónico del Strip dentro de Caesars Palace, con experiencia romana de baños termales.', address:'Caesars Palace, 3570 Las Vegas Blvd S', phone:'(702) 731-7776', hours:'Lun–Dom 9am–8pm', highlights:['Piscinas termales romanas','Sala de nieve única','Tratamientos exclusivos','Acceso al pool de Caesars'], about:'Qua Baths & Spa en Caesars Palace es una experiencia de bienestar única en el Strip.' },
  { id:33, slug:'canyon-ranch-spa', name:'Canyon Ranch SpaClub', cat:'atracciones', catLabel:'Spa & Bienestar', region:'The Strip', icon:'🌿', stars:5, price:'$$$$', badge:'Premium', desc:'El spa más completo y lujoso de Las Vegas dentro del Venetian.', address:'The Venetian, 3355 Las Vegas Blvd S', phone:'(702) 414-3600', hours:'Lun–Dom 6am–8pm', highlights:['134+ tratamientos','Médicos en el equipo','Piscina olímpica','Clases de yoga y meditación'], about:'Canyon Ranch SpaClub en el Venetian es ampliamente reconocido como uno de los mejores spas de Estados Unidos.' },
  { id:34, slug:'forum-shops', name:'The Forum Shops', cat:'atracciones', catLabel:'Shopping', region:'The Strip', icon:'🛍️', stars:4, price:'$$$', badge:null, desc:'El centro comercial más exclusivo y teatral del mundo, integrado dentro de Caesars Palace.', address:'Caesars Palace, 3570 Las Vegas Blvd S', phone:'(702) 893-4800', hours:'Lun–Dom 10am–11pm', highlights:['160+ tiendas de lujo','Estatuas animadas cada hora','Cielo artificial único','Restaurantes premium'], about:'The Forum Shops en Caesars Palace es uno de los centros comerciales más exitosos por pie cuadrado del mundo.' },
];

export const REVIEWS = [
  { name: 'María G.', stars: 5, date: 'Enero 2025', text: '¡Increíble experiencia! Todo en español, el personal fue muy amable y las instalaciones son de primera.' },
  { name: 'Carlos M.', stars: 5, date: 'Diciembre 2024', text: 'Uno de los mejores lugares que he visitado en Las Vegas. La atención es excepcional.' },
  { name: 'Sofía R.', stars: 4, date: 'Noviembre 2024', text: 'Muy buen lugar, lo recomiendo ampliamente. La ubicación es perfecta y el ambiente es fantástico.' },
];

export function getStarsDisplay(stars: number) {
  const full = Math.floor(stars);
  const half = stars % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}
