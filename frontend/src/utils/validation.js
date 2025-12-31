/**
 * Form Validation Utilities for Farm Manager
 * Provides common validation functions and a validation hook
 */

// Email validation
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!regex.test(email)) return "Please enter a valid email address";
    return "";
};

// Password validation
export const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    return "";
};

// Required field validation
export const validateRequired = (value, fieldName = "This field") => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
        return `${fieldName} is required`;
    }
    return "";
};

// Number validation
export const validateNumber = (value, min, max, fieldName = "This field") => {
    if (value === "" || value === null || value === undefined) {
        return `${fieldName} is required`;
    }
    const num = Number(value);
    if (isNaN(num)) return `${fieldName} must be a number`;
    if (min !== undefined && num < min) return `${fieldName} must be at least ${min}`;
    if (max !== undefined && num > max) return `${fieldName} must be at most ${max}`;
    return "";
};

// Phone validation (Nepal/India format)
export const validatePhone = (phone) => {
    const regex = /^[\d\s\-\+\(\)]+$/;
    if (!phone) return "Phone number is required";
    if (phone.length < 10) return "Phone number must be at least 10 digits";
    if (!regex.test(phone)) return "Please enter a valid phone number";
    return "";
};

// Date validation
export const validateDate = (date, fieldName = "Date") => {
    if (!date) return `${fieldName} is required`;
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "Please enter a valid date";
    return "";
};

// Future date validation
export const validateFutureDate = (date, fieldName = "Date") => {
    const error = validateDate(date, fieldName);
    if (error) return error;

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        return `${fieldName} must be in the future`;
    }
    return "";
};

// Past date validation
export const validatePastDate = (date, fieldName = "Date") => {
    const error = validateDate(date, fieldName);
    if (error) return error;

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
        return `${fieldName} cannot be in the future`;
    }
    return "";
};

// Match validation (for password confirmation)
export const validateMatch = (value1, value2, fieldName = "Fields") => {
    if (value1 !== value2) {
        return `${fieldName} do not match`;
    }
    return "";
};

// Min/Max length validation
export const validateLength = (value, min, max, fieldName = "This field") => {
    if (!value) return `${fieldName} is required`;
    if (min && value.length < min) {
        return `${fieldName} must be at least ${min} characters`;
    }
    if (max && value.length > max) {
        return `${fieldName} must be at most ${max} characters`;
    }
    return "";
};

// Custom validation with hook
import { useState } from "react";

export function useFormValidation(initialValues, validationRules) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const validateField = (name, value) => {
        if (validationRules[name]) {
            return validationRules[name](value, values);
        }
        return "";
    };

    const validateAll = () => {
        const newErrors = {};
        let isValid = true;

        Object.keys(validationRules).forEach((name) => {
            const error = validateField(name, values[name]);
            if (error) {
                newErrors[name] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts fixing
        if (touched[name] && errors[name]) {
            const error = validateField(name, value);
            setErrors((prev) => ({ ...prev, [name]: error }));
        }
    };

    const handleBlur = (name) => {
        setTouched((prev) => ({ ...prev, [name]: true }));
        const error = validateField(name, values[name]);
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleSubmit = (onSubmit) => (e) => {
        e.preventDefault();

        // Mark all fields as touched
        const allTouched = {};
        Object.keys(validationRules).forEach((key) => {
            allTouched[key] = true;
        });
        setTouched(allTouched);

        // Validate all fields
        if (validateAll()) {
            onSubmit(values);
        }
    };

    const resetForm = () => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    };

    return {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,
        setValues,
    };
}

// Helper to show error in UI
export function FormError({ error, touched }) {
    if (!touched || !error) return null;

    return (
        <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                />
            </svg>
            {error}
        </p>
    );
}
