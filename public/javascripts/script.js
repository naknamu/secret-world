"use-strict";

/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
};

/**
 * NAVBAR TOGGLE FOR MOBILE
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
};

addEventOnElements(navTogglers, "click", toggleNavbar);

/**
 * Display account details when clicked
 */

const accountLink = document.querySelector("[data-account-link]");
const accountDetails = document.querySelector("[data-account-details]");

const handleEvent = () => {
  // Toggle class to active to add some style
  accountDetails.classList.toggle('active')
}


if (accountLink) {
  accountLink.addEventListener("click", handleEvent); 
  //for hover
  // accountLink.addEventListener("mouseenter", handleEvent); 
  // accountLink.addEventListener("mouseleave", handleEvent);
}




