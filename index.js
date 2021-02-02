const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
    const token = core.getInput("token");
    console.log("I know your secret!")

    console.log("Payload:")
    console.log(JSON.stringify(github.context.payload, null, 2))

    const payload = github.context.payload;
    const body = payload.comment.body;
    const owner = payload.repository.owner.login;
    const repo = payload.repository.name;
    const issueNumber = payload.issue.number;
    console.log("Unpacked payload")

    const octokit = github.getOctokit(token);
    console.log("Got octokit")

    // TODO: calculate best counter move

    const comment = `Your move is ${body}`;
    console.log("Create comment:", owner, repo, issueNumber, comment)

    await octokit.issues.createComment({
      owner: owner,
      repo: repo,
      issue_number: issueNumber,
      body: `Your move is: ${body}`,
    });
    console.log("Posted comment");
  } catch(error) {
    core.setFailed(error.message);
  }
}

run();
