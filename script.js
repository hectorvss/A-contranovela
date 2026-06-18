const STORAGE_KEY = "acontranovela.reviews.v1";
const BIO_STORAGE_KEY = "acontranovela.bio.v1";
const SCALE_SETTINGS_KEY = "acontranovela.scale-settings.v1";
const LOCAL_MANAGER_PASSWORD = "LMF39";
const SUPABASE_CONFIG = window.ACONTRANOVELA_SUPABASE || {};
const coverFilterPresets = [
  { label: "B/N limpio", value: "grayscale(1) contrast(1.05)" },
  { label: "B/N duro", value: "grayscale(1) contrast(1.45)" },
  { label: "B/N suave", value: "grayscale(1) contrast(.9) brightness(1.08)" },
  { label: "Alto grano", value: "grayscale(1) contrast(1.7) brightness(.95)" },
  { label: "Archivo", value: "grayscale(1) sepia(.18) contrast(1.15)" },
  { label: "Prensa", value: "grayscale(1) contrast(1.3) brightness(1.05)" },
  { label: "Nocturno", value: "grayscale(1) contrast(1.25) brightness(.78)" },
  { label: "Quemado", value: "grayscale(1) contrast(1.55) brightness(1.18)" },
  { label: "Plata", value: "grayscale(1) contrast(.82) brightness(1.22)" },
  { label: "Carbón", value: "grayscale(1) contrast(1.8) brightness(.82)" },
  { label: "Mate", value: "grayscale(1) saturate(.15) contrast(.95)" },
  { label: "Niebla", value: "grayscale(1) contrast(.72) brightness(1.18)" },
  { label: "Xerox", value: "grayscale(1) contrast(2) brightness(1.05)" },
  { label: "Cine", value: "grayscale(1) contrast(1.2) brightness(.9)" },
  { label: "Editorial", value: "grayscale(1) contrast(1.12) brightness(1.02)" },
  { label: "Papel", value: "grayscale(.9) sepia(.12) contrast(1.05)" },
  { label: "Frío", value: "grayscale(.85) saturate(.35) contrast(1.08)" },
  { label: "Cálido", value: "grayscale(.75) sepia(.28) contrast(1.03)" },
  { label: "Color bajo", value: "saturate(.45) contrast(1.05)" },
  { label: "Editorial cream #EAE4D8", value: "grayscale(.82) sepia(.18) saturate(.85) brightness(1.06) contrast(.96)" },
  { label: "Dusty rose #D0C8C5", value: "grayscale(.68) sepia(.2) saturate(.72) hue-rotate(320deg) brightness(1.02) contrast(.96)" },
  { label: "Nordic grey blue #B8C1CB", value: "grayscale(.72) sepia(.08) saturate(.9) hue-rotate(170deg) brightness(1.03) contrast(.98)" },
  { label: "Muted forest #4B5A4E", value: "grayscale(.58) sepia(.2) saturate(.85) hue-rotate(70deg) brightness(.72) contrast(1.08)" },
  { label: "Editorial black #181818", value: "grayscale(1) brightness(.48) contrast(1.38)" },
  { label: "Original", value: "none" },
];

const categories = [
  { id: "textos", label: "TEXTOS", mode: "cards" },
  { id: "flash", label: "FLASH", mode: "cards" },
  { id: "escala", label: "ESCALA", mode: "scale" },
  { id: "hoy-manana", label: "HOY Y MAÑANA", mode: "today" },
  { id: "no", label: "NO", mode: "no" },
];

const categoryLabels = {
  es: {
    textos: "TEXTOS",
    flash: "FLASH",
    escala: "ESCALA",
    "hoy-manana": "HOY Y MAÑANA",
    no: "NO",
    yo: "YO",
    today: "HOY",
    tomorrow: "MAÑANA",
    week: "SEMANA",
    previous: "← anterior",
    index: "indice",
    next: "siguiente →",
    languageButton: "EN",
    socialThere: "allí",
  },
  en: {
    textos: "TEXTS",
    flash: "FLASH",
    escala: "SCALE",
    "hoy-manana": "TODAY AND TOMORROW",
    no: "NO",
    yo: "ME",
    today: "TODAY",
    tomorrow: "TOMORROW",
    week: "WEEK",
    previous: "← previous",
    index: "index",
    next: "next →",
    languageButton: "ES",
    socialThere: "there",
  },
};

const mojibakeMap = {
  "\u00c3\u00a1": "á",
  "\u00c3\u00a9": "é",
  "\u00c3\u00ad": "í",
  "\u00c3\u00b3": "ó",
  "\u00c3\u00ba": "ú",
  "\u00c3\u0081": "Á",
  "\u00c3\u0089": "É",
  "\u00c3\u008d": "Í",
  "\u00c3\u0093": "Ó",
  "\u00c3\u009a": "Ú",
  "\u00c3\u00b1": "ñ",
  "\u00c3\u0091": "Ñ",
  "\u00c3\u2018": "Ñ",
  "\u00c2\u00bf": "¿",
  "\u00c2\u00a1": "¡",
  "\u00c2\u00b7": "·",
  "\u00c2\u00ba": "º",
  "\u00c2\u00aa": "ª",
  "\u00e2\u0086\u0090": "←",
  "\u00e2\u0086\u0091": "↑",
  "\u00e2\u0086\u0092": "→",
  "\u00e2\u0086\u0093": "↓",
  "\u00e2\u0086\u0095": "↕",
  "\u00e2\u0080\u0093": "–",
  "\u00e2\u0080\u0094": "—",
  "\u00e2\u0080\u009c": "“",
  "\u00e2\u0080\u009d": "”",
  "\u00e2\u0080\u0098": "‘",
  "\u00e2\u0080\u0099": "’",
};

function repairTextEncoding(value) {
  if (typeof value !== "string") return value;
  return Object.entries(mojibakeMap).reduce((text, [broken, fixed]) => text.replaceAll(broken, fixed), value);
}

function repairContentEncoding(value) {
  if (Array.isArray(value)) return value.map(repairContentEncoding);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, repairContentEncoding(item)]));
  }
  return repairTextEncoding(value);
}

const defaultBioContent = {
  es: {
    lead: "Este proyecto nace de una mania privada: leer como quien escucha una habitacion vacia. No busca ordenar el canon, sino registrar una temperatura. Lo que importa no es solo si un libro funciona, sino que tipo de ruido deja en la cabeza.",
    image: "",
    blocks: [
      "El manager de <strong>a contranovela</strong> escribe desde una idea sencilla: la critica no deberia sonar como una sentencia, sino como una forma de atencion. Cada texto intenta mirar el libro de cerca, sin convertirlo en mercancia de recomendacion rapida ni en monumento academico.",
      "Aqui conviven reseñas largas, apuntes veloces, escalas semanales, entusiasmos provisionales y negativas razonadas. Hay libros que se aman, libros que se discuten y libros que se dejan caer con cuidado sobre la mesa para escuchar como suenan.",
    ],
    quote: "Leer no para tener razon, sino para afinar la desconfianza.",
  },
  en: {
    lead: "This project begins with a private obsession: reading as if listening to an empty room. It does not try to organize the canon, but to register a temperature.",
    image: "",
    blocks: [
      "The manager of <strong>a contranovela</strong> writes from a simple idea: criticism should not sound like a verdict, but like a form of attention.",
      "Long reviews, quick notes, weekly scales, provisional enthusiasms and reasoned refusals coexist here. Some books are loved, some are argued with, and some are placed carefully on the table to hear how they sound.",
    ],
    quote: "To read not in order to be right, but to sharpen distrust.",
  },
};

const defaultScaleSettings = {
  mode: "week",
  week: "2026-W28",
  startDate: "2026-07-07",
  endDate: "2026-07-14",
};

const titleTranslations = {
  "Ensayo sobre el cansancio": "Essay on Tiredness",
  Austerlitz: "Austerlitz",
  "Al amigo que no me salvo la vida": "To the Friend Who Did Not Save My Life",
  "Fin y principio": "The End and the Beginning",
  "La pasion segun G.H.": "The Passion According to G.H.",
  "Corazon tan blanco": "A Heart So White",
  "El sobrino de Wittgenstein": "Wittgenstein's Nephew",
  "Sobre la fotografia": "On Photography",
  "Fragmentos de un libro futuro": "Fragments of a Future Book",
  Stoner: "Stoner",
  "La vegetariana": "The Vegetarian",
  "Una educacion": "Educated",
  "Los detectives salvajes": "The Savage Detectives",
  "Al faro": "To the Lighthouse",
  "El lector": "The Reader",
  "El cielo protector": "The Sheltering Sky",
  Nada: "Nada",
  "Suite francesa": "Suite Francaise",
  "¿Sueñan los androides con ovejas electricas?": "Do Androids Dream of Electric Sheep?",
  Vertigo: "Vertigo",
  "La insoportable levedad del ser": "The Unbearable Lightness of Being",
  Cosmopolis: "Cosmopolis",
  "Mi lucha 1": "My Struggle 1",
  "El guardian entre el centeno": "The Catcher in the Rye",
  "El alquimista": "The Alchemist",
  "El codigo Da Vinci": "The Da Vinci Code",
  "La amiga estupenda": "My Brilliant Friend",
  "Si pudiera volver a verte": "If Only It Were True",
  "Soldados de Salamina": "Soldiers of Salamis",
  "Cincuenta sombras de Grey": "Fifty Shades of Grey",
};

