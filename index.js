import * as core from @actions/core;
import * as github from @actions/github;

try {
  console.log("Hello, player! I predict your move is going to be A1!");
  const hardcodedMove = core.getInput("move");
  console.log(`Your move is: ${hardcodedMove}`);

  const payload = JSON.stringify(github.context.payload, undefined, 2)

  console.log("Or is your move different?");
  console.log(payload);
} catch(error) {
  core.setFailed(error.message);
}

