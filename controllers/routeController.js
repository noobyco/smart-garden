module.exports = {
    root : 
        (req, res) => {
            res.render('index')
    },

    about : (req, res) => {
        // res.send("This is about page")
        res.render('about')
    },

    rootPost : (req, res) => {
        const msg = req.query.mail;

        console.log(msg)
        // console.log(offMsg)
        // res.redirect("/")
        res.send(msg)



    }

       
}
