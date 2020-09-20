# Fidelity Cards


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
