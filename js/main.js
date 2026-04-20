/* ============================================
   Navya Mishra — Academic Portfolio JS
   ============================================ */

// ---------- Paper Data ----------
const PAPERS = [
  {
    id: "cnt-mea",
    title: "Carbon Nanotube Microelectrode Arrays Enable Scalable and Accessible Electrophysiological Recordings of Cerebral Organoids",
    venue: "npj Biosensing",
    year: 2026,
    date: "2026",
    category: "neural",
    url: "https://www.nature.com/articles/s44328-026-00088-9",
    image: null,
    abstract: "Presents a scalable carbon nanotube-based 3D microelectrode array (MEA) platform enabling standardized, long-term electrophysiological recording in human cerebral organoids. Demonstrates disease-specific neural phenotypes — including significantly reduced spike amplitudes — in Angelman syndrome iPSC-derived organoids versus healthy controls (p = 0.0261) across 70+ samples, with a fabrication process 15× cheaper than noble metal alternatives.",
    colors: ["#006D77", "#0A9BA9", "#83C5BE"],
  },
  {
    id: "wound-care",
    title: "Water-Powered, Electronics-Free Dressings that Electrically Stimulate Wounds for Rapid Wound Closure",
    venue: "Science Advances",
    year: 2024,
    date: "2024",
    category: "bioelectronics",
    url: "https://www.science.org/doi/full/10.1126/sciadv.ado7538",
    image: null,
    abstract: "Introduces water-activated, self-powered bioelectronic wound dressings that generate therapeutic electrical stimulation without batteries or external electronics. The device leverages galvanic cell chemistry triggered by wound exudate to deliver sustained electrical fields, demonstrating significantly accelerated wound closure rates in clinically relevant models — offering a practical, low-cost path toward electroceutical wound care.",
    colors: ["#9B2335", "#C0392B", "#E74C3C"],
  },
  {
    id: "sweat-patch",
    title: "A Soft Wearable Microfluidic Patch with Finger-Actuated Pumps and Valves for On-Demand, Longitudinal, and Multianalyte Sweat Sensing",
    venue: "ACS Sensors",
    year: 2022,
    date: "2022",
    category: "wearable",
    url: "https://pubs.acs.org/doi/abs/10.1021/acssensors.2c01669",
    image: null,
    abstract: "Develops a soft, skin-conformable microfluidic patch that uses finger pressure to actuate on-chip pumps and valves for sequential collection and analysis of sweat samples. The battery-free design enables longitudinal, multi-analyte electrochemical sensing without contamination between samples, demonstrating continuous monitoring of metabolites and electrolytes relevant to health and athletic performance.",
    colors: ["#1A5276", "#2471A3", "#5DADE2"],
  },
];

