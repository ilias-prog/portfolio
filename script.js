const GROUPS = [
  { name: "Front end", skills: ["HTML", "CSS", "JavaScript", "React"] },
  { name: "Styling", skills: ["Tailwind", "Bootstrap"] },
  { name: "Back end and tools", skills: ["PHP", "Java", "GitHub"] }
];

const PROJECTS = [
  { title: "tp4-projet", kind: "Coursework", desc: "TP4: an order management application (gestion des commandes) written in JavaScript.", tags: ["JavaScript", "GitHub"], url: "https://github.com/ilias-prog/tp4-projet" },
  { title: "bank-app", kind: "Personal project", desc: "A banking application built with PHP.", tags: ["PHP", "GitHub"], url: "https://github.com/ilias-prog/bank-app" },
  { title: "tp5-collab", kind: "Team project", desc: "TP5: a collaborative project managed with Git and GitHub.", tags: ["GitHub"], url: "https://github.com/ilias-prog/tp5-collab" },
  { title: "Tp-collab", kind: "Team project", desc: "A collaborative HTML project built with a teammate and hosted on their account.", tags: ["HTML", "GitHub"], url: "https://github.com/mberchami5469-beep/Tp-collab" }
];

const active = new Set();
const groupsEl = document.getElementById("groups");
const gridEl = document.getElementById("grid");
const countEl = document.getElementById("count");
const clearEl = document.getElementById("clear");

GROUPS.forEach(g => {
  const box = document.createElement("div");
  box.className = "group";
  box.innerHTML = '<p class="label"></p><div class="chips"></div>';
  box.querySelector(".label").textContent = g.name;
  const chips = box.querySelector(".chips");
  g.skills.forEach(s => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = s;
    b.dataset.skill = s;
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => {
      active.has(s) ? active.delete(s) : active.add(s);
      render();
    });
    chips.appendChild(b);
  });
  groupsEl.appendChild(box);
});

PROJECTS.forEach(p => {
  const c = document.createElement("article");
  c.className = "card";
  c.innerHTML =
    '<span class="sample"></span><h3></h3><p></p><div class="tags"></div>' +
    '<div class="links"><a target="_blank" rel="noopener">View on GitHub</a></div>';
  c.querySelector(".sample").textContent = p.kind;
  c.querySelector(".links a").href = p.url;
  c.querySelector("h3").textContent = p.title;
  c.querySelector("p").textContent = p.desc;
  const tags = c.querySelector(".tags");
  p.tags.forEach(t => {
    const s = document.createElement("span");
    s.className = "tag";
    s.textContent = t;
    s.dataset.skill = t;
    tags.appendChild(s);
  });
  c._tags = p.tags;
  gridEl.appendChild(c);
});

function render() {
  document.querySelectorAll(".chip").forEach(b =>
    b.setAttribute("aria-pressed", active.has(b.dataset.skill) ? "true" : "false"));
  let shown = 0;
  gridEl.querySelectorAll(".card").forEach(c => {
    const match = [...active].every(s => c._tags.includes(s));
    c.hidden = !match;
    if (match) shown++;
    c.querySelectorAll(".tag").forEach(t => t.classList.toggle("on", active.has(t.dataset.skill)));
  });
  const total = PROJECTS.length;
  countEl.textContent = active.size
    ? shown + " of " + total + " projects use " + [...active].join(" + ")
    : "Showing all " + total + " projects";
  clearEl.hidden = active.size === 0;
  if (shown === 0 && active.size) countEl.textContent = "No project uses " + [...active].join(" + ") + " together yet";
}
clearEl.addEventListener("click", () => { active.clear(); render(); });
document.querySelectorAll(".tech[data-skill]").forEach(b => b.addEventListener("click", () => {
  active.clear(); active.add(b.dataset.skill); render();
  document.getElementById("projects").scrollIntoView({ behavior: "smooth" });
}));
render();

document.querySelectorAll(".copy").forEach(btn => {
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      btn.textContent = "Copied";
    } catch (e) {
      const r = document.createRange();
      r.selectNodeContents(btn.previousElementSibling);
      const sel = window.getSelection();
      sel.removeAllRanges(); sel.addRange(r);
      btn.textContent = "Select and copy";
    }
    setTimeout(() => { btn.textContent = "Copy"; }, 2000);
  });
});
