# Writing Consultation Planner

This is an online scheduling tool primarily developed for university writing centers that offer one-on-one consultations (conferences) between peer-tutors and students. It allows peer-tutors to set a schedule, select which kind of consultation to offer (e.g. writing, reading, ESL, research methods...) and whether to offer the consultation online or in person. Students can accordingly filter available appointments by kind, format and tutor.

## State of development

The current version of the app was developed to fit the needs of a specific German writing center. As such, most of the displayed text and some hard-coded features are unlikely to work in a more general context. One aim of making the source code public is to find collaborators who can contribute changes that parametrize the code base. Ideally, the app would be restructured and extended so that writing center administrators with little technical knowledge could use a GUI for setting up the app for their institution.

## Set up

### Requirements
To run this application, you will need:
- a server with a MySQL database and PHP >= 7.4.12
- composer for PHP libraries
- npm for React libraries

### Installation

1. Create the database by running the SQL commands in the `db` directory.
2. Set up the backend:
  - In the `server` directory, run `composer install` to install dependencies
  - Update the `server/config.php` file with your database information
3. Set up the frontend:
  - In the `client` directory, run `npm install` to install dependencies
  - Update the `client/src/config.json` file with your server information
  - In the `client/src/assets` directory, add the logos of your university and writing center and name them "university-logo.png" and "writing-center-logo.png" respectively
  - See `client/README.md` for instructions on testing and running the React app
