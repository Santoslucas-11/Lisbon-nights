const router = require('express').Router();
const isCreator = require('../middleware/isCreator')
const mongoose = require("mongoose");
const Event = require('../models/Event.model.js');
const User = require('../models/User.model');
const fileUploader = require('../config/cloudinary.config');


router.get('/events/create', isCreator, async (req, res) => {

try {
  const currentUser = req.session.currentUser
  const creator = await User.findOne();
  res.render("/events/event-create", {creator, currentUser}) 
} catch (error) {
  console.log(error);
  next(error);
}
})



router.post(
  '/events/create', isCreator,
  fileUploader.single('picture_url'),
  async (req, res, next) => {
    try {
   
      console.log(req.body)
      const { title, description, location, contact, author } = req.body;
      const event = {
        title, 
        description,
        location, 
        contact, 
        author
      };
      if (req.file) {
        event.picture_url = req.file.path;
        console.log(req.file.path)
        console.log(event.picture_url)
      }
      const newEvent = await Event.create(event);
      console.log('Event created:', newEvent.name);
      res.redirect('/events');
    } catch (error) {
      next(error);
    }
  }
);

router.post('/events/create', isCreator,async (req, res, next) => {
  const { title, description, location, contact, picture_url, author } = req.body;
  console.log(req.body)
 await Event.create({ title, description, location, contact, picture_url, author })
  .then(() => res.redirect('/events'))
  .catch(error => next(error));
});

router.get('/events', isCreator, async (req, res, next) => {
 await Event.find()
    .then(events => {
      
      console.log('Retrieved events from DB:', events);
 
      res.render('events/events-list.hbs', { events });
    })
    .catch(error => {
      console.log('Error while getting the events from the DB: ', error);    
      next(error);
    });
});


router.get('/events/:eventId/edit', isCreator, async (req, res, next) => {
  const { eventId } = req.params;
 
 await Event.findById(eventId)
    .then(eventToEdit => {
    console.log(eventToEdit)
      res.render('events/event-edit.hbs', { event: eventToEdit });
    })
    .catch(error => next(error));
});

 
router.post('/events/:eventId/edit', isCreator,fileUploader.single('picture_url'), async (req, res, next) => {


  const { eventId } = req.params;
  const { title, description, location, contact, picture_url, author } = req.body;
 
 await Event.findByIdAndUpdate(eventId, { title, description, location, contact, picture_url, author }, { new: true })
    .then(updatedEvent => res.redirect(`/events/${updatedEvent.id}`)) 
    .catch(error => next(error));
});


router.post('/events/:eventId/delete', isCreator, async (req, res, next) => {
  const { eventId } = req.params;

  console.log('aqui', eventId)
 
  await Event.findByIdAndDelete(eventId)
    .then(() => res.redirect('/events'))
    .catch(error => next(error));
});


router.get('/events/:eventId', async (req, res) => {
  const { eventId } = req.params;
await  Event.findById(eventId)
  .then(theEvent => res.render('events/event-create', { event: theEvent }))
  .catch(error => {
    console.log('Error while retrieving event details: ', error);

    
    next(error);
  });
});




module.exports = router;








