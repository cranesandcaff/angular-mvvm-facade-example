angular.module('articles').controller('ArticlesController', ArticlesController);

function ArticlesController($scope, $location, Authentication, Articles){
  $scope.authentication = Authentication;
  $scope.find           = find;
  $scope.findOne        = findOne;
  $scope.create         = create;


  function find(){
    Articles.find().then(function(articles){ $scope.articles = articles; });
  }

  function findOne(){
    Articles.findOne().then(function(article){ $scope.article = article; });
  }

  function create(article){
    Articles.create(article).then(postSuccess, postError);
  }

  function update(article){
    Articles.update(article).then(postSuccess, postError);
  }

  function postSuccess(response){
    $location.path('articles/' + response._id);
  }

  function postError(err){
    $scope.error = err.data.message;
  }
}
