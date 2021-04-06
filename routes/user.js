const {check} = require('express-validator');
const {Router} = require('express');

const getUsers = require('../controllers/users/getUsers');
const createUser = require('../controllers/users/createUser');
const updateUser = require('../controllers/users/updateUser');
const deleteUser = require('../controllers/users/deleteUser');

const {
    fieldValidation,
    authRole,
    authToken
} = require('../middlewares')

const {uniqueEmail,validRole,idExists} = require('../helpers/databaseValidators');

const router = Router();

router.get('/',authToken,getUsers);

router.post('/',[
    check('name','Unvalid name').not().isEmpty(),
    check('email','Unvalid email').isEmail(),
    check('password',
    'Password has to contain one digit, one lower, one upper and has to be eight characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/),
    check('role').custom(validRole),
    check('email').custom(uniqueEmail),
    check('login','has to be boolean').optional().isBoolean(),
    fieldValidation
],createUser);

router.put('/:id',[
    authToken,
    authRole("ADMIN_ROLE"),
    check('id',"It's not a valid MongoID").isMongoId(),
    check('id').custom(idExists),
    check('name','Unvalid name').optional().not().isEmpty(),
    check('email','Unvalid email').optional().isEmail(),
    check('password',
    'Password has to contain one digit, one lower case, one upper case and has to be eight characters long')
    .optional().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/),
    check('role').optional().custom(validRole),
    check('state','State has to be a boolean value').optional().isBoolean(),
    fieldValidation
],updateUser);

router.delete('/:id',[
    authToken,
    authRole("ADMIN_ROLE"),
    check('id',"It's not a valid MongoID").isMongoId(),
    check('id').custom(idExists),
    fieldValidation
],deleteUser);

module.exports=router;