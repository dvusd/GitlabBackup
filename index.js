'use strict';

let rp = require('request-promise');
let _ = require('lodash');
let tokenJson = require('./token')

const gitlabUrl = tokenJson.url;
const token = tokenJson.token;
const useSSH = tokenJson.use_ssh;

let Promise = require('bluebird')
let cmd = require('node-cmd')


rp.get(`https://${gitlabUrl}/api/v4/groups`, {
    json: true,
    qs: {
        simple: true,
    },
    headers: {
        'PRIVATE-TOKEN': token
    }
}).then(groups => {
    let gids = _.map(groups, 'id')
    let pgits = [];
    let promises = [];
    for (let gid of gids) {
        promises.push(
            rp.get(`https://${gitlabUrl}/api/v4/groups/${gid}/projects`, {
                json: true,
                qs: {
                    simple: true,
                },
                headers: {
                    'PRIVATE-TOKEN': token
                }
            }).then(projects => {
                let ps = {};
                if (useSSH) {
                    ps = _.map(projects, 'ssh_url_to_repo')
                } else {
                    ps = _.map(projects, 'http_url_to_repo')
                }
                for (let p of ps) {
                    pgits.push(p);
                }
            })
        )
    }
    https: //www.gitlab.com/
        Promise.all(promises).then(() => {
            console.log(pgits);
            for (let git of pgits) {
                let prefixlen = (4 + gitlabUrl.length + 1);
                let projname = git.substring(prefixlen, git.length - 4);
                console.log(`cloning ${projname}`);
                cmd.run(`git clone ${git} backup/${projname}`);
            }
        });
})
