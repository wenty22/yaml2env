const core = require('@actions/core');
const github = require('@actions/github');
const yaml = require('js-yaml');
const fs   = require('fs');

try {
  const file = core.getInput('file');
  const keys = core.getInput('key-path').split('.')

  const doc = yaml.load(fs.readFileSync(file, 'utf8'));
  const output = keys.reduce((dict, key) => dict[key], doc)

  const variables = Array.isArray(output) ? output : [output]
  variables.forEach(item => {
    const { name, value } = item
    core.exportVariable(name, value)
  })

  core.setOutput("env", JSON.stringify(variables));

} catch (error) {
  core.setFailed(error.message);
}