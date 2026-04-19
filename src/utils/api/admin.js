import { $api } from '.'

export const getDashboard = () => $api('api/admin/dashboard', { method: 'GET' })

export const getUsers = (page = 1) => $api('api/admin/users', {
  method: 'GET',
  query: { page },
})

export const getDomains = (page = 1) => $api('api/admin/domains', {
  method: 'GET',
  query: { page },
})

export const fixDomainsAndOrders = () => $api('api/admin/admin/fix-domains', {
  method: 'POST',
  onResponseError({ response }) {
    throw response
  },
})

export const getExtensions = () => $api('api/admin/extensions', {
  method: 'GET',
})

export const createExtension = body => $api('api/admin/extensions', {
  method: 'POST',
  body,
  onResponseError({ response }) {
    throw response
  },
})

export const updateExtension = (id, body) => $api(`api/admin/extensions/${id}`, {
  method: 'PUT',
  body,
  onResponseError({ response }) {
    throw response
  },
})

export const deleteExtension = id => $api(`api/admin/extensions/${id}`, {
  method: 'DELETE',
  onResponseError({ response }) {
    throw response
  },
})

export const getSettings = () => $api('api/admin/settings', {
  method: 'GET',
})

export const saveSetting = body => $api('api/admin/settings', {
  method: 'POST',
  body,
  onResponseError({ response }) {
    throw response
  },
})

export const getPage = slug => $api(`api/pages/${slug}`, {
  method: 'GET',
  onResponseError({ response }) {
    throw response
  },
})

export const updatePage = (slug, body) => $api(`api/admin/pages/${slug}`, {
  method: 'POST',
  body,
  onResponseError({ response }) {
    throw response
  },
})
