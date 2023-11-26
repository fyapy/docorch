import {useFieldArray, useFormContext} from 'react-hook-form'
import * as Styled from './styles'

type Value = Record<string, any>

type FieldMultiProps = {
  name: string
  placeholder: string
  empty: Value
}

export const FieldMulti = ({placeholder, name, empty}: FieldMultiProps) => {
  const {register} = useFormContext()
  const {fields, append, remove} = useFieldArray({name})

  const [firstKey, secondKey] = Object.keys(empty)

  return (
    <Styled.Wrapper>
      <label>{placeholder}</label>
      {fields.map((field, index) => (
        <Styled.InputGroup key={field.id}>
          <input {...register(`${name}.${index}.${firstKey}`)} />
          <input {...register(`${name}.${index}.${secondKey}`)} />

          <Styled.Remove type="button" onClick={() => remove(index)}>X</Styled.Remove>
        </Styled.InputGroup>
      ))}

      <Styled.Btn type="submit" onClick={() => append({...empty})}>
        Add
      </Styled.Btn>
    </Styled.Wrapper>
  )
}
