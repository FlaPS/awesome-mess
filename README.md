If you are interested in front end check for
 
```packages/re-atoms/src```  


material-ui styles are broken in some cases.

Some features are removed from build

# Init #
```
    npm i 
    lerna bootstrap
    lerna run watch --parallel
```
#####  Master server #####
Wait while ```watch``` complete the job. Do not turn if of after. 
Open new terminal window
To start-up master server
```
    cd packages/service-actor
    npm start
```
check configs and logs of the "in memory" actors here:
```/Users/rigspace/slave1/config/```

Change MySQL settings in json files if needed, and restart server in case of changes
Seed variable means the amout of seeded items for tests
 
You can watch for a complete logs here:
```/Users/rigspace/slave1/log```
 
#####  frontend #####

```
    cd packages/re-atomr
    npm start
```


### Run storybook ###
```
    cd packages/re-atomr
    npm run storybook
```
