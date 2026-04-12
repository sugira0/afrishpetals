const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  [...mainNav.querySelectorAll("a")].forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const bookingForm = document.getElementById("booking-form");
const bookingStatus = document.getElementById("booking-status");
const bookingType = document.getElementById("booking-type");
const bookingTableScope = document.querySelector('[data-booking-scope="table"]');
const bookingEventScope = document.querySelector('[data-booking-scope="event"]');
const bookingTypeBtns = [...document.querySelectorAll("[data-booking-type-btn]")];
const bookingIntent = document.querySelector("[data-booking-intent]");
const bookingGuestsLabel = document.querySelector("[data-booking-guests-label]");
const bookingSpaceLabel = document.querySelector("[data-booking-space-label]");
const bookingSubmitCopy = document.querySelector("[data-booking-submit-copy]");
const RESTAURANT_WHATSAPP = "250786948980";
const EMAILJS_PLACEHOLDER_PATTERN = /^YOUR_[A-Z0-9_]+$/;

function toPayload(form) {
  return Object.fromEntries(new FormData(form).entries());
}

async function postForm(endpoint, payload) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    throw new Error(data.error || "Submission failed.");
  }

  return data;
}

function openWhatsAppFallback(message) {
  const url = `https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodeURIComponent(message)}`;
  const popup = window.open(url, "_blank", "noopener,noreferrer");
  if (!popup) {
    window.location.href = url;
  }
}

function getEmailJsConfig(form) {
  if (!form) {
    return null;
  }

  const serviceId = (form.dataset.emailjsServiceId || "").trim();
  const templateId = (form.dataset.emailjsTemplateId || "").trim();
  const publicKey = (form.dataset.emailjsPublicKey || "").trim();

  return { serviceId, templateId, publicKey };
}

function isEmailJsPlaceholder(value) {
  return !value || EMAILJS_PLACEHOLDER_PATTERN.test(value);
}

function getResolvedEmailJsConfig(form) {
  const config = getEmailJsConfig(form);
  if (!config) {
    return null;
  }

  if (form !== contactForm && isEmailJsPlaceholder(config.publicKey) && contactForm) {
    const sharedPublicKey = (contactForm.dataset.emailjsPublicKey || "").trim();
    if (!isEmailJsPlaceholder(sharedPublicKey)) {
      config.publicKey = sharedPublicKey;
    }
  }

  return config;
}

