'use strict';

require('dotenv').config()

const axios = require('axios');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const FormData = require('form-data');

const host = ""

const setConfig = (host) => {
    this.host = host
}

const login = async (username, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            // login
            var token = await axios.post(`${this.host}/api/login`, {
                'username': username,
                'password': password
            });
            var user_id = token.data.userId;
            var access_token = token.data.accessToken;
            
            var key = await axios.post(`${this.host}/api/publishing-key`, {}, {
                    headers: { Authorization: `Bearer ${access_token}` }    
                });
            var payload = {
                'sub': key.data.keyChainId.toString(),
                'iss': key.data.keyChainId.toString(),
                'iat': Date.now() / 1000 - 60,
                'exp': Date.now() / 1000 + 86400,  
                'aud': 'genesis',
                'scope': 'genesis.generateAccessToken'
            }

            var private_key = `-----BEGIN PRIVATE KEY-----\n${key.data.privateKey}\n-----END PRIVATE KEY-----`

            var api_token = jwt.sign(payload, private_key, { 
                algorithm: 'RS256',
                header: {'kid': key.data.id.toString(), 'uid': user_id.toString()}
            });
            resolve({api_token, access_token});
        } catch (err) {
            reject(err);
        }
    })
    
}

const deleteDraftPackageVersion = async (keys, package_version_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            var config = { headers: { Authorization: `Bearer ${keys.api_token}` }}
            var res = await axios.delete(`${this.host}/store-publishing/package-version/${package_version_id}`, config);
            resolve(res);
        } catch (err) {
            reject(err);
        }})
}


const getPackageVersion = async (keys, package_version_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            var config = { headers: { Authorization: `Bearer ${keys.api_token}` }}
            var res = await axios.get(`${this.host}/store-publishing/package-version/${package_version_id}`, config);
            resolve(res.data);
        } catch (err) {
            reject(err);
        }})
}

const getUnityVersionsList = async (keys) => {
    return new Promise(async (resolve, reject) => {
        try {
            var config = { headers: { Authorization: `Bearer ${keys.api_token}` }}
            var res = await axios.get(`${this.host}/store-publishing/fetch/unity-versions`, config);
            resolve(res.data);
        } catch (err) {
            reject(err);
        }})
}

const getCategoryList = async (keys) => {
    return new Promise(async (resolve, reject) => {
        try {
            var config = { headers: { Authorization: `Bearer ${keys.api_token}` }}
            var res = await axios.get(`${this.host}/store-publishing/fetch/categories`, config);
            resolve(res.data);
        } catch (err) {
            reject(err);
        }})
}

const getPublisherLimits = async (keys) => {
    return new Promise(async (resolve, reject) => {
        try {
            var config = { headers: { Authorization: `Bearer ${keys.access_token}` }}
            var res = await axios.get(`${this.host}/api/publishing-limit`, config);
            resolve(res.data);
        } catch (err) {
            reject(err);
        }})
}

const uploadUnityPackage = async (keys, file, packageVersion_id, unity_version) => {
    return new Promise(async (resolve, reject) => {
        try {
            var filesize = await fs.statSync(file);
            const size = filesize.size; 

            var res = await axios.post(`${this.host}/store-publishing/package-version/${packageVersion_id}/unitypackage/prepare`, {
                'unityVersion': unity_version,
                'sizes': [size] },
                { headers: { Authorization: `Bearer ${keys.api_token}` }}
            );

            const form = new FormData();
            form.append('file', fs.createReadStream(file));
            form.append('unityVersion', unity_version);
            form.append('index', 0);

            var res = await axios.post(`${this.host}/store-publishing/package-version/${packageVersion_id}/unitypackage`, form, 
                { headers: { Authorization: `Bearer ${keys.api_token}` }}
            );

            resolve(res.data);
        } catch (err) {
            reject(err);
        }
    })
}

module.exports = {
    setConfig,
    login,
    deleteDraftPackageVersion,
    getPackageVersion,
    getUnityVersionsList,
    getCategoryList,
    getPublisherLimits,
    uploadUnityPackage
};