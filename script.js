document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("pageLoader");
  window.addEventListener("load", () => {
    setTimeout(() => loader.classList.add("hide"), 450);
  });

  const navbar = document.getElementById("navbar");
  const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", open);
  });
  navLinks.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Hero slider
  const slides = [...document.querySelectorAll(".hero-slide")];
  const slideNumber = document.getElementById("slideNumber");
  const progress = document.getElementById("captionProgress");
  const quote = document.getElementById("heroQuote");
  const quotes = [
    "Intelligent systems designed for performance, safety and complete control.",
    "A smarter workplace starts with the right building technology.",
    "Integrated security and safety for modern environments.",
    "Designed. Installed. Tested. Supported. One reliable partner."
  ];

  let current = 0;
  let timer;
  const duration = 5000;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
    slideNumber.textContent = String(current + 1).padStart(2, "0");
    quote.style.opacity = "0";
    setTimeout(() => {
      quote.textContent = quotes[current];
      quote.style.opacity = "1";
    }, 220);
    progress.style.transition = "none";
    progress.style.width = "0";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        progress.style.transition = `width ${duration}ms linear`;
        progress.style.width = "100%";
      });
    });
  }

  function next() { showSlide(current + 1); restart(); }
  function prev() { showSlide(current - 1); restart(); }
  function restart() {
    clearInterval(timer);
    timer = setInterval(() => showSlide(current + 1), duration);
  }

  document.getElementById("nextSlide").addEventListener("click", next);
  document.getElementById("prevSlide").addEventListener("click", prev);
  quote.style.transition = "opacity .35s ease";
  showSlide(0);
  restart();

  // Reveal-on-scroll
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Contact form -> mail client
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get("name") || "";
    const phone = data.get("phone") || "";
    const email = data.get("email") || "";
    const service = data.get("service") || "Not specified";
    const message = data.get("message") || "";

    const subject = encodeURIComponent(`Website Enquiry - ${service}`);
    const body = encodeURIComponent(
      `Hello RK BMS Solutions,\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email}\n` +
      `Service: ${service}\n\n` +
      `Project details:\n${message}\n\n` +
      `Sent from the RK BMS Solutions website.`
    );

    window.location.href = `mailto:rkbmssolutions@gmail.com?subject=${subject}&body=${body}`;
  });

  // Pause the hero when browser tab is hidden.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearInterval(timer);
    else restart();
  });
});
