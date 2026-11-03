/* ======== Dark and light mode toggle ======== */

const themeBtn = document.getElementById("theme-mode-btn");
const htmlPage = document.documentElement;

const savedTheme = localStorage.getItem("themeLive");

if (savedTheme == "dark") {
  htmlPage.setAttribute("data-bs-theme", "dark");
  themeBtn.textContent = "☀️";
} else {
  htmlPage.setAttribute("data-bs-theme", "light");
  themeBtn.textContent = "🌑";
}

themeBtn.addEventListener("click", function () {
  if (htmlPage.getAttribute("data-bs-theme") == "dark") {
    htmlPage.setAttribute("data-bs-theme", "light");
    themeBtn.textContent = "🌑";
    localStorage.setItem("themeLive", "light");
  } else if (htmlPage.getAttribute("data-bs-theme") == "light") {
    htmlPage.setAttribute("data-bs-theme", "dark");
    themeBtn.textContent = "☀️";
    localStorage.setItem("themeLive", "dark");
  }
});

/* ======== Students credit modal and copy button ======== */

const modalBox = document.getElementById("creditModal");

if (modalBox) {
  const startupModal = new bootstrap.Modal(modalBox);

  window.addEventListener("load", function () {
    if (localStorage.getItem("modalShown") === "true") {
      return;
    }
    setTimeout(function () {
      startupModal.show();
      localStorage.setItem("modalShown", "true");
    }, 250);

    const closeTimer = setTimeout(function () {
      startupModal.hide();
    }, 4000);

    modalBox.addEventListener("hide.bs.modal", function () {
      clearTimeout(closeTimer);
    });
  });
}

const copyBtn = document.getElementById("copy-names");
const copyAlert = document.getElementById("copy-alert");

if (copyBtn && copyAlert) {
  copyBtn.addEventListener("click", function () {
    const table = document.getElementById("students-names-table");
    const textToCopy = table.innerText;

    navigator.clipboard.writeText(textToCopy);

    copyAlert.classList.remove("d-none");

    setTimeout(function () {
      copyAlert.classList.add("d-none");
    }, 2000);
  });
}

/* ======== Scroll to top button ======== */

const topBtn = document.getElementById("scroll-top-btn");

