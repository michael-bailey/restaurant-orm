const { Restaurant, Menu, Item, sequelize } = require('./model/model')
const data = [
    {
        "name": "Bayroot",
        "image": "https://www.telegraph.co.uk/content/dam/Travel/Destinations/Europe/England/Brighton/brighton-restaurants-hotel-du-vin-bistro.jpg",
        "menus": [
            {
                "title": "Grill",
                "items": [
                    {
                        "name": "Houmous Shawarma Lamb",
                        "price": 6.50
                    },
                    {
                        "name": "Lamb Parcels",
                        "price": 5.70
                    },
                    {
                        "name": "Meat Balls (Kebbeh)",
                        "price": 6.50
                    },
                    {
                        "name": "Falafel (v)",
                        "price": 5.00
                    }
                ]
            },
            {
                "title": "Cold Mezza/Starters",
                "items": [
                    {
                        "name": "Houmous",
                        "price": 5.00
                    },
                    {
                        "name": "Baba Ganoush (Moutabal) (v)",
                        "price": 5.70
                    },
                    {
                        "name": "Stuffed Vine Leaves (Warak Enab)",
                        "price": 5.70
                    }
                ]
            }
        ]
    },
    {
        "name": "The Berkley",
        "image": "https://www.the-berkeley.co.uk/siteassets/restaurants--bars/the-garden-at-the-berkeley/the-garden-at-the-berkeley-teaser.jpg?w=620&h=560&scale=both&mode=crop",
        "menus": [
            {
                "title": "Afternoon tea",
                "items": [
                    {
                        "name": "Prêt-à-Portea",
                        "price": 60.00
                    },
                    {
                        "name": "High-Fashion Bakes and Biscuits",
                        "price": 70.00
                    }
                ]
            },
            {
                "title": "Breakfast Menu",
                "items": [
                    {
                        "name": "Berkeley Full English",
                        "price": 24.00
                    },
                    {
                        "name": "The Berkeley Breakfast",
                        "price": 38.00
                    },
                    {
                        "name": "Crushed Avocado on Toast",
                        "price": 13.00
                    },
                    {
                        "name": "Baked Eggs Shakshuka",
                        "price": 13.00
                    },
                    {
                        "name": "American Pancakes",
                        "price": 18.00
                    },
                    {
                        "name": "Coconut Chia Seed Pudding",
                        "price": 14.00
                    }
                ]
            }
        ]
    },
    {
        "name": "Balthazar",
        "image": "https://media.timeout.com/images/105034416/1372/772/image.jpg",
        "menus": [
            {
                "title": "Express Menu",
                "items": [
                    {
                        "name": "BASKET OF SOURDOUGH PARISIENNE BAGUETTE",
                        "price": 4.00
                    },
                    {
                        "name": "ROQUEFORT SALAD",
                        "price": 8.75
                    },
                    {
                        "name": "DUCK LIVER PARFAIT",
                        "price": 9.50
                    },
                    {
                        "name": "BUFFALO MOZZARELLA",
                        "price": 9.75
                    },
                    {
                        "name": "TUNA TARTARE",
                        "price": 11.50
                    },
                    {
                        "name": "BABY GEM SALAD ",
                        "price": 8.75
                    }
                ]
            },
            {
                "title": "Desserts",
                "items": [
                    {
                        "name": "Apple Tarte Fine",
                        "price": 9.00
                    },
                    {
                        "name": "Chocolate Profiteroles",
                        "price": 8.50
                    },
                    {
                        "name": "Mousse au Chocolat",
                        "price": 8.00
                    },
                    {
                        "name": "Crème Brûlée",
                        "price": 8.00
                    },
                    {
                        "name": "Raspberry Soufflé",
                        "price": 9.00
                    },
                    {
                        "name": "Sundae",
                        "price": 8.00
                    },
                    {
                        "name": "Le Colonel",
                        "price": 8.00
                    }
                ]
            },
            {
                "title": "A La Carte",
                "items": [
                    {
                        "name": "OYSTERS",
                        "price": 17.00
                    },
                    {
                        "name": "CHAMPAGNE & OYSTERS",
                        "price": 22.50
                    },
                    {
                        "name": "LOBSTER",
                        "price": 40.00
                    },
                    {
                        "name": "CAVIAR 30GM",
                        "price": 80.00
                    }
                ]
            }
        ]
    },
    {
        "name": "Berners Tavern",
        "image": "https://media.timeout.com/images/103495239/1372/772/image.jpg"
    },
    {
        "name": "Blanchette East",
        "image": "https://media.timeout.com/images/103717157/1372/772/image.jpg"
    },
    {
        "name": "Bob Bob Ricard",
        "image": "https://media.timeout.com/images/103717078/1372/772/image.jpg"
    },
    {
        "name": "Cafe Monico",
        "image": "https://media.timeout.com/images/103720815/1372/772/image.jpg"
    },
    {
        "name": "Impact crator",
        "image": "https://media.timeout.com/images/103813580/1372/772/image.jpg"
    }
]
sequelize.sync().then(async () => {
    const taskQueue = data.map(async (_restaurant) => {
            const restaurant = await Restaurant.create({name: _restaurant.name, image: _restaurant.image})
            const menus = await Promise.all(_restaurant.menus.map(async (_menu) => {
                const items = await Promise.all(_menu.items.map(({name, price}) => Item.create({name, price})))
                const menu = await Menu.create({title: _menu.title})
                return menu.setItems(items)
            }))
            return await restaurant.setMenus(menus)
        })
    await Promise.all(taskQueue).then(restaurants => {
        console.log(JSON.stringify(restaurants, null, 2))
    }).catch(console.error)
})