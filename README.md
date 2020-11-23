# GitlabBackup

A Small utility to backup all of your active gitlab repositories to the local filesystem.  Please note that archived projects are skipped.

Before running the script, make sure you have persisted authentication on local cli with gitlab.

Create a file named `config.json` with the structure
```javascript
{
    "api_version" : "v4",
    "token" : "<gitlab-token>",
    "url" : "<custom-gitlab-domain>",
    "use_ssh": <boolean>
}

```

place the file in the root directory of the project.

run the following commands
```javascript
npm install
npm start
```

#### Future Scope
    Not planned. Please follow original project for it.
