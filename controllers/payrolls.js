const payrollsService = require('../services/payrolls')
const payrollProfilesService = require('../services/payroll_profiles')
const errors = require('../helpers/errors');
const employeesService = require('../services/employees');
const packsService = require('../services/packs');
const PDFDocument = require('pdfkit');
const moment = require('moment');
const companyService = require('../services/company');

const createPayrollEmployeeDetail = async ({ idEmpleado, fecha, tipo, monto, idPaquete, idContrato }) => {
    try {
        let payrollDetailValue = 0;
        let employee = await employeesService.getEmployee(idEmpleado);
        if (!employee) {
            errors.notFoundError('Empleado no encontrado', 'EMPLOYEE_NOT_FOUND')
        }
        let payrollProfile = await payrollProfilesService.getPayrollProfile(parseInt(employee.perfilNomina));
        if (!payrollProfile) {
            errors.notFoundError('Perfil de nómina no encontrado', 'PAYROLL_PROFILE_NOT_FOUND')
        }

        let payrollProfilePack = await payrollProfilesService.getPayrollByProfileAndPack(parseInt(employee.perfilNomina), parseInt(idPaquete));
        let sumOfPayrollsDetail = await payrollsService.getSumOfPayrollsDetailByEmployeeAndContract(idEmpleado, idContrato);
        if (sumOfPayrollsDetail > parseFloat(payrollProfile.comision)) {
            return;
        }

        let porcentaje = 0;
        if (payrollProfilePack && payrollProfilePack.porcentaje) {
            porcentaje = parseFloat(payrollProfilePack.porcentaje);
        } else {
            if (payrollProfile.porcentajeBase) {
                porcentaje = parseFloat(payrollProfile.porcentajeBase);
            }
        }
        let montoFijo = 0;
        if (payrollProfilePack && payrollProfilePack.montoFijo) {
            montoFijo = parseFloat(payrollProfilePack.montoFijo);
        } else {
            if (payrollProfile.montoFijoBase) {
                montoFijo = parseFloat(payrollProfile.montoFijoBase);
            }
        }

        if (tipo === 'C') {
            if (payrollProfile.tipo === 'V') {
                payrollDetailValue = monto * (porcentaje / 100)
            }
            if (payrollProfile.tipo === 'F') {
                payrollDetailValue = montoFijo
            }

            if ((sumOfPayrollsDetail + payrollDetailValue) > parseFloat(payrollProfile.comision)) {
                payrollDetailValue = parseFloat(payrollProfile.comision) - sumOfPayrollsDetail;
            }
        } else {
            let porcentajeEnganche = 0;

            if (payrollProfilePack && payrollProfilePack.porcentajeEnganche) {
                porcentajeEnganche = parseFloat(payrollProfilePack.porcentajeEnganche);
            } else {
                if (payrollProfile.porcentajeEngancheBase) {
                    porcentajeEnganche = parseFloat(payrollProfile.porcentajeEngancheBase);
                }
            }
            let montoEnganche = 0;
            if (payrollProfilePack && payrollProfilePack.montoFijoEnganche) {
                montoEnganche = parseFloat(payrollProfilePack.montoFijoEnganche);
            } else {
                if (payrollProfile.montoFijoEngancheBase) {
                    montoEnganche = parseFloat(payrollProfile.montoFijoEngancheBase);
                }
            }

            if (payrollProfile.tipo === 'V') {
                payrollDetailValue = monto * (porcentajeEnganche / 100)
            } else {
                payrollDetailValue = montoEnganche
            }
        }

        let payrollEmployeeDetail = {
            idEmpleado,
            fecha_hora: fecha,
            tipo,
            monto: payrollDetailValue,
            idPaquete,
            idContrato,
            procesado: 'N'
        }

        await payrollsService.createPayrollEmployeeDetail(payrollEmployeeDetail)
    } catch (error) {
        console.log(error)
    }
}

const getPayrollDetailsByEmployeeSinceDate = async (req, res, next) => {
    const { idEmpleado, fecha } = req.body;
    try {
        const payrollDetails = await payrollsService.getPayrollDetailsByEmployeeSinceDate(idEmpleado, fecha)
        res.status(200).json(payrollDetails)
    } catch (error) {
        next(error);
    }
}

