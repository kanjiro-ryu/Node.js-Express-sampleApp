var dbUtils = require('../lib/dbUtils');
var todoQueries = require('../lib/todoQueries')

exports.index = function(req, res) {
    var dbClient;

    var countTodos = function(db, condition) {
        return new Promise(function(resolve, reject) {
            db.collection('todos')
                .countDocuments(
                    function(error, count) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(count);
                        }
                    }
                );
        });
    }

    dbUtils.connectionToDB()
        .then(function({ client, db }) {
            dbClient = client;
            // ３つの検索が全て終わるまで待つようにする
            return Promise.all([
                countTodos(db, todoQueries.notCompleted()),
                countTodos(db, todoQueries.today()),
                countTodos(db, todoQueries.completed()),
            ]);
        })
        .then(function(result) {
            res.render('home/index', {
                // 取得した件数をそれぞれ設定
                remainingTodoCount: result[0],
                todayTodoCount: result[1],
                completedTodoCount: result[2]
            });
        })
        .catch(function(err) {
            console.log(err);
            next(err);
        })
        .then(function() {
            if (dbClient) {
                dbClient.close();
            }
        });
    // res.render('home/index',{
    //     remainingTodoCount: 4,
    //     todayTodoCount: 2,
    //     completedTodoCount: 1
    // });
};




