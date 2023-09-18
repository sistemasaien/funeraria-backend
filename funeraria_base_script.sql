-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql-cristhiansaavedra.alwaysdata.net
-- Generation Time: Sep 18, 2023 at 06:13 AM
-- Server version: 10.5.21-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cristhiansaavedra_funeraria`
--

-- --------------------------------------------------------

--
-- Table structure for table `beneficiarios`
--

CREATE TABLE `beneficiarios` (
  `id` int(11) NOT NULL,
  `idContrato` int(11) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `fechaNacimiento` date DEFAULT NULL,
  `parentesco` varchar(50) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `domicilio` varchar(255) DEFAULT NULL,
  `codigoPostal` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `callcenter`
--

CREATE TABLE `callcenter` (
  `id` int(11) NOT NULL,
  `idEmpleado` int(11) DEFAULT NULL,
  `idSucursal` int(11) NOT NULL,
  `tipoLlamada` varchar(255) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `domicilio` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `fechaAgenda` date NOT NULL,
  `reporte` text DEFAULT NULL,
  `acuerdo` text DEFAULT NULL,
  `productos` text DEFAULT NULL,
  `seguimiento` text DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `asunto` varchar(255) DEFAULT NULL,
  `compromiso` text DEFAULT NULL,
  `nroSolicitud` int(11) DEFAULT NULL,
  `nombreFallecido` text DEFAULT NULL,
  `lugarFallecimiento` text DEFAULT NULL,
  `fechaFallecimiento` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ceremonias`
--

