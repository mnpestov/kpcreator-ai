const Router = require('express')
const router = new Router()

const kp = require('./kp')
const list = require('./list')
const row = require('./row')
const authRouter = require('./authRouter');
const user = require('./user')
const contractor = require('./contractor')
const event = require('./event')
const menuItem = require('./menuItemRouter')
const organisationRouter = require('./organisationRouter')

router.use('/kp',kp)
router.use('/list', list)
router.use('/row', row)
router.use('/auth', authRouter);
router.use('/profile', user)
router.use('/contractors', contractor)
router.use('/events', event)
router.use('/menu', menuItem)
router.use('/organisation', organisationRouter)

module.exports = router