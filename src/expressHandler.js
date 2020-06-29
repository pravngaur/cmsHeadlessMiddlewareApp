/**
 * Script to initiate the Express server & to handle the image rendering flow.
 */

 //Variable Declaration
 var path = require('path');
 var fileSystem = require('fs');
 var express = require('express');
 var cmsHandler = require('./cmsHandler');
 const Config = require('./config');
 
 //Instantiating an express app
 var app = express();
 
 // Creating a route to serve the images.
 app.get('/getContent',(req, resp, next) => {
     let imageName = req.query.imageName;
     // remove the extension from the image name
     imageName = imageName.split('.')[0];
     
     if(imageName){
         var dir = path.join(__dirname, Config.local_config.static_root);
         var filePath = dir + imageName + Config.local_config.image_extension;
         if (!fileSystem.existsSync(filePath)) { //If file does not exist then get it from CMS
             cmsHandler(imageName, filePath);
         }
         resp.sendFile(filePath); // If file exists, send it in response
     }
 })
 
 app.listen(process.env.PORT || 5000, function () {
     console.log('Server Started Successfully');
 });