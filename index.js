const express = require('express')
const mongoose = require('mongoose')
//const ShortUrl = require("./models/shortUrl")

const shortId = require('shortid')
const ShortUrl = new mongoose.Schema({
    full:{
        type: String,
        required: true
    },
    short:{
        type : String,
        required: true,
        default: shortId.generate
    },
    clicks:{
        type: Number,
        required: true,
        default: 0
    }
})
//C:\Users\Ajay\OneDrive\Desktop\Zen Guvi\URLshortener\modals
const app = express()

mongoose.connect('mongodb://localhost/urlShortner',{
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false}))
app.get("/", async (req,res)=>{
    try {
        const ShortUrls = await ShortUrl.findOne()
        res.render('indeX', { shortUrls: shortUrls})
    } catch (error) {
        console.log(error)
    }
})

app.post('/shortUrls', async (req,res)=>{
    await ShortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.get('/:shortUrl', async (req,res) =>{
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })

    if(shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 3000, console.log("your server started"))