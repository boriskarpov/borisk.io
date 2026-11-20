const TELEGRAM = "https://t.me/bxr1ss";
const DEFAULT_MESSAGE = "Здравствуйте, Борис! Хочу записаться на консультацию по маркетингу.";

const tgLink = (text) => `${TELEGRAM}?text=${encodeURIComponent(text)}`;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

document.querySelectorAll("[data-tg]").forEach((a) => {
  a.href = tgLink(DEFAULT_MESSAGE);
  a.target = "_blank";
  a.rel = "noopener noreferrer";
});

document.getElementById("year").textContent = new Date().getFullYear();

const nav = document.querySelector(".nav");
const tgFloat = document.querySelector(".tg-float");
const onScroll = () => {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 20);
  tgFloat.classList.toggle("show", y > window.innerHeight * 0.7);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal, .steps").forEach((el, i) => {
  if (el.classList.contains("reveal")) {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    el.style.transitionDelay = `${siblings.indexOf(el) * 90}ms`;
  }
  io.observe(el);
});

if (!reduceMotion && finePointer) {
  const glow = document.querySelector(".cursor-glow");
  window.addEventListener("pointermove", (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });

  const scene = document.getElementById("heroScene");
  const stack = scene.querySelector(".photo-stack");
  const hero = document.querySelector(".hero");
  hero.addEventListener("pointermove", (e) => {
    const r = scene.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
    const y = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
    stack.style.setProperty("--ry", `${-8 + x * 28}deg`);
    stack.style.setProperty("--rx", `${4 - y * 20}deg`);
  });
  hero.addEventListener("pointerleave", () => {
    stack.style.setProperty("--ry", "-8deg");
    stack.style.setProperty("--rx", "4deg");
  });

  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty("--ty", `${px * 14}deg`);
      card.style.setProperty("--tx", `${-py * 14}deg`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--ty", "0deg");
      card.style.setProperty("--tx", "0deg");
    });
  });

  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
    });
    btn.addEventListener("pointerleave", () => {
      btn.style.transform = "";
    });
  });
}

const form = document.getElementById("leadForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const business = form.business.value.trim();
  const goal = form.goal.value.trim();
  if (!business) {
    form.business.classList.remove("invalid");
    void form.business.offsetWidth;
    form.business.classList.add("invalid");
    form.business.focus();
    return;
  }
  form.business.classList.remove("invalid");
  const lines = [
    "Здравствуйте, Борис! Хочу записаться на консультацию.",
    `Бизнес: ${business}`,
  ];
  if (goal) lines.push(`Задача: ${goal}`);
  window.open(tgLink(lines.join("\n")), "_blank", "noopener");
});
