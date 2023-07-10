# wvs - Web Visualization Studio

## Usage

1. Clone this repository and `cd` into it with:

```bash
$ git clone git@github.com:thykka/wvs.git
$ cd wvs
```

1. Using [nvm](https://github.com/nvm-sh/nvm) or your chosen Node version manager, install a supported Node.js version with:

```bash
$ nvm use
````

1. Install project dependencies with:

```bash
$ npm install
```

1. Start the development server with:

```bash
$ npm start
```

1. Open your browser with the url provided in the console, and start hacking!

## Tips

- Add `?mic` to the url to enable microphone input
- Add `?mp3=http://example.com/song.mp3` to choose a song to play
- use `src/index.js` as a starting point for your own visualization
- wvs uses a bundler called [Parcel](https://parceljs.org/)
