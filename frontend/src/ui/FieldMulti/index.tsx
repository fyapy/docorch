import {Field, FieldArray} from 'formik'
import * as Styled from './styles'

type Value = Record<string, any>

type FieldMultiProps = {
  name: string
  placeholder: string
  empty: Value
}

export const FieldMulti = ({placeholder, name, empty}: FieldMultiProps) => {
  const [firstKey, secondKey] = Object.keys(empty)

  return (
    <FieldArray
      name={name}
      render={({form, remove, push}) => (
        <Styled.Wrapper>
          <label>{placeholder}</label>

          {(form.values[name] as any[]).map((_, index) => (
            <Styled.InputGroup key={index}>
              <Field name={`${name}[${index}].${firstKey}`} />
              <Field name={`${name}[${index}].${secondKey}`} />

              <Styled.Remove type="button" onClick={() => remove(index)}>X</Styled.Remove>
            </Styled.InputGroup>
          ))}

          <Styled.Btn type="submit" onClick={() => push({...empty})}>
            Add
          </Styled.Btn>
        </Styled.Wrapper>
      )}
    />
  )
}
