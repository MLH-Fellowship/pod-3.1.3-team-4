const fs = require("fs");

module.exports = {
    name: "github-projects",
    description: "GitHub Project Functionality",
    execute(command, message, args) {
        // -github-projects: Selects GitHub Project Fnctionality
        if (command === "github-projects") {
            // TODO: Refactor into Switch Statement - see Code Freeze PR Notes
            if (!args[0]) {
            return message.reply(
                "add create (-github-projects create-project) to create a new project or select (-github-projects select-project) to select an existing project."
            );

            // Create Project
            } else if (args[0] === "create-project" && !args[1]) {
                return message.reply(
                    "to create a new GitHub Project, add create followed by the owner, repo and project title (-github-project create-project repo-owner repo-name project-title)."
                )
            } else if (args[0] === "create-project" && args[1]) {
                let projectTitle = args.slice(2);
                projectTitle = projectTitle.join(" ");
                createProject(projectTitle, args);
            
            // Create Column
            } else if (args[0] === "create-column" && !args[1]) {
                return message.reply(
                    "to create a new column, add create-column followed by project id and name (-github-project create-column project-id column-name)."
                )
            } else if (args[0] === "create-column" && args[1]) {
                let columnName = args.slice(2);
                columnName = columnName.join(" ");
                createColumn(columnName, args);

                // Select Project
            } else if (args[0] === "select-project" && !args[1]) {
                return message.reply(
                    "please provide your GitHub Project ID in order to select a project."
                )
            } else if (args[0] === "select-project" && args[1]) {
                getProject(args[1]);
            }
        }

        function readToken() {
            try {
                const data = fs.readFileSync("./github-token.txt", "utf8");
                return data;
            } catch (err) {
                console.error(err);
                return message.reply(
                    "your GitHub Personal Access Token could not been read. Please set it again using -github-info."
                );
            }
        }

        // Create Project function
        async function createProject (projectTitle, args) {
            // GitHub Variables
            let githubToken = readToken();

            // Intialise GitHub API
            const { Octokit } = require("@octokit/core");
            const { restEndpointMethods } = require("@octokit/plugin-rest-endpoint-methods");
            const MyOctokit = Octokit.plugin(restEndpointMethods);
            let octokit = new MyOctokit({ auth: githubToken });

            octokit.rest.projects.createForRepo({
                owner: args[1],
                repo: args[2],
                name: projectTitle,
              })
                .then((result) => {
                    return message.reply(
                        "your new project '" +
                            projectTitle +
                            "' has been created in " +
                            args[1] +
                            "'s repo, " +
                            args[2] +
                            "."
                    );
                })
                .catch((error) => {
                    console.error(error);
                    return message.reply(
                        "creating your project was unsuccessful. Please ensure you have set your GitHub token using -github and entered the information in the correct order of organisation name, repo name and project title and then try again."
                    );
                });
        }

        // Create Column function
        async function createColumn (columnName, args) {
            // GitHub Variables
            let githubToken = readToken();

            // Intialise GitHub API
            const { Octokit } = require("@octokit/core");
            const { restEndpointMethods } = require("@octokit/plugin-rest-endpoint-methods");
            const MyOctokit = Octokit.plugin(restEndpointMethods);
            let octokit = new MyOctokit({ auth: githubToken });
            octokit.rest.projects.createColumn({
                project_id: args[1],
                name: columnName,
              })
                .then((result) => {
                    return message.reply("Your new column, " + columnName + " has been successfully created in project " + "#" + args[1] + "."
                    );
                })
                .catch((error) => {
                    console.error(error);
                    return message.reply(
                        "creating a column was unsuccessful. Please ensure you have set your GitHub token using -github and provided the correct project ID and a unique column name and then try again."
                    );
                });
        }

        // Get Project function
        async function getProject (projectID, args) {
            // GitHub Variables
            let githubToken = readToken();

            // Intialise GitHub API
            const { Octokit } = require("@octokit/core");
            const { restEndpointMethods } = require("@octokit/plugin-rest-endpoint-methods");
            const MyOctokit = Octokit.plugin(restEndpointMethods);
            let octokit = new MyOctokit({ auth: githubToken });

            octokit.rest.projects.get({
                project_id: projectID,
              })
                .then((result) => {
                    getColumns(projectID);
                })
                .catch((error) => {
                    console.error(error);
                    return message.reply(
                        "retrieving your project was unsuccessful. Please ensure you have set your GitHub token using -github and provided the correct project ID and then try again."
                    );
                });
        }

        // Get Columns Function
        async function getColumns (projectID, args) {
            // GitHub Variables
            let githubToken = readToken();

            // Intialise GitHub API
            const { Octokit } = require("@octokit/core");
            const { restEndpointMethods } = require("@octokit/plugin-rest-endpoint-methods");
            const MyOctokit = Octokit.plugin(restEndpointMethods);
            let octokit = new MyOctokit({ auth: githubToken });

            octokit.rest.projects.listColumns({
                project_id: projectID,
              })
                .then((result) => {
                    console.info(result.data);
                    let columns = [];
                    result.data.forEach((column) => {
                        columns.push(column.name);
                    });
                    columns = columns.join("\r\n • ");
                    return message.reply(
                        "your project #" + projectID + " has the following columns: " + "\r\n" +
                        " • " + columns
                    );
                })
                .catch((error) => {
                    console.error(error);
                    return message.reply(
                        "Retrieving the columns for your project was unsuccessful. Please ensure you have set your GitHub token using -github and provided the correct project ID and then try again."
                    );
                });
        }

        // Get Card Function
        async function getCard (cardID, args) {
            // GitHub Variables
            let githubToken = readToken();

            // Intialise GitHub API
            const { Octokit } = require("@octokit/core");
            const { restEndpointMethods } = require("@octokit/plugin-rest-endpoint-methods");
            const MyOctokit = Octokit.plugin(restEndpointMethods);
            let octokit = new MyOctokit({ auth: githubToken });

            octokit.rest.projects.getCard({
                card_id: cardID,
              })
                .then((result) => {
                    console.info(result.data);
                    return message.reply(
                        "Card #" + cardID + " has been successfully retrieved" 
                    );
                })
                .catch((error) => {
                    console.error(error);
                    return message.reply(
                        "Retrieving your project was unsuccessful. Please ensure you have set your GitHub token using -github and provided the correct project ID and then try again."
                    );
                });
        }


    },
};
