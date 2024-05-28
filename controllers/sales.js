const { addDays, formatDate, formatDDMMYYYYtoYYYYMMDD } = require('../utils/dateUtils')
const salesService = require('../services/sales')
const errors = require('../helpers/errors')
const saleSchema = require('../schemas/sale')
const validateSchema = require('../helpers/validate');
const clientsService = require('../services/clients');
const contractsService = require('../services/contracts');
const financingsService = require('../services/financings');
const requestsService = require('../services/requests');
const servicesService = require('../services/services');
const beneficiariesService = require('../services/beneficiaries');
const deceasedsService = require('../services/deceaseds');
const ceremoniesService = require('../services/ceremonies');
const packsService = require('../services/packs');
const dayJS = require('dayjs');

const getCompleteSales = async (req, res, next) => {
    try {
        const sales = await salesService.getCompleteSales()
        res.status(200).json(sales)
    } catch (error) {
        next(error);
    }
}

const getSales = async (req, res, next) => {
    try {
        const sales = await salesService.getSales()
        res.status(200).json(sales)
    } catch (error) {
        next(error);
    }
}

const getSale = async (req, res, next) => {
    const { id } = req.params;
    try {
        const sale = await salesService.getSale(id)
        if (!sale) {
            errors.notFoundError('Venta no encontrada', 'SALE_NOT_FOUND')
        }
        res.status(200).json(sale)
    } catch (error) {
        next(error);
    }
}

const updateSale = async (req, res, next) => {
    try {
        await validateSchema(saleSchema, req.body)
        const { id, idCliente, idContrato, idSolicitud, idFinanciamiento, estado, asesor, cobrador, metodoPago, fechaLiquidacion } = req.body;
        const sale = { id, idCliente, idContrato, idSolicitud, idFinanciamiento, estado, asesor, cobrador, metodoPago, fechaLiquidacion };
        const saleToUpdate = await salesService.getSale(id)
        if (!saleToUpdate) {
            errors.notFoundError('Venta no encontrada', 'SALE_NOT_FOUND')
        }
        const updatedSale = await salesService.updateSale(id, sale)
        res.status(200).json(updatedSale)
    } catch (error) {
        next(error);
    }
}

const createSale = async (req, res, next) => {
    try {
        await validateSchema(saleSchema, req.body)
        const { idCliente, idContrato, idSolicitud, idFinanciamiento, estado, asesor, cobrador, metodoPago, fechaLiquidacion } = req.body;
        const sale = { idCliente, idContrato, idSolicitud, idFinanciamiento, estado, asesor, cobrador, metodoPago, fechaLiquidacion };
        const newSale = await salesService.createSale(sale)
        res.status(200).json(newSale)
    } catch (error) {
        next(error);
    }
}

const deleteSale = async (req, res, next) => {
    const { id } = req.body;
    try {
        const saleToDelete = await salesService.getSale(id)
        if (!saleToDelete) {
            errors.notFoundError('Venta no encontrada', 'SALE_NOT_FOUND')
        }
        const deletedSale = await salesService.deleteSale(id)
        res.status(200).json(deletedSale)
    } catch (error) {
        next(error);
    }
}

const updateSalesWithWay = async (req, res, next) => {
    try {
        const { ids, way } = req.body;
        let salesUpdated = await salesService.updateSalesWithWay({ ids, way })
        res.status(200).json(salesUpdated)
    } catch (error) {
        next(error);
    }
}

