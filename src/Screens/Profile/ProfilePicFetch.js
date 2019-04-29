import {ProfileInfo} from "./ProfileService";
import _ from "lodash";
import {GENDER, PROFILEICONS} from "./ProfileStore";

let profilePic = ''
export const ProfilePicFetch = async (user) => {
    let userGender = ''
    await ProfileInfo(user).then((profileInfo) => {
        userGender = _.isUndefined(profileInfo.Gender) ? "Select Gender" : profileInfo.Gender
        if (_.isUndefined(profileInfo.imageURL)) {
            switch (userGender) {
                case GENDER.FEMALE:
                    profilePic = PROFILEICONS.FEMALEICON
                    break;
                case GENDER.MALE:
                    profilePic = PROFILEICONS.MALEICON
                    break;
                case GENDER.SELECTGENDER:
                    profilePic = PROFILEICONS.GENERALICON
                    break;
            }
        } else
            profilePic = profileInfo.imageURL
    })
    return { profilePic,userGender}
}