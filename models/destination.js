const mongoose=require('mongoose');
const { DestinationSchema } = require('../schemas');
const Schema=mongoose.Schema;
const Review=require('./review')

const opts = { toJSON: { virtuals: true } };


const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});
const destinationSchema=new Schema({
    title:String,
    images:[ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },

    travelcost:Number,
    description:String,

    location:String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews:[
    {
        type:Schema.Types.ObjectId,
        ref:'Review'
    }
    ]

},opts);
destinationSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/destination/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0,60)}...</p>`
});

destinationSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports=mongoose.model('destination',destinationSchema);