const createCompleteSale = async (req, res, next) => {
    try {
        let { finance, client, service, sale, inmediate, beneficiary, deceased, ceremony, contract, validateClient } = req.body;
        let { platform } = req.query;
        let idPaquete = 0;
        if (platform === 'mobile') {
            let package = await packsService.getPackByName(contract?.paquete);
            if (!package) {
                errors.notFoundError('Paquete no encontrado', 'PACKAGE_NOT_FOUND')
            } else {
                idPaquete = package.id;
            }
        } else {
            idPaquete = parseInt(contract?.idPaquete);
        }
        let fechaPrimerCuota = null;
        if (platform === 'mobile') {
            fechaPrimerCuota = dayJS(formatDDMMYYYYtoYYYYMMDD(finance?.fechaPrimerCuota)).format();
        } else {
            fechaPrimerCuota = finance?.fechaPrimerCuota ? new Date(finance?.fechaPrimerCuota) : new Date();
        }

        let nroCuotas = 0;
        let importeTotal = parseInt(finance?.precioBase) || 0;
        let importeServicios = 0;
        importeServicios += parseInt(service?.embalsamado) || 0;
        importeServicios += parseInt(service?.urna) || 0;
        importeServicios += parseInt(service?.especial) || 0;
        importeServicios += parseInt(service?.encapsulado) || 0;
        importeServicios += parseInt(service?.nocheAdicional) || 0;
        importeServicios += parseInt(service?.cremacion) || 0;
        importeServicios += parseInt(service?.extra) || 0;
        importeTotal += importeServicios;
        let importeCuota = parseInt(finance?.importeCuota) || 0;
        let enganche = parseInt(finance?.enganche) || 0;
        let bonificacion = parseInt(finance?.bonificacion) || 0;
        let adelanto = parseInt(finance?.adelanto) || 0;
        let importeAFinanciar = importeTotal - enganche - bonificacion - adelanto;
        let resto = importeAFinanciar % importeCuota;
        let nroCuotasBase = (importeAFinanciar - resto) / importeCuota;
        let montoUltimaCuota = resto;
        if (sale?.metodoPago === 'Contado') {
            nroCuotas = 1;
            importeCuota = importeAFinanciar;
            montoUltimaCuota = 0;
        } else {
            if (finance?.tipoCobro === 'P' || finance?.tipoCobro === 'Plazo' || !finance?.tipoCobro) {
                nroCuotas = parseInt(finance?.numeroPagos);
                //rounded importe cuota
                importeCuota = Math.round(importeAFinanciar / nroCuotas);
                if (importeCuota * nroCuotas > importeAFinanciar) {
                    montoUltimaCuota = (importeCuota * nroCuotas - importeAFinanciar) + importeCuota;
                } else {
                    montoUltimaCuota = (importeAFinanciar - importeCuota * nroCuotas) + importeCuota;
                }
            } else {
                if (resto > 0) {
                    nroCuotas = nroCuotasBase + 1;
                } else {
                    nroCuotas = nroCuotasBase;
                }
            }
        }

        let fechaUltimaCuota = addDays(fechaPrimerCuota || new Date(), nroCuotas * finance?.periodo);
        fechaUltimaCuota = new Date(fechaUltimaCuota);
        if (validateClient) {
            let clientExists = await clientsService.getClient(client?.id);
            if (!clientExists) {
                errors.notFoundError('Cliente no encontrado', 'CLIENT_NOT_FOUND')
            }
        }
        let data = req.body;
        //Ajustes de datos a enviar
        //Financiamiento
        data.finance.medioPago = sale?.metodoPago || 'Crédito';
        data.finance.montoFinanciado = importeAFinanciar;
        data.finance.numeroPagos = nroCuotas;
        data.finance.importePendiente = importeAFinanciar;
        data.finance.fechaPrimerCuota = fechaPrimerCuota;
        data.finance.importeTotal = importeTotal;
        data.finance.fechaUltimaCuota = fechaUltimaCuota;
        data.finance.adelanto = adelanto;
        data.finance.importeCuota = importeCuota;
        data.finance.idContrato = 0;
        data.finance.activo = 'SI';
        delete data.finance.tipoCobro;
        //Ceremonia
        data.ceremony.idContrato = 0;
        //Fallecido
        data.deceased.idContrato = 0;
        //Beneficiario
        data.beneficiary.idContrato = 0;
        //Solicitud
        data.request = {};
        data.request.tipo = inmediate ? 'Inmediato' : 'Programado';
        data.request.idPaquete = idPaquete;
        data.request.idContrato = 0;
        //Contrato
        data.contract.fecha = dayJS(formatDDMMYYYYtoYYYYMMDD(contract?.fecha)).format();
        data.contract.tipo = inmediate ? 'Inmediato' : 'Programado';
        data.contract.estado = 'Vigente';
        data.contract.idPaquete = idPaquete;
        data.contract.asesor = `${sale?.asesor}`;
        if (platform === 'mobile') {
            delete data.contract.paquete;
        }
        //Venta
        data.sale.estado = 'Vigente';
        data.sale.fechaLiquidacion = sale?.metodoPago === 'Contado' ? fechaPrimerCuota : fechaUltimaCuota;
        data.sale.metodoPago = sale?.metodoPago || 'Crédito';
        data.sale.asesor = `${sale?.asesor}`;
        //Pagos
        data.massivePayment = {}
        data.massivePayment.nroCuotas = nroCuotas;
        data.massivePayment.importeCuota = importeCuota;
        data.massivePayment.enganche = enganche;
        data.massivePayment.fechaPrimerCuota = fechaPrimerCuota || new Date();
        data.massivePayment.periodo = finance?.periodo;
        data.massivePayment.montoUltimaCuota = montoUltimaCuota;
        data.massivePayment.adelanto = adelanto;

        data.massivePayment.tipo = sale?.metodoPago === 'Contado' ? 'Contado' : 'Crédito';
        //Fechas si es mobile
        if (platform === 'mobile') {
            data.deceased.fechaDefuncion = data.deceased.fechaDefuncion ? dayJS(formatDDMMYYYYtoYYYYMMDD(deceased?.fechaDefuncion)).format() : null;
            data.deceased.fechaNacimiento = data.deceased.fechaNacimiento ? dayJS(formatDDMMYYYYtoYYYYMMDD(deceased?.fechaNacimiento)).format() : null;
            data.ceremony.diaMisa = data.ceremony.diaMisa ? dayJS(formatDDMMYYYYtoYYYYMMDD(ceremony?.diaMisa)).format() : null;
            data.ceremony.fecha = data.ceremony.fecha ? dayJS(formatDDMMYYYYtoYYYYMMDD(ceremony?.fecha)).format() : null;
            data.massivePayment.fechaInicio = contract?.fecha ? dayJS(formatDDMMYYYYtoYYYYMMDD(contract?.fecha)).format() : null;
            data.beneficiary.fechaNacimiento = data.beneficiary.fechaNacimiento ? dayJS(formatDDMMYYYYtoYYYYMMDD(beneficiary?.fechaNacimiento)).format() : null;
            data.client.fechaNacimiento = data.client.fechaNacimiento ? dayJS(formatDDMMYYYYtoYYYYMMDD(client?.fechaNacimiento)).format() : null;
            delete data.ceremony.fecha;
        }

        let createdSale = await salesService.createCompleteSaleWithTransaction(data);
        let updateContractNumber = await salesService.updateDataForCompleteSale({ ...createdSale, inmediate });

        res.status(200).json({ success: true, message: 'Venta creada correctamente', createdSale });

    } catch (error) {
        next(error);
    }
}