if (topBtn) {
  window.addEventListener("scroll", function () {
    if (window.scrollY > 200) {
      topBtn.classList.remove("d-none");
    } else {
      topBtn.classList.add("d-none");
    }
  });

  topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ======== Home page slider and category filter ======== */

const now = new Date();
let month = "" + (now.getMonth() + 1);
let day = "" + now.getDate();
if (month.length < 2) {
  month = "0" + month;
}
if (day.length < 2) {
  day = "0" + day;
}
const todayText = now.getFullYear() + "-" + month + "-" + day;

const weekBox = document.getElementById("weekly-events-container");
const countText = document.getElementById("weekly-events-count");
const prevBtn = document.getElementById("prev-weekly-btn");
const nextBtn = document.getElementById("next-weekly-btn");
const navBox = document.getElementById("weekly-nav-controls");

const weekCards = [];
for (let i = 1; i <= 8; i++) {
  const card = document.getElementById("week-card-" + i);
  if (card) {
    weekCards.push(card);
  }
}

const latestCards = [];
for (let i = 1; i <= 8; i++) {
  const card = document.getElementById("latest-card-" + i);
  if (card) {
    latestCards.push(card);
  }
}

const catButtons = [];
for (let i = 1; i <= 5; i++) {
  const btn = document.getElementById("cat-btn-" + i);
  if (btn) {
    catButtons.push(btn);
  }
}

let selectedCat = "all";
const savedCat = localStorage.getItem("savedHomeCat");

if (savedCat) {
  for (let i = 0; i < catButtons.length; i++) {
    if (catButtons[i].getAttribute("data-cat") === savedCat) {
      selectedCat = savedCat;
    }
  }
}

let activeWeekCards = [];
let cardIndex = 4;

function getCardStyle(card, isCenterSlot) {
  if (selectedCat === "all" && isCenterSlot) {
    return "weekly-center-item";
  }
  if (card.getAttribute("data-date") === todayText) {
    return "weekly-center-item";
  }
  return "weekly-side-item";
}

function showWeekCards() {
  if (!weekBox) {
    return;
  }

  for (let i = 0; i < weekCards.length; i++) {
    weekCards[i].classList.add("d-none");
    weekCards[i].classList.remove("weekly-side-item", "weekly-center-item", "order-1", "order-2", "order-3");
  }

  if (activeWeekCards.length === 0) {
    if (navBox) {
      navBox.classList.add("d-none");
    }
    return;
  }

  if (activeWeekCards.length === 1) {
    activeWeekCards[0].classList.remove("d-none");
    activeWeekCards[0].classList.add(getCardStyle(activeWeekCards[0], false), "order-1");
    if (navBox) {
      navBox.classList.add("d-none");
    }
    return;
  }

  if (activeWeekCards.length === 2) {
    activeWeekCards[0].classList.remove("d-none");
    activeWeekCards[0].classList.add(getCardStyle(activeWeekCards[0], false), "order-1");

    activeWeekCards[1].classList.remove("d-none");
    activeWeekCards[1].classList.add(getCardStyle(activeWeekCards[1], false), "order-2");

    if (navBox) {
      navBox.classList.add("d-none");
    }
    return;
  }

  if (navBox) {
    navBox.classList.remove("d-none");
  }

  let rightIndex = cardIndex - 1;
  if (rightIndex < 0) {
    rightIndex = activeWeekCards.length - 1;
  }

  let leftIndex = cardIndex + 1;
  if (leftIndex >= activeWeekCards.length) {
    leftIndex = 0;
  }

  activeWeekCards[rightIndex].classList.remove("d-none");
  activeWeekCards[rightIndex].classList.add("weekly-side-item", "order-1");

  activeWeekCards[cardIndex].classList.remove("d-none");
  activeWeekCards[cardIndex].classList.add(getCardStyle(activeWeekCards[cardIndex], true), "order-2");

  activeWeekCards[leftIndex].classList.remove("d-none");
  activeWeekCards[leftIndex].classList.add("weekly-side-item", "order-3");
}

function filterHomeByCat() {
  activeWeekCards = [];

  for (let i = 0; i < weekCards.length; i++) {
    const cat = weekCards[i].getAttribute("data-cat");
    if (selectedCat === "all" || cat === selectedCat) {
      activeWeekCards.push(weekCards[i]);
    }
  }

  if (countText) {
    countText.textContent = "(" + activeWeekCards.length + ")";
  }

  const todayTime = new Date(todayText).getTime();
  cardIndex = 0;
  let minDiff = -1;

  for (let i = 0; i < activeWeekCards.length; i++) {
    const cardDate = activeWeekCards[i].getAttribute("data-date");
    const cardTime = new Date(cardDate).getTime();
    let diff = cardTime - todayTime;
    if (diff < 0) {
      diff = -diff;
    }
    if (minDiff === -1 || diff < minDiff || (diff === minDiff && cardDate >= todayText)) {
      minDiff = diff;
      cardIndex = i;
    }
  }

  showWeekCards();

  for (let i = 0; i < latestCards.length; i++) {
    const cat = latestCards[i].getAttribute("data-cat");
    if (selectedCat === "all" || cat === selectedCat) {
      latestCards[i].classList.remove("d-none");
    } else {
      latestCards[i].classList.add("d-none");
    }
  }
}

if (weekBox) {
  for (let i = 0; i < catButtons.length; i++) {
    if (catButtons[i].getAttribute("data-cat") === selectedCat) {
      catButtons[i].classList.add("cat-btn-active");
    } else {
      catButtons[i].classList.remove("cat-btn-active");
    }
  }
  filterHomeByCat();
}

let busy = false;

if (nextBtn && weekBox) {
  nextBtn.addEventListener("click", function () {
    if (activeWeekCards.length < 3 || busy) {
      return;
    }
    busy = true;
    weekBox.classList.add("weekly-slide-next");

    setTimeout(function () {
      cardIndex = cardIndex + 1;
      if (cardIndex >= activeWeekCards.length) {
        cardIndex = 0;
      }
      showWeekCards();
      weekBox.classList.remove("weekly-slide-next");
      busy = false;
    }, 220);
  });
}

if (prevBtn && weekBox) {
  prevBtn.addEventListener("click", function () {
    if (activeWeekCards.length < 3 || busy) {
      return;
    }
    busy = true;
    weekBox.classList.add("weekly-slide-prev");

    setTimeout(function () {
      cardIndex = cardIndex - 1;
      if (cardIndex < 0) {
        cardIndex = activeWeekCards.length - 1;
      }
      showWeekCards();
      weekBox.classList.remove("weekly-slide-prev");
      busy = false;
    }, 220);
  });
}

for (let i = 0; i < catButtons.length; i++) {
  catButtons[i].addEventListener("click", function () {
    selectedCat = this.getAttribute("data-cat");
    localStorage.setItem("savedHomeCat", selectedCat);

    for (let j = 0; j < catButtons.length; j++) {
      catButtons[j].classList.remove("cat-btn-active");
    }
    this.classList.add("cat-btn-active");

    filterHomeByCat();
  });
}

/* ======= Home page photo gallery ======= */

const galleryImg = document.getElementById("gallery-img");

const pics = [
  "assets/img/event1.jpg",
  "assets/img/event2.jpg",
  "assets/img/event3.jpg",
  "assets/img/event4.jpg",
  "assets/img/event5.jpg",
  "assets/img/event6.jpg",
  "assets/img/event7.jpg",
  "assets/img/event8.jpg"
];

let picIndex = 0;

if (galleryImg) {
  let timer = setInterval(function () {
    galleryImg.classList.add("gallery-hide");

    setTimeout(function () {
      picIndex = picIndex + 1;
      if (picIndex >= pics.length) {
        picIndex = 0;
      }
      galleryImg.src = pics[picIndex];
      galleryImg.classList.remove("gallery-hide");
    }, 400);
  }, 3000);
}

/* ======== Events page search and filter ======== */

const allEventsBox = document.getElementById("all-events-box");
const allCountText = document.getElementById("all-events-count");
const noEventsMsg = document.getElementById("no-events-msg");
const searchInput = document.getElementById("search-input");
const catSelect = document.getElementById("cat-select");
const dateSelect = document.getElementById("date-select");
const locSelect = document.getElementById("loc-select");
const resetBtn = document.getElementById("reset-filter-btn");

const eventItems = [];
for (let i = 1; i <= 8; i++) {
  const item = document.getElementById("event" + i);
  if (item) {
    eventItems.push(item);
  }
}

function filterEvents() {
  if (!allEventsBox) {
    return;
  }

  const searchWord = searchInput.value.trim();
  const chosenCat = catSelect.value;
  const chosenDate = dateSelect.value;
  const chosenLoc = locSelect.value;

  let count = 0;

  for (let i = 0; i < eventItems.length; i++) {
    const card = eventItems[i];
    const cardText = card.innerText;
    const cardCat = card.getAttribute("data-cat");
    const cardDate = card.getAttribute("data-date");
    const cardLoc = card.getAttribute("data-loc");

    let show = true;

    if (searchWord !== "" && !cardText.includes(searchWord)) {
      show = false;
    }
    if (chosenCat !== "all" && cardCat !== chosenCat) {
      show = false;
    }
    if (chosenDate === "upcoming" && cardDate < todayText) {
      show = false;
    }
    if (chosenDate === "past" && cardDate >= todayText) {
      show = false;
    }
    if (chosenLoc !== "all" && cardLoc !== chosenLoc) {
      show = false;
    }

    if (show) {
      card.classList.remove("d-none");
      count = count + 1;
    } else {
      card.classList.add("d-none");
    }
  }

  if (allCountText) {
    allCountText.textContent = "(" + count + ")";
  }

  if (noEventsMsg) {
    if (count === 0) {
      noEventsMsg.classList.remove("d-none");
    } else {
      noEventsMsg.classList.add("d-none");
    }
  }
}

if (searchInput) {
  searchInput.addEventListener("input", filterEvents);
}

if (catSelect) {
  catSelect.addEventListener("change", filterEvents);
}

if (dateSelect) {
  dateSelect.addEventListener("change", filterEvents);
}

if (locSelect) {
  locSelect.addEventListener("change", filterEvents);
}

if (resetBtn) {
  resetBtn.addEventListener("click", function () {
    searchInput.value = "";
    catSelect.value = "all";
    dateSelect.value = "all";
    locSelect.value = "all";
    filterEvents();
  });
}

/* ======== Booking modal and form validation ======== */

const bookingForm = document.getElementById("booking-form");
const firstNameInput = document.getElementById("first-name");
const lastNameInput = document.getElementById("last-name");
const bookEmailInput = document.getElementById("book-email");
const bookPhoneInput = document.getElementById("book-phone");
const bookCatSelect = document.getElementById("book-cat-select");
const bookEventSelect = document.getElementById("book-event-select");
const studentCheck = document.getElementById("student-check");
const svuRadio = document.getElementById("svu-radio");
const otherUniRadio = document.getElementById("other-uni-radio");
const seatsInput = document.getElementById("seats-input");
const bookErrorAlert = document.getElementById("book-error-alert");
const bookSuccessAlert = document.getElementById("book-success-alert");

if (bookCatSelect && bookEventSelect) {
  function updateEventOptions(chosenType) {
    for (let i = 1; i <= 8; i++) {
      const opt = document.getElementById("book-opt-" + i);
      const card = document.getElementById("event" + i);
      const optCat = opt.getAttribute("data-cat");
      const optDate = card.getAttribute("data-date");

      if (chosenType !== "" && optCat === chosenType && optDate >= todayText) {
        opt.hidden = false;
      } else {
        opt.hidden = true;
      }
    }
  }

  for (let i = 1; i <= 8; i++) {
    const card = document.getElementById("event" + i);
    const titleEl = document.getElementById("event-title-" + i);
    const cardDateEl = document.getElementById("event-date-" + i);
    const modalDateEl = document.getElementById("modal-date-" + i);
    const modalBookBtn = document.getElementById("modal-book-btn-" + i);
    const opt = document.getElementById("book-opt-" + i);

    const cardDate = card.getAttribute("data-date");
    const cardTitle = titleEl.textContent;

    cardDateEl.textContent = "📅 " + cardDate;
    modalDateEl.textContent = "📅 " + cardDate;
    opt.textContent = cardTitle + " - " + cardDate;

    if (cardDate < todayText) {
      modalBookBtn.classList.add("d-none");
    } else {
      modalBookBtn.classList.remove("d-none");
    }

    modalBookBtn.addEventListener("click", function () {
      const cardCat = card.getAttribute("data-cat");
      bookCatSelect.value = cardCat;
      updateEventOptions(cardCat);
      bookEventSelect.value = "event" + i;
      bookErrorAlert.classList.add("d-none");
      bookSuccessAlert.classList.add("d-none");
    });
  }

  const directIds = ["nav-booking-btn", "quick-booking-btn", "footer-booking-btn"];

  for (let i = 0; i < directIds.length; i++) {
    const btn = document.getElementById(directIds[i]);
    if (btn) {
      btn.addEventListener("click", function () {
        bookCatSelect.value = "";
        bookEventSelect.value = "";
        updateEventOptions("");
        bookErrorAlert.classList.add("d-none");
        bookSuccessAlert.classList.add("d-none");
      });
    }
  }

  bookCatSelect.addEventListener("change", function () {
    bookEventSelect.value = "";
    updateEventOptions(bookCatSelect.value);
  });
}

if (studentCheck && svuRadio && otherUniRadio) {
  studentCheck.addEventListener("change", function () {
    if (studentCheck.checked) {
      svuRadio.disabled = false;
      otherUniRadio.disabled = false;
      svuRadio.checked = true;
    } else {
      svuRadio.disabled = true;
      otherUniRadio.disabled = true;
      svuRadio.checked = false;
      otherUniRadio.checked = false;
    }
  });
}

if (bookingForm) {
  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    bookErrorAlert.classList.add("d-none");
    bookSuccessAlert.classList.add("d-none");

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const emailVal = bookEmailInput.value.trim();
    const phoneVal = bookPhoneInput.value.trim();
    const catVal = bookCatSelect.value;
    const eventVal = bookEventSelect.value;
    const seatsVal = seatsInput.value;

    if (firstName === "" || lastName === "") {
      bookErrorAlert.textContent = "يرجى إدخال الاسم الأول والاسم الثاني.";
      bookErrorAlert.classList.remove("d-none");
      return;
    }

    const atPos = emailVal.indexOf("@");
    const dotPos = emailVal.lastIndexOf(".");
    if (atPos <= 0 || dotPos <= atPos + 1 || dotPos >= emailVal.length - 1 || emailVal.includes(" ")) {
      bookErrorAlert.textContent = "يرجى إدخال بريد إلكتروني صحيح من الشكل name@example.com";
      bookErrorAlert.classList.remove("d-none");
      return;
    }

    let onlyDigits = true;
    for (let i = 0; i < phoneVal.length; i++) {
      if (phoneVal[i] < "0" || phoneVal[i] > "9") {
        onlyDigits = false;
      }
    }

    if (phoneVal.length !== 10 || phoneVal[0] !== "0" || phoneVal[1] !== "9" || !onlyDigits) {
      bookErrorAlert.textContent = "يرجى إدخال رقم هاتف مكون من 10 أرقام ويبدأ بـ 09";
      bookErrorAlert.classList.remove("d-none");
      return;
    }

    if (catVal === "" || eventVal === "") {
      bookErrorAlert.textContent = "يرجى اختيار نوع الفعالية واسم الفعالية.";
      bookErrorAlert.classList.remove("d-none");
      return;
    }

    if (studentCheck.checked && !svuRadio.checked && !otherUniRadio.checked) {
      bookErrorAlert.textContent = "يرجى تحديد الجامعة.";
      bookErrorAlert.classList.remove("d-none");
      return;
    }

    if (seatsVal === "" || seatsVal < 1) {
      bookErrorAlert.textContent = "يرجى إدخال عدد مقاعد صحيح (1 على الأقل).";
      bookErrorAlert.classList.remove("d-none");
      return;
    }

    bookSuccessAlert.classList.remove("d-none");
    bookingForm.reset();
    svuRadio.disabled = true;
    otherUniRadio.disabled = true;

    for (let i = 1; i <= 8; i++) {
      const opt = document.getElementById("book-opt-" + i);
      if (opt) {
        opt.hidden = true;
      }
    }
  });
}

