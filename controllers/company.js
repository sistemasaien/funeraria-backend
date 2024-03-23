const companyService = require('../services/company')
const { getInsertSentence, getUpdateSentence } = require('../utils/dbUtils');

const getCompanyData = async (req, res, next) => {
    try {
        const companyData = await companyService.getCompanyData()
        res.status(200).json(companyData)
    } catch (error) {
        next(error);
    }
}

const updateCompanyData = async (req, res, next) => {
    try {
        const sentence = getUpdateSentence('empresa', req.body)
        const updatedCompany = await companyService.updateCompanyData(sentence)
        res.status(200).json(updatedCompany)
    } catch (error) {
        next(error);
    }
}

const createCompanyData = async (req, res, next) => {
    try {
        const sentence = getInsertSentence('empresa', req.body)
        const newCompany = await companyService.createCompanyData(sentence)
        res.status(200).json(newCompany)
    } catch (error) {
        next(error);
    }
}

const companyController = {
    getCompanyData,
    updateCompanyData,
    createCompanyData
}

module.exports = companyController;
