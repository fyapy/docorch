import {observer} from 'mobx-react-lite'
import {useField} from 'formik'
import {isHasError} from 'utils/validate'
import * as Styled from './styles'

type FieldTextProps = {
  name: string
  placeholder: string
  required?: boolean
}

export const FieldText = observer(({placeholder, required, name}: FieldTextProps) => {
  const [field, meta] = useField({name})

  const error = isHasError(meta)

  return (
    <Styled.Wrapper>
      <label>
        {placeholder}
        {required && <Styled.Required> *</Styled.Required>}
      </label>
      <input {...field} />
      {error && <Styled.Error>{error}</Styled.Error>}
    </Styled.Wrapper>
  )
})
