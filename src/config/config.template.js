export const firebaseConfig = {
    // Paste here firebase configuration
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
};

export const appConfig = {
    appName: 'Fidelity Cards',
    cardLink: 'https://parrucchieriestetiste.it/card',
    countryPrefix: '39',
    whatsappText: 'Ciao,+salva+la+tua+card+Velvet+nel+tuo+cellulare.+Clicca+qui:+',
    discounts: {
        business: {
            at: 200,
            value: 10,
        },
        standard: {
            at: 50,
            value: 5,
        },
        gift: {
            at: 1,
            value: 1,
        }
    },
    minAmountAtEndOfTheYear: 200,
    minPointsIn3MonthsToBeBusiness: 90,
};

// On firebase database set
// {
//     config: {
//         skebbyUsername,
//         skebbyPassword,
//         smsText,
//     }
// }
