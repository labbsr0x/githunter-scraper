const axios = require('axios').default;

class Http {
  constructor({ url, headers, accessToken }) {
    headers = headers || { 'Content-type': 'application/json' };

    if (!headers['Content-type']) {
      headers['Content-type'] = 'application/json';
    }

    this.service = axios.create({
      url,
      timeout: 800000,
      headers,
    });

    this.accessToken = '';
    if (accessToken) {
      this.accessToken = accessToken;
    }

    this.service.interceptors.request.use(config => {
      if (this.accessToken)
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      return config;
    });
  }

  addAccessToken(accessToken) {
    this.accessToken = accessToken;
  }

  get(path, params, headers) {
    return this.service.get(this.service.defaults.url + path, {
      params,
      headers,
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
