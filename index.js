'use strict';

let rp = require('request-promise');
let _ = require('lodash');
let config = require('./config')

const gitlabUrl = config.url;
const token = config.token;
const useSSH = config.use_ssh;
const apiVersion = config.api_version;

let Promise = require('bluebird')
let cmd = require('node-cmd')


rp.get(`https://${gitlabUrl}/api/${apiVersion}/groups?order_by=name&sort=asc&per_page=100`, {
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
            rp.get(`https://${gitlabUrl}/api/${apiVersion}/groups/${gid}/projects?order_by=name&sort=asc&per_page=100`, {
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
