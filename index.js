const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
    console.log("Hello, player! I know your secret!");
    const token = core.getInput("token");

    const payload = github.context.payload;
    const body = payload.comment.body;
    const owner = payload.repository.owner.id;
    const repo = payload.repository.id;
    const issue_number = payload.issue.number;

    const octokit = github.getOctokit(token);
    const { data: comment } = await octokit.issues.createComment({
      owner: owner,
      repo: repo,
      issue_number: issue_number,
      body: `Your move is: ${body}`,
    });

    console.log(comment);
  } catch(error) {
    core.setFailed(error.message);
  }
}

run();
