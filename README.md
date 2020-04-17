# ng-rnc

This is a fork from the original [ng-rn](https://github.com/rechenberger/ng-rn) which wasn't maintained for the last few years and hasn't merged a fix for newer Angular Versions.

## Rename Angular Components

### One Time Usage
```
  npx ng-rnc old-button fancy-button
```


### Install
```
  npm i -g ng-rnc
```

### Usage
```
  cd /path/to/angular-project/
  ng-rnc old-button fancy-button
```

The Tool looks for the components in `src/app/`. If your components are located in a more complex path like `src/app/my-vip-components`, just change directory:
```
  cd src/app/my-vip-components
  ng-rnc old-button fancy-button
```


