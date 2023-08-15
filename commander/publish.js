#!/usr/bin/env node

'use strict';

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const commander = require('commander');
const unityApiLib = require('../lib'); // Adjust the path to the actual location of your library file
const config = require('./config.json');

unityApiLib.setConfig('');

const program = new commander.Command();

program.version('1.0.0');

unityApiLib.setConfig(config.host || '');

// Login subcommand
program
  .command('login')
  .description('Log in and obtain access tokens')
  .action(async () => {
    try {
      const keys = await unityApiLib.login(config.username, config.password);
      console.log('Keys:', keys);
    } catch (error) {
      console.error('Error:', error.message);
    }
  });

// Delete draft package version subcommand
program
  .command('delete-draft <packageVersionId>')
  .description('Delete a draft package version')
  .action(async (packageVersionId) => {
    try {
      const keys = await unityApiLib.login(config.username, config.password);
      const result = await unityApiLib.deleteDraftPackageVersion(keys, packageVersionId);
      console.log('Result:', result);
    } catch (error) {
      console.error('Error:', error.message);
    }
  });

// Get package version subcommand
program
  .command('get-package-version <packageVersionId>')
  .description('Get package version details')
  .action(async (packageVersionId) => {
    try {
      const keys = await unityApiLib.login(config.username, config.password);
      const packageVersion = await unityApiLib.getPackageVersion(keys, packageVersionId);
      console.log('Package Version:', packageVersion);
    } catch (error) {
      console.error('Error:', error.message);
    }
  });

// Upload Unity package subcommand
program
  .command('upload-unity-package <paramsFile>')
  .description('Upload Unity package')
  .action(async (paramsFile) => {
    try {
      const uploadParamsJson = fs.readFileSync(paramsFile, 'utf8');
      const uploadParams = JSON.parse(uploadParamsJson); // Parse the JSON content
      const keys = await unityApiLib.login(config.username, config.password);

      // upload package
      var result = await unityApiLib.uploadUnityPackage(keys, uploadParams.file, uploadParams.packageVersion_id, uploadParams.unity_version);
      const packageVesrsionData = await unityApiLib.getPackageVersion(keys, uploadParams.packageVersion_id);
      await unityApiLib.updatePackageSRPData(keys, uploadParams.packageVersion_id, packageVesrsionData, uploadParams);

      // update deatils
      await unityApiLib.updatePackageMetaData(keys, uploadParams.packageVersion_id, uploadParams);
      result = await unityApiLib.updatePackageKeyImagesData(keys, uploadParams.packageVersion_id, uploadParams);

      console.log('Upload result:', result);
    } catch (error) {
      console.error('Error:', error.message);
    }
  });

// Get publisher limits subcommand
program
  .command('get-publisher-limits')
  .description('Get publisher limits')
  .action(async () => {
    try {
      const keys = await unityApiLib.login(config.username, config.password);
      const limits = await unityApiLib.getPublisherLimits(keys);
      console.log('Publisher Limits:', limits);
    } catch (error) {
      console.error('Error:', error.message);
    }
  });

// Get category list subcommand
program
  .command('get-category-list')
  .description('Get list of categories')
  .action(async () => {
    try {
      const keys = await unityApiLib.login(config.username, config.password);
      const categories = await unityApiLib.getCategoryList(keys);
      console.log('Categories:', categories);
    } catch (error) {
      console.error('Error:', error.message);
    }
  });

  // Get package version subcommand
program
.command('get-package-version <package_version_id>')
.description('Get package version by ID')
.action(async (package_version_id) => {
  try {
    const keys = await unityApiLib.login(config.username, config.password);
    const packageVersion = await unityApiLib.getPackageVersion(keys, package_version_id);
    console.log('Package Version:', packageVersion);
  } catch (error) {
    console.error('Error:', error.message);
  }
});

program.parse(process.argv);
