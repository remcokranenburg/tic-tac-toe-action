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
    const owner = payload.repository.owner.id;
    const repo = payload.repository.id;
    const issue_number = payload.issue.number;

    console.log("Unpacked payload")

    const octokit = github.getOctokit(token);

    console.log("Get octokit")

    // TODO: calculate best counter move

    const { data: comment } = await octokit.issues.createComment({
      owner: owner,
      repo: repo,
      issue_number: issue_number,
      body: `Your move is: ${body}`,
    });

    console.log("Post comment");

    console.log(comment);
  } catch(error) {
    core.setFailed(error.message);
  }
}

run();
