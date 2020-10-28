const axios = require('axios').default;
const logger = require('../config/logger');

class Http {
  constructor({ url, headers, accessToken }) {
    headers = headers || { 'Content-type': 'application/json' };

    if (!headers['Content-type']) {
      headers['Content-type'] = 'application/json';
    }

    this.service = axios.create({
      url,
      timeout: 120000,
      headers,
    });

    if (accessToken) {
      this.addAccessToken(accessToken);
    }
  }

  addAccessToken(accessToken) {
    this.service.interceptors.request.use(config => {
      config.headers.common.Authorization = `Bearer ${accessToken}`;
      return config;
    });
  }

  get(path, params, headers) {
    return this.service.get(this.service.defaults.url + path, {
      params,
      headers,
    });
  }

  patch(path, payload, callback) {
    return this.service
      .request({
        method: 'PATCH',
        url: this.service.defaults.url + path,
        responseType: 'json',
        data: payload,
      })
      .then(response => callback(response.status, response.data))
      .catch(err => {
        logger.error(`PATCH Request to RESTClient(Http) failure! \n${err}`);
      });
  }

  post(path, payload, headers, url = null) {
    return this.service.request({
      method: 'POST',
      url: url ? url + path : this.service.defaults.url + path,
      headers,
      responseType: 'json',
      data: payload,
    });
  }
}

module.exports = Http;