const openBookingIds = ["nav-booking-link", "quick-booking-link", "footer-booking-link"];

for (let i = 0; i < openBookingIds.length; i++) {
  const link = document.getElementById(openBookingIds[i]);
  if (link) {
    link.addEventListener("click", function () {
      localStorage.setItem("openBooking", "true");
    });
  }
}

const eventBookBtn = document.getElementById("event-book-btn");

if (eventBookBtn) {
  eventBookBtn.addEventListener("click", function () {
    localStorage.setItem("openBookingEvent", "event5");
  });
}

const bookingModalBox = document.getElementById("bookingModal");

if (bookingModalBox && localStorage.getItem("openBooking") === "true") {
  localStorage.setItem("openBooking", "false");
  const bookingModal = new bootstrap.Modal(bookingModalBox);
  bookingModal.show();
}

if (bookingModalBox && localStorage.getItem("openBookingEvent") === "event5") {
  localStorage.setItem("openBookingEvent", "");
  const specialCard = document.getElementById("event5");
  const specialOpt = document.getElementById("book-opt-5");
  if (specialCard && bookCatSelect && bookEventSelect && specialOpt) {
    const specialCat = specialCard.getAttribute("data-cat");
    bookCatSelect.value = specialCat;
    for (let i = 1; i <= 8; i++) {
      const opt = document.getElementById("book-opt-" + i);
      const card = document.getElementById("event" + i);
      if (opt.getAttribute("data-cat") === specialCat && card.getAttribute("data-date") >= todayText) {
        opt.hidden = false;
      } else {
        opt.hidden = true;
      }
    }
    specialOpt.hidden = false;
    bookEventSelect.value = "event5";
  }
  const bookingModal = new bootstrap.Modal(bookingModalBox);
  bookingModal.show();
}


