const { GraphQLString, GraphQLNonNull} = require('graphql');
const { dbQuery } = require('../../database');
const { AuthType, DefaultType } = require('../../types');
const { diffHash, AuthToken } = require('../../libs/Auth');
const { emailValidation, passwordValidation, getTimeStamp } = require('../../libs/utils');

const queryAuth = {
  type: AuthType,
  description: "User login auth.",
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLString },
    channel: { type: new GraphQLNonNull(GraphQLString) },
    channelName: { type: GraphQLString },
    channelHeadNav: { type: GraphQLString },
  },
  async resolve(_, { email, password, channel, channelName, channelHeadNav }){
    if(channel === "listlist"){
      /**
       * Login from Listlist
       */

      // Validation
      const emailValid = emailValidation(email);
      if(!emailValid.status) return { code: 500, message: emailValid.message, token: null }

      const passwordValid = passwordValidation(password);
      if(!passwordValid.status) return { code: null, message: passwordValid.message, token: null }

      // Query user in DB
      let res = await dbQuery(`SELECT * FROM User WHERE email = '${email}'`);
      let passwordInDB = res[0] ? res[0].password : '';

      // No user
      if(!passwordInDB){
        // if it is a google user
        if(res[0] && res[0].reg_channel === 'google'){
          return { code: 500, message: 'Your google account is not bound to a login password, please log in through Google Login button', token: null };
        }
        // not google user
        return { code: 500, message: 'User is not exist', token: null };
      }
      
      // Password check
      let diff = await diffHash(password, passwordInDB);
      if(diff){
        const token = AuthToken.generate(email);
        const resUserInfos = JSON.stringify({
          name: res[0].name,
          email: res[0].email,
          userID: res[0].id,
          headnav: res[0].headnav,
          createdAt: res[0].createdAt,
          channel: "listlist",
        });

        if(token){
          return {
            code: 200,
            message: resUserInfos,
            token: token,
          };
        }else{
          return {code: 500, message: 'Failed to create token', token: null};
        }
        
      }else{
        return {code: 500, message: 'Email or password does not match', token: null};
      }
      
    }else if(channel === "google"){
      /**
       * Login from Google
       */

      // Validation
      const emailValid = emailValidation(email);
      if(!emailValid.status) return { code: 500, message: emailValid.message, token: null }

      // Query user in DB
      let res = await dbQuery(`SELECT * FROM User WHERE email = '${email}'`);
      
      let resUserInfos = {};

      if(res[0]){
        // user is exist
        // diff headnav, if same, go next, if not same, update headnav then go next;
        if(res[0].headnav !== channelHeadNav){
          // update headnav
          await dbQuery(`UPDATE User SET headnav = '${channelHeadNav}' WHERE email = '${email}'`);
        }

        resUserInfos = JSON.stringify({
          name: res[0].name,
          email: res[0].email,
          userID: res[0].id,
          headnav: res[0].headnav,
          createdAt: res[0].createdAt,
          channel: "google",
        });

      }else{
        // user is not exist
        // create user first then go next;
        const currentTimestamp = getTimeStamp();
        let createTheUser = await dbQuery(`insert into User (email, name, headnav, reg_channel, createdAt) values ('${email}', '${channelName}', '${channelHeadNav}', 'google',${currentTimestamp})`);

        resUserInfos = JSON.stringify({
          name: channelName,
          email: email,
          userID: createTheUser.insertId,
          headnav: channelHeadNav,
          createdAt: currentTimestamp,
          channel: "google",
        });
      }

      // Create token then return
      const token = AuthToken.generate(email);
      if(token){
        return {
          code: 200,
          message: resUserInfos,
          token: token,
        };
      }else{
        return {code: 500, message: 'Failed to create token', token: null};
      }

    }
  }
};

const queryTokenValidation = {
  type: DefaultType,
  description: "Validate the token",
  async resolve(_, {}){
    if(!global.token || global.token === null || global.token === 'null'){
      return {code: 500, message: 'Token is missing'};
    }
    
    if(AuthToken.verify(global.token)){
      return {code: 200, message: 'Token Ok'};
    }else{
      return {code: 500, message: 'Token Expired'};
    }
  }
};

module.exports = {
  queryAuth,
  queryTokenValidation,
};
