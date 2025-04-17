// frontend/src/utils/validation.js

/**
 * A utility for form validation in the AdiLibs application
 */

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password based on strength requirements
 * @param {string} password - The password to validate
 * @returns {Object} - Validation result with status and message
 */
export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long',
    };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!(hasUpperCase && hasLowerCase && hasNumber)) {
    return {
      isValid: false,
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    };
  }

  if (!hasSpecialChar) {
    return {
      isValid: false,
      message: 'Password must contain at least one special character',
    };
  }

  return {
    isValid: true,
    message: 'Password meets requirements',
  };
};

/**
 * Validates a name field
 * @param {string} name - The name to validate
 * @returns {Object} - Validation result with status and message
 */
export const validateName = (name) => {
  if (!name || name.trim() === '') {
    return {
      isValid: false,
      message: 'Name is required',
    };
  }

  if (name.length < 2) {
    return {
      isValid: false,
      message: 'Name must be at least 2 characters long',
    };
  }

  return {
    isValid: true,
    message: 'Name is valid',
  };
};

/**
 * Validates a book rating (1-5 stars)
 * @param {number} rating - The rating to validate
 * @returns {Object} - Validation result with status and message
 */
export const validateRating = (rating) => {
  const numRating = Number(rating);

  if (isNaN(numRating)) {
    return {
      isValid: false,
      message: 'Rating must be a number',
    };
  }

  if (numRating < 1 || numRating > 5) {
    return {
      isValid: false,
      message: 'Rating must be between 1 and 5',
    };
  }

  return {
    isValid: true,
    message: 'Rating is valid',
  };
};

/**
 * Validates a review content
 * @param {string} content - The review content to validate
 * @returns {Object} - Validation result with status and message
 */
export const validateReviewContent = (content) => {
  if (!content || content.trim() === '') {
    return {
      isValid: false,
      message: 'Review content is required',
    };
  }

  if (content.length < 10) {
    return {
      isValid: false,
      message: 'Review must be at least 10 characters long',
    };
  }

  if (content.length > 2000) {
    return {
      isValid: false,
      message: 'Review cannot exceed 2000 characters',
    };
  }

  return {
    isValid: true,
    message: 'Review content is valid',
  };
};

/**
 * Validates book reading progress
 * @param {number} currentPage - The current page number
 * @param {number} totalPages - The total pages in the book
 * @returns {Object} - Validation result with status and message
 */
export const validateReadingProgress = (currentPage, totalPages) => {
  const current = Number(currentPage);
  const total = Number(totalPages);

  if (isNaN(current) || current < 0) {
    return {
      isValid: false,
      message: 'Current page must be a positive number',
    };
  }

  if (total && current > total) {
    return {
      isValid: false,
      message: `Current page cannot exceed total pages (${total})`,
    };
  }

  return {
    isValid: true,
    message: 'Reading progress is valid',
  };
};

/**
 * Validates registration form data
 * @param {Object} formData - The registration form data
 * @returns {Object} - Validation results for each field and overall form
 */
export const validateRegistrationForm = (formData) => {
  const { name, email, password, confirmPassword } = formData;

  const nameValidation = validateName(name);
  const emailValid = isValidEmail(email);
  const passwordValidation = validatePassword(password);

  const passwordsMatch = password === confirmPassword;

  return {
    name: nameValidation,
    email: {
      isValid: emailValid,
      message: emailValid
        ? 'Email is valid'
        : 'Please enter a valid email address',
    },
    password: passwordValidation,
    confirmPassword: {
      isValid: passwordsMatch,
      message: passwordsMatch ? 'Passwords match' : 'Passwords do not match',
    },
    isFormValid:
      nameValidation.isValid &&
      emailValid &&
      passwordValidation.isValid &&
      passwordsMatch,
  };
};

/**
 * Validates login form data
 * @param {Object} formData - The login form data
 * @returns {Object} - Validation results for each field and overall form
 */
export const validateLoginForm = (formData) => {
  const { email, password } = formData;

  const emailValid = isValidEmail(email);
  const passwordValid = password && password.length > 0;

  return {
    email: {
      isValid: emailValid,
      message: emailValid
        ? 'Email is valid'
        : 'Please enter a valid email address',
    },
    password: {
      isValid: passwordValid,
      message: passwordValid ? 'Password entered' : 'Password is required',
    },
    isFormValid: emailValid && passwordValid,
  };
};

/**
 * Validates a review form
 * @param {Object} formData - The review form data
 * @returns {Object} - Validation results for each field and overall form
 */
export const validateReviewForm = (formData) => {
  const { rating, content } = formData;

  const ratingValidation = validateRating(rating);
  const contentValidation = validateReviewContent(content);

  return {
    rating: ratingValidation,
    content: contentValidation,
    isFormValid: ratingValidation.isValid && contentValidation.isValid,
  };
};

/**
 * Validates user profile update form
 * @param {Object} formData - The profile update form data
 * @returns {Object} - Validation results for each field and overall form
 */
export const validateProfileForm = (formData) => {
  const { name, bio } = formData;

  const nameValidation = validateName(name);

  // Bio validation is optional but if provided shouldn't exceed certain length
  const bioValid = !bio || bio.length <= 500;

  return {
    name: nameValidation,
    bio: {
      isValid: bioValid,
      message: bioValid ? 'Bio is valid' : 'Bio cannot exceed 500 characters',
    },
    isFormValid: nameValidation.isValid && bioValid,
  };
};
