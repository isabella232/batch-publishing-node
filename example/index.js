'use strict';

const publisherPortalLib = require('../lib');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

async function main() {

    var unity_version = "2022.3.2f1";
    var file = "../data/openapi.unitypackage";
    var packageVersion_id = 253067;
    
    publisherPortalLib.setConfig(process.env.HOST)

    var keys = await publisherPortalLib.login(process.env.USERNAME, process.env.PASSWORD);
    await publisherPortalLib.getPackageVersion(keys, packageVersion_id)
    //await publisherPortalLib.deleteDraftPackageVersion(keys, packageVersion_id)

    //await publisherPortalLib.getPublisherLimits(keys)
    //await publisherPortalLib.getCategoryList(keys)
    await publisherPortalLib.uploadUnityPackage(keys, file, packageVersion_id, unity_version)
}

main()
    .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });