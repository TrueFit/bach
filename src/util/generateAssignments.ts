export default (variables: string[], source: string): string =>
  variables.map((variable) => `const ${variable} = ${source}.${variable};`).join('\n');
