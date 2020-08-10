const config = require("config");
const HttpClient = require("../rest/RESTClient");

const githunterConfig = config.get('githunter');
const httpClient = new HttpClient({
    url: githunterConfig.url
});

const getRepositoryInformation = async (params) => {
    return sendGetToGithunter(githunterConfig.endpoints.repository, params);
}

const getRepositoryCommits = async (params) => {
    return sendGetToGithunter(githunterConfig.endpoints.commits, params);
}

const getRepositoryPullsRequest = (params) => {
    return sendGetToGithunter(githunterConfig.endpoints.pulls, params);
}

const getRepositoryIssues = (params) => {
    return sendGetToGithunter(githunterConfig.endpoints.issues, params);
}

const sendGetToGithunter = async (path, data) => {
    const access_token = await getValidToken();

    if (!access_token) {
        console.error("No token available for consume githunter API.")
        return;
    }
    
    try {
        httpClient.addAccessToken(access_token);
        data = {
            ...data,
            access_token
        }
        const response = await httpClient.get(path, data);
    
        if (response && response.data){
          return response.data;
        }
      
        return;
      } catch (err) {
          console.log(err);
      }
}

const getValidToken = async () => {
    const gitHubConfig = config.get('githunter');
    const personalTokenList = gitHubConfig.rateLimit.personalToken;

    for (const token of personalTokenList) {
        const limits = await hasRateLimit(token);
        if (limits && limits.remaining > gitHubConfig.rateLimit.minLimit){
            return token;
        } 
    }
    return;
}

const hasRateLimit = async (accessToken) => {

    const gitHubConfig = config.get('github');

    const httpClient = new HttpClient({
        url: gitHubConfig.url,
        headers: {
            "Accept": "application/vnd.github.v3+json"
        },
        accessToken
      });
    
      try {
        const response = await httpClient.get(gitHubConfig.rateLimitPath);
    
        if (response && response.data && response.data.resources){
          return response.data.resources.graphql;
        }
      
        return;
      } catch (err) {
          console.log(err);
      }

}

module.exports = {
    getRepositoryInformation, 
    getRepositoryCommits, 
    getRepositoryPullsRequest, 
    getRepositoryIssues
}