const employeesWaysService = require('../services/employees_ways')

const getEmployeesWays = async (req, res, next) => {
    try {
        const employeesWays = await employeesWaysService.getEmployeesWays();
        res.status(200).send(employeesWays);
    } catch (error) {
        next(error)
    }
}

const getEmployeeWays = async (req, res, next) => {
    const { id } = req.params;
    try {
        const employeeWays = await employeesWaysService.getEmployeeWays(id);
        res.status(200).send({ employeeWays, success: true });
    } catch (error) {
        next(error)
    }
}

const createEmployeeWay = async (req, res, next) => {
    const { idEmpleado, idRecorrido } = req.body;
    try {
        const newEmployeeWay = await employeesWaysService.createEmployeeWay({ idEmpleado, idRecorrido });
        res.status(200).send({ message: 'Ruta de empleado creada correctamente', success: true, insertedId: newEmployeeWay.id });
    } catch (error) {
        next(error)
    }
}

const updateEmployeeWay = async (req, res, next) => {
    const { id, idEmpleado, idRecorrido } = req.body;
    try {
        const updatedEmployeeWay = await employeesWaysService.updateEmployeeWay(id, { idEmpleado, idRecorrido });
        res.status(200).send({ message: 'Ruta de empleado actualizada correctamente', success: true });
    } catch (error) {
        next(error)
    }
}

const deleteEmployeeWay = async (req, res, next) => {
    const { id } = req.body;
    try {
        const deletedEmployeeWay = await employeesWaysService.deleteEmployeeWay(id);
        res.status(200).send({ message: 'Ruta de empleado eliminada correctamente', success: true });
    } catch (error) {
        next(error)
    }
}

const employeesWaysController = {
    getEmployeesWays,
    getEmployeeWays,
    createEmployeeWay,
    updateEmployeeWay,
    deleteEmployeeWay
}

module.exports = employeesWaysController;