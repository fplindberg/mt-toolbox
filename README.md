# MT-Toolbox

### Synopsis

This application strives to ease administration around preventive maintenance with ambition to expand with functions to automate and ease more repetitive internal processes

### Motivation

The administration of preventive maintenance and other internal tasks today can be repetitive and take much time from the engineer preforming the task. This time sure can be used much better elsewhere. Because this administration is repetitive, it must be possible for the computer to automate it.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisities

To install the application, the following programs needs to be installed on the computer:

- `node.js`
- `npm (node packet manager)`

### Installing

To install the application, npm is used. Run this command from project folder where package.json is located:

```
npm install
```

## Usage

To run the application, npm is used. Run this command from project folder:

```
npm start
```

The application will now start. A login window appears.

### Login

Log into the application with one of the following sample users:

- `Tolvanssons son:` Username: "", Password: ""
- `Tolvansson:` Username: "tolvansson", Password: "tolv"

After login, the main window appears. From the main window, you can navigate to the applications other windows. The options are:

- `Schedule` - Opens preventive maintenance schedule
- `Profile` - Opens user profile information
- `Arrival control` - Opens form for inventory arrival control
- `Preventive maintenance` - Opens preventive maintenace schedule with sites and inventories

## Built With

* [Node.js](https://nodejs.org/en/) - JavaScript runtime environment
* [npm](https://www.npmjs.com/) - JavaScript package manager
* [Electron](https://electronjs.org/) - Framework for creating native application with web technologies
* [Bootstrap](https://getbootstrap.com/) - Front-end component library
* [Material design icons](https://material.io/) - Icon library

## Authors

* **Filip Lindberg** - *Initial work* - [guldisfp](https://github.com/guldisfp)

## License

This project is licensed under the **MIT License** - see the [LICENSE.md](LICENSE.md) file for details.
