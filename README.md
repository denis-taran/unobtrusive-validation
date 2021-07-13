# Unobtrusive validation library without dependencies

Demo:

https://kraaden.github.io/unobtrusive-validation/

This small package allows you to add validation properties to HTML tags without writing any client-side code.

The library is compatible with unobtrusive validation library used in `ASP.NET`, but it doesn't require JQuery.



Use the following command to install the library:

    npm install --save-dev unobtrusive-validation

If you don't use NPM, just include `index.min.js` into your HTML file and it should work out of the box.

You will also need to include the provided stylesheet located in the `index.css` file. As an alternative you can define the class `.field-validation-error` directly in your codebase without importing the file.

## Execute a function after validation

You can execute a function after validation to perform some additional work. For example, you can show/hide a spinner that prevents double submits:

```javascript
    // if you use a module bundler

    import { form_validation_handlers } from 'unobtrusive-validation';

    form_validation_handlers.push(function(evt, succeeded) {
        if (!succeeded) {
            hideSpinner();
        }
    });

    // without using a module bundler

    const handlers = window["unobtrusive-validation"].form_validation_handlers;

    handlers.push(function(evt, succeeded) {
        if (!succeeded) {
            hideSpinner();
        }
    });
```

## Validation Attributes

|Attribute|Explanation|
|-|-|
|`data-val="true"`|Enable unobtrusive validation on this element. This attribute must be on every input element you want to validate.|
|`data-val-required="error message"`|The input must have a value|
|`data-val-length="err msg", data-val-length-min="10", data-val-length-max="20"`|The provided string must have the specified length|
|`data-val-number="err. msg."`|The input must be an integer number|
|`data-val-equalto="err. msg.", data-val-equalto-other="FieldName"`|Both fields must have the same value|
|`data-val-regex="err. msg", data-val-regex-pattern="^regex$"`|The field must match the regex pattern.|

The original validation library also provides some additional rarely-used attributes, but they are currently not supported.

## ASP.NET

`ASP.NET` will automatically add the required validation attributes to the generated HTML. You only need to mark all model properties with the corresponding attributes:

    public class AddUserVM
    {
        [DisplayName("First Name:")]
        [Required]
        public string FirstName { get; set; }
        
        [DisplayName("Last Name:")]
        [Required]
        public string LastName { get; set; }
    }

Then add the `asp-for` attribute to your HTML as shown below:

    <input type="text" asp-for="FirstName" />

## License

The library is released under the MIT License.

Copyright (c) 2021 - Denys Krasnoshchok

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
