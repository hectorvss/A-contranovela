const STORAGE_KEY = "acontranovela.reviews.v1";

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
    previous: "← previous",
    index: "index",
    next: "next →",
    languageButton: "ES",
    socialThere: "there",
  },
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

renderHome();
initCustomCursor();

els.homeButton.addEventListener("click", renderBio);
els.noButton.addEventListener("click", () => renderCategory("no"));
els.backButton.addEventListener("click", goBack);
els.languageToggle.addEventListener("click", toggleLanguage);
els.footerManager.addEventListener("click", renderManager);
window.addEventListener("keydown", (event) => {
  if (event.altKey && event.key.toLowerCase() === "m") {
    event.preventDefault();
    renderManager();
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

function t(key) {
  return categoryLabels[currentLanguage][key] || categoryLabels.es[key] || key;
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
  document.querySelector('.footer-links a[href="#"]').textContent = t("socialThere");
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

function renderBio() {
  state = { view: "bio", category: null, detail: null };
  showPanel(t("yo"));
  const bio = currentLanguage === "es"
    ? {
        lead: "Este proyecto nace de una mania privada: leer como quien escucha una habitacion vacia. No busca ordenar el canon, sino registrar una temperatura. Lo que importa no es solo si un libro funciona, sino que tipo de ruido deja en la cabeza.",
        one: "El manager de <strong>a contranovela</strong> escribe desde una idea sencilla: la critica no deberia sonar como una sentencia, sino como una forma de atencion. Cada texto intenta mirar el libro de cerca, sin convertirlo en mercancia de recomendacion rapida ni en monumento academico.",
        two: "Aqui conviven reseñas largas, apuntes veloces, escalas semanales, entusiasmos provisionales y negativas razonadas. Hay libros que se aman, libros que se discuten y libros que se dejan caer con cuidado sobre la mesa para escuchar como suenan.",
        quote: "Leer no para tener razon, sino para afinar la desconfianza.",
      }
    : {
        lead: "This project begins with a private obsession: reading as if listening to an empty room. It does not try to organize the canon, but to register a temperature.",
        one: "The manager of <strong>a contranovela</strong> writes from a simple idea: criticism should not sound like a verdict, but like a form of attention.",
        two: "Long reviews, quick notes, weekly scales, provisional enthusiasms and reasoned refusals coexist here. Some books are loved, some are argued with, and some are placed carefully on the table to hear how they sound.",
        quote: "To read not in order to be right, but to sharpen distrust.",
      };
  els.postList.innerHTML = `
    <section class="bio-page">
      <h1>${t("yo")}</h1>
      <p class="bio-lead">${bio.lead}</p>
      <div class="bio-grid">
        <p>${bio.one}</p>
        <p>${bio.two}</p>
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
  const items = reviews.filter((item) => item.section === "escala").map(displayReview);
  els.postList.innerHTML = `
    <section class="category-page scale-page">
      <h1>${t(category.id)}</h1>
      <div class="scale-list">
        ${items.map((item, index) => renderRankRow(item, index)).join("")}
      </div>
      <div class="week-mark"><span>SEMANA</span><strong>07 - 14</strong></div>
    </section>
  `;
  bindRows();
}

function renderRanked(category, className) {
  const items = reviews.filter((item) => item.section === category.id).map(displayReview);
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
  return `
    <span class="book-cover ${size}" style="--cover-tone: ${item.tone}">
      <span class="cover-author">${item.author}</span>
      <strong>${item.title}</strong>
      <img src="${item.image}" alt="" loading="lazy" />
      <small>${item.publisher}</small>
    </span>
  `;
}

function renderArticleBlocks(item) {
  const images = Array.isArray(item.images) && item.images.length ? item.images : [item.image];
  return item.body
    .map((paragraph, index) => {
      const image = images[index - 1];
      const media = image && index > 0 && index % 2 === 0 ? `<figure class="inline-photo"><img src="${image}" alt="" loading="lazy" /></figure>` : "";
      return `${media}<p>${paragraph}</p>`;
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
  const sameSection = reviews.filter((item) => item.section === current.section);
  const index = sameSection.findIndex((item) => item.id === state.detail);
  const next = sameSection[(index + direction + sameSection.length) % sameSection.length];
  renderDetail(next.id);
}

function goBack() {
  if (state.view === "detail") return renderCategory(state.category);
  renderHome();
}

function renderManager() {
  state = { view: "manager", category: null, detail: null };
  showPanel("MANAGER");
  els.postList.classList.add("hidden");
  els.postView.classList.add("hidden");
  els.managerForm.classList.remove("hidden");
  els.managerForm.innerHTML = `
    <section class="manager-shell manager-pro">
      <header class="manager-header">
        <div>
          <span class="manager-kicker">PANEL EDITORIAL</span>
          <h1>MANAGER</h1>
          <p>Escribe, ordena fotos, modifica metadatos y publica reseñas sin tocar codigo.</p>
        </div>
        <div class="manager-header-actions">
          <button class="submit-button" type="button" data-action="new">NUEVA RESEÑA</button>
          <button class="text-button manager-shortcut" type="button" title="Atajo: Alt + M">ALT + M</button>
        </div>
      </header>
      <div class="manager-grid">
        <aside class="manager-library">
          <div class="manager-search">
            <input type="search" placeholder="Buscar documento" data-search />
          </div>
          <div class="manager-items">
            ${reviews.map(renderManagerLibraryItem).join("")}
          </div>
        </aside>
        <div class="manager-editor" id="managerEditor"></div>
      </div>
    </section>
  `;
  els.managerForm.querySelector('[data-action="new"]').addEventListener("click", () => editReview());
  els.managerForm.querySelector("[data-search]").addEventListener("input", filterManagerLibrary);
  els.managerForm.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => editReview(reviews.find((item) => item.id === button.dataset.edit)));
  });
  editReview(reviews[0]);
}

function renderManagerLibraryItem(item) {
  return `
    <button type="button" data-edit="${item.id}" data-search-item="${`${item.title} ${item.author} ${categoryLabel(item.section)}`.toLowerCase()}">
      <strong>${item.title}</strong>
      <span>${item.author}</span>
      <small>${categoryLabel(item.section)} · ${item.score}</small>
    </button>
  `;
}

function filterManagerLibrary(event) {
  const query = event.target.value.trim().toLowerCase();
  els.managerForm.querySelectorAll("[data-search-item]").forEach((button) => {
    button.hidden = query && !button.dataset.searchItem.includes(query);
  });
}

function editReview(item = {}) {
  const editor = document.querySelector("#managerEditor");
  const bodyBlocks = item.body && item.body.length ? item.body : [""];
  const images = Array.isArray(item.images) && item.images.length ? item.images : [item.image || "https://picsum.photos/id/1005/420/560"];
  const value = {
    section: item.section || "textos",
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
  editor.innerHTML = `
    <input type="hidden" name="id" value="${item.id || ""}" />
    <section class="manager-compose">
      <div class="compose-main">
        <input class="compose-title" name="title" value="${escapeAttr(value.title)}" required placeholder="Titulo de la reseña" />
        <input class="compose-author" name="author" value="${escapeAttr(value.author)}" required placeholder="Autor / autora" />
        <textarea class="compose-summary" name="summary" rows="3" placeholder="Entradilla para la lista">${value.summary}</textarea>
        <div class="compose-toolbar">
          <button type="button" data-add-block>+ BLOQUE TEXTO</button>
          <button type="button" data-add-image>+ FOTO</button>
        </div>
        <div class="block-stack" data-blocks>
          ${bodyBlocks.map((paragraph) => renderTextBlock(paragraph)).join("")}
        </div>
        <div class="image-stack" data-images>
          <h3>FOTOS DEL ARTICULO</h3>
          ${images.map((image) => renderImageBlock(image)).join("")}
        </div>
      </div>
      <aside class="compose-side">
        <div class="cover-preview-large">${renderCover({ ...value, publisher: value.publisher || "editorial" }, "small")}</div>
        <label>seccion<select name="section">${categories.map((category) => `<option value="${category.id}" ${category.id === value.section ? "selected" : ""}>${category.label}</option>`).join("")}</select></label>
        <div class="two-cols">
          <label>nota<input name="score" value="${value.score}" /></label>
          <label>año<input name="year" value="${value.year}" /></label>
        </div>
        <label>editorial<input name="publisher" value="${escapeAttr(value.publisher)}" /></label>
        <label>traduccion<input name="translator" value="${escapeAttr(value.translator)}" /></label>
        <label>paginas<input name="pages" value="${value.pages}" /></label>
        <label>portada principal<input name="image" value="${value.image}" /></label>
        <label>color cubierta<input name="tone" value="${value.tone}" /></label>
        <label>hoy / mañana<select name="slot">
          <option value="" ${!value.slot ? "selected" : ""}>sin destacar</option>
          <option value="hoy" ${value.slot === "hoy" ? "selected" : ""}>hoy</option>
          <option value="mañana" ${value.slot === "mañana" ? "selected" : ""}>mañana</option>
        </select></label>
        <div class="manager-actions">
          <button class="submit-button" type="button" data-save>GUARDAR</button>
          <button class="text-button" type="button" data-preview>PREVISUALIZAR</button>
          <button class="danger-button" type="button" data-delete ${item.id ? "" : "disabled"}>ELIMINAR</button>
        </div>
      </aside>
    </section>
  `;
  editor.querySelector("[data-save]").addEventListener("click", () => saveEditedReview());
  editor.querySelector("[data-delete]").addEventListener("click", () => deleteReview(item.id));
  editor.querySelector("[data-preview]").addEventListener("click", () => {
    const id = saveEditedReview(null, false);
    renderDetail(id);
  });
  bindManagerBlockControls(editor);
}

function renderTextBlock(value = "") {
  return `
    <section class="content-block" data-text-block>
      <div class="block-handle">TEXTO</div>
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
    <section class="image-block" data-image-block>
      <img src="${value}" alt="" loading="lazy" />
      <input name="articleImage" value="${value}" placeholder="URL de imagen" />
      <div class="block-actions">
        <button type="button" data-move-up>↑</button>
        <button type="button" data-move-down>↓</button>
        <button type="button" data-remove-block>eliminar</button>
      </div>
    </section>
  `;
}

function bindManagerBlockControls(editor) {
  editor.querySelector("[data-add-block]").addEventListener("click", () => {
    editor.querySelector("[data-blocks]").insertAdjacentHTML("beforeend", renderTextBlock());
    bindManagerBlockControls(editor);
  }, { once: true });
  editor.querySelector("[data-add-image]").addEventListener("click", () => {
    editor.querySelector("[data-images]").insertAdjacentHTML("beforeend", renderImageBlock("https://picsum.photos/id/1005/420/560"));
    bindManagerBlockControls(editor);
  }, { once: true });
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
}

function saveEditedReview(_editor, rerender = true) {
  const formData = new FormData(els.managerForm);
  const next = Object.fromEntries(formData.entries());
  next.id = next.id || `${next.section}-${slug(next.author)}-${slug(next.title)}-${Date.now()}`;
  next.slot = next.section === "hoy-manana" ? next.slot || "hoy" : next.slot || "";
  next.body = formData.getAll("bodyBlock").map((paragraph) => paragraph.trim()).filter(Boolean);
  next.images = formData.getAll("articleImage").map((image) => image.trim()).filter(Boolean);
  if (!next.body.length) next.body = ["Nueva reseña pendiente de escritura."];
  const index = reviews.findIndex((item) => item.id === next.id);
  if (index >= 0) reviews[index] = next;
  else reviews.unshift(next);
  persist();
  if (rerender) renderManager();
  return next.id;
}

function deleteReview(id) {
  if (!id) return;
  reviews = reviews.filter((item) => item.id !== id);
  persist();
  renderManager();
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
