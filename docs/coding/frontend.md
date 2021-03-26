---
layout: default
title: Frontend
---

# Frontend

The frontend uses [Bootstrap](https://getbootstrap.com/) for the docs pages and the header bar; the main body of the site uses [ReactJS](https://reactjs.org/) with [Ant Design Components](https://ant.design/components/overview/).

<div class="alert alert-info" role="alert">
  The instructions on this page assume that you are familiar with GitHub and the command line.
  If you are not but want to be, check out <a href="https://lab.github.com/githubtraining/first-day-on-github">First Day On Github</a>!
</div>

## Setup (Mac OS)

First, create a fork of [github.com/FanvidDB/fanviddb-server](https://github.com/FanvidDB/fanviddb-server) that you can clone. Then you can do the following steps:

1. `git clone git@github.com:your-username/fanviddb-server.git`
2. [Install `yarn`](https://classic.yarnpkg.com/en/docs/install#mac-stable)
3. (Optional) If you want to interact with the backend, [set up the backend](/coding/backend.html)

## One-off build

If all you want it to build the frontend once and then interact primarily with the backend, run:

```
yarn build
```

## Automatic rebuilds of the frontend

If you are doing significant work on the frontend, run:

```
yarn start
```

This will spin up a web server at <http://localhost:3000> that automatically proxies API requests to the backend server, and automatically restarts when there are changes to your Javascript.
