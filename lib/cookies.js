"use strict";

const SECONDS_IN_A_YEAR = 864e5;

/**
 * Cookies class to handle all of them cookie interactions.
 */
window.Cookies = class {
  /**
   * Get a Cookie by it's key
   * @param  {[type]} key           [description]
   * @param  {String} [fallback=''] [description]
   * @return {[type]}               [description]
   */
  static get(key, fallback = "") {
    return (
      document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)")?.pop() ||
      fallback
    );
  }

  /**
   * Set a cookie.
   * @param {[type]} key           [description]
   * @param {[type]} value         [description]
   * @param {Number} [expires=365] [description]
   * @param {String} [path='/']    [description]
   */
  static set(key, value, expires = 365, path = "/") {
    let expirationDate = new Date(new Date() * 1 + expires * SECONDS_IN_A_YEAR);

    key = encodeURIComponent(String(key))
      .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape);

    value = encodeURIComponent(String(value)).replace(
      /%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,
      decodeURIComponent
    );

    return (document.cookie =
      key +
      "=" +
      value +
      "; expires=" +
      expirationDate.toUTCString() +
      "; path=/");
  }
};

export const Cookies = window.Cookies;
