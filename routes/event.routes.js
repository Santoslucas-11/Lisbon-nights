const router = require('express').Router();


const Event = require('../models/Event.model.js');


router.get('/events/create', (req, res) => res.render('events/event-create.hbs'));

router.post('/events/create', (req, res, next) => {
  const { title, description, location, contact, picture_url } = req.body;

  Event.create({ title, description, location, contact, picture_url })
  .then(() => res.redirect('/events'))
  .catch(error => next(error));
});


router.get('/events', (req, res, next) => {
  Event.find()
    .then(allTheEventsFromDB => {
      
      console.log('Retrieved events from DB:', allTheEventsFromDB);
 
      res.render('events/events-list.hbs', { events: allTheEventsFromDB });
    })
    .catch(error => {
      console.log('Error while getting the events from the DB: ', error);
 
     
      next(error);
    });
});

router.get('/events/:eventId', (req, res) => {
  const { eventId } = req.params;
  Event.findById(eventId)
  .then(theEvent => res.render('events/event-details.hbs', { event: theEvent }))
  .catch(error => {
    console.log('Error while retrieving event details: ', error);

    
    next(error);
  });
});



router.get('/events/:eventId/edit', (req, res, next) => {
  const { eventId } = req.params;
 
  Event.findById(eventId)
    .then(eventToEdit => {
      // console.log(bookToEdit);
      res.render('events/event-edit.hbs', { event: eventToEdit }); // <-- add this line
    })
    .catch(error => next(error));
});

 
router.post('/events/:eventId/edit', (req, res, next) => {
  const { eventId } = req.params;
  const { title, description, location, contact, picture_url } = req.body;
 
  Event.findByIdAndUpdate(eventId, { title, description, location, contact, picture_url }, { new: true })
    .then(updatedEvent => res.redirect(`/events/${updatedEvent.id}`)) // go to the details page to see the updates
    .catch(error => next(error));
});

router.post('/events/:eventId/delete', (req, res, next) => {
  const { eventId } = req.params;
 
  Event.findByIdAndDelete(eventId)
    .then(() => res.redirect('/events'))
    .catch(error => next(error));
});



module.exports = router;
