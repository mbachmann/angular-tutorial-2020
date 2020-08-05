# Ase Angular Education 2020

[https://github.zhaw.ch/bacn/ase2-angular-education-2020](https://github.zhaw.ch/bacn/ase2-angular-education-2020)

Go to the the [wiki](https://github.zhaw.ch/bacn/ase2-angular-education-2020/wiki)

## Learning targets

* Knows the basics of the Angular framework
* Can use the built-in elements of Angular like directives, decorators, DI
* Can create own elements like components, services, routes, directives, pipes
* Can use the RxJs Library for Observables
* Can successfully solve the tasks of a case study
* Can create a frontend UI with communication to a REST/Websocket backend
* Can create tests like unit- and e2e-test
* Knows the tool chain (ng-cli, node, npm, IDE's)

Here is the [typescript](https://github.zhaw.ch/bacn/ase2-typescript-01) tutorial


# Step by step Tutorial for an Auction App with Angular

The result of this tutorial is a list and a detail view of an auction app. The data is loaded from a test-api-backend.

![auction-list-view.png](https://github.zhaw.ch/bacn/ase2-angular-education-2020/raw/master/assets/auction-list-view.png)

The detail view with _place bid_ and _buy now_.


![auction-detail-view-02.png](https://github.zhaw.ch/bacn/ase2-angular-education-2020/raw/master/assets/auction-detail-view-02.png)

## Content of the [Wiki](https://github.zhaw.ch/bacn/ase2-angular-education-2020/wiki)

The [wiki](https://github.zhaw.ch/bacn/ase2-angular-education-2020/wiki) of this repository contains the tasks and hints of the Angular introduction lectures. The tasks allow exercising the theorie described in the slide desk. The result of each step can be analyzed in the source code by using the branches `git checkout -b <branch>`. Each result of an individual task is available in this code repository.

* **Task#00:** Install the tooling like and create the project structure. Adjust some files for achieving a browser compatibility.

* **Task#01:** Create a _AuctionList_ component with ng(-cli) and use the new component in the _AppComponent_ view

* **Task#02:** Create a _MouseEventDisplay_ component with ng(-cli) and display the mouse coordinates

* **Task#03:** Add a `headerTitle: string` input to your _AuctionList_ Component.

* **Task#04:** Add a `titleClicked` event to the AuctionListComponent. An _EventBinding_ for Title `<h3>` shall be added.  The `titleClicked` Event shall be written to the _console_.

* **Task#05:** An auctions variable shall be initialized by an array of five auction-items. The array shall be written to the browser by using the structure syntax *ngFor.

* **Task#06:** Create an interface for a single auction in the shared folder. The auction interface consists of the depending interfaces based on the domain model from the requirement analysis. Create the file _auction-data.ts_ in the shared folder, which contains at least 3 objects of _auctions_. Initialize the _auctions_ field in the _AuctionListComponent_ with the _AUCTION_DATA_ constant.

* **Task#07:** Create a _AuctionDataService_ in the shared folder. Create a method `getAuctions()` that returns an array of Auctions Load the data from the _AuctionDataService_ through the DI into the class `AuctionListComponent`.

* **Task#08:** Define sccs as the Default style to your project. Install and configure Bootstrap Version 4.0. Install and configure Font Awesome.

* **Task#09:** . Create a AuctionListDetails component with ng(-cli) . Use the new component in the AuctionListComponent view.

* **Task#10:** Create the `getObservableAuctions()` method in the _AuctionDataService_ class. Subscribe to it in the _AuctionList_ component by adapting the `constructor()` method.

* **Task#11:** Refactor components: they should load data in ngOnInit()-method. Unsubscribe in the ngOnDestroy()-method.

* **Task#12** Inject Http in _AuctionDataService_ and load data from local API in _AuctionData_ service via `http.get(URL)`. The data is served from a _test-auction-api_ which can be installed by npm.

* **Task#13** Add the file app.routing.ts in folder ./src/app

* **Task#14** Add a route _/auctions_ for the _AuctionListComponent_.

* **Task#15** Add the routerOutlet to the template of the AppComponent and define a Default route to /auctions

* **Task#16** Create a new component _AuctionDetail_ with _angular-cli_ and display all necessary data of a specific _auction_ in the view. Extend _AuctionList_ with _routerLink (and id)_ and extend the routes.

* **Task#17** Read the _ActiveRoute_ params and display it in the console log.

* **Task#18** Load one auction item from the backend and display some fields. Expand the _AuctionDataService_ with the CRUD methods.

* **Task#19** Add view functionality to the auction detail view. Create a _HelperService_ class for the date and time computations.

* **Task#20** Add a layout with a menu and a home page.

* **Task#21** Refactor the project with an _auction module_ and a _module specific router_.

* **Task#22** Introduce an intelligent _mock server_.

* **Task#23** Introduce a _jwt_ signing, decoding and verifying service for the mock server.

* **Task#24** Create a _user service_.

* **Task#25** Create an _authentication service_.

## Project information

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.6.

### Exercises

The exercises are available in the wiki: [https://github.engineering.zhaw.ch/bacn/ase2-angular-education-2020/wiki](https://github.engineering.zhaw.ch/bacn/ase2-angular-education-2020/wiki)

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
