 /*
  * https://github.com/kraaden/unobtrusive-validation
  * Copyright (c) 2016 Denys Krasnoshchok
  * MIT License
  */

interface IFormElement extends HTMLElement {
    value: string;
    type: string;
}

export const validators: ((element: IFormElement) => boolean)[] = [];

export declare var failed_validation_handler: (e: Event) => void;
export declare var successful_validation_handler: (e: Event) => void;

function getElementValue(element: IFormElement): string {
    return element.value;
}

function findContainer(element: HTMLElement): HTMLSpanElement | null {
    return document.querySelector(`span[data-valmsg-for='${element.getAttribute("name")}']`) as HTMLSpanElement | null;
}

function isInt(value: string): boolean {
    return !isNaN(value as any) && Number.isInteger(parseFloat(value));
}

function clearError(element: HTMLElement) {
    const container = findContainer(element);
    if (container) {
        while (container.firstChild) {
            const child = container.firstChild;
            const parent = child.parentNode;
            if (parent) {
                parent.removeChild(child);
            }
        }
        container.classList.add("data-validation-valid");
    }
}

function validateElement(element: IFormElement): boolean {
    let success = true;
    for (const validator of validators) {
        success = success && validator(element);
    }
    if (success) {
        clearError(element);
    }
    return success;
}

function showError(element: HTMLElement, message: string) {
    clearError(element);
    const container = findContainer(element);
    if (container) {
        container.textContent = message;
        container.classList.add("field-validation-error");
    }
}

function requiredValidator(element: IFormElement): boolean {
    const message = element.getAttribute("data-val-required");
    if (message) {
        const val = getElementValue(element).trim();
        if (!val) {
            showError(element, message);
            return false;
        }
    }
    return true;
}

function lengthValidator(element: IFormElement): boolean {
    const errorMsg = element.getAttribute("data-val-length");
    const minlen = element.getAttribute("data-val-length-min");
    const maxlen = element.getAttribute("data-val-length-max");
    const value = getElementValue(element);
    if (errorMsg && value) {
        if (maxlen) {
            const max = parseInt(maxlen, 10);
            if (value.length > max) {
                showError(element, errorMsg);
                return false;
            }
        }
        if (minlen) {
            const min = parseInt(minlen, 10);
            if (value.length < min) {
                showError(element, errorMsg);
                return false;
            }
        }
    }
    return true;
}

function regexValidator(element: IFormElement): boolean {
    const errorMsg = element.getAttribute("data-val-regex");
    const regexPattern = element.getAttribute("data-val-regex-pattern");
    const value = getElementValue(element);
    if (errorMsg && regexPattern && value) {
        if (!value.match(`^${regexPattern}$`)) {
            showError(element, errorMsg);
            return false;
        }
    }
    return true;
}

function rangeValidator(element: IFormElement): boolean {
    const errorMsg = element.getAttribute("data-val-range");
    const minval = element.getAttribute("data-val-range-min");
    const maxval = element.getAttribute("data-val-range-max");
    const value = getElementValue(element);

    if (errorMsg && isInt(value)) {
        const number = parseInt(value, 10);
        if (minval) {
            const min = parseInt(minval, 10);
            if (number < min) {
                showError(element, errorMsg);
                return false;
            }
        }
        if (maxval) {
            const max = parseInt(maxval, 10);
            if (number > max) {
                showError(element, errorMsg);
                return false;
            }
        }
    }
    return true;
}

function addChangeListener(element: HTMLElement) {
    if (element.nodeName === "TEXTAREA") {
        element.addEventListener("keyup", () => {
            validateElement(element as HTMLTextAreaElement);
        });
        return;
    }
    if (element.nodeName === "INPUT") {
        const input = element as HTMLInputElement;
        if (input.type === "text" || input.type === "password") {
            input.addEventListener("keyup", () => {
                validateElement(input);
            });
            return;
        }
    }
    if (element.nodeName === "SELECT") {
        const select = element as HTMLSelectElement;
        select.addEventListener("change", () => {
            validateElement(select);
        });
    }
}

function validateForm(form: HTMLFormElement): boolean {
    let valid = true;
    const submit = form.getAttribute("data-submitted");
    
    if (!submit) {
        form.setAttribute("data-submitted", "true");
    }

    var inputs = form.querySelectorAll<HTMLInputElement>("input, textarea, select");

    [].forEach.call(inputs, function(input: HTMLInputElement) {
        if (input.type === "hidden") {
            return;
        }
        if (!submit) {
            addChangeListener(input);
        }
        const current = validateElement(input);
        valid = valid && current;
    });
    
    return valid;
}

validators.push(requiredValidator);
validators.push(lengthValidator);
validators.push(regexValidator);
validators.push(rangeValidator);

window.addEventListener('DOMContentLoaded', function() {
    var elements = document.querySelectorAll<HTMLFormElement>('form');

    [].forEach.call(elements, function(form: HTMLFormElement) {
        form.addEventListener("submit", function(ev) {
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
            [].forEach.call(buttons, function(button: HTMLButtonElement) {
                button.setAttribute("disabled", "disabled");
            });
        });
    });
});