import { User } from "./UserRoutes.js";

export function getLoggedInUser(token) {
    User.find({token: token}, function (err, foundUser) { 
        if(err) {
            console.log(err);
        }else{
            return foundUser;
        }
    });
}