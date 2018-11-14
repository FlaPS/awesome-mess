One of the previos projects.  Some features are removed from build

WebUI code is here
```packages/re-atoms/src```  

You can start investigate the structure from here
```packages/re-atoms/src/app/nav```

material-ui styles are broken in some cases.


# Init #
```
    npm i 
    lerna bootstrap
    lerna run watch --parallel
```
Be careful, initial installation & build could occupy a lot of time.
And the last script ```watch``` will never stop, so keep an eye on console

###  Master server ###
Wait while ```watch``` complete the job. Do not turn if of after. 
Open new terminal window
to start-up master server
```
    cd packages/service-actor
    npm start
```
check configs and logs of the "in memory" actors here:
```/Users//YourName/rigspace/slave1/config/```
(in case of Linux... i don't remember the default app data path)

Change MySQL settings in json files if needed, and restart server in case of changes
Seed variable means the amout of seeded items for tests
 
You can watch for a complete logs here:
```/Users/rigspace/slave1/log```
 
###  frontend  ###

```
    cd packages/re-atoms/
    npm start
```
Open suggested URL and type the address of the backend (same host by default, but port is 8000), or visit backend initial route

### Run storybook ###
```
    cd packages/re-atomr
    npm run storybook
```
Some components might not work without redux state mocks

