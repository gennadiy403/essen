/*

routes.js configuration

Use this file to configure, which routes you need to handle by
your controllers. Each route - is a field, named like route url.
Route has its controllet, action and method fields.

*/

module.exports = {
  '/': {
    controller: 'IndexController',
    action: 'index',
    method: 'GET',
  },
};