const seedReviews = [
  review("textos", "Peter Handke", "Ensayo sobre el cansancio", "Un libro que afirma el derecho a la inutilidad y al silencio. Handke convierte el cansancio en una forma de atencion: no es una renuncia, es una resistencia intima frente al ruido del mundo.", "8.2", "Alianza", "1990", "Eustaquio Barjau", "72", "1005", "#efe7d8"),
  review("textos", "W. G. Sebald", "Austerlitz", "Memoria, arquitectura, perdida. Sebald construye una narracion donde el pasado nunca es pasado del todo: deambula y nos arrastra con el por los pasillos de la historia.", "9.1", "Anagrama", "2001", "Miguel Saenz", "364", "1035", "#e8e2d3"),
  review("textos", "Herve Guibert", "Al amigo que no me salvo la vida", "Guibert escribe como quien se expone. Carta, diario y elegia. La amistad aparece como el unico lugar posible desde el que mirar la propia desaparicion.", "8.0", "Tusquets", "1991", "M. Antolin Rato", "288", "1011", "#e4df73"),
  review("textos", "Wislawa Szymborska", "Fin y principio", "Poesia de lo cotidiano y lo abismal. Szymborska encuentra la grieta luminosa en las cosas mas pequeñas: ironia, precision y una ternura sin concesiones.", "8.7", "Nordica", "1993", "Gerardo Beltran", "128", "1040", "#d9e0e1"),
  review("flash", "Clarice Lispector", "La pasion segun G.H.", "Una caida al cuarto de servicio que lo desordena todo. Breve y devastadora: una novela donde la identidad se queda sin muebles y el lenguaje trabaja contra si mismo.", "8.5", "Siruela", "1964", "Cristina Peri Rossi", "176", "1076", "#efe5d0"),
  review("flash", "Javier Marias", "Corazon tan blanco", "El espionaje como excusa, la duda como centro. Una novela sobre mirar y no entender, sobre escuchar demasiado tarde aquello que ya habia cambiado la vida.", "7.6", "Alfaguara", "1992", "-", "304", "1050", "#efd7d7"),
  review("flash", "Thomas Bernhard", "El sobrino de Wittgenstein", "Monologo, obsesion, musica. Bernhard en estado puro: la furia como instrumento de precision y el humor como forma de lucidez amarga.", "8.1", "Anagrama", "1982", "Miguel Saenz", "144", "1027", "#eee7d9"),
  review("flash", "Susan Sontag", "Sobre la fotografia", "Un ensayo que aun nos incomoda. Mirar no es inocente: toda imagen organiza una distancia moral entre quien observa y aquello que queda fijado.", "7.9", "Debolsillo", "1977", "Carlos Gardini", "288", "1031", "#222"),
  review("flash", "Jose Angel Valente", "Fragmentos de un libro futuro", "Escritura quebrada, esencial. Cada fragmento es una iluminacion y tambien una desaparicion: pensamiento reducido a su temperatura mas exacta.", "8.8", "Galaxia", "2000", "-", "104", "1043", "#efe6d0"),
  review("escala", "John Williams", "Stoner", "Una vida aparentemente minima contada con una serenidad feroz. El libro avanza sin levantar la voz y termina pesando como una biografia secreta de la dignidad.", "9.6", "Baile del Sol", "1965", "Antonio Diez Fernandez", "256", "1059", "#e2d6b7"),
  review("escala", "Susan Sontag", "Sobre la fotografia", "La camara como poder, archivo y coartada. Sontag no escribe sobre tecnicas: escribe sobre el deseo de poseer el mundo por medio de sus restos.", "9.2", "Debolsillo", "1977", "Carlos Gardini", "288", "1060", "#111"),
  review("escala", "Han Kang", "La vegetariana", "Un cuerpo decide salir del pacto. La novela convierte una renuncia privada en una violencia publica: familia, deseo, obediencia y terror domestico.", "9.0", "Rata", "2007", "Sunme Yoon", "240", "1067", "#efe5dd"),
  review("escala", "Tara Westover", "Una educacion", "Una memoria sobre abandonar un idioma familiar para poder nombrarse. La educacion aparece como fuga, herida y reconstruccion.", "8.8", "Lumen", "2018", "Antonia Martin", "464", "1084", "#efe2c9"),
  review("escala", "Roberto Bolaño", "Los detectives salvajes", "Una expedicion, una pandilla, una ruina. Bolaño escribe la juventud como persecucion y la literatura como un mapa que siempre llega tarde.", "8.5", "Anagrama", "1998", "-", "624", "1083", "#f0d4ce"),
  review("escala", "Virginia Woolf", "Al faro", "La conciencia como marea. Woolf hace visible lo que normalmente pasa entre frases: demora, deseo, memoria y la luz que cambia sin pedir permiso.", "8.3", "Alianza", "1927", "Jose Luis Lopez", "272", "1039", "#ecd873"),
  review("escala", "Bernhard Schlink", "El lector", "Culpa, deseo y memoria alemana. Una novela breve que abre una pregunta incomoda: que hacemos con aquello que comprendemos demasiado tarde.", "8.1", "Anagrama", "1995", "Joan Parra", "208", "1048", "#dedede"),
  review("escala", "Paul Bowles", "El cielo protector", "Viajar hasta el punto donde el viaje deja de protegernos. Bowles narra la extranjeria como fiebre lenta y como perdida de forma.", "7.9", "Seix Barral", "1949", "M. Antolin Rato", "336", "1056", "#d7e6e9"),
  review("escala", "Carmen Laforet", "Nada", "Una casa que devora y una voz que resiste. Laforet hizo del encierro de posguerra una novela de atmosfera cortante.", "7.6", "Destino", "1945", "-", "296", "1068", "#eee8dc"),
  review("escala", "Irene Nemirovsky", "Suite francesa", "Una novela escrita en el borde de su propia catastrofe. El detalle social convive con una conciencia tragica del tiempo que se acaba.", "7.4", "Salamandra", "2004", "Jose Antonio Soriano", "480", "1024", "#eadfc9"),
  review("hoy-manana", "Philip K. Dick", "¿Sueñan los androides con ovejas electricas?", "El futuro como pregunta moral. Dick no pregunta si las maquinas sienten, sino que queda de nosotros cuando la compasion se convierte en un articulo escaso.", "8.6", "Minotauro", "1968", "Cesar Terron", "256", "1080", "#f2eadc", "hoy"),
  review("hoy-manana", "W. G. Sebald", "Vertigo", "Cuatro desplazamientos, una misma niebla. Sebald escribe el viaje como un estado de sospecha: cada lugar parece recordar algo que el narrador todavia no sabe.", "8.9", "Anagrama", "1990", "Miguel Saenz", "248", "1081", "#f0e4cf", "mañana"),
  review("no", "Milan Kundera", "La insoportable levedad del ser", "Una novela brillante en superficie, pero demasiado enamorada de su propio mecanismo. La idea manda tanto que los personajes quedan reducidos a emblemas.", "2.8", "Tusquets", "1984", "Fernando de Valenzuela", "320", "1082", "#ead0d0"),
  review("no", "Don DeLillo", "Cosmopolis", "El concepto es potente, la ejecucion demasiado hermetica. La ciudad vibra, pero la novela parece mirar su propio reflejo mas que a sus criaturas.", "3.1", "Seix Barral", "2003", "Gian Castelli", "224", "1076", "#1f1f1f"),
  review("no", "Karl Ove Knausgard", "Mi lucha 1", "La precision autobiografica no siempre alcanza forma literaria. Hay intensidad, pero tambien una insistencia que confunde acumulacion con revelacion.", "2.5", "Anagrama", "2009", "Kirsti Baggethun", "496", "1016", "#eee8df"),
  review("no", "J. D. Salinger", "El guardian entre el centeno", "Su energia adolescente sigue intacta, pero el mito ha envejecido peor que la voz. La pose termina tapando sus hallazgos.", "3.0", "Alianza", "1951", "Carmen Criado", "240", "1027", "#ede7d5"),
  review("no", "Paulo Coelho", "El alquimista", "La fabula avanza por frases que buscan parecer revelacion. Hay limpieza, si, pero poca friccion, poca sombra y casi ningun riesgo.", "2.0", "Planeta", "1988", "-", "192", "1031", "#b94b40"),
  review("no", "Dan Brown", "El codigo Da Vinci", "Eficaz como mecanismo, pobre como literatura. Cada capitulo empuja, pero casi nada permanece cuando se apaga el suspense.", "2.2", "Umbriel", "2003", "Juanjo Estrella", "560", "1043", "#2a241e"),
  review("no", "Elena Ferrante", "La amiga estupenda", "Hay vida, barrio y conflicto, pero la intensidad queda demasiado programada. La emocion llega subrayada antes de tiempo.", "2.6", "Lumen", "2011", "Celia Filipetto", "392", "1059", "#eee4d4"),
  review("no", "Marc Levy", "Si pudiera volver a verte", "Romanticismo de trazo blando y arquitectura previsible. La novela nunca incomoda a sus propias certezas.", "2.7", "Roca", "2001", "-", "288", "1060", "#ece8dc"),
  review("no", "Javier Cercas", "Soldados de Salamina", "Interesante como dispositivo, menos convincente como resultado. La investigacion pesa mas que la respiracion narrativa.", "2.9", "Tusquets", "2001", "-", "224", "1067", "#eee9df"),
  review("no", "E. L. James", "Cincuenta sombras de Grey", "El escandalo fue mas fuerte que la prosa. Como artefacto cultural importa; como novela, apenas sostiene sus propias escenas.", "2.3", "Grijalbo", "2011", "Pilar de la Peña", "544", "1084", "#191919"),
];

function review(section, author, title, summary, score, publisher, year, translator, pages, imageId, tone, slot = "") {
  const id = `${section}-${slug(author)}-${slug(title)}`;
  return {
    id,
    section,
    author,
    title,
    summary,
    score,
    publisher,
    year,
    translator,
    pages,
    image: `https://picsum.photos/id/${imageId}/420/560`,
    tone,
    slot,
    body: buildBody(title, author, summary),
  };
}

function buildBody(title, author, summary) {
  return [
    `Hay libros que no se leen: se atraviesan. ${title} pertenece a esa familia porque ${summary.toLowerCase()} La experiencia no se agota en el argumento; sucede en la respiracion, en la forma en que cada pagina administra sus silencios y en la incomodidad que deja despues.`,
    `${author} trabaja aqui con una conciencia muy clara del ritmo. La escritura no busca decorar una idea, sino ponerla a prueba. Cada escena parece medida para que el lector perciba lo que ocurre debajo de la superficie: una perdida, una sospecha, una educacion sentimental o una manera de mirar que ya no puede volver atras.`,
    `Lo mas interesante esta en la tension entre forma y temperatura. El libro puede parecer sobrio, incluso frio, pero debajo hay una energia persistente. La prosa no explica de mas; organiza el espacio para que aparezca una pregunta: que queda de una vida cuando se la mira sin consuelo y sin grandes gestos.`,
    `Tambien importa la manera en que el libro entiende al lector. No lo trata como consumidor de argumento, sino como alguien capaz de quedarse dentro de una escena cuando la escena ya ha terminado. Esa confianza cambia la lectura: obliga a mirar los detalles laterales, los cambios de tono, las repeticiones y las omisiones que al principio parecian menores.`,
    `En terminos de estructura, la obra funciona por acumulacion discreta. No depende de un unico golpe ni de una frase memorable convertida en cartel; su potencia aparece cuando las capas empiezan a tocarse. Entonces se comprende que la forma no era un recipiente, sino el verdadero asunto: el modo en que una experiencia encuentra o pierde su lenguaje.`,
    `La pregunta que deja ${title} no es si nos ha gustado, sino que clase de atencion nos ha exigido. Esa diferencia es importante. Hay libros que piden velocidad y libros que piden demora; este pertenece a los segundos, incluso cuando parece breve, directo o transparente. Su valor esta en esa resistencia a ser liquidado demasiado pronto.`,
    `Por eso la lectura deja una impresion doble. Por un lado, la precision de una pieza cerrada; por otro, la sensacion de que algo sigue abierto fuera del libro. Esa es su fuerza: no imponer una conclusion, sino dejar una vibracion moral que acompaña mucho despues de cerrar la ultima pagina.`,
  ];
}

function numericScore(item) {
  const score = Number.parseFloat(String(item?.score ?? "").replace(",", "."));
  return Number.isFinite(score) ? score : Number.NEGATIVE_INFINITY;
}

function sortByScoreDesc(items) {
  return [...items].sort((first, second) => {
    const scoreDiff = numericScore(second) - numericScore(first);
    if (scoreDiff) return scoreDiff;
    return String(first.title || "").localeCompare(String(second.title || ""), "es", { sensitivity: "base" });
  });
}

function sectionReviews(section, { visibleOnly = false } = {}) {
  const items = reviews.filter((item) => item.section === section);
  if (section !== "escala") return items;
  const ranked = sortByScoreDesc(items);
  return visibleOnly ? ranked.slice(0, 10) : ranked;
}

