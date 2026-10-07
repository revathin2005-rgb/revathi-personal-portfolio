const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const form = document.getElementById("contactForm");
const statusMessage = document.getElementById("formStatus");
const currentYear = document.getElementById("currentYear");

currentYear.textContent = new Date().getFullYear();

function closeMobileMenu() {
  navMenu.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation menu");
}

navToggle?.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
    closeMobileMenu();
  });
});

function setActiveLink() {
  const sections = document.querySelectorAll("main section[id]");
  const scrollPosition = window.scrollY + 120;

  sections.forEach((section) => {
    const id = section.getAttribute("id");
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!link) return;

    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const isActive = scrollPosition >= top && scrollPosition < bottom;
    link.classList.toggle("active", isActive);
  });
}

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((element) => revealObserver.observe(element));

function showError(field, message) {
  const fieldContainer = field.closest(".form-field");
  const errorElement = fieldContainer.querySelector(".error-message");
  fieldContainer.classList.add("invalid");
  errorElement.textContent = message;
}

function clearError(field) {
  const fieldContainer = field.closest(".form-field");
  const errorElement = fieldContainer.querySelector(".error-message");
  fieldContainer.classList.remove("invalid");
  errorElement.textContent = "";
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const fields = {
    name: form.elements.name,
    email: form.elements.email,
    subject: form.elements.subject,
    message: form.elements.message,
  };

  let isValid = true;

  Object.entries(fields).forEach(([name, field]) => {
    if (!field.value.trim()) {
      showError(field, `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`);
      isValid = false;
      return;
    }

    if (name === "email" && !validateEmail(field.value.trim())) {
      showError(field, "Please enter a valid email address.");
      isValid = false;
      return;
    }

    clearError(field);
  });

  if (!isValid) {
    statusMessage.textContent = "Please correct the highlighted fields and try again.";
    statusMessage.className = "form-status error";
    return;
  }

  statusMessage.textContent = "Your message has been submitted successfully!";
  statusMessage.className = "form-status success";
  form.reset();
});

window.addEventListener("scroll", setActiveLink);
window.addEventListener("load", setActiveLink);

document.addEventListener("click", (event) => {
  if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
    closeMobileMenu();
  }
});
