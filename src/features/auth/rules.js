// Pure validation rules. The UI uses them for quick feedback only;
// the backend is still the final authority.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SA_PHONE_RE = /^(?:0[6-8]\d{8}|\+27[6-8]\d{8})$/;

export const MIN_PASSWORD_LENGTH = 8;

export function validateLogin({ email, password }) {
  const errors = {};

  if (!email.trim()) {
    errors.email = "Enter your email address.";
  }

  if (!password) {
    errors.password = "Enter your password.";
  }

  return errors;
}

export function validateRegistration({
  fullName,
  email,
  phone,
  password,
  confirm,
}) {
  const errors = {};

  if (!fullName.trim()) {
    errors.fullName = "Enter your full name.";
  }

  if (!EMAIL_RE.test(email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  const cleanPhone = phone.trim();

  if (!cleanPhone) {
    errors.phone = "Enter your phone number.";
  } else if (!SA_PHONE_RE.test(cleanPhone)) {
    errors.phone =
      "Enter a valid South African mobile number.";
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password =
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (confirm !== password) {
    errors.confirm = "Passwords do not match.";
  }

  return errors;
}