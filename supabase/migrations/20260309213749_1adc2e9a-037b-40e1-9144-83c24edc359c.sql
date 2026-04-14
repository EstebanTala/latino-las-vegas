UPDATE taxonomy_amenities SET name = CASE id
  WHEN 'd5c7e726-22fa-44a8-9b41-d2693a261710' THEN 'Aire acondicionado'
  WHEN '8f275c72-7e26-418a-bb9c-4d514bc4405d' THEN 'Habitaciones no fumadores'
  WHEN 'b97e7f13-4724-48ef-8ec3-3056b9cb17eb' THEN 'Mascotas permitidas'
  WHEN '5c7794b8-f20b-4292-b5af-09777ed87ecd' THEN 'Seguridad 24 horas'
  WHEN '24bfb5dc-de4f-4e8d-95c6-d7415e9a2bca' THEN 'Baño de vapor'
  WHEN '73867c4b-d47c-4d0e-bb9c-40acf021906e' THEN 'Salón de belleza'
  WHEN 'bcbd35cf-d975-4ad9-805f-f6062095bbf1' THEN 'Vida nocturna'
  WHEN '7b2197f4-f49d-48e1-8c30-13567b619a15' THEN 'Actividades para niños'
  WHEN '5fe5312c-5c78-4c74-bc5f-26c8b60fdd21' THEN 'Centro de negocios'
  WHEN '8654b7f4-36f5-4a37-8b67-581b8dd33c52' THEN 'Centro de eventos'
  WHEN '30341cdc-de08-4883-a527-d2dbec113d9c' THEN 'Sala de conferencias'
  WHEN 'cb45fc82-fb73-4941-a135-5ce5db57782f' THEN 'Capilla de bodas'
  WHEN '92e777eb-cf38-410b-94bd-334b83959909' THEN 'Personal multilingüe'
  WHEN '8e7e3442-e8c4-422d-b9c6-907f60f861fd' THEN 'Servicio de tintorería'
  WHEN '422117db-3902-4a1c-98c0-51994e5ff000' THEN 'Cajero automático (ATM)'
  WHEN '4ee6e51b-c959-438b-a52b-fe9de0ba0d90' THEN 'Estacionamiento gratis'
  WHEN '6198ccb3-3aa9-42bd-9d8b-1f112eaeb448' THEN 'Estación de carga para vehículos eléctricos'
  WHEN '59c20e40-f6b8-4ff4-96a6-1bd344ab984c' THEN 'Monorriel conectado'
  WHEN 'd49a4400-2e75-472d-b06d-0c84ae0e7661' THEN 'WiFi gratis'
  WHEN 'f97db3d1-e1d7-447f-8d88-1509dd797618' THEN 'Check-in móvil'
  ELSE name
END
WHERE id IN (
  'd5c7e726-22fa-44a8-9b41-d2693a261710','8f275c72-7e26-418a-bb9c-4d514bc4405d',
  'b97e7f13-4724-48ef-8ec3-3056b9cb17eb','5c7794b8-f20b-4292-b5af-09777ed87ecd',
  '24bfb5dc-de4f-4e8d-95c6-d7415e9a2bca','73867c4b-d47c-4d0e-bb9c-40acf021906e',
  'bcbd35cf-d975-4ad9-805f-f6062095bbf1','7b2197f4-f49d-48e1-8c30-13567b619a15',
  '5fe5312c-5c78-4c74-bc5f-26c8b60fdd21','8654b7f4-36f5-4a37-8b67-581b8dd33c52',
  '30341cdc-de08-4883-a527-d2dbec113d9c','cb45fc82-fb73-4941-a135-5ce5db57782f',
  '92e777eb-cf38-410b-94bd-334b83959909','8e7e3442-e8c4-422d-b9c6-907f60f861fd',
  '422117db-3902-4a1c-98c0-51994e5ff000','4ee6e51b-c959-438b-a52b-fe9de0ba0d90',
  '6198ccb3-3aa9-42bd-9d8b-1f112eaeb448','59c20e40-f6b8-4ff4-96a6-1bd344ab984c',
  'd49a4400-2e75-472d-b06d-0c84ae0e7661','f97db3d1-e1d7-447f-8d88-1509dd797618'
);