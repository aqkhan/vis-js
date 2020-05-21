
// JSON input object
let payload = [
    {
        "termKey": "pandemic",
        "ideaRelevance": 1.8041983505786185,
        "edges": []
    },
    {
        "termKey": "cough",
        "ideaRelevance": 1.5607112881742795,
        "edges": []
    },
    {
        "termKey": "risk",
        "ideaRelevance": 1.2109021992924294,
        "edges": []
    },
    {
        "termKey": "health workers",
        "ideaRelevance": 1.1929760934617457,
        "edges": [
            {
                "to": "risk"
            }
        ]
    },
    {
        "termKey": "concerns",
        "ideaRelevance": 0.9402777192395826,
        "edges": [
            {
                "to": "pandemic"
            },
            {
                "to": "risk"
            },
            {
                "to": "cough"
            }
        ]
    },
    {
        "termKey": "Advice",
        "ideaRelevance": 0.8787631040179532,
        "edges": [
            {
                "to": "concerns"
            }
        ]
    },
    {
        "termKey": "contact",
        "ideaRelevance": 0.7750656738915677,
        "edges": [
            {
                "to": "risk"
            }
        ]
    }
];

payload = [{"termKey": "framework", "ideaRelevance": 1.8041983505786185, "edges": [{"to": "many links"}]}, {"termKey": "arguments", "ideaRelevance": 1.5607112881742795, "edges": [{"to": "confirmation"}]}, {"termKey": "many links", "ideaRelevance": 1.2109021992924294, "edges": [{"to": "arguments"}]}, {"termKey": "confirmation", "ideaRelevance": 0.9402777192395826, "edges": []}];
//
payload = [{"termKey":"Entries","ideaRelevance":0.6904463551716689,"edges":[]},{"termKey":"table","ideaRelevance":0.7020680344773932,"edges":[]},{"termKey":"back","ideaRelevance":0.7550237343024994,"edges":[{"to":"pages"},{"to":"Entries"}]},{"termKey":"setup","ideaRelevance":0.929975053321239,"edges":[]},{"termKey":"index","ideaRelevance":1.4878790977010317,"edges":[{"to":"pages"},{"to":"table"}]},{"termKey":"monthly log","ideaRelevance":1.8878116594013625,"edges":[{"to":"pages"}]},{"termKey":"pages","ideaRelevance":2.454967586591016,"edges":[{"to":"setup"}]}];
payload = [{"termKey":"grease","ideaRelevance":1.2382296181306758,"edges":[]},{"termKey":"allergic reactions","ideaRelevance":1.2738586984706075,"edges":[{"to":"skin irritations"},{"to":"allergies"},{"to":"grease"}]},{"termKey":"allergies","ideaRelevance":1.3328124416540958,"edges":[]},{"termKey":"sulfates","ideaRelevance":1.351403153311993,"edges":[]},{"termKey":"sodium carbonate","ideaRelevance":1.6083038745810452,"edges":[{"to":"sulfates"}]},{"termKey":"chlorine bleach","ideaRelevance":1.7547831541663135,"edges":[{"to":"skin irritations"},{"to":"sulfates"}]},{"termKey":"skin irritations","ideaRelevance":1.8792809377324515,"edges":[]}];

payload = [{"termKey":"bout","ideaRelevance":1.340998506163855,"edges":[{"to":"fighter"},{"to":"knockouts"}]},{"termKey":"fighter","ideaRelevance":1.7262113906400336,"edges":[]},{"termKey":"knockouts","ideaRelevance":3.0728061512231197,"edges":[]}];

// new payload one
payload = [
    {"termKey":"digital marketing","ideaRelevance":1.340998506163855,
      "edges":[
          {"to":"traditional marketing"},
      ]
    },

    {"termKey":"traditional marketing","ideaRelevance":1.7262113906400336,
        "edges":[]
    },

    {"termKey":"messages","ideaRelevance":3.0728061512231197,
        "edges":[]

    },
    {"termKey":"digital channels","ideaRelevance":3.07280615122311922,
        "edges":[
            {"to":"traditional marketing"},
            {"to":"messages"},

        ]

    }

    ];

// new payload two

let payload1 = [
    {"termKey":"marketing professionals",
        "ideaRelevance":1.340998506163855,
        "edges":[
            {"to":"promotion"},
        ]
    },

    {"termKey":"sales","ideaRelevance":1.7262113906400336,
        "edges":[
            {"to":"internet"}
        ]
    },

    {"termKey":"internet","ideaRelevance":3.0728061512231197,
        "edges":[]

    },
    {"termKey":"promotion","ideaRelevance":3.07280615122311922,
        "edges":[
            {"to":"sales"}
        ]

    }

];


// new payload three

let payload2 = {
    style: {
        "bubbleColor": "transparent", // Add custom color to circle if no color is defined default #5BBFBA color will be selected
        "textColor": "#000", // Add text color if no textColor is added default #fff color will be selected.
        "textSize": 20, // Now you can increase/decrease the size of bubble by adding custom text size.
        "lineColor": "red", // You can add custom color to lines.
    },
    payload: [
        {
            "termKey":"strategy",
            "edges":[
                {
                    "to":"content marketers"
                },
            ]
        },
        {
            "termKey":"content marketers",
            "edges":[
                {"to":"content marketing"},
            ]
        },
        {"termKey":"content marketing",
            "edges":[
                {"to":"guide"},
            ]
        },
        {"termKey":"guide",
            "edges":[]
        }
    ]
};


// Fires when an interaction is registered on a node
function callback({ type, key }) {
    console.log(type, key);
}
// Fires when the map is ready
function ready() {
    console.log("ready");
}
// Fires when the map is redrawn
function readyAgain() {
    console.log("ready again");
}
// Redraws the map with new dataset
function reInitialize() {
    mapManager = mapManager.updateDataset(readyAgain, payload);
}
// Redraws the map with current dataset
function reDraw() {
    mapManager = mapManager.reDraw(readyAgain);
}
