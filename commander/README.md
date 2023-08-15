# Unity Publish API Command-line Tool

A Node.js command-line tool to interact with Unity's API for package management.

## Installation

Clone or download this repository, then navigate to the project directory and install the required dependencies:

```bash
npm install
```

Usage
This tool provides several subcommands to interact with Unity's API for package management. You can use the following commands:

```bash
Usage: publish [options] [command]

Options:
  -V, --version                             output the version number
  -h, --help                                display help for command

Commands:
  login                                     Log in and obtain access tokens
  delete-draft <packageVersionId>           Delete a draft package version
  get-package-version <packageVersionId>    Get package version details
  upload-unity-package <paramsFile>         Upload Unity package
  get-publisher-limits                      Get publisher limits
  get-category-list                         Get list of categories
  get-package-version <package_version_id>  Get package version by ID
  help [command]                            display help for command

Example:
  node publish.js login
  node publish.js delete-draft 123456
  node publish.js get-package-version 789012
  node publish.js upload-unity-package uploadParams.json
  node publish.js get-publisher-limits
  node publish.js get-category-list
  node publish.js get-package-version 345678
```

# Configuration
Create a config.json file with the following format:

```
{
"host": "https://assetstore-XXX.unity.com",
"username": "your_username",
"password": "your_password"
}
```

# Example Upload Parameters

Create a params.json file with the following format:

```bash
{
    "unity_version": "2022.3.2f1",
    "file": "../data/openapi.unitypackage",
    "packageVersion_id": 253066
}

```

Replace "2022.3.2f1", "../data/openapi.unitypackage", and 253066 with your desired Unity version, the file path to your Unity package, and the package version ID respectively.

# License
This project is licensed under the MIT License - see the LICENSE file for details.