function slug(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const els = {
  index: document.querySelector(".index"),
  menu: document.querySelector("#menu"),
  panel: document.querySelector("#panel"),
  postList: document.querySelector("#postList"),
  postView: document.querySelector("#postView"),
  managerForm: document.querySelector("#managerForm"),
  backButton: document.querySelector("#backButton"),
  crumb: document.querySelector("#crumb"),
  rightLabel: document.querySelector("#managerButton"),
  homeButton: document.querySelector("#homeButton"),
  noButton: document.querySelector("#noButton"),
  languageToggle: document.querySelector("#languageToggle"),
  footerManager: document.querySelector("#footerManager"),
};

let reviews = loadReviews();
let state = { view: "home", category: null, detail: null };
let currentLanguage = localStorage.getItem("acontranovela.language") || "es";
let managerState = { screen: "dashboard", category: null, reviewId: null };
let managerShortcutBuffer = "";
let managerShortcutTimer = null;
let managerDraggedBlock = null;
let pendingCoverFile = null;
let pendingBioFiles = { es: null, en: null };
let editorialPages = {};
let supabaseClient = null;
let supabaseStatus = "local";

renderHome();
initCustomCursor();
initSupabaseData();

els.homeButton.addEventListener("click", renderBio);
els.noButton.addEventListener("click", () => renderCategory("no"));
els.backButton.addEventListener("click", goBack);
els.languageToggle.addEventListener("click", toggleLanguage);
els.footerManager.addEventListener("click", requestManagerAccess);
window.addEventListener("keydown", (event) => {
  if (event.target?.closest?.("input, textarea, select")) return;
  if (event.key.length !== 1) return;
  const shortcutKey = event.key.toLowerCase();
  if (!"lmf".includes(shortcutKey)) return;
  if (event.altKey || managerShortcutBuffer) event.preventDefault();
  managerShortcutBuffer += shortcutKey;
  managerShortcutBuffer = managerShortcutBuffer.slice(-3);
  window.clearTimeout(managerShortcutTimer);
  managerShortcutTimer = window.setTimeout(() => {
    managerShortcutBuffer = "";
  }, 1400);
  if (managerShortcutBuffer === "lmf") {
    managerShortcutBuffer = "";
    requestManagerAccess();
  }
});

function loadReviews() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return stored.length ? stored : seedReviews;
  } catch {
    return seedReviews;
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

function hasSupabaseConfig() {
  return Boolean(SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey && window.supabase);
}

function getSupabaseClient() {
  if (!hasSupabaseConfig()) return null;
  if (!supabaseClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  }
  return supabaseClient;
}

async function initSupabaseData() {
  const client = getSupabaseClient();
  if (!client) {
    supabaseStatus = "local";
    return;
  }
  try {
    const [
      { data: remoteReviews, error: reviewsError },
      { data: pages, error: pagesError },
    ] = await Promise.all([
      client.from("reviews").select("*").eq("is_published", true).order("sort_order"),
      client.from("editorial_pages").select("*"),
    ]);
    if (reviewsError) throw reviewsError;
    if (pagesError) throw pagesError;
    reviews = remoteReviews.map(fromSupabaseReview);
    editorialPages = Object.fromEntries((pages || []).map((page) => [page.id, repairContentEncoding(page)]));
    const yo = editorialPages.yo?.content;
    if (yo) saveBioContent(repairContentEncoding(yo));
    const escala = editorialPages.escala?.content;
    if (escala) saveScaleSettings(repairContentEncoding(escala));
    persist();
    supabaseStatus = "online";
    rerenderCurrentView();
  } catch (error) {
    console.warn("Supabase load failed; using local fallback.", error);
    supabaseStatus = "error";
  }
}

function rerenderCurrentView() {
  if (state.view === "home") renderHome();
  else if (state.view === "bio") renderBio();
  else if (state.view === "category") renderCategory(state.category);
  else if (state.view === "detail") renderDetail(state.detail);
  else if (state.view === "manager") renderManager(managerState.screen, {
    category: managerState.category,
    reviewId: managerState.reviewId,
  });
}

async function ensureManagerSession(password) {
  const client = getSupabaseClient();
  if (!client) return true;
  if (!SUPABASE_CONFIG.managerEmail) {
    console.warn("Supabase is configured, but managerEmail is missing in supabase-config.js.");
    return false;
  }
  const { data: { session } } = await client.auth.getSession();
  if (session) return true;
  const { error } = await client.auth.signInWithPassword({
    email: SUPABASE_CONFIG.managerEmail,
    password,
  });
  if (error) throw error;
  return true;
}

function fromSupabaseReview(row) {
  return repairContentEncoding({
    id: row.id,
    section: row.section,
    author: row.author,
    title: row.title,
    subtitle: row.subtitle || "",
    summary: row.summary,
    score: row.score?.toString() || "",
    publisher: row.publisher || "",
    year: row.publication_year || "",
    translator: row.translator || "",
    pages: row.pages || "",
    image: row.cover_image_url,
    tone: row.cover_tone || "#efe7d8",
    coverFilter: row.cover_filter || "grayscale(1) contrast(1.05)",
    slot: row.slot || "",
    body: Array.isArray(row.body) ? row.body : [],
    images: Array.isArray(row.images) ? row.images : [],
  });
}

function toSupabaseReview(review, sortOrder) {
  return {
    id: review.id,
    section: review.section,
    author: review.author,
    title: review.title,
    subtitle: review.subtitle || null,
    summary: review.summary,
    score: review.score ? Number(review.score) : null,
    publisher: review.publisher || null,
    publication_year: review.year || null,
    translator: review.translator || null,
    pages: review.pages || null,
    cover_image_url: review.image,
    cover_tone: review.tone || "#efe7d8",
    cover_filter: review.coverFilter || "grayscale(1) contrast(1.05)",
    slot: review.slot || "",
    body: review.body || [],
    images: review.images || [],
    sort_order: sortOrder,
    is_published: true,
  };
}

async function persistReviewToSupabase(review) {
  const client = getSupabaseClient();
  if (!client) return null;
  const sortOrder = Math.max(1, sectionReviews(review.section).findIndex((item) => item.id === review.id) + 1);
  const payload = toSupabaseReview(review, sortOrder);
  const { data, error } = await client.from("reviews").upsert(payload).select().single();
  if (error) throw error;
  return fromSupabaseReview(data);
}

async function deleteReviewFromSupabase(id) {
  const client = getSupabaseClient();
  if (!client) return;
  const { error } = await client.from("reviews").delete().eq("id", id);
  if (error) throw error;
}

async function saveBioToSupabase(nextBio) {
  const client = getSupabaseClient();
  if (!client) return;
  const normalized = normalizeBioContent(nextBio);
  const { data, error } = await client
    .from("editorial_pages")
    .upsert({ id: "yo", title: "YO", content: normalized })
    .select()
    .single();
  if (error) throw error;
  editorialPages.yo = data;
}

async function saveScaleSettingsToSupabase(nextSettings) {
  const client = getSupabaseClient();
  if (!client) return;
  const normalized = normalizeScaleSettings(nextSettings);
  const { data, error } = await client
    .from("editorial_pages")
    .upsert({ id: "escala", title: "ESCALA", content: normalized })
    .select()
    .single();
  if (error) throw error;
  editorialPages.escala = data;
}

async function uploadCoverToSupabase(file, reviewId) {
  const client = getSupabaseClient();
  if (!client || !file) return "";
  const extension = file.type === "image/png" ? "png" : "jpg";
  const path = `${reviewId}/${Date.now()}.${extension}`;
  const { error } = await client.storage.from("covers").upload(path, file, {
    contentType: file.type,
    upsert: true,
  });
  if (error) throw error;
  return client.storage.from("covers").getPublicUrl(path).data.publicUrl;
}

function normalizeBioLanguage(defaults, source = {}) {
  const blocks = Array.isArray(source.blocks) && source.blocks.length
    ? source.blocks
    : [source.one, source.two].filter(Boolean);
  const imagePositionX = Number.isFinite(Number(source.imagePositionX)) ? Number(source.imagePositionX) : 50;
  const imagePositionY = Number.isFinite(Number(source.imagePositionY)) ? Number(source.imagePositionY) : 50;
  const imageScale = Number.isFinite(Number(source.imageScale)) ? Number(source.imageScale) : 100;
  return {
    lead: source.lead || defaults.lead,
    image: source.image || source.photo || defaults.image || "",
    imagePositionX,
    imagePositionY,
    imageScale,
    blocks: blocks.length ? blocks : [...defaults.blocks],
    quote: source.quote || defaults.quote,
  };
}

function normalizeBioContent(source = {}) {
  return {
    es: normalizeBioLanguage(defaultBioContent.es, source.es || {}),
    en: normalizeBioLanguage(defaultBioContent.en, source.en || {}),
  };
}

function loadBioContent() {
  try {
    const stored = JSON.parse(localStorage.getItem(BIO_STORAGE_KEY) || "{}");
    return normalizeBioContent(stored);
  } catch {
    return normalizeBioContent(defaultBioContent);
  }
}

function saveBioContent(nextBio) {
  localStorage.setItem(BIO_STORAGE_KEY, JSON.stringify(normalizeBioContent(nextBio)));
}

function currentBio() {
  const bio = loadBioContent();
  return bio[currentLanguage] || bio.es;
}

function parseDateParts(value) {
  const [year, month, day] = String(value || "").split("-").map(Number);
  if (!year || !month || !day) return null;
  return { year, month, day };
}

function formatScaleDay(value) {
  const parts = parseDateParts(value);
  if (!parts) return "--";
  return String(parts.day).padStart(2, "0");
}

function mondayFromIsoWeek(weekValue) {
  const match = String(weekValue || "").match(/^(\d{4})-W(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const week = Number(match[2]);
  const januaryFourth = new Date(Date.UTC(year, 0, 4));
  const day = januaryFourth.getUTCDay() || 7;
  const monday = new Date(januaryFourth);
  monday.setUTCDate(januaryFourth.getUTCDate() - day + 1 + (week - 1) * 7);
  return monday;
}

function toIsoDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function weekRangeFromValue(weekValue) {
  const monday = mondayFromIsoWeek(weekValue);
  if (!monday) return null;
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  return {
    week: weekValue,
    startDate: toIsoDate(monday),
    endDate: toIsoDate(sunday),
  };
}

function normalizeScaleSettings(source = {}) {
  const mode = source.mode === "dates" ? "dates" : "week";
  const week = source.week || defaultScaleSettings.week;
  const weekRange = weekRangeFromValue(week) || weekRangeFromValue(defaultScaleSettings.week);
  let startDate = source.startDate || weekRange.startDate || defaultScaleSettings.startDate;
  let endDate = source.endDate || weekRange.endDate || defaultScaleSettings.endDate;
  if (mode === "week" && weekRange) {
    startDate = weekRange.startDate;
    endDate = weekRange.endDate;
  }
  if (startDate > endDate) [startDate, endDate] = [endDate, startDate];
  return { mode, week, startDate, endDate };
}

function loadScaleSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(SCALE_SETTINGS_KEY) || "{}");
    return normalizeScaleSettings(stored);
  } catch {
    return normalizeScaleSettings(defaultScaleSettings);
  }
}

function saveScaleSettings(nextSettings) {
  localStorage.setItem(SCALE_SETTINGS_KEY, JSON.stringify(normalizeScaleSettings(nextSettings)));
}

function currentScaleSettings() {
  return loadScaleSettings();
}

function formatScaleRange(settings = currentScaleSettings()) {
  const normalized = normalizeScaleSettings(settings);
  return `${formatScaleDay(normalized.startDate)} - ${formatScaleDay(normalized.endDate)}`;
}

function bioImageInlineStyle(bio) {
  const posX = Number.isFinite(Number(bio?.imagePositionX)) ? Number(bio.imagePositionX) : 50;
  const posY = Number.isFinite(Number(bio?.imagePositionY)) ? Number(bio.imagePositionY) : 50;
  const scale = Number.isFinite(Number(bio?.imageScale)) ? Number(bio.imageScale) : 100;
  const offsetX = ((posX - 50) / 50) * 22;
  const offsetY = ((posY - 50) / 50) * 22;
  const effectiveScale = Math.max(1.12, scale / 100);
  return `--bio-offset-x:${offsetX.toFixed(2)}px;--bio-offset-y:${offsetY.toFixed(2)}px;--bio-scale:${effectiveScale.toFixed(3)};`;
}

function t(key) {
  return repairTextEncoding(categoryLabels[currentLanguage][key] || categoryLabels.es[key] || key);
}

function syncStatusLabel() {
  if (supabaseStatus === "online") return "SUPABASE CONECTADO";
  if (supabaseStatus === "error") return "SUPABASE SIN SINCRONIZAR";
  return "MODO LOCAL";
}

function displayReview(item) {
  if (!item) return item;
  if (currentLanguage === "es") return item;
  const title = titleTranslations[item.title] || item.title;
  const summary = buildEnglishSummary(title, item.author, item.section);
  return {
    ...item,
    title,
    summary,
    body: buildBodyEnglish(title, item.author, summary),
  };
}

function buildEnglishSummary(title, author, section) {
  if (section === "no") {
    return `${author}'s ${title} is read here against the grain: a book with cultural weight, but also with visible limits in rhythm, character, or ambition.`;
  }
  return `${author}'s ${title} is approached as a literary object of attention, silence and form: a book that asks the reader to slow down and listen to what remains after the plot.`;
}

function buildBodyEnglish(title, author, summary) {
  return [
    `Some books are not simply read: they are crossed. ${title} belongs to that family because ${summary.toLowerCase()} The experience is not exhausted by the argument; it happens in the breathing of the prose, in the way each page manages silence, delay and discomfort.`,
    `${author} works here with a clear sense of rhythm. The writing does not decorate an idea; it tests it. Every scene seems arranged so the reader can perceive what moves beneath the surface: loss, suspicion, memory, desire, or a way of looking that can no longer return to innocence.`,
    `What matters most is the tension between form and temperature. The book may look sober, even cold, but there is a persistent energy underneath. Its value lies in refusing to be consumed too quickly.`,
    `That is why the reading leaves a double impression: the precision of a finished piece and, at the same time, the feeling that something remains open outside the book. Its strength is not to impose a conclusion, but to leave a moral vibration after the final page.`,
  ];
}

function toggleLanguage() {
  currentLanguage = currentLanguage === "es" ? "en" : "es";
  localStorage.setItem("acontranovela.language", currentLanguage);
  if (state.view === "home") renderHome();
  else if (state.view === "bio") renderBio();
  else if (state.view === "category") renderCategory(state.category);
  else if (state.view === "detail") renderDetail(state.detail);
  else renderManager();
}

function renderHome() {
  state = { view: "home", category: null, detail: null };
  document.body.classList.add("is-home");
  document.documentElement.lang = currentLanguage;
  els.homeButton.textContent = t("yo");
  els.languageToggle.textContent = t("languageButton");
  const thereLink = document.querySelector("#thereLink") || document.querySelector(".footer-links a:nth-of-type(3)");
  if (thereLink) thereLink.textContent = t("socialThere");
  els.index.classList.remove("hidden");
  els.panel.classList.add("hidden");
  els.postView.classList.add("hidden");
  els.managerForm.classList.add("hidden");
  els.postList.innerHTML = "";
  els.menu.innerHTML = categories
    .filter((category) => category.id !== "no")
    .map((category) => `<button class="menu-link" type="button" data-category="${category.id}">${t(category.id)}</button>`)
    .join("");
  els.menu.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => renderCategory(button.dataset.category));
  });
}

function showPanel(label) {
  document.body.classList.remove("is-home");
  els.index.classList.add("hidden");
  els.panel.classList.remove("hidden");
  els.postList.classList.remove("hidden");
  els.postView.classList.add("hidden");
  els.managerForm.classList.add("hidden");
  els.crumb.textContent = "a contranovela";
  els.rightLabel.textContent = label;
}

function requestManagerAccess() {
  closeManagerGate();
  const gate = document.createElement("section");
  gate.className = "manager-gate";
  gate.setAttribute("role", "dialog");
  gate.setAttribute("aria-modal", "true");
  gate.innerHTML = `
    <div class="manager-gate-card">
      <button class="manager-gate-close" type="button" aria-label="Cerrar">×</button>
      <span>PANEL EDITORIAL</span>
      <h2>ACCESO</h2>
      <p>Introduce la contraseña del manager para editar, crear o eliminar contenido.</p>
      <input type="password" data-manager-password placeholder="CONTRASEÑA" autocomplete="current-password" />
      <button class="submit-button" type="button" data-manager-unlock>ENTRAR</button>
      <small data-manager-error></small>
    </div>
  `;
  document.body.appendChild(gate);
  const input = gate.querySelector("[data-manager-password]");
  const error = gate.querySelector("[data-manager-error]");
  const unlock = async () => {
    const hasRemoteAuth = Boolean(getSupabaseClient());
    if (hasRemoteAuth || input.value === LOCAL_MANAGER_PASSWORD) {
      try {
        error.textContent = "Conectando...";
        const ready = hasRemoteAuth ? await ensureManagerSession(input.value) : true;
        if (!ready) {
          error.textContent = "Configura managerEmail en supabase-config.js.";
          return;
        }
        closeManagerGate();
        renderManager();
      } catch (authError) {
        console.error(authError);
        error.textContent = hasRemoteAuth ? "No se pudo autenticar en Supabase." : "No se pudo abrir el panel.";
      }
      return;
    }
    error.textContent = "Contraseña incorrecta.";
    input.value = "";
    input.focus();
  };
  gate.querySelector("[data-manager-unlock]").addEventListener("click", unlock);
  gate.querySelector(".manager-gate-close").addEventListener("click", closeManagerGate);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") unlock();
    if (event.key === "Escape") closeManagerGate();
  });
  input.focus();
}

function closeManagerGate() {
  document.querySelector(".manager-gate")?.remove();
}

function renderBio() {
  state = { view: "bio", category: null, detail: null };
  showPanel(t("yo"));
  const bio = currentBio();
  const imageMarkup = bio.image
    ? `<figure class="bio-square"><img src="${bio.image}" alt="${escapeAttr(t("yo"))}" loading="lazy" style="${bioImageInlineStyle(bio)}" /></figure>`
    : "";
  els.postList.innerHTML = `
    <section class="bio-page">
      <h1>${t("yo")}</h1>
      <div class="bio-story ${bio.image ? "has-image" : "no-image"}">
        <div class="bio-copy">
          ${imageMarkup}
          <p class="bio-lead">${bio.lead}</p>
          ${bio.blocks.map((block) => `<p>${block}</p>`).join("")}
        </div>
      </div>
      <blockquote>${bio.quote}</blockquote>
    </section>
  `;
}

function renderCategory(categoryId) {
  const category = categories.find((item) => item.id === categoryId);
  state = { view: "category", category: categoryId, detail: null };
  showPanel(t(category.id));
  if (category.mode === "scale") return renderScale(category);
  if (category.mode === "today") return renderToday(category);
  if (category.mode === "no") return renderRanked(category, "no-page");
  return renderCards(category);
}

function renderCards(category) {
  const items = reviews.filter((item) => item.section === category.id).map(displayReview);
  els.postList.innerHTML = `
    <section class="category-page cards-page">
      <h1>${t(category.id)}</h1>
      <div class="card-list">
        ${items.map(renderCardRow).join("")}
      </div>
    </section>
  `;
  bindRows();
}

function renderCardRow(item) {
  return `
    <button class="review-row card-row" type="button" data-review="${item.id}">
      ${renderCover(item, "small")}
      <span class="row-copy">
        <strong>${item.author}</strong>
        <em>${item.title}</em>
        <span>${item.summary}</span>
      </span>
      <span class="score">${item.score}</span>
    </button>
  `;
}

function renderScale(category) {
  const items = sectionReviews("escala", { visibleOnly: true }).map(displayReview);
  const scaleSettings = currentScaleSettings();
  els.postList.innerHTML = `
    <section class="category-page scale-page">
      <h1>${t(category.id)}</h1>
      <div class="scale-list">
        ${items.map((item, index) => renderRankRow(item, index)).join("")}
      </div>
      <div class="week-mark"><span>${t("week")}</span><strong>${formatScaleRange(scaleSettings)}</strong></div>
    </section>
  `;
  bindRows();
}

function renderRanked(category, className) {
  const items = sectionReviews(category.id).map(displayReview);
  els.postList.innerHTML = `
    <section class="category-page scale-page ${className}">
      <h1>${t(category.id)}</h1>
      <div class="scale-list">
        ${items.map((item, index) => renderRankRow(item, index)).join("")}
      </div>
    </section>
  `;
  bindRows();
}

function renderRankRow(item, index) {
  return `
    <button class="review-row rank-row" type="button" data-review="${item.id}">
      <span class="rank">${String(index + 1).padStart(2, "0")}</span>
      ${renderCover(item, "mini")}
      <span class="rank-copy">
        <strong>${item.title}</strong>
        <em>${item.author}</em>
      </span>
      <span class="score">${item.score}</span>
    </button>
  `;
}

function renderToday() {
  const today = displayReview(reviews.find((item) => item.section === "hoy-manana" && item.slot === "hoy"));
  const tomorrow = displayReview(reviews.find((item) => item.section === "hoy-manana" && item.slot === "mañana"));
  els.postList.innerHTML = `
    <section class="category-page today-page">
      ${renderFeature(t("today"), today)}
      ${renderFeature(t("tomorrow"), tomorrow)}
    </section>
  `;
  bindRows();
}

function renderFeature(label, item) {
  return `
    <button class="today-feature" type="button" data-review="${item.id}">
      <h1>${label}</h1>
      <span class="feature-body">
        ${renderCover(item, "feature")}
        <span>
          <strong>${item.author}</strong>
          <em>${item.title}</em>
        </span>
      </span>
    </button>
  `;
}

function renderDetail(reviewId) {
  const rawItem = reviews.find((reviewItem) => reviewItem.id === reviewId);
  if (!rawItem) return renderHome();
  const item = displayReview(rawItem);
  state = { view: "detail", category: rawItem.section, detail: rawItem.id };
  const category = categories.find((categoryItem) => categoryItem.id === rawItem.section);
  showPanel(t(category?.id || "textos"));
  els.postList.classList.add("hidden");
  els.postView.classList.remove("hidden");
  els.postView.innerHTML = `
    <section class="detail-page">
      <header class="detail-hero">
        ${renderCover(item, "large")}
        <div class="detail-title">
          <h1>${item.title}</h1>
          <h2>${item.author}</h2>
          <span class="title-line"></span>
          <strong class="detail-score">${item.score}</strong>
        </div>
      </header>
      <dl class="book-meta">
        <div><dt>EDITORIAL:</dt><dd>${item.publisher}</dd></div>
        <div><dt>AÑO:</dt><dd>${item.year}</dd></div>
        <div><dt>TRADUCCION:</dt><dd>${item.translator}</dd></div>
        <div><dt>PAGINAS:</dt><dd>${item.pages}</dd></div>
      </dl>
      <div class="detail-body">
        ${renderArticleBlocks(item)}
      </div>
      <nav class="detail-nav" aria-label="Navegacion entre reseñas">
        <button type="button" data-nav="prev">${t("previous")}</button>
        <button type="button" data-nav="index">${t("index")}</button>
        <button type="button" data-nav="next">${t("next")}</button>
      </nav>
    </section>
  `;
  els.postView.querySelector('[data-nav="index"]').addEventListener("click", () => renderCategory(rawItem.section));
  els.postView.querySelector('[data-nav="prev"]').addEventListener("click", () => moveDetail(-1));
  els.postView.querySelector('[data-nav="next"]').addEventListener("click", () => moveDetail(1));
}

