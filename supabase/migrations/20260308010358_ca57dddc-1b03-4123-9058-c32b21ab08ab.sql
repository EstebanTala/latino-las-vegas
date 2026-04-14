-- Update taxonomy names
UPDATE taxonomy_amenities SET name = 'Servicio a la habitación' WHERE id = '110f306f-501f-435e-bd99-620cfe38f581';
UPDATE taxonomy_amenities SET name = 'Tienda de regalos' WHERE id = 'be8186c6-600f-43a8-8397-2de35ce5bb7d';
UPDATE taxonomy_amenities SET name = 'Sala de juegos' WHERE id = '777b574e-17e7-4b1c-a251-2db8cb05a121';

-- Update listings amenities arrays
UPDATE listings SET amenities = array_replace(amenities, 'Servicio a la Habitación', 'Servicio a la habitación') WHERE 'Servicio a la Habitación' = ANY(amenities);
UPDATE listings SET amenities = array_replace(amenities, 'Tienda / Gift Shop', 'Tienda de regalos') WHERE 'Tienda / Gift Shop' = ANY(amenities);
UPDATE listings SET amenities = array_replace(amenities, 'Sala de Juegos', 'Sala de juegos') WHERE 'Sala de Juegos' = ANY(amenities);