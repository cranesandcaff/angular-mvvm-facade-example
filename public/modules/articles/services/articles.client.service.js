
// Articles service used for communicating with the articles REST endpoints
// angular.module('articles').factory('Articles', ['$resource', function($resource) {
//     return $resource('articles/:articleId', {
//         articleId: '@_id'
//     }, {
//         update: {
//             method: 'PUT'
//         }
//     });
// }]);
//
angular.module('articles').service('Articles', Articles);

function Articles($resource){
  this.create = create;
  this.update = update;
  this.find   = find;

  function find(){
    return remote().query().$promise;
  }

  function create(article){
    return remote().save(article).$promise;
  }

  function update(article){
    return remote().update(article).$promise;
  }

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
