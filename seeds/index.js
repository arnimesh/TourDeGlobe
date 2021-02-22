const mongoose=require('mongoose');
const destination=require('../models/destination');
const cities=require('./cities');
const {places,descriptors}=require('./seedhelpers');

if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
const dbUrl=process.env.dbUrl||'mongodb://localhost:27017/tour49';

// 'mongodb://localhost:27017/tour49'
mongoose.connect(dbUrl, { useNewUrlParser: true,useCreateIndex: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO DATABASE CONNECTED!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })
 


    const sample = array => array[Math.floor(Math.random() * array.length)];
    const travelcost=Math.floor(Math.random() * 50000)+100;
    const seedb=async()=>{
        await destination.deleteMany({});
         for(let i=0;i<50;i++)
         {
        const randomnum=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random() * 50000)+100;

            const place= new destination({
                author:'60215ad3495d113f3829e261',
                 location:`${cities[randomnum].city},${cities[randomnum].state}`,
                 title: `${sample(descriptors)} ${sample(places)}`,
                 description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum',
                 travelcost:price,
                 geometry: {
                  type: "Point",
                  coordinates: [
                    cities[randomnum].longitude,
                    cities[randomnum].latitude,]
              },
                 images: [
                    {
                      
                      url: 'https://res.cloudinary.com/ducqvbmtm/image/upload/v1612987195/TourDeGlobe/s5ihpo28jucvl3twiqip.jpg',
                      filename: 'TourDeGlobe/s5ihpo28jucvl3twiqip'
                    },
                    {
                      
                      url: 'https://res.cloudinary.com/ducqvbmtm/image/upload/v1612987195/TourDeGlobe/bvruejlbcj2krijodoiw.jpg',
                      filename: 'TourDeGlobe/bvruejlbcj2krijodoiw'
                    }
                  ]

             })
             await place.save(); 
            }
    }

    seedb().then(()=>{
        mongoose.connection.close();
    });