// ---------- SVG Diagram Generators ----------
function generatePaperSVG(paper, width = 400, height = 200) {
  const [c1, c2, c3] = paper.colors;
  const seed = hashString(paper.id);

  const patterns = {
    neural: generateNeuralDiagram,
    wearable: generateWearableDiagram,
    bioelectronics: generateBioelectronicsDiagram,
  };

  const generator = patterns[paper.category] || generateNeuralDiagram;
  const inner = generator(seed, c1, c2, c3, width, height);

  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg-${paper.id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${c1};stop-opacity:0.07"/>
        <stop offset="100%" style="stop-color:${c2};stop-opacity:0.14"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#bg-${paper.id})"/>
    ${inner}
  </svg>`;
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Neural MEA: electrode grid + spike waveforms
function generateNeuralDiagram(seed, c1, c2, c3, w, h) {
  const rng = seededRandom(seed);
  let svg = '';

  // Electrode grid (4×4)
  const cols = 4, rows = 4;
  const gridX = w * 0.08, gridY = h * 0.12;
  const spacingX = (w * 0.38) / (cols - 1);
  const spacingY = (h * 0.76) / (rows - 1);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const ex = gridX + c * spacingX;
      const ey = gridY + r * spacingY;
      const active = rng() > 0.3;
      svg += `<circle cx="${ex}" cy="${ey}" r="7" fill="${active ? c1 : c2}"
                opacity="${active ? 0.6 : 0.2}" stroke="${c1}" stroke-width="1" stroke-opacity="0.4"/>`;
    }
  }

  // Grid border
  svg += `<rect x="${gridX - 14}" y="${gridY - 14}"
            width="${(cols - 1) * spacingX + 28}" height="${(rows - 1) * spacingY + 28}"
            rx="6" fill="none" stroke="${c1}" stroke-width="1.2" stroke-opacity="0.25"/>`;

  // Spike waveforms (right side)
  const waveStartX = w * 0.52;
  const waveY = [h * 0.22, h * 0.47, h * 0.72];
  waveY.forEach((wy, i) => {
    const amp = 18 + rng() * 14;
    const x0 = waveStartX + rng() * 20;
    svg += `<path d="M ${x0} ${wy} L ${x0 + 12} ${wy} L ${x0 + 18} ${wy - amp} L ${x0 + 24} ${wy + amp * 0.6} L ${x0 + 30} ${wy} L ${x0 + (w * 0.42)},${wy}"
              fill="none" stroke="${i === 1 ? c1 : c2}" stroke-width="${i === 1 ? 2 : 1.5}"
              opacity="${i === 1 ? 0.85 : 0.45}"/>`;
  });

  // Label
  svg += `<text x="${w * 0.52}" y="${h * 0.92}" font-size="9" fill="${c1}" opacity="0.5" font-family="monospace">electrophysiology</text>`;

  return svg;
}

// Wearable sensor: microfluidic channels + analyte dots
function generateWearableDiagram(seed, c1, c2, c3, w, h) {
  const rng = seededRandom(seed);
  let svg = '';

  // Body outline (simplified patch shape)
  svg += `<rect x="${w * 0.06}" y="${h * 0.08}" width="${w * 0.88}" height="${h * 0.78}"
            rx="30" fill="none" stroke="${c1}" stroke-width="1.5" stroke-opacity="0.3" stroke-dasharray="6,3"/>`;

  // Microfluidic channels
  const channelY = [h * 0.3, h * 0.5, h * 0.7];
  channelY.forEach((cy, i) => {
    svg += `<path d="M ${w * 0.15} ${cy} Q ${w * 0.35} ${cy - 15}, ${w * 0.5} ${cy} Q ${w * 0.65} ${cy + 15}, ${w * 0.85} ${cy}"
              fill="none" stroke="${i === 1 ? c1 : c2}" stroke-width="${i === 1 ? 3 : 2}" stroke-opacity="${i === 1 ? 0.55 : 0.3}"/>`;
  });

  // Analyte dots flowing through channels
  for (let i = 0; i < 10; i++) {
    const cx = w * 0.2 + rng() * w * 0.6;
    const chIdx = Math.floor(rng() * 3);
    const cy = channelY[chIdx] + (rng() - 0.5) * 8;
    const r = 2.5 + rng() * 3;
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${rng() > 0.5 ? c1 : c3}" opacity="${0.4 + rng() * 0.4}"/>`;
  }

  // Sensor electrodes (bottom)
  for (let i = 0; i < 3; i++) {
    const ex = w * 0.28 + i * w * 0.22;
    svg += `<rect x="${ex - 12}" y="${h * 0.78}" width="24" height="10" rx="3"
              fill="${c1}" opacity="0.35"/>`;
  }

  // Finger press indicator
  svg += `<circle cx="${w * 0.85}" cy="${h * 0.22}" r="14" fill="${c2}" opacity="0.15" stroke="${c2}" stroke-width="1" stroke-opacity="0.4"/>`;
  svg += `<text x="${w * 0.82}" y="${h * 0.27}" font-size="14" fill="${c1}" opacity="0.55">👆</text>`;

  return svg;
}

// Bioelectronics: wound + electrical field lines + circuit
function generateBioelectronicsDiagram(seed, c1, c2, c3, w, h) {
  const rng = seededRandom(seed);
  let svg = '';

  // Wound outline (oval, center)
  svg += `<ellipse cx="${w * 0.5}" cy="${h * 0.5}" rx="${w * 0.22}" ry="${h * 0.28}"
            fill="${c1}" fill-opacity="0.07" stroke="${c2}" stroke-width="1.5" stroke-opacity="0.4" stroke-dasharray="5,3"/>`;

  // Electric field lines (left → right across wound)
  for (let i = 0; i < 5; i++) {
    const fy = h * 0.22 + i * (h * 0.56 / 4);
    const curve = (i - 2) * 12;
    svg += `<path d="M ${w * 0.08} ${fy} Q ${w * 0.3} ${fy + curve}, ${w * 0.5} ${fy} Q ${w * 0.7} ${fy - curve}, ${w * 0.92} ${fy}"
              fill="none" stroke="${c1}" stroke-width="1" stroke-opacity="${0.15 + Math.abs(i - 2) * 0.08}"/>`;
    // Arrow at right end
    svg += `<polygon points="${w * 0.92},${fy - 3} ${w * 0.92 + 6},${fy} ${w * 0.92},${fy + 3}"
              fill="${c1}" opacity="0.4"/>`;
  }

  // Dressing electrodes (top and bottom)
  svg += `<rect x="${w * 0.2}" y="${h * 0.1}" width="${w * 0.6}" height="10" rx="3"
            fill="${c1}" opacity="0.5"/>`;
  svg += `<rect x="${w * 0.2}" y="${h * 0.82}" width="${w * 0.6}" height="10" rx="3"
            fill="${c2}" opacity="0.5"/>`;

  // Water drop (activation)
  svg += `<path d="M ${w * 0.82} ${h * 0.2} Q ${w * 0.87} ${h * 0.28}, ${w * 0.82} ${h * 0.35} Q ${w * 0.77} ${h * 0.28}, ${w * 0.82} ${h * 0.2}"
            fill="${c3}" opacity="0.4"/>`;

  // Healing arrows (closing wound)
  svg += `<path d="M ${w * 0.3} ${h * 0.5} L ${w * 0.42} ${h * 0.5}" fill="none" stroke="${c1}" stroke-width="2" opacity="0.6" marker-end="url(#arrowhead)"/>`;
  svg += `<path d="M ${w * 0.7} ${h * 0.5} L ${w * 0.58} ${h * 0.5}" fill="none" stroke="${c1}" stroke-width="2" opacity="0.6"/>`;

  svg += `<text x="${w * 0.35}" y="${h * 0.93}" font-size="9" fill="${c1}" opacity="0.45" font-family="monospace">bioelectronics</text>`;

  return svg;
}

