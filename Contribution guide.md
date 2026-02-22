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
- fix: to resolve an issue or a lag,
- feat: to create a new feature,
- docs: When you want writing docs,
- bump: When you update a specific dependency,
- tech: To correct a functionality (workflow, method call or other).
In the description, you must complete the problem and solution sections. An optionnal note exists if you want to add any information.
If you prefer, you can write your pull request, but you must explain exactly your modifications and our consequences. You can use the generate comment sumary with Copilot if you know how use this.

## Rule to accept the pull request
Your pull request can be accepted only if:
- You have created some tests to check your code,
- The linting is respected.
After opening pull request, some tests will be executed to check the linting,
- When the pull request will be merged, all commits will be squashed in one commit.

# Translation
To add any new content like sentences, you must fill the translation files. Once done for one language, you can update the other languages using the script in the "locales" file, by indicating the source and target languages. For instance:
```shell
npm run translate --source <the_source_file_path> --targets <List_of_file_to_translate
```
Important: Files must named with language, en, fr, es.
New translations will be translated and  marked with a "*".
NOTE: tests include a translation checking, based on french language.

# Feature toggles
Your feature can be toggled with the feature toggles. To create a new toggle, you must add it in the "sample.env" file. You must also complete the config file and api route. Here is an example of toggle:
1. the sample.env
```env
# SHOW_CONTACT_FORM: Show the report contact form on the website (true/false)
# Vercel name: show-contact-form
# Type: boolean
# Default: false
FLAG_SHOW_CONTACT_FORM=false
```
2. The [configuration file](server/config.js), complete the "flags" object with the new toggle:
```js
flags: {
  "show-contact-form": getToFlag(toBoolean(process.env.FLAG_SHOW_CONTACT_FORM)),
},
```
3. The [api route](server/api/flags.js), add the new toggle in the return object with the function to get flag type:
```js
return {
    showContactForm: await _getFlagType("show-contact-form", false),
  };
```
The flag is available in the frontend with the "useFlags" hook. You can use it like this:
```js
const flags = useFlags();
console.log(flags.getFlag("show-contact-form"));
```
