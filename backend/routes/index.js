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

router.use('/api/kp', kp)
router.use('/api/list', list)
router.use('/api/row', row)
router.use('/api/auth', authRouter)
router.use('/api/profile', user)
router.use('/api/contractors', contractor)
router.use('/api/events', event)
router.use('/api/menu', menuItem)
router.use('/api/organisation', organisationRouter)

module.exports = router