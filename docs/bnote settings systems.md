<!-- TOC -->
* [How B.note parameters work](#how-bnote-parameters-work)
  * [Storage in the braille display](#storage-in-the-braille-display)
    * [Default values](#default-values)
  * [On the site](#on-the-site)
    * [Add a parameter](#add-a-parameter)
    * [Add a category](#add-a-category)
<!-- TOC -->

# How B.note parameters work

This document describes how the different parameters of the B.note work and how to store them.

## Storage in the braille display

In the B.Note, the parameters are stored in the "settings.txt" file located in the "/home/pi/.bnote" folder. They are
organized as follows:

```json
{
  "category1": {
    "parameter1": "string",
    "parameter2": "boolean"
  },
  "category2": {
    "parameter3": "int"
  }
}
```

### Default values

Default values are assigned to the parameters and allowed values as well. You can find all the
settings [here](https://github.com/devel-erb/bnote/blob/main/bnote/tools/settings.py).

## On the site

On this site, the parameters are stored in [this file](../src/settings.json). They use a similar format but with the
particularity that each parameter is an object containing the following elements:

- id(required): Parameter identifier (for translation),
- type(required):
    - menu: A menu with several possibilities that will be defined in a list,
    - checkbox: A simple checkbox,
    - text: A string,
    - number: A number.
- default(required): The default value of the parameter that is retrieved in [the B.note project](https://github.com/devel-erb/bnote),
- min(optional): The minimum value (only for numbers),
- max(optional): The maximum value (only for numbers),
- isTranslate(optional): Tells the component if it should use translations when it comes to a menu for example and items should not be translated.

### Add a parameter

You can add a parameter in the [settings file](../src/settings.json) according to the convention above. ATTENTION, the id
must simply be an identifier, it will be used to identify this parameter in the translation files.
Once the parameter is added, go to [the translation folder](../locales) and, for the file of the language of your
choice, go to the settings.id section. There, simply add the parameter identifier as a key and its name as a value.

```json
{
  "settings": {
    "id": {
      "braille_type": "Braille type"
    }
  }
}
```

If new values are present, add them in the settings.values section.
The setting will be added automatically on the management page.

### Add a category

If you want to add a category of settings with new settings, do the following:

- Edit the settings file,
- Edit the translation files by including in the settings.id section the name of the category:

```json
{
  "settings": {
    "id": {
      "system": "User interface",
      "braille_type": "Type of braille",
      "Auto_sync_date": "Automatic date synchronization",
      "Spaces_in_label": "Spaces in labels"
    }
  }
}
```

Your new category will be added automatically on the management page.

### Add a setting with the script
You can add a setting with the script by using the following command:

```bash
npm run add-new-setting -- --file <path-to-file> --section <the category> --key <setting key also use for id> --type <setting type> -- values <use for menu> --default <the default value> --min <the min value> --max <the max value>
```
