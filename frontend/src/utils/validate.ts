import {FieldMetaProps} from 'formik'

export const isHasError = (meta: FieldMetaProps<any>) => meta.touched && meta.error

export const required = <T>(value: T) => Array.isArray(value)
  ? value.length === 0
  : (typeof value === 'number'
    ? typeof value === 'undefined' || value === null
    : !value || typeof value === 'undefined' || value === null)

export const msgs = {
  required: 'Это поле обязательно для заполнения',
}
