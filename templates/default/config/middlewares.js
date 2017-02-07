/*

middlewares.js configuration

This array - is a muddlewares array, which you want to use in your requests. 
The order is important. It means, that the first element of array will handle 
requests at first.

*/

module.exports = [
  'checkIP',
  'checkDomain'
]