async function trySendContactViaEmailJs(payload) {
  const emailjsClient = window.emailjs;
  const config = getResolvedEmailJsConfig(contactForm);

  if (!emailjsClient || !config) {
    return { ok: false };
  }

  const missingConfig =
    isEmailJsPlaceholder(config.serviceId) ||
    isEmailJsPlaceholder(config.templateId) ||
    isEmailJsPlaceholder(config.publicKey);
  if (missingConfig) {
    return { ok: false };
  }

  const templateParams = {
    from_name: payload.name || "",
    from_email: payload.email || "",
    reply_to: payload.email || "",
    email: payload.email || "",
    name: payload.name || "",
    subject: payload.subject || "",
    message: payload.message || "",
    contact_subject: payload.subject || "",
    contact_message: payload.message || ""
  };

  try {
    await emailjsClient.send(config.serviceId, config.templateId, templateParams, {
      publicKey: config.publicKey
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

async function trySendBookingViaEmailJs(payload) {
  const emailjsClient = window.emailjs;
  const config = getResolvedEmailJsConfig(bookingForm);

  if (!emailjsClient || !config) {
    return { ok: false };
  }

  const missingConfig =
    isEmailJsPlaceholder(config.serviceId) ||
    isEmailJsPlaceholder(config.templateId) ||
    isEmailJsPlaceholder(config.publicKey);
  if (missingConfig) {
    return { ok: false };
  }

  const templateParams = {
    booking_type: payload.bookingType || "",
    bookingType: payload.bookingType || "",
    customer_name: payload.name || "",
    name: payload.name || "",
    from_name: payload.name || "",
    phone: payload.phone || "",
    customer_phone: payload.phone || "",
    email: payload.email || "",
    from_email: payload.email || "",
    reply_to: payload.email || "",
    booking_date: payload.date || "",
    date: payload.date || "",
    booking_time: payload.time || "",
    time: payload.time || "",
    guests: payload.guests || "",
    party_size: payload.guests || "",
    preferred_space: payload.space || "",
    space: payload.space || "",
    table_preference: payload.tablePreference || "",
    tablePreference: payload.tablePreference || "",
    event_type: payload.eventType || "",
    eventType: payload.eventType || "",
    budget: payload.budget || "",
    message: payload.message || "",
    special_requests: payload.message || ""
  };

  try {
    await emailjsClient.send(config.serviceId, config.templateId, templateParams, {
      publicKey: config.publicKey
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    formStatus.textContent = "Sending your message...";

    const payload = toPayload(contactForm);
    try {
      const emailJsResult = await trySendContactViaEmailJs(payload);
      if (emailJsResult.ok) {
        formStatus.textContent = "Thank you. Your message has been sent to the restaurant team.";
        contactForm.reset();
        return;
      }

      const result = await postForm("/api/contact", payload);
      formStatus.textContent = result.delivered
        ? "Thank you. Your request has been sent to the restaurant team."
        : "Request received. Email delivery is not configured yet, but your message was saved.";
      contactForm.reset();
    } catch (error) {
      const fallbackMessage = [
        "New Contact Request",
        `Name: ${payload.name || ""}`,
        `Email: ${payload.email || ""}`,
        `Subject: ${payload.subject || ""}`,
        `Message: ${payload.message || ""}`
      ].join("\n");

      openWhatsAppFallback(fallbackMessage);
      formStatus.textContent = "Could not send via server. WhatsApp has been opened so your message can still reach the restaurant.";
    }
  });
}

function setBookingScope(type) {
  if (bookingTableScope) {
    bookingTableScope.hidden = type !== "table";
  }

  if (bookingEventScope) {
    bookingEventScope.hidden = type !== "event";
  }
}

function setBookingTypeButtons(type) {
  if (!bookingTypeBtns.length) {
    return;
  }

  bookingTypeBtns.forEach((btn) => {
    const isActive = btn.dataset.bookingTypeBtn === type;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
}

function setBookingIntent(type) {
  const normalizedType = type === "event" ? "event" : "table";

  if (bookingIntent) {
    bookingIntent.innerHTML = normalizedType === "event"
      ? "You are requesting an <strong>Event Booking</strong>. Share your setup style and expected attendees."
      : "You are requesting a <strong>Table Reservation</strong>. Share your preferred seating and time.";
  }

  if (bookingGuestsLabel) {
    bookingGuestsLabel.textContent = normalizedType === "event"
      ? "Estimated Attendees"
      : "Number of Guests";
  }

  if (bookingSpaceLabel) {
    bookingSpaceLabel.textContent = normalizedType === "event"
      ? "Preferred Event Space"
      : "Preferred Seating / Space";
  }

  if (bookingSubmitCopy) {
    bookingSubmitCopy.textContent = normalizedType === "event"
      ? "Submit Event Request"
      : "Submit Table Request";
  }

  if (bookingForm) {
    bookingForm.classList.toggle("is-event", normalizedType === "event");
  }
}

if (bookingType) {
  const activeType = bookingType.value || "table";
  setBookingScope(activeType);
  setBookingTypeButtons(activeType);
  setBookingIntent(activeType);
  ["change", "input"].forEach((eventName) => {
    bookingType.addEventListener(eventName, () => {
      const nextType = bookingType.value || "table";
      setBookingScope(nextType);
      setBookingTypeButtons(nextType);
      setBookingIntent(nextType);
    });
  });
}

if (bookingType && bookingTypeBtns.length) {
  bookingTypeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const nextType = btn.dataset.bookingTypeBtn;
      if (!nextType) {
        return;
      }

      bookingType.value = nextType;
      setBookingScope(nextType);
      setBookingTypeButtons(nextType);
      setBookingIntent(nextType);
      bookingType.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });
}

if (bookingForm && bookingStatus) {
  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    bookingStatus.textContent = "Sending your booking request...";

    const payload = toPayload(bookingForm);
    const selectedType = (payload.bookingType || "table").toLowerCase();
    try {
      const emailJsResult = await trySendBookingViaEmailJs(payload);
      if (emailJsResult.ok) {
        bookingStatus.textContent = selectedType === "event"
          ? "Thank you. Your event booking request has been sent to the restaurant team."
          : "Thank you. Your table booking request has been sent to the restaurant team.";

        bookingForm.reset();
        if (bookingType) {
          const resetType = bookingType.value || "table";
          setBookingScope(resetType);
          setBookingTypeButtons(resetType);
          setBookingIntent(resetType);
        }
        return;
      }

      const result = await postForm("/api/booking", payload);
      bookingStatus.textContent = result.delivered
        ? "Thank you. Your booking request has been sent to the restaurant team."
        : "Booking request received. Email delivery is not configured yet, but your request was saved.";

      bookingForm.reset();
      if (bookingType) {
        const resetType = bookingType.value || "table";
        setBookingScope(resetType);
        setBookingTypeButtons(resetType);
        setBookingIntent(resetType);
      }
    } catch (error) {
      const fallbackMessage = [
        "New Booking Request",
        `Type: ${payload.bookingType || ""}`,
        `Name: ${payload.name || ""}`,
        `Phone: ${payload.phone || ""}`,
        `Email: ${payload.email || ""}`,
        `Date: ${payload.date || ""}`,
        `Time: ${payload.time || ""}`,
        `Guests: ${payload.guests || ""}`,
        `Space: ${payload.space || ""}`,
        `Notes: ${payload.message || ""}`
      ].join("\n");

      openWhatsAppFallback(fallbackMessage);
      bookingStatus.textContent = selectedType === "event"
        ? "Could not send via server. WhatsApp has been opened so your event request can still reach the restaurant."
        : "Could not send via server. WhatsApp has been opened so your table request can still reach the restaurant.";
    }
  });
}

function initDateMinimums() {
  const today = new Date().toISOString().split("T")[0];
  document.querySelectorAll('input[type="date"]').forEach((input) => {
    input.setAttribute("min", today);
  });
}

function initFooterYear() {
  document.querySelectorAll("#footer-year").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
}

function initRevealAnimations() {
  const targets = [
    ...document.querySelectorAll(".section, .media-slider, .story-photo, .event-image, .contact-meta, .contact-form-modern, .footer-top, .footer-bottom")
  ];

  if (!targets.length) {
    return;
  }

  targets.forEach((target, idx) => {
    target.classList.add("reveal");
    target.style.transitionDelay = `${Math.min(idx * 12, 90)}ms`;
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.06, rootMargin: "0px 0px -2% 0px" }
  );

  targets.forEach((target) => observer.observe(target));
}

function initMediaSliders() {
  const sliders = [...document.querySelectorAll("[data-slider]")];
  if (!sliders.length) {
    return;
  }

  sliders.forEach((slider) => {
    const slides = [...slider.querySelectorAll(".media-slide")];
    const dotsRoot = slider.querySelector(".slider-dots");
    if (!slides.length) {
      return;
    }

    let current = slides.findIndex((slide) => slide.classList.contains("is-active"));
    if (current < 0) {
      current = 0;
      slides[0].classList.add("is-active");
    }

    let dots = [];
    if (dotsRoot) {
      dotsRoot.innerHTML = slides
        .map((_, index) => `<button class="slider-dot${index === current ? " is-active" : ""}" type="button" aria-label="Go to slide ${index + 1}"></button>`)
        .join("");

      dots = [...dotsRoot.querySelectorAll(".slider-dot")];
    }

    const setActive = (nextIndex) => {
      slides[current].classList.remove("is-active");
      slides[nextIndex].classList.add("is-active");

      if (dots.length) {
        dots[current].classList.remove("is-active");
        dots[nextIndex].classList.add("is-active");
      }

      current = nextIndex;
    };

    const nextSlide = () => {
      const nextIndex = (current + 1) % slides.length;
      setActive(nextIndex);
    };

    const intervalMs = Number(slider.dataset.interval) || 2600;
    let timer = null;

    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const start = () => {
      if (slides.length > 1 && !timer) {
        timer = setInterval(nextSlide, intervalMs);
      }
    };

    if (dots.length) {
      dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
          if (index === current) {
            return;
          }
          setActive(index);
          stop();
          start();
        });
      });
    }

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    slider.addEventListener("touchstart", stop, { passive: true });
    slider.addEventListener("touchend", start);

    start();
  });
}

