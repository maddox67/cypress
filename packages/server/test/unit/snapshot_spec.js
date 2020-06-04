/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const snapshot = require('snap-shot-it');

// sanity check to make sure backtick escape works with our snapshots
it("saves snapshot with backticks", function() {
  const text = `\
line 1
line 2 with \`42\`
line 3 with \`foo\`\
`;
  return snapshot("has backticks", text);
});