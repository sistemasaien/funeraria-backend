const { PrismaClient } = require('@prisma/client')
const errors = require('../helpers/errors')
const { getPaymentsForMassivePayment } = require('../controllers/payments')
const prisma = new PrismaClient()

const getSales = async () => {
    try {
        const sales = await prisma.ventas.findMany()
        return sales
    } catch (error) {
        errors.conflictError('Error al obtener las ventas', 'GET_SALES_DB', error)
    }
}

const getCompleteSales = async () => {
    try {
        const sales = await prisma.$queryRaw`SELECT v.id, c.nombre as cliente, v.idCliente, v.idContrato, v.estado, e.nombre as asesor, e2.nombre as cobrador, v.metodoPago, v.fechaLiquidacion, v.recorrido, co.estado as estadoContrato FROM ventas v
        LEFT JOIN clientes c ON v.idCliente = c.id 
        LEFT JOIN empleados e ON v.asesor = e.id
        LEFT JOIN empleados e2 ON v.cobrador = e2.id
        LEFT JOIN contratos co ON v.idContrato = co.id`
        return sales
    } catch (error) {
        errors.conflictError('Error al obtener las ventas', 'GET_COMPLETE_SALES_DB', error)
    }
}

const getSale = async (id) => {
    try {
        const sale = await prisma.ventas.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        return sale
    } catch (error) {
        errors.conflictError('Error al obtener la venta', 'GET_SALE_DB', error)
    }
}

const createSale = async (sale) => {
    try {
        const newSale = await prisma.ventas.create({
            data: sale
        })
        return newSale
    } catch (error) {
        errors.conflictError('Error al crear la venta', 'CREATE_SALE_DB', error)
    }
}

const updateSale = async (id, sale) => {
    try {
        const updatedSale = await prisma.ventas.update({
            where: {
                id: parseInt(id)
            },
            data: sale
        })
        return updatedSale
    } catch (error) {
        errors.conflictError('Error al actualizar la venta', 'UPDATE_SALE_DB', error)
    }
}

const deleteSale = async (id) => {
    try {
        const deletedSale = await prisma.ventas.delete({
            where: {
                id: parseInt(id)
            }
        })
        return deletedSale
    } catch (error) {
        errors.conflictError('Error al eliminar la venta', 'DELETE_SALE_DB', error)
    }
}

const updateSalesWithWay = async ({ way, ids }) => {
    try {
        const response = await prisma.ventas.updateMany({
            where: {
                id: {
                    in: ids.map(id => parseInt(id))
                }
            },
            data: {
                recorrido: parseInt(way)
            }
        })
        return response
    } catch (error) {
        errors.conflictError('Error al actualizar la ruta de las ventas', 'UPDATE_SALES_WAY_DB', error)
    }
}

const updateDataForCompleteSale = async ({ request, finance, deceased, ceremony, beneficiary, inmediate, contract }) => {
    //Paso 9: Actualizar solicitud, financiamientos, y si es inmediato: fallecidos y ceremonias y si no es inmediato: beneficiarios con el id del contrato
    let transaction;
    try {
        transaction = await prisma.$transaction(async (prismaClient) => {
            await prismaClient.solicitudes.update({
                where: {
                    id: request.id
                },
                data: {
                    idContrato: contract.id
                }
            })
            await prismaClient.financiamientos.update({
                where: {
                    id: finance.id
                },
                data: {
                    idContrato: contract.id
                }
            })
            if (inmediate) {
                await prismaClient.fallecidos.update({
                    where: {
                        id: deceased.id
                    },
                    data: {
                        idContrato: contract.id
                    }
                })
                await prismaClient.ceremonias.update({
                    where: {
                        id: ceremony.id
                    },
                    data: {
                        idContrato: contract.id
                    }
                })
            } else {
                await prismaClient.beneficiarios.update({
                    where: {
                        id: beneficiary.id
                    },
                    data: {
                        idContrato: contract.id
                    }
                })
            }
        })
        await prisma.$queryRaw`COMMIT`
    } catch (error) {
        if (transaction) {
            await transaction.$queryRaw`ROLLBACK`;
        }
        errors.conflictError('Error al actualizar el contrato para la venta', 'UPDATE_CONTRACT_COMPLETE_SALE_DB', error)
    }
}

