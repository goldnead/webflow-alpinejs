/**
 * * Selection from https://github.com/CodyHouse/codyhouse-framework/blob/master/main/assets/js/util.js
 *
 *	class manipulation functions
 */
export const hasClass = (el, className) => {
  if (el.classList) return el.classList.contains(className);
  else
    return !!el.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
};

export const addClass = (el, className) => {
  var classList = className.split(" ");
  if (el.classList) el.classList.add(classList[0]);
  else if (!hasClass(el, classList[0])) el.className += " " + classList[0];
  if (classList.length > 1) addClass(el, classList.slice(1).join(" "));
};

export const removeClass = (el, className) => {
  var classList = className.split(" ");
  if (el.classList) el.classList.remove(classList[0]);
  else if (hasClass(el, classList[0])) {
    var reg = new RegExp("(\\s|^)" + classList[0] + "(\\s|$)");
    el.className = el.className.replace(reg, " ");
  }
  if (classList.length > 1) removeClass(el, classList.slice(1).join(" "));
};

export const toggleClass = (el, className, bool) => {
  if (bool) addClass(el, className);
  else removeClass(el, className);
};

/*
	Smooth Scroll
*/
export const scrollTo = (final, duration, cb, scrollEl) => {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;

  if (!scrollEl) start = window.scrollY || document.documentElement.scrollTop;

  var animateScroll = (timestamp) => {
    if (!currentTime) currentTime = timestamp;
    var progress = timestamp - currentTime;
    if (progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final - start, duration);
    element.scrollTo(0, val);
    if (progress < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/*
	Animate height of an element
*/
export const animateHeight = function (start, to, element, duration, cb) {
  var change = to - start,
    currentTime = null;

  var animateHeight = function (timestamp) {
    if (!currentTime) currentTime = timestamp;
    var progress = timestamp - currentTime;
    if (progress > duration) progress = duration;
    //var val = parseInt((progress / duration) * change + start);
    var val = Math.easeInOutQuad(progress, start, change, duration);
    element.style.height = val + "px";
    if (progress < duration) {
      window.requestAnimationFrame(animateHeight);
    } else {
      if (cb) cb();
    }
  };

  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start + "px";
  window.requestAnimationFrame(animateHeight);
};

export const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  }
};

export const detectDeviceType = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
    ? "Mobile"
    : "Desktop";

/*
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};
/**
 * HTML to elements
 *
 * @param html
 * @returns {NodeListOf<ChildNode>}
 */
export const htmlToElements = (html) => {
  let template = document.createElement("template");
  template.innerHTML = html;
  return template.content.childNodes;
};

/**
 * Set the banner message that pops up
 *
 * @param elements
 * @param type
 */
export const bannerMessage = (elements, type = "success", timeout = 6000) => {
  const banner = document.getElementById("ss-banner-message");

  // remove if there is already content + unhide banner
  banner.innerHTML = "";
  banner.classList.remove("hidden");

  // Set type
  if (type === "error") {
    banner.classList.add("bg-red-400");
  } else {
    banner.classList.add("bg-green-400");
  }

  // Append elements
  elements.forEach((el) => {
    banner.appendChild(el);
  });

  // Hide after timeout
  setTimeout(() => {
    banner.innerHTML = "";
    banner.classList.remove("bg-red-300", "bg-green-300");
    banner.classList.add("hidden");
  }, timeout);
};

/**
 * Format the currency of the output in the table.
 * You can use toFixed or Intl.NumberFormatter here.
 *
 * @param price
 * @returns {string}
 */
export const formatCurrency = (price) => {
  return "£" + parseFloat(price).toFixed(2);
};

/**
 * Debounce used to stop quantity update of cart
 * being triggered multiple times in quick succession
 * @param {*} func
 * @param {*} wait
 * @param {*} context
 * @param {*} immediate
 */
export const debounce = (callback, wait = 0, context, immediate) => {
  let timeout;
  if (immediate && typeof immediate === "function") {
    immediate.call(context);
  }

  return (...args) => {
    context = context ?? this;
    clearTimeout(timeout);
    timeout = setTimeout(() => callback.apply(context, args), wait);
  };
};

export const slugify = (text, separator) => {
  text = text.toString().toLowerCase().trim();

  const sets = [
    { to: "a", from: "[ÀÁÂÃÅÆĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶ]" },
    { to: "ae", from: "[Ä]" },
    { to: "c", from: "[ÇĆĈČ]" },
    { to: "d", from: "[ÐĎĐÞ]" },
    { to: "e", from: "[ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ]" },
    { to: "g", from: "[ĜĞĢǴ]" },
    { to: "h", from: "[ĤḦ]" },
    { to: "i", from: "[ÌÍÎÏĨĪĮİỈỊ]" },
    { to: "j", from: "[Ĵ]" },
    { to: "ij", from: "[Ĳ]" },
    { to: "k", from: "[Ķ]" },
    { to: "l", from: "[ĹĻĽŁ]" },
    { to: "m", from: "[Ḿ]" },
    { to: "n", from: "[ÑŃŅŇ]" },
    { to: "o", from: "[ÒÓÔÕØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ]" },
    { to: "oe", from: "[ŒÖ]" },
    { to: "p", from: "[ṕ]" },
    { to: "r", from: "[ŔŖŘ]" },
    { to: "s", from: "[ŚŜŞŠ]" },
    { to: "ss", from: "[ß]" },
    { to: "t", from: "[ŢŤ]" },
    { to: "u", from: "[ÙÚÛŨŪŬŮŰŲỤỦỨỪỬỮỰƯ]" },
    { to: "ue", from: "[Ü]" },
    { to: "w", from: "[ẂŴẀẄ]" },
    { to: "x", from: "[ẍ]" },
    { to: "y", from: "[ÝŶŸỲỴỶỸ]" },
    { to: "z", from: "[ŹŻŽ]" },
    { to: "-", from: "[·/_,:;']" },
  ];

  sets.forEach((set) => {
    text = text.replace(new RegExp(set.from, "gi"), set.to);
  });

  text = text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text

  if (typeof separator !== "undefined" && separator !== "-") {
    text = text.replace(/-/g, separator);
  }

  return text;
};

const isSameOrigin = (url) =>
  new URL(url, window.location.href).origin === window.location.origin;

const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
const isMobile = navigator.userAgent.includes("Mobi");

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const decodeBase64 = (base64) =>
  new TextDecoder().decode(
    new Uint8Array(
      atob(base64)
        .split("")
        .map((char) => char.charCodeAt(0))
    )
  );

const encodeBase64 = (str) =>
  btoa(
    Array.from(new TextEncoder().encode(str))
      .map((n) => String.fromCharCode(n))
      .join("")
  );

  export const getScrollTop = () => {
    return window.scrollY || window.pageYOffset || document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0);
  }