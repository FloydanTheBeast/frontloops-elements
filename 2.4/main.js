class BaseValidator {
  constructor() {
    this.validators = [];
  }

  required(msg = 'Field is required') {
    this.validators.push(value => (!!value ? null : msg));
    return this;
  }

  test(validatorFn) {
    this.validators.push(validatorFn);
    return this;
  }

  validate(value, context) {
    for (const validator of this.validators) {
      const errorMsg = validator(value, context);
      if (errorMsg) return errorMsg;
    }

    return null;
  }
}

class StringValidator extends BaseValidator {
  email(msg = 'Enter valid email') {
    this.validators.push(value => (!!value.match(/.+@\w+\.\w{2}/) ? null : msg));
    return this;
  }
}

class ValidationSchema {
  constructor(schema) {
    this.schema = schema;
  }

  validate(values) {
    let errors = {};
    const context = { values };

    for (const [key, validator] of Object.entries(this.schema)) {
      const error = validator.validate(values[key], context);
      if (error) errors[key] = error;
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }
}

const v = {
  string: () => new StringValidator(),
};

const form = document.getElementsByTagName('form')[0];
const formControls = form.elements;

const validationSchema = new ValidationSchema({
  name: v.string().required(),
  email: v.string().email(),
  'confirm-password': v
    .string()
    .test((value, { values }) => (value === values['password'] ? null : 'Confirmation failed')),
});

form.addEventListener('submit', e => {
  e.preventDefault();

  form.querySelectorAll('.error').forEach(e => e.remove());

  const formData = new FormData(form);
  const values = Object.fromEntries(formData);

  const { errors } = validationSchema.validate(values);

  for (const [key, error] of Object.entries(errors)) {
    const failedControl = formControls[key];

    if (!failedControl) continue;

    const errorElement = document.createElement('label');
    errorElement.classList.add('error');
    errorElement.textContent = error;

    failedControl.parentElement.insertBefore(errorElement, failedControl.nextSibling);
  }
});
