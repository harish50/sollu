import {ProfileInfo} from "./ProfileService";
import _ from "lodash";
import {GENDER, PROFILEICONS} from "./ProfileStore";

let profile_pic = ''
export const ProfilePicFetch = async (user) => {
    let userGender = ''
    await ProfileInfo(user).then((profileInfo) => {
        userGender = _.isUndefined(profileInfo.Gender) ? "Select Gender" : profileInfo.Gender
        if (_.isUndefined(profileInfo.imageURL)) {
            switch (userGender) {
                case GENDER.FEMALE:
                    profile_pic = PROFILEICONS.FEMALEICON
                    break;
                case GENDER.MALE:
                    profile_pic = PROFILEICONS.MALEICON
                    break;
                case GENDER.SELECTGENDER:
                    profile_pic = PROFILEICONS.GENERALICON
                    break;
            }
        } else
            profile_pic = profileInfo.imageURL
    })
    return { profile_pic,userGender}
}