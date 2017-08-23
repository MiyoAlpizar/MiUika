import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// define your suffixes by yourself..
// here we use active, big, small, very-big..
const replaceSuffixPattern = /--(active|big|small|very-big)/g;
const icons = {
  "ios-person": [30, "#bbb"],
  "ios-person--big": [50, "#bbb"],

  "ios-person--active": [30, "#fff"],
  "ios-person--active--big": [50, "#fff"],
  "ios-person--active--very-big": [100, "#fff"],

  "ios-people": [30, "#bbb"],
  "ios-people--active": [30, "#fff"],

  "ios-keypad": [30, "#bbb"],
  "ios-keypad--active": [30, "#fff"],

  "ios-chatbubbles": [30, "#bbb"],
  "ios-chatbubbles--active": [30, "#fff"],

  "ios-home-outline": [30, "#bbb"],
  "ios-home": [30, "#fff"],

  "ios-chatbubbles": [30, "#bbb"],
  "ios-chatbubbles--active": [30, "#fff"],

  "ios-home-outline": [30, "#fff"],
  "ios-home": [30, "#fff"],

  "ios-home-outline": [30, "#fff"],
  "ios-home": [30, "#fff"],

  "ios-arrow-back":[30,"#fff"],
  
  "ios-paper":[30,"#fff"],
  "ios-paper-outline":[30,"#fff"],


  "ios-globe-outline": [30, "#fff"],
  "ios-globe": [30, "#fff"],

  "ios-box": [30, "#fff"],
  "ios-box-outline": [30, "#fff"],

  "ios-glasses-outline": [30, "#fff"],
  "ios-glasses": [30, "#fff"],

  "ios-cube-outline": [30, "#fff"],
  "ios-cube": [30, "#fff"],

  "ios-list-outline": [30, "#fff"],
  "ios-list": [30, "#fff"],

  "ios-search-outline": [30, "#bbb"],
  "ios-search": [30, "#fff"],

  "ios-time-outline": [30, "#bbb"],
  "ios-time": [30, "#fff"],

  "ios-chatbubbles": [30, "#bbb"],
  "ios-chatbubbles--active": [30, "#fff"],

  "bars": [24, "#fff", FontAwesome],

  // Use other Icon provider, see the logic at L39
  "facebook": [30, "#bbb", FontAwesome],
  "facebook--active": [30, "#fff", FontAwesome],
}

const defaultIconProvider = Ionicons;

let iconsMap = {};
let iconsLoaded = new Promise((resolve, reject) => {
  new Promise.all(
    Object.keys(icons).map(iconName => {
      const Provider = icons[iconName][2] || defaultIconProvider; // Ionicons
      return Provider.getImageSource(
        iconName.replace(replaceSuffixPattern, ''),
        icons[iconName][0],
        icons[iconName][1]
      )
    })
  ).then(sources => {
    Object.keys(icons)
      .forEach((iconName, idx) => iconsMap[iconName] = sources[idx])

    // Call resolve (and we are done)
    resolve(true);
  })
});

export {
  iconsMap,
  iconsLoaded
};