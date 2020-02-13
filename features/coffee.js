//
// Illustrates a muti-threaded conversation
//
// Q: "How about some coffee (yes / no / cancel)"
// A: no
// Q: "What would you like to drink instead..?"
// A: Coke
//
const { BotkitConversation } = require( 'botkit' );

module.exports = function (controller) {

    const convo = new BotkitConversation( 'coffee_chat', controller );

    convo.ask( {
        "text": "ow about some coffee? (yes / no / cancel)",
        "attachments": [
            {
                "contentType": "application/vnd.microsoft.card.adaptive",
                "content": {
                    "type": "AdaptiveCard",
                    "version": "1.0",
                    "body": [
                        {
                            "type": "TextBlock",
                            "text": "Your registration is almost complete",
                            "size": "Medium",
                            "weight": "Bolder"
                        },
                        {
                            "type": "TextBlock",
                            "text": "What type of food do you prefer?",
                            "wrap": true
                        },
                        {
                            "type": "ImageSet",
                            "imageSize": "medium",
                            "images": [
                                {
                                    "type": "Image",
                                    "url": "http://contososcubademo.azurewebsites.net/assets/steak.jpg",
                                    "size": "Medium"
                                },
                                {
                                    "type": "Image",
                                    "url": "http://contososcubademo.azurewebsites.net/assets/chicken.jpg",
                                    "size": "Medium"
                                },
                                {
                                    "type": "Image",
                                    "url": "http://contososcubademo.azurewebsites.net/assets/tofu.jpg",
                                    "size": "Medium"
                                }
                            ]
                        }
                    ],
                    "actions": [
                        {
                            "type": "Action.ShowCard",
                            "title": "Steak",
                            "card": {
                                "type": "AdaptiveCard",
                                "body": [
                                    {
                                        "type": "TextBlock",
                                        "text": "How would you like your steak prepared?",
                                        "size": "Medium",
                                        "wrap": true
                                    },
                                    {
                                        "type": "Input.ChoiceSet",
                                        "id": "SteakTemp",
                                        "style": "expanded",
                                        "choices": [
                                            {
                                                "title": "Rare",
                                                "value": "rare"
                                            },
                                            {
                                                "title": "Medium-Rare",
                                                "value": "medium-rare"
                                            },
                                            {
                                                "title": "Well-done",
                                                "value": "well-done"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "Input.Text",
                                        "id": "SteakOther",
                                        "isMultiline": true,
                                        "placeholder": "Any other preparation requests?"
                                    }
                                ],
                                "actions": [
                                    {
                                        "type": "Action.Submit",
                                        "title": "OK",
                                        "data": {
                                            "FoodChoice": "Steak"
                                        }
                                    }
                                ],
                                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
                            }
                        },
                        {
                            "type": "Action.ShowCard",
                            "title": "Chicken",
                            "card": {
                                "type": "AdaptiveCard",
                                "body": [
                                    {
                                        "type": "TextBlock",
                                        "text": "Do you have any allergies?",
                                        "size": "Medium",
                                        "wrap": true
                                    },
                                    {
                                        "type": "Input.ChoiceSet",
                                        "id": "ChickenAllergy",
                                        "style": "expanded",
                                        "isMultiSelect": true,
                                        "choices": [
                                            {
                                                "title": "I'm allergic to peanuts",
                                                "value": "peanut"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "Input.Text",
                                        "id": "ChickenOther",
                                        "isMultiline": true,
                                        "placeholder": "Any other preparation requests?"
                                    }
                                ],
                                "actions": [
                                    {
                                        "type": "Action.Submit",
                                        "title": "OK",
                                        "data": {
                                            "FoodChoice": "Chicken"
                                        }
                                    }
                                ],
                                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
                            }
                        },
                        {
                            "type": "Action.ShowCard",
                            "title": "Tofu",
                            "card": {
                                "type": "AdaptiveCard",
                                "body": [
                                    {
                                        "type": "TextBlock",
                                        "text": "Would you like it prepared vegan?",
                                        "size": "Medium",
                                        "wrap": true
                                    },
                                    {
                                        "type": "Input.Toggle",
                                        "id": "Vegetarian",
                                        "title": "Please prepare it vegan",
                                        "valueOn": "vegan",
                                        "valueOff": "notVegan",
                                        "wrap": false
                                    },
                                    {
                                        "type": "Input.Text",
                                        "id": "VegOther",
                                        "isMultiline": true,
                                        "placeholder": "Any other preparation requests?"
                                    }
                                ],
                                "actions": [
                                    {
                                        "type": "Action.Submit",
                                        "title": "OK",
                                        "data": {
                                            "FoodChoice": "Vegetarian"
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    }, [
        {
            pattern: 'yes|ya|yeah|sure|oui|si',
            handler: async ( response, convo ) => {

                await convo.gotoThread( 'confirm' );
            }
        },
        {
            pattern: 'no|neh|non|nein|na|birk',
            handler: async ( response, convo ) => {

                await convo.gotoThread( 'ask_drink' );
            }
        },
        {
            pattern: 'cancel|stop|exit',
            handler: async ( response, convo ) => {

                await convo.gotoThread( 'cancel' );
            }
        },
        {
            default: true,
            handler: async ( response, convo ) => {
                await convo.gotoThread( 'bad_response' );
            }
        }
    ])

    convo.addMessage( {
        text: 'Ah...I seem to be fresh out!',
        action: 'complete'
    }, 'confirm' );

    convo.addMessage( {
        text: 'Got it...cancelling',
        action: 'complete'
    }, 'cancel' );

    convo.addMessage( {
        text: 'Sorry, I did not understand!\nTip: try "yes", "no", or "cancel"',
        action: 'default'
    }, 'bad_response' );

    // Thread: ask for a drink
    convo.addQuestion( 'What would you like to drink instead..?', [], 'statedDrink', 'ask_drink' );
    convo.addMessage( 'Excellent!  I like {{ vars.statedDrink }} too', 'ask_drink' );

    controller.addDialog( convo );

    controller.hears( 'coffee', 'message,direct_message', async ( bot, message ) => {

        await bot.beginDialog( 'coffee_chat' );
    });

    controller.commandHelp.push( { command: 'coffee', text: 'Simple dialog example with threads' } );

}
