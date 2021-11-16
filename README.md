# Formula 1 Lap Charts

![Angular.js](https://img.shields.io/badge/angular.js-%23E23237.svg?style=for-the-badge&logo=angularjs&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

Interactive lap chart visualization of Formula 1 races.
The application is hosted [here](https://anuragbansal009.github.io/f1-lap-charts/#/).

This application uses [Angular JS](https://angularjs.org/) and gets the race results from the
[Ergast web service](https://ergast.com/mrd/) using this [Ergast client for NodeJS](https://github.com/davidor/ergast-client-nodejs).

The flags are used from [flag-icons](https://github.com/alexsobolenko/flag-icons/). The application is forked from [here](https://github.com/davidor/formula1-lap-charts).

### Download the races data

* You need to have [Node.js](http://nodejs.org/) installed.
* Go to the `races_updater` directory and run `npm install`.
* Run `node updater.js -h` and follow the instructions.

### Frontend

* You need to use an HTTP Server. For example, you can execute `python -m http.server 8888` in the `frontend` directory.
* The webapp will be available in `http://localhost:8888`. You can choose a different port.

If you are using a different host or port, change the `DATA_DIR` constant in `/frontend/app/configuration.js`.

### Screenshot

![Screenshot](/Screenshot.png)
