(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['unobtrusive-validation'] = {}));
}(this, (function (exports) { 'use strict';

  /*
   * https://github.com/kraaden/unobtrusive-validation
   * Copyright (c) 2021 - Denys Krasnoshchok
   * MIT License
   */
  /**
   * List of handlers that will be executed after validation is finished for the submitted form.
   * You can use them to hide/show a spinner or do some additional work.
   */
  var validationHandlers = [];
  /**
   * List of validators used by the library to validate form elements.
   * You can add you own validators when needed.
   */
  var validators = [];
  function getElementValue(element) {
      return element.value;
  }
  function findContainer(element) {
      return document.querySelector("span[data-valmsg-for='" + element.getAttribute("name") + "']");
  }
  function isInt(value) {
      return !isNaN(value) && Number.isInteger(parseFloat(value));
  }
  function clearError(element) {
      var container = findContainer(element);
      if (container) {
          while (container.firstChild) {
              var child = container.firstChild;
              var parent_1 = child.parentNode;
              if (parent_1) {
                  parent_1.removeChild(child);
              }
          }
          container.classList.add("data-validation-valid");
      }
  }
  function validateElement(element) {
      var success = true;
      for (var _i = 0, validators_1 = validators; _i < validators_1.length; _i++) {
          var validator = validators_1[_i];
          success = success && validator(element);
      }
      if (success) {
          clearError(element);
      }
      return success;
  }
  function showError(element, message) {
      clearError(element);
      var container = findContainer(element);
      if (container) {
          container.textContent = message;
          container.classList.add("field-validation-error");
      }
  }
  function requiredValidator(element) {
      var message = element.getAttribute("data-val-required");
      if (message) {
          var val = getElementValue(element).trim();
          if (!val) {
              showError(element, message);
              return false;
          }
      }
      return true;
  }
  function numberValidator(element) {
      var message = element.getAttribute("data-val-number");
      if (message) {
          var val = getElementValue(element).trim();
          if (!isInt(val)) {
              showError(element, message);
              return false;
          }
      }
      return true;
  }
  function lengthValidator(element) {
      var errorMsg = element.getAttribute("data-val-length");
      var minlen = element.getAttribute("data-val-length-min");
      var maxlen = element.getAttribute("data-val-length-max");
      var value = getElementValue(element);
      if (errorMsg && value) {
          if (maxlen) {
              var max = parseInt(maxlen, 10);
              if (value.length > max) {
                  showError(element, errorMsg);
                  return false;
              }
          }
          if (minlen) {
              var min = parseInt(minlen, 10);
              if (value.length < min) {
                  showError(element, errorMsg);
                  return false;
              }
          }
      }
      return true;
  }
  function regexValidator(element) {
      var errorMsg = element.getAttribute("data-val-regex");
      var regexPattern = element.getAttribute("data-val-regex-pattern");
      var value = getElementValue(element);
      if (errorMsg && regexPattern && value) {
          if (!value.match("^" + regexPattern + "$")) {
              showError(element, errorMsg);
              return false;
          }
      }
      return true;
  }
  function equalityValidator(element) {
      var errorMsg = element.getAttribute("data-val-equalto");
      var other = element.getAttribute("data-val-equalto-other") || "";
      var name = other.replace(/[^0-9a-zA-Z_]/g, '');
      if (name) {
          var anotherField = document.querySelector("[name='" + name + "']");
          if (errorMsg && anotherField) {
              if (anotherField.value !== element.value) {
                  showError(element, errorMsg);
                  return false;
              }
          }
      }
      return true;
  }
  function rangeValidator(element) {
      var errorMsg = element.getAttribute("data-val-range");
      var minval = element.getAttribute("data-val-range-min");
      var maxval = element.getAttribute("data-val-range-max");
      var value = getElementValue(element);
      if (errorMsg && isInt(value)) {
          var number = parseInt(value, 10);
          if (minval) {
              var min = parseInt(minval, 10);
              if (number < min) {
                  showError(element, errorMsg);
                  return false;
              }
          }
          if (maxval) {
              var max = parseInt(maxval, 10);
              if (number > max) {
                  showError(element, errorMsg);
                  return false;
              }
          }
      }
      return true;
  }
  function addChangeListener(element) {
      if (element.nodeName === "TEXTAREA") {
          element.addEventListener("keyup", function () {
              validateElement(element);
          });
          return;
      }
      if (element.nodeName === "INPUT") {
          var input_1 = element;
          if (input_1.type === "text" || input_1.type === "password") {
              input_1.addEventListener("keyup", function () {
                  validateElement(input_1);
              });
              return;
          }
      }
      if (element.nodeName === "SELECT") {
          var select_1 = element;
          select_1.addEventListener("change", function () {
              validateElement(select_1);
          });
      }
  }
  function validateForm(form) {
      var valid = true;
      var submit = form.getAttribute("data-submitted");
      if (!submit) {
          form.setAttribute("data-submitted", "true");
      }
      var inputs = form.querySelectorAll("input, textarea, select");
      [].forEach.call(inputs, function (input) {
          if (input.type === "hidden") {
              return;
          }
          if (!submit) {
              addChangeListener(input);
          }
          var current = validateElement(input);
          valid = valid && current;
      });
      return valid;
  }
  validators.push(requiredValidator);
  validators.push(lengthValidator);
  validators.push(regexValidator);
  validators.push(rangeValidator);
  validators.push(numberValidator);
  validators.push(equalityValidator);
  function executeHandlers(evt, succeeded) {
      for (var _i = 0, validationHandlers_1 = validationHandlers; _i < validationHandlers_1.length; _i++) {
          var handler = validationHandlers_1[_i];
          handler(evt, succeeded);
      }
  }
  window.addEventListener('DOMContentLoaded', function () {
      var elements = document.querySelectorAll('form');
      [].forEach.call(elements, function (form) {
          form.addEventListener("submit", function (ev) {
              if (!validateForm(form)) {
                  executeHandlers(ev, false);
                  ev.preventDefault();
                  return;
              }
              executeHandlers(ev, true);
          });
      });
  });

  exports.validationHandlers = validationHandlers;
  exports.validators = validators;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