/* ======== About page copy student IDs ======== */

const aboutCopyAlert = document.getElementById("about-copy-alert");
const copyAllNamesBtn = document.getElementById("copy-all-names");
const copyAllIdsBtn = document.getElementById("copy-all-ids");

function showAboutCopyMsg(msg) {
  if (!aboutCopyAlert) {
    return;
  }
  aboutCopyAlert.textContent = msg;
  aboutCopyAlert.classList.remove("d-none");

  setTimeout(function () {
    aboutCopyAlert.classList.add("d-none");
  }, 2000);
}

for (let i = 1; i <= 4; i++) {
  const rowCopyBtn = document.getElementById("copy-id-" + i);
  const studentIdCell = document.getElementById("student-id-" + i);

  if (rowCopyBtn && studentIdCell) {
    rowCopyBtn.addEventListener("click", function () {
      navigator.clipboard.writeText(studentIdCell.textContent);
      showAboutCopyMsg("تم نسخ الرقم الجامعي: " + studentIdCell.textContent);
    });
  }
}

if (copyAllNamesBtn) {
  copyAllNamesBtn.addEventListener("click", function () {
    let allText = "";
    for (let i = 1; i <= 4; i++) {
      const nameCell = document.getElementById("student-name-" + i);
      const idCell = document.getElementById("student-id-" + i);
      allText = allText + i + " - " + nameCell.textContent + " - " + idCell.textContent + " - C7\n";
    }
    navigator.clipboard.writeText(allText.trim());
    showAboutCopyMsg("تم نسخ جميع أسماء وأرقام الطلاب بنجاح!");
  });
}

