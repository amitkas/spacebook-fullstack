var SpacebookApp = function () {

  var posts = [];

  var $posts = $(".posts");


  var fetch = function () {
    $.ajax({
      method: "GET",
      url: '/posts',
      success: function (data) {
        posts = data
        _renderPosts()
      }
    });
  }

  fetch();

var _findPostById = function(id) {
        for (var i = 0; i < posts.length; i += 1) {
            if (posts[i]._id === id) {
                return posts[i];
            }
        }
    }

  function _renderPosts() {
    $posts.empty();
    var source = $('#post-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts.length; i++) {
      var newHTML = template(posts[i]);
      $posts.append(newHTML);
      _renderComments(i)
    }
  }

  function addPost(newPost) {
    $.ajax({
      type: "POST",
      url: '/posts',
      data: ({
        text: newPost,
        comments: []
      }),
      success: function (result) {
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

  var removePostNew = function (findid) {
    $.ajax({
        type: "DELETE",
        url: '/posts/' + findid,
        data: (findid),
        success: function (result) {
          fetch()
          }
        })
    }

// var addComment = function (newComment, postIndex) {
//   posts[postIndex].comments.push(newComment);
//   console.log(newComment)
//   _renderComments(postIndex);
// };

  function addComment(newComment, postID, postIndex) {
    $.ajax({
      type: "POST",
      url: '/posts/'+postID+'/comments',
      data: (newComment),
      success: function (result) {
          posts[postIndex] = result;
            _renderComments(postIndex);
      }
    });
  }


var deleteComment = function (postIndex, commentIndex) {
  posts[postIndex].comments.splice(commentIndex, 1);
  _renderComments(postIndex);
};

  var removeCommentNew = function (postIndex, commentIndex, commentID, postID) {
    $.ajax({
        type: "DELETE",
        url: '/posts/'+postID+'/comments/'+commentID,
        data: (postID, commentID),
        success: function (result) {
          posts[postIndex] = result
          _renderComments(postIndex)
       }
        })
    }



return {
  addPost: addPost,
  // removePost: removePost,
  removePostNew: removePostNew,
  addComment: addComment,
  deleteComment: deleteComment,
  fetch: fetch,
  removeCommentNew:removeCommentNew
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
  var postID= $(this).closest('div').parent('.post').data().id

  var newComment = {
    text: $comment.val(),
    user: $user.val(),
  };

  app.addComment(newComment, postID, postIndex);
  $comment.val("");
  $user.val("");

});

$posts.on('click', '.remove-comment', function () {
  var $commentsList = $(this).closest('.post').find('.comments-list');
  var postIndex = $(this).closest('.post').index();
  var commentIndex = $(this).closest('.comment').index();
  var commentID = $(this).closest('.comment').data().id;
  var postID= $(this).closest('div').parent('.post').data().id
  app.removeCommentNew(postIndex, commentIndex, commentID, postID);
});

$posts.on('click', '.edit-post-btn', function () {
    $(".edit-post-input").toggle();
});