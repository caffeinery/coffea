# Contributing code

The fundamental code standard we use
[StandardJS](http://standardjs.com/rules.html), the rules being
described in the aforementioned link. We highly recommend you stick to
this standard to ease the maintenance for us. We also have continuous
integration setup that will lint the changes for you.

1. Fork the repository.
2. Create a new branch, which very briefly summarizes the change you're going to make.

   For example:
   
   - Fixing a typo? ==> `typo`
   - Documentation addition/fix/etc such as adding the documentation
     for a method ==> `doc/method-<method name>`.
   - Fixing a bug? ==> `bug/duplicate-events`.
   - You could also just use `issue/<issue ID>` as the branch name to refer to a certain issue.

3. Commit your changes. Please use a meaningful commit message, a nice
   guide on this is available
   [here](http://chris.beams.io/posts/git-commit/).
   Alongside that, please use the aformentioned link as it also
   doubles as a style guide.
   If you're adding a new feature, or changing behavior, please
   document it using
   [this](https://github.com/caffeinery/coffea-docs) repository.

4. Submit a pull request outlining what changes you have made, what
   bugs it fixes (if any).
5. Wait for us to review the pull request, and hopefully it's
   accepted! :smile:

# Issues

Describe issues in the following format:

```
# What did you do?

<Description on what you did, including relevant code (please filter
out authentication information!)>

# What did you expect to happen?

<Description on what you wanted to happen instead of what actually happened>

# What actually happened?

<Description on what actually happened when you did what you did>
```
