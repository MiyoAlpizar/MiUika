import * as firebase from 'firebase'

class Firebase {
    static init() {
        if (firebase.apps.length === 0) {
            firebase.initializeApp({
                apiKey: "AIzaSyCk8GwGFp1Sy9zjX5KhQpVaFjDtYSqYU0c",
                authDomain: "uika-1328.firebaseapp.com",
                databaseURL: "https://uika-1328.firebaseio.com",
                storageBucket: "uika-1328.appspot.com"
            });
        }
    }

    static JoinPaths(id, paths, callback) {
        var returnCount = 0;
        var expectedCount = paths.length;
        var mergedObject = {};
        var ref = firebase.database().ref();
        paths.forEach(function (p) {
            ref.child(p + '/' + id).once('value',
                // success
                function (snap) {
                    // add it to the merged data
                    extend(mergedObject, snap.val());

                    // when all paths have resolved, we invoke
                    // the callback (jQuery.when would be handy here)
                    if (++returnCount === expectedCount) {
                        callback(null, mergedObject);
                    }
                },
                // error
                function (error) {
                    returnCount = expectedCount + 1; // abort counters
                    callback(error, null);
                }
            );
        });
    }
}

function extend(base) {
    var parts = Array.prototype.slice.call(arguments, 1);
    parts.forEach(function (p) {
        if (p && typeof (p) === 'object') {
            for (var k in p) {
                if (p.hasOwnProperty(k)) {
                    base[k] = p[k];
                }
            }
        }
    });
    return base;
}

module.exports = Firebase