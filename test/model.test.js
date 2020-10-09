import Restaurant from "../src/model/Restaurant";
import Table from "../src/model/Table";
import Menu from "../src/model/Menu";
import Item from "../src/model/Item";

describe("sequelize test", () => {
    test("creating a new restaurant", async () => {
    
        // sync the database
        await sequelize.sync({force: true})

        // creating restaurant
        let r1 = await Restaurant.create({name: "r1", location: "london"})

        // creating tables
        let t1 = await Table.create({number: 1, seats: 6})
        let t2 = await Table.create({number: 1, seats: 6})
        let t3 = await Table.create({number: 1, seats: 6})

        // creating menus
        let m1 = await Menu.create({title: "breakfast"})
        let m2 = await Menu.create({title: "sunday roast"})

        // creating breakfast items
        let mi1 = await Item.create({name: "full english", description: "a full english breakfast"})
        let mi2 = await Item.create({name: "cereal", description: "wheatabix"})

        // creating sunday roast items
        let mi3 = await Item.create({name: "roasted chicken", description: "a roasted chicken"})
        let mi4 = await Item.create({name: "roasted lamb", description: "a roasted lamb leg"})

        // adding menu items
        m1.addItem(mi1)
        m1.addItem(mi2)
        m2.addItem(mi3)
        m2.addItem(mi4)

        // ingredients
        let i1 = await Ingredient.create({name: "pasta", isAllergen: false})
        let i2 = await Ingredient.create({name: "chicken", isAllergen: false})
        let i3 = await Ingredient.create({name: "bacon", isAllergen: false})
        let i4 = await Ingredient.create({name: "egg", isAllergen: false})
        let i5 = await Ingredient.create({name: "potato", isAllergen: false})
        let i6 = await Ingredient.create({name: "beans", isAllergen: false})
        let i7 = await Ingredient.create({name: "wheat", isAllergen: false})
        let i8 = await Ingredient.create({name: "lamb", isAllergen: false})

        // adding ingredients
        mi1.addIngredient(i3)
        mi1.addIngredient(i4)
        mi1.addIngredient(i5)
        mi1.addIngredient(i6)

        mi2.addIngredient(i7)
        
        mi3.addIngredient(i2)
        mi4.addIngredient(i8)


        // adding tables
        r1.addTable(t1)
        r1.addTable(t2)
        r1.addTable(t3)

        // 

        let a = await r1.getTables()
        console.log(a[0]);

        // testing
      
        expect(r1 instanceof Restaurant).toBeTruthy()
        expect(r1.id).toBe(1)
        expect(t1 instanceof Table).toBeTruthy()
        expect(t2 instanceof Table).toBeTruthy()
        expect(t3 instanceof Table).toBeTruthy()
        expect(a[0].RestaurantId).toEqual(1)

    })

    test
})