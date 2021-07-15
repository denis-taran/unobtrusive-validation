interface IFormElement extends HTMLElement {
    value: string;
    type: string;
}
/**
 * List of handlers that will be executed after validation is finished for the submitted form.
 * You can use them to hide/show a spinner or do some additional work.
 */
export declare const validationHandlers: ((evt: Event, succeeded: boolean) => void)[];
/**
 * List of validators used by the library to validate form elements
 */
export declare const validators: ((element: IFormElement) => boolean)[];
export {};
