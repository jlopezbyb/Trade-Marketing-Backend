
create table if not exists `location` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(75) NOT NULL,
  `address` varchar(75) NOT NULL,
  `contact_reference` varchar(60) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `comments` varchar(255) DEFAULT NULL,
  `number_of_identifier` varchar(25) DEFAULT NULL,
  `status` enum('ACTIVO','INACTIVO') NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  primary key (`id`),
  unique key `id` (`id`)
) engine=innodb default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;


create table if not exists `slot` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `location_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `slot_number` varchar(25) NOT NULL,
  `slot_type` enum('SIMPLE','MULTIPLE') NOT NULL,
  `limit_of_assignments` smallint NOT NULL,
  `vehicle_type` enum('CARRO','MOTO','CAMION') NOT NULL,
  `benefit_type` enum('SIN_COSTO','COMPLEMENTO','DESCUENTO') NOT NULL,
  `amount` float(5,2) NOT NULL,
  `status` enum('DISPONIBLE','INACTIVO','OCUPADO') NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  primary key (`id`),
  unique key `id` (`id`),
  key `location_id` (`location_id`),
  constraint `slot_ibfk_1` foreign key (`location_id`) references `location` (`id`) on delete cascade on update cascade
) engine=innodb default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;


CREATE TABLE `employee` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `employee_code` varchar(12) NOT NULL,
  `name` varchar(75) DEFAULT NULL,
  `workplace` varchar(100) DEFAULT NULL,
  `identifier_document` varchar(20) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `sub_management` varchar(100) DEFAULT NULL,
  `management1` varchar(100) DEFAULT NULL,
  `management2` varchar(100) DEFAULT NULL,
  `work_site` varchar(100) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `access_token` varchar(100) DEFAULT NULL,
  `access_token_status` enum('ACTIVO','INACTIVO') DEFAULT 'INACTIVO',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_code` (`employee_code`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `vehicle` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `employee_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `vehicle_badge` varchar(10) NOT NULL,
  `color` varchar(20) DEFAULT NULL,
  `brand` varchar(20) DEFAULT NULL,
  `model` varchar(50) DEFAULT NULL,
  `type` enum('CARRO','MOTO','CAMION') DEFAULT 'CARRO',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `vehicle_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `assignment` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `slot_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `employee_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `parking_card_number` varchar(255) DEFAULT NULL,
  `benefit_type` enum('SIN_COSTO','DESCUENTO','COMPLEMENTO') NOT NULL,
  `assignment_date` date DEFAULT NULL,
  `form_decision_date` date DEFAULT NULL,
  `status` enum('ASIGNADO','EN_PROGRESO','CANCELADO','RECHAZADO','ACEPTADO','BAJA_AUTOMATICA','BAJA_MANUAL') DEFAULT 'ASIGNADO',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `slot_id` (`slot_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `assignment_ibfk_1` FOREIGN KEY (`slot_id`) REFERENCES `slot` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `assignment_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `assignment_loan` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `assignment_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `employee_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `start_date_assignment` date NOT NULL,
  `end_date_assignment` date NOT NULL,
  `assignment_date` date NOT NULL,
  `status` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `assignment_id` (`assignment_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `assignment_loan_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignment` (`id`),
  CONSTRAINT `assignment_loan_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `de_assignment` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `assignment_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `reason` varchar(255) NOT NULL,
  `de_assignment_date` date NOT NULL,
  `is_rpa_action` tinyint(1) DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `assignment_id` (`assignment_id`),
  CONSTRAINT `de_assignment_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignment` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `discount_note` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `assignment_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `status_signature` enum('PENDIENTE','APROBADO','RECHAZADO','CANCELADO') DEFAULT 'PENDIENTE',
  `status_dispatched` enum('EXITOSO','FALLIDO','PENDIENTE','REINTENTANDO') DEFAULT 'PENDIENTE',
  `last_notice` datetime DEFAULT NULL,
  `next_notice` datetime DEFAULT NULL,
  `reminder_frequency` int DEFAULT '3',
  `dispatch_attempts` int DEFAULT '0',
  `max_dispatch_attempts` int DEFAULT '3',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `assignment_id` (`assignment_id`),
  CONSTRAINT `discount_note_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignment` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `tag` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVO','INACTIVO') NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `assignment_tag_detail` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `assignment_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `tag_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `assignment_tag_detail_assignmentId_tagId_unique` (`assignment_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `assignment_tag_detail_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `assignment_tag_detail_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `parking_occupancy_trends` (
  `id` int NOT NULL AUTO_INCREMENT,
  `location_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `date` date NOT NULL,
  `total_slots` int NOT NULL,
  `available_slots` int NOT NULL,
  `unavailable_slots` int NOT NULL,
  `occupied_slots` int NOT NULL,
  `occupancy_rate` decimal(5,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `location_id` (`location_id`),
  CONSTRAINT `parking_occupancy_trends_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2886 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `resource` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `role` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(35) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `role_detail` (
  `role_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `resource_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `can_access` tinyint(1) DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`role_id`,`resource_id`),
  KEY `resource_id` (`resource_id`),
  CONSTRAINT `role_detail_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  CONSTRAINT `role_detail_ibfk_2` FOREIGN KEY (`resource_id`) REFERENCES `resource` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `setting` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `setting_key` varchar(255) NOT NULL,
  `setting_value` varchar(500) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `user` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `username` varchar(35) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `password` varchar(50) DEFAULT NULL,
  `role_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `status` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `notification_type` (
  `notification_type` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`notification_type`),
  UNIQUE KEY `notification_type` (`notification_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `notification_preference` (
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `notification_type` varchar(255) NOT NULL,
  `enable` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`user_id`,`notification_type`),
  KEY `notification_type` (`notification_type`),
  CONSTRAINT `notification_preference_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `notification_preference_ibfk_2` FOREIGN KEY (`notification_type`) REFERENCES `notification_type` (`notification_type`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `notification_queue` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `event_type` enum('ACCEPTANCE_FORM','ACCEPTANCE_ASSIGNMENT','MANUAL_DE_ASSIGNMENT','AUTO_DE_ASSIGNMENT','DISCOUNT_NOTE','ASSIGNMENT_LOAN','DE_ASSIGNMENT_LOAN') NOT NULL,
  `payload` json NOT NULL,
  `status` enum('PENDING','IN_PROGRESS','DISPATCHED','FAILED','RETRYING') NOT NULL,
  `attempts` smallint NOT NULL DEFAULT '0',
  `max_retries` smallint NOT NULL DEFAULT '3',
  `dispatched_at` datetime DEFAULT NULL,
  `error_message` text,
  `next_attempt` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `version` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `template_email` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `type` enum('ACCEPTANCE_FORM','ACCEPTANCE_ASSIGNMENT','MANUAL_DE_ASSIGNMENT','AUTO_DE_ASSIGNMENT','DISCOUNT_NOTE','ASSIGNMENT_LOAN','DE_ASSIGNMENT_LOAN') NOT NULL,
  `template_name` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `template_parameter` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `parameter_name` varchar(255) NOT NULL,
  `parameter_description` varchar(255) NOT NULL,
  `example_value` varchar(255) NOT NULL,
  `entity` varchar(255) NOT NULL,
  `column_name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



delimiter ;;
create procedure if not exists `get_active_assignments_by_location`(in p_location_id varchar(255))
begin
	select
		s.id as slot_id,
		l.id as location_id,
		count(a.id) current_number_of_assignments,
		s.limit_of_assignments
	from
		`assignment` a
	inner join slot s on
		a.slot_id = s.id
	inner join location l on
		s.location_id = l.id
    where s.status = 'OCUPADO'
      and a.status in ('ASIGNADO', 'EN_PROGRESO', 'ACEPTADO')
		and l.id = p_location_id
	group by
		a.id;
end ;;
delimiter ;


delimiter ;;
create function if not exists `location_has_active_assignment`(location_id varchar(255))
returns tinyint(1)
reads sql data
begin
    declare hasactiveassignment boolean;

    select exists (
        select 1
        from slot where slot.location_id = location_id
                  and status = 'OCUPADO'
    ) into hasactiveassignment;

    return hasactiveassignment;
end ;;
delimiter ;


delimiter ;;
create function employee_has_an_active_assignment(emplo_id varchar(255))
returns boolean
reads sql data
begin
    declare hasassignment boolean;

    select exists (
        select 1
        from assignment a
        where a.employee_id = emplo_id
          and a.status in ('ASIGNADO', 'EN_PROGRESO', 'ACEPTADO')
        union all
        select 1
        from assignment_loan al
        where al.employee_id = emplo_id
          and al.status = 'ACTIVO'
    ) into hasassignment;

    return hasassignment;
end ;;
delimiter ;


delimiter ;;
create function can_create_more_assignments_in_slot(slt_id varchar(255))
returns boolean
reads sql data
begin
    declare assignments_allowed int;
    declare assignments_created int;

    select limit_of_assignments into assignments_allowed
    from slot
    where id = slt_id;

    select count(*) into assignments_created
    from `assignment` a
    where slot_id = slt_id and status not in ('BAJA_AUTOMATICA', 'BAJA_MANUAL', 'CANCELADO', 'RECHAZADO');

    if assignments_created < assignments_allowed then
        return true;
    else
        return false;
    end if;
end ;;
delimiter ;

delimiter ;;
create function get_active_assignments_by_slot(slotIdentifier varchar(255))
    returns integer
    reads sql data
begin
    declare counterAssignments int default 0;

    select count(*) into counterAssignments
    from assignment
             inner join slot on assignment.slot_id = slot.id
    where assignment.slot_id = slotIdentifier
      and assignment.status in ('ASIGNADO', 'EN_PROGRESO', 'ACEPTADO');

    return counterAssignments;
end;;
delimiter ;



delimiter ;;
create trigger in_change_slot_status_to_occupied
after insert on assignment
for each row
    begin
        update slot set status = 'OCUPADO' where id = NEW.slot_id;
    end ;;
delimiter ;



delimiter ;;
create trigger up_change_slot_status_to_available
    after update
    on assignment
    for each row
begin
    declare current_active_assignments integer;
    if (old.status != new.status AND new.status in ('CANCELADO', 'RECHAZADO', 'BAJA_MANUAL', 'BAJA_AUTOMATICA')) then
        select ifnull(count(*), 0)
        into current_active_assignments
        from assignment
        where slot_id = new.slot_id
          and status in ('ASIGNADO', 'EN_PROGRESO', 'ACEPTADO');

        if (current_active_assignments = 0) then
            update slot set status = 'DISPONIBLE' where id = new.slot_id;
        end if;

        update discount_note set status_signature = 'RECHAZADO', status_dispatched = 'EXITOSO' where assignment_id = NEW.id and status_signature = 'PENDIENTE';
        update assignment_loan set status = 'INACTIVO' where assignment_id = NEW.id and status = 'ACTIVO';

    end if;
end ;;
delimiter ;




delimiter ;;
create trigger in_change_status_assignment
before insert on de_assignment
for each row
    begin
        update assignment set status = 'BAJA_MANUAL' where id = NEW.assignment_id;
    end ;;
delimiter ;

delimiter ;;
create trigger in_create_preference_notifications
    after insert
    on user
    for each row
begin
    insert into notification_preference
        (select new.id, nt.notification_type, false, current_timestamp, current_timestamp from notification_type as nt);

end ;;
delimiter ;

delimiter ;;
create trigger de_delete_preference_notifications
after delete on user
    for each row
    begin
        delete from notification_preference where user_id = old.id;
    end ;;
delimiter ;



create or replace view location_slot_summary as
select location_id,
       count(*)                                               as total_slots,
       sum(case when status = 'DISPONIBLE' then 1 else 0 end) as available_slots,
       sum(case when status = 'INACTIVO' then 1 else 0 end)   as unavailable_slots,
       sum(case when status = 'OCUPADO' then 1 else 0 end)    as occupied_slots
from slot where deleted_at is null
group by location_id;



set global event_scheduler = on;
delimiter ;;
create event record_parking_occupancy
on schedule every 24 hour
starts  concat(date_add(curdate(), interval 1 day), ' 00:00:00')
do
begin
    insert into parking_occupancy_trends(location_id, date, total_slots, available_slots, unavailable_slots, occupied_slots, occupancy_rate)
    select
        location_id,
        current_date(),
        nullif(total_slots, 0) as total_slots,
        nullif(available_slots, 0) as available_slots,
        nullif(unavailable_slots, 0) as unavailable_slots,
        nullif(occupied_slots, 0) as occupied_slots,
        round(((occupied_slots / nullif(total_slots, 0)) * 100),2) as occupancy_rate
    from location_slot_summary;
end ;;
delimiter ;

delimiter ;;
create event de_assignment_loan
on schedule every 24 hour
starts  concat(date_add(curdate(), interval 1 day), ' 00:00:00')
do
begin
    update assignment_loan set status = 'INACTIVO' where end_date_assignment = adddate(current_date, -1);
end ;;
delimiter ;

insert into resource values ('76576cf3-09e5-4172-8acf-de56c49e75e7', 'dashboard', '', current_date, current_date);
insert into resource values ('4142c1ab-e3e5-43c4-979a-001c779cc150', 'notifications', '', current_date, current_date);
insert into resource values ('dd688388-e528-4c73-9f68-88faa7ad933a', 'management-locations', '', current_date, current_date);

INSERT INTO `setting` VALUES
('70d41c5d-488f-4852-81c8-e6d58c206335','MAX_DAYS_TO_ASSIGNMENT_LOAN','15','Máximo de días permitido para asignaciones temporales','2024-09-05 00:00:00','2024-09-05 00:00:00'),
('895b40e8-2fbf-4312-bd2e-15aa3ae96c82','WS_EMPLOYEES','https://jsonplaceholder.typicode.com/users','Web service','2024-08-13 00:00:00','2024-08-13 00:00:00'),
('bb9b8b5c-e42e-4995-8c13-177ee0f363b1','SIGNATURES_FOR_ACCEPTANCE_FORM','{\"security_boss\":{\"name\":\"securityBoss\",\"employee_code\":\"57123456789\"},\"parking_manager\":{\"name\":\"parkingManager\",\"employee_code\":\"57123456789\"},\"human_resources_manager\":{\"name\":\"humanResourcesManager\",\"employee_code\":\"57123456789\"},\"human_resources_payroll\":{\"name\":\"humanResourcesPayroll\",\"employee_code\":\"57123456789\"}}','Personal que firma formularios de aceptación','2024-09-03 00:00:00','2024-09-03 00:00:00');


INSERT INTO `notification_type` VALUES
('ACCEPTANCE_ASSIGNMENT','Notificación por asignación aceptada','2024-09-30 23:42:32','2024-09-30 23:42:32'),
('ACCEPTANCE_FORM','Notificación por envío formulario de aceptación','2024-09-30 23:42:32','2024-09-30 23:42:32');


INSERT INTO `template_email` VALUES ('f20ea783-7c49-11ef-b999-0242ac120002','ACCEPTANCE_FORM','CORREO FORMULARIO DE ACEPTACION','Formulario de aceptación','Estimado/a {{employee_guest_name}},\n\nNos complace darte la bienvenida a tu asignación. A continuación, encontrarás los detalles importantes:\n\nFecha de Asignación: {{assignment_date}}\nCódigo del Empleado Invitado: {{employee_guest_code}}\nNombre del Empleado Invitado: {{employee_guest_name}}\nCódigo del Empleado Propietario: {{employee_owner_code}}\nNombre del Empleado Propietario: {{employee_owner_name}}\nInicio del Préstamo: {{loan_start}}\nFin del Préstamo: {{loan_end}}\nNúmero de Plaza: {{slot_number}}\nUbicación:\n\nNombre de la Ubicación: {{location_name}}\nDirección de la Ubicación: {{location_address}}\nTeléfono de la Ubicación: {{location_phone}}\nCorreo Electrónico de la Ubicación: {{location_email}}\nEstamos aquí para ayudarte con cualquier pregunta o inquietud que puedas tener. No dudes en ponerte en contacto con nosotros.\n\n¡Te deseamos una excelente experiencia!\n\nAtentamente,\n\nEl Equipo de [Nombre de tu Organización]','2024-09-26 20:57:30','2024-09-26 20:57:30'),('f219470b-7c49-11ef-b999-0242ac120002','ACCEPTANCE_ASSIGNMENT','CORREO POR ACEPTACIÓN DE ASIGNACION','Asignación de parqueo','Estimado/a {{employee_guest_name}},\n\nNos complace darte la bienvenida a tu asignación. A continuación, encontrarás los detalles importantes:\n\nFecha de Asignación: {{assignment_date}}\nCódigo del Empleado Invitado: {{employee_guest_code}}\nNombre del Empleado Invitado: {{employee_guest_name}}\nCódigo del Empleado Propietario: {{employee_owner_code}}\nNombre del Empleado Propietario: {{employee_owner_name}}\nInicio del Préstamo: {{loan_start}}\nFin del Préstamo: {{loan_end}}\nNúmero de Plaza: {{slot_number}}\nUbicación:\n\nNombre de la Ubicación: {{location_name}}\nDirección de la Ubicación: {{location_address}}\nTeléfono de la Ubicación: {{location_phone}}\nCorreo Electrónico de la Ubicación: {{location_email}}\nEstamos aquí para ayudarte con cualquier pregunta o inquietud que puedas tener. No dudes en ponerte en contacto con nosotros.\n\n¡Te deseamos una excelente experiencia!\n\nAtentamente,\n\nEl Equipo de [Nombre de tu Organización]','2024-09-26 20:57:30','2024-09-26 20:57:30'),('f2242d1d-7c49-11ef-b999-0242ac120002','MANUAL_DE_ASSIGNMENT','CORREO POR BAJA MANUAL DE ASIGNACION','Baja manual de asignación','Estimado/a {{employee_guest_name}},\n\nNos complace darte la bienvenida a tu asignación. A continuación, encontrarás los detalles importantes:\n\nFecha de Asignación: {{assignment_date}}\nCódigo del Empleado Invitado: {{employee_guest_code}}\nNombre del Empleado Invitado: {{employee_guest_name}}\nCódigo del Empleado Propietario: {{employee_owner_code}}\nNombre del Empleado Propietario: {{employee_owner_name}}\nInicio del Préstamo: {{loan_start}}\nFin del Préstamo: {{loan_end}}\nNúmero de Plaza: {{slot_number}}\nUbicación:\n\nNombre de la Ubicación: {{location_name}}\nDirección de la Ubicación: {{location_address}}\nTeléfono de la Ubicación: {{location_phone}}\nCorreo Electrónico de la Ubicación: {{location_email}}\nEstamos aquí para ayudarte con cualquier pregunta o inquietud que puedas tener. No dudes en ponerte en contacto con nosotros.\n\n¡Te deseamos una excelente experiencia!\n\nAtentamente,\n\nEl Equipo de [Nombre de tu Organización]','2024-09-26 20:57:30','2024-09-26 20:57:30'),('f22eff50-7c49-11ef-b999-0242ac120002','AUTO_DE_ASSIGNMENT','CORREO POR BAJA AUTOMATICA DE ASIGNACION','Baja automática de asignación','Estimado/a {{employee_guest_name}},\n\nNos complace darte la bienvenida a tu asignación. A continuación, encontrarás los detalles importantes:\n\nFecha de Asignación: {{assignment_date}}\nCódigo del Empleado Invitado: {{employee_guest_code}}\nNombre del Empleado Invitado: {{employee_guest_name}}\nCódigo del Empleado Propietario: {{employee_owner_code}}\nNombre del Empleado Propietario: {{employee_owner_name}}\nInicio del Préstamo: {{loan_start}}\nFin del Préstamo: {{loan_end}}\nNúmero de Plaza: {{slot_number}}\nUbicación:\n\nNombre de la Ubicación: {{location_name}}\nDirección de la Ubicación: {{location_address}}\nTeléfono de la Ubicación: {{location_phone}}\nCorreo Electrónico de la Ubicación: {{location_email}}\nEstamos aquí para ayudarte con cualquier pregunta o inquietud que puedas tener. No dudes en ponerte en contacto con nosotros.\n\n¡Te deseamos una excelente experiencia!\n\nAtentamente,\n\nEl Equipo de [Nombre de tu Organización]','2024-09-26 20:57:30','2024-09-26 20:57:30'),('f23889c9-7c49-11ef-b999-0242ac120002','DISCOUNT_NOTE','CORREO POR NOTA ACEPTACIÓN DE DESCUENTO','Nota de aceptación de descuento','Estimado/a {{employee_guest_name}},\n\nNos complace darte la bienvenida a tu asignación. A continuación, encontrarás los detalles importantes:\n\nFecha de Asignación: {{assignment_date}}\nCódigo del Empleado Invitado: {{employee_guest_code}}\nNombre del Empleado Invitado: {{employee_guest_name}}\nCódigo del Empleado Propietario: {{employee_owner_code}}\nNombre del Empleado Propietario: {{employee_owner_name}}\nInicio del Préstamo: {{loan_start}}\nFin del Préstamo: {{loan_end}}\nNúmero de Plaza: {{slot_number}}\nUbicación:\n\nNombre de la Ubicación: {{location_name}}\nDirección de la Ubicación: {{location_address}}\nTeléfono de la Ubicación: {{location_phone}}\nCorreo Electrónico de la Ubicación: {{location_email}}\nEstamos aquí para ayudarte con cualquier pregunta o inquietud que puedas tener. No dudes en ponerte en contacto con nosotros.\n\n¡Te deseamos una excelente experiencia!\n\nAtentamente,\n\nEl Equipo de [Nombre de tu Organización]','2024-09-26 20:57:31','2024-09-26 20:57:31'),('f241f55e-7c49-11ef-b999-0242ac120002','ASSIGNMENT_LOAN','CORREO DE ASIGNACION TEMPORAL','Asignación temporal','Estimado/a {{employee_guest_name}},\n\nNos complace darte la bienvenida a tu asignación. A continuación, encontrarás los detalles importantes:\n\nFecha de Asignación: {{assignment_date}}\nCódigo del Empleado Invitado: {{employee_guest_code}}\nNombre del Empleado Invitado: {{employee_guest_name}}\nCódigo del Empleado Propietario: {{employee_owner_code}}\nNombre del Empleado Propietario: {{employee_owner_name}}\nInicio del Préstamo: {{loan_start}}\nFin del Préstamo: {{loan_end}}\nNúmero de Plaza: {{slot_number}}\nUbicación:\n\nNombre de la Ubicación: {{location_name}}\nDirección de la Ubicación: {{location_address}}\nTeléfono de la Ubicación: {{location_phone}}\nCorreo Electrónico de la Ubicación: {{location_email}}\nEstamos aquí para ayudarte con cualquier pregunta o inquietud que puedas tener. No dudes en ponerte en contacto con nosotros.\n\n¡Te deseamos una excelente experiencia!\n\nAtentamente,\n\nEl Equipo de [Nombre de tu Organización]','2024-09-26 20:57:31','2024-09-26 20:57:31'),('f24b4de7-7c49-11ef-b999-0242ac120002','DE_ASSIGNMENT_LOAN','CORREO BAJA DE ASIGNACIÓN TEMPORAL','Baja de asignación temporal','Estimado/a {{employee_guest_name}},\n\nNos complace darte la bienvenida a tu asignación. A continuación, encontrarás los detalles importantes:\n\nFecha de Asignación: {{assignment_date}}\nCódigo del Empleado Invitado: {{employee_guest_code}}\nNombre del Empleado Invitado: {{employee_guest_name}}\nCódigo del Empleado Propietario: {{employee_owner_code}}\nNombre del Empleado Propietario: {{employee_owner_name}}\nInicio del Préstamo: {{loan_start}}\nFin del Préstamo: {{loan_end}}\nNúmero de Plaza: {{slot_number}}\nUbicación:\n\nNombre de la Ubicación: {{location_name}}\nDirección de la Ubicación: {{location_address}}\nTeléfono de la Ubicación: {{location_phone}}\nCorreo Electrónico de la Ubicación: {{location_email}}\nEstamos aquí para ayudarte con cualquier pregunta o inquietud que puedas tener. No dudes en ponerte en contacto con nosotros.\n\n¡Te deseamos una excelente experiencia!\n\nAtentamente,\n\nEl Equipo de [Nombre de tu Organización]','2024-09-26 20:57:31','2024-09-26 20:57:31');


INSERT INTO `template_parameter` VALUES ('f5f2909d-7c49-11ef-b999-0242ac120002','{{employee_owner_name}}','Nombre del propietario del parqueo','Bryan Solares','employeeOwner','name','2024-09-26 20:57:37','2024-09-26 20:57:37'),('f5ff7571-7c49-11ef-b999-0242ac120002','{{employee_owner_code}}','Código de empleado, propietario del parqueo','ABC12345','employeeOwner','employeeCode','2024-09-26 20:57:37','2024-09-26 20:57:37'),('f6090f18-7c49-11ef-b999-0242ac120002','{{employee_guest_name}}','Nombre del invitado del parqueo','Bryan Solares','employeeGuest','name','2024-09-26 20:57:37','2024-09-26 20:57:37'),('f61430e3-7c49-11ef-b999-0242ac120002','{{employee_guest_code}}','Código del empleado, invitado del parqueo','ABC12345','employeeGuest','employeeCode','2024-09-26 20:57:37','2024-09-26 20:57:37'),('f61dea8e-7c49-11ef-b999-0242ac120002','{{location_name}}','Nombre de la ubicación del parqueo','Parqueo buena paz','location','name','2024-09-26 20:57:37','2024-09-26 20:57:37'),('f6283858-7c49-11ef-b999-0242ac120002','{{location_address}}','Código de empleado, propietario del parqueo','Guatemala zona 1','location','address','2024-09-26 20:57:37','2024-09-26 20:57:37'),('f63103cb-7c49-11ef-b999-0242ac120002','{{location_email}}','Correo electrónico de la ubicación del parqueo','ubicacion@mail.com','location','email','2024-09-26 20:57:37','2024-09-26 20:57:37'),('f639e4e4-7c49-11ef-b999-0242ac120002','{{location_phone}}','Número de télefono de la ubicación del parqueo','+(502) 4545-4545','location','phone','2024-09-26 20:57:37','2024-09-26 20:57:37'),('f64590b0-7c49-11ef-b999-0242ac120002','{{slot_number}}','Número de identificación del espacio asignado','Sotano#100','slot','slotNumber','2024-09-26 20:57:37','2024-09-26 20:57:37'),('f64e6397-7c49-11ef-b999-0242ac120002','{{assignment_date}}','Fecha de asignación','24/09/2024','assignment','assignmentDate','2024-09-26 20:57:37','2024-09-26 20:57:37'),('f656b966-7c49-11ef-b999-0242ac120002','{{loan_start}}','Fecha de inicio para prestamo de parqueo','24/09/2024','assignmentLoan','startDateAssignment','2024-09-26 20:57:37','2024-09-26 20:57:37'),('f65fc1af-7c49-11ef-b999-0242ac120002','{{loan_end}}','Fecha de finalización para prestamo de parqueo','25/09/2024','assignmentLoan','endDateAssignment','2024-09-26 20:57:37','2024-09-26 20:57:37');
