function setModifierClass(element, mod) {
    if (mod.length > 0 && !element.classList.contains(mod))
        element.classList.add(mod);
}

function removeModifierClass(element, mod) {
    if (element.classList.contains(mod))
        element.classList.remove(mod);
}

function removeClassModifiers(element) {
    let classes = element.className.split(' ');

    if (classes.length > 1)
        element.className = classes[0];
}

class ValidatableInputField {

    //  name: [string] name of field. eg. 'email'
    //  validationTypes: [string] space separated list of validation methods to use. eg. 'empty' or 'empty email'
    //  container: [HTMLElement] input-div that contains the fields and the error elements
    //  input: [HTMLElement] text field element
    constructor(name, validationTypes, container, input, errorMessage) {
        this.name = name;
        this.validationTypes = validationTypes;
        this.container = container;
        this.input = input;
        this.errorMessage = errorMessage;

        this.validationState = true;
    }

    validate() {
        this.resetValidationState();

        this.validationTypes.includes('empty') ? this.validateEmpty() : null;
        this.validationTypes.includes('email') ? this.validateEmail() : null;
    }

    validateEmpty() {
        let value = this.input.value.trim();

        this.setValidationState(value.length != 0);

        if (!this.isValid())
            this.errorMessage.innerText = 'This field is required';
    }

    validateEmail() {
        var tester = document.createElement('input');

        tester.type = 'email';
        tester.value = this.input.value.trim();

        this.setValidationState(typeof tester.checkValidity === 'function' ? tester.checkValidity()
            : /\S+@\S+\.\S+/.test(tester.value));

        if (!this.isValid())
            this.errorMessage.innerText = 'Enter a valid email address';
    }

    setValidationState(valid) {
        this.validationState = valid;

        if (!valid)
            setModifierClass(this.container, 'error');
    }

    resetValidationState() {
        this.validationState = true;

        removeModifierClass(this.container, 'error');
    }

    isValid() {
        return this.validationState;
    }
}

class ValidatableInputGroup {
    constructor(group) {
        this.group = group;
    }

    validate() {
        this.group.forEach(field => {
            field.validate();
        });
    }

    reset() {
        this.group.forEach(field => {
            field.resetValidationState();
            field.input.value = '';
        });
    }

    allAreValid() {
        let result = true;

        this.group.forEach(field => {
            if (!field.isValid())
                result = false;
        });

        return result;
    }
}

let nameLabel = document.getElementById('visible-name-label');
let emailLabel = document.getElementById('visible-email-label');
let messageLabel = document.getElementById('visible-message-label');

let nameInput = document.getElementById('visible-name');
let emailInput = document.getElementById('visible-email');
let messageInput = document.getElementById('visible-message');

let nameInputDiv = document.getElementById('name-input-div');
let emailInputDiv = document.getElementById('email-input-div');
let messageInputDiv = document.getElementById('message-input-div');

let nameErrorMessage = document.getElementById('name-error-message');
let emailErrorMessage = document.getElementById('email-error-message');
let messageErrorMessage = document.getElementById('message-error-message');

let visibleSubmitButton = document.getElementById('visible-submit-button');
let hiddenSubmitButton = document.getElementById('hidden-submit-button');

let submitButtonLoadingIcon = document.getElementById('visible-submit-button-icon-loading');
let submitButtonCompleteIcon = document.getElementById('visible-submit-button-icon-complete');
let submitButtonText = document.getElementById('visible-submit-button-text');
let formErrorMessage = document.getElementById('form-error');

let hiddenNameInput = document.getElementById('hidden-name');
let hiddenEmailInput = document.getElementById('hidden-email');
let hiddenMessageInput = document.getElementById('hidden-message');

let nameInputField = new ValidatableInputField("name", "empty", nameInputDiv, nameInput, nameErrorMessage);
let emailInputField = new ValidatableInputField("email", "empty email", emailInputDiv, emailInput, emailErrorMessage);
let messageInputField = new ValidatableInputField("message", "empty", messageInputDiv, messageInput, messageErrorMessage);

let inputGroup = new ValidatableInputGroup([nameInputField, emailInputField, messageInputField]);

function visibleSubmitClick(evt) {
    evt.preventDefault();

    formErrorMessage.style.display = 'none';

    setButtonState('loading', "INITIALIZING...", 'initializing');

    inputGroup.validate();

    if (inputGroup.allAreValid()) {

        // pass visible form to hidden form
        hiddenNameInput.value = nameInput.value;
        hiddenEmailInput.value = emailInput.value;
        hiddenMessageInput.value = messageInput.value;

        setTimeout(send, 2000);
    }
    else {
        setButtonState('def', 'SEND', '');
    }

    inputGroup.reset();
    changed = false;
}

function send() {
    hiddenSubmitButton.click()
}

function setButtonState(state, copy, style) {
    submitButtonLoadingIcon.style.display = state === 'loading' ? 'inline-block' : 'none';
    submitButtonCompleteIcon.style.display = state === 'complete' ? 'inline-block' : 'none';
    submitButtonText.style.transform = state === 'loading' ? 'translate(0px, -25%)' : 'translate(0px, 0px)';

    submitButtonText.innerText = copy;

    removeClassModifiers(visibleSubmitButton);
    setModifierClass(visibleSubmitButton, style);
}

function onFocusOut(label, inputField) {
    if (changed) {
        inputField.validate();
        removeClassModifiers(label);
        setModifierClass(label, inputField.input.value.length > 0 ? 'filled' : 'placeholder');
    }
}

setModifierClass(nameLabel, 'placeholder');
setModifierClass(emailLabel, 'placeholder');
setModifierClass(messageLabel, 'placeholder');

let changed = false;

nameInput.addEventListener('change', () => { changed = true; });
emailInput.addEventListener('change', () => { changed = true; });
messageInput.addEventListener('change', () => { changed = true; });

nameInput.addEventListener('focusout', () => { onFocusOut(nameLabel, nameInputField); });
emailInput.addEventListener('focusout', () => { onFocusOut(emailLabel, emailInputField); });
messageInput.addEventListener('focusout', () => { onFocusOut(messageLabel, messageInputField); });

visibleSubmitButton.addEventListener('click', visibleSubmitClick);
visibleSubmitButton.addEventListener('touchend', visibleSubmitClick);

const hiddenFormSubmitEvent = (function () {
    const init = ({ onSuccess, onFail }) => {
        $(document).ajaxComplete(function (event, xhr, settings) {
            settings.url.includes("https://webflow.com/api/v1/form/") ? xhr.status === 200 ? onSuccess() : onFail() : null;
        });
    }
    return init;
})()

hiddenFormSubmitEvent.init({
    onSuccess: () => {
        console.log('STATUS 200 from from submit: OK');
        showSuccessState();
    },
    onFail: () => {
        console.log('Error submitting form');
        showErrorState();
    }
});

function showErrorState() {
    formErrorMessage.style.display = 'block';
}

function showSuccessState() {
    setButtonState('complete', 'MESSAGE SENT', '');
}