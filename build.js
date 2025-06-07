const fs = require('fs');
const tel = process.env.TEL_SOCIETE || '242050787624';
fs.writeFileSync('config.js', `window.config = { telSociete: '${tel}' };\n`);
console.log('config.js generated with telSociete:', tel);
