const { Router } = require('express');

const router = Router();
const packsRoutes = require('./packs');
const branchsRoutes = require('./branchs');
const clientsRoutes = require('./clients');
const departmentsRoutes = require('./departments');
const employeesRoutes = require('./employees');
const obituariesRoutes = require('./obituaries');
const usersRoutes = require('./users');
const genericsRoutes = require('./generics');
const contractsRoutes = require('./contracts');
const deceasedsRoutes = require('./deceaseds');
const beneficiariesRoutes = require('./beneficiaries');
const servicesRoutes = require('./services');
const ceremoniesRoutes = require('./ceremonies');
const requestsRoutes = require('./requests');
const permissionsRoutes = require('./permissions');
const companyRoutes = require('./company');
const profilesRoutes = require('./profiles');
const financingRoutes = require('./financings');
const salesRoutes = require('./sales');
const salesWaysRoutes = require('./sales_ways');
const waysRoutes = require('./ways');
const employeesWaysRoutes = require('./employees_ways');
const paymentsRoutes = require('./payments');
const cutsRoutes = require('./cuts');
const breakdownCutsRoutes = require('./breakdown_cuts');
const callcenterRoutes = require('./callcenter');
const logoRoutes = require('./logo');
const pendingPaymentsRoutes = require('./pending_payments');
const filesRoutes = require('./files');
const logsRoutes = require('./logs');

router.use(packsRoutes);
router.use(branchsRoutes);
router.use(clientsRoutes);
router.use(departmentsRoutes);
router.use(employeesRoutes);
router.use(obituariesRoutes);
router.use(usersRoutes);
router.use(contractsRoutes);
router.use(genericsRoutes);
router.use(deceasedsRoutes);
router.use(beneficiariesRoutes);
router.use(servicesRoutes);
router.use(ceremoniesRoutes);
router.use(requestsRoutes);
router.use(permissionsRoutes);
router.use(companyRoutes);
router.use(profilesRoutes);
router.use(financingRoutes);
router.use(salesRoutes);
router.use(salesWaysRoutes);
router.use(waysRoutes);
router.use(employeesWaysRoutes);
router.use(paymentsRoutes);
router.use(cutsRoutes);
router.use(breakdownCutsRoutes);
router.use(callcenterRoutes);
router.use(logoRoutes);
router.use(pendingPaymentsRoutes);
router.use(filesRoutes);
router.use(logsRoutes);

module.exports = router;