const generatePayrollPDF = async (req, res, next) => {
    const { id } = req.params;
    try {
        const payrolls = await payrollsService.getPayrollById(id);
        const payroll = payrolls[0];
        const employee = await employeesService.getEmployee(payroll.idEmpleado);
        const payrollProfile = await payrollProfilesService.getPayrollProfile(parseInt(employee.perfilNomina));
        const payrollDetails = await payrollsService.getPayrollDetailsById(id);
        const packs = await packsService.getPacks();
        const company = await companyService.getCompanyData();

        payrollDetails.forEach(payrollDetail => {
            payrollDetail.paquete = packs.find(pack => parseInt(pack.id) === parseInt(payrollDetail.idPaquete))?.nombrePaquete
        })

        const getTotalByDetails = () => {
            let total = 0;
            payrollDetails.forEach(detail => {
                total += parseFloat(detail.monto);
            });
            return total.toFixed(2); // Ensure two decimal places
        };

        const doc = new PDFDocument({
            size: 'A4',
            margin: 30
        });

        // Set response headers
        const filename = `nomina-${moment().format('YYYY-MM-DD')}.pdf`;
        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        doc.font('Helvetica-Bold').fontSize(20).text(company?.nombre, { align: 'center' });

        // Título
        doc.fontSize(20).text('IMPRESIÓN DE NÓMINA', { align: 'center' });
        doc.moveDown();

        // Fecha y Hora
        const nombre = `Empleado: ${employee.nombre}`;
        const sueldoBase = `Sueldo base: $ ${payrollProfile.sueldoBase}`;

        doc.fontSize(12).text(nombre, 50, 100);
        doc.text(sueldoBase, { align: 'right' }, 100);
        doc.moveDown();

        // Fecha y Hora
        const fecha = `Fecha/hora: ${moment(payroll.fecha).format('DD/MM/YYYY')} ${moment(payroll.fecha).format('HH:mm')}`;
        const periodicidad = `Periodicidad: ${payrollProfile.periodicidad === 'D' ? 'Diaria' : payrollProfile.periodicidad === 'S' ? 'Semanal' : payrollProfile.periodicidad === 'C' ? 'Catorcenal' : payrollProfile.periodicidad === 'Q' ? 'Quincenal' : 'Mensual'}`;
        doc.fontSize(12).text(fecha, 50, 120);
        doc.text(periodicidad, { align: 'right' }, 120);
        doc.moveDown();

        // Monto total y Monto por comisión
        const montoTotal = `Monto total: $ ${payroll.total}`;
        const montoComision = `Monto por comisión: $ ${getTotalByDetails()}`;
        doc.fontSize(12).text(montoTotal, 50, 140);
        doc.text(montoComision, { align: 'right' }, 140);
        doc.moveDown();

        // Cantidad de cobros y Número de nómina
        const cantidadCobros = `Cantidad de cobros: ${payrollDetails.length}`;
        const numeroNomina = `Número de nómina: ${payroll.id}`;
        doc.fontSize(12).text(cantidadCobros, 50, 160);
        doc.text(numeroNomina, { align: 'right' }, 160);
        doc.moveDown();

        // Table setup
        const tableTop = 190; // Y position to start the table
        const rowHeight = 20; // Height of each row
        const col1Width = 90;
        const col2Width = 90;
        const col3Width = 90;
        const col4Width = 90;

        // Function to add table headers
        const addTableHeaders = (y) => {
            doc
                .fontSize(12)
                .text('Monto', 50, y)
                .text('Tipo', 50 + col1Width, y)
                .text('Fecha', 50 + col1Width + col2Width, y)
                .text('Contrato', 50 + col1Width + col2Width + col3Width, y)
                .text('Paquete', 50 + col1Width + col2Width + col3Width + col4Width, y);
            doc.moveTo(50, y + 15).lineTo(550, y + 15).stroke(); // Underline headers
        };

        // Add initial table headers on the first page
        addTableHeaders(tableTop);

        // Add payroll details in table format
        let yPosition = tableTop + 25; // Start below the headers
        payrollDetails.forEach((payrollDetail, index) => {
            if (yPosition + rowHeight > doc.page.height - 50) {
                doc.addPage(); // Add new page if content exceeds the page height
                yPosition = 50; // Reset Y position for new page, accounting for top margin

                // Add table headers on the new page
                addTableHeaders(yPosition);
                yPosition += 25; // Move below the headers
            }

            doc
                .fontSize(10)
                .font('Helvetica')
                .text(`$${payrollDetail.monto}`, 50, yPosition)
                .text(`${payrollDetail.tipo === 'C' ? 'Cobro' : 'Venta'}`, 50 + col1Width, yPosition)
                .text(`${moment(payrollDetail.fecha_hora).format('DD/MM/YYYY')}`, 50 + col1Width + col2Width, yPosition)
                .text(`${payrollDetail.idContrato}`, 50 + col1Width + col2Width + col3Width, yPosition)
                .text(`${payrollDetail.paquete || ''}`, 50 + col1Width + col2Width + col3Width + col4Width, yPosition);

            yPosition += rowHeight; // Move to next row
        });

        // Add footer at the end
        const addFooter = () => {
            const y = doc.page.height - 100; // Posición vertical para las firmas

            // Firma del empleado a la izquierda
            doc
                .font('Helvetica-Bold')
                .fontSize(10)
                .text('Firma del empleado:', 50, y, { align: 'left' })
                .text('____________________________', 50, y + 30, { align: 'left' });

            // Firma de la empresa a la derecha
            const firmaEmpresaText = 'Firma de la empresa:';
            const firmaEmpresaWidth = doc.widthOfString(firmaEmpresaText); // Ancho del texto
            const firmaX = doc.page.width - 50 - firmaEmpresaWidth; // X position para alinear a la derecha
            const firmaY = y; // Misma línea vertical que la firma del empleado

            doc
                .fontSize(10)
                .text(firmaEmpresaText, firmaX, firmaY, { align: 'right' })
                .text('____________________________', firmaX - 70, firmaY + 30, { align: 'right' });
        };

        addFooter();

        // Finalize the PDF
        doc.end();
    } catch (error) {
        next(error);
    }
};

