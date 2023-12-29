import {useField} from 'formik'
import {isHasError} from 'utils/validate'
import * as Styled from './styles'

type FieldRadioProps = {
  name: string
  required?: boolean
  placeholder: string
  options: Array<{
    name: string
    value: string
  }>
}

export const FieldRadio = ({name, required, placeholder, options}: FieldRadioProps) => {
  const [field, meta, {setValue}] = useField({name})

  const error = isHasError(meta)

  return (
    <Styled.Wrapper>
      <label>
        {placeholder}
        {required && <Styled.Required> *</Styled.Required>}
      </label>

      <Styled.Items>
        {options.map(({value, name}) => (
          <Styled.Item
            key={value}
            onClick={() => setValue(value)}
          >
            <Styled.Dot className={field.value === value ? 'active' : ''} />
            {name}
          </Styled.Item>
        ))}
      </Styled.Items>

      {error && <Styled.Error>{error}</Styled.Error>}
    </Styled.Wrapper>
  )
}
