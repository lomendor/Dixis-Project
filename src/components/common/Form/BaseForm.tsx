import React from 'react';
import {
  VStack,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  HStack,
} from '@chakra-ui/react';
import { UseFormReturn, FieldValues } from 'react-hook-form';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'switch' | 'custom';
  required?: boolean;
  options?: { label: string; value: any }[];
  component?: React.ReactNode;
  validation?: Record<string, any>;
}

interface BaseFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  fields: FormField[];
  onSubmit: (data: T) => Promise<void>;
  submitText?: string;
  isSubmitting?: boolean;
  gap?: number | string;
  children?: React.ReactNode;
  onCancel?: () => void;
}

export function BaseForm<T extends FieldValues>({
  form,
  fields,
  onSubmit,
  submitText = 'Αποθήκευση',
  isSubmitting = false,
  gap = 4,
  children,
  onCancel
}: BaseFormProps<T>) {
  const { handleSubmit, formState: { errors } } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={gap}>
        {fields.map((field) => (
          <FormControl 
            key={field.name} 
            isRequired={field.required}
            isInvalid={!!errors[field.name as keyof T]}
          >
            <FormLabel>{field.label}</FormLabel>
            {field.component}
            <FormErrorMessage>
              {errors[field.name as keyof T]?.message as string}
            </FormErrorMessage>
          </FormControl>
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
            isLoading={isSubmitting}
          >
            {submitText}
          </Button>
        </HStack>
      </VStack>
    </form>
  );
} 