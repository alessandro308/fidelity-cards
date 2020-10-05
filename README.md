# Fidelity Cards
![screenshot](https://raw.githubusercontent.com/alessandro308/fidelity-cards/master/screenshot.png)
This is an application to manage fidelity cards of a small business. 
This system is able to manage different type of cards:
 - Business
 - Standard
 - Gift card

### Type of cards
The business, as the standard, is a cards type that is able to collect points whenever they are added and then return a discount value
when enough point are collected. The value are parameters that can be set in `config/config.js` file (see config file section below).
The gift card instead, is thought as a card that store a certain amount of point at the beginning and then is able to use that points later.

### Config File
The configuration files contains several values that can be used to customize the app. It can be created starting from the template,
in the `src/config` folder.
It contains an object, called `discounts` that store the minimum quantity of points that a card must have to be able to use a discount, and,
given that amount of point, how many € the customer receives. With the default configuration, every 200 points, a customer is able
to use 10€ discount if it is a business user, or, every 50 points the customer can use 5€ discount if it is a standard user.

```javascript
export const appConfig = {
    appName: 'Fidelity Cards',
    discounts: {
        business: {
            at: 200,
            value: 10,
        },
        standard: {
            at: 50,
            value: 5,
        }
    },
    minAmountAtEndOfTheYear: 200,
};
```

### How to translate the app
```bash
npx ttag init uk i18n/uk.po  # Generate the po file if not present, otherwise...
npx ttag update i18n/uk.po src/  # ... just update it
npx ttag po2json i18n/uk.po > src/i18n/uk.json  # Convert it to a JSON to be loaded by the app
```
Now that you have a JSON file, you can duplicated and translate it in your language (PR are well accepted :D).
Then in the App.js file, change imported line with your current locale:
```javascript
import translation from './i18n/it.json';
```

### Apache Configuration
This application uses React Router. It requires Apache rewrite rules correctly set to work. 
The following example assumes the application runs in cards subdirectory.
```
RewriteEngine On
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
RewriteRule ^ - [L]

# Fallback all other routes to index.html
RewriteRule ^ /cards/index.html [L]
```

# DEMO
You can try a demo [here](TBD) using account:
 - email: `test@test.com`
 - password: `test1234`

## TO DO LIST
- Avoid to remove Gift Cards when "Remove all Cards" or "Remove Cards under 200 pt" is clicked in the All Cards page
- Avoid to show Chart when Gift Card
