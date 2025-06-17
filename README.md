<p align="center">
  <img width="160" height="160" src="https://avatars.githubusercontent.com/u/201536780?s=160&v=4" />
</p>
<h1 align="center">ATProto Jetstream Module</h1>
<h3 align="center">
  AT Protocol Jetstream Module for Open Web Desktop.
</h3>

## Overview

This module enables real-time reactive syncing of Open Web Desktop state
from the AT Protocol using Jetstream, a lightweight streaming service.

## Features

- Connects to Jetstream over WebSocket
- Subscribes to desktop collections (org.owdproject.\*)
- Streams updates for `desktop`, `windows`, and `meta`
- Automatically patches Pinia stores in real-time

## Installation

```bash
owd install-module @owdproject/module-atproto-jetstream
```

## Usage

#### Available configuration

You could set this configuration in `/desktop/owd.config.ts`:

```json
atprotoJetstream: {
  {
    startOwnerDesktopStreamOnMounted: true,
    host: "jetstream1.us-east.bsky.network"
  }
}
```

## Requirements

- [@owdproject/module-atproto](https://github.com/atproto-os/module-atproto)
- [@owdproject/module-atproto-persistence](https://github.com/atproto-os/module-atproto-persistence)

## License

This module is released under the [MIT License](LICENSE).