const createCompleteSaleAfterInmediate = async (req, res, next) => {
    try {
        let { finance, service, sale, contract, oldData } = req.body;
        let nroCuotas = 0;
        let importeTotal = parseInt(finance?.precioBase) || 0;
        let importeServicios = 0;
        importeServicios += parseInt(service?.embalsamado) || 0;
        importeServicios += parseInt(service?.urna) || 0;
        importeServicios += parseInt(service?.especial) || 0;
        importeServicios += parseInt(service?.encapsulado) || 0;
        importeServicios += parseInt(service?.nocheAdicional) || 0;
        importeServicios += parseInt(service?.cremacion) || 0;
        importeServicios += parseInt(service?.extra) || 0;
        importeTotal += importeServicios;
        let importeCuota = parseInt(finance?.importeCuota) || 0;
        let enganche = parseInt(finance?.enganche) || 0;
        let bonificacion = parseInt(finance?.bonificacion) || 0;
        let adelanto = parseInt(finance?.adelanto) || 0;
        let importeAFinanciar = importeTotal - enganche - bonificacion - adelanto;
        let resto = importeAFinanciar % importeCuota;
        let nroCuotasBase = (importeAFinanciar - resto) / importeCuota;
        let montoUltimaCuota = resto;
        if (sale?.metodoPago === 'Contado') {
            nroCuotas = 1;
            importeCuota = importeAFinanciar;
            montoUltimaCuota = 0;
        } else {
            if (finance?.tipoCobro === 'P' || !finance?.tipoCobro) {
                nroCuotas = parseInt(finance?.numeroPagos);
                //rounded importe cuota
                importeCuota = Math.round(importeAFinanciar / nroCuotas);
                if (importeCuota * nroCuotas > importeAFinanciar) {
                    montoUltimaCuota = (importeCuota * nroCuotas - importeAFinanciar) + importeCuota;
                } else {
                    montoUltimaCuota = (importeAFinanciar - importeCuota * nroCuotas) + importeCuota;
                }
            } else {
                if (resto > 0) {
                    nroCuotas = nroCuotasBase + 1;
                } else {
                    nroCuotas = nroCuotasBase;
                }
            }
        }

        let fechaUltimaCuota = addDays(finance?.fechaPrimerCuota || new Date(), nroCuotas * finance?.periodo);
        fechaUltimaCuota = new Date(fechaUltimaCuota);
        let data = req.body;
        //Ajustes de datos a enviar
        //Financiamiento
        delete data.service.id;
        delete data.finance.id;
        data.finance.medioPago = sale?.metodoPago || 'Crédito';
        data.finance.montoFinanciado = importeAFinanciar;
        data.finance.numeroPagos = nroCuotas;
        data.finance.importePendiente = importeAFinanciar;
        data.finance.fechaPrimerCuota = new Date(finance?.fechaPrimerCuota);
        data.finance.importeTotal = importeTotal;
        data.finance.fechaUltimaCuota = fechaUltimaCuota;
        data.finance.adelanto = adelanto;
        data.finance.importeCuota = importeCuota;
        data.finance.activo = 'SI'
        data.finance.idCliente = oldData?.idCliente;
        delete data.finance.tipoCobro;
        //Ceremonia
        delete data.ceremony.id;
        data.ceremony.idContrato = 0;
        //Fallecido
        delete data.deceased.id;
        data.deceased.idContrato = 0;
        data.deceased.fechaDefuncion = new Date(data.deceased?.fechaDefuncion);
        //Solicitud
        data.request = {};
        data.request.tipo = 'Inmediato'
        data.request.idPaquete = parseInt(contract?.idPaquete);
        data.request.idContrato = 0;
        data.request.idCliente = oldData?.idCliente;
        //Contrato
        delete data.contract.id;
        data.contract.fecha = new Date(contract?.fecha);
        data.contract.tipo = 'Inmediato';
        data.contract.estado = 'Vigente';
        data.contract.idPaquete = parseInt(contract?.idPaquete);
        data.contract.asesor = `${sale?.asesor}`;
        data.contract.contratoRelacionado = `${sale?.idContrato}`;
        data.contract.idCliente = oldData?.idCliente;
        //Venta
        delete data.sale.id;
        data.sale.estado = 'Vigente';
        data.sale.fechaLiquidacion = sale?.metodoPago === 'Contado' ? new Date(finance?.fechaPrimerCuota) : fechaUltimaCuota;
        data.sale.metodoPago = sale?.metodoPago || 'Crédito';
        data.sale.asesor = `${sale?.asesor}`;
        data.sale.idCliente = oldData?.idCliente;
        //Pagos
        data.massivePayment = {}
        data.massivePayment.nroCuotas = nroCuotas;
        data.massivePayment.importeCuota = importeCuota;
        data.massivePayment.enganche = enganche;
        data.massivePayment.fechaPrimerCuota = new Date(finance?.fechaPrimerCuota) || new Date();
        data.massivePayment.periodo = finance?.periodo;
        data.massivePayment.montoUltimaCuota = montoUltimaCuota;
        data.massivePayment.adelanto = adelanto;
        data.massivePayment.fechaInicio = new Date(contract?.fecha);
        data.massivePayment.tipo = sale?.metodoPago === 'Contado' ? 'Contado' : 'Crédito';

        let createdSale = await salesService.createCompleteSaleAfterInmediateWithTransaction(data);
        let updateContractNumber = await salesService.updateDataForCompleteSaleAfterInmediate({ createdSale, oldData });
        res.status(200).json({ success: true, message: 'Venta creada correctamente', createdSale });

    } catch (error) {
        next(error);
    }
}

