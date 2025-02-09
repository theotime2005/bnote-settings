# Contribution guide

This document describes the method to contributing to this project. The code is open source, so you can suggest modifications.

## Rules to contribute

There are some rules to contribute to this project:

- Your offer can be accepted or rejected,
- You must respect the conventional commit with git,
- You must create your tests with your code.

# Contribute
To start, create a fork of the repository. If you want to fix an issue, you must create a branch with the issue number.
Afterwards, you can develop your feature or resolve the issue. Follow this next steps after development.

## Create a pull request
To suggest your modification to the repository owner, you must open a pull request. In the title, precize the type of pull request. The scopes are:
- [BUGFIX] to resolve an issue or a lag,
- [FEATURE] to create a new feature,
- [DOC] When you want writing docs,
- [BUMP] When you update a specific dependency,
- [TECH] To correct a fonctionnality (workflow, method call or other).
In the description, you must complete the problem and solution sections. An optionnal note exists if you want to add any information.
If you prefer, you can write your pull request, but you must explain exactly your modifications and our consequences. You can use the generate comment sumary with Copilot if you know how use this.

## Rule to accept the pull request
Your pull request can be accepted only if:
- You have created some tests to check your code,
- The linting is respected.
After opening pull request, some tests will be executed to check the linting.

# Translation
To add any new content like sentences, you must fill the translation files. Once done for one language, you can update the other languages using the script in the "locales" file, by indicating the source and target languages. For instance:
```shell
cd locale
node ../src/scripts/update_translation.js <base_language> <target_language1> <target_language2> ...
```
New translations will be translated and  marked with a "*".
NOTE: tests include a translation checking, based on french language.