// ---------- Render Paper Cards ----------
function renderPaperCards(papers) {
  const grid = document.getElementById("papers-grid");
  if (!grid) return;

  grid.innerHTML = papers.map(paper => {
    const imageHTML = generatePaperSVG(paper);

    return `
    <article class="paper-card fade-in" data-paper-id="${paper.id}" data-category="${paper.category}" onclick="openPaperModal('${paper.id}')">
      <div class="paper-card-image">
        ${imageHTML}
        <span class="paper-venue-badge">${paper.venue}</span>
      </div>
      <div class="paper-card-body">
        <div class="paper-date">${paper.date}</div>
        <h3>${paper.title}</h3>
        <p class="paper-abstract">${paper.abstract}</p>
      </div>
      <div class="paper-card-footer">
        <a href="${paper.url}" class="paper-link" target="_blank" rel="noopener" onclick="event.stopPropagation()">
          Read Paper
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
          </svg>
        </a>
      </div>
    </article>
  `;
  }).join("");

  requestAnimationFrame(() => observeElements());
}

// ---------- Paper Modal ----------
function openPaperModal(paperId) {
  const paper = PAPERS.find(p => p.id === paperId);
  if (!paper) return;

  const modal = document.getElementById("paper-modal");
  const modalImage = modal.querySelector(".modal-image");
  modalImage.innerHTML = generatePaperSVG(paper, 700, 280);

  modal.querySelector(".modal-title").textContent = paper.title;
  modal.querySelector(".modal-venue").textContent = paper.venue;
  modal.querySelector(".modal-date").textContent = paper.date;
  modal.querySelector(".abstract-full").textContent = paper.abstract;
  modal.querySelector(".modal-cta").href = paper.url;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closePaperModal() {
  const modal = document.getElementById("paper-modal");
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

// ---------- Filtering ----------
function filterPapers(category) {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.category === category);
  });

  const filtered = category === "all"
    ? PAPERS
    : PAPERS.filter(p => p.category === category);

  renderPaperCards(filtered);
}

// ---------- Scroll Animations ----------
function observeElements() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }),
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
}

// ---------- Navbar Scroll ----------
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });

  if (toggle) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
    });
  }

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => links.classList.remove("open"));
  });
}

// ---------- Smooth scroll ----------
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

// ---------- Active nav link ----------
function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  });
}

// ---------- Modal close on escape / overlay click ----------
function initModalHandlers() {
  const modal = document.getElementById("paper-modal");
  if (!modal) return;

  modal.addEventListener("click", e => {
    if (e.target === modal) closePaperModal();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closePaperModal();
  });
}

// ---------- Contact Form ----------
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = document.getElementById("form-submit-btn");
    const btnText = btn.querySelector(".btn-text");
    const btnSending = btn.querySelector(".btn-sending");
    const status = document.getElementById("form-status");

    btn.disabled = true;
    btnText.style.display = "none";
    btnSending.style.display = "inline";
    status.style.display = "none";

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        status.textContent = "\u2705 Message sent! I'll get back to you soon.";
        status.className = "form-status success";
        status.style.display = "block";
        form.reset();
      } else {
        throw new Error("Form submission failed");
      }
    } catch {
      const name = formData.get("name") || "";
      const email = formData.get("email") || "";
      const message = formData.get("message") || "";
      const subject = encodeURIComponent("Message from " + name + " via research portfolio");
      const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
      window.location.href = `mailto:me.navyamishra@gmail.com?subject=${subject}&body=${body}`;

      status.textContent = "Opening your email client as a fallback\u2026";
      status.className = "form-status success";
      status.style.display = "block";
    } finally {
      btn.disabled = false;
      btnText.style.display = "inline";
      btnSending.style.display = "none";
    }
  });
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initSmoothScroll();
  initActiveNav();
  initModalHandlers();
  initContactForm();
  renderPaperCards(PAPERS);
  observeElements();
});
