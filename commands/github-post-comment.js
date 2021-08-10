const db = require("../database");
const { Octokit } = require("@octokit/core");
const { restEndpointMethods } = require("@octokit/plugin-rest-endpoint-methods");
const MyOctokit = Octokit.plugin(restEndpointMethods);

module.exports = {
    name: "github-post-comment",
    description: "Post a comment on GitHub Issue or PR",
    execute(command, message, args) {
        // -github-post-comment: Posts desired comment on previously specified issue/PR
        if (command === "github-post-comment") {
            let comment = args.slice(3);
            comment = comment.join(" ");
            db.fetchGit(message.author.id).then((result) => {
                let octokit = new MyOctokit({ auth: result });
                postComment(comment, octokit);
            }).catch((err) => {
                console.error(err);
                return message.reply("Your GitHub token isn't on file. Run -github-info, specifying your GitHub token (and then try this again)");
            });
        }

        // Post Comment function
        async function postComment(comment, octokit) {
            await octokit.rest.issues
                .createComment({
                    owner: args[0],
                    repo: args[1],
                    issue_number: args[2],
                    body: comment,
                })
                .then(() => {
                    return message.reply(
                        `Your comment, "${comment}" has been posted on ${args[0]}'s repo, ${args[1]} in issue/PR #${args[2]}.`
                    );
                })
                .catch((error) => {
                    console.info(error);
                    return message.reply(
                        "Posting your comment was unsuccessful. Please ensure you have set your GitHub token using -github and entered the information in the correct order of organisation name, repo name, issue/PR number and comment and then try again."
                    );
                });
        }
    },
};