const updateDataForCompleteSaleAfterInmediate = async ({ createdSale, oldData }) => {
    let { request, finance, deceased, ceremony, contract } = createdSale
    let transaction;
    try {
        transaction = await prisma.$transaction(async (prismaClient) => {
            await prismaClient.solicitudes.update({
                where: {
                    id: request.id
                },
                data: {
                    idContrato: contract.id
                }
            })
            await prismaClient.financiamientos.update({
                where: {
                    id: finance.id
                },
                data: {
                    idContrato: contract.id
                }
            })
            await prismaClient.fallecidos.update({
                where: {
                    id: deceased.id
                },
                data: {
                    idContrato: contract.id
                }
            })
            await prismaClient.ceremonias.update({
                where: {
                    id: ceremony.id
                },
                data: {
                    idContrato: contract.id
                }
            })
            await prismaClient.financiamientos.update({
                where: {
                    id: oldData.idFinanciamiento
                },
                data: {
                    activo: 'NO'
                }
            })
            await prismaClient.contratos.update({
                where: {
                    id: oldData.idContrato
                },
                data: {
                    estado: 'Cerrado por uso inmediato',
                    contratoRelacionado: `${contract.id}`
                }
            })
            await prismaClient.ventas.update({
                where: {
                    id: oldData.idVenta
                },
                data: {
                    estado: 'Realizada'
                }
            })
        },
            {
                maxWait: 5000,
                timeout: 10000,
                isolationLevel: 'serializable'
            }
        )
        await prisma.$queryRaw`COMMIT`
    } catch (error) {
        if (transaction) {
            await transaction.$queryRaw`ROLLBACK`;
        }
        errors.conflictError('Error al actualizar el contrato para la venta', 'UPDATE_CONTRACT_COMPLETE_SALE_DB', error)
    }
}

const createCompleteSaleWithTransaction = async (data) => {
    let transaction;
    let createdCompleteSale = null;
    try {
        transaction = await prisma.$transaction(async (prismaClient) => {
            //Paso 1: crear cliente si no existe
            let createdClient;
            if (!data.validateClient) {
                createdClient = await prismaClient.clientes.create({
                    data: data.client
                })
                data.finance.idCliente = createdClient.id
            }
            //Paso 2: crear servicio
            let createdService = await prismaClient.servicios.create({
                data: data.service
            })
            //Paso 3: crear financiamiento
            data.finance.idCliente = createdClient?.id || data.client.id || 0
            let createdFinance = await prismaClient.financiamientos.create({
                data: data.finance
            })
            let createdDeceased = null;
            let createdCeremony = null;
            let createdBeneficiary = null;
            //Paso 4: Si es de uso inmediato, crear difunto y ceremonia, en caso contrario, crear beneficiario
            if (data.inmediate) {
                createdDeceased = await prismaClient.fallecidos.create({
                    data: data.deceased
                })
                data.ceremony.idFallecido = createdDeceased.id
                createdCeremony = await prismaClient.ceremonias.create({
                    data: data.ceremony
                })
            } else {
                createdBeneficiary = await prismaClient.beneficiarios.create({
                    data: data.beneficiary
                })
            }
            //Paso 5: crear solicitud
            data.request.idServicio = createdService.id
            data.request.idFallecido = createdDeceased?.id || 0
            data.request.idCeremonia = createdCeremony?.id || 0
            data.request.idBeneficiario = createdBeneficiary?.id || 0
            data.request.idCliente = createdClient?.id || data.client.id || 0
            let createdRequest = await prismaClient.solicitudes.create({
                data: data.request
            })
            //Paso 6: crear contrato
            data.contract.idSolicitud = createdRequest.id
            data.contract.idFinanciamiento = createdFinance.id
            data.contract.idCliente = createdClient?.id || data.client.id
            let createdContract = await prismaClient.contratos.create({
                data: data.contract
            })
            //Paso 7: crear venta
            data.sale.idContrato = createdContract.id
            data.sale.idCliente = createdClient?.id || data.client.id
            data.sale.idFinanciamiento = createdFinance.id
            data.sale.idSolicitud = createdRequest.id
            let createdSale = await prismaClient.ventas.create({
                data: data.sale
            })
            //Paso 8: crear los pagos
            data.massivePayment.idFinanciamiento = createdFinance.id
            let paymentsToCreate = getPaymentsForMassivePayment(data.massivePayment)
            let createdPayments = await prismaClient.cobranzas.createMany({
                data: paymentsToCreate.payments
            })

            //Paso 9: crear recorrido de venta
            let createdSalesWay = null
            if (data.sale?.recorrido) {
                let lastOrder = await prismaClient.recorridos_ventas.findFirst({
                    where: {
                        idRecorrido: parseInt(data.sale?.recorrido)
                    },
                    orderBy: {
                        orden: 'desc'
                    }
                })
                lastOrder = lastOrder?.orden || 0
                lastOrder = parseInt(lastOrder) + 1
                await prismaClient.recorridos_ventas.deleteMany({
                    where: {
                        idVenta: createdSale.id
                    }
                })
                createdSalesWay = await prismaClient.recorridos_ventas.create({
                    data: {
                        idVenta: createdSale.id,
                        idRecorrido: data.sale?.recorrido,
                        orden: lastOrder
                    }
                })
            }

            createdCompleteSale = {
                sale: createdSale,
                client: createdClient,
                service: createdService,
                finance: createdFinance,
                deceased: createdDeceased,
                ceremony: createdCeremony,
                beneficiary: createdBeneficiary,
                request: createdRequest,
                contract: createdContract,
                payments: createdPayments,
                salesWays: createdSalesWay
            }
        },
            {
                maxWait: 5000,
                timeout: 10000,
                isolationLevel: 'serializable'
            }
        )
        await prisma.$queryRaw`COMMIT`
        return createdCompleteSale
    } catch (error) {
        if (transaction) {
            await transaction.$queryRaw`ROLLBACK`;
        }
        errors.conflictError('Error al crear la venta', 'CREATE_COMPLETE_SALE_DB', error)
    }
}

