# Assignments
## Create
[X] Creación de asignación con datos correctos
[X] Estado de slot cambia a ocupado
[X] Creación de asignaciones según límite establecido en slot
[X] Validación de datos de empleado
[X] Validación de datos de vehículo
[X] No se puede crear asignación sobre slot inexistente
[X] El slot enviado deberá tener un estructura de UUID
[X] No se puede crear asignaciones en una ubicación INACTIVA
[X] No se puede crear asignaciones para un slot INACTIVO o OCUPADO simple
[X] No se puede crear asignación a un empleado identificado que no existe
[X] No se puede puede envíar vehículos identificados si un empleado no está identificado
[ ] No se puede crear asignación a un empleado que tenga asignación temporal
[X] Cuando se envía vehículos identificados bajo un empleado existente, estos serán actualizados y no crean más
[X] Etiquetas enviadas deberán existir en base de datos para continuar con la asignación

500 cuando se envío el mismo request 3 veces (el problema se da por el paralelismo, se toma el mismo uuid al mismo tiempo, comprobar temas de simultaneidad)

## Acceptance Form
## Create form
[X] El id de la asignación enviada debe existir como asignación activa
[X] Se valida que el id de la asignación tenga formato UUID
[X] Solo se puede crear formulario de aceptación cuando una asignación está en "ASIGNADO" o "EN_PROGRESO"
[X] Al crear el formulario cambiar el estado de la asignación a "EN_PROGRESO"
[X] Se valida estructura de datos enviados en petición
[X] Se puede utilizar endpoint N veces si está en estado "EN_PROGRESO"

## Update status
[X] Cambio de estado a asignación según el tipo enviado
[X] No se puede actualizar estado si no está en "EN_PROGRESO"
[X] La asignación enviada debe ser válida
[X] Se valida que el id de la asignación tenga formato UUID
[X] Se valida estructura de datos enviados en petición

## GET Data for acceptance form
[X] Se devuelve información de empleado actual, empleado anterior y datos para firma de asignación solicitada
[X] No devuelve información a partir de Id de asignación no existente
[X] Se valida que ID de asignación tenga formato UUID
[X] Solo si la asignación tiene estado "EN_PROGRESO" o "ASIGNADO" se puede obtener información
[X] Si no hay información de firmantes se rechaza la petición
[ ] Se recuperación información de empleado que anteriormente ocupada espacio


[ ] comprobar objeto de-assignment


