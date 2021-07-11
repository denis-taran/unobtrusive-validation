(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['unobtrusive-validation'] = {}));
}(this, (function (exports) { 'use strict';

  /*
   * https://github.com/kraaden/unobtrusive-validation
   * Copyright (c) 2016 Denys Krasnoshchok
   * MIT License
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
  window.addEventListener('DOMContentLoaded', function () {
      var elements = document.querySelectorAll('form');
      [].forEach.call(elements, function (form) {
          form.addEventListener("submit", function (ev) {
              if (!validateForm(form)) {
                  if (failed_validation_handler) {
                      failed_validation_handler(ev);
                  }
                  ev.preventDefault();
                  return;
              }
              if (successful_validation_handler) {
                  successful_validation_handler(ev);
              }
              var buttons = form.querySelectorAll("button[data-prevent-double-submit]");
              [].forEach.call(buttons, function (button) {
                  button.setAttribute("disabled", "disabled");
              });
          });
      });
  });

  exports.validators = validators;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
