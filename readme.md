# caution this module isn't tested

# import
using esnext
```js
import cybedb from 'cybe-db'
const db = new cybedb('./tmp/index.json');
```

using es5
```js
const cybedb = require("cybe-db/dist/es5/index.js");
const db = new cybedb('./tmp/index.json')
```

# cli
helper cli
```cmd
node ./node_modules/cybe-db/cli/index.js
```