import * as core from "@actions/core";
import * as github from "@actions/github";

import { Game } from "./tictactoe.js";

const MOVE_COMMENT_PATTERN = /[A-C][1-3]/;

class Poster {
  constructor(octokit, owner, repo, issueNumber) {
    this.octokit = octokit;
    this.owner = owner;
    this.repo = repo;
    this.issueNumber = issueNumber;
  }

  post(comment) {
    return this.octokit.issues.createComment({
        owner: this.owner,
        repo: this.repo,
        issue_number: this.issueNumber,
        body: comment,
    });
  }
}

async function run() {
  try {
    const token = core.getInput("token");
    const octokit = github.getOctokit(token);

    const payload = github.context.payload;
    const body = payload.comment.body;
    const owner = payload.repository.owner.login;
    const repo = payload.repository.name;
    const issueNumber = payload.issue.number;

    const poster = new Poster(octokit, owner, repo, issueNumber);

    if(body.match(MOVE_COMMENT_PATTERN)) {
      let response = "";

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
        await poster.post("Error: game is already over!");
      } else {
        const counterMove = game.calculateBestMove();
        game.makeMove(counterMove);
        await poster.post(counterMove);

        if(game.isGameOver()) {
          await poster.post("Game over!");
        }

        await poster.post("```\n" + game.toString() + "\n```");
      }
    }
  } catch(error) {
    core.setFailed(error.message);
  }
}

run();
