export default (variables, source) =>
  variables
    .map(variable => `const ${variable} = ${source}.${variable};`)
    .join('\n');
