import {observer} from 'mobx-react-lite'
import {useController} from 'react-hook-form'
import {isHasError} from 'utils/validate'
import * as Styled from './styles'

type FieldTextProps = {
  name: string
  placeholder: string
  required?: boolean
}

export const FieldText = observer(({placeholder, required, name}: FieldTextProps) => {
  const {field, fieldState, formState} = useController({name})

  const error = isHasError(fieldState, formState)

  return (
    <Styled.Wrapper>
      <label>
        {placeholder}
        {required && <Styled.Required> *</Styled.Required>}
      </label>
      <input
        {...field}
        onChange={field.onChange}
      />
      {error && <Styled.Error>{error}</Styled.Error>}
    </Styled.Wrapper>
  )
})
