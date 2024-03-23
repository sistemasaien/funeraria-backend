const bcrypt = require('bcrypt');
const errors = require('../helpers/errors')
const usersService = require('../services/users')
const permissionsService = require('../services/permissions')
const employeesService = require('../services/employees')
const employeesWaysService = require('../services/employees_ways')
const userSchema = require('../schemas/user')
const companyService = require('../services/company')
const validateSchema = require('../helpers/validate')

const getUsers = async (req, res, next) => {
    try {
        const users = await usersService.getUsers()
        res.status(200).json(users)
    } catch (error) {
        next(error);
    }
}

const getUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await usersService.getUser(id)
        if (!user) {
            errors.notFoundError('Usuario no encontrado', 'USER_NOT_FOUND')
        }
        res.status(200).json(user)
    } catch (error) {
        next(error);
    }
}

const updateUser = async (req, res, next) => {
    try {
        await validateSchema(userSchema.userUpdateSchema, req.body)
        const { id, usuario, password, perfil, nombre, email } = req.body;
        let hash = await bcrypt.hash(password, 10);
        const user = {
            id,
            usuario,
            password: hash,
            perfil,
            nombre,
            email
        };
        const userToUpdate = await usersService.getUser(id)
        if (!userToUpdate) {
            errors.notFoundError('Usuario no encontrado', 'USER_NOT_FOUND')
        }

        const updatedUser = await usersService.updateUser(id, user)
        res.status(200).json(updatedUser)
    } catch (error) {
        next(error);
    }
}

const createUser = async (req, res, next) => {
    try {
        await validateSchema(userSchema.userCreateSchema, req.body)
        const { usuario, password, perfil, nombre, email } = req.body;
        let hash = await bcrypt.hash(password, 10);
        const user = {
            usuario,
            password: hash,
            perfil,
            nombre,
            email
        };
        const newUser = await usersService.createUser(user)
        res.status(200).json(newUser)
    } catch (error) {
        next(error);
    }
}

const deleteUser = async (req, res, next) => {
    const { id } = req.body;
    try {
        const userToDelete = await usersService.getUser(id)
        if (!userToDelete) {
            errors.notFoundError('Usuario no encontrado', 'USER_NOT_FOUND')
        }
        const userHasEmployees = await employeesService.getEmployeesByUser(id)
        if (userHasEmployees.length > 0) {
            errors.conflictError('El usuario tiene empleados asignados', 'USER_HAS_EMPLOYEES')
        }

        const deletedUser = await usersService.deleteUser(id)
        res.status(200).json(deletedUser)
    } catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    const { username, password, platform } = req.body;
    try {
        const user = await usersService.getUserByUsername(username)
        if (!user) {
            errors.notFoundError('Usuario no encontrado', 'USER_NOT_FOUND')
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            errors.notFoundError('Contraseña incorrecta', 'WRONG_PASSWORD')
        }
        const permissions = await permissionsService.getPermissionsByProfile(user.perfil)
        const employee = await employeesService.getEmployeeByUser(user.id)
        let employeeWays = null;
        let companyData = null;
        if (platform === "mobile") {
            employeeWays = await employeesWaysService.getEmployeeWays(employee.id)
            console.log(employeeWays, employee.id)
            companyData = await companyService.getCompanyData();
        }
        let data = {
            user,
            permissions,
            employee,
            companyData,
            employeeWays
        }
        res.status(200).json(data)
    } catch (error) {
        next(error);
    }
}

const getUserPermissions = async (req, res, next) => {
    const { username } = req.params;
    try {
        const permissions = await usersService.getUserPermissions(username)
        res.status(200).json(permissions)
    } catch (error) {
        next(error);
    }
}

const usersController = {
    getUsers,
    getUser,
    updateUser,
    createUser,
    deleteUser,
    login,
    getUserPermissions
}

module.exports = usersController;