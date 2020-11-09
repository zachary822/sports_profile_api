/**
 * @author zacharyjuang
 */
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    dob: {
      type: Date,
      required: true
    },
    nationality: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    association: {
      type: String,
      required: true
    },
    team: {
      type: String,
      required: true
    },
    gender: {
      type: String
    },
    sports: {
      type: [String],
      required: true
    },
    about: {
      type: String
    },
    interests: {
      type: String
    },
    charities: {
      type: String
    },
    socials: {
      type: Map,
      of: String
    },
    pets: {
      type: String
    },
    alcohol: {
      type: Boolean
    },
    married: {
      type: Boolean
    },
    profileImage: {
      type: String
    }
  },
  {timestamps: true}
);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
