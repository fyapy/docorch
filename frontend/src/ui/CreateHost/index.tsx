import {useCallback} from 'react'
import {observer} from 'mobx-react-lite'
import {Formik} from 'formik'
import {msgs, required} from 'utils/validate'
import {FieldText} from 'ui/FieldText'
import {useStore} from 'utils/hooks'
import * as Styled from './styles'

export interface CreateHostValues {
  host: string
  ip: string
}

const initialValues: CreateHostValues = {
  host: '',
  ip: '',
}

export const CreateHost = observer(() => {
  const {hosts} = useStore()

  const validate = useCallback((values: CreateHostValues) => {
    const errors: Partial<Record<keyof CreateHostValues, string>> = {}

    if (required(values.host)) errors.host = msgs.required
    if (required(values.ip)) errors.ip = msgs.required

    return errors
  }, [])

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={hosts.createItem}
      validate={validate}
      enableReinitialize
    >
      {({handleSubmit, isSubmitting}) => (
        <Styled.Wrapper onSubmit={handleSubmit}>
          <FieldText name="host" placeholder="Host" required />
          <FieldText name="ip" placeholder="Ip" required />

          <Styled.Btn type="submit" disabled={isSubmitting}>
            Create Host
          </Styled.Btn>
        </Styled.Wrapper>
      )}
    </Formik>
  )
})
