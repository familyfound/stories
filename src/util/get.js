
// We only use bluebird promises here, and it's so that we get network request
// cancellation
import Promise from 'bluebird'
Promise.config({cancellation: true})

export default (method, url, headers, body, type='json') => {
  return new Promise((resolve, reject, onCancel) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url)
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value)
    })
    xhr.responseType = type
    xhr.onload = () => {
      if (xhr.status === 204) return resolve(null)
      if (xhr.status === 200) return resolve(xhr.response)
      if (xhr.status === 401) {
        const err = new Error('Unauthorized')
        err.status = 401
        return reject(err)
      }
      const err = new Error(`Invalid status code: ${xhr.status}\n` + JSON.stringify(xhr.response))
      reject(err)
    }
    xhr.onerror = () => {
      reject(new Error('Unable to make request: ' + url))
    }
    onCancel(() => xhr.abort())
    if (body) {
      xhr.send(body)
    } else {
      xhr.send()
    }
  })
}

