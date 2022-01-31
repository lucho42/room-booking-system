const router = require('express').Router()
const {
    signinForm,
    signin,
    signout,
} = require('../controllers/auth.controller')

// to send connection form
router.get('/signin/form', signinForm)
// to connect user
router.post('/signin', signin)
// to disconnect user
router.get('/signout', signout)

module.exports = router
