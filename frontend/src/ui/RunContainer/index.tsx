import {useCallback, useLayoutEffect, useMemo} from 'react'
import {observer} from 'mobx-react-lite'
import {Formik} from 'formik'
import {msgs, required} from 'utils/validate'
import {FieldRadio} from 'ui/FieldRadio'
import {FieldMulti} from 'ui/FieldMulti'
import {FieldArray} from 'ui/FieldArray'
import {FieldText} from 'ui/FieldText'
import {useStore} from 'utils/hooks'
import * as Styled from './styles'

export interface RunContainerValues {
  name: string
  serverIp: null | string
  image: string
  envs: {k: string, v: string}[]
  networks: {static: string, to: string}[]
  volumes: {host: string, inside: string}[]
  args: string[]
}

export const RunContainer = observer(() => {
  const {servers, containers} = useStore()

  useLayoutEffect(() => {
    servers.fetchList()
  }, [])

  const initialValues = useMemo((): RunContainerValues => ({
    name: 'nginx',
    serverIp: servers.options.length
      ? servers.options[0].value
      : null,
    image: 'nginx:latest',
    envs: [{k: 'ENDPOINT', v: 'localhost'}],
    networks: [{static: '8080', to: '80'}],
    volumes: [{host: '~/pgdata', inside: '/var/lib/postgresql/data'}],
    args: ['server', '/data'],
  }), [servers.options])

  const validate = useCallback((values: RunContainerValues) => {
    const errors: Partial<Record<keyof RunContainerValues, string>> = {}

    if (required(values.name)) errors.name = msgs.required
    if (required(values.serverIp)) errors.serverIp = msgs.required
    if (required(values.image)) errors.image = msgs.required

    return errors
  }, [])

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={containers.runContainer}
      validate={validate}
      enableReinitialize
    >
      {({handleSubmit, isSubmitting}) => (
        <Styled.Wrapper onSubmit={handleSubmit}>
          <FieldRadio name="serverIp" placeholder="Server" options={servers.options} required />
          <FieldText name="name" placeholder="Name" required />
          <FieldText name="image" placeholder="Image" required />
          <FieldMulti name="envs" placeholder="Environment variables" empty={{k: '', v: ''}} />
          <FieldMulti name="networks" placeholder="Ports (public, internal)" empty={{static: '', to: ''}} />
          <FieldMulti name="volumes" placeholder="Volumes (host, internal)" empty={{host: '', inside: ''}} />
          <FieldArray name="args" placeholder="Arguments" />

          <Styled.Btn type="submit" disabled={isSubmitting}>
            Run Container
          </Styled.Btn>
        </Styled.Wrapper>
      )}
    </Formik>
  )
})
