
import { configure } from '@storybook/react'
const req = require.context("../lib", true, /.story.js$/);

configure(() => {
    require('../lib/index.story')
    req.keys()
        .sort()
        .forEach(filename => {
            if(!filename.includes('lib/index.story'))
                req(filename)
        });
}, module);


/*fs.watch('../dist/', [{recursive: true}], (event, name) =>{
    if (event === 'update')
    {
        let re = '(.*)\.story\.(.*)';
        if (re.test(name))
            configure(reloadStories(name), module)
    }
})


function reloadStories(name) {
    require('../dist/index.story')
    require(name)
}*/
