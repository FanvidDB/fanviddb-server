---
layout: default
title: Docs site
---

# Docs site

The `/docs/` folder of [FanvidDB/fanvid-server](https://github.com/FanvidDB/fanviddb-server) is used to generate [docs.fanviddb.com](https://docs.fanviddb.com). The instructions on this page are for people who want to be able to test changes to the docs locally, which is useful for:

- Making structural changes to the Jekyll configuration.
- Making changes to HTML / CSS / Javascript
- Making frequent changes to content and verifying it looks as expected before making a pull request

For instructions on how to propose simple changes to file content, see [Contributing -> Documentation](/contributing/documentation.html).

### Setup

1. [Install Jekyll](https://jekyllrb.com/docs/installation/) and bundler on your computer. We recommend using rbenv for the installation, but it is not required.
2. Navigate to the `docs/` folder.
3. Run `bundle install`

### Running jekyll

1. In your terminal, navigate to the `docs/` folder
2. Run `bundle exec jekyll serve`
3. In your browser, open <http://127.0.0.1:4000>
