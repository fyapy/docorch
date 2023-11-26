import {useFieldArray, useFormContext} from 'react-hook-form'
import * as Styled from './styles'

type FieldArrayProps = {
  name: string
  placeholder: string
}

export const FieldArray = ({name, placeholder}: FieldArrayProps) => {
  const {register} = useFormContext()
  const {fields, remove, append} = useFieldArray({name})

  return (
    <Styled.Wrapper>
      <label>{placeholder}</label>
      {fields.map((field, index) => (
        <Styled.InputGroup key={field.id}>
          <input {...register(`${name}.${index}`)} />

          <Styled.Remove type="button" onClick={() => remove(index)}>X</Styled.Remove>
        </Styled.InputGroup>
      ))}

      <Styled.Btn type="button" onClick={() => append('')}>Add</Styled.Btn>
    </Styled.Wrapper>
  )
}
