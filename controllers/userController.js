const User = require('../models/users');

exports.getAllUsers = (req,res) => {
    User.find({},(error, result )=>{
        console.log(result)
        console.log(result[0]._id.getTimestamp())
        if(!error) res.render('users/index', {
            user:result
        })
    })
}
exports.getUserDetail = (req, res) =>{
    console.log(req.params)
    console.log(req.params.id)
    User.findById(req.params.id, (error, result) =>{
        console.log(result)
        if(error) console.log(error)
        else res.render('users/details', {
            content:result
        });
    })
}
exports.createUser = (req,res) => {
    console.log(req.body)
    User.create({
        name:req.body.name,
        password:req.body.password,
        email:req.body.email,
        image:req.body.image,
    },(error, result )=>{
        if(error) console.log(error)
        else
            console.log("saved : " + result);
            res.redirect('/')
    })
}
exports.updateUser = (req,res) => {
    console.log(11111111)
    User.findByIdAndUpdate(
        req.params.id,
        {$set: {name:req.body.name}},
    ).then(()=>{
        res.redirect('/')
    }).catch((e)=>{
        console.log(e)
    })
}

exports.deleteUser = (req,res) => {
    console.log(222222)
    User.findByIdAndRemove(req.params.id).then(()=>{
        res.redirect('/')
    }).then(()=>{
        console.log('削除に成功しました')
    }).catch((e)=>{
        console.log(e)
    })
}
