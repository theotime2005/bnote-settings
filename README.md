# bnote-settings

## The project

B.note is a braille display designed by Eurobraille. You can find more information about the device on [the website](www.eurobraille.com).

The purpose of this web interface is to allow sighted people to configure the B.note settings directly, without having to go through the device's internal braille interface.

## Development

### Warning

This source code is free of modification. However, in order to avoid overloading the internet of similar sites, we ask you not to deploy it. However, any contribution is welcome.

### Software required

You must have [nodejs](https://nodejs.org/en) and an IDE.

### Acquisition of sources

You can clone this repository via the command line in the following way:

```shell
Git clone git@github.com:theotime2005/bnote-settings
```

### Installation of outbuildings

Once in the project folder, enter the following line

```shell
Npm install
```

### Launch the project in dev mode

Enter the following command to launch the project

```shell
Npm run dev
```

### Build the project

To make a build, enter the following command:

```shell
Npm run build
```

## Desktop Application

The B.note Settings application is also available as a desktop app using Electron, allowing you to use it without a web browser.

### Development with Electron

To run the application in development mode with Electron:

```shell
npm run electron:dev
```

This will start both the Vite development server and open the Electron app window.

### Building Desktop Applications

To build the desktop application for different platforms:

```shell
# Build for current platform
npm run electron:build

# Build for macOS only
npm run electron:build:mac

# Build for Windows only  
npm run electron:build:win

# Build for both macOS and Windows
npm run electron:build:all
```

The built applications will be available in the `dist_electron` directory.

### Downloading Pre-built Desktop Apps

Pre-built desktop applications for macOS and Windows are automatically generated and published with each release on the [GitHub Releases page](https://github.com/theotime2005/bnote-settings/releases).

### CSS

In the past, this project used tailwindcss. However, its use has been removed. A main style sheet is available, and you can enrich it from the components directly.

## Contributing
You can read the [Contribution guide](https://github.com/theotime2005/bnote-settings/blob/main/Contribution%20guide.md) file to learn how to contribute to the project.

## Discord Server
You can join the [Discord server](https://discord.gg/ThGqydYJ) to discuss the project. You can also ask for help or propose new features and receive notifications about the project.
