var { graphqlHTTP } = require("express-graphql");
var { buildSchema, assertInputType } = require("graphql");
var express = require("express");

// Construct a schema, using GraphQL schema language
var restaurants = [
    {
        name: "WoodsHill ",
        description:
            "American cuisine, farm to table, with fresh produce every day",
        dishes: [
            {
                name: "Swordfish grill",
                price: 27,
            },
            {
                name: "Roasted Broccily ",
                price: 11,
            },
        ],
    },
    {
        name: "Fiorellas",
        description:
            "Italian-American home cooked food with fresh pasta and sauces",
        dishes: [
            {
                name: "Flatbread",
                price: 14,
            },
            {
                name: "Carbonara",
                price: 18,
            },
            {
                name: "Spaghetti",
                price: 19,
            },
        ],
    },
    {
        name: "Karma",
        description:
            "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
        dishes: [
            {
                name: "Dragon Roll",
                price: 12,
            },
            {
                name: "Pancake roll ",
                price: 11,
            },
            {
                name: "Cod cakes",
                price: 13,
            },
        ],
    },
];
var schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[dish]
}
type dish{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
  dishes: [dishInput]
}
input dishInput{
  name: String
  price: Int
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  getrestaurant(id: Int): restaurant
  setrestaurant(input: restaurantInput): restaurant

  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, description: String!): restaurant
}
`);
// The root provides a resolver function for each API endpoint

var root = {
    restaurant: (arg) => restaurants[arg.id],
    restaurants: () => restaurants,

    getrestaurant: (arg) => {
        if (!restaurants[arg.id]) {
            throw new Error("Restaurant not found");
        }
        return restaurants[arg.id];
    },
    setrestaurant: ({ input }) => {
        restaurants.push({
            name: input.name,
            description: input.description,
            dishes: input.dishes,
            dishname: input.dishname,
        });
        return input;
    },
    deleterestaurant: ({ id }) => {
        restaurants.splice(id, 1);
        return { ok: true };
    },
    editrestaurant: ({ id, ...restaurant }) => {
        if (!restaurants[id]) {
            throw new Error("restaurant doesn't exist");
        }
        restaurants[id] = {
            ...restaurants[id],
            ...restaurant,
        };
        return restaurants[id];
    },

    // mutation setrestaurant($ep: Episode!, $review: ReviewInput!) {
    //   createReview(episode: $ep, review: $review) {
    //     stars
    //     commentary
    //   }
    // }
};
var app = express();
app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    })
);
var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));
