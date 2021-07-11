interface IFormElement extends HTMLElement {
    value: string;
    type: string;
}
export declare const validators: ((element: IFormElement) => boolean)[];
export declare var failed_validation_handler: (e: Event) => void;
export declare var successful_validation_handler: (e: Event) => void;
export {};
