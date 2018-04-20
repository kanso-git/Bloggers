const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379'
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(){
    this.useCache = true;
    return this;
}

mongoose.Query.prototype.exec = async function() {

 if(!this.useCache){
    console.log(`this.useCache:${this.useCache || false}`);
    return exec.apply(this,arguments);
 }
    // this = Query
 // console.log(this.mongooseCollection.name);
 // console.log(this.getQuery());

 const key = JSON.stringify(Object.assign({}, this.getQuery(),{
    collection:this.mongooseCollection.name
   }));
  // See if we have a value for 'key' in redis  
  const cacheValue = await client.get(key);

  // If we do, return that
  if(cacheValue){
    const doc = JSON.parse(cacheValue)
   return  Array.isArray(doc)
    ? doc.map(d => new this.model(d) )
    : new this.model(doc);
  }
  // Otherwise, issue the query and store the result in redis
  const result = await exec.apply(this, arguments);
  
  // set the expiration time to 10 ms 
  client.set(key,JSON.stringify(result),'EX', 10);

  return result;
};