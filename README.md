# GitHunter-Crawler
The objective this tool is to feed a Mongo database with public information of some repositories hosted in GitHub, Gitlab and others providers.

## Install
After clone repository, write this command in terminal:
```bash
npm install
``` 

## Run
**First, make sure your node version is v10 or higher if not, upgrade to a newer version.**

### There are 2 differet way to run the application

- Run as server
```bash
node githunter-scraper.js --server
```

> For future, the Conductor will consumer some endpoints to manage the process.

- Run as command line process
```bash
node githunter-scraper.js --scraperPoint trending --provider github --nodes issuesV1
```
> ***scraperPoint*** (required): It is the start point, from where the script should get the repositories to be scraper. For _trending_  means that will crawl the github explore page, in trending tab.  
>   
> ***provider*** (required): Where should read all information.  
>   
> ***nodes*** (optional): Which king of information should read. Known nodes are: repository, issues, pulls and commits

## License
[MIT](https://choosealicense.com/licenses/mit/)