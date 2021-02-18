# tic-tac-toe-action
Tic Tac Toe in your issue tracker!

# Usage

```
name: Execute Tic Tac Toe Move

on:
  issue_comment:
    types: [ created ]
  workflow_dispatch:

jobs:
  execute-move:
    runs-on: ubuntu-latest
    steps:
      - name: Play Tic Tac Toe
        uses: remcokranenburg/tic-tac-toe-action@main
        with:
          token: ${{secrets.GITHUB_TOKEN}}
```
