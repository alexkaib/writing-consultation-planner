# Writing Consultation Planner
This is an online scheduling tool primarily developed for university writing centers that offer one-on-one consultations (conferences) between peer-tutors and students. It allows peer-tutors to set a schedule, select which kind of consultation to offer (e.g. writing, reading, ESL, research methods...) and whether to offer the consultation online or in person. Students can accordingly filter available appointments by kind, format and tutor. Writing center administrators can manage tutors, view statistics and change the kinds of consultation are offered. During setup, more options can be adjusted through configuration files (see [Setup](#setup)).

## State of development
The current version of the app can be customized to a large degree during setup. This includes choosing the elements that appear in the registration and protocol forms, as well as options to enable file type and e-mail address validation, sending calendar invites and customizing displayed text for different languages. The code includes default configurations that can be fine-tuned to the specific needs of an institution, though at the moment this is a bit tedious and requires some technical knowledge. Future iterations of the app might streamline this process further.

## Setup
### Requirements
To run this application, you will need:
- a server with a MySQL database and PHP >= 7.4.12
- composer for PHP libraries
- npm for React libraries

### Installation
1. Create the database by running the SQL commands in the `db` directory.
2. Set up the backend:
  - In the `server` directory, run `composer install` to install dependencies
  - Adjust various settings in the `server/config.php` file and add your database and e-mail (SMTP) information
3. Set up the frontend:
  - In the `client` directory, run `npm install` to install dependencies
  - Update the `client/src/config.json` file:
    - add your server information, e-mail address and URL to your privacy statement that students need to accept before registering
    - specify the audiences (e.g. students, PhD students, alumni) that the app is geared towards. This will later allow administrators to choose which group can book which consultation type. You can add any string, as long as there is an equivalent in the `client/src/lang/languageStrings.json` file. If you don't want to use this feature, set the `audience` property to `["all_audiences"]`.
  - (optional) Configure the registration and protocol forms (see [Form configuration](#form-configuration))
  - (optional) Configure displayed text and translations in the `client/src/lang/languageStrings.json` file
  - In the `client/src/assets` directory, add the logos of your university and writing center and name them "university-logo.png" and "writing-center-logo.png" respectively
  - See `client/README.md` for instructions on testing and running the React app

## Form configuration
The app contains two forms that can be configured during installation. The registration form is what students need to fill out before they confirm their appointment and can be used to collect information for the consultation and/or statistics. The protocol form is what tutors use to document and reflect on their consultations. Both of them can be adjusted by adding or deleting elements in the `client/src/config.json` and `client/src/protocol_config.json` files respectively, though both also include necessary elements for the app to function.

### Necessary elements (don't change these!)
The following form fields - which are already present in the default setup - need to be included for the app to work:
- Registration form:
  - first_name
  - last_name
  - email
- Protocol form:
  - RSAnwesend

The label of these elements can be changed, but the database name is hard-coded and should not be changed.

### Adding and changing elements
All form elements that are not necessary can be adjusted, as long as corresponding changes are made to the database. When adding elements to the registration form, you will need to add columns to the table `ratsuchende`; when adding elements to the protocol form, you will need to add columns to the table `protocols`. You can also add static elements to the form, namely headings and paragraphs, without changing the database.

To add a form element, you need to specify the `id`, `label` and `type` properties, and in some cases `db_name`, `options` and `max_length`. The possible `type`s include:
- `heading` and `description` for displaying text. These are the only form elements that do not require the `db_name` attribute.
- `short_text`, `medium_text` and `long_text` for various sizes of input fields. You can set a maximum of accepted characters with `max_length`, though this is only checked client-side.
- `select` and `checkboxes` for single or multiple choice. These require the `options` property, which is a list of objects. Each option needs to have labels in both languages and a value under which it is saved in the database (check the default config files for examples).
- the `files` type can only be used in the registration form. It adds an input field for uploading documents, which are sent to the tutor's email address and then deleted from the server.

## First usage
After the setup, visit the page where you put the contents of the `build` folder after compiling the React app. Log in with the default user profile, which is admin@localhost.com and the password `password`. Under the menu option "Berater:innen" / "User management", change your password and e-mail address. Add users and let them know their login information. Use the menu option "Beratungstypen" / "Consultation types" to configure the kinds of consultations offered.