const createCompleteSaleAfterInmediateWithTransaction = async (data) => {
    let transaction;
    let createdCompleteSale = null;
    try {
        transaction = await prisma.$transaction(async (prismaClient) => {
            //Paso 1: crear servicio
            let createdService = await prismaClient.servicios.create({
                data: data.service
            })
            //Paso 2: crear financiamiento
            let createdFinance = await prismaClient.financiamientos.create({
                data: data.finance
            })
            let createdDeceased = null;
            let createdCeremony = null;
            //Paso 3: Crear difunto y ceremonia
            createdDeceased = await prismaClient.fallecidos.create({
                data: data.deceased
            })
            data.ceremony.idFallecido = createdDeceased.id
            createdCeremony = await prismaClient.ceremonias.create({
                data: data.ceremony
            })
            //Paso 5: crear solicitud
            data.request.idServicio = createdService.id
            data.request.idFallecido = createdDeceased?.id || 0
            data.request.idCeremonia = createdCeremony?.id || 0
            data.request.idBeneficiario = 0
            let createdRequest = await prismaClient.solicitudes.create({
                data: data.request
            })
            //Paso 6: crear contrato
            data.contract.idSolicitud = createdRequest.id
            data.contract.idFinanciamiento = createdFinance.id
            let createdContract = await prismaClient.contratos.create({
                data: data.contract
            })
            //Paso 7: crear venta
            data.sale.idContrato = createdContract.id
            data.sale.idFinanciamiento = createdFinance.id
            data.sale.idSolicitud = createdRequest.id
            let createdSale = await prismaClient.ventas.create({
                data: data.sale
            })
            //Paso 8: crear los pagos
            data.massivePayment.idFinanciamiento = createdFinance.id
            let paymentsToCreate = getPaymentsForMassivePayment(data.massivePayment)
            let createdPayments = await prismaClient.cobranzas.createMany({
                data: paymentsToCreate.payments
            })

            //Paso 9: crear recorrido de venta
            let createdSalesWay = null
            if (data.sale?.recorrido) {
                let lastOrder = await prismaClient.recorridos_ventas.findFirst({
                    where: {
                        idRecorrido: parseInt(data.sale?.recorrido)
                    },
                    orderBy: {
                        orden: 'desc'
                    }
                })
                lastOrder = lastOrder?.orden || 0
                lastOrder = parseInt(lastOrder) + 1
                await prismaClient.recorridos_ventas.deleteMany({
                    where: {
                        idVenta: createdSale.id
                    }
                })
                createdSalesWay = await prismaClient.recorridos_ventas.create({
                    data: {
                        idVenta: createdSale.id,
                        idRecorrido: data.sale?.recorrido,
                        orden: lastOrder
                    }
                })
            }

            createdCompleteSale = {
                sale: createdSale,
                service: createdService,
                finance: createdFinance,
                deceased: createdDeceased,
                ceremony: createdCeremony,
                request: createdRequest,
                contract: createdContract,
                payments: createdPayments,
                salesWays: createdSalesWay
            }
        },
            {
                maxWait: 5000,
                timeout: 10000,
                isolationLevel: 'serializable'
            }
        )
        await prisma.$queryRaw`COMMIT`
        return createdCompleteSale
    } catch (error) {
        if (transaction) {
            await transaction.$queryRaw`ROLLBACK`;
        }
        errors.conflictError('Error al crear la venta inmediata', 'CREATE_COMPLETE_AFTER_INMEDIATE_SALE_DB', error)
    }
}

