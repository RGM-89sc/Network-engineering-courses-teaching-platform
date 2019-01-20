const git = require('simple-git')();
const branch = require('git-branch');
const gulp = require('gulp');
const { prompt } = require('inquirer');

gulp.task('default', done => {
  prompt({
    type: 'input',
    name: 'commitMessage',
    message: 'commit message: ',
    validate: function (input) {
      // Declare function as asynchronous, and save the done callback
      const done = this.async();

      if (!input) {
        // Pass the return value in the done callback
        return done('You need to provide a commit message!');
      }
      // Pass the return value in the done callback
      done(null, true);
    }
  })
    .then(answer => {
      git.add(['-A'])
        .commit(answer.commitMessage)
        .push('origin', branch.sync());

      done();
    });
});