function renderCover(item, size) {
  const coverFilter = item.coverFilter || "grayscale(1) contrast(1.05)";
  return `
    <span class="book-cover ${size}" style="--cover-tone: ${item.tone}">
      <img src="${item.image}" alt="${escapeAttr(`${item.title} - ${item.author}`)}" loading="lazy" style="filter:${coverFilter}" />
    </span>
  `;
}

function renderArticleBlocks(item) {
  const images = Array.isArray(item.images) && item.images.length ? item.images : [item.image];
  const hasInlineMarkers = Array.isArray(item.body) && item.body.some((entry) => /^\[\[image:(\d+)\]\]$/.test(String(entry).trim()));
  if (hasInlineMarkers) {
    return item.body
      .map((entry) => {
        const marker = String(entry).trim().match(/^\[\[image:(\d+)\]\]$/);
        if (marker) {
          const image = images[Number(marker[1])];
          return image ? `<figure class="inline-photo"><img src="${image}" alt="" loading="lazy" /></figure>` : "";
        }
        return `<p>${repairTextEncoding(entry)}</p>`;
      })
      .join("");
  }
  return item.body
    .map((paragraph, index) => {
      const image = images[index - 1];
      const media = image && index > 0 && index % 2 === 0 ? `<figure class="inline-photo"><img src="${image}" alt="" loading="lazy" /></figure>` : "";
      return `${media}<p>${repairTextEncoding(paragraph)}</p>`;
    })
    .join("");
}

function bindRows() {
  els.postList.querySelectorAll("[data-review]").forEach((row) => {
    row.addEventListener("click", () => renderDetail(row.dataset.review));
  });
}

function moveDetail(direction) {
  const current = reviews.find((item) => item.id === state.detail);
  if (!current) return renderHome();
  const sameSection = sectionReviews(current.section, { visibleOnly: current.section === "escala" });
  const index = sameSection.findIndex((item) => item.id === state.detail);
  if (index < 0 || !sameSection.length) return renderCategory(current.section);
  const next = sameSection[(index + direction + sameSection.length) % sameSection.length];
  renderDetail(next.id);
}

function goBack() {
  if (state.view === "detail") return renderCategory(state.category);
  renderHome();
}

function filterManagerLibrary(event) {
  const query = event.target.value.trim().toLowerCase();
  els.managerForm.querySelectorAll("[data-search-item]").forEach((button) => {
    button.hidden = query && !button.dataset.searchItem.includes(query);
  });
}


function renderTextBlock(value = "") {
  return `
    <section class="content-block manager-block" data-text-block data-block-type="text">
      <button class="block-drag-tab" type="button" data-drag-handle aria-label="Arrastrar bloque">↕</button>
      <div class="block-handle">
        <strong>TEXTO</strong>
        <span>arrastra la pestaña o usa las flechas</span>
      </div>
      <textarea name="bodyBlock" rows="5" placeholder="Escribe un bloque de la reseña">${value}</textarea>
      <div class="block-actions">
        <button type="button" data-move-up>↑</button>
        <button type="button" data-move-down>↓</button>
        <button type="button" data-remove-block>eliminar</button>
      </div>
    </section>
  `;
}

function renderImageBlock(value = "") {
  return `
    <section class="image-block manager-block" data-image-block data-block-type="image">
      <button class="block-drag-tab" type="button" data-drag-handle aria-label="Arrastrar foto">↕</button>
      <img src="${value}" alt="" loading="lazy" />
      <div class="image-block-fields">
        <div class="block-handle">
          <strong>FOTO</strong>
          <span>pega URL y ordenala por arrastre</span>
        </div>
        <input name="articleImage" value="${value}" placeholder="URL de imagen" />
      </div>
      <div class="block-actions">
        <button type="button" data-move-up>↑</button>
        <button type="button" data-move-down>↓</button>
        <button type="button" data-remove-block>eliminar</button>
      </div>
    </section>
  `;
}

function buildEditorBlocks(item) {
  if (Array.isArray(item.body) && item.body.some((entry) => /^\[\[image:(\d+)\]\]$/.test(String(entry).trim()))) {
    const images = Array.isArray(item.images) ? item.images : [];
    return item.body.map((entry) => {
      const marker = String(entry).trim().match(/^\[\[image:(\d+)\]\]$/);
      if (marker) {
        return { type: "image", value: images[Number(marker[1])] || "" };
      }
      return { type: "text", value: String(entry) };
    });
  }
  const blocks = [];
  const body = Array.isArray(item.body) && item.body.length ? item.body : [""];
  const images = Array.isArray(item.images) && item.images.length ? item.images : [];
  body.forEach((paragraph, index) => {
    blocks.push({ type: "text", value: paragraph });
    const image = images[index - 1];
    if (image && index > 0 && index % 2 === 0) {
      blocks.push({ type: "image", value: image });
    }
  });
  return blocks;
}

function renderEditorBlock(block) {
  return block.type === "image" ? renderImageBlock(block.value) : renderTextBlock(block.value);
}

function renderBioTextBlock(lang, value = "") {
  return `
    <section class="content-block manager-block bio-text-block" data-bio-text-block>
      <button class="block-drag-tab" type="button" data-drag-handle aria-label="Reordenar bloque">↕</button>
      <div class="block-handle">
        <strong>BLOQUE</strong>
        <span>arrastra, toca o usa las flechas</span>
      </div>
      <textarea name="${lang}-bio-block" rows="5" placeholder="Escribe un bloque de autobiografía">${value}</textarea>
      <div class="block-actions">
        <button type="button" data-move-up>↑</button>
        <button type="button" data-move-down>↓</button>
        <button type="button" data-remove-block>eliminar</button>
      </div>
    </section>
  `;
}

function clearBlockTargets(root) {
  root.querySelectorAll(".is-drop-target").forEach((block) => block.classList.remove("is-drop-target"));
}

function placeDraggedBlock(target, draggedBlock, clientY) {
  if (!target || !draggedBlock || target === draggedBlock || draggedBlock.parentElement !== target.parentElement) return;
  const rect = target.getBoundingClientRect();
  const after = clientY > rect.top + rect.height / 2;
  target.parentElement.insertBefore(draggedBlock, after ? target.nextElementSibling : target);
}

function bindSortableBlocks(root, selector = ".manager-block") {
  let pointerDrag = null;
  const cleanupPointerDrag = () => {
    if (!pointerDrag) return;
    const { block, placeholder } = pointerDrag;
    block.classList.remove("is-dragging");
    block.style.width = "";
    block.style.height = "";
    block.style.left = "";
    block.style.top = "";
    block.style.position = "";
    block.style.zIndex = "";
    block.style.pointerEvents = "";
    block.style.margin = "";
    placeholder?.replaceWith(block);
    document.body.classList.remove("is-sorting-blocks");
    managerDraggedBlock = null;
    pointerDrag = null;
    clearBlockTargets(root);
  };
  const blocks = root.querySelectorAll(selector);
  blocks.forEach((block) => {
    const handle = block.querySelector("[data-drag-handle]");
    if (!handle) return;
    handle.ondragstart = null;
    handle.ondragend = null;
    handle.onpointerdown = (event) => {
      if (event.button !== 0 && event.pointerType !== "touch") return;
      pointerDrag = {
        block,
        parent: block.parentElement,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        offsetX: event.clientX - block.getBoundingClientRect().left,
        offsetY: event.clientY - block.getBoundingClientRect().top,
        rect: block.getBoundingClientRect(),
        placeholder: null,
        dragging: false,
      };
      handle.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    };
    handle.onpointermove = (event) => {
      if (!pointerDrag || pointerDrag.pointerId !== event.pointerId) return;
      event.preventDefault();
      if (!pointerDrag.dragging) {
        const movedX = Math.abs(event.clientX - pointerDrag.startX);
        const movedY = Math.abs(event.clientY - pointerDrag.startY);
        if (Math.max(movedX, movedY) < 8) return;
        pointerDrag.dragging = true;
        managerDraggedBlock = pointerDrag.block;
        const placeholder = document.createElement("div");
        placeholder.className = "sortable-placeholder";
        placeholder.style.height = `${pointerDrag.rect.height}px`;
        pointerDrag.placeholder = placeholder;
        pointerDrag.parent.insertBefore(placeholder, pointerDrag.block);
        pointerDrag.block.classList.add("is-dragging");
        pointerDrag.block.style.width = `${pointerDrag.rect.width}px`;
        pointerDrag.block.style.height = `${pointerDrag.rect.height}px`;
        pointerDrag.block.style.left = `${pointerDrag.rect.left}px`;
        pointerDrag.block.style.top = `${pointerDrag.rect.top}px`;
        pointerDrag.block.style.position = "fixed";
        pointerDrag.block.style.zIndex = "1200";
        pointerDrag.block.style.pointerEvents = "none";
        pointerDrag.block.style.margin = "0";
        document.body.appendChild(pointerDrag.block);
        document.body.classList.add("is-sorting-blocks");
      }
      pointerDrag.block.style.left = `${event.clientX - pointerDrag.offsetX}px`;
      pointerDrag.block.style.top = `${event.clientY - pointerDrag.offsetY}px`;
      const target = document.elementFromPoint(event.clientX, event.clientY)?.closest(selector);
      clearBlockTargets(root);
      if (target && target !== pointerDrag.block && target.parentElement === pointerDrag.parent) {
        target.classList.add("is-drop-target");
        placeDraggedBlock(target, pointerDrag.placeholder, event.clientY);
        return;
      }
      const siblings = Array.from(pointerDrag.parent.querySelectorAll(selector)).filter((item) => item !== pointerDrag.placeholder);
      const last = siblings.at(-1);
      if (last) {
        const rect = last.getBoundingClientRect();
        if (event.clientY > rect.bottom - 12) {
          pointerDrag.parent.appendChild(pointerDrag.placeholder);
        }
      }
    };
    const finishPointerDrag = (event) => {
      if (!pointerDrag || pointerDrag.pointerId !== event.pointerId) return;
      cleanupPointerDrag();
    };
    handle.onpointerup = finishPointerDrag;
    handle.onpointercancel = finishPointerDrag;
    handle.onlostpointercapture = cleanupPointerDrag;
  });
}

