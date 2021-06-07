const Tweet = require('../models/tweets')
const User = require('../models/users')

exports.createTweets = async (req,res) => {
    // const session = await Tweet.startSession()
    // console.log(session)
    // await session.startTransaction()
    console.log(req.body)
    Tweet.create({ user:req.user, content:req.body.content },(error, result )=>{
        if(error) console.log(error)
        else
            console.log("saved : " + result);
        res.redirect('/tweets/')
    })

    // if (!error) {
    //    await session.commitTransaction()
    // } else {
    //     await session.abortTransaction()
    // }
    //
    // session.endSession()
}

exports.getAllTweets = (req,res) => {
    Tweet.find({}).populate('user').exec((error, result )=>{
        console.log(result)
        // console.log(result[0]._id.getTimestamp())
        if ( result.length === 0 ){
            console.log("!result")
            res.render('tweets/index', {
                tweets:result,
                user:req.user
            })
        }
        if(!error)
            // User.findById(result.user)
            console.log("!error")
        res.render('tweets/index', {
            tweets:result,
            user:req.user
        })
    })
}

exports.test = (req,res) => {
    console.log('req.user')
    console.log(req.user)
    res.render('tweets/index', {
        user:req.user
    })
}