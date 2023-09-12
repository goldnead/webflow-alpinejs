document.addEventListener("alpine:init", () => {
  Alpine.data("session", () => ({
    fetched: false,
    session: null,
    get id() {
      return this.params.get("id");
    },
    init() {
      const queryString = window.location.search;
      this.params = new URLSearchParams(queryString);
      fetch(
        "https://api.adriangoldner.com/api/sessions/stimmanalyse/" + this.id
      )
        .then((resp) => resp.json())
        .then((resp) => {
          this.fetched = true;
          this.session = resp;
          console.log(this.session);
        })
        .catch(() => {
          this.fetched = false;
        });
      console.log(this);
    },
    get eventURL() {
      return "https://cal.com/booking/" + this.id;
    },
    get didOnboard() {
      if (!this.fetched) {
        return false;
      }
      return this.session.Onboarding;
    },
    get meetingURL() {
      if (!this.fetched) {
        return false;
      }
      return this.session["Meeting URL"];
    },
    get onboardingURL() {
      if (!this.fetched) {
        return false;
      }
      return this.session["Meeting URL"];
    },
    get status() {
      if (!this.fetched) {
        return false;
      }
      return this.session.Status;
    },
    get testimonial() {
      if (!this.fetched) {
        return false;
      }
      return this.session.Testimonial;
    },
    get name() {
      if (!this.fetched) {
        return false;
      }
      return this.session.Kunde.Name;
    },
  }));
});