function bindManagerBlockControls(editor) {
  editor.querySelector("[data-add-block]").onclick = () => {
    editor.querySelector("[data-blocks]").insertAdjacentHTML("beforeend", renderTextBlock());
    bindManagerBlockControls(editor);
  };
  editor.querySelector("[data-add-image]").onclick = () => {
    editor.querySelector("[data-blocks]").insertAdjacentHTML("beforeend", renderImageBlock("https://picsum.photos/id/1005/420/560"));
    bindManagerBlockControls(editor);
  };
  editor.querySelectorAll("[data-move-up]").forEach((button) => {
    button.onclick = () => {
      const block = button.closest("[data-text-block], [data-image-block]");
      if (block?.previousElementSibling && !block.previousElementSibling.matches("h3")) block.parentElement.insertBefore(block, block.previousElementSibling);
    };
  });
  editor.querySelectorAll("[data-move-down]").forEach((button) => {
    button.onclick = () => {
      const block = button.closest("[data-text-block], [data-image-block]");
      if (block?.nextElementSibling) block.parentElement.insertBefore(block.nextElementSibling, block);
    };
  });
  editor.querySelectorAll("[data-remove-block]").forEach((button) => {
    button.onclick = () => button.closest("[data-text-block], [data-image-block]")?.remove();
  });
  bindSortableBlocks(editor);
  editor.querySelectorAll("[name='articleImage']").forEach((input) => {
    input.oninput = () => {
      const image = input.closest("[data-image-block]")?.querySelector("img");
      if (image) image.src = input.value;
    };
  });
  const coverFile = editor.querySelector("[data-cover-file]");
  if (coverFile) {
    coverFile.onchange = () => {
      const file = coverFile.files?.[0];
      if (!isSupportedImage(file)) return;
      pendingCoverFile = file;
      readImageFile(file, (dataUrl) => {
        const coverInput = editor.querySelector("[data-cover-url]");
        const coverImage = editor.querySelector(".cover-preview-large img");
        if (coverInput) coverInput.value = dataUrl;
        if (coverImage) coverImage.src = dataUrl;
      });
    };
  }
  editor.querySelectorAll("[data-cover-filter]").forEach((button) => {
    button.onclick = () => {
      const filter = button.dataset.coverFilter;
      const input = editor.querySelector("[data-cover-filter-value]");
      const coverImage = editor.querySelector(".cover-preview-large img");
      if (input) input.value = filter;
      if (coverImage) coverImage.style.filter = filter;
      editor.querySelectorAll("[data-cover-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
    };
  });
}

function bindBioBlockControls(screen) {
  screen.querySelectorAll("[data-add-bio-block]").forEach((button) => {
    button.onclick = () => {
      const lang = button.dataset.addBioBlock;
      screen.querySelector(`[data-bio-blocks="${lang}"]`)?.insertAdjacentHTML("beforeend", renderBioTextBlock(lang));
      bindBioBlockControls(screen);
    };
  });
  screen.querySelectorAll("[data-move-up]").forEach((button) => {
    button.onclick = () => {
      const block = button.closest("[data-bio-text-block]");
      if (block?.previousElementSibling) block.parentElement.insertBefore(block, block.previousElementSibling);
    };
  });
  screen.querySelectorAll("[data-move-down]").forEach((button) => {
    button.onclick = () => {
      const block = button.closest("[data-bio-text-block]");
      if (block?.nextElementSibling) block.parentElement.insertBefore(block.nextElementSibling, block);
    };
  });
  screen.querySelectorAll("[data-remove-block]").forEach((button) => {
    button.onclick = () => button.closest("[data-bio-text-block]")?.remove();
  });
  bindSortableBlocks(screen, "[data-bio-text-block]");
  screen.querySelectorAll("[data-bio-image-file]").forEach((input) => {
    input.onchange = () => {
      const file = input.files?.[0];
      const lang = input.dataset.bioImageFile;
      if (!isSupportedImage(file) || !lang) return;
      pendingBioFiles[lang] = file;
      readImageFile(file, (dataUrl) => {
        const urlInput = screen.querySelector(`[name="${lang}-image"]`);
        const image = screen.querySelector(`[data-bio-preview="${lang}"] img`);
        if (urlInput) urlInput.value = dataUrl;
        if (image) image.src = dataUrl;
      });
    };
  });
  screen.querySelectorAll("[name$='-image']").forEach((input) => {
    input.oninput = () => {
      const lang = input.name.replace("-image", "");
      updateBioPreview(screen, lang);
    };
  });
  screen.querySelectorAll("[data-bio-image-control]").forEach((input) => {
    input.oninput = () => updateBioPreview(screen, input.dataset.bioImageControl);
  });
}

function isSupportedImage(file) {
  return Boolean(file && ["image/png", "image/jpeg"].includes(file.type));
}

function readImageFile(file, callback) {
  const reader = new FileReader();
  reader.onload = () => callback(String(reader.result || ""));
  reader.readAsDataURL(file);
}

function getBioPreviewState(screen, lang) {
  return {
    image: screen.querySelector(`[name="${lang}-image"]`)?.value.trim() || "",
    imagePositionX: Number(screen.querySelector(`[name="${lang}-image-position-x"]`)?.value || 50),
    imagePositionY: Number(screen.querySelector(`[name="${lang}-image-position-y"]`)?.value || 50),
    imageScale: Number(screen.querySelector(`[name="${lang}-image-scale"]`)?.value || 100),
  };
}

function updateBioPreview(screen, lang) {
  const preview = screen.querySelector(`[data-bio-preview="${lang}"]`);
  if (!preview) return;
  const bioState = getBioPreviewState(screen, lang);
  preview.innerHTML = bioState.image
    ? `<img src="${bioState.image}" alt="" loading="lazy" style="${bioImageInlineStyle(bioState)}" />`
    : `<span>foto</span>`;
}


function categoryLabel(id) {
  return t(id);
}

function escapeAttr(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}

function initCustomCursor() {
  if (!window.matchMedia("(pointer: fine)").matches) return;

  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  cursor.setAttribute("aria-hidden", "true");
  document.body.appendChild(cursor);

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  const move = () => {
    currentX += (targetX - currentX) * 0.22;
    currentY += (targetY - currentY) * 0.22;
    cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(move);
  };

  window.addEventListener("mousemove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    cursor.classList.add("is-visible");
  });

  window.addEventListener("mouseleave", () => cursor.classList.remove("is-visible"));
  window.addEventListener("mousedown", () => cursor.classList.add("is-pressed"));
  window.addEventListener("mouseup", () => cursor.classList.remove("is-pressed"));

  document.addEventListener("mouseover", (event) => {
    cursor.classList.toggle("is-action", Boolean(event.target.closest("a, button, input, textarea, select, [data-review]")));
  });

  move();
}

function renderManager(screen = "dashboard", options = {}) {
  state = { view: "manager", category: null, detail: null };
  managerState = {
    screen,
    category: options.category || managerState.category || "textos",
    reviewId: options.reviewId || managerState.reviewId || null,
  };
  showPanel("MANAGER");
  els.postList.classList.add("hidden");
  els.postView.classList.add("hidden");
  els.managerForm.classList.remove("hidden");
  els.managerForm.innerHTML = `
    <section class="manager-shell manager-app">
      <header class="manager-header manager-app-header">
        <div>
          <span class="manager-kicker">PANEL EDITORIAL</span>
          <h1>MANAGER</h1>
          <p>Elige una seccion, administra documentos y edita cada reseña por bloques.</p>
          <small class="manager-sync-state">${syncStatusLabel()}</small>
        </div>
        <div class="manager-header-actions">
          <button class="manager-nav-button" type="button" data-manager-dashboard>INICIO</button>
          <button class="manager-nav-button" type="button" data-manager-new>NUEVA</button>
          <button class="manager-nav-button" type="button" data-manager-bio>YO</button>
          <button class="text-button manager-shortcut" type="button" title="Atajo: pulsa L M F">LMF</button>
        </div>
      </header>
      <div class="manager-screen" id="managerScreen"></div>
    </section>
  `;
  els.managerForm.querySelector("[data-manager-dashboard]").addEventListener("click", () => renderManager("dashboard"));
  els.managerForm.querySelector("[data-manager-new]").addEventListener("click", () => renderManagerEditor(null, managerState.category || "textos"));
  els.managerForm.querySelector("[data-manager-bio]").addEventListener("click", () => renderManager("bio"));
  if (screen === "category") renderManagerCategory(managerState.category);
  else if (screen === "editor") renderManagerEditor(managerState.reviewId, managerState.category);
  else if (screen === "preview") renderManagerPreview(managerState.reviewId);
  else if (screen === "delete") renderManagerDeleteConfirm(managerState.reviewId, managerState.category, options.returnScreen || "dashboard");
  else if (screen === "bio") renderManagerBioEditor();
  else renderManagerDashboard();
  updateManagerNavState(screen);
}

function updateManagerNavState(screen) {
  els.managerForm.querySelector("[data-manager-dashboard]")?.classList.toggle("is-active", screen === "dashboard");
  els.managerForm.querySelector("[data-manager-new]")?.classList.toggle("is-active", screen === "editor" && !managerState.reviewId);
  els.managerForm.querySelector("[data-manager-bio]")?.classList.toggle("is-active", screen === "bio");
}

function getManagerScreen() {
  return document.querySelector("#managerScreen");
}

function renderManagerDashboard() {
  managerState = { screen: "dashboard", category: null, reviewId: null };
  const total = reviews.length;
  getManagerScreen().innerHTML = `
    <section class="manager-dashboard">
      <div class="manager-overview">
        <strong>${total}</strong>
        <span>reseñas publicadas</span>
      </div>
      <div class="manager-category-grid">
        ${categories.map(renderManagerCategoryCard).join("")}
      </div>
      <div class="manager-library-map">
        ${categories.map(renderManagerCategoryLane).join("")}
      </div>
    </section>
  `;
  getManagerScreen().querySelectorAll("[data-manager-category]").forEach((button) => {
    button.addEventListener("click", () => renderManager("category", { category: button.dataset.managerCategory }));
  });
  getManagerScreen().querySelectorAll("[data-dashboard-edit]").forEach((button) => {
    button.addEventListener("click", () => renderManagerEditor(button.dataset.dashboardEdit, button.dataset.category));
  });
  getManagerScreen().querySelectorAll("[data-dashboard-preview]").forEach((button) => {
    button.addEventListener("click", () => renderManager("preview", { reviewId: button.dataset.dashboardPreview, category: button.dataset.category }));
  });
  getManagerScreen().querySelectorAll("[data-dashboard-delete]").forEach((button) => {
    button.addEventListener("click", () => renderManager("delete", {
      reviewId: button.dataset.dashboardDelete,
      category: button.dataset.category,
      returnScreen: "dashboard",
    }));
  });
}

function renderManagerCategoryCard(category) {
  const items = sectionReviews(category.id);
  const latest = items[0];
  return `
    <button class="manager-category-card" type="button" data-manager-category="${category.id}">
      <span>${t(category.id)}</span>
      <strong>${String(items.length).padStart(2, "0")}</strong>
      <small>${latest ? `${latest.title} · ${latest.author}` : "sin documentos"}</small>
    </button>
  `;
}

function renderManagerCategoryLane(category) {
  const items = sectionReviews(category.id);
  return `
    <article class="manager-lane">
      <header>
        <button type="button" data-manager-category="${category.id}">${t(category.id)}</button>
        <span>${String(items.length).padStart(2, "0")}</span>
      </header>
      <div class="manager-lane-items">
        ${
          items
            .map(
              (item) => `
                <div class="manager-lane-item">
                  <div>
                    <strong>${item.title}</strong>
                    <small>${item.author} / ${item.score}</small>
                  </div>
                  <div>
                    <button type="button" data-dashboard-edit="${item.id}" data-category="${category.id}">editar</button>
                    <button type="button" data-dashboard-preview="${item.id}" data-category="${category.id}">preview</button>
                    <button type="button" data-dashboard-delete="${item.id}" data-category="${category.id}">eliminar</button>
                  </div>
                </div>
              `
            )
            .join("") || `<p>Sin documentos todavia.</p>`
        }
      </div>
    </article>
  `;
}

