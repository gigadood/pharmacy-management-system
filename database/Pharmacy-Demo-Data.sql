-- Pharmacy demo dataset for the existing 10-table application schema.
-- SYNTHETIC: medicine prices, people, addresses, phones, and all transactions are demo data.
-- Stock unit = one listed item/unit. Dose stores strength, not administration instructions.
-- Creates a NEW schema. Does not drop, truncate, or update an existing database.
-- Run ONCE. If pharmacy_demo already exists, STOP; do not continue into that schema.
CREATE DATABASE `pharmacy_demo` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `pharmacy_demo`;
SET @seed_today = CURDATE();


CREATE TABLE `company` (
  `NAME` varchar(50) NOT NULL,
  `ADDRESS` varchar(50) NOT NULL,
  `PHONE` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `drugs` (
  `NAME` varchar(50) NOT NULL,
  `TYPE` varchar(20) NOT NULL,
  `BARCODE` varchar(20) NOT NULL,
  `DOSE` varchar(10) NOT NULL,
  `CODE` varchar(10) NOT NULL,
  `COST_PRICE` double NOT NULL,
  `SELLING_PRICE` double NOT NULL,
  `EXPIRY` varchar(20) NOT NULL,
  `COMPANY_NAME` varchar(50) NOT NULL,
  `PRODUCTION_DATE` date NOT NULL,
  `EXPIRATION_DATE` date NOT NULL,
  `PLACE` varchar(20) NOT NULL,
  `QUANTITY` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `expiry` (
  `PRODUCT_NAME` varchar(50) NOT NULL,
  `PRODUCT_CODE` varchar(20) NOT NULL,
  `DATE_OF_EXPIRY` varchar(10) NOT NULL,
  `QUANTITY_REMAIN` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `history_sales` (
  `USER_NAME` varchar(20) NOT NULL,
  `BARCODE` varchar(20) NOT NULL,
  `NAME` varchar(50) NOT NULL,
  `TYPE` varchar(10) NOT NULL,
  `DOSE` varchar(10) NOT NULL,
  `QUANTITY` int(11) NOT NULL,
  `PRICE` double NOT NULL,
  `AMOUNT` double NOT NULL,
  `DATE` varchar(15) NOT NULL,
  `TIME` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `inbox` (
  `MESSAGE_FROM` varchar(20) NOT NULL,
  `MESSAGE_TO` varchar(20) NOT NULL,
  `MESSAGE_TEXT` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `login` (
  `NAME` varchar(50) NOT NULL,
  `TYPE` varchar(20) NOT NULL,
  `DATE` varchar(20) NOT NULL,
  `TIME` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `message_history` (
  `MESSAGE_FROM` varchar(20) NOT NULL,
  `MESSAGE_TO` varchar(20) NOT NULL,
  `MESSAGE_TEXT` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `purchase` (
  `BARCODE` varchar(20) NOT NULL,
  `NAME` varchar(50) NOT NULL,
  `TYPE` varchar(20) NOT NULL,
  `COMPANY_NAME` varchar(20) NOT NULL,
  `QUANTITY` int(11) NOT NULL,
  `PRICE` double NOT NULL,
  `AMOUNT` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sales` (
  `BARCODE` varchar(20) NOT NULL,
  `NAME` varchar(50) NOT NULL,
  `TYPE` varchar(10) NOT NULL,
  `DOSE` varchar(10) NOT NULL,
  `QUANTITY` int(11) NOT NULL,
  `PRICE` double NOT NULL,
  `AMOUNT` double NOT NULL,
  `DATE` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `NAME` varchar(50) NOT NULL,
  `DOB` varchar(20) NOT NULL,
  `ADDRESS` varchar(100) NOT NULL,
  `PHONE` varchar(20) NOT NULL,
  `SALARY` double NOT NULL,
  `PASSWORD` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE company ADD PRIMARY KEY (NAME);

ALTER TABLE drugs ADD PRIMARY KEY (BARCODE);

ALTER TABLE purchase ADD PRIMARY KEY (BARCODE);

ALTER TABLE users ADD PRIMARY KEY (ID);

ALTER TABLE purchase ADD CONSTRAINT purchase_company_fk FOREIGN KEY (COMPANY_NAME) REFERENCES company(NAME) ON UPDATE CASCADE ON DELETE CASCADE;

START TRANSACTION;

INSERT INTO `company` (`NAME`,`ADDRESS`,`PHONE`) VALUES
('Sahyadri Pharma','Kothrud, Pune','02040001001'),
('Deccan MedSupply','Shivajinagar, Pune','02040001002'),
('Pune HealthSupply','Hadapsar, Pune','02040001003'),
('Western Care','Baner, Pune','02040001004'),
('GreenLeaf Pharma','Aundh, Pune','02040001005'),
('Metro MedSupply','Wakad, Pune','02040001006'),
('Prism Healthcare','Pimpri, Pune','02040001007'),
('RiverSide Pharma','Viman Nagar, Pune','02040001008');


INSERT INTO `users` (`ID`,`NAME`,`DOB`,`ADDRESS`,`PHONE`,`SALARY`,`PASSWORD`) VALUES
(1,'admin','01-01-2000','Pune Demo Office','9000000001',35000,'admin'),
(2,'Aarav','14-06-1998','Kothrud, Pune','9000000002',22000,'demo123'),
(3,'Meera','20-09-1997','Baner, Pune','9000000003',26000,'demo123'),
(4,'Riya','11-02-2001','Aundh, Pune','9000000004',20000,'demo123'),
(5,'Kabir','08-12-1999','Wakad, Pune','9000000005',24000,'demo123');


INSERT INTO `drugs` (`NAME`,`TYPE`,`BARCODE`,`DOSE`,`CODE`,`COST_PRICE`,`SELLING_PRICE`,`EXPIRY`,`COMPANY_NAME`,`PRODUCTION_DATE`,`EXPIRATION_DATE`,`PLACE`,`QUANTITY`) VALUES
('Paracetamol 500 mg','Tablet','DEMO000001','500mg','M001',1.5,2.5,'Expired','Sahyadri Pharma',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL -15 DAY),'A-01',5),
('Paracetamol 650 mg','Tablet','DEMO000002','650mg','M002',2.2,3.5,'Expired','Deccan MedSupply',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL -3 DAY),'A-02',8),
('Cetirizine 10 mg','Tablet','DEMO000003','10mg','M003',1.8,3,'Expired','Pune HealthSupply',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL -60 DAY),'A-03',0),
('Loratadine 10 mg','Tablet','DEMO000004','10mg','M004',3.1,5,'Available for use','Western Care',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 8 DAY),'A-04',4),
('ORS sachet','Powder','DEMO000005','21g','M005',12,20,'Available for use','GreenLeaf Pharma',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 18 DAY),'A-05',9),
('Vitamin C 500 mg','Tablet','DEMO000006','500mg','M006',2.8,4.5,'Available for use','Metro MedSupply',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 27 DAY),'A-06',0),
('Calcium + Vitamin D','Tablet','DEMO000007','500mg','M007',4,6.5,'Available for use','Prism Healthcare',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 30 DAY),'A-07',43),
('Vitamin D3 1000 IU','Tablet','DEMO000008','1000IU','M008',3.8,6,'Available for use','RiverSide Pharma',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 393 DAY),'A-08',177),
('Iron supplement','Tablet','DEMO000009','100mg','M009',2.5,4,'Available for use','Sahyadri Pharma',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 344 DAY),'A-09',72),
('B-complex capsule','Capsule','DEMO000010','1cap','M010',3.2,5,'Available for use','Deccan MedSupply',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 446 DAY),'A-10',113),
('Zinc 20 mg','Tablet','DEMO000011','20mg','M011',2,3.5,'Available for use','Pune HealthSupply',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 184 DAY),'B-01',164),
('Saline nasal spray','Spray','DEMO000012','0.65%','M012',42,65,'Available for use','Western Care',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 243 DAY),'B-02',120),
('Artificial tears','Drops','DEMO000013','10ml','M013',58,85,'Available for use','GreenLeaf Pharma',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 298 DAY),'B-03',103),
('Antacid suspension','Syrup','DEMO000014','170ml','M014',65,95,'Available for use','Metro MedSupply',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 523 DAY),'B-04',178),
('Povidone iodine','Solution','DEMO000015','5%','M015',38,60,'Available for use','Prism Healthcare',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 382 DAY),'B-05',58),
('Clotrimazole cream','Cream','DEMO000016','1%','M016',45,70,'Available for use','RiverSide Pharma',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 261 DAY),'B-06',112),
('Moisturising cream','Cream','DEMO000017','50g','M017',75,110,'Available for use','Sahyadri Pharma',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 168 DAY),'B-07',84),
('Sunscreen SPF 50','Cream','DEMO000018','50g','M018',165,240,'Available for use','Deccan MedSupply',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 322 DAY),'B-08',122),
('Glucose powder','Powder','DEMO000019','100g','M019',35,55,'Available for use','Pune HealthSupply',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 537 DAY),'B-09',61),
('Petroleum jelly','Cream','DEMO000020','25g','M020',28,45,'Available for use','Western Care',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 200 DAY),'B-10',31),
('Amoxicillin 500 mg','Capsule','DEMO000021','500mg','M021',4.5,7,'Available for use','GreenLeaf Pharma',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 111 DAY),'C-01',81),
('Azithromycin 500 mg','Tablet','DEMO000022','500mg','M022',12,18,'Available for use','Metro MedSupply',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 118 DAY),'C-02',141),
('Metformin 500 mg','Tablet','DEMO000023','500mg','M023',1.6,2.8,'Available for use','Prism Healthcare',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 258 DAY),'C-03',28),
('Amlodipine 5 mg','Tablet','DEMO000024','5mg','M024',1.2,2,'Available for use','RiverSide Pharma',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 304 DAY),'C-04',139),
('Losartan 50 mg','Tablet','DEMO000025','50mg','M025',3.5,5.5,'Available for use','Sahyadri Pharma',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 121 DAY),'C-05',42),
('Atorvastatin 10 mg','Tablet','DEMO000026','10mg','M026',3.8,6,'Available for use','Deccan MedSupply',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 283 DAY),'C-06',100),
('Pantoprazole 40 mg','Tablet','DEMO000027','40mg','M027',4.5,7,'Available for use','Pune HealthSupply',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 127 DAY),'C-07',48),
('Omeprazole 20 mg','Capsule','DEMO000028','20mg','M028',2.5,4,'Available for use','Western Care',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 525 DAY),'C-08',154),
('Salbutamol inhaler','Spray','DEMO000029','100mcg','M029',105,150,'Available for use','GreenLeaf Pharma',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 165 DAY),'C-09',106),
('Montelukast 10 mg','Tablet','DEMO000030','10mg','M030',6,9,'Available for use','Metro MedSupply',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 242 DAY),'C-10',29),
('Levothyroxine 50 mcg','Tablet','DEMO000031','50mcg','M031',1.2,2,'Available for use','Prism Healthcare',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 121 DAY),'D-01',131),
('Folic acid 5 mg','Tablet','DEMO000032','5mg','M032',0.8,1.5,'Available for use','RiverSide Pharma',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 316 DAY),'D-02',90),
('Ibuprofen 200 mg','Tablet','DEMO000033','200mg','M033',1.9,3,'Available for use','Sahyadri Pharma',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 340 DAY),'D-03',93),
('Diclofenac gel','Gel','DEMO000034','1%','M034',58,90,'Available for use','Deccan MedSupply',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 111 DAY),'D-04',113),
('Cough syrup','Syrup','DEMO000035','100ml','M035',48,75,'Available for use','Pune HealthSupply',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 532 DAY),'D-05',119),
('Lactulose solution','Solution','DEMO000036','100ml','M036',92,135,'Available for use','Western Care',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 429 DAY),'D-06',81),
('Chlorhexidine rinse','Solution','DEMO000037','0.2%','M037',72,105,'Available for use','GreenLeaf Pharma',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 366 DAY),'D-07',120),
('Dextrose injection','Injection','DEMO000038','25%','M038',28,45,'Available for use','Metro MedSupply',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 339 DAY),'D-08',149),
('Saline infusion','Injection','DEMO000039','500ml','M039',32,50,'Available for use','Prism Healthcare',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 372 DAY),'D-09',88),
('Hydrocortisone cream','Cream','DEMO000040','1%','M040',42,65,'Available for use','RiverSide Pharma',DATE_SUB(@seed_today,INTERVAL 180 DAY),DATE_ADD(@seed_today,INTERVAL 537 DAY),'D-10',114);


INSERT INTO `purchase` (`BARCODE`,`NAME`,`TYPE`,`COMPANY_NAME`,`QUANTITY`,`PRICE`,`AMOUNT`) VALUES
('DEMO000001','Paracetamol 500 mg','Tablet','Sahyadri Pharma',5,1.5,7.5),
('DEMO000002','Paracetamol 650 mg','Tablet','Deccan MedSupply',8,2.2,17.6),
('DEMO000003','Cetirizine 10 mg','Tablet','Pune HealthSupply',0,1.8,0.0),
('DEMO000004','Loratadine 10 mg','Tablet','Western Care',4,3.1,12.4),
('DEMO000005','ORS sachet','Powder','GreenLeaf Pharma',9,12,108),
('DEMO000006','Vitamin C 500 mg','Tablet','Metro MedSupply',0,2.8,0.0),
('DEMO000007','Calcium + Vitamin D','Tablet','Prism Healthcare',43,4,172),
('DEMO000008','Vitamin D3 1000 IU','Tablet','RiverSide Pharma',182,3.8,691.6),
('DEMO000009','Iron supplement','Tablet','Sahyadri Pharma',81,2.5,202.5),
('DEMO000010','B-complex capsule','Capsule','Deccan MedSupply',126,3.2,403.2),
('DEMO000011','Zinc 20 mg','Tablet','Pune HealthSupply',178,2,356),
('DEMO000012','Saline nasal spray','Spray','Western Care',128,42,5376),
('DEMO000013','Artificial tears','Drops','GreenLeaf Pharma',116,58,6728),
('DEMO000014','Antacid suspension','Syrup','Metro MedSupply',196,65,12740),
('DEMO000015','Povidone iodine','Solution','Prism Healthcare',78,38,2964),
('DEMO000016','Clotrimazole cream','Cream','RiverSide Pharma',129,45,5805),
('DEMO000017','Moisturising cream','Cream','Sahyadri Pharma',105,75,7875),
('DEMO000018','Sunscreen SPF 50','Cream','Deccan MedSupply',147,165,24255),
('DEMO000019','Glucose powder','Powder','Pune HealthSupply',67,35,2345),
('DEMO000020','Petroleum jelly','Cream','Western Care',42,28,1176),
('DEMO000021','Amoxicillin 500 mg','Capsule','GreenLeaf Pharma',100,4.5,450.0),
('DEMO000022','Azithromycin 500 mg','Tablet','Metro MedSupply',153,12,1836),
('DEMO000023','Metformin 500 mg','Tablet','Prism Healthcare',45,1.6,72.0),
('DEMO000024','Amlodipine 5 mg','Tablet','RiverSide Pharma',148,1.2,177.6),
('DEMO000025','Losartan 50 mg','Tablet','Sahyadri Pharma',61,3.5,213.5),
('DEMO000026','Atorvastatin 10 mg','Tablet','Deccan MedSupply',111,3.8,421.8),
('DEMO000027','Pantoprazole 40 mg','Tablet','Pune HealthSupply',69,4.5,310.5),
('DEMO000028','Omeprazole 20 mg','Capsule','Western Care',165,2.5,412.5),
('DEMO000029','Salbutamol inhaler','Spray','GreenLeaf Pharma',124,105,13020),
('DEMO000030','Montelukast 10 mg','Tablet','Metro MedSupply',38,6,228),
('DEMO000031','Levothyroxine 50 mcg','Tablet','Prism Healthcare',141,1.2,169.2),
('DEMO000032','Folic acid 5 mg','Tablet','RiverSide Pharma',106,0.8,84.8),
('DEMO000033','Ibuprofen 200 mg','Tablet','Sahyadri Pharma',118,1.9,224.2),
('DEMO000034','Diclofenac gel','Gel','Deccan MedSupply',128,58,7424),
('DEMO000035','Cough syrup','Syrup','Pune HealthSupply',139,48,6672),
('DEMO000036','Lactulose solution','Solution','Western Care',95,92,8740),
('DEMO000037','Chlorhexidine rinse','Solution','GreenLeaf Pharma',121,72,8712),
('DEMO000038','Dextrose injection','Injection','Metro MedSupply',162,28,4536),
('DEMO000039','Saline infusion','Injection','Prism Healthcare',91,32,2912),
('DEMO000040','Hydrocortisone cream','Cream','RiverSide Pharma',135,42,5670);


INSERT INTO `history_sales` (`USER_NAME`,`BARCODE`,`NAME`,`TYPE`,`DOSE`,`QUANTITY`,`PRICE`,`AMOUNT`,`DATE`,`TIME`) VALUES
('Riya','DEMO000033','Ibuprofen 200 mg','Tablet','200mg',2,3,6,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 29 DAY),'%d-%m-%Y'),'09:07:00'),
('Meera','DEMO000013','Artificial tears','Drops','10ml',3,85,255,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 29 DAY),'%d-%m-%Y'),'10:29:00'),
('Meera','DEMO000038','Dextrose injection','Injection','25%',1,45,45,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 29 DAY),'%d-%m-%Y'),'11:05:00'),
('Aarav','DEMO000027','Pantoprazole 40 mg','Tablet','40mg',3,7,21,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 29 DAY),'%d-%m-%Y'),'12:15:00'),
('Aarav','DEMO000040','Hydrocortisone cream','Cream','1%',3,65,195,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 29 DAY),'%d-%m-%Y'),'13:56:00'),
('admin','DEMO000014','Antacid suspension','Syrup','170ml',4,95,380,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 29 DAY),'%d-%m-%Y'),'14:42:00'),
('admin','DEMO000011','Zinc 20 mg','Tablet','20mg',4,3.5,14.0,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 28 DAY),'%d-%m-%Y'),'09:13:00'),
('Aarav','DEMO000028','Omeprazole 20 mg','Capsule','20mg',2,4,8,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 28 DAY),'%d-%m-%Y'),'10:39:00'),
('Riya','DEMO000015','Povidone iodine','Solution','5%',3,60,180,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 28 DAY),'%d-%m-%Y'),'11:53:00'),
('Aarav','DEMO000023','Metformin 500 mg','Tablet','500mg',3,2.8,8.4,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 28 DAY),'%d-%m-%Y'),'12:37:00'),
('Aarav','DEMO000008','Vitamin D3 1000 IU','Tablet','1000IU',4,6,24,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 28 DAY),'%d-%m-%Y'),'13:57:00'),
('Meera','DEMO000032','Folic acid 5 mg','Tablet','5mg',1,1.5,1.5,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 28 DAY),'%d-%m-%Y'),'14:38:00'),
('Aarav','DEMO000027','Pantoprazole 40 mg','Tablet','40mg',4,7,28,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 27 DAY),'%d-%m-%Y'),'09:36:00'),
('Riya','DEMO000025','Losartan 50 mg','Tablet','50mg',1,5.5,5.5,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 27 DAY),'%d-%m-%Y'),'10:54:00'),
('admin','DEMO000018','Sunscreen SPF 50','Cream','50g',4,240,960,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 27 DAY),'%d-%m-%Y'),'11:24:00'),
('Riya','DEMO000030','Montelukast 10 mg','Tablet','10mg',1,9,9,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 27 DAY),'%d-%m-%Y'),'12:12:00'),
('Aarav','DEMO000031','Levothyroxine 50 mcg','Tablet','50mcg',4,2,8,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 27 DAY),'%d-%m-%Y'),'13:02:00'),
('Meera','DEMO000028','Omeprazole 20 mg','Capsule','20mg',1,4,4,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 27 DAY),'%d-%m-%Y'),'14:45:00'),
('Riya','DEMO000012','Saline nasal spray','Spray','0.65%',2,65,130,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 26 DAY),'%d-%m-%Y'),'09:06:00'),
('Meera','DEMO000010','B-complex capsule','Capsule','1cap',1,5,5,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 26 DAY),'%d-%m-%Y'),'10:02:00'),
('admin','DEMO000028','Omeprazole 20 mg','Capsule','20mg',3,4,12,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 26 DAY),'%d-%m-%Y'),'11:46:00'),
('admin','DEMO000010','B-complex capsule','Capsule','1cap',2,5,10,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 26 DAY),'%d-%m-%Y'),'12:42:00'),
('Riya','DEMO000021','Amoxicillin 500 mg','Capsule','500mg',3,7,21,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 26 DAY),'%d-%m-%Y'),'13:55:00'),
('Meera','DEMO000012','Saline nasal spray','Spray','0.65%',1,65,65,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 26 DAY),'%d-%m-%Y'),'14:53:00'),
('admin','DEMO000023','Metformin 500 mg','Tablet','500mg',2,2.8,5.6,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 25 DAY),'%d-%m-%Y'),'09:01:00'),
('admin','DEMO000017','Moisturising cream','Cream','50g',3,110,330,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 25 DAY),'%d-%m-%Y'),'10:43:00'),
('Aarav','DEMO000029','Salbutamol inhaler','Spray','100mcg',1,150,150,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 25 DAY),'%d-%m-%Y'),'11:35:00'),
('Aarav','DEMO000036','Lactulose solution','Solution','100ml',1,135,135,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 25 DAY),'%d-%m-%Y'),'12:40:00'),
('admin','DEMO000036','Lactulose solution','Solution','100ml',1,135,135,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 25 DAY),'%d-%m-%Y'),'13:26:00'),
('Riya','DEMO000035','Cough syrup','Syrup','100ml',3,75,225,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 25 DAY),'%d-%m-%Y'),'14:39:00'),
('Aarav','DEMO000026','Atorvastatin 10 mg','Tablet','10mg',3,6,18,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 24 DAY),'%d-%m-%Y'),'09:55:00'),
('admin','DEMO000018','Sunscreen SPF 50','Cream','50g',4,240,960,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 24 DAY),'%d-%m-%Y'),'10:07:00'),
('Aarav','DEMO000025','Losartan 50 mg','Tablet','50mg',4,5.5,22.0,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 24 DAY),'%d-%m-%Y'),'11:17:00'),
('Aarav','DEMO000027','Pantoprazole 40 mg','Tablet','40mg',4,7,28,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 24 DAY),'%d-%m-%Y'),'12:52:00'),
('admin','DEMO000040','Hydrocortisone cream','Cream','1%',1,65,65,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 24 DAY),'%d-%m-%Y'),'13:41:00'),
('Meera','DEMO000017','Moisturising cream','Cream','50g',4,110,440,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 24 DAY),'%d-%m-%Y'),'14:24:00'),
('Riya','DEMO000028','Omeprazole 20 mg','Capsule','20mg',1,4,4,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 23 DAY),'%d-%m-%Y'),'09:44:00'),
('admin','DEMO000038','Dextrose injection','Injection','25%',2,45,90,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 23 DAY),'%d-%m-%Y'),'10:43:00'),
('Meera','DEMO000027','Pantoprazole 40 mg','Tablet','40mg',1,7,7,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 23 DAY),'%d-%m-%Y'),'11:17:00'),
('Riya','DEMO000029','Salbutamol inhaler','Spray','100mcg',1,150,150,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 23 DAY),'%d-%m-%Y'),'12:15:00'),
('Meera','DEMO000034','Diclofenac gel','Gel','1%',3,90,270,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 23 DAY),'%d-%m-%Y'),'13:58:00'),
('Riya','DEMO000016','Clotrimazole cream','Cream','1%',2,70,140,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 23 DAY),'%d-%m-%Y'),'14:47:00'),
('Riya','DEMO000014','Antacid suspension','Syrup','170ml',4,95,380,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 22 DAY),'%d-%m-%Y'),'09:20:00'),
('Aarav','DEMO000016','Clotrimazole cream','Cream','1%',2,70,140,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 22 DAY),'%d-%m-%Y'),'10:34:00'),
('admin','DEMO000040','Hydrocortisone cream','Cream','1%',4,65,260,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 22 DAY),'%d-%m-%Y'),'11:17:00'),
('admin','DEMO000024','Amlodipine 5 mg','Tablet','5mg',2,2,4,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 22 DAY),'%d-%m-%Y'),'12:24:00'),
('admin','DEMO000032','Folic acid 5 mg','Tablet','5mg',4,1.5,6.0,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 22 DAY),'%d-%m-%Y'),'13:42:00'),
('Meera','DEMO000017','Moisturising cream','Cream','50g',2,110,220,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 22 DAY),'%d-%m-%Y'),'14:34:00'),
('Meera','DEMO000017','Moisturising cream','Cream','50g',2,110,220,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 21 DAY),'%d-%m-%Y'),'09:52:00'),
('Riya','DEMO000022','Azithromycin 500 mg','Tablet','500mg',2,18,36,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 21 DAY),'%d-%m-%Y'),'10:55:00'),
('admin','DEMO000040','Hydrocortisone cream','Cream','1%',4,65,260,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 21 DAY),'%d-%m-%Y'),'11:46:00'),
('admin','DEMO000015','Povidone iodine','Solution','5%',2,60,120,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 21 DAY),'%d-%m-%Y'),'12:58:00'),
('Riya','DEMO000013','Artificial tears','Drops','10ml',3,85,255,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 21 DAY),'%d-%m-%Y'),'13:56:00'),
('Aarav','DEMO000033','Ibuprofen 200 mg','Tablet','200mg',4,3,12,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 21 DAY),'%d-%m-%Y'),'14:47:00'),
('Riya','DEMO000029','Salbutamol inhaler','Spray','100mcg',1,150,150,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 20 DAY),'%d-%m-%Y'),'09:08:00'),
('Aarav','DEMO000025','Losartan 50 mg','Tablet','50mg',4,5.5,22.0,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 20 DAY),'%d-%m-%Y'),'10:07:00'),
('Riya','DEMO000017','Moisturising cream','Cream','50g',4,110,440,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 20 DAY),'%d-%m-%Y'),'11:28:00'),
('Riya','DEMO000027','Pantoprazole 40 mg','Tablet','40mg',3,7,21,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 20 DAY),'%d-%m-%Y'),'12:10:00'),
('Aarav','DEMO000021','Amoxicillin 500 mg','Capsule','500mg',1,7,7,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 20 DAY),'%d-%m-%Y'),'13:56:00'),
('admin','DEMO000026','Atorvastatin 10 mg','Tablet','10mg',2,6,12,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 20 DAY),'%d-%m-%Y'),'14:08:00'),
('admin','DEMO000028','Omeprazole 20 mg','Capsule','20mg',2,4,8,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 19 DAY),'%d-%m-%Y'),'09:39:00'),
('admin','DEMO000027','Pantoprazole 40 mg','Tablet','40mg',1,7,7,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 19 DAY),'%d-%m-%Y'),'10:20:00'),
('admin','DEMO000039','Saline infusion','Injection','500ml',2,50,100,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 19 DAY),'%d-%m-%Y'),'11:55:00'),
('Meera','DEMO000030','Montelukast 10 mg','Tablet','10mg',2,9,18,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 19 DAY),'%d-%m-%Y'),'12:22:00'),
('Aarav','DEMO000033','Ibuprofen 200 mg','Tablet','200mg',2,3,6,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 19 DAY),'%d-%m-%Y'),'13:31:00'),
('Riya','DEMO000014','Antacid suspension','Syrup','170ml',4,95,380,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 19 DAY),'%d-%m-%Y'),'14:51:00'),
('Aarav','DEMO000034','Diclofenac gel','Gel','1%',3,90,270,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 18 DAY),'%d-%m-%Y'),'09:40:00'),
('admin','DEMO000013','Artificial tears','Drops','10ml',2,85,170,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 18 DAY),'%d-%m-%Y'),'10:15:00'),
('Aarav','DEMO000017','Moisturising cream','Cream','50g',1,110,110,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 18 DAY),'%d-%m-%Y'),'11:56:00'),
('Meera','DEMO000034','Diclofenac gel','Gel','1%',3,90,270,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 18 DAY),'%d-%m-%Y'),'12:53:00'),
('admin','DEMO000024','Amlodipine 5 mg','Tablet','5mg',3,2,6,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 18 DAY),'%d-%m-%Y'),'13:26:00'),
('admin','DEMO000017','Moisturising cream','Cream','50g',4,110,440,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 18 DAY),'%d-%m-%Y'),'14:59:00'),
('admin','DEMO000010','B-complex capsule','Capsule','1cap',4,5,20,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 17 DAY),'%d-%m-%Y'),'09:21:00'),
('Riya','DEMO000024','Amlodipine 5 mg','Tablet','5mg',4,2,8,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 17 DAY),'%d-%m-%Y'),'10:06:00'),
('Meera','DEMO000034','Diclofenac gel','Gel','1%',2,90,180,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 17 DAY),'%d-%m-%Y'),'11:28:00'),
('Riya','DEMO000035','Cough syrup','Syrup','100ml',4,75,300,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 17 DAY),'%d-%m-%Y'),'12:39:00'),
('admin','DEMO000011','Zinc 20 mg','Tablet','20mg',3,3.5,10.5,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 17 DAY),'%d-%m-%Y'),'13:02:00'),
('Aarav','DEMO000013','Artificial tears','Drops','10ml',1,85,85,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 17 DAY),'%d-%m-%Y'),'14:38:00'),
('Meera','DEMO000028','Omeprazole 20 mg','Capsule','20mg',2,4,8,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 16 DAY),'%d-%m-%Y'),'09:40:00'),
('admin','DEMO000032','Folic acid 5 mg','Tablet','5mg',1,1.5,1.5,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 16 DAY),'%d-%m-%Y'),'10:12:00'),
('Aarav','DEMO000039','Saline infusion','Injection','500ml',1,50,50,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 16 DAY),'%d-%m-%Y'),'11:58:00'),
('Riya','DEMO000035','Cough syrup','Syrup','100ml',4,75,300,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 16 DAY),'%d-%m-%Y'),'12:17:00'),
('Aarav','DEMO000026','Atorvastatin 10 mg','Tablet','10mg',2,6,12,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 16 DAY),'%d-%m-%Y'),'13:12:00'),
('Aarav','DEMO000020','Petroleum jelly','Cream','25g',3,45,135,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 16 DAY),'%d-%m-%Y'),'14:30:00'),
('Aarav','DEMO000032','Folic acid 5 mg','Tablet','5mg',4,1.5,6.0,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 15 DAY),'%d-%m-%Y'),'09:55:00'),
('Meera','DEMO000029','Salbutamol inhaler','Spray','100mcg',1,150,150,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 15 DAY),'%d-%m-%Y'),'10:02:00'),
('Aarav','DEMO000036','Lactulose solution','Solution','100ml',3,135,405,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 15 DAY),'%d-%m-%Y'),'11:53:00'),
('Riya','DEMO000014','Antacid suspension','Syrup','170ml',4,95,380,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 15 DAY),'%d-%m-%Y'),'12:41:00'),
('Riya','DEMO000035','Cough syrup','Syrup','100ml',4,75,300,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 15 DAY),'%d-%m-%Y'),'13:29:00'),
('Meera','DEMO000018','Sunscreen SPF 50','Cream','50g',3,240,720,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 15 DAY),'%d-%m-%Y'),'14:33:00'),
('admin','DEMO000033','Ibuprofen 200 mg','Tablet','200mg',1,3,3,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 14 DAY),'%d-%m-%Y'),'09:37:00'),
('admin','DEMO000034','Diclofenac gel','Gel','1%',1,90,90,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 14 DAY),'%d-%m-%Y'),'10:49:00'),
('Aarav','DEMO000009','Iron supplement','Tablet','100mg',3,4,12,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 14 DAY),'%d-%m-%Y'),'11:52:00'),
('admin','DEMO000029','Salbutamol inhaler','Spray','100mcg',4,150,600,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 14 DAY),'%d-%m-%Y'),'12:10:00'),
('admin','DEMO000031','Levothyroxine 50 mcg','Tablet','50mcg',3,2,6,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 14 DAY),'%d-%m-%Y'),'13:31:00'),
('Meera','DEMO000020','Petroleum jelly','Cream','25g',3,45,135,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 14 DAY),'%d-%m-%Y'),'14:59:00'),
('admin','DEMO000010','B-complex capsule','Capsule','1cap',2,5,10,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 13 DAY),'%d-%m-%Y'),'09:55:00'),
('Aarav','DEMO000040','Hydrocortisone cream','Cream','1%',2,65,130,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 13 DAY),'%d-%m-%Y'),'10:51:00'),
('admin','DEMO000016','Clotrimazole cream','Cream','1%',1,70,70,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 13 DAY),'%d-%m-%Y'),'11:38:00'),
('admin','DEMO000029','Salbutamol inhaler','Spray','100mcg',1,150,150,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 13 DAY),'%d-%m-%Y'),'12:09:00'),
('Riya','DEMO000040','Hydrocortisone cream','Cream','1%',4,65,260,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 13 DAY),'%d-%m-%Y'),'13:11:00'),
('Aarav','DEMO000018','Sunscreen SPF 50','Cream','50g',3,240,720,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 13 DAY),'%d-%m-%Y'),'14:03:00'),
('Aarav','DEMO000020','Petroleum jelly','Cream','25g',3,45,135,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 12 DAY),'%d-%m-%Y'),'09:49:00'),
('Aarav','DEMO000018','Sunscreen SPF 50','Cream','50g',3,240,720,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 12 DAY),'%d-%m-%Y'),'10:29:00'),
('admin','DEMO000023','Metformin 500 mg','Tablet','500mg',4,2.8,11.2,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 12 DAY),'%d-%m-%Y'),'11:47:00'),
('Aarav','DEMO000018','Sunscreen SPF 50','Cream','50g',1,240,240,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 12 DAY),'%d-%m-%Y'),'12:35:00'),
('Meera','DEMO000010','B-complex capsule','Capsule','1cap',2,5,10,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 12 DAY),'%d-%m-%Y'),'13:11:00'),
('Riya','DEMO000030','Montelukast 10 mg','Tablet','10mg',3,9,27,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 12 DAY),'%d-%m-%Y'),'14:54:00'),
('Meera','DEMO000037','Chlorhexidine rinse','Solution','0.2%',1,105,105,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 11 DAY),'%d-%m-%Y'),'09:24:00'),
('Meera','DEMO000021','Amoxicillin 500 mg','Capsule','500mg',2,7,14,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 11 DAY),'%d-%m-%Y'),'10:46:00'),
('Riya','DEMO000027','Pantoprazole 40 mg','Tablet','40mg',3,7,21,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 11 DAY),'%d-%m-%Y'),'11:10:00'),
('Aarav','DEMO000011','Zinc 20 mg','Tablet','20mg',3,3.5,10.5,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 11 DAY),'%d-%m-%Y'),'12:45:00'),
('Aarav','DEMO000023','Metformin 500 mg','Tablet','500mg',1,2.8,2.8,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 11 DAY),'%d-%m-%Y'),'13:50:00'),
('Riya','DEMO000018','Sunscreen SPF 50','Cream','50g',1,240,240,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 11 DAY),'%d-%m-%Y'),'14:11:00'),
('Riya','DEMO000036','Lactulose solution','Solution','100ml',2,135,270,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 10 DAY),'%d-%m-%Y'),'09:57:00'),
('Aarav','DEMO000023','Metformin 500 mg','Tablet','500mg',4,2.8,11.2,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 10 DAY),'%d-%m-%Y'),'10:02:00'),
('Riya','DEMO000021','Amoxicillin 500 mg','Capsule','500mg',3,7,21,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 10 DAY),'%d-%m-%Y'),'11:07:00'),
('admin','DEMO000030','Montelukast 10 mg','Tablet','10mg',1,9,9,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 10 DAY),'%d-%m-%Y'),'12:00:00'),
('Meera','DEMO000015','Povidone iodine','Solution','5%',2,60,120,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 10 DAY),'%d-%m-%Y'),'13:10:00'),
('Aarav','DEMO000033','Ibuprofen 200 mg','Tablet','200mg',2,3,6,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 10 DAY),'%d-%m-%Y'),'14:25:00'),
('admin','DEMO000025','Losartan 50 mg','Tablet','50mg',3,5.5,16.5,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 9 DAY),'%d-%m-%Y'),'09:38:00'),
('Aarav','DEMO000029','Salbutamol inhaler','Spray','100mcg',3,150,450,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 9 DAY),'%d-%m-%Y'),'10:27:00'),
('Meera','DEMO000019','Glucose powder','Powder','100g',2,55,110,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 9 DAY),'%d-%m-%Y'),'11:44:00'),
('Aarav','DEMO000020','Petroleum jelly','Cream','25g',2,45,90,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 9 DAY),'%d-%m-%Y'),'12:13:00'),
('Riya','DEMO000032','Folic acid 5 mg','Tablet','5mg',1,1.5,1.5,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 9 DAY),'%d-%m-%Y'),'13:22:00'),
('Riya','DEMO000032','Folic acid 5 mg','Tablet','5mg',3,1.5,4.5,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 9 DAY),'%d-%m-%Y'),'14:07:00'),
('Riya','DEMO000035','Cough syrup','Syrup','100ml',3,75,225,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 8 DAY),'%d-%m-%Y'),'09:37:00'),
('Aarav','DEMO000015','Povidone iodine','Solution','5%',3,60,180,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 8 DAY),'%d-%m-%Y'),'10:59:00'),
('Meera','DEMO000022','Azithromycin 500 mg','Tablet','500mg',2,18,36,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 8 DAY),'%d-%m-%Y'),'11:28:00'),
('Aarav','DEMO000009','Iron supplement','Tablet','100mg',3,4,12,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 8 DAY),'%d-%m-%Y'),'12:36:00'),
('Meera','DEMO000019','Glucose powder','Powder','100g',4,55,220,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 8 DAY),'%d-%m-%Y'),'13:34:00'),
('Meera','DEMO000021','Amoxicillin 500 mg','Capsule','500mg',2,7,14,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 8 DAY),'%d-%m-%Y'),'14:19:00'),
('admin','DEMO000015','Povidone iodine','Solution','5%',3,60,180,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 7 DAY),'%d-%m-%Y'),'09:23:00'),
('Meera','DEMO000018','Sunscreen SPF 50','Cream','50g',3,240,720,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 7 DAY),'%d-%m-%Y'),'10:54:00'),
('Aarav','DEMO000033','Ibuprofen 200 mg','Tablet','200mg',3,3,9,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 7 DAY),'%d-%m-%Y'),'11:21:00'),
('Aarav','DEMO000008','Vitamin D3 1000 IU','Tablet','1000IU',1,6,6,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 7 DAY),'%d-%m-%Y'),'12:23:00'),
('Riya','DEMO000021','Amoxicillin 500 mg','Capsule','500mg',4,7,28,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 7 DAY),'%d-%m-%Y'),'13:14:00'),
('Aarav','DEMO000025','Losartan 50 mg','Tablet','50mg',1,5.5,5.5,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 7 DAY),'%d-%m-%Y'),'14:35:00'),
('Riya','DEMO000029','Salbutamol inhaler','Spray','100mcg',4,150,600,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 6 DAY),'%d-%m-%Y'),'09:57:00'),
('admin','DEMO000012','Saline nasal spray','Spray','0.65%',4,65,260,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 6 DAY),'%d-%m-%Y'),'10:44:00'),
('Aarav','DEMO000038','Dextrose injection','Injection','25%',2,45,90,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 6 DAY),'%d-%m-%Y'),'11:36:00'),
('Riya','DEMO000029','Salbutamol inhaler','Spray','100mcg',2,150,300,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 6 DAY),'%d-%m-%Y'),'12:14:00'),
('admin','DEMO000013','Artificial tears','Drops','10ml',4,85,340,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 6 DAY),'%d-%m-%Y'),'13:55:00'),
('Riya','DEMO000036','Lactulose solution','Solution','100ml',4,135,540,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 6 DAY),'%d-%m-%Y'),'14:59:00'),
('Aarav','DEMO000016','Clotrimazole cream','Cream','1%',1,70,70,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 5 DAY),'%d-%m-%Y'),'09:35:00'),
('admin','DEMO000040','Hydrocortisone cream','Cream','1%',3,65,195,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 5 DAY),'%d-%m-%Y'),'10:55:00'),
('Riya','DEMO000018','Sunscreen SPF 50','Cream','50g',3,240,720,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 5 DAY),'%d-%m-%Y'),'11:52:00'),
('Aarav','DEMO000033','Ibuprofen 200 mg','Tablet','200mg',2,3,6,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 5 DAY),'%d-%m-%Y'),'12:26:00'),
('Meera','DEMO000031','Levothyroxine 50 mcg','Tablet','50mcg',3,2,6,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 5 DAY),'%d-%m-%Y'),'13:32:00'),
('Meera','DEMO000016','Clotrimazole cream','Cream','1%',3,70,210,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 5 DAY),'%d-%m-%Y'),'14:24:00'),
('Meera','DEMO000010','B-complex capsule','Capsule','1cap',2,5,10,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 4 DAY),'%d-%m-%Y'),'09:27:00'),
('Meera','DEMO000022','Azithromycin 500 mg','Tablet','500mg',3,18,54,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 4 DAY),'%d-%m-%Y'),'10:43:00'),
('Aarav','DEMO000027','Pantoprazole 40 mg','Tablet','40mg',2,7,14,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 4 DAY),'%d-%m-%Y'),'11:08:00'),
('Meera','DEMO000032','Folic acid 5 mg','Tablet','5mg',2,1.5,3.0,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 4 DAY),'%d-%m-%Y'),'12:56:00'),
('Aarav','DEMO000033','Ibuprofen 200 mg','Tablet','200mg',3,3,9,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 4 DAY),'%d-%m-%Y'),'13:32:00'),
('Meera','DEMO000014','Antacid suspension','Syrup','170ml',2,95,190,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 4 DAY),'%d-%m-%Y'),'14:00:00'),
('Meera','DEMO000030','Montelukast 10 mg','Tablet','10mg',2,9,18,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 3 DAY),'%d-%m-%Y'),'09:02:00'),
('Meera','DEMO000026','Atorvastatin 10 mg','Tablet','10mg',4,6,24,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 3 DAY),'%d-%m-%Y'),'10:28:00'),
('Aarav','DEMO000038','Dextrose injection','Injection','25%',4,45,180,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 3 DAY),'%d-%m-%Y'),'11:45:00'),
('admin','DEMO000009','Iron supplement','Tablet','100mg',2,4,8,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 3 DAY),'%d-%m-%Y'),'12:11:00'),
('Riya','DEMO000012','Saline nasal spray','Spray','0.65%',1,65,65,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 3 DAY),'%d-%m-%Y'),'13:10:00'),
('Riya','DEMO000025','Losartan 50 mg','Tablet','50mg',4,5.5,22.0,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 3 DAY),'%d-%m-%Y'),'14:48:00'),
('admin','DEMO000033','Ibuprofen 200 mg','Tablet','200mg',3,3,9,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 2 DAY),'%d-%m-%Y'),'09:00:00'),
('Aarav','DEMO000017','Moisturising cream','Cream','50g',1,110,110,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 2 DAY),'%d-%m-%Y'),'10:48:00'),
('Riya','DEMO000016','Clotrimazole cream','Cream','1%',4,70,280,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 2 DAY),'%d-%m-%Y'),'11:56:00'),
('Riya','DEMO000023','Metformin 500 mg','Tablet','500mg',3,2.8,8.4,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 2 DAY),'%d-%m-%Y'),'12:56:00'),
('Aarav','DEMO000009','Iron supplement','Tablet','100mg',1,4,4,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 2 DAY),'%d-%m-%Y'),'13:39:00'),
('Meera','DEMO000025','Losartan 50 mg','Tablet','50mg',1,5.5,5.5,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 2 DAY),'%d-%m-%Y'),'14:36:00'),
('Aarav','DEMO000035','Cough syrup','Syrup','100ml',2,75,150,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 1 DAY),'%d-%m-%Y'),'09:41:00'),
('Riya','DEMO000025','Losartan 50 mg','Tablet','50mg',1,5.5,5.5,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 1 DAY),'%d-%m-%Y'),'10:05:00'),
('Riya','DEMO000015','Povidone iodine','Solution','5%',3,60,180,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 1 DAY),'%d-%m-%Y'),'11:41:00'),
('Meera','DEMO000038','Dextrose injection','Injection','25%',1,45,45,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 1 DAY),'%d-%m-%Y'),'12:18:00'),
('Aarav','DEMO000034','Diclofenac gel','Gel','1%',3,90,270,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 1 DAY),'%d-%m-%Y'),'13:14:00'),
('Meera','DEMO000038','Dextrose injection','Injection','25%',3,45,135,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 1 DAY),'%d-%m-%Y'),'14:15:00'),
('Riya','DEMO000033','Ibuprofen 200 mg','Tablet','200mg',3,3,9,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 0 DAY),'%d-%m-%Y'),'09:38:00'),
('admin','DEMO000021','Amoxicillin 500 mg','Capsule','500mg',4,7,28,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 0 DAY),'%d-%m-%Y'),'10:38:00'),
('admin','DEMO000036','Lactulose solution','Solution','100ml',1,135,135,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 0 DAY),'%d-%m-%Y'),'11:18:00'),
('Meera','DEMO000022','Azithromycin 500 mg','Tablet','500mg',3,18,54,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 0 DAY),'%d-%m-%Y'),'12:53:00'),
('Aarav','DEMO000015','Povidone iodine','Solution','5%',4,60,240,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 0 DAY),'%d-%m-%Y'),'13:43:00'),
('Aarav','DEMO000036','Lactulose solution','Solution','100ml',2,135,270,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 0 DAY),'%d-%m-%Y'),'14:58:00'),
('Aarav','DEMO000016','Clotrimazole cream','Cream','1%',4,70,280,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 0 DAY),'%d-%m-%Y'),'15:17:00'),
('Aarav','DEMO000022','Azithromycin 500 mg','Tablet','500mg',2,18,36,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 0 DAY),'%d-%m-%Y'),'16:48:00'),
('Aarav','DEMO000011','Zinc 20 mg','Tablet','20mg',4,3.5,14.0,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 0 DAY),'%d-%m-%Y'),'17:28:00');


INSERT INTO `sales` (`BARCODE`,`NAME`,`TYPE`,`DOSE`,`QUANTITY`,`PRICE`,`AMOUNT`,`DATE`) VALUES
('DEMO000033','Ibuprofen 200 mg','Tablet','200mg',3,3,9,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 0 DAY),'%d-%m-%Y')),
('DEMO000021','Amoxicillin 500 mg','Capsule','500mg',4,7,28,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 0 DAY),'%d-%m-%Y')),
('DEMO000036','Lactulose solution','Solution','100ml',1,135,135,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 0 DAY),'%d-%m-%Y')),
('DEMO000022','Azithromycin 500 mg','Tablet','500mg',3,18,54,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 0 DAY),'%d-%m-%Y')),
('DEMO000015','Povidone iodine','Solution','5%',4,60,240,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 0 DAY),'%d-%m-%Y')),
('DEMO000036','Lactulose solution','Solution','100ml',2,135,270,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 0 DAY),'%d-%m-%Y')),
('DEMO000016','Clotrimazole cream','Cream','1%',4,70,280,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 0 DAY),'%d-%m-%Y')),
('DEMO000022','Azithromycin 500 mg','Tablet','500mg',2,18,36,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 0 DAY),'%d-%m-%Y')),
('DEMO000011','Zinc 20 mg','Tablet','20mg',4,3.5,14.0,DATE_FORMAT(DATE_SUB(@seed_today,INTERVAL 0 DAY),'%d-%m-%Y'));


INSERT INTO `expiry` (`PRODUCT_NAME`,`PRODUCT_CODE`,`DATE_OF_EXPIRY`,`QUANTITY_REMAIN`) VALUES
('Paracetamol 500 mg','M001',DATE_FORMAT(DATE_ADD(@seed_today,INTERVAL -15 DAY),'%d-%m-%Y'),5),
('Paracetamol 650 mg','M002',DATE_FORMAT(DATE_ADD(@seed_today,INTERVAL -3 DAY),'%d-%m-%Y'),8),
('Cetirizine 10 mg','M003',DATE_FORMAT(DATE_ADD(@seed_today,INTERVAL -60 DAY),'%d-%m-%Y'),0);


INSERT INTO `inbox` (`MESSAGE_FROM`,`MESSAGE_TO`,`MESSAGE_TEXT`) VALUES
('admin','Meera','Review the three expired medicine records before billing.'),
('Aarav','admin','Two inventory items are out of stock. Please arrange replenishment.'),
('Meera','Riya','Check shelf locations before receiving the next delivery.'),
('Riya','admin','Daily sales records have been updated.');


INSERT INTO `message_history` (`MESSAGE_FROM`,`MESSAGE_TO`,`MESSAGE_TEXT`) VALUES
('admin','Meera','Review the three expired medicine records before billing.'),
('Aarav','admin','Two inventory items are out of stock. Please arrange replenishment.'),
('Meera','Riya','Check shelf locations before receiving the next delivery.'),
('Riya','admin','Daily sales records have been updated.');


INSERT INTO `login` (`NAME`,`TYPE`,`DATE`,`TIME`) VALUES
('admin','Admin',DATE_FORMAT(@seed_today,'%d-%m-%Y'),'09:00:00'),
('Aarav','Employee',DATE_FORMAT(@seed_today,'%d-%m-%Y'),'09:00:00'),
('Meera','Employee',DATE_FORMAT(@seed_today,'%d-%m-%Y'),'09:00:00'),
('Riya','Employee',DATE_FORMAT(@seed_today,'%d-%m-%Y'),'09:00:00'),
('Kabir','Employee',DATE_FORMAT(@seed_today,'%d-%m-%Y'),'09:00:00');


COMMIT;

-- Verification: should show 40 medicines, 8 companies, 5 users, 183 historical sales.
SELECT COUNT(*) AS medicines FROM drugs;
SELECT COUNT(*) AS companies FROM company;
SELECT COUNT(*) AS staff FROM users;
SELECT COUNT(*) AS historical_sales FROM history_sales;
SELECT COUNT(*) AS expired_medicines FROM drugs WHERE EXPIRATION_DATE < CURDATE();
SELECT COUNT(*) AS low_stock_including_zero FROM drugs WHERE QUANTITY <= 10;
SELECT COALESCE(SUM(AMOUNT),0) AS sales_today FROM history_sales WHERE DATE=DATE_FORMAT(CURDATE(),'%d-%m-%Y');
