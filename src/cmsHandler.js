/**
 * Script to download the images from CMS using the APIs
 */

// Variable declaration
let SalesforceConnection = require("node-salesforce-connection");
const FileSystem = require('fs');
const Config = require('./config');

module.exports = async (imageName, filePath) => {

  try{
    let sfConn = new SalesforceConnection();
    const hostname = "login.salesforce.com";
    const localImagePath = Config.local_config.images_path + imageName + Config.local_config.image_extension ;
    
    let tokenRequest = {
      grant_type: Config.api_config.grant_type,
      client_id: Config.api_config.client_id,
      client_secret: Config.api_config.client_secret,
      username: Config.api_config.username,
      password: Config.api_config.password,
    };
    // first get the auth token
    await sfConn.oauthToken(hostname, tokenRequest); 
    let apiEndpoint = Config.api_config.image_api_prefix + imageName + Config.api_config.image_api_suffix;
    
    // then get the image
    let image = await sfConn.rest(apiEndpoint,{responseType: "raw"});
    const buffer = Buffer.from(image.body, 'utf8');
    FileSystem.writeFileSync(filePath, buffer);
  }
  catch(ex){
    console.error(ex.stack);
  }
}