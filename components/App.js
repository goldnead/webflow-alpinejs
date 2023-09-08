window.App = {
  components: [],
  readyCallback: null,
  $alpine: null,
  plugins: [],
  mount(alpine) {
    this.$alpine = alpine;
    window.Alpine = alpine;
    return this;
  },
  start() {
    if (!this.$alpine) {
      this.$alpine = window.Alpine;
    }
    // wait until the DOM is ready
    if (document.readyState != "loading") {
      // now load all registered components
      this.loadAllRegisteredComponents();

      // if we've got a ready callback, now is the time to execute it.
      if (this.readyCallback) {
        this.readyCallback();
      }

      // load Alpine-Plugins
      this.loadPlugins();

      // start Alpine
      this.$alpine.start();
    } else {
      // If DOM is not ready, wait until it is and continue.
      document.addEventListener("DOMContentLoaded", () => {
        this.loadAllRegisteredComponents;
      });
    }
    return this;
  },
  // register a plugin to be used with alpine
  usePlugin(plugin) {
    this.plugins.push(plugin);
    return this;
  },
  // initialize all registered alpine plugins
  loadPlugins() {
    this.plugins.forEach((plugin) => {
      this.$alpine.plugin(plugin);
    });
  },
  // Registers an array of components into the components-container
  register(components) {
    if (Array.isArray(components)) {
      components.forEach((item, i) => {
        if (item.childComponents) {
          this.register(item.childComponents);
        }
        this.components.push(item);
      });
      // Only for debugging component registration
      window.components = this.components;
    }
    return this;
  },
  // returns true if a given selector exists in the DOM
  hasComponent(selector) {
    return document.querySelectorAll(selector).length > 0;
  },
  // loads all components that have been registered into the components-container.
  loadAllRegisteredComponents() {
    this.components.forEach((module, i) => {
      this.loadComponent(module);
    });
    return this;
  },
};
