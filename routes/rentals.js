const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");
const { Rental, validateRental } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();

Fawn.init("mongodb://127.0.0.1:27017/vidly");

router.get("/", async (req, res) => {
    const rentals = await Rental.find().sort("-dateOut");
    res.send(rentals);
});

router.post("/", validate(validateRental),async (req, res) => {
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("Invalid Customer.");

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("Invalid Movie.");

    if (movie.numberInStock === 0)
        return res.status(400).send("Movie not in stocks.");

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate,
        },
    });
    try {
        new Fawn.Task()
            .save("rentals", rental)
            .update(
                "movies",
                { _id: movie._id },
                { $inc: { numberInStock: -1 } }
            )
            .run();

        res.send(rental);
    } catch (ex) {
        res.status(500).send("Something failed.");
    }
});

router.get("/:id", validateObjectId, async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental)
        return res
            .status(404)
            .send("The rental with the given Id was not found.");

    res.send(rental);
});

module.exports = router;
