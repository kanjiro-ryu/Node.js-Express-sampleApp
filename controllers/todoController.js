var dbUtils = require('../lib/dbUtils')
// クエリ作成部品をインポート
var todoQueries = require('../lib/todoQueries');
var dateUtils = require('../lib/dateUtils');
var Todo = require('../models/todo');


var getTodos = function(db,condition) {
    return new Promise(function(resolve, reject) {
        db.collection('todos').find(condition).toArray(function(error, docs) {
            if (error) reject(error);
            else resolve(docs);
        });
    });
}

exports.index = function(req, res, next) {
    Todo.find().queryNotCompleted().exec()
        .then(function(todos) {
            res.render('todo/index', {
                todos: todos,
                date2Str: dateUtils.date2Str
            });
        })
        .catch(function(err) {
            console.log(err);
            next(err);
        });
};

exports.today = function(req, res) {
    Todo.find().queryToday.exec()
        .then(function(todos) {
            res.render('todo/index', {
                todos: todos,
                date2Str: dateUtils.date2Str
            });
        })
        .catch(function(err) {
            console.log(err);
            next(err);
        });
};

exports.completed = function(req, res) {
    Todo.find().queryCompleted().exec()
        .then(function(todos) {
            res.render('todo/index', {
                todos: todos,
                date2Str: dateUtils.date2Str
            });
        })
        .catch(function(err) {
            console.log(err);
            next(err);
        });
};

exports.createGet = function(req, res) {
    res.render('todo/create');
};

exports.createPost = function(req, res) {
    var { title, description, status, estimatedDate } = req.body;
    Todo.create({
        title,
        description,
        status,
        estimatedDate
    })
        .then(function(result) {
            res.redirect('/home');
        })
        .catch(function(err) {
            console.log(err);
            next(err);
        });
};

exports.delete = function(req, res) {
    var { id } = req.params;
    Todo.findOne({ _id: id })
        .then(function(result) {
            if (!result) throw new Error('削除対象が見つかりません');
            return result.remove();
        })
        .then(function(result) {
            res.redirect('/home');
        })
};

// 更新フォームのコントローラー
exports.updateGet = function(req, res, next) {
    console.log(123)
    res.render('todo/update', { todo: {} });
    var { id } = req.params;
    Todo.findOne({ _id: id })
        .then(function(result) {
            if (!result) {
                throw new Error('削除対象が見つかりません');
            }
            res.render('todo/update', { todo: result });
        })
        .catch(function(err) {
            console.log(err);
            next(err);
        });
}

// 更新処理のコントローラー
exports.updatePatch = function(req, res, next) {
    console.log(0)
    var dbClient;
    var updateOne = function (db, id, data) {
        return new Promise(function (resolve, reject) {
            db.collection('todos')
                // コレクションのupdateOneを使う
                .updateOne(
                    {_id: dbUtils.createObjectID(id)},
                    {$set: data},
                    function (error, docs) {
                        if (error) reject(error);
                        else resolve(docs);
                    }
                );
        });
    }
    dbUtils.connectionToDB()
        .then(function ({client, db}) {
            dbClient = client;
            var {id} = req.params;
            var {title, description, status, estimatedDate} = req.body;
            return updateOne(db, id, {
                title,
                description,
                status,
                estimatedDate: new Date(estimatedDate)
            });
        })
        .then(function (result) {
            res.redirect('/todo');
        })
        .catch(function (err) {
            console.log(err);
            next(err);
        })
        .then(function () {
            if (dbClient) dbClient.close();
        });
}