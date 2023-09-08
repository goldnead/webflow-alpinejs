document.addEventListener("alpine:init", () => {
  Alpine.data("preheader", () => ({
    showPreheader: Alpine.$persist(true),
    showAgain: Alpine.$persist(false),
    init() {
      console.log(this, Alpine, this.$persist);
      console.log(this.showPreheader);
    },
    close() {
      console.log("close?");
      if (!this.showAgain) {
        this.showPreheader = false;
      }
    },
    hide() {
      console.log("hide?");
      this.$root.style.display = "none";
    },
  }));
});
