// frontend/src/hooks/useFormValidation.js

import { useState, useEffect } from 'react';

/**
 * Custom hook for form validation
 * @param {Object} initialValues - Initial form values
 * @param {Function} validateFunction - Validation function to use
 * @param {Function} onSubmit - Function to call on valid submission
 * @returns {Object} - Form state, handlers, and validation state
 */
const useFormValidation = (initialValues, validateFunction, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Validate whenever values or touched fields change
  useEffect(() => {
    // Only validate touched fields or when submitting
    if (Object.keys(touched).length > 0 || isSubmitting) {
      const validationResults = validateFunction(values);
      setErrors((prevErrors) => {
        const newErrors = {};

        // For each field that has been touched, set its validation message
        Object.keys(validationResults).forEach((field) => {
          if (field !== 'isFormValid' && (touched[field] || isSubmitting)) {
            newErrors[field] = validationResults[field].isValid
              ? ''
              : validationResults[field].message;
          } else if (prevErrors[field]) {
            // Keep previous errors for untouched fields
            newErrors[field] = prevErrors[field];
          }
        });

        return newErrors;
      });

      setIsValid(validationResults.isFormValid);
    }
  }, [values, touched, isSubmitting, validateFunction]);

  // If submitting and form is valid, call onSubmit
  useEffect(() => {
    if (isSubmitting && isValid) {
      onSubmit(values);
      setIsSubmitting(false);
    } else if (isSubmitting && !isValid) {
      // Touch all fields to show errors
      const allTouched = {};
      Object.keys(values).forEach((key) => {
        allTouched[key] = true;
      });
      setTouched(allTouched);
      setIsSubmitting(false);
    }
  }, [isSubmitting, isValid, values, onSubmit]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle blur events to mark fields as touched
  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));
  };

  // Handle form submission
  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    setIsSubmitting(true);
  };

  // Reset the form
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  // Set a specific field value programmatically
  const setFieldValue = (field, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  // Touch a specific field programmatically
  const setFieldTouched = (field, isTouched = true) => {
    setTouched((prevTouched) => ({
      ...prevTouched,
      [field]: isTouched,
    }));
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldTouched,
  };
};

export default useFormValidation;
