---
layout: default
title: Docs site
---

# Docs site

<div class="alert alert-info" role="alert">
  The instructions on this page assume that you are familiar with GitHub and the command line.
  If you are not but want to be, check out <a href="https://lab.github.com/githubtraining/first-day-on-github">First Day On Github</a>!
</div>

The `/docs/` folder of [FanvidDB/fanvid-server](https://github.com/FanvidDB/fanviddb-server) is used to generate [docs.fanviddb.com](https://docs.fanviddb.com). The instructions on this page are for people who want to be able to test changes to the docs locally, which is useful for:

- Making structural changes to the Jekyll configuration.
- Making changes to HTML / CSS / Javascript
- Making frequent changes to content and verifying it looks as expected before making a pull request

For instructions on how to propose simple changes to file content, see [Contributing -> Documentation](/contributing/documentation.html).

## Setup

1. [Install Jekyll](https://jekyllrb.com/docs/installation/) and bundler on your computer. We recommend using rbenv for the installation, but it is not required.
2. Clone the repository: `git clone git@github.com:your-username/fanviddb-server.git`
3. Navigate to `fanviddb/docs/`
4. Run `bundle install`

## Running jekyll for local development

1. In your terminal, navigate to `fanviddb/docs/`
2. Run `bundle exec jekyll serve`
3. In your browser, open <http://127.0.0.1:4000>

## Code style with Prettier

The FanvidDB repository's test suite enforces code style for markdown, yaml, and other file formats using [Prettier](https://prettier.io/).

You can manually fix any code style errors; however, if you want to automatically format your markdown prior to creating a pull request, you can:

1. [Install `yarn`](https://classic.yarnpkg.com/en/docs/install#mac-stable)
2. Run `make fmt`
