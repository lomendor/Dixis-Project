import React from 'react';
import {
  Box,
  Button,
  FormControl as ChakraFormControl,
  FormLabel as ChakraFormLabel,
  FormErrorMessage as ChakraFormErrorMessage,
  VStack as ChakraVStack,
  HStack,
} from '@chakra-ui/react';

interface Field {
  name: string;
  label: string;
  type: string;
  validation?: {
    required?: boolean;
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
  };
  component: React.ReactNode;
}

interface FormProps {
  fields: Field[];
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  submitText?: string;
  initialValues?: Record<string, any>;
  children?: React.ReactNode;
  onCancel?: () => void;
}

export const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  isLoading = false,
  submitText = 'Υποβολή',
  initialValues = {},
  children,
  onCancel,
}) => {
  const [formData, setFormData] = React.useState(initialValues);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      if (field.validation?.required && !formData[field.name]) {
        newErrors[field.name] = 'Το πεδίο είναι υποχρεωτικό';
      }
      if (
        field.validation?.pattern &&
        formData[field.name] &&
        !field.validation.pattern.test(formData[field.name])
      ) {
        newErrors[field.name] = 'Μη έγκυρη μορφή';
      }
    });

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <ChakraVStack gap={4} alignItems="stretch">
        {fields.map((field) => (
          <ChakraFormControl key={field.name} isInvalid={!!errors[field.name]}>
            <ChakraFormLabel>{field.label}</ChakraFormLabel>
            {React.cloneElement(field.component as React.ReactElement, {
              value: formData[field.name] || '',
              onChange: (e: any) => handleChange(field.name, e.target.value),
            })}
            <ChakraFormErrorMessage>{errors[field.name]}</ChakraFormErrorMessage>
          </ChakraFormControl>
        ))}

        {children}

        <HStack spacing={4} alignSelf="flex-end">
          {onCancel && (
            <Button onClick={onCancel} variant="outline">
              Ακύρωση
            </Button>
          )}
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isLoading}
          >
            {submitText}
          </Button>
        </HStack>
      </ChakraVStack>
    </Box>
  );
};

export default Form; 