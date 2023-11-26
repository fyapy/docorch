import {useLayoutEffect} from 'react'
import {observer} from 'mobx-react-lite'
import {FieldError, FormProvider, useForm} from 'react-hook-form'
import {msgs, required} from 'utils/validate'
import {FieldRadio} from 'ui/FieldRadio'
import {FieldMulti} from 'ui/FieldMulti'
import {FieldArray} from 'ui/FieldArray'
import {FieldText} from 'ui/FieldText'
import {useStore} from 'utils/hooks'
import * as Styled from './styles'

export interface RunContainerValues {
  name: string
  server: null | string
  image: string
  env: {k: string, v: string}[]
  networks: {static: string, to: string}[]
  volumes: {host: string, inside: string}[]
  args: string[]
}

const defaultValues: RunContainerValues = {
  name: 'nginx',
  server: null,
  image: 'nginx:latest',
  env: [{k: 'ENDPOINT', v: 'localhost'}],
  networks: [{static: '8080', to: '80'}],
  volumes: [{host: '~/pgdata', inside: '/var/lib/postgresql/data'}],
  args: ['server', '/data'],
}

export const RunContainer = observer(() => {
  const {servers, containers} = useStore()

  useLayoutEffect(() => {
    servers.fetchList()
  }, [])

  const form = useForm<RunContainerValues>({
    defaultValues,
    resolver: (values) => {
      const errors: Partial<Record<keyof RunContainerValues, FieldError>> = {}

      if (required(values.name)) errors.name = msgs.required
      if (required(values.server)) errors.server = msgs.required
      if (required(values.image)) errors.image = msgs.required

      return {values, errors}
    },
  })

  const onSubmit = form.handleSubmit(containers.runContainer)

  return (
    <FormProvider {...form}>
      <Styled.Wrapper onSubmit={onSubmit}>
        <FieldRadio name="server" placeholder="Server" options={servers.options} required />
        <FieldText name="name" placeholder="Name" required />
        <FieldText name="image" placeholder="Image" required />
        <FieldMulti name="env" placeholder="Environment variables" empty={{k: '', v: ''}} />
        <FieldMulti name="networks" placeholder="Ports (public, internal)" empty={{static: '', to: ''}} />
        <FieldMulti name="volumes" placeholder="Volumes (host, internal)" empty={{host: '', inside: ''}} />
        <FieldArray name="args" placeholder="Arguments" />

        <Styled.Btn
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          Run Container
        </Styled.Btn>
      </Styled.Wrapper>
    </FormProvider>
  )
})
