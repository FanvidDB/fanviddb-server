---
layout: default
title: Plex Metadata Agent
---

# Plex Metadata Agent

The metadata agent can be found at [FanvidDB/FanvidDB.bundle](https://github.com/FanvidDB/FanvidDB.bundle).

<div class="alert alert-info" role="alert">
  The instructions on this page assume that you are familiar with GitHub and the command line.
  If you are not but want to be, check out <a href="https://lab.github.com/githubtraining/first-day-on-github">First Day On Github</a>!
</div>

## Setup (Mac OS)

### Prerequisites

1. Install [homebrew](https://brew.sh/), a package manager for Mac OS.
2. In a terminal, run:
   ```
   brew install pyenv
   ```
3. Follow the printed instructions to make sure [pyenv](https://github.com/pyenv/pyenv) and libpq are initialized when your terminal starts up. It should be something like:
   ```
   echo 'export PATH="/usr/local/opt/libpq/bin:$PATH"' >> ~/.zshrc
   echo 'eval "$(pyenv init --path)"' >> ~/.zprofile
   echo 'eval "$(pyenv init -)"' >> ~/.zshrc
   ```
4. Restart your terminal
5. Install Python 2.7 & 3.7
   ```
   pyenv install 2.7.18
   pyenv install 3.7.12
   ```
6. Install [Plex Media Server](https://www.plex.tv/media-server-downloads/)

### Fork & clone the repository

Create a fork of [github.com/FanvidDB/FanvidDB.bundle)](https://github.com/FanvidDB/FanvidDB.bundle) that you can clone.

```bash
git clone git@github.com:your-username/FanvidDB.bundle.git
cd FanvidDB.bundle
pyenv local 2.7.18
python -m venv .venv
source .venv/bin/activate
pip install -U pip wheel
pip install -r requirements-dev.txt
pip3 install -U pip wheel
pip3 install -r requirements-py3lint.txt
make build
ln -s "$PWD/build/" "$HOME/Library/Application Support/Plex Media Server/Plug-ins/FanvidDB.bundle"
```

### Building the plugin

After you make changes to the plugin, you will need to take the following steps to get it loaded by Plex:

1. Run `make build` at the root of your FanvidDB.bundle repository
2. Restart your Plex Media Server

### Why build the plugin instead of just developing the code directly?

Plex uses Python 2.7. Plugins can have the following structure:

```
-Contents
 |-Code
 | |-# python code lives here
 |-Libraries
 | |-Shared
 | | |-# additional python dependencies for the plugin can live here.
 |-DefaultPrefs.json
 |-Info.plist
```

It also runs a special embedded version of python that has some unusual properties, like additional superglobal variables (which are defined in the Framework.bundle that is included in the base Plex Media Server installation).

Treating the final plugin as a built artifact allows developers to use modern python development practices, and the build process can take any necessary steps to ensure that the resulting code will also run inside Plex.

## Running tests

Tests use [the pytest framework](https://docs.pytest.org/) and can be run with the following command:

```bash
pytest
```

## Before you push new code

If you make changes to the backend code, make sure to run the following commands prior to creating a pull request:

```bash
pytest    # Runs python tests
make fmt  # Auto-enforces code style
make lint # Checks code style
```

## Troubleshooting (Mac)

Assuming you are developing on a machine that is also running plex media server, you can find the latest [logs](https://support.plex.tv/articles/200250417-plex-media-server-log-files/) at `~/Library/Logs/Plex Media Server/`

Plex has nested layers of services that call each other, and each have separate logs. You may need to investigate all the following logs to find relevant errors if something isn't working right (from innermost layer to outermost):

- `PMS Plugin Logs/com.fanviddb.agents.fanvids.log`
- `com.plexapp.system.log`
- `Plex Media Server.log`
