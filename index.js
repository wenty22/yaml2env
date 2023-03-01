const core = require('@actions/core');
const github = require('@actions/github');
const yaml = require('js-yaml');
const fs   = require('fs');

function findEnvObj(obj, targetKey) {
  for (let k in obj) {
    const currKey = k
    const currVal = obj[k]

    if (currKey === targetKey) {
      return currVal
    } else if (typeof currVal === 'object') {
      return findEnvObj(currVal, targetKey)
    }
  }
}

try {
  const file = core.getInput('file');
  const key = core.getInput('key')

  const doc = yaml.load(fs.readFileSync(file, 'utf8'));
  const envs = findEnvObj(doc, key) || []

  envs.forEach(item => {
    const { name, value } = item
    core.exportVariable(name, value)
  })

  core.setOutput("envs", JSON.stringify(envs));

} catch (error) {
  core.setFailed(error.message);
}