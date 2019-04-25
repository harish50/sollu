import {ProfileInfo} from "./ProfileService";
import _ from "lodash";
import {GENDER, PROFILEICONS} from "./ProfileStore";

let profile_pic = ''
export const ProfilePicFetch = async () => {
    let userGender = ''
    await ProfileInfo().then((profileInfo) => {
        userGender = _.isUndefined(profileInfo.userGender) ? "Select Gender" : profileInfo.userGender
        if (_.isUndefined(profileInfo.imageURLdb)) {
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
            profile_pic = profileInfo.imageURLdb
    })
    return { profile_pic,userGender}
}