// frontend/src/hooks/useForm.js
import { useState } from 'eact';

const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({...prevValues, [name]: value }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prevTouched) => ({...prevTouched, [name]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formErrors = validate(values);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      // Form is valid, submit the form
      console.log('Form submitted:', values);
    }
  };

  const validate = (values) => {
    const errors = {};
    // Add validation logic here
    // For example:
    if (!values.name) {
      errors.name = 'Required';
    }
    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    return errors;
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  };
};

export default useForm;