# CampusLabs Engage Roster Downloader

A simple utility to download an Engage roster to a csv. For some reason this wasn't already a thing.

## Installation
Download the git repo.

```(js)
npm install
```

## Usage

1. You will need to edit lines `6`, and  `7` to properly point to the organization you want to parse.

2. Edit line `8` to be the total number of pages. This can be found by taking the `(# of people) % 15`.

3. Edit lines `15` - `18` with the appropriate cookie values. These can be found by first logging into Engage, and then viewing the cookies in your browser (EditThisCookie browser extension in Chrome is quite helpful for this step).

4. `node main.js` and wait for it to execute.

## Authors
Luke Henke (@luop90).

## License
MIT.
