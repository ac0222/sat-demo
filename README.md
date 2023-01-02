# Separating Axis Theorem Demo

A javascript implementation of the Separating Axis Theorem to handle collisions in 2D. Based on information/pseudocode from these sites:
- [2D collision detection - Game Development | MDN](https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection)
- [Separating Axis Theorem (SAT) Explanation](http://www.sevenson.com.au/actionscript/sat/)
- [N Tutorial A - Collision Detection and Response](http://www.metanetsoftware.com/technique/tutorialA.html)
- [Collision Detection Using the Separating Axis Theorem](http://gamedevelopment.tutsplus.com/tutorials/collision-detection-using-the-separating-axis-theorem--gamedev-169)


## Local set up
### Prerequisites
- [node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/)
### Running the program
- After cloning the repo, cd into the root directory and run the following commands:
```
> npm install
> npm run build:dev
> npm run start:dev
```

You can create a copy of the `.env.example` file and remove the `.example` extension to set environment variables such as the port number. By default the app will run at http://localhost:8000