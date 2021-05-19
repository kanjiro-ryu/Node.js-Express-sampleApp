var dbUtils = require('../lib/dbUtils')
// クエリ作成部品をインポート
var todoQueries = require('../lib/todoQueries');
var dateUtils = require('../lib/dateUtils');

var getTodos = function(db,condition) {
    return new Promise(function(resolve, reject) {
        db.collection('todos').find(condition).toArray(function(error, docs) {
            if (error) reject(error);
            else resolve(docs);
        });
    });
}

exports.index = function(req, res) {
    var dbClient;
    dbUtils.connectionToDB()
        .then(function({ client, db }) {
            dbClient = client;
            return getTodos(db, todoQueries.notCompleted());
        })
        .then(function(result) {
            res.render('todo/index', { todos: result });
        })
        .catch(function(err) {
            console.log(err);
            next(err);
        })
        .then(function() {
            if (dbClient) dbClient.close();
        });
};

exports.today = function(req, res) {
    var dbClient;
    dbUtils.connectionToDB()
        .then(function({ client, db }) {
            dbClient = client;
            return getTodos(db, todoQueries.today());
        })
        .then(function(result) {
            res.render('todo/index', { todos: result });
        })
        .catch(function(err) {
            console.log(err);
            next(err);
        })
        .then(function() {
            if (dbClient) dbClient.close();
        });
};

exports.completed = function(req, res) {
    var dbClient;
    dbUtils.connectionToDB()
        .then(function({ client, db }) {
            dbClient = client;
            return getTodos(db, todoQueries.completed());
        })
        .then(function(result) {
            res.render('todo/index', { todos: result });
        })
        .catch(function(err) {
            console.log(err);
            next(err);
        })
        .then(function() {
            if (dbClient) dbClient.close();
        });
};

exports.createGet = function(req, res) {
    res.render('todo/create');
};

exports.createPost = function(req, res) {
    var dbClient;
    var createOneTodo = function(db, data) {
        return new Promise(function(resolve, reject) {
            db.collection('todos').insertOne(data, function(error, r) {
                    if (error) reject(error);
                    else resolve(r);
            });
        });
    };
    dbUtils.connectionToDB()
        .then(function({ client, db }) {
            dbClient = client;
            var { title, description, status, estimatedDate } = req.body;
            return createOneTodo(db, {
                title,
                description,
                status,
                estimatedDate: new Date(estimatedDate)
            });
        })
        .then(function(result) {
            res.redirect('/todo');
        })
        .catch(function(err) {
            console.log(err);
            next(err);
        })
        .then(function() {
            if (dbClient) dbClient.close();
        });
};

exports.delete = function(req, res) {
    var dbClient;
    var deleteOneTodo = function(db, id) {
        return new Promise(function(resolve, reject) {
            // IDを検索条件にデータを削除
            db.collection('todos').deleteOne({ _id: dbUtils.createObjectID(id) }, function(error, r) {
                    if (error) reject(error);
                    else resolve(r);
                });
        });
    };
    dbUtils.connectionToDB()
        .then(function({ client, db }) {
            dbClient = client;
            // アクセスURLno「/todo/ID文字列」からID文字列を取得しています
            var { id } = req.params;
            return deleteOneTodo(db, id);
        })
        .then(function(result) {
            res.redirect('/home');
        })
        .catch(function(err) {
            console.log(err);
            next(err);
        })
        .then(function() {
            if (dbClient) dbClient.close();
        });
};

// 更新フォームのコントローラー
exports.updateGet = function(req, res, next) {
    var dbClient;
    console.log(1)
    var findOne = function(db, id) {
        console.log(id)
        return new Promise(function(resolve, reject) {
            db.collection('todos').findOne(
                    { _id: dbUtils.createObjectID(id) },
                    function(error, docs) {
                        if (error) reject(error);
                        else resolve(docs);
                    }
                );
        });
    }
    dbUtils.connectionToDB()
        .then(function({ client, db }) {
            dbClient = client;
            var { id } = req.params;
            return findOne(db, id);
        })
        .then(function(result) {
            res.render('todo/update', {
                todo: { ...result, estimatedDateISOS: dateUtils.date2ISOS(result.estimatedDate) }
            });
        })
        .catch(function(err) {
            console.log(err);
            next(err);
        })
        .then(function() {
            if (dbClient) dbClient.close();
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