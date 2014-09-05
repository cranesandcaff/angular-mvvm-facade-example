# Maintaing Sanity with AngularJS
## The Facade and MVVM Patterns

### Part One - The Facade

Facade. Ignoring the architectural definition, a facade is a false front, a simple illusion hiding complexity from the world.

It's one of the most commonly used patterns in software development, yet many developers aren't using it to it's fullest. Let's get started with building a simple application.

If you're dedicated to following along nab SlushJS and scaffold out an Angular app with the slush-meanjs generator, include their Article example.

They utilize one of the most common patterns for interacting with an API with $resource.

    angular.module('articles').factory('Articles', ['$resource', function($resource) {
        return $resource('articles/:articleId', {
            articleId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }]);

Now you can inject the Article resource into your controller and interact with your API. Pretty nifty right?

### This is terrible. Stop doing this.

First off, what if you want to do something other than interact with the server? You end up with two options, either put it in your controller or create another service object to deal with those functions, further it forces you to deal with way too the response within your "Controller". Take a glance at their Article Controller, it's massive and frustrating to deal with.

Let's fix this up. First, I prefer services to factories when building a facade. It's a syntax difference more than anything as both services and factories are just sugar on the provider function.

    angular.module('articles').service('Articles', Articles);

    function Articles($resource){


      function remote(){
        return $resource('articles/:articleId', {
            articleId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
      }
    }

We move the $resource to a named function remote(), this will be an internal function. Nothing outside of our Articles service should interact with it. Ever.

We need to be able to save articles, let's see how that was done before.

Inside of the Articles controller we have:

    $scope.create = function() {
      var article = new Articles({
        title: this.title,
        content: this.content
      });
      article.$save(function(response) {
        $location.path('articles/' + response._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });

      this.title = '';
      this.content = '';
    };

That's fairly verbose, and what if we want to create an Article in a different view? We'd have to rewrite that. Not the Angular way. Let's get zen.

In your Article service add the following method. It calls on our remote function and returns the promise from it.

    this.create = create;

    function create(article){
      return remote().save(article).$promise;
    }

Our updated controller.

    function ArticlesController($scope, $location, Authentication, Articles){

      $scope.create = function(){
        var article = {title: this.title, content: this.content};
        Articles.create(article).then(function(response) {
          $location.path('articles/' + response._id);
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      }
      $scope.update = function() {
        var article = $scope.article;

        article.$update(function() {
          $location.path('articles/' + article._id);
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };
    }

Our create function uses the updated API, bThat's not much less verbose than what we had though is it?

If we look at the handling of the response and compare it to updating an article we see they are both doing literally the same thing. Why are we repeating ourselves? Plus...we already have the article in the $scope, why are we bothering with the reassignment? We can improve this for sanity.

    function ArticlesController($scope, $location, Authentication, Articles){
      $scope.authentication = Authentication;
      $scope.create = create;

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

This is significantly more readable. Further if we want to do something with the articles like sync them to local storage, sort them or anything of the like we can do it in our service, it allows us to more easily access these methods in other services.

In our article create view we need to make some changes before this update will work. Specifically we need to pass in the article into the function.
