import * as core from "@actions/core";
import * as github from "@actions/github";

import { Game } from "./tictactoe.js";

const MOVE_COMMENT_PATTERN = /[A-C][1-3]/;

async function post(owner, repo, issuNumber, comment) {
  return await octokit.issues.createComment({
      owner: owner,
      repo: repo,
      issue_number: issueNumber,
      body: comment,
  });
}

async function run() {
  try {
    const token = core.getInput("token");

    const payload = github.context.payload;
    const body = payload.comment.body;
    const owner = payload.repository.owner.login;
    const repo = payload.repository.name;
    const issueNumber = payload.issue.number;

    if(body.match(MOVE_COMMENT_PATTERN)) {
      let response = "";

      const octokit = github.getOctokit(token);
      const commentsRequest = await octokit.request(
          "GET /repos/{owner}/{repo}/issues/{issue_number}/comments", {
            owner: owner,
            repo: repo,
            issue_number: issueNumber,
          });

      if(commentsRequest.status != 200) {
        throw new Error("Could not retrieve comments");
      }

      const comments = commentsRequest.data;
      const moves = comments.filter((c) => c.body.match(MOVE_COMMENT_PATTERN));

      // reconstruct game session
      const game = new Game();
      moves.forEach((c) => game.makeMove(c.body));

      if(game.isGameOver()) {
        await post(owner, repo, issueNumber, "Error: game is already over!");
      } else {
        const counterMove = game.calculateBestMove();
        game.makeMove(counterMove);
        await post(owner, repo, issueNumber, counterMove);

        if(game.isGameOver()) {
          await post(owner, repo, issueNumber, "Game over!");
        }

        await post(owner, repo, issueNumber, game.toString());
      }
    }
  } catch(error) {
    core.setFailed(error.message);
  }
}

run();
