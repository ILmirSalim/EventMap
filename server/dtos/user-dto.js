module.exports = class UserDto {
    email;
    id;
    userName;
    userAge;
    interestsAndPreferences;
    avatar
    // isActivated;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        // this.isActivated = model.isActivated
        this.userName = model.userName;
        this.userAge = model.userAge;
        this.interestsAndPreferences = model.interestsAndPreferences
        this.avatar = model.avatar
    }
}