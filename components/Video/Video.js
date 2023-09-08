document.addEventListener("alpine:init", () => {
  Alpine.data("video", () => ({
    active: false,
    url: "",
    canPlay: false,
    requiredConsent: "third_party",
    showWarning: false,
    allowAutoplay: false,
    playAfterConsent: false,
    init() {
      this.requiredConsent = this.$root.dataset.consentHandle;
      if (this.requiredConsent === "none") {
        this.canPlay = true;
      }
      this.url = this.$root.dataset.url;
    },
    get coverDescription() {
      return this.$refs.coverDescription.dataset.text.replace(
        "[url]",
        this.videoLink()
      );
    },
    giveConsent($event) {
      if ($event.detail.type === this.requiredConsent) {
        this.canPlay = true;
        this.showWarning = false;
        this.allowAutoplay = true;

        if (this.playAfterConsent) {
          this.play();
        }
      }
    },
    removeConsent($event) {
      if ($event.detail.type === this.requiredConsent) {
        this.canPlay = false;
        this.allowAutoplay = false;
        this.playAfterConsent = false;
        this.active = false;
        // remove iframe
        const iFrame = this.$root.querySelector("iframe");
        if (iFrame) {
          iFrame.remove();
        }
      }
    },
    highlightConsent() {
      this.$dispatch("highlight-consent", { type: this.requiredConsent });
      this.playAfterConsent = true;
    },
    consent() {
      this.$dispatch("trigger-consent", { type: this.requiredConsent });
      this.playAfterConsent = true;
    },
    embedUrl() {
      const urlParams = "?rel=0&showinfo=0&autoplay=1";
      const embedUrl = this.$root.dataset.embedUrl;

      return embedUrl + urlParams;
    },
    videoLink() {
      return this.$root.dataset.url;
      return "https://www.youtube.com/watch?v=" + this.videoId();
    },
    videoUrl() {
      return this.$root.dataset.url;
    },
    get type() {
      return this.$root.dataset.type;
    },
    videoId() {
      if (this.type === "vimeo") {
        return new URL(this.url).pathname.replace("/", "");
      }

      var regExp =
        /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      var match = this.url.match(regExp);
      return match && match[7].length == 11 ? match[7] : false;
    },
    thumbnailUrl() {
      let url = `/thumbnail/${
        this.type
      }/${this.videoId()}.jpg?url=${this.videoUrl()}`;
      return url;
    },
    play() {
      if (this.canPlay) {
        this.allowAutoplay = true;
        this.active = true;
      } else {
        this.showWarning = true;
      }
    },
  }));
});