CREATE TABLE `ceremonias` (
  `id` int(11) NOT NULL,
  `idContrato` int(11) NOT NULL,
  `idFallecido` int(11) NOT NULL,
  `familia` varchar(255) DEFAULT NULL,
  `diaMisa` date DEFAULT NULL,
  `horaMisa` text DEFAULT NULL,
  `templo` varchar(255) DEFAULT NULL,
  `panteon` varchar(255) DEFAULT NULL,
  `novenarios` varchar(255) DEFAULT NULL,
  `spotsRadio` varchar(255) DEFAULT NULL,
  `esquelasImpresas` varchar(255) DEFAULT NULL,
  `publicacionPagina` varchar(255) DEFAULT NULL,
  `fotografia` varchar(255) DEFAULT NULL,
  `spotsRedesSociales` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `clientes`
--

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL,
  `fechaDesde` date DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `fechaNacimiento` date NOT NULL,
  `domicilio` varchar(255) DEFAULT NULL,
  `localidad` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `ocupacion` varchar(255) DEFAULT NULL,
  `municipio` varchar(255) DEFAULT NULL,
  `estado` text DEFAULT NULL,
  `codigoPostal` varchar(10) DEFAULT NULL,
  `estadoCivil` varchar(255) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `domicilioCobranza` varchar(255) DEFAULT NULL,
  `telefonoCobranza` varchar(20) DEFAULT NULL,
  `referenciaDomicilioCobranza` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cobranzas`
--

CREATE TABLE `cobranzas` (
  `id` int(11) NOT NULL,
  `idFinanciamiento` int(11) NOT NULL,
  `nroCuota` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `valor` decimal(10,2) NOT NULL,
  `importePago` int(11) NOT NULL,
  `importePendiente` int(11) NOT NULL,
  `tipo` text NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` text NOT NULL,
  `fechaPago` date DEFAULT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contratos`
--

CREATE TABLE `contratos` (
  `id` int(11) NOT NULL,
  `idCliente` int(11) NOT NULL,
  `idFinanciamiento` int(11) NOT NULL,
  `idSolicitud` int(11) NOT NULL,
  `idPaquete` int(11) NOT NULL,
  `fecha` date DEFAULT NULL,
  `tipo` varchar(255) DEFAULT NULL,
  `asesor` varchar(255) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `impMunicipal` decimal(10,2) DEFAULT NULL,
  `traslado` varchar(255) DEFAULT NULL,
  `exhumacion` varchar(255) DEFAULT NULL,
  `otros` varchar(255) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `referencia` int(11) DEFAULT NULL,
  `complementarioBasico` varchar(200) DEFAULT NULL,
  `paqueteEspecial` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cortes`
--

CREATE TABLE `cortes` (
  `id` int(11) NOT NULL,
  `idEmpleado` int(11) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `cantidadCobros` int(11) NOT NULL,
  `fecha` datetime DEFAULT NULL,
  `estado` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `departamentos`
--

CREATE TABLE `departamentos` (
  `id` int(11) NOT NULL,
  `nombre` text NOT NULL,
  `descripcion` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `empleados`
--

CREATE TABLE `empleados` (
  `id` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `tipo` varchar(255) DEFAULT NULL,
  `departamento` varchar(255) DEFAULT NULL,
  `sucursal` varchar(255) DEFAULT NULL,
  `recorrido` varchar(255) DEFAULT NULL,
  `contacto` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `telefonoEmergencia` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `empresa`
--

CREATE TABLE `empresa` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `ayudaTelefono` text DEFAULT NULL,
  `ayudaCorreo` text DEFAULT NULL,
  `ayudaNombre` text DEFAULT NULL,
  `estado` text DEFAULT NULL,
  `pais` text DEFAULT NULL,
  `web` text DEFAULT NULL,
  `ciudad` varchar(200) DEFAULT NULL,
  `RFC` varchar(200) DEFAULT NULL,
  `domicilioFiscal` varchar(200) DEFAULT NULL,
  `ciudadFiscal` varchar(200) DEFAULT NULL,
  `municipioFiscal` varchar(200) DEFAULT NULL,
  `telefonoFiscal` varchar(200) DEFAULT NULL,
  `nombreFiscal` varchar(200) NOT NULL,
  `estadoFiscal` varchar(200) NOT NULL,
  `ciudadJurisdiccion` varchar(200) DEFAULT NULL,
  `estadoJurisdiccion` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fallecidos`
--

CREATE TABLE `fallecidos` (
  `id` int(11) NOT NULL,
  `idContrato` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `lugarVelacion` varchar(255) DEFAULT NULL,
  `causas` text DEFAULT NULL,
  `fechaNacimiento` date DEFAULT NULL,
  `fechaDefuncion` date DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `estadoCivil` varchar(255) DEFAULT NULL,
  `lugarDefuncion` varchar(200) DEFAULT NULL,
  `lugarRecoleccion` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `financiamientos`
--

CREATE TABLE `financiamientos` (
  `id` int(11) NOT NULL,
  `idContrato` int(11) NOT NULL,
  `idCliente` int(11) NOT NULL,
  `medioPago` varchar(255) DEFAULT NULL,
  `precioBase` decimal(10,2) DEFAULT NULL,
  `bonificacion` decimal(10,2) DEFAULT NULL,
  `enganche` decimal(10,2) DEFAULT NULL,
  `montoFinanciado` decimal(10,2) DEFAULT NULL,
  `numeroPagos` int(11) DEFAULT NULL,
  `interesMora` decimal(10,2) DEFAULT NULL,
  `periodo` varchar(255) DEFAULT NULL,
  `importeCuota` decimal(10,2) DEFAULT NULL,
  `importeTotal` decimal(10,2) DEFAULT NULL,
  `importePendiente` decimal(10,2) DEFAULT NULL,
  `importeAbonado` decimal(10,2) DEFAULT NULL,
  `atraso` decimal(10,2) DEFAULT NULL,
  `adelanto` decimal(10,2) DEFAULT NULL,
  `fechaPrimerCuota` date DEFAULT NULL,
  `fechaUltimaCuota` date DEFAULT NULL,
  `activo` varchar(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `paquetes`
--

CREATE TABLE `paquetes` (
  `id` int(11) NOT NULL,
  `nombrePaquete` varchar(255) DEFAULT NULL,
  `precioPaquete` decimal(10,2) DEFAULT NULL,
  `ataudModelo` varchar(255) DEFAULT NULL,
  `capilla` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `perfiles`
--

CREATE TABLE `perfiles` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permisos`
--

CREATE TABLE `permisos` (
  `permiso` varchar(255) NOT NULL,
  `idPerfil` int(11) NOT NULL,
  `tipo` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `recorridos`
--

CREATE TABLE `recorridos` (
  `id` int(11) NOT NULL,
  `nombre` text NOT NULL,
  `descripcion` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `recorridos_ventas`
--

CREATE TABLE `recorridos_ventas` (
  `idRecorrido` int(11) NOT NULL,
  `idVenta` int(11) NOT NULL,
  `orden` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `servicios`
--

CREATE TABLE `servicios` (
  `id` int(11) NOT NULL,
  `embalsamado` varchar(10) DEFAULT NULL,
  `urna` varchar(10) DEFAULT NULL,
  `especial` varchar(10) DEFAULT NULL,
  `encapsulado` varchar(10) DEFAULT NULL,
  `nocheAdicional` varchar(10) DEFAULT NULL,
  `cremacion` varchar(10) DEFAULT NULL,
  `extra` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `solicitudes`
--

CREATE TABLE `solicitudes` (
  `id` int(11) NOT NULL,
  `idContrato` int(11) DEFAULT NULL,
  `idCliente` int(11) NOT NULL,
  `idBeneficiario` int(11) DEFAULT NULL,
  `idFallecido` int(11) NOT NULL,
  `idPaquete` int(11) DEFAULT NULL,
  `idServicio` int(11) DEFAULT NULL,
  `idCeremonia` int(11) DEFAULT NULL,
  `tipo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sucursales`
--

CREATE TABLE `sucursales` (
  `id` int(11) NOT NULL,
  `nombre` text NOT NULL,
  `direccion` text NOT NULL,
  `telefono` text NOT NULL,
  `correo` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `usuario` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `perfil` varchar(255) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ventas`
--

CREATE TABLE `ventas` (
  `id` int(11) NOT NULL,
  `idCliente` int(11) DEFAULT NULL,
  `idContrato` int(11) DEFAULT NULL,
  `idSolicitud` int(11) DEFAULT NULL,
  `idFinanciamiento` int(11) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `asesor` varchar(255) DEFAULT NULL,
  `cobrador` varchar(255) DEFAULT NULL,
  `recorrido` int(11) DEFAULT NULL,
  `metodoPago` varchar(255) DEFAULT NULL,
  `fechaLiquidacion` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `beneficiarios`
--
ALTER TABLE `beneficiarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idContrato` (`idContrato`);

--
-- Indexes for table `callcenter`
--
ALTER TABLE `callcenter`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ceremonias`
--
ALTER TABLE `ceremonias`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cobranzas`
--
ALTER TABLE `cobranzas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contratos`
--
ALTER TABLE `contratos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cortes`
--
ALTER TABLE `cortes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `departamentos`
--
ALTER TABLE `departamentos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `empleados`
--
ALTER TABLE `empleados`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `empresa`
--
ALTER TABLE `empresa`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `fallecidos`
--
ALTER TABLE `fallecidos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `financiamientos`
--
ALTER TABLE `financiamientos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `paquetes`
--
ALTER TABLE `paquetes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `perfiles`
--
ALTER TABLE `perfiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indexes for table `permisos`
--
ALTER TABLE `permisos`
  ADD KEY `idPerfil` (`idPerfil`);

--
-- Indexes for table `recorridos`
--
ALTER TABLE `recorridos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `recorridos_ventas`
--
ALTER TABLE `recorridos_ventas`
  ADD PRIMARY KEY (`idRecorrido`,`idVenta`);

--
-- Indexes for table `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sucursales`
--
ALTER TABLE `sucursales`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario` (`usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idCliente` (`idCliente`),
  ADD KEY `idContrato` (`idContrato`),
  ADD KEY `idSolicitud` (`idSolicitud`),
  ADD KEY `idFinanciamiento` (`idFinanciamiento`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `beneficiarios`
--
ALTER TABLE `beneficiarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `callcenter`
--
ALTER TABLE `callcenter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ceremonias`
--
ALTER TABLE `ceremonias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cobranzas`
--
ALTER TABLE `cobranzas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contratos`
--
ALTER TABLE `contratos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cortes`
--
ALTER TABLE `cortes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `departamentos`
--
ALTER TABLE `departamentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `empleados`
--
ALTER TABLE `empleados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `empresa`
--
ALTER TABLE `empresa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fallecidos`
--
ALTER TABLE `fallecidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `financiamientos`
--
ALTER TABLE `financiamientos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `paquetes`
--
ALTER TABLE `paquetes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `perfiles`
--
ALTER TABLE `perfiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `recorridos`
--
ALTER TABLE `recorridos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `servicios`
--
ALTER TABLE `servicios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `solicitudes`
--
ALTER TABLE `solicitudes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sucursales`
--
ALTER TABLE `sucursales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `permisos`
--
ALTER TABLE `permisos`
  ADD CONSTRAINT `permisos_ibfk_1` FOREIGN KEY (`idPerfil`) REFERENCES `perfiles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