const getCompleteSale = async (req, res, next) => {
    const { id } = req.params;
    try {
        const completeSale = {}
        const sale = await salesService.getSale(id)
        if (!sale) {
            errors.notFoundError('Venta no encontrada', 'SALE_NOT_FOUND')
        }
        completeSale.sale = sale;
        const client = await clientsService.getClient(sale.idCliente);
        completeSale.client = client;
        const contract = await contractsService.getContract(sale.idContrato);
        completeSale.contract = contract;
        const financing = await financingsService.getFinancing(sale.idFinanciamiento);
        if (!financing?.numeroPagos && !financing?.importeCuota == 0 && (financing?.medioPago === 'Crédito' || financing?.medioPago === 'undefined')) {
            financing.updateAvailable = true;
        }
        completeSale.financing = financing;
        const request = await requestsService.getRequest(contract.idSolicitud);
        completeSale.request = request;
        const service = await servicesService.getService(request.idServicio);
        completeSale.service = service;
        let beneficiary = null;
        let deceased = null;
        let ceremony = null;
        if (contract.tipo === 'Programado') {
            beneficiary = await beneficiariesService.getBeneficiary(request.idBeneficiario);
            completeSale.beneficiary = beneficiary;
        } else {
            deceased = await deceasedsService.getDeceased(request.idFallecido);
            completeSale.deceased = deceased;
            ceremony = await ceremoniesService.getCeremony(request.idCeremonia);
            completeSale.ceremony = ceremony;
        }
        res.status(200).json(completeSale)
    } catch (error) {
        next(error);
    }
}


