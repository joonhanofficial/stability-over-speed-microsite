const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll(".counter");
const insightCards = document.querySelectorAll(".insight-card");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function formatNumber(value, hasDecimals) {
  if (hasDecimals) {
    return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  }
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}

function animateCounter(counter) {
  if (counter.dataset.animated === "true") return;

  const targetStr = counter.dataset.target;
  const target = Number(targetStr);
  const hasDecimals = targetStr.includes(".");
  const hasPercent = counter.textContent.includes("%");
  
  counter.dataset.animated = "true";

  if (reducedMotion) {
    counter.textContent = formatNumber(target, hasDecimals) + (hasPercent ? "%" : "");
    return;
  }

  const currentValue = 0;

  const duration = 1150;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = currentValue + (target - currentValue) * eased;

    counter.textContent = formatNumber(value, hasDecimals) + (hasPercent ? "%" : "");

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");
      
      // Special logic for .action-chart .bar-fill
      if (entry.target.classList.contains("action-dashboard") || entry.target.classList.contains("action-chart")) {
          // Find bars inside and trigger animation by letting CSS animation play when they get visible class.
          // Wait, the benchmark uses keyframes 'growBar' which runs on element load. 
          // If we add visible class, we can trigger it.
          // The CSS in ref_style.css doesn't use .visible to trigger growBar. growBar runs on page load.
      }
      
      entry.target.querySelectorAll(".counter").forEach(animateCounter);

      if (entry.target.classList.contains("counter")) {
        animateCounter(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -80px 0px",
  }
);

revealItems.forEach((item) => observer.observe(item));
counters.forEach((counter) => observer.observe(counter));

function closeOtherInsightCards(activeCard) {
  insightCards.forEach((card) => {
    if (card === activeCard) return;

    card.classList.remove("is-active");
    card.setAttribute("aria-expanded", "false");
  });
}

function toggleInsightCard(card) {
  const isOpen = card.classList.toggle("is-active");

  card.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    closeOtherInsightCards(card);
  }
}

insightCards.forEach((card) => {
  card.addEventListener("click", () => {
    toggleInsightCard(card);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    toggleInsightCard(card);
  });
});

document.addEventListener("click", (event) => {
  if (event.target.closest(".insight-card")) return;

  insightCards.forEach((card) => {
    card.classList.remove("is-active");
    card.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    if (href === "#") {
      event.preventDefault();
      return;
    }

    const target = document.querySelector(href);

    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  });
});