function initHeroAwareHeader() {
  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".home-hero, .page-hero, .contact-hero");

  if (!header || !hero) {
    return;
  }

  const updateState = () => {
    const cutoff = hero.offsetTop + hero.offsetHeight - header.offsetHeight;
    const overHero = window.scrollY <= cutoff;
    header.classList.toggle("is-over-hero", overHero);
    header.classList.toggle("is-glass", !overHero);
  };

  updateState();
  window.addEventListener("scroll", updateState, { passive: true });
  window.addEventListener("resize", updateState);
}

function initHeroSlider() {
  const slides = [...document.querySelectorAll(".hero-slide")];
  const heading = document.getElementById("hero-heading");
  const lead = document.getElementById("hero-lead");
  if (slides.length < 2) {
    return;
  }

  const heroCopy = [
    {
      title: "Where bold flavor meets refined atmosphere.",
      text: "Afrish Petals celebrates Rwandan flavor, culture, and hospitality through elevated dining, curated events, and unforgettable service."
    },
    {
      title: "Rwandan hospitality, elevated for modern dining.",
      text: "From signature table service to rich local ingredients, we create experiences that feel both premium and welcoming."
    },
    {
      title: "Designed for nights worth remembering.",
      text: "Celebrate with curated menus, warm ambience, and a team focused on every guest moment."
    },
    {
      title: "A destination for dining and celebrations.",
      text: "Whether for private events or intimate dinners, Afrish Petals delivers elegance with authentic heart."
    }
  ];

  const applyHeroCopy = (index) => {
    if (!heading || !lead) {
      return;
    }

    heading.classList.add("swap-out");
    lead.classList.add("swap-out");

    setTimeout(() => {
      const slideCopy = heroCopy[index % heroCopy.length];
      heading.textContent = slideCopy.title;
      lead.textContent = slideCopy.text;
      heading.classList.remove("swap-out");
      lead.classList.remove("swap-out");
      heading.classList.add("swap-in");
      lead.classList.add("swap-in");

      setTimeout(() => {
        heading.classList.remove("swap-in");
        lead.classList.remove("swap-in");
      }, 520);
    }, 220);
  };

  let current = 0;
  const slideDurationMs = 3200;
  const transitionMs = 520;

  setInterval(() => {
    const currentSlide = slides[current];
    const next = (current + 1) % slides.length;
    const nextSlide = slides[next];

    currentSlide.classList.remove("is-active");
    currentSlide.classList.add("is-leaving");
    nextSlide.classList.add("is-active");
    nextSlide.classList.remove("is-leaving");

    setTimeout(() => {
      currentSlide.classList.remove("is-leaving");
    }, transitionMs);

    applyHeroCopy(next);
    current = next;
  }, slideDurationMs);
}

