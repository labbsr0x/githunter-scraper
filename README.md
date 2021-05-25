# GitHunter-Scraper

Githunter-Scraper is a tool for scraper some public information about repositories hosted in GitHub, Gitlab and others providers. The scraper is made based on an entry point (trending page on GitHub/GitLab, Mongo database, list of organization's members etc).

## How to run

### Run locally

You can run locally using the script startup.sh" present int the root of the application:

```
./startup.sh
```

> **scraperPoint** (required): It is the start point, from where the script should get the repositories to be scraper. For _trending_ means that will crawl the github explore page, in trending tab.
>
> **provider** (required): Where should read all information.
>
> **nodes** (optional): Which king of information should read. Known nodes are: repository, issues, pulls and commits

### Run in Docker with Conductor

You only need execute the script "startDocker.sh" present in root of the application:

```bash
./startDocker.sh
```

Or execute a simply `docker-compose up -d`

## Usage

### With Conductor

You can start a workflow defined inside `./conductor/server/provisioning` by sending a post to the conductor-server url defined in docker compose file, like this:

```bash
curl -X POST \
  http://localhost:8080/api/workflow \
  -H 'Accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "scraper_users",
    "version": 1,
    "input":{
      "scraperPoint": "organization.members",
      "nodes": "userStats",
      "organization": "bancodobrasil",
      "provider": "github"
    }
}'
```

### With Schellar

Or you can start a workflow by scheduling it with [Schellar](https://github.com/flaviostutz/schellar), like this:

```bash
curl -X POST \
  http://localhost:3000/schedule \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
    "name": "scraper-users-minute",
    "enabled": true,
    "parallelRuns": false,
    "workflowName": "scraper_users",
    "workflowVersion": "1",
    "cronString": "* * * * *",
    "workflowContext": {
      "scraperPoint": "organization.members",
      "nodes": "userStats",
      "organization": "bancodobrasil",
      "provider": "github"
    },
    "fromDate": "2019-01-01T15:04:05Z",
    "toDate": "2029-07-01T15:04:05Z"
}'
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