if (copyAllIdsBtn) {
  copyAllIdsBtn.addEventListener("click", function () {
    let idsText = "";
    for (let i = 1; i <= 4; i++) {
      const idCell = document.getElementById("student-id-" + i);
      idsText = idsText + idCell.textContent + "\n";
    }
    navigator.clipboard.writeText(idsText.trim());
    showAboutCopyMsg("تم نسخ جميع الأرقام الجامعية بنجاح!");
  });
}

/* ======== Contact form validation ======== */

const contactForm = document.getElementById("contact-form");
const contactNameInput = document.getElementById("contact-name");
const contactEmailInput = document.getElementById("contact-email");
const contactSubjectInput = document.getElementById("contact-subject");
const contactMessageInput = document.getElementById("contact-message");
const contactErrorAlert = document.getElementById("contact-error-alert");
const contactSuccessAlert = document.getElementById("contact-success-alert");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    contactErrorAlert.classList.add("d-none");
    contactSuccessAlert.classList.add("d-none");

    const nameVal = contactNameInput.value.trim();
    const emailVal = contactEmailInput.value.trim();
    const subjectVal = contactSubjectInput.value.trim();
    const msgVal = contactMessageInput.value.trim();

    if (nameVal === "" || emailVal === "" || subjectVal === "" || msgVal === "") {
      contactErrorAlert.textContent = "يرجى تعبئة جميع الحقول المطلوبة قبل الإرسال.";
      contactErrorAlert.classList.remove("d-none");
      return;
    }

    const atPos = emailVal.indexOf("@");
    const dotPos = emailVal.lastIndexOf(".");
    if (atPos <= 0 || dotPos <= atPos + 1 || dotPos >= emailVal.length - 1 || emailVal.includes(" ")) {
      contactErrorAlert.textContent = "يرجى إدخال بريد إلكتروني صحيح من الشكل name@example.com";
      contactErrorAlert.classList.remove("d-none");
      return;
    }

    contactSuccessAlert.classList.remove("d-none");
    contactForm.reset();
  });
}

/* ======== Event page map switcher and action buttons ======== */

const mapSatImg = document.getElementById("map-sat-img");
const mapToggleBtn = document.getElementById("map-toggle-btn");
const mapViewBadge = document.getElementById("map-view-badge");

function switchMapImage() {
  if (mapSatImg.classList.contains("map-sat-show")) {
    mapSatImg.classList.remove("map-sat-show");
    mapToggleBtn.textContent = "◄";
    if (mapViewBadge) {
      mapViewBadge.textContent = "عرض التخطيط";
    }
  } else {
    mapSatImg.classList.add("map-sat-show");
    mapToggleBtn.textContent = "►";
    if (mapViewBadge) {
      mapViewBadge.textContent = "قمر صناعي";
    }
  }
}

if (mapToggleBtn && mapSatImg) {
  mapToggleBtn.addEventListener("click", switchMapImage);
}


const addCalendarBtn = document.getElementById("add-calendar-btn");

if (addCalendarBtn) {
  addCalendarBtn.addEventListener("click", function () {
    alert("تم إضافة الحدث لتقويمك الجامعي بنجاح");
  });
}

