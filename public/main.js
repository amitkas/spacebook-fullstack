var SpacebookApp = function () {

  var posts = [];

  var $posts = $(".posts");


  var fetch = function () {
    $.ajax({
      method: "GET",
      url: '/posts',
      success: function (data) {
        posts = data
        // console.log(posts)
        // for (var i = 0; i < data.length; i++) {
        //   var element = data[i].comments.text;
        //   console.log(element + "aaa")
        // posts.push([postText, ])
        _renderPosts()
      }
    });
  }

  fetch();


  function _renderPosts() {
    $posts.empty();
    var source = $('#post-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts.length; i++) {
      var newHTML = template(posts[i]);
      console.log(newHTML);
      $posts.append(newHTML);
      _renderComments(i)
    }
  }

  function addPost(newPost) {
    // posts.push({
    //   text: newPost,
    //   comments: [],
    // });

    $.ajax({
      type: "POST",
      url: '/posts',
      data: ({
        text: newPost,
        comments: []
      }),
      success: function (result) {
          console.log('somethign something  ' + result);
          posts.push(result)
          _renderPosts()
      }
    });
  }


  function _renderComments(postIndex) {
    var post = $(".post")[postIndex];
    $commentsList = $(post).find('.comments-list')
    $commentsList.empty();
    var source = $('#comment-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts[postIndex].comments.length; i++) {
      var newHTML = template(posts[postIndex].comments[i]);
      $commentsList.append(newHTML);
    }
  }

  // var removePost = function (index) {
  //   posts.splice(index, 1);
  //   _renderPosts();
  // };

  var removePostNew = function (findid) {
    // console.log(findid)
    // var newdelete = (findid+'id')
    $.ajax({
        type: "DELETE",
        url: '/posts/' + findid,
        data: (findid),
        success: function (result) {
          fetch()
          }
        })
    }

var addComment = function (newComment, postIndex) {
  posts[postIndex].comments.push(newComment);
  ID++
  _renderComments(postIndex);
};


var deleteComment = function (postIndex, commentIndex) {
  posts[postIndex].comments.splice(commentIndex, 1);
  _renderComments(postIndex);
};



return {
  addPost: addPost,
  // removePost: removePost,
  removePostNew: removePostNew,
  addComment: addComment,
  deleteComment: deleteComment,
  fetch: fetch
};
};

var app = SpacebookApp();

$('#addpost').on('click', function () {
  var $input = $("#postText");
  if ($input.val() === "") {
    alert("Please enter text!");
  } else {
    app.addPost($input.val());
    $input.val("");
    var newPost = $input.val('')
  }
})

// var addnewPost = function(){
//   $.ajax({
//   type: "POST",
//   url: '/posts',
//   data: ({
//     text: newPost,
//     comments: []
//   })
// }, function (err, result) {
//   if (err) {
//     console.log('error!')
//   } {
//     console.log(data);
//   }
// });
// }

var $posts = $(".posts");

$posts.on('click', '.remove-post', function () {
  var index = $(this).closest('.post').index();;
  var findid = $(this).closest('div').data().id;
  // app.removePost(index);
  app.removePostNew(findid);
});

$posts.on('click', '.toggle-comments', function () {
  var $clickedPost = $(this).closest('.post');
  $clickedPost.find('.comments-container').toggleClass('show');
});

$posts.on('click', '.add-comment', function () {

  var $comment = $(this).siblings('.comment');
  var $user = $(this).siblings('.name');

  if ($comment.val() === "" || $user.val() === "") {
    alert("Please enter your name and a comment!");
    return;
  }

  var postIndex = $(this).closest('.post').index();

  var newComment = {
    text: $comment.val(),
    user: $user.val(),
  };

  app.addComment(newComment, postIndex);
  $comment.val("");
  $user.val("");

});

$posts.on('click', '.remove-comment', function () {
  var $commentsList = $(this).closest('.post').find('.comments-list');
  var postIndex = $(this).closest('.post').index();
  var commentIndex = $(this).closest('.comment').index();

  app.deleteComment(postIndex, commentIndex);
});