/**
 * CookieConsent.js
 *
 * This Script intializes all cookies that are set for a given consent-type.
 *
 * All cookie-related Data has to be placed inside a template-tag like this:
 *
 * <template data-type="consent" data-consent-type="marketing">
 *   <script>console.log('hello');</script>
 *   <div className="pixel">
 *     <!-- Stuff like tracking pixels or iframes -->
 *   </div>
 * </template>
 *
 * "data-consent-type" is being used to categorize the cookies.
 * So for all cookies that are inisde the "marketing" template
 * will be triggered when the user activates marketing-cookies.
 *
 * On activation all JS inside script-tags will be fired immediately
 * as well as pixel-elements will be placed on top of the body-tag
 * inside a node with the id #pixel-container.
 */
import { Cookies } from "../../lib/cookies";

const CookieConsent = () => ({
  // object storing all them script tags by type name
  scriptTags: {},
  // prefix for stoeing the cookies in
  get prefix() {
    return (this.$root.dataset.site || "cookies") + "-";
  },
  // is Cookie open
  isOpen: true,
  // all the cookie types. So far only two of them
  types: {},

  tooltip: null,

  lockedType: "basic",

  hasConsent: false,

  init(types = null) {
    if (!types || types.length === 0) return;

    this.types = types;
    // register all the script tags that would be loaded after consenting
    this.registerTemplates();
    // if the user has already consented just run the appropriate scripts
    if (this.hasAlreadyConsented()) {
      // Update the internal model so the user sees the correct consents in the modal.
      this.updateModel();
      // load all script tags the user consented to
      this.loadTags();
      // then close modal
      this.isOpen = false;
    }
  },

  getCookieTypes() {
    console.log(this.$el);
  },

  // close modal
  close() {
    if (this.hasAlreadyConsented()) {
      this.isOpen = false;
    }
  },

  open() {
    this.isOpen = true;
  },

  highlight($event) {
    this.open();
    this.tooltip = $event.detail.type;
    if (this.$refs[$event.detail.type]) {
      this.$refs[$event.detail.type].classList.add("cc__checkbox--highlight");
    }
  },

  removeHighlights() {
    this.tooltip = null;
    Object.keys(this.types).forEach((type) => {
      this.$refs[type].classList.remove("cc__checkbox--highlight");
    });
  },

  clearAll() {
    this.clear();
  },

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  },

  updateModel() {
    Object.keys(this.types).forEach((type) => {
      if (this.consentExistsFor(type)) {
        this.types[type] = true;
      } else {
        this.types[type] = false;
      }
    });
  },

  /**
   * Determines if user already consented to our cookie policy.
   *
   * @return {Boolean} [description]
   */
  hasAlreadyConsented() {
    let consented = [];
    Object.keys(this.types).forEach((type) => {
      consented.push(this.consentExistsFor(type));
      if (this.consentExistsFor(type)) {
        this.$dispatch("consent", { type: type });
      }
    });
    this.hasConsent = consented.includes(true);
    return consented.includes(true);
  },

  /**
   * Does a Cookie already exist for a given consent type?
   *
   * @param  {[type]} consentType [description]
   * @return {[type]}             [description]
   */
  consentExistsFor(consentType) {
    return Cookies.get(this.prefix + consentType) === "true";
  },

  /**
   * Selects all the script tags and stores them in the scriptTags-object.
   *
   * @return void
   */
  registerTemplates() {
    const tags = document.querySelectorAll('template[data-type="consent"]');

    if (tags.length === 0) return;

    tags.forEach((item, i) => {
      this.scriptTags[item.dataset.consentType] = item;
    });
  },

  /**
   * Is the given node a script-tag?
   *
   * @param  {[type]}  node [description]
   * @return {Boolean}      [description]
   */
  isScript(node) {
    return node.nodeName === "SCRIPT";
  },

  /**
   * Is the given node a pixel element?
   *
   * @param  {[type]}  node [description]
   * @return {Boolean}      [description]
   */
  isPixel(node) {
    return node.classList.contains("pixel");
  },

  /**
   * Load & initialize the script tags that the user consented to.
   */
  loadTags() {
    // iterate through all available templates
    Object.keys(this.scriptTags).forEach((type, index) => {
      const template = this.scriptTags[type];
      // get all nodes inside the template that are script tags or
      // elements with class .pixel
      const nodes = template.content
        .cloneNode(true)
        .querySelectorAll("script, .pixel");
      // if a consent already exists for this type of cookies...
      if (this.consentExistsFor(type)) {
        // ...go through all ndoes and scripts and activate them
        Object.keys(nodes).forEach((i) => {
          const node = nodes[i];
          this.loadScriptOrPixel(node);
        });
      }
    });
  },

  /**
   * Loads the corresponding tags by script or pixel
   * @param  {[type]} node [description]
   * @return {[type]}      [description]
   */
  loadScriptOrPixel(node) {
    if (this.isScript(node)) {
      this.loadScriptTag(node);
    } else if (this.isPixel(node)) {
      this.loadPixel(node);
    }
  },

  /**
   * Returns true if a type is currently selected.
   *
   * @param  {[type]}  type [description]
   * @return {Boolean}      [description]
   */
  isSelected(type) {
    return this.types[type] === true;
  },

  /**
   * Approve to a specific consent type.
   *
   * @param  {[type]} consentType [description]
   * @return {[type]}             [description]
   */
  consent(consentType) {
    Cookies.set(this.prefix + consentType, true);
    this.$dispatch("consent", { type: consentType });
  },

  triggerConsent(e) {
    const consentType = e.detail.type;

    if (!consentType) return;

    this.consent(consentType);
    this.updateModel();
  },

  optout(consentType) {
    if (consentType === this.lockedType) return;
    this.types[consentType] = false;
    Cookies.set(this.prefix + consentType, false);
    this.$dispatch("unconsent", { type: consentType });
  },

  /**
   * Loads a given script tag and calls it's content in a callback.
   *
   * @param  {[type]} node [description]
   * @return {[type]}      [description]
   */
  loadScriptTag(node) {
    if (node.attributes.length > 0) {
      let prom = new Promise((resolve, reject) => {
        var s;
        s = document.createElement("script");
        s.src = node.src;

        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    } else if (node) {
      const callback = Function(node.text);
      callback();
    }
  },

  /**
   * Loads a non-script tag, like an ifram or a image into a container
   * element in the DOM.
   *
   * @param  {[type]} pixel [description]
   * @return {[type]}       [description]
   */
  loadPixel(pixel) {
    if (pixel) {
      const container = document.getElementById("pixel-container");
      container.appendChild(pixel);
    }
  },

  /**
   * Consents to all types that are currently selected.
   *
   * @return {[type]} [description]
   */
  consentToSelectedTypes() {
    Object.keys(this.types).forEach((type, index) => {
      if (this.isSelected(type)) {
        this.consent(type);
      } else {
        this.optout(type);
      }
    });
    this.loadTags();
  },

  clear() {
    Object.keys(this.types).forEach((type, index) => {
      this.optout(type);
    });
    this.submit();
  },

  /**
   * Submits the users consent choice and consents accordingly.
   *
   * @return {[type]} [description]
   */
  submit() {
    this.removeHighlights();
    setTimeout(() => {
      this.consentToSelectedTypes();
      this.$dispatch("notice:info", {
        message: "Vielen Dank, deine Einstellungen wurden gespeichert.",
      });
      this.close();
    }, 500);
  },

  /**
   * Select & consent to all cookies.
   * @return {[type]} [description]
   */
  selectAll() {
    Object.keys(this.types).forEach((index) => {
      this.types[index] = true;
    });
    this.submit();
  },
});

document.addEventListener("alpine:init", () => {
  Alpine.data("cookieconsent", () => CookieConsent);
});
