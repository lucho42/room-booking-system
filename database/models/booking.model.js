const mongoose = require('mongoose')
const schema = mongoose.Schema

//@todo : define unique key with room/time
const bookingSchema = schema({
    room: { type: String, required: true },
    time: { type: Number, required: true },
    company: { type: String },
    employee: { type: schema.Types.ObjectId, ref: 'user', required: true },
})

bookingSchema.index(
    {
        room: 1,
        time: 1,
    },
    {
        unique: true,
    }
)

const Booking = mongoose.model('booking', bookingSchema)

module.exports = Booking