const updateCompleteSaleWithTransaction = async (data) => {
    let transaction;
    let updatedCompleteSale = null;
    try {
        transaction = await prisma.$transaction(async (prismaClient) => {
            //Paso 1: actualizar la venta
            let updatedCashPayments = null;
            let updatedBeneficiary = null;
            let updatedDeceased = null;
            let updatedCeremony = null;
            let updatedPayments = null;
            let updatedSale = await prismaClient.ventas.update({
                where: {
                    id: parseInt(data.sale.id)
                },
                data: data.sale
            })
            //Paso 2: si es contado actualizar el financiamiento
            if (data.sale.metodoPago === 'Contado') {
                updatedCashPayments = await prisma.$queryRaw`UPDATE cobranzas SET fecha = '${data.finance.fechaPrimerCuota}' WHERE idFinanciamiento = ${data.contract.idFinanciamiento} AND tipo = 'Contado'`;
            }
            //Paso 3: si el contrato es de tipo programado, actualizar el beneficiario, si no el fallecido y la ceremonia
            if (data.contract.tipo === 'Programado') {
                updatedBeneficiary = await prismaClient.beneficiarios.update({
                    where: {
                        id: data.beneficiary.id
                    },
                    data: data.beneficiary
                })
            } else {
                updatedDeceased = await prismaClient.fallecidos.update({
                    where: {
                        id: data.deceased.id
                    },
                    data: data.deceased
                })
                updatedCeremony = await prismaClient.ceremonias.update({
                    where: {
                        id: data.ceremony.id
                    },
                    data: data.ceremony
                })
            }

            //Paso 4: actualizar el contrato
            let updatedContract = await prismaClient.contratos.update({
                where: {
                    id: parseInt(data.contract.id)
                },
                data: data.contract
            })

            //Paso 5: actualizar servicio
            let updatedService = await prismaClient.servicios.update({
                where: {
                    id: parseInt(data.service.id)
                },
                data: data.service
            })

            let financeData = { ...data.finance }
            delete financeData.updateAvailable
            delete financeData.id
            //Paso 6: actualizar el financiamiento
            let updatedFinance = await prismaClient.financiamientos.update({
                where: {
                    id: parseInt(data.finance.id)
                },
                data: financeData
            })

            //Paso 7: crear los pagos si tiene updateAvailable en finance
            if (data.finance.updateAvailable) {
                let paymentsToCreate = getPaymentsForMassivePayment(data.massivePayment)
                updatedPayments = await prismaClient.cobranzas.createMany({
                    data: paymentsToCreate.payments
                })
            }

            //Paso 8: crear recorrido de venta
            let updatedSalesWay = null
            if (data.sale?.recorrido) {
                let lastOrder = await prismaClient.recorridos_ventas.findFirst({
                    where: {
                        idRecorrido: parseInt(data.sale?.recorrido)
                    },
                    orderBy: {
                        orden: 'desc'
                    }
                })
                lastOrder = lastOrder?.orden || 0
                lastOrder = parseInt(lastOrder) + 1
                await prismaClient.recorridos_ventas.deleteMany({
                    where: {
                        idVenta: data.sale.id
                    }
                })
                updatedSalesWay = await prismaClient.recorridos_ventas.create({
                    data: {
                        idVenta: data.sale.id,
                        idRecorrido: data.sale?.recorrido,
                        orden: lastOrder
                    }
                })
            }

            updatedCompleteSale = {
                sale: updatedSale,
                service: updatedService,
                finance: updatedFinance,
                deceased: updatedDeceased,
                ceremony: updatedCeremony,
                beneficiary: updatedBeneficiary,
                contract: updatedContract,
                payments: updatedPayments,
                salesWays: updatedSalesWay,
                cashPayments: updatedCashPayments
            }
        },
            {
                maxWait: 5000,
                timeout: 10000,
                isolationLevel: 'serializable'
            }
        )
        await prisma.$queryRaw`COMMIT`
        return updatedCompleteSale
    } catch (error) {
        if (transaction) {
            await transaction.$queryRaw`ROLLBACK`;
        }
        errors.conflictError('Error al actualizar la venta', 'UPDATE_COMPLETE_SALE_DB', error)
    }
}

const salesService = {
    getSales,
    getCompleteSales,
    getSale,
    createSale,
    updateSale,
    deleteSale,
    updateSalesWithWay,
    createCompleteSaleWithTransaction,
    updateDataForCompleteSale,
    createCompleteSaleAfterInmediateWithTransaction,
    updateDataForCompleteSaleAfterInmediate,
    updateCompleteSaleWithTransaction
}

module.exports = salesService