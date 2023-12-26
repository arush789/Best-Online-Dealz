import { createServer, Model } from "miragejs";

createServer({
    models: {
        offers: Model,
    },

    seeds(server) {
        server.create("offer", {
            id: 1,
            title: "Boy's Kids Cotton Sweatshirt and Jogger Set",
            imageUrl: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/51uabYkAyxL._SY500_.jpg",
            ogPrice: 799,
            offerPrice: 499,
            category: "Fashion and Apparel"
        })
        server.create("offer", {
            id: 2,
            title: "Cosmic Byte ARES Wired Controller for PC (White)",
            imageUrl: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/51gHWwp0c3L._SL1200_.jpg",
            ogPrice: 2699,
            offerPrice: 1349,
            category: "Electronics"
        })
        server.create("offer", {
            id: 3,
            title: "Apple iPhone 13 (128GB) - Pink",
            imageUrl: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/61l9ppRIiqL._SL1500_.jpg",
            ogPrice: 69900,
            offerPrice: 53499,
            category: "Electronics"
        })
        server.create("offer", {
            id: 4,
            title: "BSB HOME Premium Double Bedsheet with 2 Pillow Covers",
            imageUrl: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/61pmlUPZkIL._SX425_.jpg",
            ogPrice: 999,
            offerPrice: 249,
            category: "Home and Furniture"
        })
        server.create("offer", {
            id: 5,
            title: "Swiss Beauty Liquid Light Weight Concealer With Full Coverage",
            imageUrl: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/51yRsJblpFL._SL1500_.jpg",
            ogPrice: 229,
            offerPrice: 196,
            category: "Beauty and Personel care"
        })
        server.create("offer", {
            id: 6,
            title: "MuscleBlaze Omega 3 Fish Oil, 90 Capsules",
            imageUrl: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/61yGKFiWrDL._SL1500_.jpg",
            ogPrice: 949,
            offerPrice: 599,
            category: "Health and fitness"
        })
        server.create("offer", {
            id: 7,
            title: "AUGEN Goku B Action Figure Limited Edition",
            imageUrl: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/51y0qRBdLQL._SL1095_.jpg",
            ogPrice: 4099,
            offerPrice: 1624,
            category: "Toys and baby products"
        })
        server.create("offer", {
            id: 8,
            title: "Himalaya Baby Basket Gift Pack (Violet)",
            imageUrl: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/61FQYJQJVRL._SL1024_.jpg",
            ogPrice: 1150,
            offerPrice: 832,
            category: "Toys and baby products"
        })
        server.create("offer", {
            id: 9,
            title: "Chainsaw Man Complete Box Set: Vol.1 to 11",
            imageUrl: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/61WLOsyWxyL._SL1280_.jpg",
            ogPrice: 2100,
            offerPrice: 839,
            category: "Books and Stationery"
        })
        server.create("offer", {
            id: 10,
            title: "Reynolds TRIMAX BLUE - 5 COUNT",
            imageUrl: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/71em3gQjeaL._SL1500_.jpg",
            ogPrice: 325,
            offerPrice: 210,
            category: "Books and Stationery"
        })
        server.create("offer", {
            id: 11,
            title: "JCBL ACCESSORIES Hydraulic Bottle Jack with Load Limiting Device",
            imageUrl: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/51bOeS8PzNL._SL1500_.jpg",
            ogPrice: 3999,
            offerPrice: 2999,
            category: "Automotive"
        })
    },

    routes() {
        this.namespace = "api"
        this.logging = false

        this.get("/offers", (schema, request) => {
            return schema.offers.all()
        })

        this.get("/offers/:id", (schema, request) => {
            const id = request.params.id
            return schema.offers.find(id)
        })

        
    }
})