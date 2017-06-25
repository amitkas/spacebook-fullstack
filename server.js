var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/spacebookDB', function () {
  console.log("DB connection established!!!");
})

var Post = require('./models/postModel');

var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));



// this is the first post and comment I added inside the DB

// var secondPost = new Post ({
//   text:'second post',
//   comment:[]
// });

// secondPost.comments.push({ username: "dvir", text: "Great comment!" })

// secondPost.save(function(err, data){
//   if (err)  {return console.error(err)}
//   console.log('saved!')
// })


// You will need to create 5 server routes
// These will define your API:

// 1) to handle getting all posts and their comments

app.get('/posts', function (req, res) {
  Post.find(function (error, result) {
    if (error) {
      return console.error(error);
    }
    //console.log(result);
    res.send(result)
  });
});

// 2) to handle adding a post

app.post('/posts', function (req, res) {
  // console.log(req.body);
  var newPost = new Post(req.body)
  newPost.save(function (err, data) {
    if (err) {
      return console.error(err)
    }
    console.log('saved!')
    res.send(data)
  })
});


// 3) to handle deleting a post


app.delete('/posts/:id', function (req, res) {
  var id = req.params.id;
  Post.findById(id, function (err, res) {
    if (err) {
      throw err
    }; {
      res.remove(function (err, data) {
        if (err) {
          throw err
        }; {
          console.log('found and removed!')
        }
      })
    }
  })
  res.send()
})


// 4) to handle adding a comment to a post



app.post('/posts/:id/comments', function (req, res) {
  var id = req.params.id;
  Post.findById(id, function (err, here) {
    if (err) {
      throw err
    } else {
      here.comments.push(req.body)
      here.save(function (err, data) {
        if (err) {
          console.error(err);
        } else {
          console.log(data)
          res.send(data)
        }
      })

    }
  })

})



// 5) to handle deleting a comment from a post

app.delete('/posts/:postid/comments/:commentid', function (req, res) {
  var postid = req.params.postid;
  var commentid = req.params.commentid
  Post.findById(postid, function (err, data) {
    if (err) {
      throw err
    }; {
      data.comments.id(commentid).remove();
      data.save()
      res.send(data)
    }
  });

});



app.listen(8000, function () {
  console.log("what do you want from me! get me on 8000 ;-)");
});