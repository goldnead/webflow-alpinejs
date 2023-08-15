export const trackLinks = () => {
  let links = document.querySelectorAll("[data-pio]");
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", handleLinkEvent);
    links[i].addEventListener("auxclick", handleLinkEvent);
  }

  function handleLinkEvent(event) {
    var link = event.target;
    var middle = event.type == "auxclick" && event.which == 2;
    var click = event.type == "click";
    while (
      link &&
      (typeof link.tagName == "undefined" ||
        link.tagName.toLowerCase() != "a" ||
        !link.href)
    ) {
      link = link.parentNode;
    }
    if (middle || click) {
      let attributes = link.getAttribute("data-pio").split(/,(.+)/);
      let events = [
        JSON.parse(attributes[0]),
        JSON.parse(attributes[1] || "{}"),
      ];
      plausible(...events);
    }
    if (!link.target) {
      if (!(event.ctrlKey || event.metaKey || event.shiftKey) && click) {
        setTimeout(function () {
          location.href = link.href;
        }, 150);
        event.preventDefault();
      }
    }
  }
};

const Analytics = () => {
  trackLinks();
};

export default Analytics;