const updateCompleteSale = async (req, res, next) => {
    try {
        let { finance, client, service, sale, beneficiary, deceased, ceremony, contract } = req.body;
        let data = req.body;

        if (data.finance.updateAvailable) {
            if (!finance?.numeroPagos && !finance?.importeCuota && !finance === 'Contado') {
                data.finance.updateAvailable = false;
            }
        }

        let metodoPago = (sale?.metodoPago && sale?.metodoPago !== 'undefined') ? sale?.metodoPago : 'Crédito';

        //Ajustes de datos a enviar
        data.finance.fechaPrimerCuota = new Date(finance?.fechaPrimerCuota);
        data.finance.activo = 'SI'
        //Contrato
        data.contract.fecha = new Date(contract?.fecha);
        data.contract.idPaquete = parseInt(contract?.idPaquete);
        //Venta
        data.sale.fechaLiquidacion = metodoPago === 'Contado' ? new Date(data.finance?.fechaPrimerCuota) : new Date(data.finance?.fechaUltimaCuota);
        data.sale.metodoPago = metodoPago;
        //Fallecido
        data.deceased.edad = parseInt(deceased?.edad);

        if (data.finance.updateAvailable) {
            //Variables de contabilidad
            let nroCuotas = 0;
            let importeTotal = parseInt(finance?.precioBase) || 0;
            let importeServicios = 0;
            importeServicios += parseInt(service?.embalsamado) || 0;
            importeServicios += parseInt(service?.urna) || 0;
            importeServicios += parseInt(service?.especial) || 0;
            importeServicios += parseInt(service?.encapsulado) || 0;
            importeServicios += parseInt(service?.nocheAdicional) || 0;
            importeServicios += parseInt(service?.cremacion) || 0;
            importeServicios += parseInt(service?.extra) || 0;
            importeTotal += importeServicios;
            let importeCuota = parseInt(finance?.importeCuota) || 0;
            let enganche = parseInt(finance?.enganche) || 0;
            let bonificacion = parseInt(finance?.bonificacion) || 0;
            let adelanto = parseInt(finance?.adelanto) || 0;
            let importeAFinanciar = importeTotal - enganche - bonificacion - adelanto;
            let resto = importeAFinanciar % importeCuota;
            let nroCuotasBase = (importeAFinanciar - resto) / importeCuota;
            let montoUltimaCuota = resto;
            if (metodoPago === 'Contado') {
                nroCuotas = 1;
                importeCuota = importeAFinanciar;
                montoUltimaCuota = 0;
            } else {
                if (finance?.tipoCobro === 'P' || !finance?.tipoCobro) {
                    nroCuotas = parseInt(finance?.numeroPagos);
                    //rounded importe cuota
                    importeCuota = Math.round(importeAFinanciar / nroCuotas);
                    if (importeCuota * nroCuotas > importeAFinanciar) {
                        montoUltimaCuota = (importeCuota * nroCuotas - importeAFinanciar) + importeCuota;
                    } else {
                        montoUltimaCuota = (importeAFinanciar - importeCuota * nroCuotas) + importeCuota;
                    }
                } else {
                    if (resto > 0) {
                        nroCuotas = nroCuotasBase + 1;
                    } else {
                        nroCuotas = nroCuotasBase;
                    }
                }
            }

            let fechaUltimaCuota = addDays(finance?.fechaPrimerCuota || new Date(), nroCuotas * finance?.periodo);
            let fechaPrimerCuota = finance?.fechaPrimerCuota && (finance.fechaPrimerCuota !== '0000-00-00' || !finance.fechaPrimerCuota) ? new Date(finance?.fechaPrimerCuota) : new Date();
            fechaUltimaCuota = new Date(fechaUltimaCuota);
            //Financiamiento
            data.finance.medioPago = metodoPago || 'Crédito';
            data.finance.montoFinanciado = importeAFinanciar;
            data.finance.numeroPagos = nroCuotas;
            data.finance.importePendiente = importeAFinanciar;
            data.finance.importeTotal = importeTotal;
            data.finance.fechaUltimaCuota = fechaUltimaCuota;
            data.finance.adelanto = adelanto;
            data.finance.importeCuota = importeCuota;
            delete data.finance.tipoCobro;

            //Pagos
            data.massivePayment = {}
            data.massivePayment.idFinanciamiento = finance?.id;
            data.massivePayment.nroCuotas = nroCuotas;
            data.massivePayment.importeCuota = importeCuota;
            data.massivePayment.enganche = enganche;
            data.massivePayment.fechaPrimerCuota = fechaPrimerCuota;
            data.massivePayment.periodo = finance?.periodo;
            data.massivePayment.montoUltimaCuota = montoUltimaCuota;
            data.massivePayment.adelanto = adelanto;
            data.massivePayment.fechaInicio = new Date(contract?.fecha);
            data.massivePayment.tipo = sale?.metodoPago === 'Contado' ? 'Contado' : 'Crédito';
        }
        let updatedSale = await salesService.updateCompleteSaleWithTransaction(data);
        res.status(200).json({ success: true, message: 'Venta actualizada correctamente', updatedSale });

    } catch (error) {
        next(error);
    }
}



module.exports = {
    getSale,
    createSale,
    updateSale,
    getSales,
    updateSalesWithWay,
    deleteSale,
    getCompleteSales,
    createCompleteSale,
    getCompleteSale,
    createCompleteSaleAfterInmediate,
    updateCompleteSale
}





