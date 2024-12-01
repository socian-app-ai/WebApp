// import simpleGit from "simple-git";
// import chalk from "chalk"; // Import chalk for styling
// const git = simpleGit();

// // Function to check if the branch is up-to-date with the remote
// async function checkGitStatus() {
//   try {
//     const status = await git.status();
//     const currentBranch = status.current;

//     // Check if the branch is behind the remote
//     const remoteStatus = await git.fetch();
//     const diff = await git.diff([`origin/${currentBranch}..${currentBranch}`]);

//     if (diff) {
//       // If the branch is behind, use chalk to color the output
//       console.log(
//         chalk.blue(
//           "Hi, this is Bilal. This is a reminder to fetch and pull the latest changes from your branch."
//         )
//       );
//       console.log(
//         chalk.yellow(
//           "Please make sure your local branch is up-to-date with the remote branch before you start working."
//         )
//       );
//       console.log(
//         chalk.green("Run the following commands to sync your branch:")
//       );
//       console.log(chalk.cyan("git fetch"));
//       console.log(chalk.cyan("git pull"));
//     } else {
//       console.log(
//         chalk.green(
//           "Your branch is up-to-date with the remote. You're good to go!"
//         )
//       );
//       console.log(chalk.bgGray("Always remember to pnpm install"));
//     }
//   } catch (error) {
//     console.error(chalk.red("Error checking Git status:"), error);
//   }
// }

// checkGitStatus();

import simpleGit from "simple-git";
import chalk from "chalk"; // Import chalk for styling
const git = simpleGit();
import moment from "moment";

async function checkGitStatus() {
  try {
    // Fetch the latest changes from the remote
    const remoteStatus = await git.fetch();
    const status = await git.status();

    // Check if there are any changes to pull
    if (status.behind > 0) {
      // If the local branch is behind, remind the user to pull
      const lastCommitDate = moment(status.lastCommit.date).format(
        "MMM DD, YYYY"
      );
      console.log(`
Hi this is Bilal,

This is a reminder to fetch and pull the latest changes from the remote branch before you start working.
Your branch is behind by ${status.behind} commits since the last commit on ${lastCommitDate}.

Please run:
  git fetch
  git pull

Thank you!`);
      process.exit(1); // Exit with error code, so server won't run
    } else {
      console.log("Your branch is up-to-date with the remote.");
    }
  } catch (error) {
    console.error("Error checking Git status:", error);
    process.exit(1); // Exit with error code if something goes wrong
  }
}

checkGitStatus();