const getPayrollsByEmployee = async (req, res, next) => {
    const { id } = req.params;
    try {
        const payrolls = await payrollsService.getPayrollsByEmployee(id)
        res.status(200).json(payrolls)
    } catch (error) {
        next(error);
    }
}

const getPayrollById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const payroll = await payrollsService.getPayrollById(id)
        res.status(200).json(payroll)
    } catch (error) {
        next(error);
    }
}

const getPayrollDetailsById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const payrollDetails = await payrollsService.getPayrollDetailsById(id)
        let payrollDetailsWithPacksName = [];
        let packs = await packsService.getPacks();
        payrollDetails.forEach(payrollDetail => {
            payrollDetailsWithPacksName.push({
                ...payrollDetail,
                paquete: packs.find(pack => parseInt(pack.id) === parseInt(payrollDetail.idPaquete))?.nombrePaquete
            })
        })
        res.status(200).json(payrollDetailsWithPacksName)
    } catch (error) {
        next(error);
    }
}

const simulatePayroll = async (req, res, next) => {
    const { idEmpleado } = req.body;
    try {
        const employee = await employeesService.getEmployee(idEmpleado);
        if (!employee) errors.notFoundError('Empleado no encontrado', 'EMPLOYEE_NOT_FOUND')
        if (!employee.perfilNomina) errors.notFoundError('Perfil de nómina no encontrado', 'PAYROLL_PROFILE_NOT_FOUND')
        const packs = await packsService.getPacks();

        const payrollProfile = await payrollProfilesService.getPayrollProfile(parseInt(employee.perfilNomina));
        let unproccesedPayrolls = []
        const lastPayment = employee.ultimoPago;

        unproccesedPayrolls = await payrollsService.getUnprocessedPayrolls(idEmpleado);

        const period = payrollProfile.periodicidad;
        const salary = payrollProfile.sueldoBase;
        let totalSalary = 0;
        let total = 0;
        let totalComission = 0;

        if (lastPayment) {
            const lastPaymentDate = new Date(lastPayment);
            const currentDate = new Date();
            const diffTime = Math.abs(currentDate - lastPaymentDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (period === 'D') {
                totalSalary = salary * diffDays;
            } else if (period === 'S') {
                totalSalary = salary * (diffDays / 7);
            } else if (period === 'C') {
                totalSalary = salary * (diffDays / 14);
            } else if (period === 'Q') {
                totalSalary = salary * (diffDays / 15);
            } else if (period === 'M') {
                //if diffDays is less than 30, then calculate the salary based on the days
                if (diffDays < 30) {
                    totalSalary = salary * (diffDays / 30);
                } else {
                    totalSalary = salary * (diffDays / 30);
                }
            }
        } else {
            totalSalary = salary;
        }

        totalSalary = parseFloat(totalSalary);

        totalComission = unproccesedPayrolls.reduce((acc, payroll) => {
            return acc + parseFloat(payroll.monto);
        }, 0);

        total = totalSalary + totalComission;

        const payroll = {
            idEmpleado: parseInt(idEmpleado),
            nombreEmpleado: employee.nombre,
            fecha: new Date(),
            fechaAnterior: lastPayment,
            total,
            totalSalary: totalSalary,
            totalComission: totalComission,
            periodicidad: period,
            detail: null
        }

        let payrollDetails = [];
        let i = 1;
        unproccesedPayrolls.forEach(payrollDetail => {
            payrollDetails.push({
                ordinal: i,
                monto: payrollDetail.monto,
                tipo: payrollDetail.tipo,
                fecha_hora: payrollDetail.fecha_hora,
                idContrato: payrollDetail.idContrato,
                idPaquete: payrollDetail.idPaquete,
                paquete: packs.find(pack => parseInt(pack.id) === parseInt(payrollDetail.idPaquete))?.nombrePaquete
            })
            i++;
        });

        payroll.detail = payrollDetails;

        res.status(200).json(payroll)
    } catch (error) {
        next(error);
    }
}

const createPayroll = async (req, res, next) => {
    try {
        const { idEmpleado } = req.body;

        const employee = await employeesService.getEmployee(idEmpleado);
        if (!employee) errors.notFoundError('Empleado no encontrado', 'EMPLOYEE_NOT_FOUND')
        if (!employee.perfilNomina) errors.notFoundError('Perfil de nómina no encontrado', 'PAYROLL_PROFILE_NOT_FOUND')

        const payrollProfile = await payrollProfilesService.getPayrollProfile(parseInt(employee.perfilNomina));
        let unproccesedPayrolls = []
        const lastPayment = employee.ultimoPago;

        unproccesedPayrolls = await payrollsService.getUnprocessedPayrolls(idEmpleado);

        const period = payrollProfile.periodicidad;
        const salary = payrollProfile.sueldoBase;
        let totalSalary = 0;
        let total = 0;
        let totalComission = 0;

        if (lastPayment) {
            const lastPaymentDate = new Date(lastPayment);
            const currentDate = new Date();
            const diffTime = Math.abs(currentDate - lastPaymentDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (period === 'D') {
                totalSalary = salary * diffDays;
            } else if (period === 'S') {
                totalSalary = salary * (diffDays / 7);
            } else if (period === 'C') {
                totalSalary = salary * (diffDays / 14);
            } else if (period === 'Q') {
                totalSalary = salary * (diffDays / 15);
            } else if (period === 'M') {
                //if diffDays is less than 30, then calculate the salary based on the days
                if (diffDays < 30) {
                    totalSalary = salary * (diffDays / 30);
                } else {
                    totalSalary = salary * (diffDays / 30);
                }
            }
        } else {
            totalSalary = salary;
        }
        totalSalary = parseFloat(totalSalary);

        totalComission = unproccesedPayrolls.reduce((acc, payroll) => {
            return acc + parseFloat(payroll.monto);
        }, 0);

        total = totalSalary + totalComission;

        const payroll = {
            idEmpleado: parseInt(idEmpleado),
            fecha: new Date(),
            fechaAnterior: lastPayment,
            total,
            periodicidad: period,
        }

        const newPayroll = await payrollsService.createPayroll(payroll)

        let payrollDetails = [];
        let i = 1;
        unproccesedPayrolls.forEach(payrollDetail => {
            payrollDetails.push({
                id_nomina: newPayroll.id,
                ordinal: i,
                monto: payrollDetail.monto,
                tipo: payrollDetail.tipo,
                fecha_hora: payrollDetail.fecha_hora,
                idContrato: payrollDetail.idContrato,
                idPaquete: payrollDetail.idPaquete
            })
            i++;
        });

        await payrollsService.createPayrollDetail(payrollDetails)

        //Update employee last payment
        let newEmployee = {
            ...employee,
            ultimoPago: new Date()
        }

        await employeesService.updateEmployee(idEmpleado, newEmployee)
        const unproccesedPayrollsIds = unproccesedPayrolls.map(payroll => payroll.id);
        await payrollsService.updatePayrollsToProcessed(unproccesedPayrollsIds);

        res.status(200).json(newPayroll)
    } catch (error) {
        next(error);
    }
}

const payrollsController = {
    createPayrollEmployeeDetail,
    getPayrollDetailsByEmployeeSinceDate,
    getPayrollDetailsById,
    getPayrollById,
    createPayroll,
    getPayrollsByEmployee,
    simulatePayroll,
    generatePayrollPDF
}

module.exports = payrollsController;