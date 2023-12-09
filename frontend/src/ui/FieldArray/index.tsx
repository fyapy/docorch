import {FieldArray as FormikArray, Field} from 'formik'
import * as Styled from './styles'

type FieldArrayProps = {
  name: string
  placeholder: string
}

export const FieldArray = ({name, placeholder}: FieldArrayProps) => (
  <FormikArray
    name={name}
    render={({remove, push, form}) => (
      <Styled.Wrapper>
        <label>{placeholder}</label>

        {(form.values[name] as any[]).map((_, index) => (
          <Styled.InputGroup key={index}>
            <Field name={`${name}.${index}`} />

            <Styled.Remove type="button" onClick={() => remove(index)}>X</Styled.Remove>
          </Styled.InputGroup>
        ))}

        <Styled.Btn type="button" onClick={() => push('')}>Add</Styled.Btn>
      </Styled.Wrapper>
    )}
  />
)
