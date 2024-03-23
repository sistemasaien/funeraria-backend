const { PrismaClient } = require('@prisma/client')
const errors = require('../helpers/errors')
const prisma = new PrismaClient()

const getUsers = async () => {
    try {
        const users = await prisma.usuarios.findMany()
        return users
    } catch (error) {
        errors.conflictError('Error al obtener los usuarios', 'GET_USERS_DB', error)
    }
}

const getUser = async (id) => {
    try {
        const user = await prisma.usuarios.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        return user
    } catch (error) {
        errors.conflictError('Error al obtener el usuario', 'GET_USER_DB', error)
    }
}

const createUser = async (user) => {
    try {
        const newUser = await prisma.usuarios.create({
            data: user
        })
        return newUser
    } catch (error) {
        errors.conflictError('Error al crear el usuario', 'CREATE_USER_DB', error)
    }
}

const updateUser = async (id, user) => {
    try {
        const updatedUser = await prisma.usuarios.update({
            where: {
                id: parseInt(id)
            },
            data: user
        })
        return updatedUser
    } catch (error) {
        errors.conflictError('Error al actualizar el usuario', 'UPDATE_USER_DB', error)
    }
}

const deleteUser = async (id) => {
    try {
        const deletedUser = await prisma.usuarios.delete({
            where: {
                id: parseInt(id)
            }
        })
        return deletedUser
    } catch (error) {
        errors.conflictError('Error al eliminar el usuario', 'DELETE_USER_DB', error)
    }
}

const getUserByUsername = async (username) => {
    try {
        const user = await prisma.usuarios.findUnique({
            where: {
                usuario: username
            }
        })
        return user
    } catch (error) {
        errors.conflictError('Error al obtener el usuario', 'GET_USER_DB', error)
    }
}

const getUserPermissions = async (username) => {
    try {
        const query = `select 
            pe.permiso, pe.tipo 
            from permisos pe 
            where pe.idPerfil = (SELECT p.id FROM perfiles p where p.id = (SELECT perfil from usuarios where usuario = '${username}'));`

        const result = await prisma.$queryRawUnsafe(query)
        if (result?.length > 0) {
            let permissions = result.map((permiso) => {
                return {
                    permiso: permiso.permiso,
                    tipo: permiso.tipo
                };
            });
            return permissions
        }
    } catch (error) {
        errors.conflictError('Error al obtener los permisos', 'GET_PERMISSIONS_DB', error)
    }
}

const usersService = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUserByUsername,
    getUserPermissions
}

module.exports = usersService;