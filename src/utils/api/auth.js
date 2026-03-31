import { $api } from '.'

export const csrf = () => $api('sanctum/csrf-cookie', { method: 'GET' })

export const login = body => $api('/login', {
  method: 'POST',
  body,
  onResponseError({ response }) {
    throw response
  },
})

export const logout = () => $api('/logout', {
  method: 'POST',
  onResponseError({ response }) {
    throw response
  },
})

export const me = () => $api('api/user', {
  method: 'GET',
  onResponseError({ response }) {
    throw response
  },
})
