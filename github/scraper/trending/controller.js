
const moment = require("moment");
const JM = require('json-mapper');
const h = JM.helpers;

const trendingPage = require("./page/inspect");
const githunterApi = require("../../../githunter-api/controller");
const db = require("../../../database/repositories/RepoRepository");
const env = require("../../../env");
const starws = require("../../../star-ws/controller");

const run = async () => {
    console.log("Starting scraper by trending");
    
    try {
        const repos = await trendingPage();
        api(repos);
    } catch (e) {
        console.log("error in controller");
        console.log(e);
    }
    
}

const api = async (repoList) => {

    const data = {};
// console.log(`START ton of request: ${moment().format()}`);
    for (const repo of repoList) {
        repo.provider = env.flags.provider;

        let node = "repository";
        if (!env.flags["nodes"] || (env.flags["nodes"] && env.flags["nodes"].includes(node))){
            try {
                readRepositoryInformation(repo);
            } catch (e) {
                console.log(e);
            }
        }

        node = "commits";
        if (!env.flags["nodes"] || (env.flags["nodes"] && env.flags["nodes"].includes(node))){
            if (!data[node]) data[node] = [];
            try {
                const info = await readCommitInformation(repo);
                if (info && info.length > 0) {
                    data[node].push({dateTime: moment().format(), fields: commitData, tags: {}});
                }
            } catch (e) {
                console.log(e);
            }
                
        }

        node = "pulls";
        if (!env.flags["nodes"] || (env.flags["nodes"] && env.flags["nodes"].includes(node))){
            if (!data[node]) data[node] = [];
            try {
                const info = await readPullsInformation(repo);
                if (info && info.length > 0){
                    data[node].push(info);
                }
            } catch (e) {
                console.log(e);
            }            
        }

        node = "issuesV1";
        if (!env.flags["nodes"] || (env.flags["nodes"] && env.flags["nodes"].includes(node))){
            if (!data[node]) data[node] = [];
            try {
                let info = await readIssuesInformation(repo);
                if (info && info.length > 0){
                    info.map(item => data[node].push(item));
                }  
            } catch (e) {
                console.log(e);
            }
        }

    }
// console.log(`END ton request: ${moment().format()}`);
    for (const theNode in data) {
        const theData = data[theNode];
        if (theData && theData.length > 0)
            starws.publishMetrics(env.flags.provider, theNode, theData);
    }

}

const readRepositoryInformation = async (repo) => {
    const repoInfo = await githunterApi.getRepositoryInformation(repo);
    db.save(repoInfo);
}

const readCommitInformation = (repo) => {
    return githunterApi.getRepositoryCommits(repo);
}

const readPullsInformation = (repo) => {
    return githunterApi.getRepositoryPullsRequest(repo);
}

const readIssuesInformation = async (repo) => {

    var issueMaker = JM.makeConverter({
        dateTime: () => moment().format(),
        fields: {
            number: ["number", h.toString],
            state: "state",
            createdAt: "createdAt",
            closedAt: "closedAt",
            updatedAt: "updatedAt",
            authorLogin: "authorLogin.author",
            labels: "",
            participantsTotalCount: ["participants.totalCount", h.toString],
            timelineItemsTotalCount: ["timelineItems.totalCount", h.toString],
            timelineUpdatedAt: "timelineItems.updatedAt",
            timelineItemsNodes: "",
            dono: "owner",
            name: "name"
        },
        tags: {}
    } );

    const normalizedData = [];
    const data = await githunterApi.getRepositoryIssues(repo);
    if (!data) return;
    for (const key in data.issues) {
        normalizedData.push({
                    ...issueMaker({...data.issues[key], ...repo})
                });
    }
    return normalizedData;
}

module.exports = {run}