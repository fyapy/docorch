import type {
  FieldError,
  FieldValues,
  UseFormStateReturn,
  ControllerFieldState,
} from 'react-hook-form'

export const isHasError = (
  fieldState: ControllerFieldState,
  formState?: UseFormStateReturn<FieldValues>
) =>
  ((fieldState.isTouched || formState?.isSubmitted) &&
    fieldState.error?.message) || undefined

export const required = <T>(value: T) => Array.isArray(value)
  ? value.length === 0
  : (typeof value === 'number'
    ? typeof value === 'undefined' || value === null
    : !value || typeof value === 'undefined' || value === null)

export const msgs = {
  required: {
    type: 'manual',
    message: 'Это поле обязательно для заполнения',
  }
}