function renderManagerCategory(categoryId) {
  managerState = { screen: "category", category: categoryId, reviewId: null };
  const category = categories.find((item) => item.id === categoryId) || categories[0];
  const items = sectionReviews(category.id);
  const publicLimitNote = category.id === "escala"
    ? `<p class="manager-category-note">ESCALA se ordena automáticamente por nota de mayor a menor. En la web pública solo se muestran los 10 primeros; el resto queda guardado para edición.</p>`
    : "";
  const scaleSettings = currentScaleSettings();
  const scaleCalendarControls = category.id === "escala"
    ? `
      <section class="manager-scale-calendar">
        <div class="manager-scale-calendar-copy">
          <strong>SEMANA VISIBLE EN ESCALA</strong>
          <p>Selecciona una semana completa o define un rango exacto de fechas. El cliente final mostrará exactamente ese tramo al pie de ESCALA.</p>
        </div>
        <div class="manager-scale-calendar-grid">
          <label>
            modo
            <select data-scale-mode>
              <option value="week" ${scaleSettings.mode === "week" ? "selected" : ""}>semana completa</option>
              <option value="dates" ${scaleSettings.mode === "dates" ? "selected" : ""}>día a día</option>
            </select>
          </label>
          <label data-scale-week-wrap ${scaleSettings.mode === "dates" ? "hidden" : ""}>
            semana ISO
            <input type="week" value="${scaleSettings.week}" data-scale-week />
          </label>
          <label>
            desde
            <input type="date" value="${scaleSettings.startDate}" data-scale-start />
          </label>
          <label>
            hasta
            <input type="date" value="${scaleSettings.endDate}" data-scale-end />
          </label>
        </div>
        <div class="manager-scale-calendar-actions">
          <small data-scale-preview>Visible ahora: ${formatScaleRange(scaleSettings)}</small>
          <div class="manager-scale-calendar-buttons">
            <button class="text-button manager-chip-button" type="button" data-scale-current-week>usar semana del selector</button>
            <button class="submit-button" type="button" data-save-scale-range>guardar fechas</button>
          </div>
        </div>
      </section>
    `
    : "";
  const screen = getManagerScreen();
  screen.innerHTML = `
    <section class="manager-documents">
      <div class="manager-subheader">
        <button class="text-button" type="button" data-manager-back>← secciones</button>
        <div>
          <span>SECCION</span>
          <h2>${t(category.id)}</h2>
        </div>
        <button class="submit-button" type="button" data-manager-create>CREAR RESEÑA</button>
      </div>
      <div class="manager-document-toolbar">
        <input type="search" placeholder="Buscar en ${t(category.id)}" data-search />
        <span>${items.length} documentos</span>
      </div>
      ${publicLimitNote}
      ${scaleCalendarControls}
      <div class="manager-document-grid">
        ${items.map((item, index) => renderManagerDocumentCard(item, category.id === "escala" ? index : null)).join("") || `<p class="manager-empty">Todavia no hay reseñas en esta seccion.</p>`}
      </div>
    </section>
  `;
  screen.querySelector("[data-manager-back]").addEventListener("click", () => renderManager("dashboard"));
  screen.querySelector("[data-manager-create]").addEventListener("click", () => renderManagerEditor(null, category.id));
  screen.querySelector("[data-search]").addEventListener("input", filterManagerLibrary);
  screen.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => renderManagerEditor(button.dataset.edit, category.id));
  });
  screen.querySelectorAll("[data-preview]").forEach((button) => {
    button.addEventListener("click", () => renderManager("preview", { reviewId: button.dataset.preview, category: category.id }));
  });
  screen.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => renderManager("delete", {
      reviewId: button.dataset.delete,
      category: category.id,
      returnScreen: "category",
    }));
  });
  if (category.id === "escala") bindScaleCalendarControls(screen);
}

function bindScaleCalendarControls(screen) {
  const mode = screen.querySelector("[data-scale-mode]");
  const weekInput = screen.querySelector("[data-scale-week]");
  const startInput = screen.querySelector("[data-scale-start]");
  const endInput = screen.querySelector("[data-scale-end]");
  const weekWrap = screen.querySelector("[data-scale-week-wrap]");
  const preview = screen.querySelector("[data-scale-preview]");
  const syncPreview = () => {
    const settings = normalizeScaleSettings({
      mode: mode?.value,
      week: weekInput?.value,
      startDate: startInput?.value,
      endDate: endInput?.value,
    });
    if (weekWrap) weekWrap.hidden = settings.mode === "dates";
    if (settings.mode === "week" && weekInput?.value) {
      const range = weekRangeFromValue(weekInput.value);
      if (range) {
        startInput.value = range.startDate;
        endInput.value = range.endDate;
      }
    }
    if (preview) preview.textContent = `Visible ahora: ${formatScaleRange(settings)}`;
  };
  [mode, weekInput, startInput, endInput].forEach((field) => field?.addEventListener("input", syncPreview));
  screen.querySelector("[data-scale-current-week]")?.addEventListener("click", () => {
    if (mode) mode.value = "week";
    syncPreview();
  });
  screen.querySelector("[data-save-scale-range]")?.addEventListener("click", async () => {
    const nextSettings = normalizeScaleSettings({
      mode: mode?.value,
      week: weekInput?.value,
      startDate: startInput?.value,
      endDate: endInput?.value,
    });
    saveScaleSettings(nextSettings);
    try {
      await saveScaleSettingsToSupabase(nextSettings);
      supabaseStatus = getSupabaseClient() ? "online" : "local";
    } catch (error) {
      console.error(error);
      supabaseStatus = "error";
      alert("Las fechas de ESCALA se guardaron localmente, pero no se pudieron sincronizar con Supabase.");
    }
    renderManager("category", { category: "escala" });
  });
  syncPreview();
}

function renderManagerDocumentCard(item, rank = null) {
  const scaleStatus = rank === null ? "" : `<span class="manager-scale-rank">${String(rank + 1).padStart(2, "0")}${rank < 10 ? " visible" : " archivo"}</span>`;
  return `
    <article class="manager-document-card" data-search-item="${`${item.title} ${item.author} ${item.summary}`.toLowerCase()}">
      ${scaleStatus}
      ${renderCover(item, "mini")}
      <div class="manager-document-copy">
        <strong>${item.title}</strong>
        <span>${item.author}</span>
        <small>${categoryLabel(item.section)} · ${item.score} · ${item.body?.length || 0} bloques</small>
      </div>
      <div class="manager-card-actions">
        <button type="button" data-edit="${item.id}">editar</button>
        <button type="button" data-preview="${item.id}">preview</button>
        <button type="button" data-delete="${item.id}">eliminar</button>
      </div>
    </article>
  `;
}

function renderManagerEditor(reviewId = null, fallbackCategory = "textos") {
  const item = reviews.find((review) => review.id === reviewId) || {};
  const categoryId = item.section || fallbackCategory || "textos";
  managerState = { screen: "editor", category: categoryId, reviewId: item.id || null };
  const editorBlocks = buildEditorBlocks(item);
  const value = {
    section: categoryId,
    author: item.author || "",
    title: item.title || "",
    summary: item.summary || "",
    score: item.score || "8.0",
    publisher: item.publisher || "",
    year: item.year || "2026",
    translator: item.translator || "-",
    pages: item.pages || "",
    image: item.image || images[0] || "https://picsum.photos/id/1005/420/560",
    tone: item.tone || "#efe7d8",
    slot: item.slot || "",
  };
  const screen = getManagerScreen();
  screen.innerHTML = `
    <input type="hidden" name="id" value="${item.id || ""}" />
    <section class="manager-editor-shell">
      <div class="manager-subheader">
        <button class="text-button" type="button" data-manager-back>← documentos</button>
        <div>
          <span>${item.id ? "EDITANDO" : "NUEVA RESEÑA"}</span>
          <h2>${value.title || "Sin titulo"}</h2>
        </div>
        <div class="manager-subheader-actions">
          <button class="text-button" type="button" data-preview>PREVIEW</button>
          <button class="submit-button" type="button" data-save>GUARDAR</button>
        </div>
      </div>
      <section class="manager-compose">
        <div class="compose-main">
          <input class="compose-title" name="title" value="${escapeAttr(value.title)}" required placeholder="Titulo de la reseña" />
          <input class="compose-author" name="author" value="${escapeAttr(value.author)}" required placeholder="Autor / autora" />
          <textarea class="compose-summary" name="summary" rows="3" placeholder="Entradilla para la lista">${value.summary}</textarea>
          <div class="compose-toolbar">
            <button type="button" data-add-block>+ BLOQUE TEXTO</button>
            <button type="button" data-add-image>+ FOTO</button>
          </div>
          <div class="block-stack article-block-stack" data-blocks>
            ${editorBlocks.map((block) => renderEditorBlock(block)).join("")}
          </div>
        </div>
        <aside class="compose-side">
          <div class="cover-preview-large">${renderCover({ ...value, publisher: value.publisher || "editorial" }, "small")}</div>
          <label>seccion<select name="section" data-section-select>${categories.map((category) => `<option value="${category.id}" ${category.id === value.section ? "selected" : ""}>${t(category.id)}</option>`).join("")}</select><small class="field-note">Puedes mover esta reseña a cualquier categoria antes de guardar.</small></label>
          <div class="two-cols">
            <label>nota<input name="score" value="${value.score}" /></label>
            <label>año<input name="year" value="${value.year}" /></label>
          </div>
          <label>editorial<input name="publisher" value="${escapeAttr(value.publisher)}" /></label>
          <label>traduccion<input name="translator" value="${escapeAttr(value.translator)}" /></label>
          <label>paginas<input name="pages" value="${value.pages}" /></label>
          <label>portada principal<input name="image" value="${value.image}" data-cover-url /></label>
          <label class="file-picker-label">subir portada PNG/JPG<input type="file" accept="image/png,image/jpeg" data-cover-file /></label>
          <input type="hidden" name="tone" value="${value.tone}" />
          <input type="hidden" name="coverFilter" value="${escapeAttr(value.coverFilter)}" data-cover-filter-value />
          <div class="cover-filter-control">
            <span>filtro portada</span>
            <div class="cover-filter-grid" aria-label="Filtros para portada">
              ${coverFilterPresets.map((filter) => `<button class="${filter.value === value.coverFilter ? "is-active" : ""}" type="button" data-cover-filter="${escapeAttr(filter.value)}">${filter.label}</button>`).join("")}
            </div>
          </div>
          <label>hoy / mañana<select name="slot">
            <option value="" ${!value.slot ? "selected" : ""}>sin destacar</option>
            <option value="hoy" ${value.slot === "hoy" ? "selected" : ""}>hoy</option>
            <option value="mañana" ${value.slot === "mañana" ? "selected" : ""}>mañana</option>
          </select></label>
          <div class="manager-actions">
            <button class="danger-button" type="button" data-delete ${item.id ? "" : "disabled"}>ELIMINAR</button>
          </div>
        </aside>
      </section>
    </section>
  `;
  screen.querySelector("[data-manager-back]").addEventListener("click", () => renderManager("category", { category: value.section }));
  screen.querySelector("[data-save]").addEventListener("click", () => saveEditedReview());
  screen.querySelector("[data-delete]").addEventListener("click", () => {
    renderManager("delete", {
      reviewId: item.id,
      category: value.section,
      returnScreen: "editor",
    });
  });
  screen.querySelector("[data-preview]").addEventListener("click", async () => {
    const id = await saveEditedReview(null, false);
    if (!id) return;
    renderManager("preview", { reviewId: id, category: value.section });
  });
  bindManagerBlockControls(screen);
  updateManagerNavState("editor");
}

