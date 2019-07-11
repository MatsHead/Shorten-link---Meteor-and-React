import { Meteor } from 'meteor/meteor';
import { Links } from '../imports/collections/links';
import { WebApp } from 'meteor/webapp';
import ConnectRoute from 'connect-route';
Meteor.startup(() => {
  Meteor.publish('links', function(){
    return Links.find({});
  });
});

// Executed whenever a user visits with a route like 
// 'localhost:3000/abcd
function onRoute(req, res, next){
// Take the token out of the url and try to find 
// matching link in the collection
  const link = Links.findOne({token: req.params.token});

// if we find a link object, redirect the user to the long url, otherise stay at react app
  if (link) {
    Links.update(link, { $inc: { clicks: 1 } });
    res.writeHead(307, { 'Location': link.url })
    res.end();
  } else {
    next();
  }

}

const mmiddleware = ConnectRoute(function(router){
  router.get('/:token', onRoute);
});

WebApp.connectHandlers.use(mmiddleware);
