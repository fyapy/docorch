import {navigate as wouterNavigate} from 'wouter/use-location'

export const navigate = (path: string) => wouterNavigate(`/ui${path === '/' ? '' : path}`)