function mountWhatsAppWidget() {
  const widget = document.createElement("div");
  widget.className = "whatsapp-widget";

  widget.innerHTML = `
    <div class="whatsapp-panel" aria-hidden="true">
      <div class="wa-panel-head">
        <div class="wa-head-main">
          <span class="wa-head-icon" aria-hidden="true">
            <svg viewBox="0 0 32 32" role="img" focusable="false">
              <path fill="#fff" d="M19.11 17.31c-.28-.14-1.64-.81-1.9-.9-.25-.09-.44-.14-.62.14-.18.27-.71.9-.87 1.08-.16.18-.32.2-.6.07-.28-.14-1.17-.43-2.23-1.37-.83-.74-1.39-1.66-1.56-1.94-.16-.27-.02-.42.12-.55.13-.13.28-.32.42-.48.14-.16.18-.27.28-.46.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.06-.22-.53-.44-.46-.62-.47l-.53-.01c-.18 0-.48.07-.74.34-.25.27-.97.95-.97 2.31 0 1.36 1 2.67 1.14 2.85.14.18 1.96 2.99 4.75 4.19.66.28 1.18.45 1.58.58.66.21 1.26.18 1.74.11.53-.08 1.64-.67 1.87-1.33.23-.66.23-1.22.16-1.33-.07-.11-.25-.18-.53-.32M16 4.73C9.78 4.73 4.73 9.78 4.73 16c0 2.05.55 4.05 1.59 5.8L4.5 27.5l5.86-1.78A11.23 11.23 0 0 0 16 27.27c6.22 0 11.27-5.05 11.27-11.27S22.22 4.73 16 4.73m0 20.49c-1.77 0-3.5-.48-5-1.38l-.36-.22-3.48 1.06 1.08-3.39-.24-.35a9.14 9.14 0 0 1-1.41-4.94c0-5.04 4.09-9.14 9.14-9.14 2.44 0 4.74.95 6.46 2.68a9.08 9.08 0 0 1 2.68 6.46c0 5.04-4.1 9.14-9.14 9.14"/>
            </svg>
          </span>
          <div class="wa-head-copy">
            <p class="wa-head-title">Contact Support</p>
            <p class="wa-head-sub">Choose who to chat with</p>
          </div>
        </div>
        <button class="wa-head-close" type="button" aria-label="Close WhatsApp contacts">&times;</button>
      </div>

      <div class="wa-panel-body">
        <a class="wa-contact" href="https://wa.me/250786948980?text=Hello%20Maniraguha%20Daniel%2C%20I%20need%20assistance%20from%20Afrish%20Petals." target="_blank" rel="noopener">
          <span class="wa-avatar">MD</span>
          <span class="wa-contact-copy">
            <strong>Maniraguha Daniel</strong>
            <span>Owner</span>
            <span class="wa-online"><i aria-hidden="true"></i>Online</span>
          </span>
        </a>
        <a class="wa-contact" href="https://wa.me/250786666111?text=Hello%20Sugira%20Erasto%2C%20I%20need%20system%20support%20from%20Afrish%20Petals." target="_blank" rel="noopener">
          <span class="wa-avatar wa-avatar-alt">SE</span>
          <span class="wa-contact-copy">
            <strong>Sugira Erasto</strong>
            <span>System Manager</span>
            <span class="wa-online"><i aria-hidden="true"></i>Online</span>
          </span>
        </a>
      </div>

      <p class="wa-panel-foot">We typically reply within minutes</p>
    </div>

    <button class="whatsapp-trigger" type="button" aria-label="Open WhatsApp contacts" aria-expanded="false">
      <span class="wa-fab-icon wa-fab-whats" aria-hidden="true">
        <svg viewBox="0 0 32 32" role="img" focusable="false">
          <path fill="#fff" d="M19.11 17.31c-.28-.14-1.64-.81-1.9-.9-.25-.09-.44-.14-.62.14-.18.27-.71.9-.87 1.08-.16.18-.32.2-.6.07-.28-.14-1.17-.43-2.23-1.37-.83-.74-1.39-1.66-1.56-1.94-.16-.27-.02-.42.12-.55.13-.13.28-.32.42-.48.14-.16.18-.27.28-.46.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.06-.22-.53-.44-.46-.62-.47l-.53-.01c-.18 0-.48.07-.74.34-.25.27-.97.95-.97 2.31 0 1.36 1 2.67 1.14 2.85.14.18 1.96 2.99 4.75 4.19.66.28 1.18.45 1.58.58.66.21 1.26.18 1.74.11.53-.08 1.64-.67 1.87-1.33.23-.66.23-1.22.16-1.33-.07-.11-.25-.18-.53-.32M16 4.73C9.78 4.73 4.73 9.78 4.73 16c0 2.05.55 4.05 1.59 5.8L4.5 27.5l5.86-1.78A11.23 11.23 0 0 0 16 27.27c6.22 0 11.27-5.05 11.27-11.27S22.22 4.73 16 4.73m0 20.49c-1.77 0-3.5-.48-5-1.38l-.36-.22-3.48 1.06 1.08-3.39-.24-.35a9.14 9.14 0 0 1-1.41-4.94c0-5.04 4.09-9.14 9.14-9.14 2.44 0 4.74.95 6.46 2.68a9.08 9.08 0 0 1 2.68 6.46c0 5.04-4.1 9.14-9.14 9.14"/>
        </svg>
      </span>
      <span class="wa-fab-icon wa-fab-close" aria-hidden="true">&times;</span>
    </button>
  `;

  document.body.appendChild(widget);

  const trigger = widget.querySelector(".whatsapp-trigger");
  const panel = widget.querySelector(".whatsapp-panel");
  const panelClose = widget.querySelector(".wa-head-close");
  if (!trigger || !panel || !panelClose) {
    return;
  }

  const setOpen = (isOpen) => {
    widget.classList.toggle("open", isOpen);
    trigger.setAttribute("aria-expanded", String(isOpen));
    panel.setAttribute("aria-hidden", String(!isOpen));
  };

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(!widget.classList.contains("open"));
  });

  panelClose.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(false);
  });

  panel.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  });
}

mountWhatsAppWidget();
initHeroSlider();
initHeroAwareHeader();
initFooterYear();
initRevealAnimations();
initMediaSliders();
initDateMinimums();

