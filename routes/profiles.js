/**
 * @author zacharyjuang
 */
const express = require('express');
const Profile = require('../models/profile');
const multer = require('multer');
const {body, validationResult} = require('express-validator');
const _ = require('lodash');

const upload = multer({
  limits: {fieldSize: 25 * 1024 * 1024}
});

const SOCIALS = [
  'facebook',
  'twitter',
  'instagram',
  'snapchat',
  'twitch'];

function processSocials(body) {
  let socials = _(body).pick(SOCIALS).pickBy(_.negate(_.isEmpty)).value();
  let data = _.omit(body, SOCIALS);
  data.socials = socials;
  return data;
}

const router = express.Router();

router.route('/')
  .get(function (req, res, next) {
    Profile.find(function (err, profiles) {
      if (err) {
        next(err);
      } else {
        res.json(profiles);
      }
    });
  })
  .post([
    upload.none(),
    body('name', 'Cannot be empty.').notEmpty(),
    body('dob', 'Cannot be empty.').isDate().toDate(),
    body('nationality', 'Cannot be empty.').notEmpty(),
    body('location', 'Cannot be empty.').notEmpty(),
    body('association', 'Cannot be empty.').notEmpty(),
    body('team', 'Cannot be empty.').notEmpty(),
    body('sports', 'Cannot be empty.').toArray().isArray({min: 1})
  ], function (req, res, next) {
    const errors = validationResult(req);
    let body = processSocials(req.body);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    let profile = new Profile(body);
    profile.save(function (err, profile) {
      if (err) {
        next(err);
      } else {
        res.status(201);
        res.json(profile);
      }
    });
  });

router.route('/:profileId')
  .get(function (req, res, next) {
    Profile.findOne({_id: req.params.profileId}, function (err, profile) {
      if (err) {
        next(err);
      } else {
        res.json(profile);
      }
    });
  })
  .put([
    upload.none(),
    body('sports').toArray()
  ], function (req, res, next) {
    let body = processSocials(req.body);
    Profile.findOneAndUpdate({_id: req.params.profileId}, body, {new: true}, function (err, profile) {
      if (err) {
        next(err);
      } else {
        res.json(profile);
      }
    });
  })
  .delete(function (req, res, next) {
    Profile.deleteOne({_id: req.params.profileId}, function (err) {
      if (err) {
        next(err);
      } else {
        res.sendStatus(200);
      }
    });
  });

module.exports = router;