function renderManagerPreview(reviewId) {
  const item = reviews.find((review) => review.id === reviewId);
  if (!item) return renderManager("dashboard");
  managerState = { screen: "preview", category: item.section, reviewId: item.id };
  const screen = getManagerScreen();
  screen.innerHTML = `
    <section class="manager-preview-screen">
      <div class="manager-subheader">
        <button class="text-button" type="button" data-manager-back>← editor</button>
        <div>
          <span>PREVIEW</span>
          <h2>${item.title}</h2>
        </div>
        <button class="submit-button" type="button" data-manager-docs>DOCUMENTOS</button>
      </div>
      <article class="manager-original-preview">
        <header class="detail-hero">
          ${renderCover(item, "large")}
          <div class="detail-title">
            <h1>${item.title}</h1>
            <h2>${item.author}</h2>
            <span class="title-line"></span>
            <strong class="detail-score">${item.score}</strong>
          </div>
        </header>
        <dl class="book-meta">
          <div><dt>EDITORIAL:</dt><dd>${item.publisher}</dd></div>
          <div><dt>AÑO:</dt><dd>${item.year}</dd></div>
          <div><dt>TRADUCCION:</dt><dd>${item.translator}</dd></div>
          <div><dt>PAGINAS:</dt><dd>${item.pages}</dd></div>
        </dl>
        <div class="detail-body">${renderArticleBlocks(item)}</div>
      </article>
    </section>
  `;
  screen.querySelector("[data-manager-back]").addEventListener("click", () => renderManager("editor", { reviewId: item.id, category: item.section }));
  screen.querySelector("[data-manager-docs]").addEventListener("click", () => renderManager("category", { category: item.section }));
}

function renderManagerDeleteConfirm(reviewId, fallbackCategory = "textos", returnScreen = "dashboard") {
  const item = reviews.find((review) => review.id === reviewId);
  if (!item) return renderManager(returnScreen === "category" ? "category" : "dashboard", { category: fallbackCategory });
  managerState = { screen: "delete", category: item.section || fallbackCategory, reviewId: item.id };
  const screen = getManagerScreen();
  screen.innerHTML = `
    <section class="manager-delete-screen">
      <div class="manager-subheader">
        <button class="text-button" type="button" data-cancel-delete>← cancelar</button>
        <div>
          <span>CONFIRMAR ELIMINACION</span>
          <h2>${item.title}</h2>
        </div>
        <button class="danger-button" type="button" data-confirm-delete disabled>ELIMINAR</button>
      </div>
      <div class="delete-confirm-card">
        ${renderCover(item, "mini")}
        <div>
          <p>Esta accion elimina la reseña del panel editorial y de la web visible. Para confirmarlo, escribe el titulo exacto.</p>
          <strong>${item.title}</strong>
          <label>
            titulo exacto
            <input type="text" data-delete-title placeholder="${escapeAttr(item.title)}" autocomplete="off" />
          </label>
          <small data-delete-warning>El boton se activara cuando el titulo coincida.</small>
        </div>
      </div>
    </section>
  `;
  const input = screen.querySelector("[data-delete-title]");
  const confirm = screen.querySelector("[data-confirm-delete]");
  const cancel = screen.querySelector("[data-cancel-delete]");
  const warning = screen.querySelector("[data-delete-warning]");
  const goBackToReturn = () => {
    if (returnScreen === "editor") renderManager("editor", { reviewId: item.id, category: item.section });
    else if (returnScreen === "category") renderManager("category", { category: item.section });
    else renderManager("dashboard");
  };
  cancel.addEventListener("click", goBackToReturn);
  input.addEventListener("input", () => {
    const valid = input.value.trim() === item.title;
    confirm.disabled = !valid;
    warning.textContent = valid ? "Confirmacion correcta. Puedes eliminar la reseña." : "El boton se activara cuando el titulo coincida.";
  });
  confirm.addEventListener("click", async () => {
    if (input.value.trim() !== item.title) return;
    await deleteReview(item.id, false);
    if (returnScreen === "category" || returnScreen === "editor") renderManager("category", { category: item.section });
    else renderManager("dashboard");
  });
  input.focus();
}

function renderManagerBioEditor() {
  managerState = { screen: "bio", category: null, reviewId: null };
  const bio = loadBioContent();
  pendingBioFiles = { es: null, en: null };
  const screen = getManagerScreen();
  screen.innerHTML = `
    <section class="manager-bio-editor">
      <div class="manager-subheader">
        <button class="text-button" type="button" data-manager-back>← inicio</button>
        <div>
          <span>AUTOBIOGRAFIA</span>
          <h2>YO</h2>
        </div>
        <button class="submit-button" type="button" data-save-bio>GUARDAR</button>
      </div>
      <div class="bio-editor-grid">
        ${["es", "en"].map((lang) => `
          <section class="bio-editor-panel">
            <h3>${lang === "es" ? "ESPAÑOL" : "INGLÉS"}</h3>
            <div class="bio-image-editor">
              <div class="bio-image-preview" data-bio-preview="${lang}">
                ${bio[lang].image ? `<img src="${bio[lang].image}" alt="" loading="lazy" style="${bioImageInlineStyle(bio[lang])}" />` : `<span>foto</span>`}
              </div>
              <div class="bio-image-fields">
                <label>imagen cuadrada<input name="${lang}-image" value="${escapeAttr(bio[lang].image)}" placeholder="URL de imagen" /></label>
                <label class="file-picker-label">subir imagen PNG/JPG<input type="file" accept="image/png,image/jpeg" data-bio-image-file="${lang}" /></label>
                <div class="bio-frame-controls">
                  <label>encuadre horizontal<input type="range" min="0" max="100" step="1" name="${lang}-image-position-x" value="${bio[lang].imagePositionX}" data-bio-image-control="${lang}" /></label>
                  <label>encuadre vertical<input type="range" min="0" max="100" step="1" name="${lang}-image-position-y" value="${bio[lang].imagePositionY}" data-bio-image-control="${lang}" /></label>
                  <label>zoom dentro del marco<input type="range" min="100" max="170" step="1" name="${lang}-image-scale" value="${bio[lang].imageScale}" data-bio-image-control="${lang}" /></label>
                </div>
              </div>
            </div>
            <label>entradilla<textarea name="${lang}-lead" rows="5">${bio[lang].lead}</textarea></label>
            <div class="bio-block-stack">
              <div class="bio-block-stack-header">
                <strong>bloques</strong>
                <button type="button" data-add-bio-block="${lang}">+ bloque</button>
              </div>
              <div class="block-stack" data-bio-blocks="${lang}">
                ${bio[lang].blocks.map((block) => renderBioTextBlock(lang, block)).join("")}
              </div>
            </div>
            <label>frase final<textarea name="${lang}-quote" rows="3">${bio[lang].quote}</textarea></label>
          </section>
        `).join("")}
      </div>
    </section>
  `;
  screen.querySelector("[data-manager-back]").addEventListener("click", () => renderManager("dashboard"));
  screen.querySelector("[data-save-bio]").addEventListener("click", async () => {
    const nextBio = { es: {}, en: {} };
    for (const lang of ["es", "en"]) {
      nextBio[lang] = {
        lead: screen.querySelector(`[name="${lang}-lead"]`).value.trim(),
        image: screen.querySelector(`[name="${lang}-image"]`).value.trim(),
        imagePositionX: Number(screen.querySelector(`[name="${lang}-image-position-x"]`)?.value || 50),
        imagePositionY: Number(screen.querySelector(`[name="${lang}-image-position-y"]`)?.value || 50),
        imageScale: Number(screen.querySelector(`[name="${lang}-image-scale"]`)?.value || 100),
        blocks: Array.from(screen.querySelectorAll(`[name="${lang}-bio-block"]`))
          .map((field) => field.value.trim())
          .filter(Boolean),
        quote: screen.querySelector(`[name="${lang}-quote"]`).value.trim(),
      };
      if (!nextBio[lang].blocks.length) nextBio[lang].blocks = [...defaultBioContent[lang].blocks];
      if (pendingBioFiles[lang] && getSupabaseClient()) {
        try {
          nextBio[lang].image = await uploadCoverToSupabase(pendingBioFiles[lang], `bio-${lang}`);
        } catch (error) {
          console.error(error);
          alert(`No se pudo subir la imagen de ${lang.toUpperCase()} a Supabase. Se conservara la vista local.`);
        }
      }
    }
    saveBioContent(nextBio);
    try {
      await saveBioToSupabase(nextBio);
      supabaseStatus = getSupabaseClient() ? "online" : "local";
    } catch (error) {
      console.error(error);
      supabaseStatus = "error";
      alert("La autobiografia se guardo localmente, pero no se pudo sincronizar con Supabase.");
    }
    renderManager("bio");
  });
  bindBioBlockControls(screen);
}


async function saveEditedReview(_editor, rerender = true) {
  const titleField = els.managerForm.querySelector('[name="title"]');
  const authorField = els.managerForm.querySelector('[name="author"]');
  [titleField, authorField].forEach((field) => field?.setCustomValidity(""));
  if (!titleField?.value.trim()) {
    titleField?.setCustomValidity("Escribe un título para la reseña.");
    titleField?.reportValidity();
    titleField?.focus();
    return null;
  }
  if (!authorField?.value.trim()) {
    authorField?.setCustomValidity("Escribe el autor o autora.");
    authorField?.reportValidity();
    authorField?.focus();
    return null;
  }
  if (!els.managerForm.reportValidity()) return null;
  const formData = new FormData(els.managerForm);
  const next = Object.fromEntries(formData.entries());
  next.id = next.id || `${next.section}-${slug(next.author)}-${slug(next.title)}-${Date.now()}`;
  next.slot = next.section === "hoy-manana" ? next.slot || "hoy" : next.slot || "";
  next.body = [];
  next.images = [];
  els.managerForm.querySelectorAll("[data-block-type]").forEach((block) => {
    if (block.dataset.blockType === "text") {
      const text = block.querySelector("[name='bodyBlock']")?.value.trim();
      if (text) next.body.push(text);
      return;
    }
    if (block.dataset.blockType === "image") {
      const image = block.querySelector("[name='articleImage']")?.value.trim();
      if (!image) return;
      const imageIndex = next.images.push(image) - 1;
      next.body.push(`[[image:${imageIndex}]]`);
    }
  });
  if (pendingCoverFile && getSupabaseClient()) {
    try {
      next.image = await uploadCoverToSupabase(pendingCoverFile, next.id);
      pendingCoverFile = null;
    } catch (error) {
      console.error(error);
      alert("No se pudo subir la portada a Supabase. Se guardara la vista previa local.");
    }
  }
  if (!next.body.some((entry) => !/^\[\[image:(\d+)\]\]$/.test(String(entry).trim()))) next.body.unshift("Nueva reseña pendiente de escritura.");
  const index = reviews.findIndex((item) => item.id === next.id);
  if (index >= 0) reviews[index] = next;
  else reviews.unshift(next);
  persist();
  try {
    await persistReviewToSupabase(next);
    supabaseStatus = getSupabaseClient() ? "online" : "local";
  } catch (error) {
    console.error(error);
    supabaseStatus = "error";
    alert("La reseña se guardo localmente, pero no se pudo sincronizar con Supabase.");
  }
  if (rerender) renderManager("editor", { reviewId: next.id, category: next.section });
  return next.id;
}

async function deleteReview(id, rerender = true) {
  if (!id) return;
  reviews = reviews.filter((item) => item.id !== id);
  persist();
  try {
    await deleteReviewFromSupabase(id);
    supabaseStatus = getSupabaseClient() ? "online" : "local";
  } catch (error) {
    console.error(error);
    supabaseStatus = "error";
    alert("La reseña se elimino localmente, pero no se pudo eliminar en Supabase.");
  }
  if (rerender) renderManager("dashboard");
}
