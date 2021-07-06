---
title: NPM version bumping and extra files
slug: npm-version-bumping-extra-files
date: 2016-05-05 04:00:00
layout: post.html
---

NPM has a handy little feature for bumping the versions on your packages, and it works like this:

```
npm version [major | minor | patch]
```

Want to run tests first, minify your code, and only publish the new version if everything works? Sure:

```
// package.json
{

  ...

  "scripts": {
    "preversion": "npm test",
    "version": "npm run dist && git add -A dist",
    "postversion": "git push && git push --tags && npm publish"
  }
}
```

Ok, but what if the package has a *bower.json*, too? Or if other files need to include the current version number? [Gulp](http://gulpjs.com) and [Grunt](http://gruntjs.com) both have plugins to automate this, but NPM scripts don't.

In my case, I wanted to include a RawGit CDN link in my README, and have it always include the latest stable version. Here's what I did:

```
npm install --save-dev replace
```

```
// package.json
{

  ...

  "scripts": {
    "preversion": "npm test",
    "preversion:readme": "replace '/v\\d+\\.\\d+\\.\\d+' \"/v$npm_package_version\" ./README.md",
    "version": "npm run preversion:readme && npm run dist && git add -A dist README.md",
    "postversion": "git push && git push --tags && npm publish"
  }
}
```

With those four tasks, `npm version patch` will now:

1. Run your tests, and abort if they fail.
2. Build your *dist/* scripts.
3. Bump the version in *package.json*.
4. Bump the version in *README.md*.
5. Commit *package.json*, *README.md*, and the *dist/* output.
6. Create a new tag.
7. Push the commit and tag to GitHub.
8. Publish the new version on NPM.

For more on how this works, see the [full documentation on NPM scripts](https://docs.npmjs.com/misc/scripts).
